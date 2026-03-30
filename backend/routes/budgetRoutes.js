import express from "express";
import {
  getBudget,
  updateBudget,
  updateCategoryBudget,
} from "../controllers/budgetController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Test route (no auth required)
router.get("/test", (req, res) => res.json({ message: "Budget router is working" }));

router.get("/", authMiddleware, getBudget);
router.put("/", authMiddleware, updateBudget);
router.put("/category", authMiddleware, updateCategoryBudget);

export default router;
