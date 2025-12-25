const express = require("express");
const ContactMessage = require("../models/ContactMessage");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Send message
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const newMessage = await ContactMessage.create({
      message,
      sentBy: req.user.id
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Failed to send message" });
  }
});

// Get all messages (admin)
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const messages = await ContactMessage.find()
      .populate("sentBy", "name phone society houseNumber")
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

// Delete message (admin)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete message" });
  }
});

module.exports = router;
