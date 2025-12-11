// // backend/controllers/authController.js
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const generateToken = (userId) =>
//   jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN || '7d',
//   });

// exports.register = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       password,
//       role,
//       idNumber,
//       dateOfBirth,
//       phone,
//       country,
//     } = req.body;

//     // check existing email
//     const existing = await User.findOne({ email });
//     if (existing) {
//       return res.status(400).json({ message: 'Email already registered' });
//     }

//     // create user with all the extra fields
//     const user = await User.create({
//       name,
//       email,
//       password,
//       role,
//       idNumber,
//       dateOfBirth,
//       phone,
//       country,
//     });

//     const token = generateToken(user._id);

//     res.status(201).json({
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         idNumber: user.idNumber,
//         dateOfBirth: user.dateOfBirth,
//         phone: user.phone,
//         country: user.country,
//       },
//       token,
//     });
//   } catch (err) {
//     console.error('Register error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user || !(await user.matchPassword(password))) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const token = generateToken(user._id);

//     res.json({
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         idNumber: user.idNumber,
//         dateOfBirth: user.dateOfBirth,
//         phone: user.phone,
//         country: user.country,
//       },
//       token,
//     });
//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// exports.becomeHost = async (req, res) => {
//   try {
//     const { userId } = req.body; // logged in user ID

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // prevent duplicate host upgrades
//     if (user.role === "host") {
//       return res.status(400).json({ message: "You are already a host" });
//     }

//     user.role = "host";
//     await user.save();

//     res.json({
//       message: "You are now a host!",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         idNumber: user.idNumber,
//         dateOfBirth: user.dateOfBirth,
//         phone: user.phone,
//         country: user.country,
//       }
//     });

//   } catch (err) {
//     console.error("Become host error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// backend/controllers/authController.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper: sign JWT with userId
const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      idNumber,
      dateOfBirth,
      phone,
      country,
    } = req.body;

    // check existing email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // create user with all the extra fields
    const user = await User.create({
      name,
      email,
      password,
      role,
      idNumber,
      dateOfBirth,
      phone,
      country,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        idNumber: user.idNumber,
        dateOfBirth: user.dateOfBirth,
        phone: user.phone,
        country: user.country,
      },
      token,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        idNumber: user.idNumber,
        dateOfBirth: user.dateOfBirth,
        phone: user.phone,
        country: user.country,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/become-host
exports.becomeHost = async (req, res) => {
  try {
    const { userId } = req.body; // logged in user ID

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // prevent duplicate host upgrades
    if (user.role === "host") {
      return res.status(400).json({ message: "You are already a host" });
    }

    user.role = "host";
    await user.save();

    res.json({
      message: "You are now a host!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        idNumber: user.idNumber,
        dateOfBirth: user.dateOfBirth,
        phone: user.phone,
        country: user.country,
      },
    });
  } catch (err) {
    console.error("Become host error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
