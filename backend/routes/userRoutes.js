// backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const {
  getMe,
  updateMe,
  logoutUser,
} = require("../controllers/userController");

// profile
router.get("/me", auth, getMe);
router.put("/me", auth, updateMe);

// used by Profile.jsx (PUT /api/users/:id)
router.put("/:id", auth, updateMe);

// logout – BurgerMenu calls POST /api/users/logout
router.post("/logout", logoutUser);

module.exports = router;
