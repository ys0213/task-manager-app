import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import YakTokLogo from '../assets/YakTok_logo.png';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface User {
  username: string;
  name: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {

    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        if (parsedUser?.username) {
          navigate("/home");
        }
      } catch (error) {
        console.error("Failed to parse user data:", error);        
      }
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {        
        throw new Error("Login failed");        
      }

      const user: User = await response.json();

      // Save user info properly
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
      alert("로그인에 실패했습니다.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
      >
        <div className="flex items-center justify-center">
          <img src={YakTokLogo} alt="약톡logo" className="h-20"/>
        </div>
        <h5 className="m-6 text-center font-bold" style={{ color: '#333' }}>어서오세요!<br/>오늘도 톡톡! 당신의 건강을 챙겨드릴게요</h5>
        <div className="mb-4">
          <label className="block mb-1 font-medium">아이디</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-200 text-sm font-semibold text-gray-700 px-6 py-3 rounded-full hover:bg-green-300 transition"
        >
          로그인
        </button>

        {/* Link to signup */}
        <p className="mt-4 text-center">
          귀여운 약톡과 함께 시작해요~ {" "}
          <a href="/task-manager-app/#/signup" className="text-blue-600 hover:text-blue-700 font-semibold " style={{ color: '#58D68D' }}>
            약톡 가입하기
          </a>
        </p>

        {/* 아이디 찾기 / 비밀번호 변경하기 링크 */}
        <div className="mt-6 flex justify-center gap-6 font-bold text-[#333]">
          <span
            onClick={() => navigate("/findUsernamePage")}
            className="hover:text-[#58D68D] transition"
          >
            아이디 찾기
          </span>
          <span
            onClick={() => navigate("/changePasswordPage")}
            className="hover:text-[#58D68D] transition"
          >
            비밀번호 변경하기
          </span>
        </div>
      </form>
    </div>
  );
}
