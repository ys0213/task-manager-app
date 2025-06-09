import React, { useEffect, useState } from "react";

interface UserFormData {
  id: string;
  username: string;
  name: string;
  joinDate: Date;
  isActive: boolean;
  role: string;
  birthDate: Date;
  gender: string;
}

interface ModalUsersFormProps {
  formData: UserFormData | null;
  onChange: ( field: keyof UserFormData, value: any ) => void;
}


const ModalUsersForm: React.FC<ModalUsersFormProps> = ({ formData, onChange }) => {
if (!formData) return null;

  const [editUser, setEditUser] = useState<UserFormData | null>(null);
  const [error, setError] = useState("");


  const handleDateChange = (value: string) => {
    setEditUser((prev) => (prev ? { ...prev, birthDate: new Date(value) } : prev));
  };


  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white text-black rounded-lg w-full max-w-md p-6 space-y-4 shadow-lg">
        <h2 className="text-xl font-bold mb-4">사용자 정보 수정</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <label className="block text-sm font-medium">아이디</label>
          <p className="text-gray-700">{formData.username}</p>
        </div>

        <div>
          <label className="block text-sm font-medium">이름</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">생일</label>
          <input
            type="date"
            value={new Date(formData.birthDate).toISOString().substring(0, 10)}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">성별</label>
          <select
            value={formData.gender}
            onChange={(e) => onChange("gender", e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="male">남자</option>
            <option value="female">여자</option>
          </select>
        </div>


      </div>
    </div>
  );
};

export default ModalUsersForm;
