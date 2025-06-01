import React, { useEffect, useState } from "react";
import { BaseButton } from "../components/ui/BaseButton";
import { Card } from "../components/ui/card";
import pillIcon from "../assets/YakTok_character.svg";
import { homeUserPills, recordPillIntake, cancelPillIntake } from "../api/pillApi";
import pill_c from "../assets/free-icon-pill-5405609.png";
import pill_t from "../assets/free-icon-tablet-7038906.png";

// 타입 정의

// 복용 시간 종류
export type IntakeTime = "morning" | "lunch" | "evening";

// 프론트에서 사용할 약 카드 정보
export type PillCard = {
  id: string;
  name: string;
  icon: string;
  intakeTime: IntakeTime;
  taken: boolean;
  takenTime?: string;
  pillId: string;
};

const intakeTimeLabels: Record<IntakeTime, string> = {
  morning: "아침",
  lunch: "점심",
  evening: "저녁",
};

const Home: React.FC = () => {
  const [userName, setUserName] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [pillCards, setPillCards] = useState<PillCard[]>([]);

  const getCurrentTime = () => {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, "0");
    const m = now.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  };

    const fetchPills = async (uid: string) => {
    try {
        const res = await homeUserPills(uid); // [{ ...pill, takenHistory: [...] }]
        const processed: PillCard[] = [];

        const todayDate = new Date().toISOString().split("T")[0];

        res.forEach((pill: any) => {
        const icon = pill.pillType === "pill" ? pill_c : pill_t;

        const takenMap: Record<IntakeTime, string | undefined> = {
            morning: undefined,
            lunch: undefined,
            evening: undefined,
        };

        // 복용 기록이 있다면 intakeTime별 takenTime 저장
        (pill.takenHistory || []).forEach((record: any) => {
            const takenDate = new Date(record.takenTime).toISOString().split("T")[0];
            if (takenDate === todayDate) {
            const time = record.intakeTime as IntakeTime;
            takenMap[time] = record.takenTime;
            }
        });

        // 복용 주기(intakeCycle)를 기준으로 각 시간대별 카드 생성
        pill.intakeCycle.forEach((time: IntakeTime) => {
            processed.push({
            id: `${pill._id}_${time}`,
            pillId: pill._id,
            name: pill.name,
            icon,
            intakeTime: time,
            taken: !!takenMap[time],
            takenTime: takenMap[time],
            });
        });
        });

        // 복용 안 한 순 → 아침 > 점심 > 저녁 순 정렬
        const sorted = processed.sort((a, b) => {
        if (a.taken === b.taken) {
            const order: IntakeTime[] = ["morning", "lunch", "evening"];
            return order.indexOf(a.intakeTime) - order.indexOf(b.intakeTime);
        }
        return a.taken ? 1 : -1;
        });

        setPillCards(sorted);
    } catch (err) {
        console.error("오늘 약 목록 불러오기 실패:", err);
    }
    };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserName(parsedUser.name);
      setUserId(parsedUser.id);
      fetchPills(parsedUser.id);
    }
  }, []);

  const handleToggle = async (pill: PillCard) => {
    try {
      if (!pill.taken) {
        await recordPillIntake(pill.pillId, pill.intakeTime);
      } else {
        await cancelPillIntake(pill.pillId, pill.intakeTime);
      }
      fetchPills(userId);
    } catch (err) {
      console.error("복용 처리 오류:", err);
    }
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <div className="px-4 w-full">
      <div className="flex justify-center mb-4">
        <img src={pillIcon} alt="약 캐릭터" className="w-40" />
        <div className="flex bg-[#F9E79F] rounded-[50px] px-6 py-4 m-5 items-center">
          <div className="flex m-4">
            <h3 className="font-bold">{userName || "Home"}</h3>
            <h3>님</h3>
          </div>
          <div className="m-5">
            <h3 className="font-bold">{formattedDate}</h3>
            <h5>오늘의 톡톡! 건강 챙겨요!</h5>
          </div>
        </div>
      </div>

      <h4 className="font-bold m-1">오늘의 톡톡!</h4>

      {pillCards.length === 0 ? (
        <div className="text-center mt-8 text-gray-500">
          오늘 복용할 약이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pillCards.map((pill) => (
            <Card
              key={pill.id}
              className={`h-[100px] flex items-center justify-between px-6 rounded-lg transition-opacity duration-300 ${
                pill.taken ? "opacity-50 border-gray-300 shadow-inner" : "opacity-100"
              }`}
            >
              <div className="flex-shrink-0 m-1">
                <img src={pill.icon} alt="약 아이콘" className="w-12" />
              </div>
              <div className="flex flex-col items-start justify-center ml-4 flex-grow">
                <h4 className="font-semibold">{pill.name}</h4>
                <h6>
                  {pill.taken
                    ? `${intakeTimeLabels[pill.intakeTime]}`
                    : `${intakeTimeLabels[pill.intakeTime]}`}
                </h6>
              </div>
              <div className="flex gap-2">
                <BaseButton onClick={() => handleToggle(pill)}>
                  {pill.taken ? "복용 취소" : "복용 기록"}
                </BaseButton>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;