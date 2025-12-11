// // backend/models/Booking.js
// const mongoose = require("mongoose");

// const guestSchema = new mongoose.Schema(
//   {
//     adults: { type: Number, default: 1 },
//     children: { type: Number, default: 0 },
//     infants: { type: Number, default: 0 },
//     pets: { type: Number, default: 0 },
//   },
//   { _id: false }
// );

// const bookingSchema = new mongoose.Schema(
//   {
//     roomId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Room",
//       required: true,
//     },

//     // later when you add auth, you can store user id here
//     guestId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: false,
//     },

//     checkIn: { type: Date, required: true },
//     checkOut: { type: Date, required: true },

//     totalNights: { type: Number, required: true },
//     pricePerNight: { type: Number, required: true },
//     totalPrice: { type: Number, required: true },

//     guests: { type: guestSchema, required: true },
//     guestSummary: { type: String },

//     status: {
//       type: String,
//       enum: ["pending", "confirmed", "cancelled"],
//       default: "confirmed",
//     },

//     // optional, you can fill this from frontend PaymentPage
//     reservationCode: { type: String },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Booking", bookingSchema);


// backend/models/Booking.js
const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema(
  {
    adults: { type: Number, default: 1 },
    children: { type: Number, default: 0 },
    infants: { type: Number, default: 0 },
    pets: { type: Number, default: 0 },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    // NEW: hostId so we can calculate host dashboard stats later
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    // later when you add auth, you can store user id here
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },

    totalNights: { type: Number, required: true },
    pricePerNight: { type: Number, required: true },
    totalPrice: { type: Number, required: true },

    guests: { type: guestSchema, required: true },
    guestSummary: { type: String },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "confirmed",
    },

    // optional, you can fill this from frontend PaymentPage
    reservationCode: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
