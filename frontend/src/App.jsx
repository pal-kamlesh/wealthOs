import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import FinanceApp from "./components/FinanceApp";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import ProtectedRoute from "./components/pages/ProtectedRoute";
import ToastContainer from "./components/ToastContainer";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Dashboard (your FinanceApp) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <FinanceApp />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
