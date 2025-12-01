const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { updateAssistant } = require("../controller/user.controller");
const { isAuthenticated } = require("../middlewares/isAuth");

router.post("/update", isAuthenticated, upload.single("assistantImage"), updateAssistant);

module.exports = router;
