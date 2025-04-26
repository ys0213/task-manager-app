import { Request, Response } from "express";
import Pill from "../models/Pill";

// Create a new pill
export const createPill = async (req: Request, res: Response): Promise<void> => {
  try {
    const newPill = new Pill(req.body);
    const saved = await newPill.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Failed to create pill" });
  }
};

// Get all pills
export const getAllPills = async (req: Request, res: Response): Promise<void> => {
  try {
    const pills = await Pill.find();
    res.status(200).json(pills);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pills" });
  }
};
