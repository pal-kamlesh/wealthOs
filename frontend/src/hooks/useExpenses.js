import { useState, useEffect, useCallback } from "react";
import * as api from "../lib/api.js";
import { fmt } from "../utils/formatters.js";

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all expenses on component mount
  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getExpenses();
      if (!Array.isArray(data)) {
        console.error("Expected array from GET /api/expenses, got:", data);
        setExpenses([]);
        setError("Invalid data format from server for expenses");
        return;
      }
      // Convert backend date format if needed
      const normalizedData = data.map((expense) => ({
        ...expense,
        id: expense._id || expense.id,
      }));
      setExpenses(normalizedData);
    } catch (err) {
      setError(err.message || "Failed to fetch expenses");
      console.error("Error fetching expenses:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize by fetching expenses
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Add new expense
  const addExpense = useCallback(
    async (expenseData) => {
      try {
        const newExpense = await api.createExpense(expenseData);
        const formatted = {
          ...newExpense,
          id: newExpense._id || newExpense.id,
        };
        setExpenses((prev) => [formatted, ...prev]);
        return formatted;
      } catch (err) {
        setError(err.message || "Failed to create expense");
        throw err;
      }
    },
    []
  );

  // Update existing expense
  const updateExpense = useCallback(async (id, expenseData) => {
    try {
      const updated = await api.updateExpense(id, expenseData);
      const formatted = {
        ...updated,
        id: updated._id || updated.id,
      };
      setExpenses((prev) =>
        prev.map((e) => (e.id === id ? formatted : e))
      );
      return formatted;
    } catch (err) {
      setError(err.message || "Failed to update expense");
      throw err;
    }
  }, []);

  // Delete expense
  const deleteExpense = useCallback(async (id) => {
    try {
      await api.deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete expense");
      throw err;
    }
  }, []);

  return {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    refreshExpenses: fetchExpenses,
  };
};

export const useExpenseForm = (initialData = null) => {
  const today = fmt(new Date());
  const [form, setForm] = useState(
    initialData || {
      date: today,
      category: "Food & Dining",
      amount: "",
      note: "",
    }
  );

  const updateField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setForm({
      date: today,
      category: "Food & Dining",
      amount: "",
      note: "",
    });
  }, [today]);

  const setFromExpense = useCallback((expense) => {
    setForm({
      date: expense.date,
      category: expense.category,
      amount: String(expense.amount),
      note: expense.note,
    });
  }, []);

  return { form, updateField, reset, setFromExpense };
};
