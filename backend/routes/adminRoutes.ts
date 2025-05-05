import express from "express";
import { getAllUsers, getUserById, userChartMolthly } from "../controllers/adminController";

const router = express.Router();

// GET /api/admin/user - Get all users
router.get("/users", getAllUsers);

// GET /api/admin/:id - Get user by ID
router.get("/user/:id", getUserById);

router.get("/user-stats/monthly", userChartMolthly);

export default router;
