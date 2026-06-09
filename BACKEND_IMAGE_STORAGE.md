# 🔧 Backend Setup & Image Storage Guide

## Backend Directory Structure

```
backend/
├── server.js                           # Main Express server
├── package.json                        # Dependencies
├── package-lock.json                   # Lock file
├── .env                                # Environment variables
├── routes/
│   ├── menuRoutes.js                  # Menu API endpoints
│   └── orderRoutes.js                 # Orders API endpoints
├── models/
│   ├── Order.js                       # Order MongoDB schema
│   └── MenuItem.js                    # MenuItem MongoDB schema
├── uploads/                            # 📁 IMAGE STORAGE FOLDER
│   └── dashboard/                     # Dashboard background images
│       ├── 1717328400000-sunset.jpg
│       ├── 1717328500000-morning.png
│       └── ...
└── node_modules/                      # Dependencies

```

---

## 📸 Image Storage Location

### Where Images Are Stored:
- **Full Path**: `c:\Users\Shrika\FUTURE_FS_03\backend\uploads\dashboard\`
- **Access URL**: `http://localhost:5000/uploads/dashboard/[filename]`
- **Production URL**: `https://your-backend-domain.com/uploads/dashboard/[filename]`

### Image File Naming:
```
[timestamp]-[original-filename]

Examples:
1717328400000-sunset.jpg
1717328500000-cafe-morning.png
1717328600000-coffee-beans.gif
```

### Allowed Image Types:
- ✅ JPEG (.jpg, .jpeg)
- ✅ PNG (.png)
- ✅ GIF (.gif)
- ✅ WebP (.webp)
- ❌ SVG, TIFF, BMP (not allowed)

### File Size Limits:
- **Max Size**: 5 MB per image
- **Recommendation**: 1-3 MB for optimal loading

---

## 🚀 How Image Upload Works

### 1. **User Uploads Image** (Frontend)
```javascript
// Admin.js - Upload handler
const handleBackgroundImageUpload = async (e) => {
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `http://localhost:5000/api/dashboard/upload-background`,
    {
      method: "POST",
      body: formData  // File data
    }
  );
};
```

### 2. **Backend Receives & Stores** (server.js)
```javascript
// Multer configuration handles file upload
const upload = multer({
  storage: storage,  // Saves to /uploads/dashboard/
  fileFilter: (req, file, cb) => {
    // Only allows image files
  },
  limits: { fileSize: 5 * 1024 * 1024 }  // 5MB limit
});

// POST endpoint
app.post("/api/dashboard/upload-background", 
  upload.single("image"), 
  (req, res) => {
    // Returns: { imageUrl: "/uploads/dashboard/filename" }
  }
);
```

### 3. **Backend Serves Image** (Static Files)
```javascript
// In server.js
app.use("/uploads", express.static(uploadsDir));

// Now these URLs work:
// http://localhost:5000/uploads/dashboard/image.jpg
// http://localhost:5000/uploads/dashboard/1717328400000-sunset.jpg
```

### 4. **Frontend Displays Image** (Admin.js)
```javascript
// CSS Background
<div style={{
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover'
}} />

// Regular Image Tag
<img src={backgroundImage} alt="Dashboard" />
```

---

## 🔌 API Endpoints for Images

### **Upload Background Image**
```
POST /api/dashboard/upload-background

Headers:
  Content-Type: multipart/form-data

Form Data:
  image: [File object]

Response (Success):
{
  "success": true,
  "imageUrl": "/uploads/dashboard/1717328400000-sunset.jpg",
  "filename": "1717328400000-sunset.jpg",
  "message": "Dashboard background image uploaded successfully"
}

Response (Error):
{
  "error": "No image file provided"
}
```

### **Get Current Dashboard Background**
```
GET /api/dashboard/background

Response (With Image):
{
  "success": true,
  "backgroundImage": "/uploads/dashboard/1717328400000-sunset.jpg",
  "filename": "1717328400000-sunset.jpg"
}

