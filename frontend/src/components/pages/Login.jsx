import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../lib/api";
import useExpenseStore from "../../store/useExpenceStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Pull setUser from Zustand to store logged-in user globally
  const setUser = useExpenseStore((s) => s.setUser);

  // ── Login mutation ──
  const loginMutation = useMutation({
    mutationFn: login, // calls your api utility
    onSuccess: (data) => {
      setUser(data.result); // store user in Zustand
      navigate("/dashboard");
    },
    onError: (err) => {
      alert(err?.message || "Invalid credentials");
    },
  });

  const handleLogin = () => {
    if (!email || !password) return alert("All fields are required");
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="bg-slate-950 min-h-screen flex items-center justify-center text-white">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-[350px] shadow-xl">
        <h2 className="text-xl font-bold mb-6 text-center">🔐 Login</h2>

        {/* Show server error inline instead of alert (optional improvement) */}
        {loginMutation.isError && (
          <p className="text-red-400 text-xs mb-3 text-center">
            {loginMutation.error?.message || "Login failed"}
          </p>
        )}

        <input
          type="text"
          placeholder="email"
          className="w-full mb-3 p-2 bg-slate-800 rounded-lg border border-slate-700 outline-none focus:border-blue-500"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 bg-slate-800 rounded-lg border border-slate-700 outline-none focus:border-blue-500"
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <button
          onClick={handleLogin}
          disabled={loginMutation.isPending}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed py-2 rounded-xl font-semibold transition-all"
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </button>

        <p className="text-xs text-slate-500 mt-4 text-center">
          Don't have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}
