import { fmtFull, fmt, startOf } from "../utils/formatters.js";

export default function OverviewCards({ expenses, salary }) {
  const monthStart = fmt(startOf("month"));
  const monthlySpent = expenses
    .filter((e) => e.date >= monthStart)
    .reduce((s, e) => s + e.amount, 0);

  return (
    <div className="grid grid-cols-3 gap-4">
      {[
        {
          label: "Monthly Salary",
          val: fmtFull(salary),
          sub: "take-home income",
          grad: "from-emerald-900/30",
          border: "border-emerald-800/30",
          txt: "text-emerald-400",
        },
        {
          label: "Invested (SIP+EF)",
          val: "₹10,000",
          sub: "₹8K SIP + ₹2K emergency fund",
          grad: "from-blue-900/30",
          border: "border-blue-800/30",
          txt: "text-blue-400",
        },
        {
          label: "Spent This Month",
          val: fmtFull(monthlySpent),
          sub: "discretionary",
          grad: "from-orange-900/30",
          border: "border-orange-800/30",
          txt: "text-orange-400",
        },
      ].map((k, i) => (
        <div
          key={i}
          className={`bg-gradient-to-br ${k.grad} to-slate-900 border ${k.border} rounded-2xl p-5`}
        >
          <div
            className={`text-3xl font-bold leading-none ${k.txt}`}
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            {k.val}
          </div>
          <div className="text-slate-400 text-xs mt-2 font-medium">
            {k.label}
          </div>
          <div className="text-slate-600 text-[10px] mt-0.5">{k.sub}</div>
        </div>
      ))}
    </div>
  );
}
