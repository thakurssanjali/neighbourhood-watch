const express = require("express");
const router = express.Router();

const Incident = require("../models/Incident");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/**
 * POST – Report an Incident (USER)
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const incident = new Incident({
      ...req.body,
      reportedBy: req.user.id
    });

    await incident.save();
    res.status(201).json(incident);
  } catch (error) {
    res.status(500).json({
      message: "Failed to report incident"
    });
  }
});

/**
 * GET – Logged-in user's complaints (USER)
 */
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const incidents = await Incident.find({
      reportedBy: req.user.id
    }).sort({ createdAt: -1 });

    res.json(incidents);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch your complaints"
    });
  }
});

/**
 * GET – All complaints (ADMIN)
 */
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const incidents = await Incident.find()
      .populate("reportedBy", "name phone society houseNumber")
      .sort({ createdAt: -1 });

    res.json(incidents);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch complaints"
    });
  }
});

/**
 * PUT – Update incident status (ADMIN)
 */
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, remarks } = req.body;

    const updatedIncident = await Incident.findByIdAndUpdate(
      req.params.id,
      { status, remarks },
      { new: true }
    );

    res.json(updatedIncident);
  } catch (error) {
    res.status(500).json({
      message: "Update failed"
    });
  }
});

/**
 * DELETE – Delete incident (ADMIN)
 */
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Incident.findByIdAndDelete(req.params.id);
    res.json({
      message: "Incident deleted"
    });
  } catch (error) {
    res.status(500).json({
      message: "Delete failed"
    });
  }
});

/**
 * GET – Public incidents (NO AUTH)
 */
router.get("/public", async (req, res) => {
  try {
    const incidents = await Incident.find()
      .sort({ createdAt: -1 })
      .select("title status remarks createdAt");

    res.json(incidents);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch public incidents"
    });
  }
});

module.exports = router;
