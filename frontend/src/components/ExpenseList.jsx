import { fmtFull, formatDateRange, catMeta, fmt } from "../utils/formatters.js";
import { CATEGORIES } from "../utils/constants.js";

export default function ExpenseList({
  filtered,
  today,
  onEdit,
  onDelete,
  onAddNew,
}) {
  if (filtered.length === 0) {
    return (
      <div className="text-center py-16 text-slate-600">
        <div className="text-5xl mb-3">🧾</div>
        <div className="text-sm mb-1">No expenses for this period</div>
        <button
          onClick={onAddNew}
          className="text-blue-400 text-xs hover:underline mt-1"
        >
          + Add your first expense
        </button>
      </div>
    );
  }

  const groups = {};
  filtered.forEach((e) => {
    (groups[e.date] = groups[e.date] || []).push(e);
  });
  const sortedDates = Object.keys(groups).sort((a, b) =>
    b.localeCompare(a)
  );
  const fmtToday = fmt(today);

  return (
    <div className="space-y-3">
      {sortedDates.map((date) => {
        const items = groups[date];
        const dayTotal = items.reduce((s, e) => s + e.amount, 0);
        const isToday = date === fmtToday;

        return (
          <div
            key={date}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all"
          >
            <div className="flex justify-between items-center px-4 py-2.5 bg-slate-800/60 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {isToday && (
                  <span className="px-1.5 py-0.5 bg-blue-900/70 text-blue-300 text-[9px] rounded font-bold tracking-wide">
                    TODAY
                  </span>
                )}
                <span className="text-xs text-slate-300 font-semibold">
                  {formatDateRange(date)}
                </span>
                <span className="text-[10px] text-slate-600">
                  · {items.length} item{items.length > 1 ? "s" : ""}
                </span>
              </div>
              <span className="text-sm font-bold text-orange-400">
                {fmtFull(dayTotal)}
              </span>
            </div>
            {items.map((exp, idx) => {
              const meta = catMeta(exp.category, CATEGORIES);
              return (
                <div
                  key={exp.id || exp._id}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-800/30 transition-all group ${idx < items.length - 1 ? "border-b border-slate-800/40" : ""}`}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{
                      background: meta.color + "1a",
                      border: `1px solid ${meta.color}33`,
                    }}
                  >
                    {meta.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-slate-200 truncate font-medium">
                      {exp.note || exp.category}
                    </div>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded font-medium mt-0.5 inline-block"
                      style={{
                        background: meta.color + "1a",
                        color: meta.color,
                      }}
                    >
                      {exp.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-base font-bold text-slate-100"
                      style={{ fontFamily: "Syne, sans-serif" }}
                    >
                      {fmtFull(exp.amount)}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(exp)}
                        className="w-7 h-7 bg-slate-800 hover:bg-blue-900 rounded-lg flex items-center justify-center text-xs transition-all"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDelete(exp.id || exp._id)}
                        className="w-7 h-7 bg-slate-800 hover:bg-red-950 rounded-lg flex items-center justify-center text-xs transition-all"
                        title="Delete"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
