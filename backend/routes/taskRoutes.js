import express from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

// GET: 전체 작업 조회
router.get("/", getTasks);

// POST: 작업 추가
router.post("/", createTask);

// PUT: 작업 수정
router.put("/:id", updateTask);

// DELETE: 작업 삭제
router.delete("/:id", deleteTask);

export default router;
