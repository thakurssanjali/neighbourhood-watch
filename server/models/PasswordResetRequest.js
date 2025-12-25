const mongoose = require("mongoose");

const passwordResetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "resolved"],
    default: "pending"
  },
  requestedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports =
  mongoose.models.PasswordResetRequest ||
  mongoose.model("PasswordResetRequest", passwordResetSchema);
