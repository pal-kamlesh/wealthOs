import { useState, useMemo, useCallback } from "react";
import Header from "./Header";
import TrackerControls from "./TrackerControls";
import KPICards from "./KPICards";
import BudgetBar from "./BudgetBar";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import OverviewCards from "./OverviewCards";
import DailyChart from "./DailyChart";
import CategoryBreakdown from "./CategoryBreakdown";
import BudgetComparison from "./BudgetComparison";
import TrendChart from "./TrendChart";
import InsightCards from "./InsightCards";
import MongoDBNote from "./MongoDBNote";
import BudgetSettings from "./BudgetSettings";
import UserProfile from "./UserProfile";
import Calendar from "./Calendar";
import { useExpenses, useExpenseForm } from "../hooks/useExpenses.js";
import { useBudget } from "../hooks/useBudget.js";
import { useRealtimeTransactions } from "../hooks/useRealtimeTransactions.js";
import { useProfileStore } from "../store/useProfileStore.js";
import { SALARY, CATEGORIES } from "../utils/constants.js";
import { showToast } from "../store/useToastStore.js";
import {
  calculateFiltered,
  calculateTotalSpent,
  calculateCategoryBreakdown,
  calculateDailyChart,
  calculateWeeklyChart,
  getViewBudget,
  calculateBudgetPercentage,
} from "../utils/calculations.js";

