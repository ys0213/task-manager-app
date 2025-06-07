import { Request, Response } from "express";
import User from "../models/User";
import Pill from "../models/Pill";

// Get user by ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Get User Error:", err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select("-password");
    const formattedUsers = users.map(user => ({
      id: (user as any)._id.toString(),
      username: user.username,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      joinDate: user.joinDate,
      birthDate: user.birthDate,
      gender: user.gender,
    }));
    res.status(200).json(formattedUsers);
  } catch (err) {
    console.error("Get All Users Error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const userChartMolthly = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$joinDate" },
            month: { $month: "$joinDate" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // 형식 변환
    const formatted = result.map((entry) => ({
      month: `${entry._id.month}월`,
      count: entry.count,
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).send("통계 데이터를 불러오지 못했습니다.");
  }
};

export const activeUserCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await User.aggregate([
      {
        $group: {
          _id: "$isActive",
          count: { $sum: 1 },
        },
      },
    ]);

    const formatted = result.map((entry) => ({
      name: entry._id ? "활동중" : "탈퇴회원",
      value: entry.count,
    }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).send("활동 여부 통계 데이터를 불러오지 못했습니다.");
  }
};

export const updateUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    // 업데이트할 필드를 req.body에서 추출
    const updateFields = {
      username: req.body.username,
      name: req.body.name,
      role: req.body.role,
      isActive: req.body.isActive,
      birthDate: req.body.birthDate,
      joinDate: req.body.joinDate,
      gender: req.body.gender,
    };

    // 해당 유저를 찾아서 업데이트
    const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
      new: true, // 업데이트 후의 문서를 반환
      runValidators: true, // 모델의 유효성 검사 적용
    }).select("-password"); // 비밀번호 제외
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      username: updatedUser.username,
      name: updatedUser.name,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
      joinDate: updatedUser.joinDate,
      birthDate: updatedUser.birthDate,
      gender: updatedUser.gender,
    });
  } catch (err) {
    console.error("Update User Error:", err);
    res.status(500).json({ message: "Failed to update user" });
  }
};

// Get Pills by ID
export const getPillById = async (req: Request, res: Response): Promise<void> => {
  try {
    const pill = await Pill.findById(req.params.id);
    if (!Pill) {
      res.status(404).json({ message: "Pill not found" });
      return;
    }

    res.status(200).json(Pill);
  } catch (err) {
    console.error("Get Pill Error:", err);
    res.status(500).json({ message: "Failed to fetch Pill" });
  }
};

// Get all Pills
export const getAllPills = async (req: Request, res: Response): Promise<void> => {
  try {
    const Pills = await Pill.find();
    const formattedPills = Pills.map(Pill => ({
      id: (Pill as any)._id.toString(),
      name: Pill.name,
      description: Pill.description,
      intakeCycle: Pill.intakeCycle,
      isCurrentlyUsed: Pill.isCurrentlyUsed,
      useAlarm: Pill.useAlarm,
      pillType: Pill.pillType,
      userId: Pill.userId,
      createdAt: Pill.createdAt,
      updatedAt: Pill.updatedAt
    }));
    res.status(200).json(formattedPills);
  } catch (err) {
    console.error("Get All Users Error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};


export const updatePillsById = async (req: Request, res: Response): Promise<void> => {
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

    res.status(200).json(updatedPill);
  } catch (err) {
    console.error("Update User Error:", err);
    res.status(500).json({ message: "Failed to update user" });
  }
};