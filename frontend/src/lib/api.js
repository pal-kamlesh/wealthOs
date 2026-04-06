import { getToken } from "../utils/auth.js";

const api = async (path, options = {}) => {
  // Use configured API base URL (set in .env) or default to backend at localhost:5000
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` }),
  };

  const res = await fetch(`${baseUrl}${path}`, {
    credentials: "include",
    headers,
    ...options,
  });
  
  const contentType = res.headers.get("content-type");
  const isJson = contentType?.includes("application/json");
  
  if (!res.ok) {
    const error = isJson ? await res.json() : { message: `Server error: ${res.statusText}` };
    throw error;
  }
  
  return isJson ? res.json() : await res.text();
};

export const getExpenses = () => api("/api/expenses");
export const createExpense = (body) =>
  api("/api/expenses", { method: "POST", body: JSON.stringify(body) });
export const updateExpense = (id, body) =>
  api(`/api/expenses/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const deleteExpense = (id) =>
  api(`/api/expenses/${id}`, { method: "DELETE" });

export const deleteExpenses = (ids) =>
  api("/api/expenses/bulk-delete", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });

export const login = (body) =>
  api("/api/auth/login", { method: "POST", body: JSON.stringify(body) });
export const signup = (body) =>
  api("/api/auth/signup", { method: "POST", body: JSON.stringify(body) });
export const logout = () => api("/api/auth/logout", { method: "POST" });

// Budget API
export const getBudget = () => api("/api/budget");
export const updateBudget = (body) =>
  api("/api/budget", { method: "PUT", body: JSON.stringify(body) });
export const updateCategoryBudget = (categoryLabel, amount) =>
  api("/api/budget/category", {
    method: "PUT",
    body: JSON.stringify({ categoryLabel, amount }),
  });

// User Profile API
export const getUserProfile = () => api("/api/users/profile");
export const updateUserProfile = (body) =>
  api("/api/users/profile", { method: "PUT", body: JSON.stringify(body) });

// Transaction API (SMS-based)
export const getTransactions = (limit = 50, skip = 0) =>
  api(`/api/transactions?limit=${limit}&skip=${skip}`);
export const sendTransaction = (body) =>
  api("/api/transactions", { method: "POST", body: JSON.stringify(body) });
export const batchSendTransactions = (body) =>
  api("/api/transactions/batch", { method: "POST", body: JSON.stringify(body) });
export const checkDuplicate = (smsHash) =>
  api(`/api/transactions/check-duplicate/${smsHash}`);
export const deleteTransaction = (id) =>
  api(`/api/transactions/${id}`, { method: "DELETE" });
