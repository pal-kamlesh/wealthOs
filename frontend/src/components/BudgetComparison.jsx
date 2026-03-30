import { fmtFull, fmt, startOf } from "../utils/formatters.js";
import { CATEGORIES } from "../utils/constants.js";

export default function BudgetComparison({ expenses, budget }) {
  const categories = budget?.categories || CATEGORIES;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-4">
        Budget vs Actual (This Month)
      </div>
      <div className="space-y-3">
        {categories.map((cat) => {
          const monthStart = fmt(startOf("month"));
          const spent = expenses
            .filter((e) => e.date >= monthStart && e.category === cat.label)
            .reduce((s, e) => s + e.amount, 0);
          const pct = Math.min((spent / cat.budget) * 100, 100);
          const over = spent > cat.budget;
          return (
            <div key={cat.label} className="flex items-center gap-3">
              <span className="text-base w-6 text-center">{cat.icon}</span>
              <div className="flex-1">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-slate-400">{cat.label}</span>
                  <span
                    className={`font-semibold ${over ? "text-red-400" : "text-slate-500"}`}
                  >
                    {fmtFull(spent)} / {fmtFull(cat.budget)}
                    {over ? " 🔴" : ""}
                  </span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: over ? "#ef4444" : cat.color,
                      opacity: 0.8,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
