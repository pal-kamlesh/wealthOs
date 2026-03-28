// store/useExpenseStore.js
import { create } from "zustand";

const useExpenseStore = create((set) => ({
  expenses: [],
  user: null,

  setUser: (user) => set({ user }),
  setExpenses: (expenses) => set({ expenses }),

  addExpense: (exp) => set((s) => ({ expenses: [exp, ...s.expenses] })),
  deleteExpense: (id) =>
    set((s) => ({ expenses: s.expenses.filter((e) => e._id !== id) })),
  updateExpense: (updated) =>
    set((s) => ({
      expenses: s.expenses.map((e) => (e._id === updated._id ? updated : e)),
    })),
}));

export default useExpenseStore;
