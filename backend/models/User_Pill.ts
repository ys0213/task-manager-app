import mongoose, { Document, Schema, Types } from "mongoose";

// User_Pill 타입
export interface IUserPill extends Document {
  pillId: Types.ObjectId;
  intakeDateTime: Date;
}

const userPillSchema: Schema<IUserPill> = new mongoose.Schema(
  {    
    pillId: { type: mongoose.Schema.Types.ObjectId, ref: "Pill", required: true },
    intakeDateTime: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

const UserPill = mongoose.model<IUserPill>("UserPill", userPillSchema, "user_pill");

export default UserPill;
