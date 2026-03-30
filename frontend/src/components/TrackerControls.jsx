import { CATEGORIES, VIEWS } from "../utils/constants.js";

export default function TrackerControls({
  view,
  onViewChange,
  filterCat,
  onFilterChange,
  onAddNew,
  budget,
}) {
  const categories = budget?.categories || CATEGORIES;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
        {VIEWS.map((v) => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            className={`px-3 py-1.5 rounded-lg text-xs capitalize font-mono transition-all ${view === v ? "bg-slate-700 text-white font-semibold shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {["All", ...categories.map((c) => c.label)]
          .slice(0, 7)
          .map((cat) => (
            <button
              key={cat}
              onClick={() => onFilterChange(cat)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all border ${filterCat === cat ? "bg-blue-900/60 border-blue-600 text-blue-300" : "border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300"}`}
            >
              {cat === "All"
                ? "All"
                : categories.find((c) => c.label === cat)?.icon +
                  " " +
                  cat.split(" ")[0]}
            </button>
          ))}
      </div>

      <button
        onClick={onAddNew}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-all shadow-lg shadow-blue-900/30"
      >
        <span className="text-base leading-none">+</span> Add Expense
      </button>
    </div>
  );
}
