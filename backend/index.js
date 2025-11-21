const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors=require('cors')
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.route");

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",  // Your frontend URL
  credentials: true                // Allow cookies & auth headers
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(process.env.PORT, () => {
  console.log(`✅ Server running on port ${process.env.PORT}`);
});
