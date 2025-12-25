const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, phone, locality, society, houseNumber, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "Phone number already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      phone,
      locality,
      society,
      houseNumber,
      password: hashedPassword,
      role: "user"
    });

    console.log("✅ User registered successfully:", user._id);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Registration error:", error.message);
    res.status(500).json({ message: error.message || "Registration failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { phone, password, role } = req.body;
    const user = await User.findOne({ phone, role });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role, name: user.name });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
