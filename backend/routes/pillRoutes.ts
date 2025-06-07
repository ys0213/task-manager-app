import express from "express";
import { createPill, getAllPills, getPillsByUserID, getPillById, updatePillById, getTodayPillsByUser, recordPillIntake, cancelPillIntake, getUserPillRecordsByDate } from "../controllers/pillController";

const router = express.Router();

// POST /api/pills/ → Create pill
router.post("/", createPill);

// GET /api/pills/ → Get all pills
router.get("/", getAllPills);

// GET /api/pills/today/userid → Get pill by ID
router.get("/today/:id", getTodayPillsByUser);

// GET /api/pills/ → Get all pills
router.get("/user/:id", getPillsByUserID);

//Calendar
router.get("/records/:userId", getUserPillRecordsByDate);

// GET /api/pills/:id → Get pill by ID
router.get("/:id", getPillById);

// PUT /api/pills/:id → Get pill by ID
router.put("/:id", updatePillById);

//Home
router.post("/record", recordPillIntake);
router.post("/cancel", cancelPillIntake);





export default router;
