const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface UserData {
  username: string;
  name: string;
  birthDate:string;
  // Age:string;
  gender:string;
  password: string;
  // Rating:string;
}

export interface UserResponse {
  id: string;
  name: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  role: string;
  birthDate:string;
  // Age:string;
  gender:string;
  // Rating:string;
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
      body: JSON.stringify(user),
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
    const response = await fetch(`/api/user/userUpdate/${id}`, {
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
