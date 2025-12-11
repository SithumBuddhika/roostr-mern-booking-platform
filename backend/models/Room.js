// // backend/models/Room.js
// const mongoose = require("mongoose");

// const roomSchema = new mongoose.Schema(
//   {
//     hostId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     title: { type: String, required: true },
//     description: { type: String, default: "" },
//     hostAbout: { type: String, default: "" },
//     houseRules: { type: [String], default: [] },
//     safetyRules: { type: [String], default: [] },
//     cancellationPolicy: { type: String, default: "" },
//     highlights: { type: [String], default: [] },
//     amenities: { type: [String], default: [] },
//     notIncluded: { type: [String], default: [] },

//     // images
//     coverImage: { type: String, required: true },
//     galleryImages: { type: [String], default: [] },

//     // 🔹 pricing / capacity (used in Manage listing)
//     pricePerNight: {
//       type: Number,
//       default: 0, // can be edited from Host dashboard
//     },
//     maxGuests: { type: Number, default: 1 },
//     beds: { type: Number, default: 1 },
//     baths: { type: Number, default: 1 },

//     // 🔹 rating placeholders (so UI text doesn’t break)
//     rating: { type: Number, default: 5.0 },
//     reviewCount: { type: Number, default: 0 },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Room", roomSchema);


// backend/models/Room.js
const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Main listing title (top of page)
    title: { type: String, required: true },

    // Big description text
    description: { type: String, default: "" },

    // Host “about” text
    hostAbout: { type: String, default: "" },

    houseRules: { type: [String], default: [] },
    safetyRules: { type: [String], default: [] },
    cancellationPolicy: { type: String, default: "" },

    highlights: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    notIncluded: { type: [String], default: [] },

    // Images
    coverImage: { type: String, required: true },
    galleryImages: { type: [String], default: [] },

    // 💲 Pricing / capacity
    pricePerNight: { type: Number, default: 0 },
    maxGuests: { type: Number, default: 1 },
    beds: { type: Number, default: 1 },
    baths: { type: Number, default: 1 },

    rating: { type: Number, default: 5 },
    reviewCount: { type: Number, default: 0 },

    // 🌟 NEW: what we edit in “Room basics”
    // shown under the photos on RoomDetails
    headline: { type: String, default: "" },

    // the “Studio, Apartment, Private room” label
    roomTypeLabel: { type: String, default: "" },

    // optional location fields if you ever want to fill them later
    city: { type: String, default: "" },
    country: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
