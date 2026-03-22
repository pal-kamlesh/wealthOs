import { Router } from "express";
import userRoute from "./user.routes.js";

const router = Router();

router.use("/user", userRoute);

export default router;
const expenseRoutes = require("./routes/expenseRoutes");

app.use("/api/expenses", expenseRoutes);