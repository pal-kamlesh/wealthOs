import { TABS } from "../utils/constants.js";
import { useNavigate } from "react-router-dom";
import { clearAuth } from "../utils/auth.js";
import { useProfileStore } from "../store/useProfileStore.js";

export default function Header({ tab, onTabChange }) {
  const navigate = useNavigate();
  const { profile, loading } = useProfileStore();

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      clearAuth();
      navigate("/login");
    }
  };

  const income = profile?.income || 0;
  const sip = profile?.sip || 0;
  const emergencyFund = profile?.emergencyFund || 0;
  const availableBudget = Math.max(0, income - sip - emergencyFund);

  const incomeDisplay = income
    ? `₹${income.toLocaleString()}/month`
    : "Loading...";
  const budgetDisplay = availableBudget
    ? `₹${availableBudget.toLocaleString()} available`
    : "₹0 available";

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-900/50">
          ₹
        </div>
        <div>
          <div
            className="text-white font-bold text-base"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            WealthOS
          </div>
          <div className="text-slate-500 text-[10px]">
            {loading ? "Loading..." : `${incomeDisplay} · ${budgetDisplay}`}
          </div>
        </div>
      </div>
      <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            className={`px-4 py-1.5 rounded-lg text-xs transition-all font-mono ${
              tab === t.id
                ? "bg-blue-900/70 text-blue-300 font-semibold"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {t.label}
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="px-4 py-1.5 rounded-lg text-xs transition-all font-mono text-slate-500 hover:text-red-400 ml-2"
          title="Logout"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
