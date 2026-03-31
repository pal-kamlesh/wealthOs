import { Router } from "express";
import {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userControllers.js";
import { ifAdmin, verifyToken } from "../middleware/verifyUser.js";

const router = Router();

router.get("/allUsers", verifyToken, ifAdmin, getAllUsers);
router.get("/profile", verifyToken, getUserProfile);
router.put("/profile", verifyToken, updateUserProfile);

export default router;