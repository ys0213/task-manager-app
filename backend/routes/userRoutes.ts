import express from "express";
import { createUser, loginUser, getUserById, checkUsernameExists } from "../controllers/userController";

const router = express.Router();

// POST /api/user - Create user
router.post("/", createUser);

// POST /api/user/login - Login user
router.post("/login", loginUser);

// username duplicate check
router.get("/check-username", checkUsernameExists);

// GET /api/user/:id - Get user by ID
router.get("/:id", getUserById);

export default router;
