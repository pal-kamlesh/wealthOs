import { fmtFull, fmt, startOf } from "../utils/formatters.js";
import { MONTHLY_BUDGET } from "../utils/constants.js";
import { calculateCategoryBreakdown } from "../utils/calculations.js";

export default function InsightCards({ expenses, categoryBreakdown }) {
  const today = new Date();
  const monthStart = fmt(startOf("month"));
  const monthExp = expenses.filter((e) => e.date >= monthStart);
  const monthTotal = monthExp.reduce((s, e) => s + e.amount, 0);
  const avgDaily = monthTotal / Math.max(new Date(today).getDate(), 1);
  const projMonth = avgDaily * 30;
  const topCat = categoryBreakdown[0];

  const insights = [
    {
      icon: "🔥",
      title: topCat
        ? `${topCat.icon} ${topCat.label} is your top expense`
        : "Balanced spending!",
      desc: topCat
        ? `${fmtFull(topCat.amount)} spent on ${topCat.label} — ${Math.round((topCat.amount / (monthTotal || 1)) * 100)}% of your discretionary budget this month.`
        : "Your spending is well distributed across categories.",
      border: "border-orange-800/30",
      bg: "bg-orange-950/20",
    },
    {
      icon: projMonth > MONTHLY_BUDGET ? "⚠️" : "✅",
      title: `Projected monthly spend: ${fmtFull(Math.round(projMonth))}`,
      desc: `Avg ₹${Math.round(avgDaily)}/day → ₹${Math.round(projMonth).toLocaleString("en-IN")} this month. ${projMonth > MONTHLY_BUDGET ? `Over budget by ${fmtFull(Math.round(projMonth - MONTHLY_BUDGET))}! Cut back on non-essentials.` : `Under budget by ${fmtFull(Math.round(MONTHLY_BUDGET - projMonth))} 🎉`}`,
      border:
        projMonth > MONTHLY_BUDGET
          ? "border-red-800/30"
          : "border-emerald-800/30",
      bg:
        projMonth > MONTHLY_BUDGET
          ? "bg-red-950/20"
          : "bg-emerald-950/20",
    },
    {
      icon: "💡",
      title: "Meal prep = ₹9,600/year saved",
      desc: "Cooking at home just 3 days/week saves ~₹800/month. That's almost 1.5 months of extra SIP contributions compounding at 12%.",
      border: "border-blue-800/30",
      bg: "bg-blue-950/20",
    },
    {
      icon: "🚀",
      title: "Step-up your SIP next month",
      desc: "You have ₹10,500 free cash after rent + SIP. Even bumping SIP by ₹500/month grows your 10Y corpus by ₹1.1L extra. Do it now.",
      border: "border-violet-800/30",
      bg: "bg-violet-950/20",
    },
  ];

  return (
    <div className="space-y-3">
      {insights.map((ins, i) => (
        <div
          key={i}
          className={`border ${ins.border} ${ins.bg} rounded-2xl p-4`}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5">{ins.icon}</span>
            <div>
              <div className="text-sm font-semibold text-slate-200 mb-1">
                {ins.title}
              </div>
              <div className="text-xs text-slate-400 leading-relaxed">
                {ins.desc}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
