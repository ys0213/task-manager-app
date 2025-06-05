import mongoose, { Document, Schema, Types } from "mongoose";

// Pill 타입
export interface IPill extends Document {
  _id: string;
  name: string;
  description?: string;
  intakeCycle: Array<"morning" | "lunch" | "evening">;
  isCurrentlyUsed: boolean;
  useAlarm: boolean;
  pillType: "pill" | "supplement"; // 약 / 영양보조제
  userId: Types.ObjectId;
  createdAt: string;
  updatedAt: string;
}

const pillSchema: Schema<IPill> = new mongoose.Schema(
  {
    _id: { type: String },
    name: { type: String, required: true },
    description: { type: String },
    intakeCycle: { type: [String], enum: ["morning", "lunch", "evening"], required: true, },
    isCurrentlyUsed: { type: Boolean, default: true },
    useAlarm: { type: Boolean, default: true },
    pillType: { 
      type: String, 
      enum: ["pill", "supplement"], 
      default: "supplement" 
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: String },
  updatedAt: { type: String }
  
  },
  { timestamps: true }
);

const Pill = mongoose.model<IPill>("Pill", pillSchema);

export default Pill;
