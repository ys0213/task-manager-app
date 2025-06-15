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
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Invalid userId format" });
    return;
  }
  try {
    const pills = await Pill.find({ userId: new mongoose.Types.ObjectId(userId) }).lean();
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

export const updatePillById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    // 업데이트할 필드를 req.body에서 추출
    const updateFields = {
      name: req.body.name,
      description: req.body.description,
      intakeCycle: req.body.intakeCycle,
      isCurrentlyUsed: req.body.isCurrentlyUsed,
      useAlarm: req.body.useAlarm,
      pillType: req.body.pillType
    };
    // 해당 약을 찾아서 업데이트
    const updatedPill = await Pill.findOneAndUpdate(
      { _id: id },
      updateFields,
      { new: true, runValidators: true }
    );
    if (!updatedPill) {
      res.status(404).json({ message: "Pill not found" });
      return;
    }
    res.status(200).json({updatedPill});
  } catch (err) {
    console.error("Update Pill Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// today
const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
};

//Get today's pill by userID
export const getTodayPillsByUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Invalid userId format" });
    return;
  }
  try {
    // 현재 사용 중인 약만 필터
    const pills = await Pill.find({
      userId: new mongoose.Types.ObjectId(userId),
      isCurrentlyUsed: true,
    }).lean();

    const pillIds = pills.map(p => new mongoose.Types.ObjectId(p._id));
    const { start, end } = getTodayRange();

    // 오늘 날짜에 복용된 약 기록 가져오기
    const userPills = await UserPill.find({
      pillId: { $in: pillIds },
      intakeDateTime: { $gte: start, $lt: end },
    }).lean();

    // 각 약에 intakeCycle 기준으로 taken 여부 및 시간 배열 추가
    const enrichedPills = pills.map(pill => {
      const takenHistory = (pill.intakeCycle || []).map((time: string) => {
        const match = userPills.find(
          up => up.pillId.toString() === pill._id.toString() && up.intakeTime === time
        );
        return {
          intakeTime: time,
          taken: !!match,
          takenTime: match?.intakeDateTime || null,
        };
      });

      return {
        ...pill,
        takenHistory,
      };
    });

    res.status(200).json(enrichedPills);
  } catch (err) {
    console.error("Get Pills By UserId Error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch today's pills" });
  }
};

// 약 복용 기록
export const recordPillIntake = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pillId, intakeTime } = req.body;

    if (!pillId || !intakeTime) {
      res.status(400).json({ message: "pillId 또는 intakeTime 누락" });
      return;
    }

    if (!["morning", "lunch", "evening"].includes(intakeTime)) {
      res.status(400).json({ message: "intakeTime 값이 올바르지 않습니다." });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(pillId)) {
      res.status(400).json({ message: "유효하지 않은 pillId" });
      return;
    }

    const pill = await Pill.findById(pillId);
    if (!pill) {
      res.status(404).json({ message: "해당 약을 찾을 수 없습니다." });
      return;
    }

    const now = new Date();
    now.setMilliseconds(0); // 정확도 통일

    // 이미 같은 날짜, intakeTime 기록이 있는지 확인
    const { start, end } = getTodayRange();
    const existing = await UserPill.findOne({
      pillId,
      intakeTime,
      intakeDateTime: { $gte: start, $lt: end },
    });

    if (existing) {
      res.status(409).json({ message: "이미 해당 시간대에 복용 기록이 있습니다." });
      return;
    }

    const newUserPill = new UserPill({
      pillId,
      intakeTime,
      intakeDateTime: now,
    });

    await newUserPill.save();

    res.status(200).json({ message: "복용 기록 완료" });
  } catch (err) {
    console.error("복용 기록 에러:", err);
    res.status(500).json({ message: "서버 오류" });
  }
};

// 약 복용 취소
export const cancelPillIntake = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pillId, intakeTime } = req.body;

    if (!pillId || !intakeTime) {
      res.status(400).json({ message: "pillId와 intakeTime이 필요합니다." });
      return;
    }

    const { start, end } = getTodayRange();

    const recordToDelete = await UserPill.findOne({
      pillId,
      intakeTime,
      intakeDateTime: { $gte: start, $lt: end },
    });

    if (!recordToDelete) {
      res.status(404).json({ message: "오늘 해당 시간대 복용 기록이 없습니다." });
      return;
    }

    await recordToDelete.deleteOne();
    res.status(200).json({ message: "복용 기록 취소 완료" });
  } catch (err) {
    console.error("복용 취소 에러:", err);
    res.status(500).json({ message: "서버 오류" });
  }
};

export const getUserPillRecordsByDate = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { date } = req.query;

  if (!userId || !date) {
    res.status(400).json({ message: "userId와 date는 필수입니다." });
  }
  
  try {
    const [year, month, day] = (date as string).split("-").map(Number);

    const startDate = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endDate = new Date(year, month - 1, day, 23, 59, 59, 999);
    const records = await UserPill.aggregate([
      {
        $match: {
          intakeDateTime: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $lookup: {
          from: "pills",
          localField: "pillId",
          foreignField: "_id",
          as: "pillDetails",
        },
      },
      { $unwind: "$pillDetails" },
      {
        $match: {
          "pillDetails.userId": new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $project: {
          intakeDateTime: 1,
          intakeTime: 1,
          name: "$pillDetails.name",
          pillType: "$pillDetails.pillType"
        },
      },
    ]);
    res.status(200).json(records);
  } catch (err) {
    console.error("복용 기록 조회 에러:", err);
    res.status(500).json({ message: "복용 기록 조회 실패" });
  }
};