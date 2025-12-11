// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    // 1) Cookie: jwt
    if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    // 2) Authorization: Bearer <token>
    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 3) x-auth-token header (old style – we keep this for compatibility)
    if (!token && req.header("x-auth-token")) {
      token = req.header("x-auth-token");
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Decode JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Be very defensive about how the payload is shaped
    const userId =
      decoded.id ||
      decoded._id ||
      decoded.userId ||
      (decoded.user && (decoded.user.id || decoded.user._id));

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Not authorized, invalid token payload" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = { protect };
