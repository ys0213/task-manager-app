const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

console.log("API BASE URL:", import.meta.env.VITE_API_URL);

interface Pill {
  _id: string;
  name: string;
  description?: string;
  intakeCycle: Array<"morning" | "lunch" | "evening">;
  isCurrentlyUsed: boolean;
  useAlarm: boolean;
  pillType: "pill" | "supplement";
  userId: string;
}

export interface PillData {
  _id: string;
  name: string;
  description?: string;
  intakeCycle: Array<"morning" | "lunch" | "evening">;
  isCurrentlyUsed: boolean;
  useAlarm: boolean;
  pillType: "pill" | "supplement";
  userId: string;
}

export interface PillResponse {
  _id: string;
  name: string;
  description?: string;
  intakeCycle: Array<"morning" | "lunch" | "evening">;
  isCurrentlyUsed: boolean;
  useAlarm: boolean;
  pillType: "pill" | "supplement";
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// 전체 가져오기
export const fetchPills = async (): Promise<PillResponse[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/pills`);
    if (!response.ok) {
      throw new Error("Failed to fetch pills");
    }
    return await response.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};

// 유저별 약리스트 가져오기
export const fetchPillsByUserID = async (userId: string): Promise<PillResponse[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/pills/user/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch pills");
    }
    return await response.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};

// 생성하기
export const createPill = async (pillData: PillData): Promise<PillResponse | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/pills`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pillData),
    });

    if (!response.ok) {
      throw new Error("Failed to create pill");
    }

    return await response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

//유저 홈 오늘의 약 목록 불러오기
export const homeUserPills = async (userId: string): Promise<PillResponse[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/pills/today/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch today's pills");
    }
    return await response.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};

// 수정하기
export const updatePill = async (Pill: Pill ): Promise<PillResponse | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/pills/${Pill._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Pill),
    });

    if (!response.ok) {
      throw new Error("Failed to update pill");
    }

    return await response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

// 삭제하기
export const deletePill = async (pillId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/pills/${pillId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete pill");
    }

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
