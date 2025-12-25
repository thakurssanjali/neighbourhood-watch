const express = require("express");
const Event = require("../models/Event");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Create event (admin)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      postedBy: req.user.id
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: "Failed to create event" });
  }
});

// Get all events (admin)
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const events = await Event.find().sort({ eventDateTime: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

// Get public events
router.get("/public", async (req, res) => {
  try {
    const events = await Event.find().sort({ eventDateTime: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

// Update event (admin)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Failed to update event" });
  }
});

// Delete event (admin)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete event" });
  }
});

module.exports = router;
