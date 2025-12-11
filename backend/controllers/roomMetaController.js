// // backend/controllers/roomMetaController.js
// const RoomMeta = require("../models/RoomMeta");

// // GET /api/room-meta/:roomId
// // public – RoomDetails can call this. If not found -> 404.
// exports.getRoomMeta = async (req, res) => {
//   try {
//     const { roomId } = req.params;
//     const meta = await RoomMeta.findOne({ room: roomId });

//     if (!meta) {
//       return res.status(404).json({ message: "Room meta not found" });
//     }

//     res.json({ meta });
//   } catch (err) {
//     console.error("getRoomMeta error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // PUT /api/room-meta/:roomId
// // protected – host (or logged-in user) can create / update meta for a room
// exports.upsertRoomMeta = async (req, res) => {
//   try {
//     const { roomId } = req.params;

//     // authMiddleware usually puts either userId or id
//     const userId = req.user?.userId || req.user?.id;

//     const body = req.body || {};

//     const updates = {};
//     const fields = [
//       "headline",
//       "roomTypeLabel",
//       "maxGuests",
//       "beds",
//       "baths",
//       "propertyType",
//       "city",
//       "country",
//     ];

//     fields.forEach((field) => {
//       if (body[field] !== undefined) {
//         updates[field] = body[field];
//       }
//     });

//     const meta = await RoomMeta.findOneAndUpdate(
//       { room: roomId },
//       {
//         $set: {
//           ...updates,
//           host: userId || undefined,
//         },
//       },
//       {
//         new: true,
//         upsert: true,
//         setDefaultsOnInsert: true,
//       }
//     );

//     res.json({ meta });
//   } catch (err) {
//     console.error("upsertRoomMeta error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// backend/controllers/roomController.js
const Room = require("../models/Room");
const cloudinary = require("../config/cloudinary");

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

      // pricing / capacity
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
 * Update headline, roomTypeLabel, guests, beds, baths
 * (used by Manage listing → Room basics)
 */
const updateRoomBasics = async (req, res) => {
  try {
    const { id } = req.params;

    // support both "headline" and older "locationHeadline" key names
    const {
      headline,
      locationHeadline,
      roomTypeLabel,
      maxGuests,
      beds,
      baths,
    } = req.body;

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // only the owner host can update
    if (room.hostId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not allowed to update this room" });
    }

    // text fields
    const headlineValue =
      headline !== undefined ? headline : locationHeadline; // alias
    if (headlineValue !== undefined) {
      room.headline = headlineValue;
    }

    if (roomTypeLabel !== undefined) {
      room.roomTypeLabel = roomTypeLabel;
    }

    // numeric fields
    const parsedMaxGuests = maxGuests !== undefined ? Number(maxGuests) : null;
    if (parsedMaxGuests && !Number.isNaN(parsedMaxGuests) && parsedMaxGuests > 0) {
      room.maxGuests = parsedMaxGuests;
    }

    const parsedBeds = beds !== undefined ? Number(beds) : null;
    if (parsedBeds && !Number.isNaN(parsedBeds) && parsedBeds > 0) {
      room.beds = parsedBeds;
    }

    const parsedBaths = baths !== undefined ? Number(baths) : null;
    if (parsedBaths && !Number.isNaN(parsedBaths) && parsedBaths > 0) {
      room.baths = parsedBaths;
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

module.exports = {
  createRoom,
  getHostRooms,
  getRoomsByHost: getHostRooms,
  getAllRooms,
  getRoomById,
  updateRoomPricing,
  updateRoomBasics, // 🔹 export new controller
};
