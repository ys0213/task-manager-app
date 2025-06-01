import express from "express";
import { createPill, getAllPills, getPillsByUserID, getPillById, getTodayPillsByUser } from "../controllers/pillController";

const router = express.Router();

// POST /api/pills/ → Create pill
router.post("/", createPill);

// GET /api/pills/ → Get all pills
router.get("/", getAllPills);

// GET /api/pills/ → Get all pills
router.get("/user/:id", getPillsByUserID);

// GET /api/pills/:id → Get pill by ID
router.get("/:id", getPillById);

// GET /api/pills/today/userid → Get pill by ID
router.get("/today/:id", getTodayPillsByUser);

export default router;
