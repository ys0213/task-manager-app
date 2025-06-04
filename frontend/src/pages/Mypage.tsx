import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BaseButton } from "../components/ui/BaseButton";
import { Link } from 'react-router-dom';
import { MessageSquareHeart, Star } from 'lucide-react';


const Mypage = () => {
    const [user, setUser] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>("");
    
    const navigate = useNavigate();

    useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
        try {
        const parsed = JSON.parse(stored);
        if (parsed.name) {
            setUser(parsed.name);
        }
        } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        }
    }   
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserName(parsedUser.name);
        }
    }, []);

    const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    };

    if (!user) {
    return <p>Please log in to view the pill details.</p>;
    }

    return (
        <div className="max-w-xl mx-auto">
        {/* 타이틀 */}
        <h4 className="font-bold mb-10">마이페이지</h4>

        {/* 프로필 섹션 */}
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-300" />
            <div>
                <div className="text-green-500 font-semibold text-lg">{userName || "Home"}</div>
                <div className="text-sm text-gray-700">여성 · 32세</div>
            </div>
            </div>
            <button className="bg-green-200 text-sm font-semibold text-gray-700 px-4 py-1 rounded-full hover:bg-green-300 transition">
            수정
            </button>
        </div>

        {/* 버튼 섹션 */}
        <div className="grid grid-cols-2 gap-4 mb-100">
            <BaseButton onClick={() => navigate('/feedback')}>
                <div className="flex items-center justify-center gap-2 w-full">
                <MessageSquareHeart size={20} strokeWidth={1.5} />
                <span>개발자에게 바라는 점</span>
                </div>
            </BaseButton>

            <BaseButton onClick={() => navigate('/rate')}>
                <div className="flex items-center justify-center gap-2 w-full">
                <Star size={20} strokeWidth={1.5} />
                <span>앱 평가하기</span>
                </div>
            </BaseButton>
        </div>

        {/* 하단 메뉴 */}
        <div className="flex justify-center gap-6 font-bold text-[#333]">
            <button onClick={handleLogout} className="hover:text-[#58D68D] transition">로그아웃</button>
            <span>|</span>
            <button className="hover:text-[#58D68D] transition">회원탈퇴</button>
        </div>
        </div>
    );
};

export default Mypage;
