// // backend/routes/roomMetaRoutes.js
// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/authMiddleware");
// const {
//   getRoomMeta,
//   upsertRoomMeta,
// } = require("../controllers/roomMetaController");

// // public – guests can read meta for a room
// router.get("/:roomId", getRoomMeta);

// // protected – host updates meta for a room
// router.put("/:roomId", auth, upsertRoomMeta);

// module.exports = router;


// backend/routes/roomMetaRoutes.js
// -------------------------------------------------------
// Legacy /api/room-meta routes.
// We no longer use a separate RoomMeta collection – all
// basics (headline, guests, beds, baths, etc.) are stored
// directly on the Room document via /api/rooms/:id/basics.
// This file is kept only so that server.js can still
// require it without crashing.
// -------------------------------------------------------

// backend/routes/roomMetaRoutes.js
// -------------------------------------------------------
// Legacy /api/room-meta routes.
//
// We are no longer using a separate RoomMeta collection.
// All "room basics" (headline, guests, beds, baths, etc.)
// are stored directly on the Room document via:
//
//   - PATCH /api/rooms/:id/basics
//   - PATCH /api/rooms/:id/pricing
//
// This dummy router only exists so that `server.js` can
// still `app.use("/api/room-meta", roomMetaRoutes);`
// without crashing.
// -------------------------------------------------------

const express = require("express");
const router = express.Router();

// Handle ALL methods and ALL subpaths under /api/room-meta
router.use((req, res) => {
  res.status(410).json({
    message:
      "room-meta API has been removed. Use /api/rooms/:id/basics instead.",
  });
});

module.exports = router;

