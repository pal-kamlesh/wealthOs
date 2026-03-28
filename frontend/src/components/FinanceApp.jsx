import { useState, useMemo, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import useExpenseStore from "../store/useExpenceStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createExpense,
  getExpenses,
  updateExpense as updateExpenseApi,
  deleteExpense as deleteExpenseApi,
} from "../lib/api";

// ─── Seed Data ────────────────────────────────────────────────────────────────
const today = new Date();
const fmt = (d) => d.toISOString().split("T")[0];

function daysAgo(n) {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return fmt(d);
}

const CATEGORIES = [
  { label: "Food & Dining", icon: "🍱", color: "#f97316", budget: 3000 },
  { label: "Transport", icon: "🚇", color: "#eab308", budget: 1000 },
  { label: "Entertainment", icon: "🎮", color: "#ec4899", budget: 1500 },
  { label: "Shopping", icon: "🛍️", color: "#8b5cf6", budget: 1000 },
  { label: "Health", icon: "💊", color: "#22c55e", budget: 500 },
  { label: "Upskilling", icon: "💻", color: "#3b82f6", budget: 1000 },
  { label: "Utilities", icon: "⚡", color: "#14b8a6", budget: 500 },
  { label: "Other", icon: "📦", color: "#94a3b8", budget: 500 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const catMeta = (name) =>
  CATEGORIES.find((c) => c.label === name) || CATEGORIES[7];
const fmtINR = (n) =>
  n >= 100000
    ? `₹${(n / 100000).toFixed(1)}L`
    : n >= 1000
      ? `₹${(n / 1000).toFixed(1)}K`
      : `₹${n}`;
const fmtFull = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

function startOf(unit) {
  const d = new Date(today);
  if (unit === "week") d.setDate(d.getDate() - d.getDay());
  if (unit === "month") d.setDate(1);
  if (unit === "year") {
    d.setDate(1);
    d.setMonth(0);
  }
  d.setHours(0, 0, 0, 0);
  return d;
}

const SALARY = 25000;
const MONTHLY_BUDGET = CATEGORIES.reduce((s, c) => s + c.budget, 0);

// ─── Main Component ──────────────────────────────────────────────────────────
export default function FinanceApp() {
  // ── UI state (local only) ──
  const [tab, setTab] = useState("tracker");
  const [view, setView] = useState("weekly");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [filterCat, setFilterCat] = useState("All");
  const [form, setForm] = useState({
    date: fmt(today),
    category: "Food & Dining",
    amount: "",
    note: "",
  });

  // ── Zustand store ──
  const expenses = useExpenseStore((s) => s.expenses);
  const setExpenses = useExpenseStore((s) => s.setExpenses);
  const updateExpense = useExpenseStore((s) => s.updateExpense);
  const deleteExpense = useExpenseStore((s) => s.deleteExpense);
  const addExpense = useExpenseStore((s) => s.addExpense);

  // ── React Query ──
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["expenses"],
    queryFn: getExpenses,
  });

  // Sync server data → Zustand when fetch resolves
  useEffect(() => {
    if (data?.result) {
      setExpenses(data.result);
    }
  }, [data]);

  const addMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: (res) => {
      console.log("Created expense:", res);
      // Optimistically already shown; now replace temp with real _id from server
      qc.invalidateQueries({ queryKey: ["expenses"] });
    },
    onError: () => {
      alert("Failed to save expense. Please try again.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...body }) => updateExpenseApi(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["expenses"] });
    },
    onError: () => {
      alert("Failed to update expense. Please try again.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExpenseApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["expenses"] });
    },
    onError: () => {
      alert("Failed to delete expense. Please try again.");
    },
  });

  // ── Derived / memoised values ──
  const windowStart = useMemo(() => {
    if (view === "daily") return fmt(today);
    if (view === "weekly") return fmt(startOf("week"));
    if (view === "monthly") return fmt(startOf("month"));
    return fmt(startOf("year"));
  }, [view]);

  const filtered = useMemo(
    () =>
      expenses
        .filter((e) => e.date >= windowStart)
        .filter((e) => filterCat === "All" || e.category === filterCat)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [expenses, windowStart, filterCat],
  );

  const totalSpent = useMemo(
    () => filtered.reduce((s, e) => s + e.amount, 0),
    [filtered],
  );

  const catBreakdown = useMemo(() => {
    const map = {};
    expenses
      .filter((e) => e.date >= windowStart)
      .forEach((e) => {
        map[e.category] = (map[e.category] || 0) + e.amount;
      });
    return Object.entries(map)
      .map(([label, amount]) => ({ label, amount, ...catMeta(label) }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses, windowStart]);

  const dailyChart = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const d = daysAgo(13 - i);
      const dayExp = expenses.filter((e) => e.date === d);
      return {
        day: d.slice(5),
        total: dayExp.reduce((s, e) => s + e.amount, 0),
        food: dayExp
          .filter((e) => e.category === "Food & Dining")
          .reduce((s, e) => s + e.amount, 0),
        other: dayExp
          .filter((e) => e.category !== "Food & Dining")
          .reduce((s, e) => s + e.amount, 0),
      };
    });
  }, [expenses]);

  const weeklyChart = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const wStart = new Date(today);
      wStart.setDate(wStart.getDate() - wStart.getDay() - (5 - i) * 7);
      const wEnd = new Date(wStart);
      wEnd.setDate(wStart.getDate() + 6);
      return {
        week: `W${i + 1}`,
        total: expenses
          .filter((e) => e.date >= fmt(wStart) && e.date <= fmt(wEnd))
          .reduce((s, e) => s + e.amount, 0),
      };
    });
  }, [expenses]);

  // ── Handlers ──
  function resetForm() {
    setForm({
      date: fmt(today),
      category: "Food & Dining",
      amount: "",
      note: "",
    });
    setShowForm(false);
    setEditItem(null);
  }

  function saveExpense() {
    if (!form.amount || !form.date) return;
    const payload = { ...form, amount: +form.amount };

    if (editItem) {
      // Optimistic update in Zustand
      updateExpense({ ...editItem, ...payload });
      // Persist to server
      updateMutation.mutate({ id: editItem._id, ...payload });
    } else {
      // Optimistic add in Zustand with temp id
      const tempId = `temp-${Date.now()}`;
      addExpense({ _id: tempId, ...payload });
      // Persist to server (invalidation will replace temp on success)
      addMutation.mutate(payload);
    }

    resetForm();
  }

  function handleDelete(id) {
    // Optimistic remove from Zustand
    deleteExpense(id);
    // Persist to server
    deleteMutation.mutate(id);
  }

  function openEdit(item) {
    setEditItem(item);
    setForm({
      date: item.date,
      category: item.category,
      amount: String(item.amount),
      note: item.note,
    });
    setShowForm(true);
  }

  // ── Budget helpers ──
  const viewBudget =
    view === "daily"
      ? MONTHLY_BUDGET / 30
      : view === "weekly"
        ? MONTHLY_BUDGET / 4
        : view === "monthly"
          ? MONTHLY_BUDGET
          : MONTHLY_BUDGET * 12;

  const budgetPct = Math.min((totalSpent / viewBudget) * 100, 100);

  const budgetColor =
    budgetPct > 90
      ? "text-red-400"
      : budgetPct > 70
        ? "text-yellow-400"
        : "text-emerald-400";

  // ── Loading / error states ──
  if (isLoading)
    return (
      <div className="bg-slate-950 min-h-screen flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">
          Loading expenses...
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="bg-slate-950 min-h-screen flex items-center justify-center">
        <div className="text-red-400 text-sm">
          ⚠️ Failed to load expenses. Check your API connection.
        </div>
      </div>
    );

  // ── Custom Tooltip ──
  const TT = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs shadow-xl">
        <p className="text-slate-400 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-bold">
            {fmtFull(p.value)}
          </p>
        ))}
      </div>
    );
  };

  const isMutating =
    addMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  // ── Render ──
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
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-900/50">
            ₹
          </div>
          <div>
            <div
              className="text-white font-bold text-base"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              WealthOS
            </div>
            <div className="text-slate-500 text-[10px]">
              ₹25,000/month · SIP ₹8,000 active
              {isMutating && (
                <span className="ml-2 text-blue-400 animate-pulse">
                  · saving...
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {[
            { id: "tracker", label: "💳 Tracker" },
            { id: "overview", label: "📊 Overview" },
            { id: "insights", label: "💡 Insights" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-1.5 rounded-lg text-xs transition-all font-mono ${tab === t.id ? "bg-blue-900/70 text-blue-300 font-semibold" : "text-slate-500 hover:text-slate-300"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* ══ TRACKER TAB ══ */}
        {tab === "tracker" && (
          <div className="space-y-4">
            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                {["daily", "weekly", "monthly", "yearly"].map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`px-3 py-1.5 rounded-lg text-xs capitalize font-mono transition-all ${view === v ? "bg-slate-700 text-white font-semibold shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
                  >
                    {v}
                  </button>
                ))}
              </div>

              <div className="flex gap-1.5 flex-wrap">
                {["All", ...CATEGORIES.map((c) => c.label)]
                  .slice(0, 7)
                  .map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilterCat(cat)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all border ${filterCat === cat ? "bg-blue-900/60 border-blue-600 text-blue-300" : "border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300"}`}
                    >
                      {cat === "All"
                        ? "All"
                        : catMeta(cat).icon + " " + cat.split(" ")[0]}
                    </button>
                  ))}
              </div>

              <button
                onClick={() => {
                  setShowForm((s) => !s);
                  setEditItem(null);
                  setForm({
                    date: fmt(today),
                    category: "Food & Dining",
                    amount: "",
                    note: "",
                  });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-all shadow-lg shadow-blue-900/30"
              >
                <span className="text-base leading-none">+</span> Add Expense
              </button>
            </div>

            {/* KPI Strip */}
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
                  val: fmtFull(
                    Math.max(0, Math.round(viewBudget - totalSpent)),
                  ),
                  sub: "left to spend",
                  color:
                    totalSpent > viewBudget
                      ? "text-red-400"
                      : "text-emerald-400",
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
                  <div className="text-slate-600 text-[9px] mt-0.5">
                    {k.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Budget bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                  Budget Usage
                </span>
                <span className={`text-sm font-bold ${budgetColor}`}>
                  {Math.round(budgetPct)}%{" "}
                  {budgetPct > 90
                    ? "🔴 Over!"
                    : budgetPct > 70
                      ? "🟡 Watch it"
                      : "🟢 On track"}
                </span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${budgetPct > 90 ? "bg-red-500" : budgetPct > 70 ? "bg-yellow-500" : "bg-emerald-500"}`}
                  style={{ width: `${budgetPct}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-slate-600 mt-1">
                <span>₹0</span>
                <span>{fmtFull(Math.round(viewBudget))}</span>
              </div>
            </div>

            {/* Add / Edit Form */}
            {showForm && (
              <div className="bg-slate-900 border border-blue-800/60 rounded-2xl p-5 shadow-2xl shadow-blue-950/40">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-white">
                    {editItem ? "✏️ Edit Expense" : "➕ New Expense"}
                  </h3>
                  <button
                    onClick={resetForm}
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
                      onChange={(e) =>
                        setForm((f) => ({ ...f, amount: e.target.value }))
                      }
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
                      onChange={(e) =>
                        setForm((f) => ({ ...f, date: e.target.value }))
                      }
                      className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-white text-sm outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 mb-1.5 block uppercase tracking-widest">
                      Category *
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, category: e.target.value }))
                      }
                      className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-white text-sm outline-none transition-colors"
                    >
                      {CATEGORIES.map((c) => (
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
                      onChange={(e) =>
                        setForm((f) => ({ ...f, note: e.target.value }))
                      }
                      onKeyDown={(e) => e.key === "Enter" && saveExpense()}
                      className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-white text-sm outline-none transition-colors placeholder-slate-600"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={saveExpense}
                    disabled={isMutating}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-900/30"
                  >
                    {isMutating
                      ? "Saving..."
                      : editItem
                        ? "Update Expense"
                        : "Save Expense"}
                  </button>
                  <button
                    onClick={resetForm}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Expense List */}
            <div className="space-y-3">
              {(() => {
                const groups = {};
                filtered.forEach((e) => {
                  (groups[e.date] = groups[e.date] || []).push(e);
                });
                const sortedDates = Object.keys(groups).sort((a, b) =>
                  b.localeCompare(a),
                );
                if (sortedDates.length === 0)
                  return (
                    <div className="text-center py-16 text-slate-600">
                      <div className="text-5xl mb-3">🧾</div>
                      <div className="text-sm mb-1">
                        No expenses for this period
                      </div>
                      <button
                        onClick={() => setShowForm(true)}
                        className="text-blue-400 text-xs hover:underline mt-1"
                      >
                        + Add your first expense
                      </button>
                    </div>
                  );
                return sortedDates.map((date) => {
                  const items = groups[date];
                  const dayTotal = items.reduce((s, e) => s + e.amount, 0);
                  const isToday = date === fmt(today);
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
                            {new Date(date + "T12:00:00").toLocaleDateString(
                              "en-IN",
                              {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
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
                        const meta = catMeta(exp.category);
                        return (
                          <div
                            key={exp._id}
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
                                  onClick={() => openEdit(exp)}
                                  className="w-7 h-7 bg-slate-800 hover:bg-blue-900 rounded-lg flex items-center justify-center text-xs transition-all"
                                  title="Edit"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => handleDelete(exp._id)}
                                  disabled={deleteMutation.isPending}
                                  className="w-7 h-7 bg-slate-800 hover:bg-red-950 disabled:opacity-50 rounded-lg flex items-center justify-center text-xs transition-all"
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
                });
              })()}
            </div>
          </div>
        )}

        {/* ══ OVERVIEW TAB ══ */}
        {tab === "overview" && (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  label: "Monthly Salary",
                  val: fmtFull(SALARY),
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
                  val: fmtFull(
                    expenses
                      .filter((e) => e.date >= fmt(startOf("month")))
                      .reduce((s, e) => s + e.amount, 0),
                  ),
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
                  <div className="text-slate-600 text-[10px] mt-0.5">
                    {k.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Daily Bar Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-4">
                Daily Spending — Last 14 Days
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dailyChart} barGap={3}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#475569", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#475569", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={fmtINR}
                  />
                  <Tooltip content={<TT />} />
                  <Bar
                    dataKey="food"
                    name="Food"
                    fill="#f97316"
                    opacity={0.8}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="other"
                    name="Other"
                    fill="#3b82f6"
                    opacity={0.8}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-4 justify-end mt-1">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <div className="w-2 h-2 rounded-sm bg-orange-500" /> Food
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <div className="w-2 h-2 rounded-sm bg-blue-500" /> Other
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">
                  Category Split (This Week)
                </div>
                <ResponsiveContainer width="100%" height={190}>
                  <PieChart>
                    <Pie
                      data={catBreakdown}
                      dataKey="amount"
                      cx="50%"
                      cy="50%"
                      outerRadius={72}
                      innerRadius={36}
                      paddingAngle={3}
                    >
                      {catBreakdown.map((c, i) => (
                        <Cell key={i} fill={c.color} opacity={0.85} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => fmtFull(v)}
                      contentStyle={{
                        background: "#0f172a",
                        border: "1px solid #1e293b",
                        borderRadius: 8,
                        fontSize: 11,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-4">
                  Top Spend Areas
                </div>
                <div className="space-y-3">
                  {catBreakdown.slice(0, 6).map((c, i) => {
                    const grandTotal =
                      catBreakdown.reduce((s, x) => s + x.amount, 0) || 1;
                    const pct = Math.round((c.amount / grandTotal) * 100);
                    return (
                      <div key={i}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-slate-300">
                            {c.icon} {c.label}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-600">
                              {pct}%
                            </span>
                            <span
                              className="text-xs font-bold"
                              style={{ color: c.color }}
                            >
                              {fmtFull(c.amount)}
                            </span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${pct}%`,
                              background: c.color,
                              opacity: 0.75,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Budget vs Actual */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-4">
                Budget vs Actual (This Month)
              </div>
              <div className="space-y-3">
                {CATEGORIES.map((cat) => {
                  const spent = expenses
                    .filter(
                      (e) =>
                        e.date >= fmt(startOf("month")) &&
                        e.category === cat.label,
                    )
                    .reduce((s, e) => s + e.amount, 0);
                  const pct = Math.min((spent / cat.budget) * 100, 100);
                  const over = spent > cat.budget;
                  return (
                    <div key={cat.label} className="flex items-center gap-3">
                      <span className="text-base w-6 text-center">
                        {cat.icon}
                      </span>
                      <div className="flex-1">
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-slate-400">{cat.label}</span>
                          <span
                            className={`font-semibold ${over ? "text-red-400" : "text-slate-500"}`}
                          >
                            {fmtFull(spent)} / {fmtFull(cat.budget)}
                            {over ? " 🔴" : ""}
                          </span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              background: over ? "#ef4444" : cat.color,
                              opacity: 0.8,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ══ INSIGHTS TAB ══ */}
        {tab === "insights" && (
          <div className="space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-4">
                Weekly Spend Trend (Last 6 Weeks)
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={weeklyChart}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="week"
                    tick={{ fill: "#475569", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#475569", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={fmtINR}
                  />
                  <Tooltip content={<TT />} />
                  <defs>
                    <linearGradient id="lG" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Spend"
                    stroke="url(#lG)"
                    strokeWidth={2.5}
                    dot={{ fill: "#8b5cf6", r: 5, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="text-[10px] text-slate-500 uppercase tracking-widest">
              Smart Insights
            </div>

            {(() => {
              const monthExp = expenses.filter(
                (e) => e.date >= fmt(startOf("month")),
              );
              const monthTotal = monthExp.reduce((s, e) => s + e.amount, 0);
              const avgDaily =
                monthTotal / Math.max(new Date(today).getDate(), 1);
              const projMonth = avgDaily * 30;
              const topCat = catBreakdown[0];
              return [
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
              ].map((ins, i) => (
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
              ));
            })()}

            {/* MongoDB note */}
            <div className="bg-slate-900 border border-dashed border-slate-700 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🍃</span>
                <div>
                  <div className="text-sm font-semibold text-slate-300 mb-1.5">
                    MongoDB Integration — Wired Up ✅
                  </div>
                  <div className="text-xs text-slate-500 leading-relaxed space-y-1">
                    <p>
                      Data is fetched from your Express API via{" "}
                      <code className="text-green-400 bg-slate-800 px-1 rounded">
                        useQuery
                      </code>{" "}
                      and synced to Zustand. CRUD operations go through{" "}
                      <code className="text-blue-400 bg-slate-800 px-1 rounded">
                        useMutation
                      </code>{" "}
                      with optimistic updates.
                    </p>
                    <p className="text-slate-600">
                      Schema:{" "}
                      <code className="text-yellow-400">
                        {
                          "{ _id, userId, date, category, amount, note, createdAt }"
                        }
                      </code>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
