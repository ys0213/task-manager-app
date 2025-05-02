const API_BASE_URL = "http://localhost:5000/api/admin";

export interface UserResponse {
  id: string; //DB system id
  username: string; // user login id
  name: string;  // user name
  joinDate: string;
  isActive: boolean;
  role: string;
  birthDate?: string;
}

export const fetchUsers = async (): Promise<UserResponse[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    return await response.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};

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



