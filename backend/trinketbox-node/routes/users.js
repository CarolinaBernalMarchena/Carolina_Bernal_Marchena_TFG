import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  register,
  login,
  updateUser,
  getUserStats,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/user", authenticateToken, updateUser);
router.get("/profile-stats", authenticateToken, getUserStats);

export default router;
