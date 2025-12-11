// // backend/routes/authRoutes.js
// const express = require('express');
// const router = express.Router();
// // const { register, login } = require('../controllers/authController');
// const { register, login, becomeHost } = require('../controllers/authController');

// // ✅ Simple test route to check that /api/auth is wired correctly
// router.get('/test', (req, res) => {
//   res.json({ ok: true, message: 'Auth routes working' });
// });

// // ✅ Auth endpoints
// router.post('/register', register);
// router.post('/login', login);

// router.post('/become-host', becomeHost);

// module.exports = router;

// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();

const {
  register,
  login,
  becomeHost,
} = require("../controllers/authController");

// ✅ Simple test route to check that /api/auth is wired correctly
router.get("/test", (req, res) => {
  res.json({ ok: true, message: "Auth routes working" });
});

// ✅ Auth endpoints
router.post("/register", register);
router.post("/login", login);

// Become a host
router.post("/become-host", becomeHost);

module.exports = router;
