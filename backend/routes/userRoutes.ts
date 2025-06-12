import express from "express";
import { createUser, loginUser, getUserById, checkUsernameExists, getAlarmPillStatus, updateUserById, 
    createFeedback, updateFeedback, deleteFeedback, submitRating } from "../controllers/userController";

const router = express.Router();

// POST /api/user - Create user
router.post("/", createUser);

// POST /api/user/login - Login user
router.post("/login", loginUser);

// username duplicate check
router.get("/check-username", checkUsernameExists);

// GET /api/user/:id - Get user by ID
router.get("/by-id/:id", getUserById);

// GET /api/user/:id/alarm-pill - 사용자 알람 상태 가져오기
router.get("/:id/alarm-pill", getAlarmPillStatus);

// PUT /api/user/userUpdate/:id - 사용자 정보 수정
router.put("/userUpdate/:id", updateUserById);

// 유저 리뷰 관련
router.post("/feedback", createFeedback);

router.put("/feedback/:id", updateFeedback);

router.delete("/feedback/:id", deleteFeedback);

// router.post("/rating", submitRating);


export default router;
