import { useEffect, useCallback } from "react";
import { onNewTransaction, offNewTransaction, initializeSocket } from "../services/socketService";
import { useExpenses } from "./useExpenses";
import { showToast } from "../store/useToastStore";

export const useRealtimeTransactions = (enable = true) => {
  const { expenses, addExpense } = useExpenses();

  const handleNewTransaction = useCallback(
    (payload) => {
      if (!payload || !payload.transaction) return;

      const transaction = payload.transaction;
      const exists = expenses.some((item) => item._id === transaction._id);
      if (exists) return;

      const expense = {
        _id: transaction._id,
        date: new Date(transaction.date).toISOString().split("T")[0],
        category: transaction.category || "SMS Transaction",
        amount: transaction.amount,
        note: `${transaction.merchant} (${transaction.type})`,
      };

      addExpense(expense);

      if (transaction.type === "credit") {
        showToast.success(`New credit: ₹${transaction.amount} from ${transaction.merchant}`);
      } else {
        showToast.info(`New debit: ₹${transaction.amount} to ${transaction.merchant}`);
      }
    },
    [addExpense, expenses]
  );

  useEffect(() => {
    if (!enable) return;

    initializeSocket();
    onNewTransaction(handleNewTransaction);

    return () => {
      offNewTransaction(handleNewTransaction);
    };
  }, [enable, handleNewTransaction]);
};
