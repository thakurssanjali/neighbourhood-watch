const express = require("express");
const router = express.Router();

const Event = require("../models/Event");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { eventDateTime } = req.body;

      // 1️⃣ Check for existing event at same date & time
      const existingEvent = await Event.findOne({ eventDateTime });

      if (existingEvent) {
        return res.status(409).json({
          message: "An event already exists at this date and time"
        });
      }

      // 2️⃣ Create event
      const event = await Event.create({
        ...req.body,
        postedBy: req.user.id
      });

      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({
        message: "Failed to create event"
      });
    }
  }
);

router.get("/public", async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ eventDateTime: 1 })
      .select("title category venue description eventDateTime createdAt");

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch events" });
  }
});
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const events = await Event.find()
        .sort({ eventDateTime: 1 });
      res.json(events);
    } catch {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  }
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const updated = await Event.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(updated);
    } catch {
      res.status(500).json({ message: "Failed to update event" });
    }
  }
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      await Event.findByIdAndDelete(req.params.id);
      res.json({ message: "Event deleted" });
    } catch {
      res.status(500).json({ message: "Failed to delete event" });
    }
  }
);


module.exports = router;
