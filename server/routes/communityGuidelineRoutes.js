const express = require("express");
const CommunityGuideline = require("../models/CommunityGuideline");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Create guideline (admin)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const guideline = await CommunityGuideline.create({
      ...req.body,
      postedBy: req.user.id
    });
    res.status(201).json(guideline);
  } catch (error) {
    res.status(500).json({ message: "Failed to create guideline" });
  }
});

// Get all guidelines (admin)
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const guidelines = await CommunityGuideline.find().sort({ createdAt: -1 });
    res.json(guidelines);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch guidelines" });
  }
});

// Get public guidelines
router.get("/public", async (req, res) => {
  try {
    const guidelines = await CommunityGuideline.find()
      .populate("postedBy", "name")
      .sort({ createdAt: -1 });
    res.json(guidelines);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch guidelines" });
  }
});

// Delete guideline (admin)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await CommunityGuideline.findByIdAndDelete(req.params.id);
    res.json({ message: "Guideline deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete guideline" });
  }
});

module.exports = router;
