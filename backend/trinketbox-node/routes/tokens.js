import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  getUserTokens,
  getTokenHistory,
} from "../controllers/tokenController.js";

const router = express.Router();

router.get("/token", authenticateToken, getUserTokens);
router.get("/token-history", authenticateToken, getTokenHistory);

export default router;
