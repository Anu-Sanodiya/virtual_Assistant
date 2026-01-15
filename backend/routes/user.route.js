const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { updateAssistant } = require("../controller/user.controller");
const { isAuthenticated } = require("../middlewares/isAuth");
const { geminiResponse } = require("../gemini");

// Existing route
router.post("/update", isAuthenticated, upload.single("assistantImage"), updateAssistant);

// ✅ ADD THIS ROUTE
router.post("/asktoassistant", isAuthenticated, async (req, res) => {
  try {
    const { command } = req.body;

    if (!command) {
      return res.status(400).json({
        type: "chat",
        userInput: "",
        response: "No command received"
      });
    }

    const aiResult = await geminiResponse(command);

    return res.status(200).json(aiResult);

  } catch (error) {
    console.error("Assistant error:", error.message);

    return res.status(500).json({
      type: "chat",
      userInput: req.body.command || "",
      response: "Sorry, I couldn't process that."
    });
  }
});

module.exports = router;
