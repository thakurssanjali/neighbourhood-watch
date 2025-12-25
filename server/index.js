const express = require("express");
const cors = require("cors");
const path = require("path");

console.log("🚀 Server starting...");
console.log("📍 Node version:", process.version);
console.log("📍 Current environment:", process.env.NODE_ENV || "development");

// Load environment variables
// In development, load from .env.local
// In production (Render), environment variables are set in Render dashboard
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });
}

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const incidentRoutes = require("./routes/incidentRoutes");
const eventRoutes = require("./routes/eventRoutes");
const guidelineRoutes = require("./routes/communityGuidelineRoutes");
const contactRoutes = require("./routes/contactRoutes");
const adminRoutes = require("./routes/adminRoutes");
const passwordResetRoutes = require("./routes/passwordResetRoutes");

const app = express();

// Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes Documentation
app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to Neighbourhood Watch API",
    version: "1.0.0",
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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
