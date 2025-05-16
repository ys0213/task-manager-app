import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import pillIcon from "../assets/YakTok_character.svg";
import pill_c from "../assets/free-icon-pill-5405609.png";
import pill_t from "../assets/free-icon-tablet-7038906.png";



const Home: React.FC = () => {
    const [userName, setUserName] = useState<string>("");

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
            <Card className="h-[100px] flex items-center justify-between px-6 ">
                <div className="flex-shrink-0 m-1">
                    <img src={pill_c} alt="약 캡슐 아이콘" className="w-12" />
                </div>
                <div className="flex flex-col items-start justify-center ml-4 flex-grow">
                    <h4 className="font-semibold">마그네슘</h4>
                    <h6>복용시간 08:00</h6>
                </div>
                <div className="flex gap-2">
                    <Button>버튼완</Button>
                </div>
            </Card>

            <Card className="h-[100px] flex items-center justify-between px-6 ">
                <div className="flex-shrink-0 m-1">
                    <img src={pill_c} alt="약 캡슐 아이콘" className="w-12" />
                </div>
                <div className="flex flex-col items-start justify-center ml-4 flex-grow">
                    <h4 className="font-semibold">마그네슘</h4>
                    <h6>복용시간 08:00</h6>
                </div>
                <div className="flex gap-2">
                    <Button>버튼완</Button>
                </div>
            </Card>

            <Card className="h-[100px] flex items-center justify-between px-6 ">
                <div className="flex-shrink-0 m-1">
                    <img src={pill_c} alt="약 캡슐 아이콘" className="w-12" />
                </div>
                <div className="flex flex-col items-start justify-center ml-4 flex-grow">
                    <h4 className="font-semibold">마그네슘</h4>
                    <h6>복용시간 08:00</h6>
                </div>
                <div className="flex gap-2">
                    <Button>버튼완</Button>
                </div>
            </Card>

            <Card className="h-[100px] flex items-center justify-between px-6 ">
                <div className="flex-shrink-0 m-1">
                    <img src={pill_t} alt="약 타블렛 아이콘" className="w-15" />
                </div>
                <div className="flex flex-col items-start justify-center ml-4 flex-grow">
                    <h4 className="font-semibold">마그네슘</h4>
                    <h6>복용시간 08:00</h6>
                </div>
                <div className="flex gap-2">
                    <Button>버튼완</Button>
                </div>
            </Card>

        </div>
    </div>
    );
};

export default Home;
