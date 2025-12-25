const express = require("express");
const cors = require("cors");

// Load environment variables - Vercel provides them automatically
// Only load .env.local for local development
if (process.env.NODE_ENV !== "production") {
  const path = require("path");
  require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });
}

const connectDB = require("../server/config/db");

// Routes
const authRoutes = require("../server/routes/authRoutes");
const userRoutes = require("../server/routes/userRoutes");
const incidentRoutes = require("../server/routes/incidentRoutes");
const eventRoutes = require("../server/routes/eventRoutes");
const guidelineRoutes = require("../server/routes/communityGuidelineRoutes");
const contactRoutes = require("../server/routes/contactRoutes");
const adminRoutes = require("../server/routes/adminRoutes");
const passwordResetRoutes = require("../server/routes/passwordResetRoutes");

const app = express();

// Initialize database connection
let dbConnected = false;

const ensureDbConnection = async () => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
};

// Middleware
app.use(cors());
app.use(express.json());

// API Routes Documentation
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Neighbourhood Watch API",
    version: "1.0.0",
    environment: "Vercel Serverless",
    routes: {
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login"
      },
      users: {
        getAllPublic: "GET /api/users/public"
      },
      incidents: {
        create: "POST /api/incidents (requires auth)",
        getAll: "GET /api/incidents (requires auth)",
        getMy: "GET /api/incidents/my (requires auth)",
        getPublic: "GET /api/incidents/public",
        update: "PUT /api/incidents/:id (requires auth)",
        delete: "DELETE /api/incidents/:id (requires auth)"
      },
      events: {
        create: "POST /api/events (requires auth)",
        getAll: "GET /api/events",
        getPublic: "GET /api/events/public",
        update: "PUT /api/events/:id (requires admin)",
        delete: "DELETE /api/events/:id (requires admin)"
      },
      guidelines: {
        create: "POST /api/guidelines (requires admin)",
        getAll: "GET /api/guidelines",
        getPublic: "GET /api/guidelines/public",
        update: "PUT /api/guidelines/:id (requires admin)",
        delete: "DELETE /api/guidelines/:id (requires admin)"
      },
      contact: {
        sendMessage: "POST /api/contact (requires auth)",
        getAll: "GET /api/contact (requires admin)",
        delete: "DELETE /api/contact/:id (requires admin)"
      },
      admin: {
        getAllUsers: "GET /api/admin/users (requires admin)",
        getUserById: "GET /api/admin/users/:id (requires admin)",
        deleteUser: "DELETE /api/admin/users/:id (requires admin)"
      }
    }
  });
});

// Routes - mounted without /api prefix since Vercel routing handles that
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/incidents", incidentRoutes);
app.use("/events", eventRoutes);
app.use("/guidelines", guidelineRoutes);
app.use("/contact", contactRoutes);
app.use("/admin", adminRoutes);
app.use("/password", passwordResetRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ 
    message: "Internal server error",
    error: process.env.NODE_ENV === "production" ? "Server error" : err.message 
  });
});

// Serverless function handler
module.exports = async (req, res) => {
  try {
    await ensureDbConnection();
    return app(req, res);
  } catch (error) {
    console.error("Serverless function error:", error);
    return res.status(500).json({ 
      message: "Database connection failed",
      error: error.message 
    });
  }
};

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  });
}
