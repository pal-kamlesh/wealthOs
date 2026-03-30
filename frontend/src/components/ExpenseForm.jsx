import { CATEGORIES } from "../utils/constants.js";

export default function ExpenseForm({
  form,
  editItem,
  onFieldChange,
  onSave,
  onCancel,
  onKeyDown,
  budget,
}) {
  const categories = budget?.categories || CATEGORIES;
  return (
    <div className="bg-slate-900 border border-blue-800/60 rounded-2xl p-5 shadow-2xl shadow-blue-950/40">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-white">
          {editItem ? "✏️ Edit Expense" : "➕ New Expense"}
        </h3>
        <button
          onClick={onCancel}
          className="text-slate-500 hover:text-red-400 text-xl leading-none transition-colors"
        >
          ✕
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] text-slate-500 mb-1.5 block uppercase tracking-widest">
            Amount (₹) *
          </label>
          <input
            type="number"
            placeholder="e.g. 120"
            value={form.amount}
            onChange={(e) => onFieldChange("amount", e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-white text-sm font-bold outline-none transition-colors placeholder-slate-600"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-500 mb-1.5 block uppercase tracking-widest">
            Date *
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => onFieldChange("date", e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-white text-sm outline-none transition-colors"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-500 mb-1.5 block uppercase tracking-widest">
            Category *
          </label>
          <select
            value={form.category}
            onChange={(e) => onFieldChange("category", e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-white text-sm outline-none transition-colors"
          >
            {categories.map((c) => (
              <option key={c.label} value={c.label}>
                {c.icon} {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] text-slate-500 mb-1.5 block uppercase tracking-widest">
            Note
          </label>
          <input
            type="text"
            placeholder="What was this for?"
            value={form.note}
            onChange={(e) => onFieldChange("note", e.target.value)}
            onKeyDown={onKeyDown}
            className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-white text-sm outline-none transition-colors placeholder-slate-600"
          />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={onSave}
          className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-900/30"
        >
          {editItem ? "Update Expense" : "Save Expense"}
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
