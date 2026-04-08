import { useState, useEffect, useMemo } from "react";
import { useBudget } from "../hooks/useBudget.js";
import { useProfileStore } from "../store/useProfileStore.js";
import { CATEGORIES, SALARY } from "../utils/constants.js";
import { fmtFull } from "../utils/formatters.js";
import { showToast } from "../store/useToastStore.js";

export default function BudgetSettings() {
  const { budget, error, updateBudget, updateCategoryBudget, refreshBudget } = useBudget();
  const { profile, updateProfile } = useProfileStore();
  const [editingCategory, setEditingCategory] = useState(null);
  const [tempAmount, setTempAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [weeklyBudget, setWeeklyBudget] = useState("");
  const [dailyBudget, setDailyBudget] = useState("");
  const [salary, setSalary] = useState("");

  const categories = budget?.categories || CATEGORIES;
  const currentTotalBudget =
    budget?.totalMonthlyBudget ?? categories.reduce((s, c) => s + c.budget, 0);

  useEffect(() => {
    const monthly = currentTotalBudget;
    setMonthlyBudget(String(monthly));
    setWeeklyBudget(String(Math.round(monthly / 4)));
    setDailyBudget(String(Math.round(monthly / 30)));
  }, [currentTotalBudget]);

  useEffect(() => {
    setSalary(String(profile?.income ?? SALARY));
  }, [profile]);

  const salaryValue = Number(salary) || 0;

  // Calculate available budget after SIP and emergency fund
  const availableBudget = useMemo(() => {
    const sip = profile?.sip || 0;
    const emergencyFund = profile?.emergencyFund || 0;
    return Math.max(0, salaryValue - sip - emergencyFund);
  }, [salaryValue, profile?.sip, profile?.emergencyFund]);

  const budgetPercentage = useMemo(() => {
    const budget = Number(monthlyBudget) || 0;
    const baseAmount = availableBudget || SALARY;
    const percentage = baseAmount > 0 ? Math.round((budget / baseAmount) * 100) : 0;
    return isNaN(percentage) ? 0 : percentage;
  }, [monthlyBudget, availableBudget]);

  const isOverBudget = budgetPercentage > 95;

  const handleBudgetChange = (unit, value) => {
    const numValue = Number(value) || 0;
    let monthly = 0;

    switch (unit) {
      case "monthly":
        monthly = numValue;
        setMonthlyBudget(value);
        setWeeklyBudget(String(Math.round(numValue / 4)));
        setDailyBudget(String(Math.round(numValue / 30)));
        break;
      case "weekly":
        monthly = numValue * 4;
        setWeeklyBudget(value);
        setMonthlyBudget(String(monthly));
        setDailyBudget(String(Math.round(monthly / 30)));
        break;
      case "daily":
        monthly = numValue * 30;
        setDailyBudget(value);
        setMonthlyBudget(String(monthly));
        setWeeklyBudget(String(Math.round(monthly / 4)));
        break;
    }
  };

  const handleSalaryChange = (value) => {
    setSalary(value);
  };

  const handleSaveSalary = async () => {
    const newSalary = Number(salary);
    if (Number.isNaN(newSalary) || newSalary < 0) {
      showToast.error("Please enter a valid salary amount");
      return;
    }

    try {
      setSaving(true);
      await updateProfile({ income: newSalary });
      showToast.success("Monthly salary updated successfully!");
    } catch (err) {
      showToast.error("Error updating salary: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEditCategory = (category) => {
    const current = categories.find((c) => c.label === category.label);
    setEditingCategory(category.label);
    setTempAmount(String(current?.budget || category.budget));
  };

  const handleSaveCategory = async () => {
    if (!tempAmount || isNaN(tempAmount)) {
      showToast.error("Please enter a valid amount");
      return;
    }

    try {
      setSaving(true);
      await updateCategoryBudget(editingCategory, parseFloat(tempAmount));
      await refreshBudget();
      setEditingCategory(null);
      setTempAmount("");
      showToast.success(`Budget updated for ${editingCategory}!`);
    } catch (err) {
      showToast.error("Error updating budget: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleResetBudget = async () => {
    try {
      setSaving(true);
      const resetCategories = categories.map((category) => ({
        ...category,
        budget: 0,
      }));
      await updateBudget({
        categories: resetCategories,
        totalMonthlyBudget: 0,
      });
      await updateProfile({ income: 0 });
      await refreshBudget();
      setMonthlyBudget("0");
      setWeeklyBudget("0");
      setDailyBudget("0");
      setSalary("0");
      setEditingCategory(null);
      setTempAmount("");
      showToast.success("Budget and salary reset to zero successfully!");
    } catch (err) {
      showToast.error("Error resetting budget: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTotalBudget = async () => {
    const newMonthlyBudget = Number(monthlyBudget);
    if (!newMonthlyBudget || newMonthlyBudget <= 0) {
      showToast.error("Please enter a valid budget amount");
      return;
    }

    if (salaryValue > 0 && newMonthlyBudget > availableBudget) {
      showToast.error("Budget cannot exceed available amount after SIP and emergency fund!");
      return;
    }

    const oldTotal = categories.reduce((sum, category) => sum + category.budget, 0);
    const scaledCategories = categories.map((category) => ({
      ...category,
      budget: oldTotal
        ? Math.max(0, Math.round((category.budget / oldTotal) * newMonthlyBudget))
        : Math.max(0, Math.round(newMonthlyBudget / categories.length)),
    }));

    const roundedSum = scaledCategories.reduce((sum, category) => sum + category.budget, 0);
    const diff = newMonthlyBudget - roundedSum;
    if (diff !== 0 && scaledCategories.length) {
      scaledCategories[scaledCategories.length - 1].budget += diff;
    }

    try {
      setSaving(true);
      await updateBudget({
        categories: scaledCategories,
        totalMonthlyBudget: newMonthlyBudget,
      });
      await refreshBudget();
      showToast.success("Budget updated successfully!");
    } catch (err) {
      showToast.error("Error saving budget: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {error && (
        <div className="bg-red-950/30 border border-red-800/50 text-red-400 rounded-lg text-sm p-3">
          Error: {error}
        </div>
      )}

      {/* Salary and Budget Overview */}
      <div className="bg-linear-to-br from-blue-900/30 to-slate-900 border border-blue-800/30 rounded-2xl p-5">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">
          Income & Budget Breakdown
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="bg-slate-950/30 border border-slate-800 p-4 rounded-xl">
            <div className="text-slate-500 uppercase tracking-widest mb-2 text-xs">Monthly Income</div>
            <input
              type="number"
              value={salary}
              onChange={(e) => handleSalaryChange(e.target.value)}
              min="0"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-lg font-semibold"
              placeholder="Enter monthly salary"
            />
            <button
              onClick={handleSaveSalary}
              disabled={saving}
              className="mt-3 w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-all"
            >
              {saving ? "Saving..." : "Save Salary"}
            </button>
          </div>
          <div className="bg-slate-950/30 border border-slate-800 p-4 rounded-xl">
            <div className="text-slate-500 uppercase tracking-widest mb-2 text-xs">SIP Deduction</div>
            <div className="text-2xl font-bold text-orange-400">
              -{fmtFull(profile?.sip || 0)}
            </div>
            <div className="text-xs text-slate-500 mt-1">Monthly investment</div>
          </div>
          <div className="bg-slate-950/30 border border-slate-800 p-4 rounded-xl">
            <div className="text-slate-500 uppercase tracking-widest mb-2 text-xs">Emergency Fund</div>
            <div className="text-2xl font-bold text-yellow-400">
              -{fmtFull(profile?.emergencyFund || 0)}
            </div>
            <div className="text-xs text-slate-500 mt-1">Monthly savings</div>
          </div>
          <div className="bg-slate-950/30 border border-slate-800 p-4 rounded-xl">
            <div className="text-slate-500 uppercase tracking-widest mb-2 text-xs">Available for Expenses</div>
            <div className="text-2xl font-bold text-emerald-400">{fmtFull(availableBudget)}</div>
            <div className="text-xs text-slate-500 mt-1">After deductions</div>
          </div>
        </div>
      </div>

      {/* Budget Setting Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-4">
          Set Your Budget
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Monthly Budget</label>
            <input
              type="number"
              value={monthlyBudget}
              onChange={(e) => handleBudgetChange("monthly", e.target.value)}
              min="0"
              max={availableBudget}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-lg font-semibold"
              placeholder="Monthly amount"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Weekly Budget</label>
            <input
              type="number"
              value={weeklyBudget}
              onChange={(e) => handleBudgetChange("weekly", e.target.value)}
              min="0"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-lg font-semibold"
              placeholder="Weekly amount"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Daily Budget</label>
            <input
              type="number"
              value={dailyBudget}
              onChange={(e) => handleBudgetChange("daily", e.target.value)}
              min="0"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-lg font-semibold"
              placeholder="Daily amount"
            />
          </div>
        </div>
        <div className="mt-4 p-4 bg-slate-950/30 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-500 uppercase tracking-widest mb-1 text-xs">Budget Usage</div>
              <div className="text-sm text-slate-400">Percentage of available funds</div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${isOverBudget ? 'text-red-400' : 'text-blue-400'}`}>
                {budgetPercentage}%
              </div>
              {isOverBudget && (
                <div className="text-xs text-red-400 mt-1">⚠️ Exceeds 95% of available funds!</div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={handleSaveTotalBudget}
            disabled={saving || isOverBudget}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 text-white rounded-xl text-sm font-semibold transition-all"
          >
            {saving ? "Saving..." : "Save Budget"}
          </button>
          <button
            onClick={handleResetBudget}
            disabled={saving}
            className="px-6 py-3 bg-red-600 hover:bg-red-500 disabled:bg-slate-600 text-white rounded-xl text-sm font-semibold transition-all"
          >
            {saving ? "Processing..." : "Reset to Zero"}
          </button>
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
