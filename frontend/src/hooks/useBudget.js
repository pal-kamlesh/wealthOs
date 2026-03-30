import { useState, useEffect, useCallback } from "react";
import * as api from "../lib/api.js";

export const useBudget = () => {
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch budget on mount
  const fetchBudget = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getBudget();
      setBudget(data);
    } catch (err) {
      setError(err.message || "Failed to fetch budget");
      console.error("Error fetching budget:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudget();
  }, [fetchBudget]);

  // Update entire budget
  const updateBudget = useCallback(async (newBudget) => {
    try {
      const updated = await api.updateBudget(newBudget);
      setBudget(updated);
      return updated;
    } catch (err) {
      setError(err.message || "Failed to update budget");
      throw err;
    }
  }, []);

  // Update single category budget
  const updateCategoryBudget = useCallback(async (categoryLabel, amount) => {
    try {
      const updated = await api.updateCategoryBudget(categoryLabel, amount);
      setBudget(updated);
      return updated;
    } catch (err) {
      setError(err.message || "Failed to update category budget");
      throw err;
    }
  }, []);

  return {
    budget,
    loading,
    error,
    updateBudget,
    updateCategoryBudget,
    refreshBudget: fetchBudget,
  };
};
