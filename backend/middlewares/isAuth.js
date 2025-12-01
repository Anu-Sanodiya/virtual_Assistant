const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // attach user to request
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
