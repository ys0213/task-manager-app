import React, { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { fetchPills } from "../../api/pillApi";

interface Pill {
  _id: string;
  name: string;
  intakeCycle: Array<"morning" | "lunch" | "evening">;
  isCurrentlyUsed: boolean;
  useAlarm: boolean;
  pillType: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const PillStatsCards: React.FC = () => {
  const [pills, setPills] = useState<Pill[]>([]);
  const [averagePerUser, setAveragePerUser] = useState<number>(0);

  useEffect(() => {
    const loadPills = async () => {
      try {
        const data = await fetchPills(); // 외부 API 함수 호출
        setPills(data);
  
        const userPillMap = new Map<string, number>();
        data.forEach((pill) => {
          userPillMap.set(pill.userId, (userPillMap.get(pill.userId) || 0) + 1);
        });
        console.log(userPillMap);
        const userCount = userPillMap.size;
        const avg = userCount ? data.length / userCount : 0;
        setAveragePerUser(parseFloat(avg.toFixed(1))); // 소수점 1자리
      } catch (err) {
        console.error("약 정보 불러오기 실패:", err);
      }
    };
  
    loadPills();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <Card className="h-[100px] flex items-center justify-between px-6">
        <div className="flex-shrink-0 m-1">
        </div>
        <div className="flex flex-col items-start justify-center ml-4 flex-grow">
          <h4 className="font-semibold">전체 등록 약 수</h4>
          <h5>{pills.length} 개</h5>
        </div>
      </Card>

      <Card className="h-[100px] flex items-center justify-between px-6">
        <div className="flex-shrink-0 m-1">
        </div>
        <div className="flex flex-col items-start justify-center ml-4 flex-grow">
          <h4 className="font-semibold">유저당 평균 약 등록 수</h4>
          <h5>{averagePerUser} 개</h5>
        </div>
      </Card>
    </div>
  );
};

export default PillStatsCards;
