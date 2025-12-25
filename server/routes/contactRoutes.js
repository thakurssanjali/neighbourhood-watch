// const express = require("express");
// const router = express.Router();

// const ContactMessage = require("../models/ContactMessage");
// const authMiddleware = require("../middleware/authMiddleware");

// // POST – send message (logged-in users only)
// router.post("/", authMiddleware, async (req, res) => {
//   try {
//     const { message } = req.body;

//     if (!message) {
//       return res.status(400).json({ message: "Message is required" });
//     }

//     const newMessage = await ContactMessage.create({
//       message,
//       sentBy: req.user.id
//     });

//     res.status(201).json({ message: "Message sent successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to send message" });
//   }
// });

// // ADMIN – view all messages
// router.get("/", authMiddleware, async (req, res) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({ message: "Access denied" });
//   }

//   const messages = await ContactMessage.find()
//     .populate("sentBy", "name phone society houseNumber")
//     .sort({ createdAt: -1 });

//   res.json(messages);
// });

// module.exports = router;

const express = require("express");
const router = express.Router();

const ContactMessage = require("../models/ContactMessage");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// USER → Send message
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
  } catch {
    res.status(500).json({ message: "Failed to send message" });
  }
});

// ADMIN → Get all messages
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const messages = await ContactMessage.find()
      .populate("sentBy", "name phone society houseNumber")
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

// ADMIN → Delete message
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
