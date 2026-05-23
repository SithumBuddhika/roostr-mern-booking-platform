const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    reply: {
      type: String,
      default: "",
    },
    replyCreatedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
