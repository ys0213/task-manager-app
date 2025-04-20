import express from "express";
import { createUser, loginUser, getUserById } from "../controllers/userController.js";

const router = express.Router();

// POST /api/user → Create user
router.post("/", createUser);

// POST /api/user/login → Login user
router.post("/login", loginUser);

// GET /api/user/:id → Get user by ID
router.get("/:id", getUserById);

export default router;
