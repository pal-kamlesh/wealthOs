import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, ".env") });

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";

import logger from "./config/logger.js"
import requestLogger from "./config/requestLogger.js"; 

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(requestLogger); // ✅ log all requests

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
console.log("DEBUG: budgetRoutes is", typeof budgetRoutes);
app.use("/api/budget", budgetRoutes);
console.log("DEBUG: Budget routes registered");

// Test route for debugging
app.get("/api/budget/test", (req, res) => res.json({ message: "Budget routes are loaded" }));

app.get("/", (req, res) => res.send("✅ WealthOs API running"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    logger.info("MongoDB connected"); // ✅ replace console.log
    app.listen(process.env.PORT || 5173, () =>
      logger.info(`Server running on port ${process.env.PORT || 5173}`)
    );
  })
  .catch((err) => logger.error(`MongoDB connection error: ${err.message}`)); 