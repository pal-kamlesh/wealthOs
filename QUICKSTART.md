# Quick Start Guide for WealthOS

## ⚡ 5-Minute Setup

### Prerequisites
- Node.js installed
- MongoDB running locally (or MongoDB Atlas connection string)

### Step 1: Backend Setup (2 minutes)

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGO_URI=mongodb://localhost:27017/wealthos
JWT_SECRET=replace_with_random_secret_key
NODE_ENV=development
EOF

# Start backend
npm start
```

Backend will run on `http://localhost:5000`

### Step 2: Frontend Setup (2 minutes)

```bash
cd ../frontend

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

Frontend will run on `http://localhost:5173`

### Step 3: Access Application (1 minute)

1. Open browser to `http://localhost:5173`
2. Click "Sign Up" and create account
3. Login with your credentials
4. Start tracking expenses!

## 🎯 Your First Steps

1. **Add Income** - Go to Profile tab and set your monthly income
2. **Set Budget** - Go to Settings and configure category budgets
3. **Add Expense** - Click "+ New Expense" and track your spending
4. **View Analytics** - Check Overview and Insights tabs

## 📚 Common Commands

### Backend
```bash
npm start          # Start server
npm run dev        # Start with nodemon for development
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 🔧 Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/wealthos
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=WealthOS
VITE_ENVIRONMENT=development
```

## ⚠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB Connection Error | Ensure MongoDB is running: `mongod` |
| CORS Error | Check both backend and frontend are running |
| Token Errors | Clear localStorage or restart browser |
| Port Already in Use | Change PORT in .env file |

## 🌐 URL References

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **API Docs**: Available at /api/test endpoint

## 📱 Mobile Testing

To test on mobile, update frontend .env:
```
VITE_API_BASE_URL=http://YOUR_LAPTOP_IP:5000
```

Then access frontend from mobile:
```
http://YOUR_LAPTOP_IP:5173
```

## 🚀 Next Steps

1. Read the full [README.md](./README.md)
2. Explore the codebase structure
3. Customize categories in constants.js
4. Add more features!

---

**Questions?** Check the README.md for detailed documentation!
