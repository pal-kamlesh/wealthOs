// ─── Constants ────────────────────────────────────────────────────────────────

export const CATEGORIES = [
  { label: "Food & Dining", icon: "🍱", color: "#f97316", budget: 3000 },
  { label: "Transport", icon: "🚇", color: "#eab308", budget: 1000 },
  { label: "Entertainment", icon: "🎮", color: "#ec4899", budget: 1500 },
  { label: "Shopping", icon: "🛍️", color: "#8b5cf6", budget: 1000 },
  { label: "Health", icon: "💊", color: "#22c55e", budget: 500 },
  { label: "Upskilling", icon: "💻", color: "#3b82f6", budget: 1000 },
  { label: "Utilities", icon: "⚡", color: "#14b8a6", budget: 500 },
  { label: "Other", icon: "📦", color: "#94a3b8", budget: 500 },
];

export const SALARY = 25000;
export const MONTHLY_BUDGET = CATEGORIES.reduce((s, c) => s + c.budget, 0);

export const TABS = [
  { id: "tracker", label: "💳 Tracker" },
  { id: "overview", label: "📊 Overview" },
  { id: "insights", label: "💡 Insights" },
  { id: "settings", label: "⚙️ Settings" },
];

export const VIEWS = ["daily", "weekly", "monthly", "yearly"];
