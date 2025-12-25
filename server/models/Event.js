const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Dance", "Concert", "Lunch", "Urgent Meeting", "Festival", "Casual Gathering"],
      required: true
    },
    description: { type: String, trim: true },
    eventDateTime: { type: Date, required: true },
    venue: { type: String, trim: true },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
