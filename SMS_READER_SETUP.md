# 🚀 WealthOs SMS Reader - Complete Setup Guide

## Overview
This document provides step-by-step instructions to integrate the SMS Reader feature with your existing WealthOs project.

---

## 📋 Prerequisites

- Node.js 16+ 
- npm or yarn
- Android device or emulator (for React Native)
- Existing WealthOs backend running on port 5000
- Existing WealthOs frontend running on port 5173

---

## 🔧 BACKEND SETUP (Modified)

### 1. Install New Dependencies

```bash
cd backend
npm install socket.io crypto
```

### 2. Key Changes Made

**Files Modified:**
- `package.json` - Added Socket.IO and crypto
- `server.js` - Integrated Socket.IO with HTTP server

**Files Created:**
- `models/Transaction.js` - Transaction schema with duplicate detection
- `controllers/transactionController.js` - Transaction CRUD + stream operations
- `routes/transactionRoutes.js` - Transaction routes with auth middleware

### 3. Start Backend

```bash
npm run dev
```

You should see:
```
MongoDB connected
Server running on port 5000
```

---

## 🎨 FRONTEND SETUP (Modified)

### 1. Install New Dependencies

```bash
cd frontend
npm install socket.io-client
```

### 2. Key Changes Made

**Files Modified:**
- `package.json` - Added socket.io-client
- `src/App.jsx` - Socket.IO initialization after login
- `src/lib/api.js` - Added transaction API functions

**Files Created:**
- `src/services/socketService.js` - Socket.IO connection management
- `src/hooks/useRealtimeTransactions.js` - Real-time transaction listener hook

### 3. Features Added

- **Real-time Updates**: New transactions appear instantly without refresh
- **Toast Notifications**: Users notified immediately when new transactions arrive
- **Automatic Conversion**: SMS transactions auto-convert to expense format
- **Duplicate Prevention**: Backend prevents duplicate transactions

### 4. Start Frontend

```bash
npm run dev
```

---

## 📱 REACT NATIVE SMS READER APP (New)

### 1. Prerequisites for React Native

- Node.js and npm
- Expo CLI: `npm install -g expo-cli`
- Android device or emulator with Android 6.0+

### 2. Create the Project

```bash
# Create new directory
mkdir sms-reader-app
cd sms-reader-app

# Copy all files from the implementation files provided
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Android Permissions

The app requires these permissions (defined in `app.json`):
- `READ_SMS` - Read SMS messages
- `RECEIVE_SMS` - Listen to incoming SMS

These are automatically handled by Expo.

### 5. Run on Android

```bash
# Start Expo
npm start

# Choose "a" for Android
# Or manually open on emulator:
expo start --android
```

### 6. First-Time Login

1. Create user account via WealthOs signup (web)
2. Use same credentials in SMS Reader app
3. App will store JWT token locally
4. Start syncing SMS transactions

---

## 🔐 Authentication Flow

### Frontend (Web)
1. User logs in at `http://localhost:5173/login`
2. Backend returns JWT token
3. Token stored in browser localStorage
4. Socket.IO connection established automatically

### React Native App
1. User enters email/password
2. App sends to backend `/api/auth/login`
3. JWT token stored in AsyncStorage
4. Token added to all API requests

---

## 📤 SMS Transaction Flow

### Step 1: SMS Reading
- React Native app reads SMS from device
- Uses `expo-sms` library
- Requires `READ_SMS` permission

### Step 2: Smart Parsing
Multiple regex patterns handle these formats:
```
"Rs.500 debited from A/c to AMAZON via UPI"
"₹1000 credited from XYZ"
"Paid Rs 250 to Swiggy"
```

### Step 3: Duplicate Detection
- Checks against recent transactions
- Uses combination of: amount + merchant + timestamp
- Hash-based deduplication using SMS content
- Time window: 1 hour

### Step 4: Backend Ingestion
- POST request to `/api/transactions`
- JWT authentication required
- MongoDB stores transaction
- Emits WebSocket event

### Step 5: Real-Time UI Update
- Frontend Socket.IO listener receives event
- Automatically converts to Expense format
- Adds to Zustand store
- Toast notification shown
- User sees update instantly in dashboard

---

## 🧪 Testing the Feature

### Test 1: Manual SMS Sending
1. Run SMS Reader app on Android emulator
2. Send test SMS via emulator's extended controls:
   ```
   From: 1234567890
   Message: "Rs.500 debited from A/c to AMAZON via UPI on 12:30 PM"
   ```
3. Tap "Fetch & Sync SMS" button
4. Check frontend dashboard - transaction should appear instantly

### Test 2: Real Android Device
1. Install app via `expo build:android`
2. Use actual bank SMS
3. Tap sync button
4. Verify real transactions appear

### Test 3: Duplicate Prevention
1. Send same SMS twice
2. App detects and rejects duplicate
3. Shows "Duplicate transaction detected" error

