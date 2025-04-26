import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";

// User 한 명에 대한 타입 정의
export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (inputPassword: string) => Promise<boolean>;
}

// 스키마 정의
const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// comparePassword 메서드 구현
userSchema.methods.comparePassword = async function (inputPassword: string): Promise<boolean> {
  return await bcrypt.compare(inputPassword, this.password);
};

// 모델 생성
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
