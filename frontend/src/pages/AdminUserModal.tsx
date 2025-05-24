import React, { useEffect, useState } from "react";

interface User {
  id: string;
  username: string;
  name: string;
  joinDate: Date;
  isActive: boolean;
  role: string;
  birthDate: Date;
  gender: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave?: (updatedUser: User) => void;
}

const UserDetailModal: React.FC<Props> = ({ isOpen, onClose, user, onSave }) => {
  const [editUser, setEditUser] = useState<User | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setEditUser({ ...user });
      setError("");
    }
  }, [user]);

  if (!isOpen || !editUser) return null;

  const handleChange = (field: keyof User, value: string) => {
    setEditUser((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleDateChange = (value: string) => {
    setEditUser((prev) => (prev ? { ...prev, birthDate: new Date(value) } : prev));
  };

  const handleSubmit = () => {
    if (!editUser.name || !editUser.username || !editUser.role) {
      setError("필수 정보를 모두 입력하세요.");
      return;
    }

    // onSave 콜백이 있으면 전달
    if (onSave) {
      onSave(editUser);
    }

    onClose(); // 모달 닫기
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white text-black rounded-lg w-full max-w-md p-6 space-y-4 shadow-lg">
        <h2 className="text-xl font-bold mb-4">사용자 정보 수정</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <label className="block text-sm font-medium">아이디</label>
          <p className="text-gray-700">{editUser.username}</p>
        </div>

        <div>
          <label className="block text-sm font-medium">이름 *</label>
          <input
            type="text"
            value={editUser.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">생일</label>
          <input
            type="date"
            value={new Date(editUser.birthDate).toISOString().substring(0, 10)}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">성별 *</label>
          <select
            value={editUser.role}
            onChange={(e) => handleChange("gender", e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="male">남자</option>
            <option value="female">여자</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">가입일</label>
          <p className="text-gray-700">{editUser.joinDate.toLocaleDateString("ko-KR")}</p>
        </div>

        <div>
            <label className="block text-sm font-medium">상태 *</label>
            <select
                value={editUser.isActive ? "true" : "false"}
                onChange={(e) => {
                const value = e.target.value === "true";
                setEditUser((prev) => (prev ? { ...prev, isActive: value } : prev));
                }}
                className="w-full border p-2 rounded"
            >
                <option value="true">활동중</option>
                <option value="false">탈퇴회원</option>
            </select>
        </div>

        <div>
          <label className="block text-sm font-medium">역할 *</label>
          <select
            value={editUser.role}
            onChange={(e) => handleChange("role", e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="user">일반회원</option>
            <option value="admin">관리자</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 rounded text-white">취소</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 rounded text-white">저장</button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
