const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const { geminiResponse } = require("./gemini");

dotenv.config();
connectDB();

const app = express();

// ---------------- CORS FIX -----------------
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "X-Requested-With",
    "x-goog-api-key"
  ]
}));


// Add headers manually too (some browsers require both)
// app.use((req, res, next) => {
//   if (req.method === "OPTIONS") {
//     res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//     res.header("Access-Control-Allow-Credentials", "true");
//     res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, X-Requested-With, x-goog-api-key");
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//     return res.sendStatus(200);
//   }
//   next();
// });

app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Gemini Test Route
app.get("/", async (req, res) => {
  const prompt = req.query.prompt || "Hello, World!";

  try {
    const response = await geminiResponse(prompt);

    // Gemini returns objects that are serializable, but wrap safely
    res.status(200).json({
      success: true,
      data: response
    });

  } catch (err) {
    console.error("❌ Error in GET / :", err.response?.data || err);

    res.status(500).json({
      error: "Internal server error",
      details: err.response?.data || err.message
    });
  }
});

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`✅ Server running on port ${process.env.PORT}`);
});
