// backend/server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const bookingRoutes = require("./routes/bookingRoutes");
const roomMetaRoutes = require("./routes/roomMetaRoutes");
const searchRoutes = require("./routes/searchRoutes");

dotenv.config();

// connect DB
connectDB();

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// routes
app.get("/", (req, res) => {
  res.send("Roostr API running");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/bookings", bookingRoutes);
app.use("/api/room-meta", roomMetaRoutes);
app.use("/api/search", searchRoutes);


// ⭐ NEW: host analytics for dashboard
app.use("/api/host-analytics", require("./routes/hostAnalyticsRoutes"));

// (optional) old local upload folder
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
