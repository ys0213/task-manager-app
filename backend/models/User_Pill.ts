import mongoose, { Document, Schema, Types } from "mongoose";

// User_Pill 타입
export interface IUserPill extends Document {
  userId: Types.ObjectId;
  pillId: Types.ObjectId;
  intakeRecord: number;
  intakeCycle?: Date;
}

const userPillSchema: Schema<IUserPill> = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    pillId: { type: mongoose.Schema.Types.ObjectId, ref: "Pill", required: true },
    intakeRecord: { type: Number, required: true },
    intakeCycle: { type: Date },
  },
  { timestamps: true }
);

const UserPill = mongoose.model<IUserPill>("UserPill", userPillSchema);

export default UserPill;
