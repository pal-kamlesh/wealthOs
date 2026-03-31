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
import userRoutes from "./routes/user.routes.js";

import logger from "./config/logger.js"
import requestLogger from "./config/requestLogger.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(requestLogger);

// Register all routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/users", userRoutes);

// Test route for debugging
app.get("/api/test", (req, res) => res.json({ message: "✅ API is running" }));
app.get("/", (req, res) => res.send("✅ WealthOs API running"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    logger.info("MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      logger.info(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => logger.error(`MongoDB connection error: ${err.message}`)); 