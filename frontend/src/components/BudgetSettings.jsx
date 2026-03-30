import { useState, useEffect } from "react";
import { useBudget } from "../hooks/useBudget.js";
import { CATEGORIES } from "../utils/constants.js";
import { fmtFull } from "../utils/formatters.js";

export default function BudgetSettings() {
  const { budget, loading, error, updateCategoryBudget } = useBudget();
  const [editingCategory, setEditingCategory] = useState(null);
  const [tempAmount, setTempAmount] = useState("");
  const [saving, setSaving] = useState(false);

  const handleEditCategory = (category) => {
    const current = budget?.categories?.find((c) => c.label === category.label);
    setEditingCategory(category.label);
    setTempAmount(String(current?.budget || category.budget));
  };

  const handleSaveCategory = async () => {
    if (!tempAmount || isNaN(tempAmount)) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      setSaving(true);
      await updateCategoryBudget(editingCategory, parseFloat(tempAmount));
      setEditingCategory(null);
      setTempAmount("");
    } catch (err) {
      alert("Error updating budget: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-slate-400">
        Loading budget settings...
      </div>
    );
  }

  const categories = budget?.categories || CATEGORIES;
  const totalBudget =
    budget?.totalMonthlyBudget ||
    categories.reduce((s, c) => s + c.budget, 0);

  return (
    <div className="space-y-5">
      {error && (
        <div className="bg-red-950/30 border border-red-800/50 text-red-400 rounded-lg text-sm p-3">
          Error: {error}
        </div>
      )}

      {/* Total Budget Display */}
      <div className="bg-gradient-to-br from-blue-900/30 to-slate-900 border border-blue-800/30 rounded-2xl p-5">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">
          Total Monthly Budget
        </div>
        <div
          className="text-4xl font-bold text-blue-400"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          {fmtFull(totalBudget)}
        </div>
      </div>

      {/* Category Budget List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-4">
          Budget per Category
        </div>
        <div className="space-y-3">
          {categories.map((cat) => (
            <div
              key={cat.label}
              className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800/70 transition-all group"
            >
              <span className="text-2xl">{cat.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-200">
                  {cat.label}
                </div>
                {editingCategory === cat.label ? (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="number"
                      value={tempAmount}
                      onChange={(e) => setTempAmount(e.target.value)}
                      className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-2 py-1 text-white text-sm"
                      placeholder="Amount"
                    />
                    <button
                      onClick={handleSaveCategory}
                      disabled={saving}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-all"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingCategory(null)}
                      className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center mt-1">
                    <span
                      className="text-sm font-bold"
                      style={{ color: cat.color }}
                    >
                      {fmtFull(cat.budget)}
                    </span>
                    <button
                      onClick={() => handleEditCategory(cat)}
                      className="px-2 py-1 bg-slate-700 hover:bg-blue-900 text-slate-300 hover:text-blue-300 rounded-lg text-xs transition-all opacity-0 group-hover:opacity-100"
                    >
                      ✏️ Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-slate-900 border border-dashed border-slate-700 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <div className="text-sm font-semibold text-slate-300 mb-1">
              Budget Tips
            </div>
            <div className="text-xs text-slate-500 leading-relaxed space-y-1">
              <p>• Click 'Edit' on any category to customize your budget</p>
              <p>• All changes sync with your account immediately</p>
              <p>• Your expenses are compared against these budgets</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
