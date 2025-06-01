import React, { useEffect, useState } from "react";
import { BaseButton } from "../components/ui/BaseButton";
import { Card } from "../components/ui/card";
import pillIcon from "../assets/YakTok_character.svg";
import { homeUserPills } from "../api/pillApi";
import pill_c from "../assets/free-icon-pill-5405609.png";
import pill_t from "../assets/free-icon-tablet-7038906.png";

type IntakeTime = "morning" | "lunch" | "evening";

type PillCard = {
  id: string;
  name: string;
  icon: string;
  intakeTime: IntakeTime;
  taken: boolean;
  takenTime?: string;
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
      const res = await homeUserPills(uid);

      const processed: PillCard[] = [];
      console.log("res");
        console.log(res);
      res.forEach((pill: any) => {
        const icon =
          pill.pillType === "pill"
            ? pill_c
            : pill_t;

        const takenMap: Record<IntakeTime, string | undefined> = {
            morning: undefined,
            lunch: undefined,
            evening: undefined
        };

        (pill.takenHistory || []).forEach((t: any) => {
          takenMap[t.intakeTime as IntakeTime] = t.takenTime;
        });

        pill.intakeCycle.forEach((time: IntakeTime) => {
          processed.push({
            id: pill._id + "_" + time,
            name: pill.name,
            icon,
            intakeTime: time,
            taken: !!takenMap[time],
            takenTime: takenMap[time],
          });
        });
      });

      const sorted = processed.sort((a, b) => {
        if (a.taken === b.taken) {
          const order: IntakeTime[] = ["morning", "lunch", "evening"];
          return order.indexOf(a.intakeTime) - order.indexOf(b.intakeTime);
        }
        return a.taken ? 1 : -1;
      });
      console.log(sorted);
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

  const handleToggle = (id: string) => {
    setPillCards((prev) =>
      prev
        .map((pill) => {
          if (pill.id === id) {
            if (!pill.taken) {
              return {
                ...pill,
                taken: true,
                takenTime: getCurrentTime(),
              };
            } else {
              return {
                ...pill,
                taken: false,
                takenTime: undefined,
              };
            }
          }
          return pill;
        })
        .sort((a, b) => {
          if (a.taken === b.taken) {
            const order: IntakeTime[] = ["morning", "lunch", "evening"];
            return order.indexOf(a.intakeTime) - order.indexOf(b.intakeTime);
          }
          return a.taken ? 1 : -1;
        })
    );
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <div className="px-4 w-full">
      {/* 상단 캐릭터 메시지 */}
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

      {/* 약 카드 영역 */}
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
                pill.taken
                  ? "opacity-50 border-gray-300 shadow-inner"
                  : "opacity-100"
              }`}
            >
              <div className="flex-shrink-0 m-1">
                <img src={pill.icon} alt="약 아이콘" className="w-12" />
              </div>
              <div className="flex flex-col items-start justify-center ml-4 flex-grow">
                <h4 className="font-semibold">{pill.name}</h4>
                <h6>
                  {pill.taken
                    ? `${intakeTimeLabels[pill.intakeTime]} 복용 완료 ${pill.takenTime}`
                    : `${intakeTimeLabels[pill.intakeTime]} 복용 예정`}
                </h6>
              </div>
              <div className="flex gap-2">
                <BaseButton onClick={() => handleToggle(pill.id)}>
                  {pill.taken ? "복용 취소" : "복용 완료"}
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
