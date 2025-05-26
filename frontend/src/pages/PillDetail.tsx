import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Pill 타입 정의
interface Pill {
  name: string;
  description?: string;
  intakeCycle: Array<"morning" | "lunch" | "evening">;
  isCurrentlyUsed: boolean;
  useAlarm: boolean;
  pillType: "pill" | "supplement"; // 약 / 영양보조제
  userId: string;
}

interface User {
  username: string;
  name: string;
  birthDate: string;
  gender: string;
  joinDate: string;
  role: "admin" | "user";
  isActive: boolean;
}

interface UserPill {
  pillId: string;
  intakeDateTime: string;
}

const PillDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pill, setPill] = useState<Pill | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userPills, setUserPills] = useState<UserPill[]>([]);

  useEffect(() => {
    const fetchPill = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/pills/${id}`);
        const data = await res.json();
        setPill(data.pill);
        setUser(data.user);
        setUserPills(data.userPills);
      } catch (err) {
        console.error("Failed to fetch pill", err);
      }
    };

    if (id) fetchPill();
  }, [id]);

  if (!pill) return <p>Loading...</p>;

return (
  <div>
    <h3 className="text-2xl font-bold">약 정보</h3>
    <p className="mt-2 text-gray-600">{pill.name}</p>
    <p className="mt-2 text-gray-600">{pill.description || "설명 없음"}</p>
    <p className="mt-2 text-gray-600">복용 시간: {pill.intakeCycle.join(", ")}</p>
    <p className="mt-2 text-gray-600">현재 복용 중: {pill.isCurrentlyUsed ? "예" : "아니오"}</p>
    <p className="mt-2 text-gray-600">알람 사용: {pill.useAlarm ? "예" : "아니오"}</p>
    <p className="mt-2 text-gray-600">종류: {pill.pillType}</p>

    {user && (
      <>
        <h3 className="text-2xl font-bold">사용자 정보</h3>
        <p className="mt-1 text-gray-700">이름: {user.name}</p>
        <p className="mt-1 text-gray-700">아이디: {user.username}</p>
        <p className="mt-1 text-gray-700">생년월일: {new Date(user.birthDate).toLocaleDateString()}</p>
        <p className="mt-1 text-gray-700">성별: {user.gender}</p>
        <p className="mt-1 text-gray-700">가입일: {new Date(user.joinDate).toLocaleDateString()}</p>
        <p className="mt-1 text-gray-700">역할: {user.role}</p>
        <p className="mt-1 text-gray-700">활성화 상태: {user.isActive ? "활성" : "비활성"}</p>
      </>
    )}

    <h3 className="mt-4 text-xl font-semibold">복용 이력</h3>
    {userPills.length > 0 ? (
      <ul className="list-disc list-inside">
        {userPills.map((item, index) => (
          <li key={index} className="mt-1 text-gray-700">
            {new Date(item.intakeDateTime).toLocaleString()}
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-600">복용 이력이 없습니다.</p>
    )}
  </div>
);
};

export default PillDetail;
