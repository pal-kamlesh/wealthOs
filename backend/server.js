import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, ".env") });

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import { Server as SocketIO } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import userRoutes from "./routes/user.routes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

import logger from "./config/logger.js"
import requestLogger from "./config/requestLogger.js";

const app = express();
const httpServer = createServer(app);
const io = new SocketIO(httpServer, {
  cors: { 
    origin: ["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
    methods: ["GET", "POST"],
    credentials: true 
  }
});

// Make io global for use in controllers
global.io = io;

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"], credentials: true }));
app.use(express.json());
app.use(requestLogger);

// Register all routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);

// Test route for debugging
app.get("/api/test", (req, res) => res.json({ message: "✅ API is running" }));
app.get("/", (req, res) => res.send("✅ WealthOs API running"));

// Socket.IO connection handling
io.on("connection", (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    logger.info("MongoDB connected");
    httpServer.listen(process.env.PORT || 5000, () =>
      logger.info(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => logger.error(`MongoDB connection error: ${err.message}`)); 