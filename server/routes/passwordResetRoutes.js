const express = require("express");
const router = express.Router();
const User = require("../models/User");
const PasswordResetRequest = require("../models/PasswordResetRequest");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const bcrypt = require("bcryptjs");

// User requests password reset
router.post("/forgot-password", async (req, res) => {
  try {
    const { phone, newPassword, reason } = req.body;

    // Validate password length
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Find user by phone
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if there's already a pending request
    const existingRequest = await PasswordResetRequest.findOne({
      phone,
      status: "pending"
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Password reset request already pending. Please wait for admin approval." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Create new password reset request with hashed password
    const resetRequest = await PasswordResetRequest.create({
      userId: user._id,
      phone,
      name: user.name,
      reason: reason || "User requested password reset",
      status: "pending",
      newHashedPassword: hashedPassword // Store hashed password in specific field
    });

    console.log("✅ Password reset request created:", resetRequest._id);
    res.status(201).json({
      message: "Password reset request submitted successfully. Please wait for admin approval.",
      requestId: resetRequest._id
    });
  } catch (error) {
    console.error("❌ Forgot password error:", error.message);
    res.status(500).json({ message: error.message || "Failed to submit password reset request" });
  }
});

// Get all password reset requests (Admin only)
router.get(
  "/reset-requests",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const requests = await PasswordResetRequest.find()
        .populate("userId", "name phone locality society")
        .sort({ createdAt: -1 });

      res.json(requests);
    } catch (error) {
      console.error("❌ Error fetching reset requests:", error.message);
      res.status(500).json({ message: error.message || "Failed to fetch reset requests" });
    }
  }
);

// Admin approves password reset request
router.put(
  "/reset-requests/:id/approve",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { remarks } = req.body;
      const adminName = req.user.name;

      const resetRequest = await PasswordResetRequest.findById(req.params.id);
      if (!resetRequest) {
        return res.status(404).json({ message: "Reset request not found" });
      }

      if (resetRequest.status !== "pending") {
        return res.status(400).json({ message: "This request has already been processed" });
      }

      // Find user and update password
      const user = await User.findById(resetRequest.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log("🔑 Updating password for user:", user.phone);
      console.log("📦 Hashed password from request:", resetRequest.newHashedPassword.substring(0, 20) + "...");

      // Use the hashed password from newHashedPassword field
      user.password = resetRequest.newHashedPassword;
      const savedUser = await user.save();

      console.log("✅ User saved successfully");
      console.log("🔍 Saved password hash:", savedUser.password.substring(0, 20) + "...");

      // Update request status
      resetRequest.status = "approved";
      resetRequest.adminRemarks = remarks || "";
      resetRequest.approvedAt = new Date();
      resetRequest.approvedBy = adminName;
      resetRequest.newHashedPassword = null; // Clear the password after using it
      await resetRequest.save();

      console.log("✅ Password reset request approved and password updated:", resetRequest._id);
      res.json({
        message: "Password reset request approved. User's password has been updated successfully.",
        request: resetRequest
      });
    } catch (error) {
      console.error("❌ Error approving reset request:", error.message);
      console.error("Full error:", error);
      res.status(500).json({ message: error.message || "Failed to approve request" });
    }
  }
);

// Admin rejects password reset request
router.put(
  "/reset-requests/:id/reject",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { remarks } = req.body;
      const adminName = req.user.name;

      const resetRequest = await PasswordResetRequest.findById(req.params.id);
      if (!resetRequest) {
        return res.status(404).json({ message: "Reset request not found" });
      }

      if (resetRequest.status !== "pending") {
        return res.status(400).json({ message: "This request has already been processed" });
      }

      // Update request status
      resetRequest.status = "rejected";
      resetRequest.adminRemarks = remarks || "Request rejected by admin";
      resetRequest.approvedBy = adminName;
      await resetRequest.save();

      console.log("✅ Password reset request rejected:", resetRequest._id);
      res.json({
        message: "Password reset request rejected.",
        request: resetRequest
      });
    } catch (error) {
      console.error("❌ Error rejecting reset request:", error.message);
      res.status(500).json({ message: error.message || "Failed to reject request" });
    }
  }
);

module.exports = router;
