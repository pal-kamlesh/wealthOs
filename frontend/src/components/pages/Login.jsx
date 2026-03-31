import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../lib/api";
import { setToken } from "../../utils/auth";
import useExpenseStore from "../../store/useExpenceStore";
import { showToast } from "../../store/useToastStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const navigate = useNavigate();
  const setUser = useExpenseStore((s) => s.setUser);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.token) {
        setToken(data.token);
      }
      if (data.user) {
        setUser(data.user);
      }
      showToast.success(`Welcome back, ${data.user.username}!`);
      navigate("/dashboard");
    },
    onError: (err) => {
      setValidationError(err?.message || "Invalid credentials");
      showToast.error(err?.message || "Login failed");
    },
  });

  const validateForm = () => {
    setValidationError("");
    
    if (!email.trim()) {
      setValidationError("Email is required");
      return false;
    }
    if (!password) {
      setValidationError("Password is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError("Please enter a valid email");
      return false;
    }
    return true;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    loginMutation.mutate({ email, password });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin(e);
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen flex items-center justify-center text-white p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-[400px] shadow-xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold text-lg mx-auto mb-3 shadow-lg">
            ₹
          </div>
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="text-slate-400 text-sm mt-2">Login to manage your finances</p>
        </div>

        {/* Error Alert */}
        {validationError && (
          <div className="bg-red-900/30 border border-red-700/50 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">
            {validationError}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-lg font-semibold transition-colors mt-6"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-slate-400 text-sm text-center mt-6">
          Don't have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline font-semibold"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
