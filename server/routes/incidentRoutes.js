const express = require("express");
const Incident = require("../models/Incident");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Report incident
router.post("/", authMiddleware, async (req, res) => {
  try {
    const incident = await Incident.create({
      ...req.body,
      reportedBy: req.user.id
    });
    res.status(201).json(incident);
  } catch (error) {
    res.status(500).json({ message: "Failed to report incident" });
  }
});

// Get user's incidents
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const incidents = await Incident.find({ reportedBy: req.user.id }).sort({
      createdAt: -1
    });
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch incidents" });
  }
});

// Get all incidents (admin)
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const incidents = await Incident.find()
      .populate("reportedBy", "name phone society houseNumber")
      .sort({ createdAt: -1 });
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch incidents" });
  }
});

// Update incident (admin)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const incident = await Incident.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.json(incident);
  } catch (error) {
    res.status(500).json({ message: "Failed to update incident" });
  }
});

// Delete incident (admin)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Incident.findByIdAndDelete(req.params.id);
    res.json({ message: "Incident deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete incident" });
  }
});

// Public incidents (no auth)
router.get("/public", async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ createdAt: -1 });
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch incidents" });
  }
});

module.exports = router;
