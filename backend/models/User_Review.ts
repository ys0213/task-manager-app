import mongoose, { Document, Schema, Types } from "mongoose";

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

const UserReview = mongoose.model<IUserReview>("UserReview", userReviewSchema, "user_Review");

export default UserReview;
