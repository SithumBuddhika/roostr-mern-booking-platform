// backend/controllers/hostAnalyticsController.js
const mongoose = require("mongoose");
const Room = require("../models/Room");
const Booking = require("../models/Booking");

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function nightsInRange(booking, rangeStart, rangeEnd) {
  if (!booking.checkIn || !booking.checkOut) return 0;

  const start = new Date(booking.checkIn);
  const end = new Date(booking.checkOut);

  const effectiveStart = start < rangeStart ? rangeStart : start;
  const effectiveEnd = end > rangeEnd ? rangeEnd : end;

  const diffMs = effectiveEnd - effectiveStart;
  const nights = diffMs / (1000 * 60 * 60 * 24);

  return nights > 0 ? nights : 0;
}

/**
 * GET /api/host-analytics/:hostId/overview
 * Returns dashboard stats for a host:
 * - totalRevenue, totalBookings, avgNightlyRate, occupancy, etc.
 * - monthlyRevenue (for bar chart)
 * - communication + responseHistory (for line chart)
 * - today stats (check-ins / check-outs / trips / pending reviews)
 * - per-listing summary
 */
const getHostOverview = async (req, res) => {
  try {
    const { hostId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(hostId)) {
      return res.status(400).json({ message: "Invalid hostId" });
    }

    // 1. All rooms for this host
    const rooms = await Room.find({ hostId });
    const roomIds = rooms.map((r) => r._id);

    if (roomIds.length === 0) {
      return res.json({
        hostId,
        totalRevenue: 0,
        totalBookings: 0,
        activeProperties: 0,
        avgNightlyRate: 0,
        occupancyRate: 0,
        occupancyChange: 0,
        bookingConversionRate: 0,
        bookingsThisPeriod: 0,
        monthlyRevenue: [],
        communication: {
          responseRate: 0,
          inquiries: 0,
          acceptedInquiries: 0,
          avgFirstReplyTimeMinutes: null,
          openTickets: 0,
          responseHistory: [],
        },
        today: {
          checkIns: 0,
          checkOuts: 0,
          tripsInProgress: 0,
          pendingReviews: 0,
        },
        listings: [],
      });
    }

    // 2. All bookings for those rooms
    const allBookings = await Booking.find({ roomId: { $in: roomIds } });
    const confirmedBookings = allBookings.filter(
      (b) => b.status === "confirmed"
    );

    // ---- BASIC TOTALS ----
    const totalRevenue = confirmedBookings.reduce(
      (sum, b) => sum + (b.totalPrice || 0),
      0
    );
    const totalBookings = confirmedBookings.length;
    const totalNights = confirmedBookings.reduce(
      (sum, b) => sum + (b.totalNights || 0),
      0
    );
    const avgNightlyRate = totalNights ? totalRevenue / totalNights : 0;

    const activeProperties = rooms.length;

    // booking conversion = confirmed / (all bookings of any status)
    const totalRequests = allBookings.length;
    const bookingConversionRate = totalRequests
      ? Math.round((confirmedBookings.length / totalRequests) * 100)
      : 0;

    // ---- OCCUPANCY (last 30 days vs previous 30) ----
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const last30Start = new Date(startOfToday);
    last30Start.setDate(startOfToday.getDate() - 29);

    const prev30Start = new Date(startOfToday);
    prev30Start.setDate(startOfToday.getDate() - 59);
    const prev30End = new Date(startOfToday);
    prev30End.setDate(startOfToday.getDate() - 30);

    const currentNightsBooked = confirmedBookings.reduce(
      (sum, b) => sum + nightsInRange(b, last30Start, endOfToday),
      0
    );
    const prevNightsBooked = confirmedBookings.reduce(
      (sum, b) => sum + nightsInRange(b, prev30Start, prev30End),
      0
    );

    const capacityPerPeriod = activeProperties * 30;
    const occupancyRate = capacityPerPeriod
      ? (currentNightsBooked / capacityPerPeriod) * 100
      : 0;
    const prevOccupancy = capacityPerPeriod
      ? (prevNightsBooked / capacityPerPeriod) * 100
      : 0;
    const occupancyChange = occupancyRate - prevOccupancy;

    // ---- MONTHLY REVENUE + RESPONSE HISTORY (last 6 months) ----
    const monthlyRevenue = [];
    const responseHistory = [];

    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(
        startOfToday.getFullYear(),
        startOfToday.getMonth() - i,
        1
      );
      const monthStart = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth(),
        1
      );
      const monthEnd = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        1
      );
      const label = monthNames[monthDate.getMonth()];

      const monthBookings = allBookings.filter((b) => {
        const created = new Date(b.createdAt);
        return created >= monthStart && created < monthEnd;
      });

      const monthConfirmed = monthBookings.filter(
        (b) => b.status === "confirmed"
      );
      const revenue = monthConfirmed.reduce(
        (sum, b) => sum + (b.totalPrice || 0),
        0
      );
      monthlyRevenue.push({ label, amount: revenue });

      const monthTotal = monthBookings.length;
      const rate = monthTotal
        ? (monthConfirmed.length / monthTotal) * 100
        : 0;
      responseHistory.push({ label, rate });
    }

    // bookings this period = confirmed bookings created this month
    const currentMonthStart = new Date(
      startOfToday.getFullYear(),
      startOfToday.getMonth(),
      1
    );
    const nextMonthStart = new Date(
      startOfToday.getFullYear(),
      startOfToday.getMonth() + 1,
      1
    );

    const bookingsThisPeriod = confirmedBookings.filter((b) => {
      const created = new Date(b.createdAt);
      return created >= currentMonthStart && created < nextMonthStart;
    }).length;

    // ---- "GUEST COMMUNICATION" PROXIES (based on booking statuses) ----
    const last30Bookings = allBookings.filter(
      (b) => b.createdAt >= last30Start
    );
    const inquiries = last30Bookings.length; // treat every booking as an inquiry
    const acceptedInquiries = last30Bookings.filter(
      (b) => b.status === "confirmed"
    ).length;
    const responseRate = inquiries
      ? (acceptedInquiries / inquiries) * 100
      : 0;
    const openTickets = allBookings.filter(
      (b) => b.status === "pending"
    ).length;

    // we don't have real reply-time data in the schema yet
    const avgFirstReplyTimeMinutes = null;

    // ---- TODAY STATS ----
    const checkIns = confirmedBookings.filter(
      (b) => b.checkIn >= startOfToday && b.checkIn < endOfToday
    ).length;

    const checkOuts = confirmedBookings.filter(
      (b) => b.checkOut >= startOfToday && b.checkOut < endOfToday
    ).length;

    const tripsInProgress = confirmedBookings.filter(
      (b) => b.checkIn <= startOfToday && b.checkOut > startOfToday
    ).length;

    // simple: all past stays are "pending reviews"
    const pendingReviews = confirmedBookings.filter(
      (b) => b.checkOut < startOfToday
    ).length;

    // ---- PER-LISTING SUMMARY ----
    const listings = rooms.map((room) => {
      const roomBookings = confirmedBookings.filter(
        (b) => b.roomId.toString() === room._id.toString()
      );
      const roomRevenue = roomBookings.reduce(
        (sum, b) => sum + (b.totalPrice || 0),
        0
      );
      const roomNights = roomBookings.reduce(
        (sum, b) => sum + (b.totalNights || 0),
        0
      );
      const roomOccupancy = roomNights
        ? Math.min(100, (roomNights / 365) * 100) // rough yearly occupancy
        : 0;

      return {
        roomId: room._id,
        title: room.title,
        createdAt: room.createdAt,
        bookings: roomBookings.length,
        estimatedRevenue: roomRevenue,
        occupancyRate: roomOccupancy,
        rating: 5.0, // placeholder until you add real ratings
      };
    });

    return res.json({
      hostId,
      totalRevenue,
      totalBookings,
      activeProperties,
      avgNightlyRate,
      occupancyRate,
      occupancyChange,
      bookingConversionRate,
      bookingsThisPeriod,
      monthlyRevenue,
      communication: {
        responseRate,
        inquiries,
        acceptedInquiries,
        avgFirstReplyTimeMinutes,
        openTickets,
        responseHistory,
      },
      today: {
        checkIns,
        checkOuts,
        tripsInProgress,
        pendingReviews,
      },
      listings,
    });
  } catch (err) {
    console.error("getHostOverview error:", err);
    return res.status(500).json({
      message: "Server error while building host overview",
    });
  }
};

module.exports = { getHostOverview };
