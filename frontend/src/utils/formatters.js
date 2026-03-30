// ─── Formatting Utilities ────────────────────────────────────────────────────

export const fmt = (d) => d.toISOString().split("T")[0];

export const fmtINR = (n) =>
  n >= 100000
    ? `₹${(n / 100000).toFixed(1)}L`
    : n >= 1000
      ? `₹${(n / 1000).toFixed(1)}K`
      : `₹${n}`;

export const fmtFull = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

export const catMeta = (name, categories) =>
  categories.find((c) => c.label === name) || categories[categories.length - 1];

export const daysAgo = (n) => {
  const today = new Date();
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return fmt(d);
};

export const startOf = (unit) => {
  const today = new Date();
  const d = new Date(today);
  if (unit === "week") d.setDate(d.getDate() - d.getDay());
  if (unit === "month") d.setDate(1);
  if (unit === "year") {
    d.setDate(1);
    d.setMonth(0);
  }
  d.setHours(0, 0, 0, 0);
  return d;
};

export const getWindowStart = (view) => {
  const today = new Date();
  if (view === "daily") return fmt(today);
  if (view === "weekly") return fmt(startOf("week"));
  if (view === "monthly") return fmt(startOf("month"));
  return fmt(startOf("year"));
};

export const formatDateRange = (date) => {
  return new Date(date + "T12:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
