const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Get all public users
router.get("/public", async (req, res) => {
  try {
    const users = await User.find().select(
      "name phone locality society houseNumber createdAt"
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

module.exports = router;
