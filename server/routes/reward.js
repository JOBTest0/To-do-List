import express from "express";
import { verifyToken } from "../utils/verify.js";
import {  calculateTotalCoins  } from "../controllers/reward.js";

const router = express.Router();

// ให้รางวัล
//router.post("/give", verifyToken, giveReward);

// ดูประวัติการรับรางวัล
//router.get("/history", verifyToken, getRewardHistory);

// คำนวณ Coins รวม
router.get("/total-coins", verifyToken, calculateTotalCoins);

export default router;
