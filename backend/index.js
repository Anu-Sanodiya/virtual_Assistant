const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route"); 

dotenv.config();
connectDB();

const app = express();

// CORS
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Extra header for cookies
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());
app.use(cookieParser());

// ROUTES HERE
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes); // ← REQUIRED for updateAssistant

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(process.env.PORT, () => {
  console.log(`✅ Server running on port ${process.env.PORT}`);
});
