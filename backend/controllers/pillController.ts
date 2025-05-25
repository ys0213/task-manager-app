import { Request, Response } from "express";
import mongoose from "mongoose";
import Pill from "../models/Pill";
import User from "../models/User";
import UserPill from "../models/User_Pill";

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

// Get pills by user id
export const getPillsByUserID = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;
  try {
    const pills = await Pill.find({ userId }).lean();
    res.status(200).json(pills);
  } catch (err) {
    console.error("Get Pills By UserId Error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch pills" });
  }
};

//Get pill by ID
export const getPillById = async (req: Request, res: Response): Promise<void> => {
  try {
    const pill = await Pill.findById(req.params.id).lean();
    if (!pill) {
      res.status(404).json({ message: "Pill not found" });
      return;
    }

    // 1. 유저 정보 조회
    const user = await User.findById(pill.userId).lean();

    // 2. 관련된 UserPill 데이터 조회
    const userPills = await UserPill.find({ pillId: pill._id }).lean();
    console.log(userPills);
    // 3. 함께 응답
    res.status(200).json({
      pill,
      user,
      userPills,
    });
  } catch (err) {
    console.error("Get Pill Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
