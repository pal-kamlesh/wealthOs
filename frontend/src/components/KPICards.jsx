import { fmtFull } from "../utils/formatters.js";

export default function KPICards({ totalSpent, viewBudget, view, filtered }) {
  const remaining = Math.max(0, Math.round(viewBudget - totalSpent));
  const isOverBudget = totalSpent > viewBudget;

  return (
    <div className="grid grid-cols-4 gap-3">
      {[
        {
          label: "Spent",
          val: fmtFull(totalSpent),
          sub: `${view} total`,
          color: "text-orange-400",
        },
        {
          label: "Budget",
          val: fmtFull(Math.round(viewBudget)),
          sub: `${view} limit`,
          color: "text-slate-300",
        },
        {
          label: "Remaining",
          val: fmtFull(remaining),
          sub: "left to spend",
          color: isOverBudget ? "text-red-400" : "text-emerald-400",
        },
        {
          label: "Transactions",
          val: filtered.length,
          sub: `${view} entries`,
          color: "text-blue-400",
        },
      ].map((k, i) => (
        <div
          key={i}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all"
        >
          <div
            className={`text-2xl font-bold leading-none ${k.color}`}
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            {k.val}
          </div>
          <div className="text-slate-500 text-[10px] mt-1.5 uppercase tracking-widest">
            {k.label}
          </div>
          <div className="text-slate-600 text-[9px] mt-0.5">{k.sub}</div>
        </div>
      ))}
    </div>
  );
}
