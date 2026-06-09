const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
const dashboardDir = path.join(uploadsDir, "dashboard");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(dashboardDir)) {
  fs.mkdirSync(dashboardDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dashboardDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/\s+/g, '-');
    cb(null, `${timestamp}-${originalName}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads folder
app.use("/uploads", express.static(uploadsDir));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// MongoDB connection with better error handling
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/cafe");
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    // Don't exit, try to continue - MongoDB can be set up later
    console.log("⚠️  Running in offline mode - MongoDB not available");
  }
};

connectDB();

// Import routes
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "✅ Server is running",
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? "🟢 Connected" : "🔴 Disconnected"
  });
});

// Routes
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// Dashboard Image Upload Endpoint
app.post("/api/dashboard/upload-background", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided" });
  }
  
  const imageUrl = `/uploads/dashboard/${req.file.filename}`;
  res.json({ 
    success: true, 
    imageUrl: imageUrl,
    filename: req.file.filename,
    message: "Dashboard background image uploaded successfully"
  });
});

// Get Dashboard Background Image
app.get("/api/dashboard/background", (req, res) => {
  try {
    const files = fs.readdirSync(dashboardDir);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );
    
    if (imageFiles.length === 0) {
      return res.json({ 
        success: true, 
        backgroundImage: null,
        message: "No background image set" 
      });
    }
    
    const latestImage = imageFiles[imageFiles.length - 1];
    const imageUrl = `/uploads/dashboard/${latestImage}`;
    
    res.json({ 
      success: true, 
      backgroundImage: imageUrl,
      filename: latestImage
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve background image" });
  }
});

// Delete Dashboard Background Image
app.delete("/api/dashboard/background", (req, res) => {
  try {
    const files = fs.readdirSync(dashboardDir);
    files.forEach(file => {
      fs.unlinkSync(path.join(dashboardDir, file));
    });
    res.json({ success: true, message: "Background image deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete background image" });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "❌ Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(err.status || 500).json({ 
    error: err.message || "Internal server error",
    timestamp: new Date().toISOString()
  });
});

// Server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health\n`);
});
