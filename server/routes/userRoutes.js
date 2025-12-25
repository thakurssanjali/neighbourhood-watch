const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/public", async (req, res) => {
  try {
    const users = await User.find()
      .select("name locality society houseNumber role createdAt")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch members" });
  }
});

module.exports = router;
