import mongoose, { Document, Schema } from "mongoose";

// User 타입
export interface IUser extends Document {
  username: string; //Id
  name: string;
  password: string;
  birthDate?: Date;
  joinDate: Date;
  role: "admin" | "user";
  isActive: boolean;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 4,
      match: /^[a-zA-Z0-9]+$/, // 알파벳 + 숫자만 허용
    },
    name: { type: String, required: true },
    password: {
      type: String,
      required: true,
    },
    birthDate: { type: Date },
    joinDate: { type: Date, required: true, default: Date.now },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    isActive: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
