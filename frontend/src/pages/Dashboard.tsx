import React, { useEffect, useState, useRef } from "react";
import { Card } from "../components/ui/card";
import  AddButton from "../components/ui/AddButton";
import { BaseButton } from "../components/ui/BaseButton";
import pill_c from "../assets/free-icon-pill-5405609.png";
import pill_t from "../assets/free-icon-tablet-7038906.png";
import { fetchPills, createPill, fetchPillsByUserID } from "../api/pillApi";
import { useNavigate } from "react-router-dom";
import  Modal from "../components/ui/Modal";
import ModalForm from '../components/ui/ModalForm';

// Pill 타입 정의
interface Pill {
  _id: string;
  name: string;
  description?: string;
  intakeCycle: Array<"morning" | "lunch" | "evening">;
  isCurrentlyUsed: boolean;
  useAlarm: boolean;
  pillType: "pill" | "supplement"; // 약 / 영양보조제
  userId: string;
}

interface PillFormData {
  _id: string;
  name: string;
  description: string;
  intakeCycle: Array<"morning" | "lunch" | "evening">;
  isCurrentlyUsed: boolean;
  useAlarm: boolean;
  pillType: "pill" | "supplement"; // 약 / 영양보조제
  userId: string;
}


const Dashboard: React.FC = () => {
  const [userId, setUserId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [pills, setPills] = useState<Pill[]>([]);
  // const [formData, setFormData] = useState<PillFormData>({
  //   _id: "",
  //   name: "",
  //   description: "",
  //   intakeCycle: ["morning"],
  //   isCurrentlyUsed: true,
  //   useAlarm: true,
  //   pillType: "supplement",
  //   userId: "",
  // });
  const getInitialFormData = (uid: string): PillFormData => ({
    _id: "",
    name: "",
    description: "",
    intakeCycle: ["morning"],
    isCurrentlyUsed: true,
    useAlarm: true,
    pillType: "supplement",
    userId: uid,
  });

  const [formData, setFormData] = useState<PillFormData>(getInitialFormData(""));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // 알람 토글
  const [enabled, setEnabled] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        console.log(parsed);
        if (parsed.id) {
          setUserId(parsed.id);
          setFormData((prev) => ({ ...prev, userId: parsed.id }));
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
      }
    }
  }, []);

    useEffect(() => {
    if (userId) {
      loadPills(userId);
    }    
  }, [userId]);

    const loadPills = async ( userId:string ) => {
      try {
        const data = await fetchPillsByUserID(userId);
        
        // undefined인 description을 빈 문자열로 처리
        const normalized: Pill[] = data.map((p) => ({
        _id: p._id,
        name: p.name,
        description: p.description ?? "",
        intakeCycle: p.intakeCycle,
        isCurrentlyUsed: p.isCurrentlyUsed,
        useAlarm: p.useAlarm,
        pillType: p.pillType,
        userId: p.userId
        }));
        setPills(normalized);
      } catch (error) {
        console.error("Failed to load pills", error);
      }
    };


    // 모달폼에서 데이터 받아오는 부분
      const handleChange = (field: string, value: string | boolean | string[]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
      };

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

      if (!userId) {
        console.error("User ID is missing");
        return;
      }

          const newPill: Pill = {
            _id: formData._id,
            name: formData.name,
            description: formData.description,
            intakeCycle: formData.intakeCycle,
            isCurrentlyUsed: formData.isCurrentlyUsed,
            useAlarm: formData.useAlarm,
            pillType: formData.pillType,
            userId: userId,
          };

          try {
            await createPill(newPill);

            setPills((prev) => [...prev, newPill]);

            setFormData(getInitialFormData(userId));

            setIsModalOpen(false);

          } catch (error) {
            console.error("Failed to create pill", error);
          }
        
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
          {pills.map((pill) => (
                    <Card
                      key={pill._id}
                      className="mb-5 cursor-pointer"
                      onClick={() => navigate(`/pills/${pill._id}`)}
                    >
                      <h4 className="font-semibold">{pill.name}</h4>
                      <p className="text-sm">{pill.description}</p>
                      <p className="text-sm">
                        복용 주기: {pill.intakeCycle.join(", ")}
                      </p>
                      <p className="text-sm">
                        알람: {pill.useAlarm ? "ON" : "OFF"}
                      </p>
                    </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
