import express, { Request, Response } from "express";
import { createPill, getAllPills } from "../controllers/pillController";
import Pill from "../models/Pill";

const router = express.Router();

// POST /api/pills/ → Create pill
router.post("/", createPill);

// GET /api/pills/ → Get all pills
router.get("/", getAllPills);

// GET /api/pills/:id → Get pill by ID
router.get(
  "/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const pill = await Pill.findById(req.params.id);
      if (!pill) {
        res.status(404).json({ message: "Pill not found" });
        return;
      }
      res.json(pill);
    } catch (err) {
      console.error("Get Pill Error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
