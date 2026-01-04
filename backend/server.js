// // backend/server.js
// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const connectDB = require("./config/db");
// const bookingRoutes = require("./routes/bookingRoutes");
// const roomMetaRoutes = require("./routes/roomMetaRoutes");
// const searchRoutes = require("./routes/searchRoutes");

// dotenv.config();

// // connect DB
// connectDB();

// const app = express();

// // middleware
// app.use(express.json());
// app.use(cookieParser());

// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN || "http://localhost:3000",
//     credentials: true,
//   })
// );

// // routes
// app.get("/", (req, res) => {
//   res.send("Roostr API running");
// });

// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/rooms", require("./routes/roomRoutes"));
// app.use("/api/bookings", bookingRoutes);
// app.use("/api/room-meta", roomMetaRoutes);
// app.use("/api/search", searchRoutes);


// // ⭐ NEW: host analytics for dashboard
// app.use("/api/host-analytics", require("./routes/hostAnalyticsRoutes"));

// // (optional) old local upload folder
// app.use("/uploads", express.static("uploads"));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Backend server running on port ${PORT}`);
// });


// backend/server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const connectDB = require("./config/db");

const bookingRoutes = require("./routes/bookingRoutes");
const roomMetaRoutes = require("./routes/roomMetaRoutes");
const searchRoutes = require("./routes/searchRoutes");

dotenv.config();

// Connect DB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

/**
 * ✅ CORS (supports multiple origins)
 * Set CORS_ORIGIN in Render like:
 * CORS_ORIGIN=http://localhost:3000,https://your-frontend.vercel.app
 */
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman / server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("Roostr API running");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/bookings", bookingRoutes);
app.use("/api/room-meta", roomMetaRoutes);
app.use("/api/search", searchRoutes);

// Host analytics for dashboard
app.use("/api/host-analytics", require("./routes/hostAnalyticsRoutes"));

// Static uploads (only if you still use local uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Optional: basic error handler (helps Render logs show real reason)
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.message);
  res.status(500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log("Allowed CORS origins:", allowedOrigins);
});
