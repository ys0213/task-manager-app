import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import Pill from "../models/Pill";
import UserPill from "../models/User_Pill";
import UserReview from "../models/User_Review";
import mongoose from "mongoose";

interface CreateUserBody {
  username: string;
  password: string;
  name: string;
  birthDate: string;
  gender: string;
  phoneNumber: string; // 추가
}

interface LoginUserBody {
  username: string;
  password: string;
}

const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const phoneRegex = /^010-\d{4}-\d{4}$/;
// Create new User
export const createUser = async (req: Request<{}, {}, CreateUserBody>, res: Response): Promise<void> => {
  try {
    const { username, password, name, birthDate, gender, phoneNumber } = req.body;

    if (!username || !password || !name || !phoneNumber ) {
      res.status(400).json({ message: "Id, name and password are required" });
      return;
    }

    if (!passwordRegex.test(password)) {
      res.status(400).json({
        message: "비밀번호는 최소 8자, 영어 알파벳/숫자/특수문자를 각각 하나 이상 포함해야 합니다."
      });
      return;
    }

    if (!phoneRegex.test(phoneNumber)) {
      res.status(400).json({
        message: "전화번호는 010-1234-5678 형식으로 입력해주세요.",
      });
      return;
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(409).json({ message: "Id already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      name,
      birthDate: new Date(birthDate),
      gender,
      phoneNumber // 추가
    });

    const saved = await newUser.save();

    res.status(201).json({
      message: "User created",
      user: {
        id: saved._id,
        name: saved.name,
        username: saved.username,
        birthDate: saved.birthDate,
        gender: saved.gender,
        phoneNumber: saved.phoneNumber,
      },
    });
  } catch (err: any) {
    console.error("Create User Error:", err);

    if (err instanceof mongoose.Error.ValidationError) {
      // 첫 번째 ValidationError 객체를 꺼내서 .message 사용
      const firstErrorKey = Object.keys(err.errors)[0];
      const validationError = err.errors[firstErrorKey];

      res.status(400).json({ message: validationError.message });
      return;
    }
    res.status(500).json({ message: "Failed to create user" });
  }
};

// Login user
export const loginUser = async (req: Request<{}, {}, LoginUserBody>, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username, isActive: true });
    if (!user) {
      res.status(401).json({ message: "Invalid user" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    res.status(200).json({
      _id:user._id,
      name: user.name,
      username: user.username,
      id: user._id,
      birthDate: user.birthDate,
      role:user.role,
      gender:user.gender,
      rating:user.rating?user.rating:0
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    user.id = user._id;
    res.status(200).json(user);
  } catch (err) {
    console.error("Get User Error:", err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error("Get All Users Error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

//check user name duplicate
export const checkUsernameExists = async(req: Request, res: Response): Promise<void> => {
  const username = req.query.username as string;

  if (!username) {
    res.status(400).json({ error: "username query parameter is required" });
  }

  try {
    // isActive가 true인 유저 중 username 조회
    const user = await User.findOne({ username, isActive: true });

    res.json({ exists: !!user });
  } catch (error) {
    console.error("checkUsernameExists error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


export const getAlarmPillStatus = async (req: Request, res: Response) => {
  const { id: userId } = req.params;
  try {
    // 오늘 날짜 00:00 ~ 23:59 기준 시간 설정
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // 알람 설정된 pill만 필터링
    const pills = await Pill.find({ userId, useAlarm: true });

    let alarmPill = false;

    for (const pill of pills) {
      const intakeCycleLength = pill.intakeCycle?.length || 0;

      // 오늘 이 pill에 대한 복용 기록 수
      const takenCount = await UserPill.countDocuments({
        pillId: pill._id,
        intakeDateTime: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      });

      // 복용 기록이 부족하면 알람 발생
      if (takenCount < intakeCycleLength) {
        alarmPill = true;
        break;
      }
    }
    res.json({ alarmPill });
  } catch (error) {
    console.error("alarmPill 계산 오류:", error);
    res.status(500).json({ message: "서버 오류" });
  }
};

export const updateUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    // 업데이트할 필드를 req.body에서 추출
    const updateFields = {
      username: req.body.username,
      name: req.body.name,
      birthDate: req.body.birthDate,
      gender: req.body.gender,
    };

    // 해당 유저를 찾아서 업데이트
    const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
      new: true, // 업데이트 후의 문서를 반환
      runValidators: true, // 모델의 유효성 검사 적용
    }).select("-password"); // 비밀번호 제외
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      username: updatedUser.username,
      name: updatedUser.name,
      birthDate: updatedUser.birthDate,
      gender: updatedUser.gender,
    });
  } catch (err) {
    console.error("Update User Error:", err);
    res.status(500).json({ message: "Failed to update user" });
  }
};

// 유저 비활성화 (탈퇴)
export const deactivateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({ message: "User deactivated successfully" });
  } catch (error) {
    console.error("Deactivate User Error:", error);
    res.status(500).json({ message: "Failed to deactivate user" });
  }
};

// POST /api/user/feedback - 새로운 피드백 작성
export const createFeedback = async (req: Request, res: Response) => {
  const { feedback, userId } = req.body;
  try {
    const newFeedback = await UserReview.create({
      feedback,
      feedbackDateTime: new Date(),
      userId:new mongoose.Types.ObjectId(userId),
    });
    res.status(201).json(newFeedback);
  } catch (err) {
    res.status(500).json({ message: "Feedback 생성 실패", error: err });
  }
};

export const getAllFeedback = async (req: Request, res: Response) => {
  try {
    const feedbacks = await UserReview.find({ feedback: { $exists: true } }).sort({ feedbackDateTime: -1 });
    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: "피드백 조회 실패", error: err });
  }
};

