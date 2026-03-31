import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth.js";

export default function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render the protected component if authenticated
  return children;
}