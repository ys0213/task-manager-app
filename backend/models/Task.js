import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
