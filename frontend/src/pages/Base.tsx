import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import QuizWithCharacter from "../components/ui/QuizWithCharacter";
import { User } from "lucide-react";

const Base = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col bg-white">

      {/* 메인 컨텐츠 */}
      <div className="w-full px-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          안녕하세요! <span className="text-[#58D68D]">약톡</span>에 오신 걸 환영해요!
        </h3>
        <p className="text-gray-600 text-sm mb-1">
          건강은 소중하니까, 저와 함께 재미있게 약 챙기기 습관을 만들어봐요~
        </p>
        <p className="text-gray-600 text-sm mb-3">
          먼저, 작은 퀴즈로 두뇌도 깨워볼까요? 틀려도 괜찮아요. 같이 배워가면 되니까요!
        </p>

        {/* 미니 퀴즈 / 게임 */}
        <QuizWithCharacter />

        <div className="flex items-center justify-center mt-6 space-x-3">
          <p className="text-gray-800 font-medium">약톡과 함께 건강한 습관을 만들어요!</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-[#58D68D] text-white font-semibold px-5 py-2 rounded-full hover:bg-[#45c779] transition"
          >
            로그인 하러가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Base;
