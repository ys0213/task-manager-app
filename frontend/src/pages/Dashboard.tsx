import React, { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import pill_c from "../assets/free-icon-pill-5405609.png";
import pill_t from "../assets/free-icon-tablet-7038906.png";
import { fetchPills, createPill } from "../api/pillApi";
import { useNavigate } from "react-router-dom";

// Pill 타입 정의
interface Pill {
  _id: string;
  name: string;
  description: string;
}

const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState<string>("");
  const [pills, setPills] = useState<Pill[]>([]);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

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
  
    const handleCreatePill = async (e: React.FormEvent) => {
      e.preventDefault();
  
      // if (!userId) {
      //   console.error("User ID is missing");
      //   return;
      // }
  
      const userIdToUse = userId || "680ce9a653867e5102057b73"; // 개발테스트용 하드코딩한 유저아이디
  
      const newPill = {
        name,
        description,
        userId: userIdToUse,
      };
  
      try {
        const result = await createPill(newPill);
        if (result) {
          setName("");
          setDescription("");
          loadPills();
        }
      } catch (error) {
        console.error("Failed to create pill", error);
      }
    };

  return (
    <div className="px-4 w-full">
      {/* 일단 임시로 약 추가하는 폼 여기! 추후 모달로 구현 */}
      <div>
        <form
          onSubmit={handleCreatePill}
          className="mb-6 bg-white shadow p-4 rounded space-y-2"
        >
          <input
            type="text"
            placeholder="Pill name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <button
            type="submit"
            className="bg-[#F9E79F] rounded-[50px] px-6 py-4 m-5 items-center text-[#333333]" 
          >
            새로운 약 추가하기
          </button>
        </form>
      </div>
      {/* 약 리스트 */}
      <h4 className="font-bold m-1">복용 리스트</h4>
      <div>
          {pills.map((pill) => (
          <Card
            key={pill._id}
            className="mb-5"
            onClick={() => navigate(`/pills/${pill._id}`)}
          >
            <div className="flex items-center justify-between px-6 ">
                <div className="flex-shrink-0 m-4">
                    <img src={pill_c} alt="약 캡슐 아이콘" className="w-12" />
                </div>
                <div className="flex flex-col items-start justify-center ml-4 flex-grow">
                    <h4 className="font-semibold">{pill.name}</h4>
                    <h5>복용시간 08:00</h5>
                    <h6>{pill.description}</h6>
                </div>
                <div className="flex gap-2">
                    <Button>수정</Button>
                    <Button>삭제</Button>
                </div>
              </div>
                <div className="flex justify-between px-8 pt-8 pb-2">
                  <img src={pill_c} alt="약 캡슐 아이콘" className="w-12" />
                  <img src={pill_c} alt="약 캡슐 아이콘" className="w-12" />
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
