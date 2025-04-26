import mongoose, { Document, Schema } from "mongoose";

// 프로젝트 타입
export interface IPill extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const pillSchema: Schema<IPill> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

// 모델 타입
const Pill = mongoose.model<IPill>("Pill", pillSchema);

export default Pill;
