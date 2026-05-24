import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  getAllTrades,
  createTrade,
  acceptTrade,
  deleteTrade,
  getSpecialTrades,
  createSpecialTrades,
} from "../controllers/tradeController.js";

const router = express.Router();

router.get("/", authenticateToken, getAllTrades);
router.post("/", authenticateToken, createTrade);
router.put("/:id/accept", authenticateToken, acceptTrade);
router.delete("/:id", authenticateToken, deleteTrade);
router.get("/special", authenticateToken, getSpecialTrades);
router.post("/special", authenticateToken, createSpecialTrades);

export default router;
