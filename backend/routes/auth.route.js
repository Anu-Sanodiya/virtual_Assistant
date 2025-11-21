const express = require("express");
const { registerUser, loginUser, logoutUser } = require("../controller/auth.controller");
const { isAuthenticated } = require("../middlewares/isAuth");

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

// Example protected route
router.get("/me", isAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
