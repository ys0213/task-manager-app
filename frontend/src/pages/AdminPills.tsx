import React, { useEffect, useState } from "react";
import { fetchPills, updatePill } from "../api/adminApi"; // API
import PillDetailModal from "./AdminPillModal"; // 모달 컴포넌트

interface Pill {
  _id: string;
  name: string;
  description?: string;
  intakeCycle: Array<"morning" | "lunch" | "evening">;
  isCurrentlyUsed: boolean;
  useAlarm: boolean;
  pillType: "pill" | "supplement"; // 약 / 영양보조제
  userId: string;
}

const AdminPills: React.FC = () => {
  const [pills, setPills] = useState<Pill[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // 필터 상태
  const [filterUse, setFilterUse] = useState<'all' | 'used' | 'unused'>('all');
  const [filterType, setFilterType] = useState<'all' | 'pill' | 'supplement'>('all');
  const [filterAlarm, setFilterAlarm] = useState<'all' | 'on' | 'off'>('all');

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPill, setSelectedPill] = useState<Pill | null>(null);

  useEffect(() => {
    loadPills();
  }, []);

  const loadPills = async () => {
    try {
      const data = await fetchPills();
      setPills(data);
    } catch (error) {
      console.error("약 데이터를 불러오는 중 오류 발생", error);
    }
  };

  const handlePillClick = (pill: Pill) => {
    setSelectedPill(pill);
    setIsModalOpen(true);
  };

  const handleSavePill = async (updatedPill: Pill) => {
    try {
      const result = await updatePill(updatedPill._id, updatedPill);
      if (result) {
        await loadPills();
        setIsModalOpen(false);
      } else {
        alert("업데이트 실패");
      }
    } catch (error) {
      console.error(error);
      alert("업데이트 중 오류가 발생했습니다.");
    }
  };

  const filteredPills = pills
    .filter(pill =>
      pill.userId.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(pill => {
      if (filterUse === "used") return pill.isCurrentlyUsed;
      if (filterUse === "unused") return !pill.isCurrentlyUsed;
      return true;
    })
    .filter(pill => {
      if (filterType === "pill") return pill.pillType === "pill";
      if (filterType === "supplement") return pill.pillType === "supplement";
      return true;
    })
    .filter(pill => {
      if (filterAlarm === "on") return pill.useAlarm;
      if (filterAlarm === "off") return !pill.useAlarm;
      return true;
    });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">전체 약 목록</h2>

      {/* 검색 및 필터 */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="사용자 ID 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded p-2 w-full max-w-xs bg-white text-black"
        />

        <select
          value={filterUse}
          onChange={(e) => setFilterUse(e.target.value as 'all' | 'used' | 'unused')}
          className="border rounded p-2 bg-white text-black"
        >
          <option value="all">전체 복용 상태</option>
          <option value="used">복용 중</option>
          <option value="unused">복용 안 함</option>
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as 'all' | 'pill' | 'supplement')}
          className="border rounded p-2 bg-white text-black"
        >
          <option value="all">전체 종류</option>
          <option value="pill">약</option>
          <option value="supplement">영양보조제</option>
        </select>

        <select
          value={filterAlarm}
          onChange={(e) => setFilterAlarm(e.target.value as 'all' | 'on' | 'off')}
          className="border rounded p-2 bg-white text-black"
        >
          <option value="all">알람 여부</option>
          <option value="on">알람 사용</option>
          <option value="off">알람 미사용</option>
        </select>
      </div>

      {/* 약 리스트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPills.map((pill) => (
          <div
            key={pill._id}
            className="bg-white shadow rounded p-4 cursor-pointer hover:shadow-md transition"
            onClick={() => handlePillClick(pill)}
          >
            <h3 className="text-lg font-semibold">{pill.name}</h3>
            <p className="text-sm text-gray-600">사용자 ID: {pill.userId}</p>
            <p className="text-sm text-gray-600">복용 시간: {pill.intakeCycle.join(", ")}</p>
            <p className="text-sm text-gray-600">
              종류: {pill.pillType === "pill" ? "약" : "영양보조제"}
            </p>
            <p className="text-sm text-gray-600">
              알람 사용: {pill.useAlarm ? "예" : "아니오"}
            </p>
            <p className="text-sm text-gray-600">
              복용 중: {pill.isCurrentlyUsed ? "예" : "아니오"}
            </p>
            {pill.description && (
              <p className="text-sm text-gray-500 mt-2">{pill.description}</p>
            )}
          </div>
        ))}
      </div>

      {/* 약 상세 모달 */}
      <PillDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pill={selectedPill}
        onSave={handleSavePill}
      />
    </div>
  );
};

export default AdminPills;
