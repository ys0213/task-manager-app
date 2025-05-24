import { Request, Response } from "express";
import mongoose from "mongoose";
import Pill from "../models/Pill";

// Create a new pill
export const createPill = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, intakeCycle, isCurrentlyUsed, useAlarm, pillType, userId } = req.body;

    // name과 userId 둘 다 필수
    if (!name || !userId) {
      res.status(400).json({ message: "Pill name and userId are required" });
      return;
    }

    // userId가 유효한 ObjectId인지 확인
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Invalid userId format" });
      return;
    }

    const newPill = new Pill({
      name,
      description,
      intakeCycle,
      isCurrentlyUsed,
      useAlarm,
      pillType,
      userId,
    });

    const savedPill = await newPill.save();
    res.status(201).json(savedPill);
  } catch (err) {
    console.error("Create Pill Error:", err);
    res.status(500).json({ error: "Failed to create pill" });
  }
};

// Get all pills
export const getAllPills = async (req: Request, res: Response): Promise<void> => {
  try {
    const pills = await Pill.find();
    res.status(200).json(pills);
  } catch (err) {
    console.error("Get All Pills Error:", err);
    res.status(500).json({ error: "Failed to fetch pills" });
  }
};
