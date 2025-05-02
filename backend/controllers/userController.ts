import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import mongoose from "mongoose";

interface CreateUserBody {
  username: string;
  password: string;
  name: string;
  birthDate?: string;
}

interface LoginUserBody {
  username: string;
  password: string;
}

const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Create new User
export const createUser = async (req: Request<{}, {}, CreateUserBody>, res: Response): Promise<void> => {
  try {
    const { username, password, name, birthDate } = req.body;

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
      ...(birthDate && { birthDate: new Date(birthDate) }), // birthDate가 있을 때만 추가
    });

    const saved = await newUser.save();

    res.status(201).json({
      message: "User created",
      user: {
        id: saved._id,
        name: saved.name,
        username: saved.username,
        birthDate: saved.birthDate,
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

    const user = await User.findOne({ username });
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
