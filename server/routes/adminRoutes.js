const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const PasswordResetRequest = require("../models/PasswordResetRequest");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post(
  "/reset-password",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { phone, newPassword } = req.body;

      if (!phone || !newPassword) {
        return res.status(400).json({ message: "All fields required" });
      }

      const user = await User.findOne({ phone });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      await PasswordResetRequest.findOneAndUpdate(
        { phone, status: "pending" },
        { status: "resolved" }
      );

      res.json({ message: "Password reset successfully" });
    } catch (err) {
      res.status(500).json({ message: "Reset failed" });
    }
  }
);

router.get(
  "/password-reset-requests",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const requests = await PasswordResetRequest.find({
      status: "pending"
    })
      .populate("user", "name phone role")
      .sort({ requestedAt: -1 });

    res.json(requests);
  }
);

module.exports = router;
