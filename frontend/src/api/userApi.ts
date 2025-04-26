const API_BASE_URL = "http://localhost:5000/api/user";

export interface UserData {
  username: string;
  name: string;
  password: string;
}

export interface UserResponse {
  id: string;
  name: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  name: string;
  username: string;
}

// ID로 유저 조회
export const fetchUser = async (id: string): Promise<UserResponse | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
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
    const response = await fetch(`${API_BASE_URL}`, {
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
    const response = await fetch(`${API_BASE_URL}/login`, {
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
