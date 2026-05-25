const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Review = require("../models/Review");
const Room = require("../models/Room");

// 1. Submit a new review
router.post("/", protect, async (req, res) => {
  try {
    const { roomId, rating, comment } = req.body;

    if (!roomId || !rating || !comment) {
      return res.status(400).json({ message: "Please provide roomId, rating, and comment." });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }

    const review = await Review.create({
      roomId,
      userId: req.user._id,
      hostId: room.hostId,
      rating: Number(rating),
      comment,
    });

    // Update Room aggregate rating and reviewCount
    const reviews = await Review.find({ roomId });
    const count = reviews.length;
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = count > 0 ? (totalRating / count).toFixed(1) : 0.0;

    room.reviewCount = count;
    room.rating = Number(avgRating);
    await room.save();

    res.status(201).json({ message: "Review submitted successfully", review });
  } catch (err) {
    console.error("Error creating review:", err);
    res.status(500).json({ message: "Server error creating review." });
  }
});

// 2. Get all reviews for a room
router.get("/room/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    const reviews = await Review.find({ roomId })
      .populate("userId", "name email country avatar")
      .sort({ createdAt: -1 });

    res.json({ reviews });
  } catch (err) {
    console.error("Error fetching room reviews:", err);
    res.status(500).json({ message: "Server error fetching reviews." });
  }
});

// 3. Get all reviews for a host's rooms
router.get("/host/:hostId", protect, async (req, res) => {
  try {
    const { hostId } = req.params;

    // Verify requesting user is the host
    if (req.user._id.toString() !== hostId) {
      return res.status(403).json({ message: "Not authorized to access these reviews." });
    }

    const reviews = await Review.find({ hostId })
      .populate("userId", "name email country avatar")
      .populate("roomId", "title coverImage")
      .sort({ createdAt: -1 });

    res.json({ reviews });
  } catch (err) {
    console.error("Error fetching host reviews:", err);
    res.status(500).json({ message: "Server error fetching reviews." });
  }
});

// 4. Submit host reply to a review
router.put("/:reviewId/reply", protect, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reply } = req.body;

    if (!reply || reply.trim() === "") {
      return res.status(400).json({ message: "Reply cannot be empty." });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    // Verify requesting user is the host of this review
    if (review.hostId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to reply to this review." });
    }

    review.reply = reply;
    review.replyCreatedAt = new Date();
    await review.save();

    res.json({ message: "Reply submitted successfully", review });
  } catch (err) {
    console.error("Error replying to review:", err);
    res.status(500).json({ message: "Server error replying to review." });
  }
});

module.exports = router;
