import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createTransaction,
  getTransactions,
  checkDuplicate,
  batchCreateTransactions,
  deleteTransaction
} from "../controllers/transactionController.js";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Create single transaction
router.post("/", createTransaction);

// Get all transactions for user
router.get("/", getTransactions);

// Check for duplicate by SMS hash
router.get("/check-duplicate/:smsHash", checkDuplicate);

// Batch create transactions (from SMS app)
router.post("/batch", batchCreateTransactions);

// Delete transaction
router.delete("/:id", deleteTransaction);

export default router;
