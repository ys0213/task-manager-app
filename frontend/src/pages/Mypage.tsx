import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BaseButton } from "../components/ui/BaseButton";
import { MessageSquareHeart, Star } from "lucide-react";
import Modal from "../components/ui/Modal";
import ModalUsersForm from "../components/ui/ModalUsersForm";
import { deactivateUser } from "../api/userApi";

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

const Mypage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
const [userId, setUserId] = useState<string>("");
  
  const [formData, setFormData] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

    // 현재 로그인한 관리자 ID 가져오기
    useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed._id) setUserId(parsed._id);
        setUser(parsed);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Failed to parse user from localStorage", error);
        }
      }
    }, []);

  const handleOpenModal = () => {
    if (user) {
      setFormData(user);
      setIsModalOpen(true);
    }
  };

  const handleChange = (field: keyof User, value: any) => {
    if (!formData) return;
    setFormData((prev) => ({ ...prev!, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    if (!formData.name || !formData.username || !formData.role) {
      alert("필수 정보를 입력해주세요.");
      return;
    }

    setUser(formData);
    localStorage.setItem("user", JSON.stringify(formData));
    setIsModalOpen(false);
  };

  const handleClickSubmit = () => {
    formRef.current?.requestSubmit();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleDeactivate = async () => {
    if (!user?.id) {
      alert("유저 정보를 불러올 수 없습니다.");
      return;
    }

    const confirmDelete = window.confirm("정말로 회원탈퇴 하시겠습니까?");
    if (!confirmDelete) return;

    const success = await deactivateUser(user.id);
    if (success) {
      alert("회원 탈퇴가 완료되었습니다.");
      handleLogout();
    } else {
      alert("회원 탈퇴에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (!isLoggedIn || !user) {
    return <p>Please log in to view the page.</p>;
  }

  return (
    <div className="max-w-xl mx-auto">
      <h4 className="font-bold mb-10">마이페이지</h4>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-300" />
          <div>
            <div className="text-green-500 font-semibold text-lg">{user.name}</div>
            <div className="text-sm text-gray-700">
              <div>  {user.gender === "male" ? "남자" : user.gender === "female" ? "여자" : "기타"}</div>
            </div>
          </div>
        </div>
        <button onClick={handleOpenModal} className="bg-green-200 text-sm font-semibold text-gray-700 px-6 py-3 rounded-full hover:bg-green-300 transition">수정</button>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
<ModalUsersForm formData={formData} onChange={handleChange} />

        </form>
        <div className="mt-4 flex justify-center">
            {/* 모달 외부 제출 버튼 */}
            {isModalOpen && (
              <button onClick={handleClickSubmit} className="px-4 py-2 bg-blue-600 rounded text-white">
                저장하기
              </button>
                )}
        </div>
      </Modal>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <BaseButton onClick={() => navigate("/feedback")}>
          <div className="flex items-center justify-center gap-2 w-full">
            <MessageSquareHeart size={20} strokeWidth={1.5} />
            <span>개발자에게 바라는 점</span>
          </div>
        </BaseButton>

        <BaseButton onClick={() => navigate("/rate")}>
          <div className="flex items-center justify-center gap-2 w-full">
            <Star size={20} strokeWidth={1.5} />
            <span>앱 평가하기</span>
          </div>
        </BaseButton>
      </div>

      <div className="flex justify-center gap-6 font-bold text-[#333]">
        <button onClick={handleLogout} className="hover:text-[#58D68D] transition">
          로그아웃
        </button>
        <span>|</span>
        <button onClick={handleDeactivate} className="hover:text-[#58D68D] transition">
          회원탈퇴
        </button>
      </div>
    </div>
  );
};

export default Mypage;
