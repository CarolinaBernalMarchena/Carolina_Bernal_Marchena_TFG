import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  seedBoxes,
  getShopBoxes,
  getAllBoxes,
  openBox,
  openRandomBox,
  getCollectionProbabilities,
  updateCollectionProbabilities,
  getUserCollection,
  getCollectionCost,
  updateCollectionCost,
} from "../controllers/boxController.js";

const router = express.Router();

router.post("/seed-boxes", authenticateToken, seedBoxes);
router.get("/shop-boxes", authenticateToken, getShopBoxes);
router.get("/boxes", authenticateToken, getAllBoxes);
router.post("/open-box/:boxId", authenticateToken, openBox);
router.post("/open-random-box/:collection", authenticateToken, openRandomBox);
router.get(
  "/collection-probabilities",
  authenticateToken,
  getCollectionProbabilities,
);
router.post(
  "/collection-probabilities",
  authenticateToken,
  updateCollectionProbabilities,
);
router.get("/my-collection/:userId", authenticateToken, getUserCollection);
router.get("/collection-costs", authenticateToken, getCollectionCost);
router.post("/collection-costs", authenticateToken, updateCollectionCost);

export default router;
