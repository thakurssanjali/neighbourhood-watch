const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["Pending", "Actioning", "Resolved"],
      default: "Pending"
    },
    remarks: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Incident", incidentSchema);
