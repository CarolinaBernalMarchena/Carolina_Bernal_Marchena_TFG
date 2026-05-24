import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { getUserAchievements } from "../controllers/achievementController.js";

const router = express.Router();

router.get("/achievements", authenticateToken, getUserAchievements);

export default router;
