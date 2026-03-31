# 🚀 WealthOS - Complete Setup & Deployment Guide

## What's Included ✨

Your WealthOS application is now **fully integrated** with:

### ✅ Complete Backend
- Express.js server with MongoDB
- Authentication system (JWT)
- Expense management API
- Budget tracking API
- User profile API
- Error handling & logging

### ✅ Complete Frontend
- React with Vite
- Protected routes
- Authentication pages (Login/Signup)
- Dashboard with tabs
- Expense management UI
- Budget settings
- User profile editor
- Analytics & charts
- Toast notifications

### ✅ Database Ready
- User model with income
- Expense model
- Budget model
- Proper indexing and relationships

---

## 📋 Quick Setup (3 Steps)

### Step 1: Backend Setup (from `/backend`)

```bash
# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGO_URI=mongodb://localhost:27017/wealthos
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
NODE_ENV=development
EOF

# Start backend
npm start
```

**Expected Output:**
```
✅ MongoDB connected
✅ Server running on port 5000
```

### Step 2: Frontend Setup (from `/frontend`)

```bash
# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=WealthOS
VITE_ENVIRONMENT=development
EOF

# Start frontend
npm run dev
```

**Expected Output:**
```
VITE v4.x.x  ready in XXX ms
➜  Local:   http://localhost:5173/
➜  Press h for help
```

### Step 3: Access Application

1. Open browser: `http://localhost:5173`
2. Click "Sign Up"
3. Create account with email/password
4. Login with your credentials
5. Start tracking expenses!

---

## 🎯 First Time User Guide

### On First Login:
1. **Go to Profile Tab** → Set your monthly income
2. **Go to Settings Tab** → Verify/adjust budget per category
3. **Go to Tracker Tab** → Add your first expense
4. **Go to Overview Tab** → See your spending breakdown

### Key Features:
- ✅ **Add Expense**: Click "+ New Expense" button
- ✅ **Edit Expense**: Hover and click ✏️
- ✅ **Delete Expense**: Hover and click 🗑️
- ✅ **Filter**: Use category filter dropdown
- ✅ **View Modes**: Switch between Daily/Weekly/Monthly/Yearly

---

## 📁 Project Structure

```
wealthOs/
├── backend/
│   ├── controllers/       # Business logic
│   ├── models/           # Database schemas
│   ├── routes/           # API endpoints
│   ├── middleware/        # Auth, error handling
│   ├── config/           # Logger, DB config
│   ├── server.js         # Express setup
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── store/         # Zustand stores
│   │   ├── lib/           # API utilities
│   │   ├── utils/         # Helpers
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── .env.example
│
├── README.md             # Full documentation
├── QUICKSTART.md         # Quick setup
└── INTEGRATION_CHECKLIST.md
```

---

## 🔑 Environment Variables

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/wealthos

# JWT
JWT_SECRET=your_random_secret_key_here

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)

```env
# API
VITE_API_BASE_URL=http://localhost:5000

# App Info
VITE_APP_NAME=WealthOS
VITE_ENVIRONMENT=development
```

---

## 🔄 Available Commands

### Backend
```bash
npm start          # Start server
npm run dev        # Start with auto-reload (if nodemon installed)
npm test           # Run tests (if configured)
```

### Frontend
```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────┐
│  User at http://localhost:5173      │
└─────────────────────────────────────┘
           ↓
    ┌──────────────┐
    │  Home/Login  │
    └──────────────┘
           ↓
  ┌────────────────────┐
  │ Email & Password   │
  │ Validation on UI   │
  └────────────────────┘
           ↓
  ┌────────────────────────────────────┐
  │ POST /api/auth/login               │
  │ Headers: Content-Type: application/json
  │ Body: {email, password}            │
  └────────────────────────────────────┘
           ↓
  ┌────────────────────────────────────┐
  │ Backend: Hash password check       │
  │ Generate JWT token                 │
  │ Return token + user data           │
  └────────────────────────────────────┘
           ↓
  ┌────────────────────────────────────┐
  │ Frontend: Save token to localStorage
  │ Redirect to /dashboard             │
  │ Store user in Zustand              │
  └────────────────────────────────────┘
           ↓
  ┌────────────────────────────────────┐
  │ All API requests include token:    │
  │ Authorization: Bearer {token}      │
  └────────────────────────────────────┘
```

---

## 📊 API Response Examples

### Login Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "income": 50000
  }
}
```

### Expense Response
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "date": "2024-03-31",
  "category": "Food & Dining",
  "amount": 250,
  "note": "Lunch at restaurant",
  "createdAt": "2024-03-31T10:30:00Z",
  "updatedAt": "2024-03-31T10:30:00Z"
}
```

### Profile Response
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "income": 50000,
  "phoneNumber": "+91-9876543210",
  "bio": "Finance enthusiast",
  "createdAt": "2024-03-15T05:20:00Z",
  "updatedAt": "2024-03-31T10:45:00Z"
}
```

---

## ⚠️ Common Issues & Solutions

### Issue: "MongoDB connection error"
```
❌ Error: connect ECONNREFUSED 127.0.0.1:27017

✅ Solution:
   macOS/Linux: mongod --dbpath /usr/local/var/mongodb
   Windows: mongod
```

### Issue: "CORS error"
```
❌ Error: Access to XMLHttpRequest blocked by CORS

