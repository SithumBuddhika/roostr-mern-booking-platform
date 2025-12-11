// backend/models/RoomMeta.js
const mongoose = require("mongoose");

const RoomMetaSchema = new mongoose.Schema(
  {
    // the room this meta belongs to
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      unique: true,
    },

    // optional: host owning this room
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // "Entire rental unit in Batroun, Lebanon"
    headline: {
      type: String,
      trim: true,
    },

    // "Studio" / "Apartment" etc
    roomTypeLabel: {
      type: String,
      trim: true,
    },

    // numbers for snippet
    maxGuests: {
      type: Number,
      default: 1,
      min: 1,
    },
    beds: {
      type: Number,
      default: 1,
      min: 0,
    },
    baths: {
      type: Number,
      default: 1,
      min: 0,
    },

    // OPTIONAL – if you want to override city / country for the snippet
    propertyType: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RoomMeta", RoomMetaSchema);
