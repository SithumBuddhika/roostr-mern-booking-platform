// backend/controllers/bookingController.js
const Booking = require("../models/Booking");

// helper: difference in days between two dates
function daysBetween(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  const diffMs = e.getTime() - s.getTime();
  return Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
}

/**
 * POST /api/bookings
 * Create a booking (used by PaymentPage)
 */
const createBooking = async (req, res) => {
  try {
    const {
      roomId,
      checkIn,
      checkOut,
      totalNights,
      pricePerNight,
      totalPrice,
      guests,
      guestSummary,
      status,
      reservationCode,

      // NEW – optional guestId coming from frontend
      guestId,
    } = req.body;

    if (!roomId || !checkIn || !checkOut) {
      return res
        .status(400)
        .json({ message: "roomId, checkIn and checkOut are required" });
    }

    const nights =
      totalNights && Number(totalNights) > 0
        ? Number(totalNights)
        : daysBetween(checkIn, checkOut);

    const booking = await Booking.create({
      roomId,

      // ✅ backwards-compatible:
      // 1) if you add auth later -> req.user._id
      // 2) if PaymentPage sends guestId -> use that
      // 3) otherwise keep null (same as before)
      guestId: req.user ? req.user._id : guestId || null,

      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      totalNights: nights,
      pricePerNight: Number(pricePerNight || 0),
      totalPrice: Number(totalPrice || 0),
      guests: guests || undefined,
      guestSummary,
      status: status || "confirmed",
      reservationCode,
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (err) {
    console.error("createBooking error:", err);
    res.status(500).json({
      message: err.message || "Server error while creating booking",
    });
  }
};

/**
 * GET /api/bookings/room/:roomId
 * All bookings for a specific room (used to build availability calendar)
 */
const getBookingsByRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      return res.status(400).json({ message: "roomId is required" });
    }

    // ignore cancelled bookings
    const bookings = await Booking.find({
      roomId,
      status: { $ne: "cancelled" },
    }).sort({ checkIn: 1 });

    res.json({ bookings });
  } catch (err) {
    console.error("getBookingsByRoom error:", err);
    res.status(500).json({
      message: err.message || "Server error while fetching bookings",
    });
  }
};

/**
 * GET /api/bookings
 *
 * - Guest view (Profile → Past Trips):
 *     /api/bookings?guestId=<userId>
 *     → returns ONLY bookings for that guest.
 *
 * - Host / admin view:
 *     /api/bookings
 *     → returns ALL bookings.
 */
const getAllBookings = async (req, res) => {
  try {
    const { guestId } = req.query;

    let filter = {};

    if (guestId) {
      // STRICT: only bookings for this guest
      filter = { guestId };
    }

    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .populate("roomId");

    res.json({ bookings });
  } catch (err) {
    console.error("getAllBookings error:", err);
    res.status(500).json({
      message: err.message || "Server error while fetching bookings",
    });
  }
};

/**
 * PATCH /api/bookings/:id/cancel
 * Mark a booking as cancelled (used by Profile → Cancel Booking)
 */
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Booking id is required" });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: "cancelled" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking cancelled successfully", booking });
  } catch (err) {
    console.error("cancelBooking error:", err);
    res.status(500).json({
      message: err.message || "Server error while cancelling booking",
    });
  }
};

module.exports = {
  createBooking,
  getBookingsByRoom,
  getAllBookings,
  cancelBooking,
};
