import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import FinanceApp from "./components/FinanceApp";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import ProtectedRoute from "./components/pages/ProtectedRoute";
import ToastContainer from "./components/ToastContainer";
import { getToken } from "./utils/auth";
import { initializeSocket, closeSocket } from "./services/socketService";

function App() {
  useEffect(() => {
    // Initialize Socket.IO when user is logged in
    const token = getToken();
    if (token) {
      initializeSocket();
    }

    // Cleanup on unmount
    return () => {
      closeSocket();
    };
  }, []);

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
