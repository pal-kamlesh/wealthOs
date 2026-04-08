import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import FinanceApp from "./components/FinanceApp";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import ProtectedRoute from "./components/pages/ProtectedRoute";
import ToastContainer from "./components/ToastContainer";
import { getToken, isAuthenticated } from "./utils/auth";
import { initializeSocket, closeSocket } from "./services/socketService";
import { useProfileStore } from "./store/useProfileStore";

function App() {
  useEffect(() => {
    // Initialize Socket.IO and fetch profile when user is logged in
    const token = getToken();
    if (token) {
      initializeSocket();
      useProfileStore.getState().fetchProfile();
    }

    // Cleanup on unmount
    return () => {
      closeSocket();
      useProfileStore.getState().clearProfile();
    };
  }, []);

  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={
            isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          }
        />

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
