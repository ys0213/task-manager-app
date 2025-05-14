import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import YakTokLogo from '../../YakTok_logo.png';

interface User {
    name: string;
    username: string;
    id: string;
    role : string;
}


// Define types for props
interface NavLinksProps {
    onClick: () => void;
    user: User | null;
}

// Reusable navigation links component
const NavLinks = ({ onClick, user }: NavLinksProps) => {

    const location = useLocation();
    const currentPath = location.pathname;

    const baseMenuClass =
        "flex items-center px-8 py-1 my-4 rounded-lg transition-colors hover:bg-[#58D68D]/50";
    const activeClass = "bg-[#58D68D]";


    return (
    <>
        {!user ? (
        <Link to="/login" onClick={onClick} 
        className={`${baseMenuClass} ${currentPath === "/login" ? activeClass : ""}`}>
            Login
        </Link>
        ) : (
        <Link to="/mypage" onClick={onClick} 
        className={`${baseMenuClass} ${currentPath === "/mypage" ? activeClass : ""}`}>
            <span className="p-2">아이콘</span>
            <span>설정</span>
        </Link>
        )}
        <Link to="/home" onClick={onClick} 
        className={`${baseMenuClass} ${currentPath === "/home" ? activeClass : ""}`}>
            <span className="p-2">아이콘</span>
            <span>HOME</span>
        </Link>
        <Link to="/dashboard" onClick={onClick} 
        className={`${baseMenuClass} ${currentPath === "/dashboard" ? activeClass : ""}`}>
            <span className="p-2">아이콘</span>
            <span>대시보드</span>
        </Link>
        <Link to="/calendar" onClick={onClick} 
        className={`${baseMenuClass} ${currentPath === "/calendar" ? activeClass : ""}`}>
            <span className="p-2">아이콘</span>
            <span>달력</span>
        </Link>
        <Link to="/pills" onClick={onClick} 
        className={`${baseMenuClass} ${currentPath === "/pills" ? activeClass : ""}`}>
            <span className="p-2">아이콘</span>
            <span>약추가</span>
        </Link>
        {user&&user.role === "admin" && (
        <Link to="/adminBase" onClick={onClick} 
        className="block hover:underline text-red-400">
            Admin Page
        </Link>
        )}
    </>
    );
};

const Layout = () => {
  // Define types for useState
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
    const loginUser = localStorage.getItem("user");
    if (loginUser) {
        try {
        const parsedUser: User = JSON.parse(loginUser);
        setUser(parsedUser);
        } catch (error) {
        console.error("유저 정보를 파싱하는 데 실패했습니다:", error);
        setUser(null);
        }
    }
    }, []);

    return (
    <div className="min-h-screen bg-white flex justify-center px-[calc(100%/12)] ">
        {/* 10그리드 중앙 콘텐츠 (양쪽 1그리드 마진) */}
        <div className="shadow">
            {/* Top header */}
            <header className="flex items-center justify-between h-20 bg-white">
                {/* App title 3그리드 */}
                <h1 className="w-64 bg-[#B0EDCA] ">
                    <Link to="/base" className="flex justify-center items-center">
                    <img src={YakTokLogo} alt="약톡logo" className="h-20"/>
                    </Link>
                </h1>
                {/* User profile and notification 7그리드 */}
                <div className="flex px-5 pb-2">
                    <div className="text-gray-800">{user && <h3 className="m-0">{user.name}</h3>}</div>
                    <div className="text-gray-800 ml-4">🔔</div>
                </div>
            </header>

            <main className="flex">
                {/* Sidebar for desktop */}
                <aside className="w-64 bg-[#B0EDCA]">
                    <div className="p-2">
                        <NavLinks onClick={() => setMenuOpen(false)} user={user} />
                    </div>
                </aside>

                {/* Main content area */}
                <div className="flex">
                    <Outlet />
                </div>
            </main>
        </div>
    </div>
    );
};

export default Layout;
