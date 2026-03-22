import { Router } from "express";
import {
  login,
  logout,
  register,
  getAllUsers,
} from "../controllers/userControllers.js";
import { ifAdmin, verifyToken } from "../middleware/verifyUser.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/allUsers", verifyToken, ifAdmin, getAllUsers);

export default router;