const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"], // Added custom error message
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 
      "Please enter a valid email" // Added regex validation
    ]
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false, // KEY CHANGE: Don't return password by default
  },
  assistantName: {
    type: String,
    default: "Assistant" // Good to have a default
  },
  assistantImage: {
    type: String
  },
  // Suggestion: If this is for a chat app, string usually isn't enough
  // You might want: history: [{ role: String, content: String }]
  history: [
    { type: String } 
  ]
}, { 
  timestamps: true // KEY CHANGE: fixed spelling (lowercase 's')
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);