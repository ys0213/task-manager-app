import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BaseButton } from "../components/ui/BaseButton";
import  AddButton from "../components/ui/AddButton";
import { MessageSquareHeart, Star } from "lucide-react";
import Modal from "../components/ui/Modal";
import ModalUsersForm from "../components/ui/ModalUsersForm";
import { updateUser, deactivateUser, submitRating } from "../api/userApi";
import ModalRatingForm from "../components/ui/ModalRatingForm"; // 새로 만들 컴포넌트

interface User {
  id: string;
  username: string;
  name: string;
  joinDate: Date;
  isActive: boolean;
  role: string;
  birthDate: Date;
  Age:string;
  gender: string;
}

const Mypage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [formData, setFormData] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);


  const formRef = useRef<HTMLFormElement>(null);

    // 현재 로그인한 관리자 ID 가져오기
    useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);

          // Age가 없으면 birthDate를 바탕으로 계산하여 추가
          if (parsed.birthDate && !parsed.Age) {
            const birth = new Date(parsed.birthDate);
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            const m = today.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
              age--;
            }
            parsed.Age = `${age}세`;

            // localStorage에 다시 저장
            localStorage.setItem("user", JSON.stringify(parsed));
          }

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

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!formData) return;

  if (!formData.name || !formData.username || !formData.role) {
    alert("필수 정보를 입력해주세요.");
    return;
  }

  try {
    const updatedUser = await updateUser(formData.id, {
      name: formData.name,
      birthDate: formData.birthDate.toISOString(),
      gender: formData.gender,
    });

if (updatedUser) {
  const calculateAge = (birthDate: Date) => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return `${age}세`;
};
  // 기존 user 상태가 null이 아닐 때만 진행
  setUser((prevUser) => {
    if (!prevUser) return prevUser;

    return {
      ...prevUser,   // 기존 데이터 유지
      name: updatedUser.name,
      birthDate: new Date(updatedUser.birthDate),
      Age: calculateAge(new Date(updatedUser.birthDate)),
      gender: updatedUser.gender,
    };
  });

  // localStorage도 마찬가지로 기존 저장 데이터 업데이트
  const updatedUserForStorage = {
    ...user,  // 기존 user 변수
    name: updatedUser.name,
    birthDate: updatedUser.birthDate,
    Age: calculateAge(new Date(updatedUser.birthDate)),
    gender: updatedUser.gender,
  };
  localStorage.setItem("user", JSON.stringify(updatedUserForStorage));

  alert("사용자 정보가 수정되었습니다.");
  setIsModalOpen(false);
} else {
      alert("사용자 정보 수정에 실패했습니다.");
    }
  } catch (err) {
    console.error(err);
    alert("사용자 정보를 수정하는 데 실패했습니다.");
  }
};

  const handleClickSubmit = () => {
    formRef.current?.requestSubmit();
  };


const handleRatingSubmit = async (rating: number) => {
  try {
    await submitRating(rating);
    alert("평가가 등록되었습니다.");
    setIsRatingModalOpen(false);
  } catch (error: any) {
    alert(error?.message || "이미 평가를 제출하셨거나 오류가 발생했습니다.");
  }
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
            <div className="text-sm text-gray-700 flex">
              <div className="mr-5">{user.gender === "male" ? "남자" : user.gender === "female" ? "여자" : "기타"}</div>
              <div>{user.Age}</div>
            </div>
          </div>
        </div>
        <button onClick={handleOpenModal} className="bg-green-200 text-sm font-semibold text-gray-700 px-6 py-3 rounded-full hover:bg-green-300 transition">수정</button>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <ModalUsersForm formData={formData} onChange={handleChange} />

          {/* 저장하기 버튼은 이 안에서 렌더링해야 합니다 */}
          <div className="mt-4 flex justify-center">
            <AddButton
              type="button" onClick={handleClickSubmit} className="cursor-pointer mt-5">저장하기
            </AddButton>
          </div>
        </form>
      </Modal>


      <div className="grid grid-cols-2 gap-4 mb-10">
        <BaseButton onClick={() => navigate("/feedbackBoard")}>
          <div className="flex items-center justify-center gap-2 w-full">
            <MessageSquareHeart size={20} strokeWidth={1.5} />
            <span>개발자에게 바라는 점</span>
          </div>
        </BaseButton>

    <BaseButton onClick={() => setIsRatingModalOpen(true)}>
      <div className="flex items-center justify-center gap-2 w-full">
        <Star size={20} strokeWidth={1.5} />
        <span>앱 평가하기</span>
      </div>
    </BaseButton>

    <Modal isOpen={isRatingModalOpen} onClose={() => setIsRatingModalOpen(false)}>
      <ModalRatingForm onSubmit={handleRatingSubmit} />
    </Modal>
        
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
