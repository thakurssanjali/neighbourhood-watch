const mongoose = require("mongoose");

const passwordResetRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    reason: {
      type: String,
      default: "User requested password reset"
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    newHashedPassword: {
      type: String,
      default: null
    },
    adminRemarks: {
      type: String,
      default: null
    },
    approvedAt: {
      type: Date,
      default: null
    },
    approvedBy: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PasswordResetRequest", passwordResetRequestSchema);
