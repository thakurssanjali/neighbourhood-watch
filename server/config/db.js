const mongoose = require("mongoose");

// Track connection state
let isConnected = false;

const connectDB = async () => {
  // If already connected, reuse the connection
  if (isConnected) {
    console.log("♻️ Using existing MongoDB connection");
    return;
  }

  // Validate required environment variables
  if (!process.env.MONGODB_URI) {
    const error = new Error("MONGODB_URI environment variable is not set");
    console.error("❌ " + error.message);
    throw error;
  }

  if (!process.env.JWT_SECRET) {
    const error = new Error("JWT_SECRET environment variable is not set");
    console.error("❌ " + error.message);
    throw error;
  }

  try {
    console.log("🔌 Attempting to connect to MongoDB...");
    console.log("📍 Connection string exists:", !!process.env.MONGODB_URI);
    
    // Optimize for serverless with connection pooling
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(process.env.MONGODB_URI, options);
    
    isConnected = mongoose.connection.readyState === 1;
    
    console.log("✅ MongoDB connected");
    console.log("📊 Database name:", mongoose.connection.name);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    isConnected = false;
    
    // Don't exit process in serverless environment
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;
