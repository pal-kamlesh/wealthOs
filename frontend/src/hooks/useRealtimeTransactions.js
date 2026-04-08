import { useEffect, useCallback } from "react";
import { onNewTransaction, offNewTransaction, initializeSocket } from "../services/socketService";
import { showToast } from "../store/useToastStore";

export const useRealtimeTransactions = (enable = true, addExpense, expenses = []) => {
  const handleNewTransaction = useCallback(
    (payload) => {
      if (!payload || !payload.transaction || typeof addExpense !== "function") return;

      const transaction = payload.transaction;
      const exists = expenses.some((item) => item._id === transaction._id || item.id === transaction._id);
      if (exists) return;

      const expense = {
        _id: transaction._id,
        date: new Date(transaction.date).toISOString().split("T")[0],
        category: transaction.category || "Other",
        amount: Number(transaction.amount) || 0,
        note: `${transaction.merchant || "Transaction"} (${transaction.type || "unknown"})`,
      };

      addExpense(expense);

      if (transaction.type === "credit") {
        showToast.success(`New credit: ₹${expense.amount} from ${transaction.merchant || "unknown"}`);
      } else {
        showToast.info(`New debit: ₹${expense.amount} to ${transaction.merchant || "unknown"}`);
      }
    },
    [addExpense, expenses]
  );

  useEffect(() => {
    if (!enable || typeof addExpense !== "function") return;

    initializeSocket();
    onNewTransaction(handleNewTransaction);

    return () => {
      offNewTransaction(handleNewTransaction);
    };
  }, [enable, handleNewTransaction]);
};
