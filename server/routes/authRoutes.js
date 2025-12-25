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
    console.log("🔐 Login attempt - Phone:", phone, "Role:", role);

    const user = await User.findOne({ phone, role });

    if (!user) {
      console.log("❌ User not found - Phone:", phone);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("👤 User found:", user.phone);
    console.log("🔑 Stored password hash:", user.password.substring(0, 20) + "...");
    console.log("🔑 Attempting to compare with password of length:", password.length);

    const isMatch = await bcrypt.compare(password, user.password);
    
    console.log("✅ Password match result:", isMatch);

    if (!isMatch) {
      console.log("❌ Invalid credentials for user:", phone);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("✅ Login successful for user:", phone);
    res.json({ token, role: user.role, name: user.name });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    res.status(500).json({ message: error.message || "Login failed" });
  }
});

module.exports = router;
