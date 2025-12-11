// backend/controllers/roomController.js
const Room = require("../models/Room");
const cloudinary = require("../config/cloudinary");

// Try to load a booking model for date-based availability.
// It’s wrapped in try/catch so if you don’t have it yet, it WON'T crash.
let Booking = null;
try {
  Booking = require("../models/RoomBooking"); // prefer RoomBooking if you have it
} catch (e) {
  try {
    Booking = require("../models/Booking"); // fallback to Booking
  } catch (e2) {
    console.warn(
      "⚠️ No RoomBooking/Booking model found. Date-based availability filtering is disabled in searchRooms."
    );
    Booking = null;
  }
}

// ---------- helpers ----------

// safely parse JSON arrays coming from the frontend
function parseArrayField(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// upload a single multer file (memory storage) to Cloudinary
function uploadFromBuffer(file, folder) {
  return new Promise((resolve, reject) => {
    if (!file || !file.buffer) {
      return reject(new Error("No file buffer provided to Cloudinary"));
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );

    stream.end(file.buffer);
  });
}

/**
 * POST /api/rooms
 * Create a new room for a host
 */
const createRoom = async (req, res) => {
  try {
    console.log("createRoom body:", req.body);
    console.log(
      "createRoom files keys:",
      req.files ? Object.keys(req.files) : "no files"
    );

    const {
      title,
      description,
      hostAbout,
      cancellationPolicy,
      hostId: bodyHostId,
      houseRules,
      safetyRules,
      highlights,
      amenities,
      notIncluded,
      pricePerNight,
      maxGuests,
      beds,
      baths,

      // NEW – location / basics (optional on create)
      city,
      country,
      headline,
      roomTypeLabel,
    } = req.body;

    const hostId = bodyHostId;

    if (!hostId) {
      return res
        .status(401)
        .json({ message: "Not authorized, host user not found (no hostId)" });
    }

    if (!title) {
      return res.status(400).json({ message: "Room title is required." });
    }

    // parse arrays
    const houseRulesArr = parseArrayField(houseRules);
    const safetyRulesArr = parseArrayField(safetyRules);
    const highlightsArr = parseArrayField(highlights);
    const amenitiesArr = parseArrayField(amenities);
    const notIncludedArr = parseArrayField(notIncluded);

    // ---------- image uploads ----------
    const coverFile =
      req.files && req.files.coverImage && req.files.coverImage[0]
        ? req.files.coverImage[0]
        : null;

    if (!coverFile) {
      return res
        .status(400)
        .json({ message: "Cover image is required (coverImage file missing)." });
    }

    // upload cover
    const coverUpload = await uploadFromBuffer(coverFile, "roostr/rooms");
    const coverImageUrl = coverUpload.secure_url;

    // upload gallery
    const galleryImageUrls = [];
    if (req.files && req.files.galleryImages && req.files.galleryImages.length) {
      for (const file of req.files.galleryImages) {
        const up = await uploadFromBuffer(file, "roostr/rooms");
        galleryImageUrls.push(up.secure_url);
      }
    }

    // ---------- create room ----------
    const room = await Room.create({
      hostId,
      title,
      description,
      hostAbout,
      houseRules: houseRulesArr,
      safetyRules: safetyRulesArr,
      cancellationPolicy,
      highlights: highlightsArr,
      amenities: amenitiesArr,
      notIncluded: notIncludedArr,
      coverImage: coverImageUrl,
      galleryImages: galleryImageUrls,

      // NEW – location / basics
      city,
      country,
      headline,
      roomTypeLabel,

      // pricing / capacity (all optional on create, can be 0)
      pricePerNight: pricePerNight ? Number(pricePerNight) : 0,
      maxGuests: maxGuests ? Number(maxGuests) : 1,
      beds: beds ? Number(beds) : 1,
      baths: baths ? Number(baths) : 1,
    });

    return res.status(201).json({
      message: "Room created successfully",
      room,
    });
  } catch (err) {
    console.error("Room creation error:", err);
    return res.status(500).json({
      message: err.message || "Server error while creating room",
    });
  }
};

/**
 * PATCH /api/rooms/:id/pricing
 * Update base price per night for a room
 */
const updateRoomPricing = async (req, res) => {
  try {
    const { id } = req.params;
    const { pricePerNight } = req.body;

    if (pricePerNight === undefined || pricePerNight === null) {
      return res
        .status(400)
        .json({ message: "pricePerNight is required in body" });
    }

    const numericPrice = Number(pricePerNight);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return res
        .status(400)
        .json({ message: "pricePerNight must be a non-negative number" });
    }

    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // basic permission check – only host who owns the room
    if (room.hostId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not allowed to update this room" });
    }

    room.pricePerNight = numericPrice;
    await room.save();

    return res.json({
      message: "Room pricing updated successfully",
      room,
    });
  } catch (err) {
    console.error("updateRoomPricing error:", err);
    return res.status(500).json({
      message: err.message || "Server error while updating pricing",
    });
  }
};

