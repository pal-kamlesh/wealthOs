import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  categories: [
    {
      label: String,
      budget: Number,
    },
  ],
  totalMonthlyBudget: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Budget", BudgetSchema);
