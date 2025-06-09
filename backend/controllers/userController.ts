import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import Pill from "../models/Pill";
import UserPill from "../models/User_Pill";
import mongoose from "mongoose";

interface CreateUserBody {
  username: string;
  password: string;
  name: string;
  birthDate: string;
  gender: string;
}

interface LoginUserBody {
  username: string;
  password: string;
}

const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Create new User
export const createUser = async (req: Request<{}, {}, CreateUserBody>, res: Response): Promise<void> => {
  try {
    const { username, password, name, birthDate, gender } = req.body;

    if (!username || !password || !name) {
      res.status(400).json({ message: "Id, name and password are required" });
      return;
    }

    if (!passwordRegex.test(password)) {
      res.status(400).json({
        message: "비밀번호는 최소 8자, 영어 알파벳/숫자/특수문자를 각각 하나 이상 포함해야 합니다."
      });
      return;
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(409).json({ message: "Id already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      name,
      birthDate: new Date(birthDate),
      gender
    });

    const saved = await newUser.save();

    res.status(201).json({
      message: "User created",
      user: {
        id: saved._id,
        name: saved.name,
        username: saved.username,
        birthDate: saved.birthDate,
        gender: saved.gender
      },
    });
  } catch (err: any) {
    console.error("Create User Error:", err);

    if (err instanceof mongoose.Error.ValidationError) {
      // 첫 번째 ValidationError 객체를 꺼내서 .message 사용
      const firstErrorKey = Object.keys(err.errors)[0];
      const validationError = err.errors[firstErrorKey];

      res.status(400).json({ message: validationError.message });
      return;
    }
    res.status(500).json({ message: "Failed to create user" });
  }
};

// Login user
export const loginUser = async (req: Request<{}, {}, LoginUserBody>, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username, isActive: true });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    res.status(200).json({
      name: user.name,
      username: user.username,
      id: user._id,
      birthDate: user.birthDate,
      role:user.role,
      gender:user.gender
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

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
    res.status(200).json(users);
  } catch (err) {
    console.error("Get All Users Error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

//check user name duplicate
export const checkUsernameExists = async(req: Request, res: Response): Promise<void> => {
  const username = req.query.username as string;

  if (!username) {
    res.status(400).json({ error: "username query parameter is required" });
  }

  try {
    // isActive가 true인 유저 중 username 조회
    const user = await User.findOne({ username, isActive: true });

    res.json({ exists: !!user });
  } catch (error) {
    console.error("checkUsernameExists error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


export const getAlarmPillStatus = async (req: Request, res: Response) => {
  const { id: userId } = req.params;

  try {
    // 오늘 날짜 00:00 ~ 23:59 기준 시간 설정
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // 알람 설정된 pill만 필터링
    const pills = await Pill.find({ userId, useAlarm: true });

    let alarmPill = false;

    for (const pill of pills) {
      const intakeCycleLength = pill.intakeCycle?.length || 0;

      // 오늘 이 pill에 대한 복용 기록 수
      const takenCount = await UserPill.countDocuments({
        pillId: pill._id,
        intakeDateTime: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      });

      // 복용 기록이 부족하면 알람 발생
      if (takenCount < intakeCycleLength) {
        alarmPill = true;
        break;
      }
    }

    res.json({ alarmPill });
  } catch (error) {
    console.error("alarmPill 계산 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
};