/**
 * PATCH /api/rooms/:id/basics
 * Update headline, room type label, guests, beds, baths (+ optional city/country)
 */
const updateRoomBasics = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      headline,
      roomTypeLabel,
      maxGuests,
      beds,
      baths,
      city,
      country,
    } = req.body;

    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // only the host that owns the room can update
    if (room.hostId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not allowed to update this room" });
    }

    // strings – allow empty string (user clearing the field)
    if (headline !== undefined) room.headline = headline;
    if (roomTypeLabel !== undefined) room.roomTypeLabel = roomTypeLabel;
    if (city !== undefined) room.city = city;
    if (country !== undefined) room.country = country;

    // numbers – only update if parsable
    if (maxGuests !== undefined) {
      const g = Number(maxGuests);
      if (!Number.isNaN(g) && g > 0) room.maxGuests = g;
    }

    if (beds !== undefined) {
      const b = Number(beds);
      if (!Number.isNaN(b) && b > 0) room.beds = b;
    }

    if (baths !== undefined) {
      const ba = Number(baths);
      if (!Number.isNaN(ba) && ba > 0) room.baths = ba;
    }

    await room.save();

    return res.json({
      message: "Room basics updated successfully",
      room,
    });
  } catch (err) {
    console.error("updateRoomBasics error:", err);
    return res.status(500).json({
      message: err.message || "Server error while updating room basics",
    });
  }
};

/**
 * GET /api/rooms/host/:hostId
 * Get all rooms for a specific host (used in Host Dashboard)
 */
const getHostRooms = async (req, res) => {
  try {
    const hostId = req.params.hostId || req.query.hostId;

    if (!hostId) {
      return res.status(400).json({ message: "hostId is required" });
    }

    const rooms = await Room.find({ hostId }).sort({ createdAt: -1 });

    return res.json({
      hostId,
      count: rooms.length,
      rooms,
    });
  } catch (err) {
    console.error("getHostRooms error:", err);
    return res
      .status(500)
      .json({ message: "Server error while fetching rooms" });
  }
};

/**
 * GET /api/rooms
 * Public – list all rooms (used on HomeScreen)
 */
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });
    res.json({ rooms });
  } catch (err) {
    console.error("Error fetching all rooms:", err);
    res.status(500).json({ message: "Failed to load rooms" });
  }
};

/**
 * GET /api/rooms/:id
 * Public – get single room by id (used on RoomDetails)
 */
const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json({ room });
  } catch (err) {
    console.error("Error fetching room by id:", err);
    res.status(500).json({ message: "Failed to load room details" });
  }
};

/**
 * GET /api/rooms/search
 * Public – search rooms with filters (country, guests, date availability)
 * Dates are optional; if Booking model is not present, date filter is ignored.
 */
const searchRooms = async (req, res) => {
  try {
    const { country, guests, checkIn, checkOut } = req.query;

    const query = {};

    if (country) {
      query.country = country;
    }

    if (guests) {
      const g = Number(guests);
      if (!Number.isNaN(g) && g > 0) {
        query.maxGuests = { $gte: g };
      }
    }

    let rooms = await Room.find(query).sort({ createdAt: -1 });

    // If no dates provided, just return these filtered rooms
    if (!checkIn || !checkOut) {
      return res.json({ rooms });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // If we don't have a Booking model, we can't do availability filtering yet.
    if (!Booking) {
      return res.json({ rooms });
    }

    const roomIds = rooms.map((r) => r._id);
    if (!roomIds.length) {
      return res.json({ rooms: [] });
    }

    // Find bookings that overlap the desired range
    const overlapping = await Booking.find({
      roomId: { $in: roomIds },
      status: { $nin: ["cancelled", "Cancelled"] },
      checkIn: { $lt: end },
      checkOut: { $gt: start },
    }).select("roomId");

    const bookedRoomIds = new Set(
      overlapping.map((b) => String(b.roomId))
    );

    const availableRooms = rooms.filter(
      (room) => !bookedRoomIds.has(String(room._id))
    );

    return res.json({ rooms: availableRooms });
  } catch (err) {
    console.error("searchRooms error:", err);
    return res.status(500).json({
      message: err.message || "Server error while searching rooms",
    });
  }
};

module.exports = {
  createRoom,
  getHostRooms,
  getRoomsByHost: getHostRooms,
  getAllRooms,
  getRoomById,
  updateRoomPricing,
  updateRoomBasics,
  searchRooms, // 👈 NEW export
};
