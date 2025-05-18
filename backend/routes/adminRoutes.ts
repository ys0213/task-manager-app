import express from "express";
import { getAllUsers, getUserById, userChartMolthly, activeUserCount, updateUserById } from "../controllers/adminController";

const router = express.Router();

// GET /api/admin/user - Get all users
router.get("/users", getAllUsers);

// GET /api/admin/:id - Get user by ID
router.get("/user/:id", getUserById);

router.put("/userUpdate/:id", updateUserById);

router.get("/user-stats/monthly", userChartMolthly);

router.get("/user-stats/count", activeUserCount);

export default router;
