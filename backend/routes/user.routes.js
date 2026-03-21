import { Router } from "express";
import {
  login,
  logout,
  register,
//   feedback,
//   getFeedbacks,
//   editFeedbacks,
//   deleteFeedback,
//   fetchFeedback,
  getAllUsers,
} from "../controllers/userControllers.js";
import { ifAdmin, verifyToken } from "../middleware/verifyUser.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
// router.post("/feedback", verifyToken, feedback);
// router.get("/feedback", verifyToken, getFeedbacks);
// router.put("/feedback", verifyToken, editFeedbacks);
// router.delete("/feedback", verifyToken, deleteFeedback);
// router.post("/adminFeedback", verifyToken, ifAdmin, fetchFeedback);
router.get("/allUsers", verifyToken, ifAdmin, getAllUsers);

export default router;