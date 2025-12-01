const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Create JWT and send cookie
const sendToken = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,     // true only in production (https)
    sameSite: "lax",   // required for localhost
    path: "/",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  res.status(200).json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
};

// ---------------------------
// REGISTER USER
// ---------------------------
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = await User.create({ name, email, password }); // no hashing here

    sendToken(user, res);

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};


// ---------------------------
// LOGIN USER
// ---------------------------
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User
      .findOne({ email })
      .select("+password");  // FIX: include password

    if (!user) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    sendToken(user, res);

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};


// ---------------------------
// LOGOUT USER
// ---------------------------
exports.logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  return res.status(200).json({ success: true, message: "Logged out" });
};

// ---------------------------
// CURRENT LOGGED IN USER
// ---------------------------
exports.getCurrentUser = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error("CURRENT USER ERROR:", error);

    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    return res.status(500).json({ message: "Server Error" });
  }
};
