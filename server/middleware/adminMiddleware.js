const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized: user not authenticated"
      });
    }

    const user = await User.findById(req.user.id).select("role");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied: admins only"
      });
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error.message);
    return res.status(500).json({
      message: "Admin authorization failed"
    });
  }
};

module.exports = adminMiddleware;
