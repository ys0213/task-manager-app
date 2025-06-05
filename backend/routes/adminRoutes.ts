import express from "express";
import { getAllUsers, getUserById, userChartMolthly, activeUserCount, updateUserById, getAllPills, getPillById, updatePillsById  } from "../controllers/adminController";

const router = express.Router();

// GET /api/admin/user - Get all users
router.get("/users", getAllUsers);

// GET /api/admin/:id - Get user by ID
router.get("/user/:id", getUserById);

router.put("/userUpdate/:id", updateUserById);

router.get("/user-stats/monthly", userChartMolthly);

router.get("/user-stats/count", activeUserCount);

router.get("/pills", getAllPills);

router.get("/pill/:id", getPillById);

router.put("/pillUpdate/:id", updatePillsById);

export default router;