export default function FinanceApp() {
  const [tab, setTab] = useState("tracker");
  const [view, setView] = useState("weekly");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [filterCat, setFilterCat] = useState("All");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const { expenses, loading, error, addExpense, updateExpense, deleteExpense } =
    useExpenses();
  const { budget } = useBudget();
  const { profile } = useProfileStore();
  const { form, updateField, reset, setFromExpense } = useExpenseForm();

  // Enable real-time transaction listening using the same expense state
  useRealtimeTransactions(true, addExpense, expenses);

  const today = new Date();
  const [selectedYear, selectedMonth, selectedDay] = selectedDate.split("-").map(Number);

  const windowStart = useMemo(() => {
    const selectedDateObj = new Date(selectedYear, selectedMonth - 1, selectedDay);
    // Calculate window start based on view and selected date
    if (view === "daily") return selectedDate;
    
    const d = new Date(selectedDateObj);
    if (view === "weekly") {
      d.setDate(d.getDate() - d.getDay());
    } else if (view === "monthly") {
      d.setDate(1);
    } else if (view === "yearly") {
      d.setDate(1);
      d.setMonth(0);
    }
    d.setHours(0, 0, 0, 0);
    return d.toISOString().split("T")[0];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, selectedDate]);

  const filtered = useMemo(
    () => calculateFiltered(expenses, windowStart, filterCat),
    [expenses, windowStart, filterCat]
  );

  const totalSpent = useMemo(
    () => calculateTotalSpent(filtered),
    [filtered]
  );

  const catBreakdown = useMemo(
    () => calculateCategoryBreakdown(expenses, windowStart),
    [expenses, windowStart]
  );

  const dailyChart = useMemo(
    () => calculateDailyChart(expenses),
    [expenses]
  );

  const weeklyChart = useMemo(
    () => calculateWeeklyChart(),
    []
  );

  // Use dynamic budget from backend, fallback to default
  const MONTHLY_BUDGET = budget?.totalMonthlyBudget ?? 8000;

  // Calculate available budget after SIP and emergency fund deductions
  const availableBudget = useMemo(() => {
    const income = profile?.income || SALARY;
    const sip = profile?.sip || 0;
    const emergencyFund = profile?.emergencyFund || 0;
    return Math.max(0, income - sip - emergencyFund);
  }, [profile?.income, profile?.sip, profile?.emergencyFund]);

  const selectedCategory = useMemo(() => {
    if (filterCat === "All") return null;
    return (
      budget?.categories?.find((c) => c.label === filterCat) ||
      CATEGORIES.find((c) => c.label === filterCat) ||
      null
    );
  }, [budget?.categories, filterCat]);

  const selectedCategoryBudget = selectedCategory?.budget ?? MONTHLY_BUDGET;

  const viewBudget = useMemo(
    () =>
      getViewBudget(
        view,
        filterCat === "All" ? availableBudget : selectedCategoryBudget
      ),
    [view, availableBudget, filterCat, selectedCategoryBudget]
  );

  const salary = profile?.income || SALARY;

  const budgetPercentageOfSalary = useMemo(() => {
    const budget = availableBudget;
    const percentage = salary > 0 ? Math.round((budget / salary) * 100) : 0;
    return isNaN(percentage) ? 0 : percentage;
  }, [availableBudget, salary]);

  const budgetPercentage = useMemo(
    () => calculateBudgetPercentage(totalSpent, viewBudget),
    [totalSpent, viewBudget]
  );

  const isBudgetOverLimit = useMemo(
    () => totalSpent > viewBudget,
    [totalSpent, viewBudget]
  );

  // Handle form submission
  const handleSaveExpense = useCallback(async () => {
    if (!form.amount || !form.date) {
      showToast.error("Please fill in amount and date");
      return;
    }

    try {
      const expenseData = {
        date: form.date,
        category: form.category,
        amount: parseFloat(form.amount),
        note: form.note,
      };

      if (editItem) {
        await updateExpense(editItem.id || editItem._id, expenseData);
        showToast.success("Expense updated successfully!");
      } else {
        await addExpense(expenseData);
        showToast.success("Expense added successfully!");
      }

      reset();
      setShowForm(false);
      setEditItem(null);
    } catch (err) {
      showToast.error("Error saving expense: " + err.message);
    }
  }, [form, editItem, addExpense, updateExpense, reset]);

  // Handle edit
  const handleOpenEdit = useCallback(
    (item) => {
      setEditItem(item);
      setFromExpense(item);
      setShowForm(true);
    },
    [setFromExpense]
  );

  // Handle delete
  const handleDeleteExpense = useCallback(
    async (id) => {
      if (confirm("Delete this expense?")) {
        try {
          await deleteExpense(id);
          showToast.success("Expense deleted successfully!");
        } catch (err) {
          showToast.error("Error deleting expense: " + err.message);
        }
      }
    },
    [deleteExpense]
  );

  // Handle form open/close
  const handleToggleForm = useCallback(() => {
    if (showForm) {
      setShowForm(false);
      setEditItem(null);
    } else {
      setShowForm(true);
      reset();
    }
  }, [showForm, reset]);

  // Handle form field changes
  const handleFieldChange = useCallback(
    (field, value) => {
      updateField(field, value);
    },
    [updateField]
  );

  // Handle key down in note field
  const handleNoteKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleSaveExpense();
      }
    },
    [handleSaveExpense]
  );

  if (loading) {
    return (
      <div className="bg-slate-950 min-h-screen text-slate-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <div>Loading your expenses...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-slate-950 min-h-screen text-slate-200"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;600;700&family=Syne:wght@700;800&display=swap"
        rel="stylesheet"
      />

      {/* ── Header ── */}
      <Header tab={tab} onTabChange={setTab} />

      {error && (
        <div className="max-w-5xl mx-auto px-4 py-3 mb-4 bg-red-950/30 border border-red-800/50 text-red-400 rounded-lg text-sm">
          Error: {error}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* ══ TRACKER TAB ══ */}
        {tab === "tracker" && (
          <div className="space-y-4">
            <TrackerControls
              view={view}
              onViewChange={setView}
              filterCat={filterCat}
              onFilterChange={setFilterCat}
              onAddNew={handleToggleForm}
              budget={budget}
            />

            <KPICards
              totalSpent={totalSpent}
              viewBudget={viewBudget}
              view={view}
              filtered={filtered}
              filterCat={filterCat}
              budgetPercentageOfSalary={budgetPercentageOfSalary || 0}
              isBudgetOverLimit={isBudgetOverLimit || false}
            />

            <BudgetBar
              totalSpent={totalSpent}
              viewBudget={viewBudget}
              budgetPercentage={budgetPercentage}
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-3">
                {showForm && (
                  <ExpenseForm
                    form={form}
                    editItem={editItem}
                    onFieldChange={handleFieldChange}
                    onSave={handleSaveExpense}
                    onCancel={() => {
                      setShowForm(false);
                      setEditItem(null);
                      reset();
                    }}
                    onKeyDown={handleNoteKeyDown}
                    budget={budget}
                  />
                )}

                <ExpenseList
                  filtered={filtered}
                  today={today}
                  onEdit={handleOpenEdit}
                  onDelete={handleDeleteExpense}
                  onAddNew={handleToggleForm}
                />
              </div>

              <div className="lg:col-span-1">
                <Calendar
                  expenses={expenses}
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                />
              </div>
            </div>
          </div>
        )}

        {/* ══ OVERVIEW TAB ══ */}
        {tab === "overview" && (
          <div className="space-y-5">
            <OverviewCards expenses={expenses} salary={salary} />

            <DailyChart data={dailyChart} />

            <CategoryBreakdown data={catBreakdown} />

            <BudgetComparison expenses={expenses} budget={budget} />
          </div>
        )}

        {/* ══ INSIGHTS TAB ══ */}
        {tab === "insights" && (
          <div className="space-y-5">
            <TrendChart data={weeklyChart} />

            <div className="text-[10px] text-slate-500 uppercase tracking-widest">
              Smart Insights
            </div>

            <InsightCards
              expenses={expenses}
              categoryBreakdown={catBreakdown}
            />

            <MongoDBNote />
          </div>
        )}

        {/* ══ PROFILE TAB ══ */}
        {tab === "profile" && <UserProfile />}

        {/* ══ SETTINGS TAB ══ */}
        {tab === "settings" && (
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-5">
              ⚙️ Budget Settings
            </div>
            <BudgetSettings />
          </div>
        )}
      </div>
    </div>
  );
}
