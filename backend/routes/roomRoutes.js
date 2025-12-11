// backend/routes/roomRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  createRoom,
  getHostRooms,
  getAllRooms,
  getRoomById,
  updateRoomPricing,
  updateRoomBasics,
  searchRooms, // 👈 NEW import
} = require("../controllers/roomController");
const { protect } = require("../middleware/authMiddleware");

// Use memory storage for Cloudinary upload_stream
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ----------------- ROUTES -----------------

// Create room (host only – AddNewRoom.jsx uses this, multipart/form-data)
router.post(
  "/",
  protect,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
  ]),
  createRoom
);

// 🔹 Update room basics (headline, label, guests, beds, baths, city, country)
router.patch("/:id/basics", protect, updateRoomBasics);

// 🔹 Update base price for a room
router.patch("/:id/pricing", protect, updateRoomPricing);

// Host rooms list (host dashboard)
router.get("/host/:hostId", protect, getHostRooms);

// 🔹 Search rooms (public) – MUST be before "/:id"
router.get("/search", searchRooms);

// PUBLIC endpoints for customers
router.get("/", getAllRooms);
router.get("/:id", getRoomById);

module.exports = router;
