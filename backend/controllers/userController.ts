import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";

interface CreateUserBody {
  email: string;
  password: string;
  name: string;
}

interface LoginUserBody {
  email: string;
  password: string;
}

// Create new User
export const createUser = async (req: Request<{}, {}, CreateUserBody>, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ message: "Email, name and password are required" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "Email already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, name });
    const saved = await newUser.save();

    res.status(201).json({
      message: "User created",
      user: {
        id: saved._id,
        name: saved.name,
        email: saved.email
      }
    });
  } catch (err) {
    console.error("Create User Error:", err);
    res.status(500).json({ message: "Failed to create user" });
  }
};

// Login user
export const loginUser = async (req: Request<{}, {}, LoginUserBody>, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
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
      email: user.email,
      id: user._id
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
