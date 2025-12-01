const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} = require("../controller/auth.controller");
const { isAuthenticated } = require("../middlewares/isAuth");

const router = express.Router();

// Public Routes
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

// Protected Routes
router.get("/me", isAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

// Current User API
router.get("/current", isAuthenticated, getCurrentUser);

module.exports = router;

