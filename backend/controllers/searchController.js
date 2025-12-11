// backend/controllers/searchController.js
const Room = require("../models/Room");
const Booking = require("../models/Booking");

/**
 * GET /api/search/available-rooms
 *
 * Query params:
 *  - country (optional)
 *  - checkIn (optional ISO string)
 *  - checkOut (optional ISO string)
 *  - totalGuests (optional number)
 *
 * If checkIn + checkOut are provided:
 *   -> filters out rooms that have any overlapping booking (status != 'cancelled')
 * If dates are missing:
 *   -> only filters by country + capacity (if set on the room)
 */
exports.searchAvailableRooms = async (req, res) => {
  try {
    const { country, checkIn, checkOut, totalGuests } = req.query;

    // 1) Base ROOM filter (by country only)
    const roomFilter = {};
    if (country && country.trim()) {
      roomFilter.country = country.trim();
    }

    let rooms = await Room.find(roomFilter);

    // 2) Filter by capacity (if your Room has maxGuests / capacity etc.)
    const guestsNum = parseInt(totalGuests, 10) || 0;
    if (guestsNum > 0) {
      rooms = rooms.filter((room) => {
        const maxGuests =
          room.maxGuests ||
          room.capacity ||
          room.guestCapacity ||
          room.guests ||
          0;

        // if room has no capacity set, don't block it
        if (!maxGuests) return true;

        return Number(maxGuests) >= guestsNum;
      });
    }

    // If no dates, stop here – this is still a valid search (by country / guests)
    if (!checkIn || !checkOut) {
      return res.json({ rooms });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (
      Number.isNaN(checkInDate.getTime()) ||
      Number.isNaN(checkOutDate.getTime()) ||
      checkInDate >= checkOutDate
    ) {
      // invalid dates: just return country/capacity-filtered rooms
      return res.json({ rooms });
    }

    // If we have no rooms after country/capacity filter, short-circuit
    if (!rooms.length) {
      return res.json({ rooms: [] });
    }

    const roomIds = rooms.map((r) => r._id);

    // 3) Find conflicting bookings for these rooms in the given range
    // overlap condition: booking.checkIn < searchCheckOut AND booking.checkOut > searchCheckIn
    const conflictingBookings = await Booking.find({
      roomId: { $in: roomIds },
      status: { $ne: "cancelled" },
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    }).select("roomId");

    const unavailableIds = new Set(
      conflictingBookings.map((b) => String(b.roomId))
    );

    const availableRooms = rooms.filter(
      (r) => !unavailableIds.has(String(r._id))
    );

    return res.json({ rooms: availableRooms });
  } catch (err) {
    console.error("searchAvailableRooms error:", err);
    return res
      .status(500)
      .json({ message: "Server error while searching available rooms" });
  }
};
