import { useState } from "react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) return alert(data.message);

      alert("Signup successful!");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen flex items-center justify-center text-white">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-[350px] shadow-xl">
        <h2 className="text-xl font-bold mb-6 text-center">📝 Signup</h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full mb-3 p-2 bg-slate-800 rounded-lg border border-slate-700"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 bg-slate-800 rounded-lg border border-slate-700"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 bg-slate-800 rounded-lg border border-slate-700"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-xl font-semibold"
        >
          Signup
        </button>

        <p className="text-xs text-slate-500 mt-4 text-center">
          Already have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer"
            onClick={() => (window.location.href = "/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}