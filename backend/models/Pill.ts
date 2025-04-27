import mongoose, { Document, Schema, Types } from "mongoose";

// Pill 타입
export interface IPill extends Document {
  name: string;
  description?: string;
  intakeCount: number;
  isCurrentlyUsed: boolean;
  pillType: "pill" | "supplement"; // 약 / 영양보조제
  userId: Types.ObjectId;
}

const pillSchema: Schema<IPill> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    intakeCount: { type: Number, default: 1, min: 1 }, // 최소 1 이상
    isCurrentlyUsed: { type: Boolean, default: true },
    pillType: { 
      type: String, 
      enum: ["pill", "supplement"], 
      default: "supplement" 
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

const Pill = mongoose.model<IPill>("Pill", pillSchema);

export default Pill;
