import React, { useEffect, useState, useRef } from "react";
import { Card } from "../components/ui/card";
import  AddButton from "../components/ui/AddButton";
import { BaseButton } from "../components/ui/BaseButton";
import pill_c from "../assets/free-icon-pill-5405609.png";
import pill_t from "../assets/free-icon-tablet-7038906.png";
import { fetchPills, createPill } from "../api/pillApi";
import { useNavigate } from "react-router-dom";
import  Modal from "../components/ui/Modal";
import ModalForm from '../components/ui/ModalForm';

// Pill 타입 정의
interface Pill {
  _id: string;
  name: string;
  description: string;
}

interface AddPillModalContainerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PillFormData {
  _id: string;
  name: string;
  description: string;
  time: string;
  type: string;
  alarm: string;
}

const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState<string>("");
  const [pills, setPills] = useState<Pill[]>([]);
  const [formData, setFormData] = useState<PillFormData>({
    _id: '',
    name: '',
    description: '',
    time: '08:00',
    type: 'supplement',
    alarm: 'on',
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);

  // 알람 토글
  const [enabled, setEnabled] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    // localStorage에서 로그인된 사용자 정보 가져오기
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        console.log(parsed);
        if (parsed.id) {
          setUserId(parsed.id);
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
      }
    }
  }, []);

  useEffect(() => {
      loadPills();
    }, []);
  
    const loadPills = async () => {
      try {
        const data = await fetchPills();
        
        // undefined인 description을 빈 문자열로 처리
        const normalized: Pill[] = data.map((p) => ({
          _id: p._id,
          name: p.name,
          description: p.description ?? "",  // description이 undefined인 경우 빈 문자열로 처리
        }));
        
        setPills(normalized);
      } catch (error) {
        console.error("Failed to load pills", error);
      }
    };


    // 모달폼에서 데이터 받아오는 부분
      const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
      };

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('제출된 데이터:', formData);
        setIsModalOpen(false);
      };

      const handleClickSubmit = () => {
        formRef.current?.requestSubmit(); // 외부 버튼에서 form 제출 유도
      };

  return (
    <div className="px-4 w-full">
      <div>
          <AddButton
            onClick={() => setIsModalOpen(true)}
            showPlusIcon>
            새로운 약 추가하기
          </AddButton>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <ModalForm formData={formData} onChange={handleChange} />
          </form>
          {/* 모달 외부 제출 버튼 */}
          {isModalOpen && (
            <div className="mt-4 flex justify-center">
              <AddButton onClick={handleClickSubmit} showPlusIcon>
                새로운 약 추가
              </AddButton>
            </div>
          )}
        </Modal>
          
      </div>
      {/* 약 리스트 */}
      <h4 className="font-bold m-1">복용 리스트</h4>
      <div>
          {pills.map((PillFormData) => (
          <Card
            key={PillFormData._id}
            className="mb-5"
            onClick={() => navigate(`/pills/${PillFormData._id}`)}
          >
            <div className="flex items-center justify-between px-6 ">
                <div className="flex-shrink-0 m-4">
                    <img src={pill_c} alt="약 캡슐 아이콘" className="w-12" />
                </div>
                <div className="flex flex-col items-start justify-center ml-4 flex-grow">
                    <h4 className="font-semibold">{PillFormData.name}</h4>
                    <h5>복용시간 08:00</h5>
                    <h6>{PillFormData.description}</h6>
                </div>
                <div>
                <span className="text-sm">{enabled ? 'ON' : 'OFF'}</span>
                  <div
                    className={`relative w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300
                      ${enabled ? 'bg-green-500' : 'bg-gray-300'}`}
                    onClick={() => setEnabled(!enabled)}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300
                        ${enabled ? 'translate-x-6' : 'translate-x-0'}`}
                    />
                  </div>
                </div>
                {/* <div className="flex gap-2">
                    <BaseButton>수정</BaseButton>
                    <BaseButton>삭제</BaseButton>
                </div> */}
              </div>
                <div className="flex justify-between px-8 pt-8 pb-2">
                  <img src={pill_c} alt="약 캡슐 아이콘" className="w-12" />
                  <img src={pill_t} alt="약 캡슐 아이콘" className="w-12" />
                  <img src={pill_c} alt="약 캡슐 아이콘" className="w-12" />
                  <img src={pill_c} alt="약 캡슐 아이콘" className="w-12" />
                  <img src={pill_c} alt="약 캡슐 아이콘" className="w-12" />
                  <img src={pill_c} alt="약 캡슐 아이콘" className="w-12" />
                  <img src={pill_c} alt="약 캡슐 아이콘" className="w-12" />
                </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
