const api = async (path, options = {}) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "localhost:5000";
  const res = await fetch(`${baseUrl}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const getExpenses = () => api("/expenses");
export const createExpense = (body) =>
  api("/expenses", { method: "POST", body: JSON.stringify(body) });
export const updateExpense = (id, body) =>
  api(`/expenses/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const deleteExpense = (id) =>
  api(`/expenses/${id}`, { method: "DELETE" });

export const deleteExpenses = (ids) =>
  api("/expenses/bulk-delete", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });

export const login = (body) =>
  api("/api/auth/login", { method: "POST", body: JSON.stringify(body) });
export const signup = (body) =>
  api("/auth/signup", { method: "POST", body: JSON.stringify(body) });
export const logout = () => api("/auth/logout", { method: "POST" });
