import Budget from "../models/Budget.js";

const DEFAULT_CATEGORIES = [
  { label: "Food & Dining", icon: "🍱", budget: 3000 },
  { label: "Transport", icon: "🚇", budget: 1000 },
  { label: "Entertainment", icon: "🎮", budget: 1500 },
  { label: "Shopping", icon: "🛍️", budget: 1000 },
  { label: "Health", icon: "💊", budget: 500 },
  { label: "Upskilling", icon: "💻", budget: 1000 },
  { label: "Utilities", icon: "⚡", budget: 500 },
  { label: "Other", icon: "📦", budget: 500 },
];

export const getBudget = async (req, res) => {
  try {
    let budget = await Budget.findOne({ userId: req.user.id });
    if (!budget) {
      // Return default budget if not set
      budget = {
        userId: req.user.id,
        categories: DEFAULT_CATEGORIES,
        totalMonthlyBudget: 8000,
      };
    }
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateBudget = async (req, res) => {
  try {
    const { categories, totalMonthlyBudget } = req.body;

    let budget = await Budget.findOne({ userId: req.user.id });
    if (!budget) {
      budget = new Budget({
        userId: req.user.id,
        categories,
        totalMonthlyBudget,
      });
    } else {
      budget.categories = categories;
      budget.totalMonthlyBudget = totalMonthlyBudget;
      budget.updatedAt = new Date();
    }

    const saved = await budget.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateCategoryBudget = async (req, res) => {
  try {
    const { categoryLabel, amount } = req.body;

    let budget = await Budget.findOne({ userId: req.user.id });
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    const categoryIndex = budget.categories.findIndex(
      (c) => c.label === categoryLabel
    );
    if (categoryIndex === -1) {
      return res.status(404).json({ message: "Category not found" });
    }

    budget.categories[categoryIndex].budget = amount;
    budget.updatedAt = new Date();
    const saved = await budget.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