Response (No Image):
{
  "success": true,
  "backgroundImage": null,
  "message": "No background image set"
}
```

### **Delete Dashboard Background**
```
DELETE /api/dashboard/background

Response:
{
  "success": true,
  "message": "Background image deleted"
}
```

---

## 📝 Complete Backend Server Code (Updated)

Location: `backend/server.js`

Key additions:
```javascript
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads directory structure
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

// Serve static files
app.use("/uploads", express.static(uploadsDir));

// Upload endpoint
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

// Get endpoint
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

// Delete endpoint
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
```

---

## 📦 Dependencies Required

### Install Multer:
```bash
npm install multer
```

### Complete package.json:
```json
{
  "name": "backend",
  "version": "1.0.0",
  "main": "server.js",
  "type": "commonjs",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^4.22.2",
    "mongoose": "^9.6.3",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.14"
  }
}
```

---

## 🔍 Testing Image Upload

### Using cURL:
```bash
# Test image upload
curl -X POST \
  -F "image=@/path/to/image.jpg" \
  http://localhost:5000/api/dashboard/upload-background

# Get background
curl http://localhost:5000/api/dashboard/background

# Delete background
curl -X DELETE http://localhost:5000/api/dashboard/background
```

### Using Postman:
1. Create POST request to `http://localhost:5000/api/dashboard/upload-background`
2. Go to "Body" tab → Select "form-data"
3. Add key "image" with type "File"
4. Upload an image file
5. Click Send

---

## 🌐 Deployment Configuration

### Environment Variables (.env):
```
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/cafe
PORT=5000
NODE_ENV=production
```

### Render Deployment:
1. Add `/uploads/dashboard/` to `.gitignore` (optional - for smaller deployments)
2. Or keep it in git if you want persistent storage
3. For production, use cloud storage (AWS S3, Cloudinary) instead of local disk

### Important: Cloud Storage Alternative
For production, consider using cloud storage:
- **Cloudinary** (free tier available)
- **AWS S3** (pay-as-you-go)
- **Firebase Storage**

This prevents images from being lost if the server restarts.

---

## 🛡️ Security Considerations

### Current Protections:
✅ File type validation (only images)
✅ File size limit (5MB)
✅ MIME type checking

### Additional Recommendations:
- Validate image dimensions
- Scan for malicious files
- Rate limit uploads
- Require admin authentication
- Use CDN for image serving

---

## 📊 Example File Structure After Uploads

```
backend/uploads/
└── dashboard/
    ├── 1717328400000-sunset.jpg (2.3 MB)
    ├── 1717328500000-morning-coffee.png (1.8 MB)
    ├── 1717328600000-cafe-interior.jpg (3.1 MB)
    └── 1717328700000-pastries.webp (890 KB)
```

---

## 🔗 Complete Integration Example

### Frontend (Admin.js):
```javascript
// Upload
const handleUpload = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  
  const res = await fetch(`http://localhost:5000/api/dashboard/upload-background`, {
    method: "POST",
    body: formData
  });
  
  const data = await res.json();
  // data.imageUrl = "/uploads/dashboard/1717328400000-file.jpg"
  setBackgroundImage(`http://localhost:5000${data.imageUrl}`);
};

// Display
<div style={{
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center'
}} />
```

---

## ✨ Summary

| Feature | Status | Details |
|---------|--------|---------|
| Image Upload | ✅ Working | POST endpoint implemented |
| Image Storage | ✅ Working | Stored in `/backend/uploads/dashboard/` |
| Image Retrieval | ✅ Working | GET endpoint for latest image |
| Image Deletion | ✅ Working | DELETE endpoint to remove all images |
| File Validation | ✅ Working | Only image files allowed (5MB max) |
| Static Serving | ✅ Working | Express serves `/uploads` folder |

---

*Last Updated: June 2, 2026*
*Backend Version: 1.0.0*
