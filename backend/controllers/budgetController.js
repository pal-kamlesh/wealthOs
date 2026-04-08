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
      // Create and return default budget if not set
      budget = new Budget({
        userId: req.user.id,
        categories: DEFAULT_CATEGORIES,
        totalMonthlyBudget: DEFAULT_CATEGORIES.reduce((sum, cat) => sum + cat.budget, 0),
      });
      await budget.save();
    } else {
      // Ensure existing budgets have icon and color fields
      const updatedCategories = budget.categories.map((category) => {
        const defaultCategory = DEFAULT_CATEGORIES.find((d) => d.label === category.label);
        return {
          label: category.label,
          budget: category.budget,
          icon: category.icon || defaultCategory?.icon || "📦",
          color: category.color || defaultCategory?.color || "#94a3b8",
        };
      });
      const recalculatedTotal = updatedCategories.reduce(
        (sum, category) => sum + category.budget,
        0
      );
      const shouldSave =
        JSON.stringify(updatedCategories) !== JSON.stringify(budget.categories) ||
        budget.totalMonthlyBudget !== recalculatedTotal;

      if (shouldSave) {
        budget.categories = updatedCategories;
        budget.totalMonthlyBudget = recalculatedTotal;
        budget.updatedAt = new Date();
        budget = await budget.save();
      }
    }
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateBudget = async (req, res) => {
  try {
    const { categories } = req.body;
    const totalFromCategories = categories.reduce(
      (sum, category) => sum + category.budget,
      0
    );

    let budget = await Budget.findOne({ userId: req.user.id });
    if (!budget) {
      budget = new Budget({
        userId: req.user.id,
        categories,
        totalMonthlyBudget: totalFromCategories,
      });
    } else {
      budget.categories = categories;
      budget.totalMonthlyBudget = totalFromCategories;
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
    budget.totalMonthlyBudget = budget.categories.reduce(
      (sum, category) => sum + category.budget,
      0
    );
    budget.updatedAt = new Date();
    const saved = await budget.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
