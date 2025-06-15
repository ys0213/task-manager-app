import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUserReview extends Document {
  feedback: string;
  feedbackDateTime: Date;
  userId: Types.ObjectId;
}

// ✅ 수정된 스키마 정의
const userReviewSchema = new Schema<IUserReview>(
  {
    feedback: { type: String, default: "" },
    feedbackDateTime: { type: Date, required: true, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

const UserReview = mongoose.model<IUserReview>("UserReview", userReviewSchema, "user_Review");

export default UserReview;