✅ Solution:
   Check CORS_ORIGIN in backend .env
   Verify frontend URL matches
   Backend should be at http://localhost:5000
   Frontend should be at http://localhost:5173
```

### Issue: "Invalid token"
```
❌ Error: Invalid token

✅ Solution:
   Clear localStorage: localStorage.clear()
   Logout and login again
   Check JWT_SECRET is same in Backend
```

### Issue: "Port already in use"
```
❌ Error: listen EADDRINUSE :::5000

✅ Solution:
   Change PORT in .env to 5001 (or another port)
   Or kill process: lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill
```

### Issue: "Cannot find module"
```
❌ Error: Cannot find module 'express'

✅ Solution:
   cd backend (or frontend)
   npm install
```

---

## 🧪 Testing the Application

### Login Test
```bash
# Create test account
Username: testuser
Email: test@example.com
Password: password123

# Login and verify income shows in header
```

### Expense Test
```javascript
// Steps:
1. Go to Tracker tab
2. Click "+ New Expense"
3. Amount: 500
4. Date: Today
5. Category: Food & Dining
6. Note: Test expense
7. Click "Save Expense"
8. Verify toast notification "Expense added successfully!"
```

### Budget Test
```javascript
// Steps:
1. Go to Settings tab
2. Find "Food & Dining" category
3. Click ✏️ Edit
4. Change amount to 2500
5. Click Save
6. Verify toast notification
```

### Profile Test
```javascript
// Steps:
1. Go to Profile tab
2. Click "Edit Profile"
3. Change income to 75000
4. Click "Save Changes"
5. Verify toast notification
6. Check header shows new income
```

---

## 📱 Mobile Testing

### On Your Phone/Tablet:
```bash
# Find your laptop IP
# Windows: ipconfig (look for IPv4 Address)
# macOS/Linux: ifconfig (look for inet)

# Access from mobile:
http://YOUR_LAPTOP_IP:5173
```

---

## 🚀 Deployment Preparation

### Before Deploying:

1. **Backend Files to Update:**
   - `.env` - Use production values
   - Set `NODE_ENV=production`
   - Use strong `JWT_SECRET`
   - Use production `MONGO_URI` (Atlas)

2. **Frontend Files to Build:**
   ```bash
   npm run build
   # This creates dist/ folder for deployment
   ```

3. **Environment Checklist:**
   - [ ] Production database URI
   - [ ] Strong JWT_SECRET
   - [ ] Correct CORS_ORIGIN
   - [ ] API_BASE_URL pointing to production backend
   - [ ] NODE_ENV=production

### Deployment Options:

**Backend:**
- Heroku: `git push heroku main`
- Railway: Connect git repo
- Render: Connect git repo
- DigitalOcean: SSH and deploy

**Frontend:**
- Vercel: Import git repo (automatic)
- Netlify: Deploy dist folder
- GitHub Pages: Build and deploy
- AWS S3 + CloudFront: Upload dist

**Database:**
- MongoDB Atlas (cloud, free tier available)

---

## 📚 Documentation Files

- **README.md** - Complete documentation
- **QUICKSTART.md** - Quick start guide
- **INTEGRATION_CHECKLIST.md** - Feature checklist
- **This file** - Setup & deployment guide

---

## 🎓 Learning Resources

### Frontend
- React Hooks: https://react.dev/reference/react
- React Router: https://reactrouter.com/
- Tailwind CSS: https://tailwindcss.com/
- Zustand: https://github.com/pmndrs/zustand

### Backend
- Express.js: https://expressjs.com/
- MongoDB: https://docs.mongodb.com/
- JWT: https://jwt.io/
- Mongoose: https://mongoosejs.com/

---

## 🎯 Next Steps

1. ✅ Run backend and frontend
2. ✅ Sign up and create account
3. ✅ Add income in profile
4. ✅ Add some expenses
5. ✅ Check analytics
6. ✅ Customize budget
7. ✅ Explore all features
8. 📦 Deploy to production
9. 🎉 Share with users

---

## 📞 Support & Troubleshooting

### Getting Help:
1. Check error messages carefully
2. Look in console for detailed errors
3. Verify all .env variables
4. Clear browser cache
5. Restart servers
6. Check documentation

### Debug Mode:
```javascript
// In browser console:
localStorage.getItem('token')  // Check token
localStorage.getItem('user')   // Check user data

// Backend: Check logs in console for details
```

---

## 🏆 Your Application is Ready!

**You now have a complete, production-ready financial management application with:**

- ✨ Beautiful dark theme UI
- 🔐 Secure authentication
- 💰 Expense tracking
- 📊 Budget management
- 👤 User profiles
- 📈 Analytics & insights
- ⚡ Real-time updates
- 📱 Mobile responsive
- 🔔 Toast notifications
- ⚙️ Full backend integration

**🎉 Congratulations! Your WealthOS app is ready to use!**

---

## 📞 Quick Reference

| Component | Status | Location |
|-----------|--------|----------|
| Backend Server | ✅ Ready | `http://localhost:5000` |
| Frontend App | ✅ Ready | `http://localhost:5173` |
| MongoDB | ✅ Ready | `mongodb://localhost:27017` |
| API Docs | ✅ Ready | `/api/test` endpoint |
| Dashboard | ✅ Ready | `/dashboard` route |
| Profile | ✅ Ready | Profile tab |
| Settings | ✅ Ready | Settings tab |

---

**Happy coding and tracking! 💰📊✨**
