# 🍹 Brew Haven Full-Stack Café Website - Complete Setup Guide

## ✅ What's Been Completed

### 1. **Frontend Pages with Background Images**
- ✅ **Home Page** (`src/pages/Home.js`) - Hero banner with coffee background
- ✅ **Menu Page** (`src/pages/Menu.js`) - Beautiful café background with menu items
- ✅ **Cart Page** (`src/pages/Cart.js`) - Order placement with customer form
- ✅ **About Page** (`src/pages/About.js`) - Company story with café aesthetic
- ✅ **Contact Page** (`src/pages/Contact.js`) - Contact form with proper branding

### 2. **Backend API Endpoints**
- ✅ **Orders API** - `/api/orders` (POST, GET, PUT)
- ✅ **Menu API** - `/api/menu` (GET, POST)
- ✅ **Dashboard Image Upload** - `/api/dashboard/upload-background` (NEW)
- ✅ **Dashboard Image Retrieval** - `/api/dashboard/background` (NEW)

### 3. **Admin Dashboard Features**
- ✅ Order management with status updates
- ✅ Local fallback storage for offline orders
- ✅ **Background image upload feature** (stores images in `/backend/uploads/dashboard/`)
- ✅ Real-time order statistics

### 4. **Database Setup**
- ✅ MongoDB integration for orders
- ✅ Local storage fallback for offline functionality

---

## 🚀 How to Run the Project

### **Step 1: Start the Backend Server**
```bash
cd backend
npm install
npm start  # or npx nodemon server.js for development
```
✅ Server runs on: `http://localhost:5000`
✅ Health check: `http://localhost:5000/api/health`

### **Step 2: Start the Frontend**
```bash
cd frontend
npm install
npm start
```
✅ Frontend runs on: `http://localhost:3000`

### **Step 3: Test the Application**

#### Test Flows:
1. **Home Page** → Navigate to `/` and see hero banner
2. **Menu** → Go to `/menu`, add items to cart, see images load
3. **Cart** → Click cart button, enter name/phone, place order
4. **Orders** → Admin can see orders at `/admin`
5. **Dashboard Background** → Upload image in admin dashboard

---

## 📁 Backend File Structure & Image Storage

### Backend Directory:
```
backend/
├── server.js                    # Main server file
├── package.json                 # Dependencies (includes multer)
├── .env                         # Environment variables
├── uploads/                     # 📁 Image storage folder
│   └── dashboard/              # 📁 Dashboard background images
├── models/                      # MongoDB schemas
├── routes/                      # API endpoints
└── node_modules/                # Dependencies
```

### **Image Storage Location**
- **Path**: `c:\Users\Shrika\FUTURE_FS_03\backend\uploads\dashboard\`
- **Access URL**: `http://localhost:5000/uploads/dashboard/[filename]`
- **Max File Size**: 5MB
- **Allowed Types**: JPEG, PNG, GIF, WebP

---

## 🔧 API Endpoints Reference

### **Orders API**
```
POST   /api/orders           → Place new order
GET    /api/orders           → Fetch all orders
PUT    /api/orders/:id       → Update order status
```

### **Menu API**
```
GET    /api/menu             → Fetch all menu items
POST   /api/menu             → Add new menu item
```

### **Dashboard Image API** (NEW)
```
POST   /api/dashboard/upload-background    → Upload dashboard background
GET    /api/dashboard/background           → Get current dashboard background
DELETE /api/dashboard/background           → Delete dashboard background
```

---

## 🎨 Pages & Background Images

| Page | Background Image | Location |
|------|-----------------|----------|
| Home | Coffee latte background | From Unsplash (URL) |
| Menu | Café pastry background | From Unsplash (URL) + Overlay |
| Cart | Coffee ordering background | From Unsplash (URL) + Overlay |
| About | Café interior background | From Unsplash (URL) + Overlay |
| Admin | **Customizable** | Backend uploads folder |

---

## 📋 Customer Order Flow

1. Customer visits website
2. Browse menu at `/menu`
3. Add items to cart (stored in localStorage)
4. Click "Proceed to Cart"
5. Enter **Name** and **10-digit Phone**
6. Click "Place Order"
7. Order saves to:
   - ✅ Backend MongoDB (if connected)
   - ✅ Local storage (if backend unavailable)
8. Admin can view all orders at `/admin`

---

## 🔐 Admin Dashboard Features

1. **View All Orders**
   - Shows backend orders + local fallback orders
   - Displays customer name, phone, items, total, status

2. **Update Order Status**
   - Pending → Confirmed → Preparing → Ready → Delivered
   - Or mark as Cancelled

3. **Order Statistics**
   - Total orders count
   - Pending orders count
   - Delivered orders count
   - Total revenue in ₹

