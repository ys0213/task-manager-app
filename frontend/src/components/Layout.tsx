import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
// import { Menu } from "lucide-react";
import YakTokLogo from '../assets/YakTok_logo.png';
import { Home, Bell , Calendar, Pill , Settings, ShieldUser, KeyRound, BellRing } from 'lucide-react';
import { fetchUserWithAlarm } from "../api/userApi";

interface User {
    name: string;
    username: string;
    id: string;
    role : string;
    alarmPill : boolean;
}

// Define types for props
interface NavLinksProps {
    onClick: () => void;
    user: User | null;
}

// Reusable navigation links component
const NavLinks = ({ onClick, user }: NavLinksProps) => {

    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;

    const baseMenuClass =
        "flex items-center px-8 py-1 my-4 rounded-lg transition-colors hover:bg-[#58D68D]/50";
    const activeClass = "bg-[#58D68D] font-bold";

    const handleProtectedClick = (path: string) => {
    onClick();
    if (!user) {
        navigate("/login");
    } else {
        navigate(path);
    }
    };

    return (
    <>
    {/* 로그인한 경우: HOME 메뉴 */}
    {user && (
        <div
        onClick={() => handleProtectedClick("/home")}
        className={`${baseMenuClass} ${currentPath === "/home" ? activeClass : ""}`}
        >
        <span className="p-2"><Home className="w-6 h-6 text-[#333333]" /></span>
        <span className="text-[#333333]">HOME</span>
        </div>
    )}

    {/* 로그인하지 않은 경우: 로그인전 HOME 화면 메뉴 */}
    {!user && (
        <div
        onClick={() => navigate("/base")}
        className={`${baseMenuClass} ${currentPath === "/base" ? activeClass : ""}`}
        >
        <span className="p-2"><Home className="w-6 h-6 text-[#333333]" /></span>
        <span className="text-[#333333]">HOME</span>
        </div>
    )}

    {/* 다른 메뉴들 (로그인 안 했으면 클릭 시 /login으로 리디렉션) */}
    <div
        onClick={() => handleProtectedClick("/dashboard")}
        className={`${baseMenuClass} ${currentPath === "/dashboard" ? activeClass : ""}`}
    >
        <span className="p-2"><Pill className="w-6 h-6 text-[#333333]" /></span>
        <span className="text-[#333333]">약 정보</span>
    </div>

    <div
        onClick={() => handleProtectedClick("/pillsCalendar")}
        className={`${baseMenuClass} ${currentPath === "/pillsCalendar" ? activeClass : ""}`}
    >
        <span className="p-2"><Calendar className="w-6 h-6 text-[#333333]" /></span>
        <span className="text-[#333333]">달력</span>
    </div>

    <div
        onClick={() => handleProtectedClick("/mypage")}
        className={`${baseMenuClass} ${currentPath === "/mypage" ? activeClass : ""}`}
    >
        <span className="p-2"><Settings className="w-6 h-6 text-[#333333]" /></span>
        <span className="text-[#333333]">마이페이지</span>
    </div>

    {user?.role === "admin" && (
        <div
        onClick={() => handleProtectedClick("/adminBase")}
        className={`${baseMenuClass} ${currentPath === "/adminBase" ? activeClass : ""}`}
        >
        <span className="p-2"><ShieldUser className="w-6 h-6 text-[#333333]" /></span>
        <span className="text-[#333333]">관리자 페이지</span>
        </div>
    )}
    </>
    );
};


const Layout = () => {
  // Define types for useState
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                try {
                const parsed = JSON.parse(storedUser);
                const fetchedUser = await fetchUserWithAlarm(parsed._id);
                setUser(fetchedUser);
                } catch (error) {
                console.error("유저 정보 불러오기 실패:", error);
                setUser(null);
                }
            }
        };
        loadUser();
    }, []);

    const navigate = useNavigate();
    const stored = localStorage.getItem("user");

    const handleMobileProtectedClick = (path: string) => {
    if (!user) {
        navigate("/login");
    } else {
        navigate(path);
    }
    };

    return (
    <div className="min-h-screen bg-white flex justify-center md:px-[calc(100%/12)]">
        {/* 10그리드 중앙 콘텐츠 (양쪽 1그리드 마진) */}
        <div className="md:shadow w-full max-w-screen-lg">
            {/* Top header */}
            <header className="flex w-full items-center justify-between h-20 bg-white ">
                {/* App title 3그리드 */}
                <h1 className="w-64 bg-[#B0EDCA] logo-title">
                    <div
                    onClick={() => navigate(user ? "/home" : "/base")}
                    className="flex justify-center items-center cursor-pointer"
                    >
                    <img src={YakTokLogo} alt="약톡logo" className="h-20" />
                    </div>
                </h1>
                {/* User profile and notification 7그리드 */}
                <div className="flex w-full max-w-screen-md px-5 pb-2 justify-end">
                    <div onClick={() => navigate("/mypage")}
                    className="cursor-pointer hover:font-bold">
                    {user && <h5 className="m-0">{user.name}</h5>}</div>
                    <div className="ml-4">
                    {user && (
                        user.alarmPill ? (
                        <Link to="/home"><BellRing className="w-6 h-6 text-[#58D68D]" /></Link>
                        ) : (
                        <Bell className="w-6 h-6 text-[#58D68D]" />
                        )
                    )}
                    </div>
                </div>
            </header>

            <main className="flex w-full justify-center relative">
                {/* Sidebar for desktop */}
                <aside className="w-64 bg-[#B0EDCA] min-h-screen sidebar-desktop">
                    <div className="p-2 h-full">
                        <NavLinks onClick={() => setMenuOpen(false)} user={user} />
                    </div>
                </aside>

                {/* Main content area */}
                <div className="w-full max-w-screen-md px-0 md:px-4 mt-6 md:mt-0 main-content-area">
                    <Outlet />
                </div>

                  {/* Bottom Navigation (Mobile only) */}
                <nav className="bottom-nav-mobile flex justify-around items-center bg-green-200 py-3 rounded-t-xl">
                    <div
                    onClick={() => navigate(user ? "/home" : "/base")}
                    className="cursor-pointer"
                    >
                    <Home className="w-6 h-6" />
                    </div>
                    <div onClick={() => handleMobileProtectedClick("/dashboard")}>
                        <Pill className="w-6 h-6" />
                    </div>
                    <div onClick={() => handleMobileProtectedClick("/pillsCalendar")}>
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div onClick={() => handleMobileProtectedClick("/mypage")}>
                        <Settings className="w-6 h-6" />
                    </div>
                </nav>
            </main>
        </div>
    </div>
    );
};

export default Layout;
