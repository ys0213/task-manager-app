const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface UserData {
  username: string;
  name: string;
  birthDate:string;
  // Age:string;
  gender:string;
  password: string;
  // Rating:string;
  phoneNumber: string;
}

export interface UserResponse {
  id: string;
  name: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  role: string;
  joinDate: Date;
  birthDate:Date;
  isActive: boolean;
  Age:string;
  gender:string;
  Rating:number;
  phoneNumber: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  name: string;
  username: string;
  role: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  role: string;
  alarmPill: boolean;
}

export interface FeedbackItem {
  _id: string;
  feedback: string;
  feedbackDateTime: string;
  userId:string;
}

// ID로 유저 조회
export const fetchUser = async (id: string): Promise<UserResponse | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/by-id/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    return await response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

// 유저 생성
export const createUser = async (user: UserData): Promise<UserResponse | null> => {
  try {
    // 생년월일 기준으로 한국식 나이 계산
    const calculateKoreanAge = (birthDateStr: string): string => {
      const birthYear = new Date(birthDateStr).getFullYear();
      const currentYear = new Date().getFullYear();
      const age = currentYear - birthYear + 1;
      return age.toString();
    };
    // Age 자동 삽입
    const userWithAge = {
      ...user,
      Age: calculateKoreanAge(user.birthDate),
    };

    const response = await fetch(`${API_BASE_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userWithAge),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to create user");
    }

    return await response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const updateUser = async (
  id: string,
  updatedUserData: Partial<UserResponse>
): Promise<UserResponse | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/userUpdate/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUserData),
    });
    if (!response.ok) {
      throw new Error("Failed to update user");
    }
    return await response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};



// 유저 로그인
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    return await response.json();
  } catch (err) {
    console.error("Login error:", err);
    return null;
  }
};

export async function checkUsernameExists(username: string): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/user/check-username?username=${encodeURIComponent(username)}`);
  if (!res.ok) throw new Error("Failed to check username");
  const data = await res.json();
  return data.exists;
}


// 유저 탈퇴
export const deactivateUser = async (userId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/deactivate/${userId}`, {
      method: "PATCH",
    });

    if (!response.ok) {
      throw new Error("Failed to deactivate user");
    }

    return true;
  } catch (err) {
    console.error("Deactivate error:", err);
    return false;
  }
};


export const fetchUserWithAlarm = async (userId: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/user/${userId}/alarm-pill`);
  if (!response.ok) {
    throw new Error("유저 알람 정보를 불러오는 데 실패했습니다.");
  }
  const data = await response.json();

  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    throw new Error("로컬 스토리지에 유저 정보가 없습니다.");
  }
  const parsed = JSON.parse(storedUser);
  return {
    id: parsed.id,
    name: parsed.name,
    username: parsed.username,
    role: parsed.role,
    alarmPill: data.alarmPill || false,
  };
};

// 피드백 생성
export const createFeedback = async (feedback: string, userId: string) => {
  const response = await fetch(`${API_BASE_URL}/user/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ feedback, userId }),
  });

  if (!response.ok) {
    throw new Error("피드백 생성 실패");
  }

  return response.json();
};

// 전체 피드백 리스트 가져오기
export const fetchFeedbackList = async (): Promise<FeedbackItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/feedback`);
    if (!response.ok) {
      throw new Error("피드백 불러오기 실패");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("fetchFeedbackList error:", err);
    return [];
  }
};

// 피드백 수정
export const updateFeedback = async (userId: string, feedback: string) => {
  const response = await fetch(`${API_BASE_URL}/user/feedback/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ feedback }),
  });

  if (!response.ok) {
    throw new Error("피드백 수정 실패");
  }

  return response.json();
};

// 피드백 삭제
export const deleteFeedback = async (userId: string) => {
  const response = await fetch(`${API_BASE_URL}/user/feedback/${userId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("피드백 삭제 실패");
  }
};

// 평점 등록
export const submitRating = async (userId:string, rating: number) => {
  const response = await fetch(`${API_BASE_URL}/user/rating`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, rating }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "평점 등록 실패");
  }

  return response.json();
};


export const findUsername = async (name: string, phoneNumber: string): Promise<string | null> => {
  console.log(name,phoneNumber)
  try {
    const response = await fetch(`${API_BASE_URL}/user/find-username`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, phoneNumber }),
    });
    console.log(response)

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "아이디 찾기 실패");
    }

    const data = await response.json();
    return data.username || null;
  } catch (error) {
    console.error("아이디 찾기 오류:", error);
    return null;
  }
};


// 비밀번호 변경 (아이디로)
export const changePassword = async (username: string, newPassword: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, newPassword }),
    });

    if (!response.ok) {
      throw new Error("비밀번호 변경 실패");
    }

    return true;
  } catch (error) {
    console.error("비밀번호 변경 오류:", error);
    return false;
  }
};

