import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser, checkUsernameExists, checkPhoneNumberExists } from "../api/userApi";
import YakTokLogo from '../assets/YakTok_logo.png';


// 사용자 데이터 타입 정의
interface UserData {
  username: string;
  name: string;
  phoneNumber: string, 
  password: string;
  confirmPassword: string;  // 비밀번호 확인 추가
  birthDate: string;
  gender: string;
}

export default function SignUp() {
  const [userData, setUserData] = useState<UserData>({
    username: "",
    name: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    gender: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  // 아이디 중복 체크 상태
  const [isUsernameChecked, setIsUsernameChecked] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const [usernameCheckError, setUsernameCheckError] = useState<string>("");

  const [phoneNumberCheckError, setPhoneNumberCheckError] = useState("");
  const [isPhoneNumberChecked, setIsPhoneNumberChecked] = useState(false);
  const [isPhoneNumberAvailable, setIsPhoneNumberAvailable] = useState(false);

  const navigate = useNavigate();

  // 입력값 변경 처리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 아이디가 수정되면 중복 체크 초기화
    if (name === "username") {
      setIsUsernameChecked(false);
      setIsUsernameAvailable(false);
      setUsernameCheckError("");
    }
  };

  const handleChangeEnum = (field: keyof UserData, value: string) => {
    setUserData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  // 비밀번호 확인 체크
  const handlePasswordConfirm = () => {
    if (userData.password !== userData.confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordError("");
    }
  };

  // 아이디 중복 확인 함수
  const handleUsernameCheck = async () => {
    setUsernameCheckError("");
    setIsUsernameChecked(false);
    setIsUsernameAvailable(false);

    if (userData.username.length < 4) {
      setUsernameCheckError("아이디는 4글자 이상이어야 합니다.");
      return;
    }

    try {
      const exists = await checkUsernameExists(userData.username);
      if (exists) {
        setUsernameCheckError("이미 사용 중인 아이디입니다.");
        setIsUsernameAvailable(false);
      } else {
        setIsUsernameAvailable(true);
      }
      setIsUsernameChecked(true);
    } catch (error) {
      setUsernameCheckError("아이디 중복 확인 중 오류가 발생했습니다.");
      setIsUsernameChecked(false);
      setIsUsernameAvailable(false);
    }
  };

  // 전화번호 중복 확인 함수
  const handlePhoneNumberCheck = async () => {
    setPhoneNumberCheckError("");
    setIsPhoneNumberChecked(false);
    setIsPhoneNumberAvailable(false);

    if (!/^010-\d{4}-\d{4}$/.test(userData.phoneNumber)) {
      setPhoneNumberCheckError("전화번호는 010-1234-5678 형식이어야 합니다.");
      return;
    }

    try {
      const exists = await checkPhoneNumberExists(userData.phoneNumber);
      if (exists) {
        setPhoneNumberCheckError("이미 등록된 전화번호입니다.");
        setIsPhoneNumberAvailable(false);
      } else {
        setIsPhoneNumberAvailable(true);
      }
      setIsPhoneNumberChecked(true);
    } catch (error) {
      setPhoneNumberCheckError("전화번호 중복 확인 중 오류가 발생했습니다.");
      setIsPhoneNumberChecked(false);
      setIsPhoneNumberAvailable(false);
    }
  };


      const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value.replace(/\D/g, ""); // 숫자만 남김

      // 하이픈 자동 삽입
      if (value.length >= 3 && value.length <= 7) {
        value = value.replace(/^(\d{3})(\d+)/, "$1-$2");
      } else if (value.length > 7) {
        value = value.replace(/^(\d{3})(\d{4})(\d+)/, "$1-$2-$3");
      }

      setUserData((prev) => ({
        ...prev,
        phoneNumber: value,
      }));
    };

  // 회원가입 폼 제출 처리
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");  // 이전 에러 초기화
    setPasswordError(""); // 비밀번호 확인 에러 초기화

    if (!isUsernameChecked || !isUsernameAvailable) {
      setErrorMessage("아이디 중복 확인을 해주세요.");
      return;
    }

    // ✅ 전화번호 유효성 검사 추가
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(userData.phoneNumber)) {
      setErrorMessage("전화번호는 010-1234-5678 형식으로 입력해주세요.");
      return;
    }

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
        <div className="flex items-center justify-center">
          <img src={YakTokLogo} alt="약톡logo" className="h-20"/>
        </div>
        <h4 className="m-3 text-center font-bold" style={{ color: '#333' }}>회원가입</h4>

        {/* 서버에서 온 에러 메시지 표시 */}
        {errorMessage && (
          <div className="mb-4 text-red-600 font-medium">{errorMessage}</div>
        )}

        {/* 아이디 입력 */}
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <label className="font-medium">아이디</label>
            <span className="font-medium text-red-600 text-sm">4글자 이상</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleChange}
              className="flex-grow p-2 border rounded-lg"
              required
            />
            <button
              type="button"
              onClick={handleUsernameCheck}
              disabled={userData.username.length < 4}
              className={`px-4 py-2 rounded-lg border ${
                userData.username.length < 4
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-green-200 font-semibold text-gray-700 hover:bg-green-300"
              } transition`}
            >
              중복확인
            </button>
          </div>

          {/* 중복확인 에러 or 성공 메시지 */}
          {usernameCheckError && (
            <p className="text-red-600 text-sm mt-1">{usernameCheckError}</p>
          )}
          {!usernameCheckError && isUsernameChecked && isUsernameAvailable && (
            <p className="text-green-600 text-sm mt-1">사용 가능한 아이디입니다.</p>
          )}
        </div>

        {/* 이름 입력 */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">이름</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        {/* 폰번호 입력 중복 검사까지 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            전화번호
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="phoneNumber"
              placeholder="010-1234-5678"
              value={userData.phoneNumber}
              onChange={handlePhoneNumberChange}
              className="flex-grow p-2 border rounded-lg"
              required
            />
            <button
              type="button"
              onClick={handlePhoneNumberCheck}
              disabled={userData.phoneNumber.length < 13}
              className={`px-4 py-2 rounded-lg border ${
                userData.phoneNumber.length < 13
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-green-200 font-semibold text-gray-700 hover:bg-green-300"
              } transition`}
            >
              중복확인
            </button>
          </div>
            {/* 중복확인 에러 or 성공 메시지 */}
            {phoneNumberCheckError && (
              <p className="text-red-600 text-sm mt-1">{phoneNumberCheckError}</p>
            )}
            {!phoneNumberCheckError && isPhoneNumberChecked && isPhoneNumberAvailable && (
              <p className="text-green-600 text-sm mt-1">사용 가능한 전화번호입니다.</p>
            )}
        </div>


        {/* 생년월일 입력 */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">생년월일</label>
          <input
            type="date"
            name="birthDate"
            value={userData.birthDate}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        {/* 성별 입력 */}
        <div className="mb-4">
          <label className="block text-sm font-medium">성별</label>
          <select
            value={userData.gender}
            onChange={(e) => handleChangeEnum("gender", e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="" disabled>성별을 선택하세요</option>
            <option value="male">남자</option>
            <option value="female">여자</option>
          </select>
        </div>

        {/* 비밀번호 입력 */}
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <label className="block mb-1 font-medium">비밀번호</label>
            <span className="font-medium text-red-600 text-sm">8글자 이상. 문자, 숫자, 특수문자 포함</span>
          </div>          
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
          <label className="block mb-1 font-medium">비밀번호 확인</label>
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
          className="w-full bg-green-200 text-sm font-semibold text-gray-700 px-6 py-3 rounded-full hover:bg-green-300 transition"
        >
          회원가입
        </button>

        {/* 로그인 페이지로 가는 링크 */}
        <div className="mt-4 text-center">
          <p>
            약톡 계정이 있으신가요?{" "}
            <a
              href="/task-manager-app/#/login"
              className="text-blue-600 hover:text-blue-700 font-semibold " style={{ color: '#58D68D' }}
            >
              로그인 하러가기
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
