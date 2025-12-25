const mongoose = require("mongoose");

// Track connection state
let isConnected = false;

const connectDB = async () => {
  // If already connected, reuse the connection
  if (isConnected) {
    console.log("♻️ Using existing MongoDB connection");
    return;
  }

  try {
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
