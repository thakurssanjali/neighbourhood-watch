const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactMessage", contactMessageSchema);
