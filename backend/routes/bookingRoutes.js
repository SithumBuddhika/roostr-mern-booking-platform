// const express = require("express");
// const router = express.Router();

// const {
//   createBooking,
//   getAllBookings,
//   getBookingById,
//   getBookingsForHost,
//   getBookingsForRoom,
//   cancelBooking,
// } = require("../controllers/bookingController");

// router.post("/", createBooking);
// router.get("/", getAllBookings);
// router.get("/host/:hostId", getBookingsForHost);
// router.get("/room/:roomId", getBookingsForRoom);
// router.get("/:id", getBookingById);
// router.put("/:id/cancel", cancelBooking);

// module.exports = router;



// // backend/routes/bookingRoutes.js
// const express = require("express");
// const router = express.Router();

// const {
//   createBooking,
//   getBookingsByRoom,
//   getAllBookings,
//   cancelBooking,
// } = require("../controllers/bookingController");

// // Create booking (PaymentPage)
// router.post("/", createBooking);

// // All bookings (Profile, host dashboard)
// router.get("/", getAllBookings);

// // Bookings for a specific room (availability calendar)
// router.get("/room/:roomId", getBookingsByRoom);

// // Cancel a booking
// router.patch("/:id/cancel", cancelBooking);

// module.exports = router;

// // backend/routes/bookingRoutes.js
// const express = require("express");
// const router = express.Router();

// const {
//   createBooking,
//   getBookingsByRoom,
//   getBookingsByUser,
//   getAllBookings,
//   cancelBooking,
// } = require("../controllers/bookingController");

// // NOTE: if you already use auth middleware elsewhere and
// // want to protect some of these routes, you can do:
// // const { protect } = require("../middleware/authMiddleware");
// // and then e.g. router.post("/", protect, createBooking);

// // Create booking (PaymentPage)
// router.post("/", createBooking);

// // All bookings (admin / host analytics)
// router.get("/", getAllBookings);

// // Bookings for a specific room (availability calendar)
// router.get("/room/:roomId", getBookingsByRoom);

// // Bookings for a specific guest (Profile → Past Trips)
// router.get("/user/:userId", getBookingsByUser);

// // Cancel a booking
// router.patch("/:id/cancel", cancelBooking);

// module.exports = router;



// // backend/routes/bookingRoutes.js
// const express = require("express");
// const router = express.Router();

// const {
//   createBooking,
//   getBookingsByRoom,
//   getAllBookings,
//   getBookingsByGuest,
//   cancelBooking,
// } = require("../controllers/bookingController");

// // Create booking (PaymentPage)
// router.post("/", createBooking);

// // All bookings (admin / analytics – optional)
// router.get("/", getAllBookings);

// // Bookings for a specific room (availability calendar)
// router.get("/room/:roomId", getBookingsByRoom);

// // NEW – bookings for a specific guest (Profile → Past Trips)
// router.get("/guest/:guestId", getBookingsByGuest);

// // Cancel a booking
// router.patch("/:id/cancel", cancelBooking);

// module.exports = router;

// backend/routes/bookingRoutes.js
const express = require("express");
const router = express.Router();

const {
  createBooking,
  getBookingsByRoom,
  getAllBookings,
  cancelBooking,
} = require("../controllers/bookingController");

// Create booking (PaymentPage)
router.post("/", createBooking);

// All bookings (Profile, host dashboard) – supports optional ?guestId=
router.get("/", getAllBookings);

// Bookings for a specific room (availability calendar)
router.get("/room/:roomId", getBookingsByRoom);

// Cancel a booking
router.patch("/:id/cancel", cancelBooking);

module.exports = router;
