const express = require("express");
const cors = require("cors");
const path = require("path");

// Load environment variables
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

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
app.get("/api", (req, res) => {
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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/guidelines", guidelineRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/password", passwordResetRoutes);

// Serverless function handler
module.exports = async (req, res) => {
  await ensureDbConnection();
  return app(req, res);
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
