import React, { useEffect, useState } from "react";

type IntakeTime = "morning" | "lunch" | "evening";

interface Pill {
  id: string;
  name: string;
  description?: string;
  intakeCycle: IntakeTime[];
  isCurrentlyUsed: boolean;
  useAlarm: boolean;
  pillType: "pill" | "supplement";
  userId: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pill: Pill | null;
  onSave?: (updatedPill: Pill) => void;
}

const PillDetailModal: React.FC<Props> = ({ isOpen, onClose, pill, onSave }) => {
  const [editPill, setEditPill] = useState<Pill | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (pill) {
      setEditPill({ ...pill });
      setError("");
    }
  }, [pill]);

  if (!isOpen || !editPill) return null;

  const handleChange = (field: keyof Pill, value: string | boolean) => {
    setEditPill((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleToggleIntakeCycle = (value: IntakeTime) => {
    setEditPill((prev) => {
      if (!prev) return prev;
      const isSelected = prev.intakeCycle.includes(value);
      const updatedCycle = isSelected
        ? prev.intakeCycle.filter((time) => time !== value)
        : [...prev.intakeCycle, value];
      return { ...prev, intakeCycle: updatedCycle };
    });
  };

  const handleSubmit = () => {
    if (!editPill.name || !editPill.pillType || !editPill.userId) {
      setError("필수 정보를 모두 입력하세요.");
      return;
    }

    if (onSave) onSave(editPill);
    onClose();
  };

  const intakeOptions: IntakeTime[] = ["morning", "lunch", "evening"];

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white text-black rounded-lg w-full max-w-md p-6 space-y-4 shadow-lg">
        <h2 className="text-xl font-bold mb-4">약 정보 수정</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <label className="block text-sm font-medium">약 이름</label>
          <input
            type="text"
            value={editPill.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">설명</label>
          <textarea
            value={editPill.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">복용 시점</label>
          <div className="flex gap-4">
            {intakeOptions.map((option) => (
              <label key={option} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={editPill.intakeCycle.includes(option)}
                  onChange={() => handleToggleIntakeCycle(option)}
                />
                {option === "morning" && "아침"}
                {option === "lunch" && "점심"}
                {option === "evening" && "저녁"}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">사용 여부</label>
          <select
            value={editPill.isCurrentlyUsed ? "true" : "false"}
            onChange={(e) => handleChange("isCurrentlyUsed", e.target.value === "true")}
            className="w-full border p-2 rounded"
          >
            <option value="true">사용 중</option>
            <option value="false">사용 안 함</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">알람 설정</label>
          <select
            value={editPill.useAlarm ? "true" : "false"}
            onChange={(e) => handleChange("useAlarm", e.target.value === "true")}
            className="w-full border p-2 rounded"
          >
            <option value="true">알람 ON</option>
            <option value="false">알람 OFF</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">약 종류</label>
          <select
            value={editPill.pillType}
            onChange={(e) => handleChange("pillType", e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="pill">약</option>
            <option value="supplement">영양제</option>
          </select>
        </div>

        {/* <div>
          <label className="block text-sm font-medium">사용자 ID</label>
          <p className="text-gray-700">{editPill.userId}</p>
        </div> */}

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 rounded text-white">취소</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 rounded text-white">저장</button>
        </div>
      </div>
    </div>
  );
};

export default PillDetailModal;
