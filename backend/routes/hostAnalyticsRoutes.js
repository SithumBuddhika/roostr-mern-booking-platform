// backend/routes/hostAnalyticsRoutes.js
const express = require("express");
const router = express.Router();

const { getHostOverview } = require("../controllers/hostAnalyticsController");
const { protect } = require("../middleware/authMiddleware");

// GET /api/host-analytics/:hostId/overview
router.get("/:hostId/overview", protect, getHostOverview);

module.exports = router;
