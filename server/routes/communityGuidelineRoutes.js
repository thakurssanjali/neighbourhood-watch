const express = require("express");
const router = express.Router();

const CommunityGuideline = require("../models/CommunityGuideline");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/**
 * POST – Create community guideline (ADMIN ONLY)
 */
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { title, venue, description, eventDateTime } = req.body;

      // Only enforce what is truly required
      if (!title || !description) {
        return res.status(400).json({
          message: "Title and description are required"
        });
      }

      const guideline = await CommunityGuideline.create({
        title,
        venue: venue || "",
        description,
        eventDateTime: eventDateTime || null,
        postedBy: req.user.id
      });

      res.status(201).json(guideline);
    } catch (error) {
      console.error("GUIDELINE POST ERROR:", error.message);
      res.status(500).json({
        message: "Failed to post community guideline"
      });
    }
  }
);

/**
 * GET – Public guidelines (NO AUTH)
 */
router.get("/public", async (req, res) => {
  try {
    const guidelines = await CommunityGuideline.find()
      .populate("postedBy", "name")
      .sort({ createdAt: -1 });

    res.json(guidelines);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch guidelines"
    });
  }
});

/**
 * DELETE – Remove guideline (ADMIN ONLY)
 */
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      await CommunityGuideline.findByIdAndDelete(req.params.id);
      res.json({ message: "Guideline deleted" });
    } catch (error) {
      res.status(500).json({ message: "Delete failed" });
    }
  }
);

module.exports = router;
