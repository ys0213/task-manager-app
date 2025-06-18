import { useState } from "react";
import { useNavigate } from "react-router-dom";
import YakTokLogo from '../assets/YakTok_logo.png';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, currentPassword, newPassword }),
      });

      if (!response.ok) {
        throw new Error("비밀번호 변경 실패");
      }

      alert("비밀번호가 성공적으로 변경되었습니다.");
      navigate("/login");
    } catch (error) {
      alert("비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleChangePassword}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
      >
        <div className="flex justify-center mb-6">
          <img src={YakTokLogo} alt="약톡logo" className="h-20" />
        </div>
        <h5 className="mb-6 text-center font-bold" style={{ color: '#333' }}>
          비밀번호 변경
        </h5>

        <div className="mb-4">
          <label className="block mb-1 font-medium">아이디</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">현재 비밀번호</label>
          <input
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">새 비밀번호</label>
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">새 비밀번호 확인</label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={e => setConfirmNewPassword(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-200 text-sm font-semibold text-gray-700 px-6 py-3 rounded-full hover:bg-green-300 transition"
        >
          비밀번호 변경
        </button>

        <p className="mt-6 text-center text-sm text-gray-500 cursor-pointer" onClick={() => navigate("/login")}>
          로그인 화면으로 돌아가기
        </p>
      </form>
    </div>
  );
}
