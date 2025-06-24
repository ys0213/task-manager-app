import { useState } from "react";
import { useNavigate } from "react-router-dom";
import YakTokLogo from '../assets/YakTok_logo.png';
import { findUsername } from "../api/userApi"; // 경로는 실제 파일에 맞게 수정해주세요


export default function FindUsernamePage() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [foundUsername, setFoundUsername] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleFindUsername = async () => {
    setError("");
    const username = await findUsername(name, phoneNumber);
    if (username) {
      setFoundUsername(username);
    } else {
      setFoundUsername(null);
      setError("일치하는 사용자를 찾을 수 없습니다.");
    }
  };

  return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-8 overflow-auto">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-center">아이디 찾기</h2>

            <input
                type="text"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-2 mb-3 rounded"
            />

            <input
                type="tel"
                placeholder="전화번호 (예: 010-1234-5678)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full border p-2 mb-3 rounded"
            />

            <button
                onClick={handleFindUsername}
                className="w-full bg-green-200 text-sm font-semibold text-gray-700 px-6 py-3 mt-3 rounded-full hover:bg-green-300 transition"
            >
                아이디 찾기
            </button>

            {foundUsername && (
                <p className="mt-4 text-green-600 text-center">
                찾은 아이디: <strong>{foundUsername}</strong>
                </p>
            )}
            {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
            <p className="mt-4 text-center">
              <a href="/task-manager-app/#/login" className="text-blue-600 hover:text-blue-700 font-semibold " style={{ color: '#58D68D' }}>
                로그인 하러 가기
              </a>
            </p>
            </div>
        </div>
    
  );
}