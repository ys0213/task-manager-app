import React, { useEffect, useState } from "react";
import { BaseButton } from "../components/ui/BaseButton";
import { Card } from "../components/ui/card";
import pillIcon from "../assets/YakTok_character.svg";
import pill_c from "../assets/free-icon-pill-5405609.png";
import pill_t from "../assets/free-icon-tablet-7038906.png";


type Pill = {
    id: string;
    name: string;
    icon: string;
    scheduledTime: string;
    taken: boolean;
    takenTime?: string;
    };

const Home: React.FC = () => {
    const [userName, setUserName] = useState<string>("");
    const [pills, setPills] = useState<Pill[]>([
    {
        id: "1",
        name: "마그네슘",
        icon: pill_c,
        scheduledTime: "08:00",
        taken: false,
        },
        {
        id: "2",
        name: "오메가3",
        icon: pill_c,
        scheduledTime: "09:00",
        taken: false,
        },
        {
        id: "3",
        name: "비타민D",
        icon: pill_c,
        scheduledTime: "07:30",
        taken: false,
        },
        {
        id: "4",
        name: "철분",
        icon: pill_t,
        scheduledTime: "10:00",
        taken: false,
        },
    ]);

    useEffect(() => {
    // localStorage에서 로그인된 사용자 정보 가져오기
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
      setUserName(parsedUser.name); // name만 저장
    }
    }, []);

    const today = new Date();
    const formattedDate = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    });

    const getCurrentTime = () => {
        const now = new Date();
        const h = now.getHours().toString().padStart(2, '0');
        const m = now.getMinutes().toString().padStart(2, '0');
        return `${h}:${m}`;
    };

    const handleToggle = (id: string) => {
        setPills(prev =>
        prev
            .map(pill => {
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
                return a.scheduledTime.localeCompare(b.scheduledTime);
            }
            return a.taken ? 1 : -1; // 복용한 약은 뒤로
            })
        );
    };

    return (
    <div className="px-4 w-full">
        {/* 상단에 캐릭터 메시지 */}
        <div className="flex justify-center mb-4">
            <img src={pillIcon} alt="약 캐릭터" className="w-40" />
            <div className="flex bg-[#F9E79F] rounded-[50px] px-6 py-4 m-5 items-center">
                <div className="flex m-4">
                    <h3 className="font-bold">{userName ? `${userName}` : "Home"}</h3><h3>님</h3>
                </div>
                <div className="m-5">
                    <h3 className="font-bold ">{formattedDate}</h3>
                    <h5>오늘의 톡톡! 건강 챙겨요!</h5>
                </div>
            </div>
        </div>

        {/* 약 들어가는 공간 */}
        <h4 className="font-bold m-1">오늘의 톡톡!</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* card */}
                {pills.map(pill => (
                <Card
                    key={pill.id}
                    className={`h-[100px] flex items-center justify-between px-6 rounded-lg transition-opacity duration-300 ${
                        pill.taken ? 'opacity-50 border-gray-300 shadow-inner' : 'opacity-100'
                    }`} >
                    <div className="flex-shrink-0 m-1">
                    <img src={pill.icon} alt="약 아이콘" className="w-12" />
                    </div>
                    <div className="flex flex-col items-start justify-center ml-4 flex-grow">
                    <h4 className="font-semibold">{pill.name}</h4>
                    <h6>
                        {pill.taken
                        ? `복용 완료 ${pill.takenTime}`
                        : `복용시간 ${pill.scheduledTime}`}
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
    </div>
    );
};

export default Home;
