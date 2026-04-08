// ─── Calculation Utilities ────────────────────────────────────────────────────

import { daysAgo, catMeta } from "./formatters.js";
import { CATEGORIES, MONTHLY_BUDGET } from "./constants.js";

export const calculateFiltered = (expenses, windowStart, filterCat) => {
  return expenses
    .filter((e) => e.date >= windowStart)
    .filter((e) => filterCat === "All" || e.category === filterCat)
    .sort((a, b) => b.date.localeCompare(a.date));
};

export const calculateTotalSpent = (filtered) => {
  return filtered.reduce((s, e) => s + e.amount, 0);
};

export const calculateCategoryBreakdown = (expenses, windowStart) => {
  const map = {};
  expenses
    .filter((e) => e.date >= windowStart)
    .forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
  return Object.entries(map)
    .map(([label, amount]) => ({ label, amount, ...catMeta(label, CATEGORIES) }))
    .sort((a, b) => b.amount - a.amount);
};

export const calculateDailyChart = (expenses) => {
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
};

export const calculateWeeklyChart = () => {
  const today = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const wStart = new Date(today);
    wStart.setDate(wStart.getDate() - wStart.getDay() - (5 - i) * 7);
    return {
      week: `W${i + 1}`,
      total: 0,
    };
  });
};

export const getViewBudget = (view, monthlyBudget) => {
  switch (view) {
    case "daily":
      return monthlyBudget / 30;
    case "weekly":
      return monthlyBudget / 4;
    case "monthly":
      return monthlyBudget;
    case "yearly":
      return monthlyBudget * 12;
    default:
      return monthlyBudget;
  }
};

export const calculateBudgetPercentage = (totalSpent, viewBudget) => {
  const percentage = viewBudget > 0 ? (totalSpent / viewBudget) * 100 : 0;
  if (!Number.isFinite(percentage) || percentage < 0) {
    return 0;
  }
  return Math.min(percentage, 100);
};

export const getBudgetColor = (percentage) => {
  if (percentage > 90) return "text-red-400";
  if (percentage > 70) return "text-yellow-400";
  return "text-emerald-400";
};

export const getBudgetStatus = (percentage) => {
  if (percentage > 90) return { icon: "🔴", text: "Over!" };
  if (percentage > 70) return { icon: "🟡", text: "Watch it" };
  return { icon: "🟢", text: "On track" };
};

export const calculateBarColor = (percentage) => {
  if (percentage > 90) return "bg-red-500";
  if (percentage > 70) return "bg-yellow-500";
  return "bg-emerald-500";
};