### Test 4: Real-Time Sync
1. Keep frontend open
2. Trigger SMS sync from React Native app
3. Frontend updates without refresh
4. Toast notification appears

---

## 📊 API Reference

### Create Transaction
```bash
POST /api/transactions
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 500,
  "type": "debit",
  "merchant": "AMAZON",
  "channel": "UPI",
  "date": "2026-03-31T12:30:00Z",
  "timestamp": 1711870200000,
  "smsHash": "abc123def456"
}
```

### Get Transactions
```bash
GET /api/transactions?limit=50&skip=0
Authorization: Bearer {token}
```

### Batch Create
```bash
POST /api/transactions/batch
Authorization: Bearer {token}
Content-Type: application/json

{
  "transactions": [
    { /* transaction 1 */ },
    { /* transaction 2 */ }
  ]
}
```

### Check Duplicate
```bash
GET /api/transactions/check-duplicate/{smsHash}
Authorization: Bearer {token}
```

---

## 🔧 Environment Variables

### Backend (.env)
Existing variables work as-is:
```
MONGO_URI=mongodb://...
JWT_SECRET=your_secret
PORT=5000
```

### Frontend (.env or .env.local)
Optional:
```
VITE_API_BASE_URL=http://localhost:5000
```

### React Native (.env)
Create at root:
```
REACT_APP_API_URL=http://your-backend-url:5000
```

---

## 📱 Supported SMS Formats

The parser handles:

| Format | Example |
|--------|---------|
| "Rs.XXX debited/credited" | "Rs.500 debited from A/c to AMAZON via UPI" |
| "₹XXX credited/debited" | "₹1000 credited to your account from XYZ" |
| "Paid/Sent Rs XXX to" | "Paid Rs 250 to Swiggy" |
| Amount preserved | Rs.1,000.50 → 1000.50 |

Non-transaction keywords ignored:
- verification, otp, password, alert, balance, statement

---

## 🐛 Troubleshooting

### Issue: SMS app won't connect to backend

**Solution:**
```bash
# Check backend is running
curl http://localhost:5000/api/test

# Check CORS is enabled
# Verify API_URL in app is correct
```

### Issue: Duplicate transactions appearing

**Solution:**
- Duplication logic uses 1-minute window
- Check backend logs for errors
- Verify smsHash is being sent

### Issue: Real-time updates not working

**Solution:**
```bash
# Check Socket.IO connection
# In browser console:
console.log(localStorage.getItem('wealthos_token'))

# Restart backend to reinitialize Socket.IO
npm run dev
```

### Issue: Permissions denied on Android

**Solution:**
- Grant READ_SMS permission in app settings
- Restart app after granting
- For emulator: Send SMS via extended controls

---

## 🚀 Deployment

### Backend (Production)
Replace localhost URLs with production domain:
```javascript
cors: { 
  origin: "https://yourdomain.com", 
  credentials: true 
}
```

### Frontend (Production)
```bash
VITE_API_BASE_URL=https://your-api-domain.com npm run build
```

### React Native (Production)
```bash
expo build:android --release
# Upload to Google Play / Firebase Hosting
```

---

## 📝 Database Schema

### Transaction Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  amount: Number,
  type: "credit" | "debit",
  merchant: String,
  channel: "UPI" | "SMS" | "NEFT" | "IMPS" | "RTGS",
  date: Date,
  timestamp: Number,
  smsHash: String (unique),
  category: String,
  duplicateCheckHash: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## ✅ Verification Checklist

- [ ] Backend runs on port 5000
- [ ] Frontend runs on port 5173
- [ ] Socket.IO connected (check browser console)
- [ ] React Native app created and dependencies installed
- [ ] MongoDB Transaction collection created
- [ ] SMS permissions granted on Android
- [ ] First transaction synced successfully
- [ ] Real-time update visible in frontend
- [ ] Duplicate detection working
- [ ] Toast notifications appearing

---

## 🎁 Bonus: Improvements & Next Steps

### Suggested Enhancements

1. **Background SMS Listening**
   - Use React Native BroadcastReceiver
   - Auto-sync without manual tap
   - Works even when app is closed

2. **Machine Learning-Based Categorization**
   - Auto-assign expense categories
   - Learn from user patterns
   - Improve transaction recognition

3. **Scheduled Sync**
   - Background jobs every 15 minutes
   - Configurable sync intervals
   - Battery optimization

4. **Advanced Analytics**
   - Transaction trend analysis
   - Merchant spending patterns
   - Budget auto-recommendations

5. **Multi-Account Support**
   - Sync from multiple bank accounts
   - Separate transaction streams
   - Consolidated dashboard

---

## 📞 Support

For issues or questions:
1. Check logs: `npm run dev`
2. Verify all ports are correct
3. Ensure MongoDB connection works
4. Check Android permissions
5. Review Socket.IO connection status

---

**Happy syncing! 🎉**
