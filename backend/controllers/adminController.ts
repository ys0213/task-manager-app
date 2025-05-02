import { Request, Response } from "express";
import User from "../models/User";

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
    }));
    res.status(200).json(formattedUsers);
  } catch (err) {
    console.error("Get All Users Error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