4. **Upload Dashboard Background**
   - Click "📤 Upload Background Image"
   - Select image from computer (max 5MB)
   - Image stored at: `/backend/uploads/dashboard/`
   - Image applied with semi-transparent overlay

---

## 🛠️ Configuration

### Frontend Config (`src/config.js`)
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const API_ENDPOINTS = {
  ORDERS: `${API_BASE_URL}/orders`,
  MENU: `${API_BASE_URL}/menu`,
  HEALTH: `${API_BASE_URL.replace('/api', '')}/api/health`
};
```

### Backend Config (`backend/.env`)
```
MONGO_URI=mongodb://127.0.0.1:27017/cafe
PORT=5000
```

---

## 🚢 Deployment Instructions

### **Frontend Deployment (Netlify/Vercel)**

1. **Push to GitHub** (shrika223):
   ```bash
   git init
   git add .
   git commit -m "Full-stack café website"
   git branch -M main
   git remote add origin https://github.com/shrika223/cafe-website.git
   git push -u origin main
   ```

2. **Deploy on Netlify**:
   - Go to https://netlify.com
   - Connect GitHub repository
   - Build command: `npm run build`
   - Publish directory: `build`
   - Add environment variable: `REACT_APP_API_URL=https://your-backend.com/api`

### **Backend Deployment (Render/Heroku)**

1. **Create Procfile** (backend folder):
   ```
   web: node server.js
   ```

2. **Deploy on Render**:
   - Create account at https://render.com
   - Connect GitHub
   - Service type: Web Service
   - Build command: `npm install`
   - Start command: `npm start`
   - Add environment variable: `MONGO_URI=your_mongodb_uri`

3. **Database Setup**:
   - Use MongoDB Atlas for cloud database
   - Get connection string from https://mongodb.com/cloud/atlas
   - Add to `.env` file

---

## 📸 Image References

### Menu Items (from Unsplash):
- Espresso: https://images.unsplash.com/photo-1470337458703-46ad1756a187
- Cappuccino: https://images.unsplash.com/photo-1509042239860-f550ce710b93
- Latte: https://images.unsplash.com/photo-1495474472287-4d71bcdd2085
- Americano: https://images.unsplash.com/photo-1498804103079-a6351b050096
- Blueberry Muffin: https://images.unsplash.com/photo-1499636136210-6f4ee915583e
- Chocolate Croissant: https://images.unsplash.com/photo-1521305916504-4a1121188589
- Veg Sandwich: https://images.unsplash.com/photo-1512621776951-a57141f2eefd
- **Cheesecake**: https://images.unsplash.com/photo-1549187774-b4e9b0445b00 ✅

---

## ✨ Key Features Summary

| Feature | Status | Location |
|---------|--------|----------|
| Home Page | ✅ Complete | `src/pages/Home.js` |
| Menu Page | ✅ Complete | `src/pages/Menu.js` |
| Cart Page | ✅ Complete | `src/pages/Cart.js` |
| About Page | ✅ Complete | `src/pages/About.js` |
| Contact Page | ✅ Complete | `src/pages/Contact.js` |
| Admin Dashboard | ✅ Complete | `src/pages/Admin.js` |
| Navbar | ✅ Complete | `src/components/Navbar.js` |
| Footer | ✅ Complete | `src/components/Footer.js` |
| Orders API | ✅ Complete | `backend/routes/orderRoutes.js` |
| Menu API | ✅ Complete | `backend/routes/menuRoutes.js` |
| Image Upload | ✅ NEW | `backend/server.js` |
| MongoDB Integration | ✅ Complete | `backend/server.js` |
| Local Storage Fallback | ✅ Complete | All pages |

---

## 🐛 Troubleshooting

### Backend Connection Issues
```bash
# Check if backend is running
curl http://localhost:5000/api/health

# If error, restart backend
npm start
```

### Images Not Loading
- Clear browser cache (Ctrl + Shift + Delete)
- Verify Unsplash URLs are accessible
- Check internet connection

### Orders Not Saving
- Verify MongoDB is running
- Check backend console for errors
- Orders will save locally if backend is unavailable

### Admin Dashboard Styling
- Ensure CSS file is loaded: `src/App.css`
- Check background image paths in admin component

---

## 📞 Contact Information (Updated)
- **Email**: hello@brewhaven.com
- **Phone**: +91 98765 43210
- **Location**: MG Road, Mangaluru - 575001

---

## 🎉 You're All Set!

Your full-stack café website is now:
1. ✅ Fully functional with frontend + backend
2. ✅ Ready with beautiful background images
3. ✅ Integrated with MongoDB for orders
4. ✅ Admin dashboard working with image uploads
5. ✅ Ready for deployment

**Next Steps**: Deploy to GitHub and host on Netlify/Render!

---

*Last Updated: June 2, 2026*
*Café Name: Brew Haven ☕*
