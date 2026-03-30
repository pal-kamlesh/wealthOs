import { fmtFull } from "../utils/formatters.js";
import { getBudgetColor, getBudgetStatus, calculateBarColor } from "../utils/calculations.js";

export default function BudgetBar({ totalSpent, viewBudget, budgetPercentage }) {
  const status = getBudgetStatus(budgetPercentage);
  const barColor = calculateBarColor(budgetPercentage);
  const textColor = getBudgetColor(budgetPercentage);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] text-slate-500 uppercase tracking-widest">
          Budget Usage
        </span>
        <span className={`text-sm font-bold ${textColor}`}>
          {Math.round(budgetPercentage)}%{" "}
          {status.icon} {status.text}
        </span>
      </div>
      <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${budgetPercentage}%` }}
        />
      </div>
      <div className="flex justify-between text-[9px] text-slate-600 mt-1">
        <span>₹0</span>
        <span>{fmtFull(Math.round(viewBudget))}</span>
      </div>
    </div>
  );
}
