// backend/controllers/userController.js
const User = require("../models/User");

// GET /api/users/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ user });
  } catch (err) {
    console.error("getMe error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/users/me
// PUT /api/users/:id
exports.updateMe = async (req, res) => {
  try {
    const userId = req.params.id || (req.user && req.user.id);
    if (!userId) {
      return res.status(400).json({ message: "User id is missing" });
    }

    const updates = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      country: req.body.country,
    };

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user });
  } catch (err) {
    console.error("updateMe error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/users/logout
exports.logoutUser = (req, res) => {
  try {
    res.clearCookie("token");
    res.clearCookie("authToken");
    res.clearCookie("roostr_token");
    res.clearCookie("jwt");

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("logoutUser error:", err);
    return res.status(500).json({ message: "Logout failed" });
  }
};
