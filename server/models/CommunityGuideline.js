const mongoose = require("mongoose");

const communityGuidelineSchema = new mongoose.Schema(
  {
    // What admin writes as heading
    title: {
      type: String,
      required: true,
      trim: true
    },

    // Where the event/update applies
    venue: {
      type: String,
      required: true,
      trim: true
    },

    // Full explanation / message
    description: {
      type: String,
      required: true,
      trim: true
    },

    // Date & time of event / notice
    eventDateTime: {
      type: Date,
      required: true
    },

    // Which admin posted it
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true // createdAt = when admin posted
  }
);

module.exports = mongoose.model(
  "CommunityGuideline",
  communityGuidelineSchema
);
