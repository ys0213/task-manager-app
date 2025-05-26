const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

console.log("API BASE URL:", import.meta.env.VITE_API_URL);

export interface UserResponse {
  id: string; //DB system id
  username: string; // user login id
  name: string;  // user name
  joinDate: string;
  isActive: boolean;
  role: string;
  birthDate: Date;
  gender: string;
}

export const fetchUsers = async (): Promise<UserResponse[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users`);
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
    const response = await fetch(`${API_BASE_URL}/admin/user/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    return await response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const fetchMonthlyUserStats = async () => {
  const res = await fetch("/api/admin/user-stats/monthly");
  if (!res.ok) throw new Error("Failed to fetch user stats");

  return await res.json();
};

export const fetchActiveUserCount = async () => {
  const res = await fetch("/api/admin/user-stats/count");
  if (!res.ok) throw new Error("Failed to fetch user stats");

  return await res.json();
};

export const updateUser = async (
  id: string,
  updatedUserData: Partial<UserResponse>
): Promise<UserResponse | null> => {
  try {
    const response = await fetch(`/api/admin/userUpdate/${id}`, {
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
