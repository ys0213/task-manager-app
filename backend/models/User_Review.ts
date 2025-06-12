import mongoose, { Document, Schema, Types } from "mongoose";

// User_Review 타입 정의
export interface IUserReview extends Document {
  _id: Types.ObjectId;
  feedback: string;
  feedbackDateTime: Date;
  rating: number;
  ratingDateTime: Date;
}

// ✅ 수정된 스키마 정의
const userReviewSchema = new Schema<IUserReview>(
  {
    feedback: { type: String, default: "" },
    feedbackDateTime: { type: Date, required: true, default: Date.now },
    rating: { type: Number, min: 1, max: 5 },
    ratingDateTime: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

// ✅ 모델 생성 (컬렉션 이름: "User_Review")
const UserReview = mongoose.model<IUserReview>("UserReview", userReviewSchema, "User_Review");

export default UserReview;
