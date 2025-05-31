const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

console.log("API BASE URL:", import.meta.env.VITE_API_URL);

export interface UserData {
  username: string;
  name: string;
  birthDate:string;
  gender:string;
  password: string;
}

export interface UserResponse {
  id: string;
  name: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  role: string;
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

// ID로 유저 조회
export const fetchUser = async (id: string): Promise<UserResponse | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${id}`);
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

// 유저 로그인
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse | null> => {
  try {
    console.log("API BASE URL:", import.meta.env.VITE_API_URL);
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
