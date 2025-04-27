import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../api/userApi";

// 사용자 데이터 타입 정의
interface UserData {
  username: string;
  name: string;
  password: string;
  confirmPassword: string;  // 비밀번호 확인 추가
  birthDate?: string;  // 선택 입력
}

export default function SignUp() {
  const [userData, setUserData] = useState<UserData>({
    username: "",
    name: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const navigate = useNavigate();

  // 입력값 변경 처리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 비밀번호 확인 체크
  const handlePasswordConfirm = () => {
    if (userData.password !== userData.confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordError("");
    }
  };

  // 회원가입 폼 제출 처리
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");  // 이전 에러 초기화
    setPasswordError(""); // 비밀번호 확인 에러 초기화

    // 비밀번호 확인 검증
    if (userData.password !== userData.confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
      return;
    }

    const result = await createUser(userData);

    if (result) {
      // 가입 성공 -> 로그인 페이지로 이동
      navigate("/login");
    } else {
      // 가입 실패 -> 에러 메시지 표시
      setErrorMessage("회원가입에 실패했습니다. 입력한 정보를 다시 확인해주세요.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSignUp}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        {/* 서버에서 온 에러 메시지 표시 */}
        {errorMessage && (
          <div className="mb-4 text-red-600 font-medium">{errorMessage}</div>
        )}

        {/* 아이디 입력 */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">User Id</label>
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        {/* 이름 입력 */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        {/* 생년월일 입력 (선택 사항) */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Birth Date (Optional)</label>
          <input
            type="date"
            name="birthDate"
            value={userData.birthDate}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* 비밀번호 입력 */}
        <div className="mb-6">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        {/* 비밀번호 확인 입력 */}
        <div className="mb-6">
          <label className="block mb-1 font-medium">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={handleChange}
            onBlur={handlePasswordConfirm} // 입력을 마쳤을 때 비밀번호 확인
            className="w-full p-2 border rounded-lg"
            required
          />
          {passwordError && (
            <div className="text-red-600 text-sm">{passwordError}</div>
          )}
        </div>


        {/* 회원가입 버튼 */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Sign Up
        </button>

        {/* 로그인 페이지로 가는 링크 */}
        <div className="mt-4 text-center">
          <p>
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Login
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
