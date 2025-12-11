// backend/routes/searchRoutes.js
const express = require("express");
const router = express.Router();

const { searchAvailableRooms } = require("../controllers/searchController");

// GET /api/search/available-rooms?country=...&checkIn=...&checkOut=...&totalGuests=...
router.get("/available-rooms", searchAvailableRooms);

module.exports = router;