// PUT /api/user/feedback/:id - 피드백 수정
export const updateFeedback = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { feedback } = req.body;
  try {
    const updated = await UserReview.findByIdAndUpdate(
      id,
      { feedback, feedbackDateTime: new Date() },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Feedback 수정 실패", error: err });
  }
};

// DELETE /api/user/feedback/:id - 피드백 삭제
export const deleteFeedback = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await UserReview.findByIdAndDelete(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Feedback 삭제 실패", error: err });
  }
};

// POST /api/user/rating - 평점 저장
export const submitRating = async (req: Request, res: Response) : Promise<void> => {
  try {
    const { userId, rating } = req.body;
    const objectUserId = new mongoose.Types.ObjectId(userId);
    const user = await User.findOne({
      _id: objectUserId,
      $or: [
        { rating: { $exists: false } },
        { rating: 0 },
      ],
    });

    if (!user) {
      res.status(400).json({ message: "이미 평점을 등록하였습니다." });
      return;
    }

    user.rating = rating;
    await user.save();

    res.status(200).json({ message: "평점이 성공적으로 등록되었습니다.", user });
  } catch (err) {
    res.status(500).json({ message: "Rating 등록 실패", error: err });
  }
};

export const findUsername = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phoneNumber } = req.body;

    if (!name || !phoneNumber) {
      res.status(400).json({ message: "이름과 전화번호를 모두 입력해주세요." });
      return;
    }

    const user = await User.findOne({ name, phoneNumber, isActive: true });

    if (!user) {
      res.status(404).json({ message: "일치하는 사용자를 찾을 수 없습니다." });
      return;
    }

    res.status(200).json({ username: user.username });
  } catch (err) {
    console.error("아이디 찾기 오류 여긴 controller:", err);
    res.status(500).json({ message: "아이디 찾기에 실패했습니다." });
  }
};

// PUT /api/user/:id/change-password
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      res.status(400).json({ message: "새 비밀번호가 필요합니다." });
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      res.status(400).json({
        message: "비밀번호는 최소 8자, 영어 알파벳/숫자/특수문자를 각각 하나 이상 포함해야 합니다.",
      });
      return;
    }

    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "비밀번호가 성공적으로 변경되었습니다." });
  } catch (err) {
    console.error("비밀번호 변경 오류:", err);
    res.status(500).json({ message: "비밀번호 변경 실패" });
  }
};


// PUT /api/user/:id/change-password
// export const changePassword = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const { currentPassword, newPassword } = req.body;

//     if (!currentPassword || !newPassword) {
//       res.status(400).json({ message: "현재 비밀번호와 새 비밀번호가 필요합니다." });
//       return;
//     }

//     if (!passwordRegex.test(newPassword)) {
//       res.status(400).json({
//         message: "비밀번호는 최소 8자, 영어 알파벳/숫자/특수문자를 각각 하나 이상 포함해야 합니다.",
//       });
//       return;
//     }

//     const user = await User.findById(id);
//     if (!user) {
//       res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
//       return;
//     }

//     const isMatch = await bcrypt.compare(currentPassword, user.password);
//     if (!isMatch) {
//       res.status(401).json({ message: "현재 비밀번호가 일치하지 않습니다." });
//       return;
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     await user.save();

//     res.status(200).json({ message: "비밀번호가 성공적으로 변경되었습니다." });
//   } catch (err) {
//     console.error("비밀번호 변경 오류:", err);
//     res.status(500).json({ message: "비밀번호 변경 실패" });
//   }
// };

