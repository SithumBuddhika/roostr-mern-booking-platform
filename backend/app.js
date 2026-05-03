// // backend/app.js
// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const path = require("path");

// const connectDB = require("./config/db");

// const bookingRoutes = require("./routes/bookingRoutes");
// const roomMetaRoutes = require("./routes/roomMetaRoutes");
// const searchRoutes = require("./routes/searchRoutes");

// dotenv.config();

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cookieParser());

// // ✅ Serverless-safe DB connect (connect once, reuse)
// let dbReady = false;
// app.use(async (req, res, next) => {
//   try {
//     if (!dbReady) {
//       await connectDB();
//       dbReady = true;
//     }
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// // ✅ CORS (safe default; same-domain on Vercel won’t need it)
// const allowedOrigins = (process.env.CORS_ORIGIN || "")
//   .split(",")
//   .map((o) => o.trim())
//   .filter(Boolean);

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.length === 0) return callback(null, true);
//       if (allowedOrigins.includes(origin)) return callback(null, true);
//       return callback(new Error(`Not allowed by CORS: ${origin}`));
//     },
//     credentials: true,
//   })
// );

// // Routes
// app.get("/", (req, res) => res.send("Roostr API running"));

// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/rooms", require("./routes/roomRoutes"));
// app.use("/api/bookings", bookingRoutes);
// app.use("/api/room-meta", roomMetaRoutes);
// app.use("/api/search", searchRoutes);
// app.use("/api/host-analytics", require("./routes/hostAnalyticsRoutes"));

// // Static uploads (won’t persist on Vercel serverless; OK to keep)
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Error handler
// app.use((err, req, res, next) => {
//   console.error("API ERROR:", err);
//   res.status(500).json({ message: err.message || "Server error" });
// });

// module.exports = app;



// // backend/app.js
// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const path = require("path");

// const connectDB = require("./config/db");

// const bookingRoutes = require("./routes/bookingRoutes");
// const roomMetaRoutes = require("./routes/roomMetaRoutes");
// const searchRoutes = require("./routes/searchRoutes");

// dotenv.config();

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cookieParser());

// // ✅ Serverless-safe DB connect (connect once, reuse)
// let dbReady = false;
// app.use(async (req, res, next) => {
//   try {
//     if (!dbReady) {
//       await connectDB();
//       dbReady = true;
//       console.log("✅ DB connected (first request)");
//     }
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// /**
//  * ✅ CORS
//  * Set backend/.env:
//  * CORS_ORIGIN=http://localhost:3000,https://your-frontend.vercel.app
//  *
//  * We normalize origins to avoid trailing slash mismatches.
//  */
// const normalizeOrigin = (o) => (o ? o.trim().replace(/\/$/, "") : o);

// const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
//   .split(",")
//   .map(normalizeOrigin)
//   .filter(Boolean);

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Allow requests with no origin (Postman, server-to-server)
//       if (!origin) return callback(null, true);

//       const cleanOrigin = normalizeOrigin(origin);

//       // If allowedOrigins is empty, allow all (safe fallback)
//       if (!allowedOrigins || allowedOrigins.length === 0) {
//         return callback(null, true);
//       }

//       if (allowedOrigins.includes(cleanOrigin)) {
//         return callback(null, true);
//       }

//       return callback(new Error(`Not allowed by CORS: ${origin}`));
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// // Routes
// app.get("/", (req, res) => res.send("Roostr API running"));

// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/rooms", require("./routes/roomRoutes"));
// app.use("/api/bookings", bookingRoutes);
// app.use("/api/room-meta", roomMetaRoutes);
// app.use("/api/search", searchRoutes);
// app.use("/api/host-analytics", require("./routes/hostAnalyticsRoutes"));

// // Static uploads (won’t persist on Vercel serverless; OK to keep)
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Error handler
// app.use((err, req, res, next) => {
//   console.error("API ERROR:", err.message || err);
//   res.status(500).json({ message: err.message || "Server error" });
// });

// module.exports = app;


// backend/app.js
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

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Serverless-safe DB connect (connect once, reuse)
let dbReady = false;
app.use(async (req, res, next) => {
  try {
    if (!dbReady) {
      await connectDB();
      dbReady = true;
    }
    next();
  } catch (err) {
    next(err);
  }
});

// -------------------- ✅ CORS (FIXED) --------------------
const normalizeOrigin = (o) => {
  if (!o || typeof o !== "string") return "";
  // remove trailing slash and lowercase
  return o.trim().replace(/\/$/, "").toLowerCase();
};

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((o) => normalizeOrigin(o))
  .filter(Boolean);

// helpful defaults for local dev (even if env is missing)
const devDefaults = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5000",
  "http://127.0.0.1:5000",
].map(normalizeOrigin);

const allowList = new Set([...allowedOrigins, ...devDefaults]);

app.use(
  cors({
    origin: function (origin, callback) {
      // Non-browser requests / same-origin internal calls
      if (!origin) return callback(null, true);

      const incoming = normalizeOrigin(origin);

      // ✅ If env not set, allow dev defaults
      // ✅ If env set, still allow dev defaults too
      if (allowList.has(incoming)) return callback(null, true);

      // ✅ Allow same-host requests (useful if frontend is served from same domain)
      try {
        const reqHost = (this?.req?.headers?.host || "").toLowerCase(); // e.g. localhost:5000
        const o = new URL(incoming);
        const originHost = `${o.hostname}:${o.port || (o.protocol === "https:" ? "443" : "80")}`;

        if (reqHost && originHost === reqHost) {
          return callback(null, true);
        }
      } catch (_) {
        // ignore parse errors
      }

      // ❌ block only if it doesn't match
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
  })
);

// Routes
app.get("/", (req, res) => res.send("Roostr API running"));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/bookings", bookingRoutes);
app.use("/api/room-meta", roomMetaRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/host-analytics", require("./routes/hostAnalyticsRoutes"));

// Static uploads (local only; Vercel serverless won’t persist)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Error handler
app.use((err, req, res, next) => {
  console.error("API ERROR:", err);
  res.status(500).json({ message: err.message || "Server error" });
});

module.exports = app;
