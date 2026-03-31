# WealthOS - Personal Finance Management Application

A comprehensive full-stack financial management application built with React, Express, and MongoDB. Manage your expenses, track budgets, and gain insights into your spending habits.

## 🌟 Features

### ✅ Authentication
- User signup and login with email/password
- JWT-based authentication
- Secure token storage in localStorage
- Protected routes and API endpoints

### 💰 Expense Tracking
- Add, edit, and delete expenses
- Categorize expenses (Food, Transport, Entertainment, etc.)
- Date-based expense organization
- Real-time updates with optimistic UI

### 📊 Budget Management
- Set monthly budgets by category
- Track spending against budget limits
- Visual budget comparison and progress bars
- Dynamic budget adjustments

### 👤 User Profile
- View and edit profile information
- Set personal income
- Add phone number and bio
- Profile-based financial insights

### 📈 Analytics & Insights
- Daily and weekly expense charts
- Category breakdown analysis
- Spending trends and patterns
- KPI cards (total spent, remaining budget, etc.)

### 🎨 User Interface
- Dark theme with Tailwind CSS
- Responsive design
- Toast notifications for user feedback
- Smooth animations and transitions

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **React Query (TanStack Query)** - Data fetching and caching
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Vite** - Build tool

### Backend
- **Node.js/Express** - Server framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **CORS** - Cross-origin requests
- **Dotenv** - Environment variables

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
cd wealthOs
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Update .env with your MongoDB URI and JWT Secret
# MONGO_URI=mongodb://localhost:27017/wealthos
# JWT_SECRET=your_secret_key_here

# Start the backend server
npm start
# Server runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Update .env with your API base URL (should match backend)
# VITE_API_BASE_URL=http://localhost:5000

# Start the development server
npm run dev
# Frontend runs on http://localhost:5173
```

## 📁 Project Structure

```
wealthOs/
├── backend/
│   ├── config/           # Configuration files (logger, mongoose, etc.)
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Authentication and error middleware
│   ├── models/           # Database schemas
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── server.js         # Express app setup
│   └── .env.example      # Environment variables template
│
└── frontend/
    ├── src/
    │   ├── components/    # React components
    │   ├── hooks/         # Custom React hooks
    │   ├── lib/           # API utilities
    │   ├── store/         # Zustand stores
    │   ├── utils/         # Helper functions
    │   ├── App.jsx        # Main App component
    │   ├── main.jsx       # Entry point
    │   └── index.css      # Global styles
    ├── vite.config.js     # Vite configuration
    └── .env.example       # Environment variables template
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Expenses
- `GET /api/expenses` - Get all user expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Budget
- `GET /api/budget` - Get user budget
- `PUT /api/budget` - Update budget
- `PUT /api/budget/category` - Update category budget

### User Profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## 🔐 Authentication Flow

1. User signs up with email and password
2. Password is hashed with bcrypt
3. User logs in with email and password
4. Server generates JWT token
5. Token stored in localStorage
6. Token sent with every API request in Authorization header
7. Protected routes check for valid token

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px and above)
- Laptop (1366px to 1919px)
- Tablet (768px to 1365px)
- Mobile (320px to 767px)

## 🔔 Toast Notifications

User feedback through toast notifications:
- ✅ **Success** - Green toast for successful operations
- ❌ **Error** - Red toast for failed operations
- ℹ️ **Info** - Blue toast for information
- ⚠️ **Warning** - Yellow toast for warnings

Toasts auto-dismiss after 3-4 seconds or can be manually closed.

## 🎯 Key Features Implementation

### Expense Management
```javascript
// Add expense
const handleSaveExpense = async () => {
  const expenseData = {
    date: form.date,
    category: form.category,
    amount: parseFloat(form.amount),
    note: form.note,
  };
  await addExpense(expenseData);
  showToast.success("Expense added successfully!");
};
```

### Budget Tracking
```javascript
// Get budget and track spending
const viewBudget = getViewBudget(view, MONTHLY_BUDGET);
const budgetPercentage = calculateBudgetPercentage(totalSpent, viewBudget);
```

### Profile Management
```javascript
// Update user profile
const updateProfile = async (updatedData) => {
  await api.updateUserProfile(updatedData);
  showToast.success("Profile updated successfully!");
};
```

## 🚨 Error Handling

Comprehensive error handling throughout the application:
- **Client-side validation** - Form and input validation
- **Authorization errors** - 401 redirect to login
- **Server errors** - User-friendly error messages via toasts
- **Network errors** - Graceful fallbacks and retry options

## 📊 Data Models

### User
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  income: Number,
  phoneNumber: String,
  bio: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Expense
```javascript
{
  userId: ObjectId,
  date: String,
  category: String,
  amount: Number,
  note: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Budget
```javascript
{
  userId: ObjectId,
  categories: Array<{label, budget}>,
  totalMonthlyBudget: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔄 State Management

### Zustand Stores
- **useExpenseStore** - Global expense state
- **useToastStore** - Toast notification state

### React Query
- **useExpenses** - Expense data fetching and caching
- **useBudget** - Budget data management
- **useUserProfile** - User profile management

## 🎨 Customization

### Theme Colors
Edit Tailwind classes in components to change colors:
- Primary: Blue (`blue-600`)
- Secondary: Violet (`violet-600`)
- Accent: Orange (`orange-400`)

### Category Configuration
Modify categories in `frontend/src/utils/constants.js`:
```javascript
export const CATEGORIES = [
  { label: "Food & Dining", icon: "🍱", color: "#f97316", budget: 3000 },
  // Add more categories...
];
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or use MongoDB Atlas connection string
- Check `MONGO_URI` in backend `.env`

### CORS Error
- Verify `CORS_ORIGIN` in backend `.env` matches frontend URL
- Ensure backend is running on correct port

### Frontend can't reach backend
- Check `VITE_API_BASE_URL` in frontend `.env`
- Ensure backend server is running
- Verify firewall/network settings

### Authentication issues
- Clear browser localStorage and try again
- Verify JWT_SECRET is set in backend `.env`
- Check token expiration (set to 7 days)

## 📝 Development Notes

### Adding New Features
1. Create API endpoint in backend
2. Add API function in `frontend/src/lib/api.js`
3. Create custom hook if needed in `frontend/src/hooks/`
4. Integrate in component with proper error handling
5. Add toast notifications for user feedback

### Code Style
- Use functional React components with hooks
- Keep components small and reusable
- Use Tailwind CSS for styling
- Add proper error handling and validation

## 🚀 Deployment

### Backend (Heroku/Railway/Render)
1. Set up environment variables
2. Connect MongoDB Atlas
3. Deploy from git repository

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy dist folder
3. Set environment variables as needed

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support or questions, please open an issue in the repository.

---

**Happy tracking with WealthOS!** 💰📊✨
