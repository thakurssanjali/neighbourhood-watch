const mongoose = require("mongoose");

const communityGuidelineSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    eventDateTime: { type: Date, required: true },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CommunityGuideline", communityGuidelineSchema);
