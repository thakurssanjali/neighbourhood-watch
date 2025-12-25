const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const PasswordResetRequest = require("../models/PasswordResetRequest");

const router = express.Router();

/**
 * REGISTER USER
 */
router.post("/register", async (req, res) => {
  const { name, phone, locality, society, houseNumber, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      phone,
      locality,
      society,
      houseNumber,
      password: hashedPassword,
      role: "user"
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
});

/**
 * LOGIN (ROLE AWARE)
 */
router.post("/login", async (req, res) => {
  try {
    const { phone, password, role } = req.body;

    const user = await User.findOne({ phone, role });

    if (!user) {
      return res.status(404).json({
        message:
          role === "admin"
            ? "Admin does not exist"
            : "User does not exist"
      });
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

    res.json({
      token,
      role: user.role,
      name: user.name
      

    });

  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

/**
 * FORGOT PASSWORD — CHECK ACCOUNT (ROLE AWARE)
 */
// router.post("/forgot-password", async (req, res) => {
//   try {
//     const { phone, role } = req.body;

//     if (!phone || !role) {
//       return res.status(400).json({
//         message: "Phone and role are required"
//       });
//     }

//     const user = await User.findOne({ phone, role });

//     if (!user) {
//       return res.status(404).json({
//         message:
//           role === "admin"
//             ? "Admin account does not exist"
//             : "User account does not exist"
//       });
//     }

//     res.json({
//       message:
//         "Account found. Please contact the society administrator to reset your password."
//     });

//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to process request"
//     });
//   }
// });

router.post("/forgot-password", async (req, res) => {
  try {
    const { phone, role } = req.body;

    const user = await User.findOne({ phone, role });
    if (!user) {
      return res.status(404).json({
        message:
          role === "admin"
            ? "Admin account does not exist"
            : "User account does not exist"
      });
    }

    // prevent duplicate pending requests
    const existing = await PasswordResetRequest.findOne({
      user: user._id,
      status: "pending"
    });

    if (existing) {
      return res.json({
        message: "Password reset request already submitted"
      });
    }

    await PasswordResetRequest.create({
      user: user._id,
      phone,
      role
    });

    res.json({
      message:
        "Password reset request sent. Please contact the administrator."
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to process request" });
  }
});


module.exports = router;
