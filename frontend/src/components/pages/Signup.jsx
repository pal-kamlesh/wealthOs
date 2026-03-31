import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { signup } from "../../lib/api";
import { showToast } from "../../store/useToastStore";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const navigate = useNavigate();

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      showToast.success("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    },
    onError: (err) => {
      setValidationError(err?.message || "Signup failed. Please try again.");
      showToast.error(err?.message || "Signup failed");
    },
  });

  const validateForm = () => {
    setValidationError("");
    
    if (!username.trim()) {
      setValidationError("Username is required");
      return false;
    }
    if (username.trim().length < 3) {
      setValidationError("Username must be at least 3 characters");
      return false;
    }
    if (!email.trim()) {
      setValidationError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError("Please enter a valid email");
      return false;
    }
    if (!password) {
      setValidationError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return false;
    }
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    signupMutation.mutate({ username, email, password });
  };

  return (
    <div className="bg-slate-950 min-h-screen flex items-center justify-center text-white p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-[400px] shadow-xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold text-lg mx-auto mb-3 shadow-lg">
            ₹
          </div>
          <h2 className="text-2xl font-bold">Create Account</h2>
          <p className="text-slate-400 text-sm mt-2">Join WealthOS to manage your finances</p>
        </div>

        {/* Error Alert */}
        {validationError && (
          <div className="bg-red-900/30 border border-red-700/50 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">
            {validationError}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={signupMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-lg font-semibold transition-colors mt-6"
          >
            {signupMutation.isPending ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-slate-400 text-sm text-center mt-6">
          Already have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline font-semibold"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}