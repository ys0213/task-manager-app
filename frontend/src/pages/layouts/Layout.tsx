import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Menu } from "lucide-react";

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
  return (
    <>
      {!user ? (
        <Link to="/login" onClick={onClick} className="block hover:underline">
          Login
        </Link>
      ) : (
        <Link to="/mypage" onClick={onClick} className="block hover:underline">
          My Page
        </Link>
      )}
      <Link to="/dashboard" onClick={onClick} className="block hover:underline">
        Dashboard
      </Link>
      <Link to="/pills" onClick={onClick} className="block hover:underline">
        Pills
      </Link>
      {user&&user.role === "admin" && (
        <Link to="/adminBase" onClick={onClick} className="block hover:underline text-red-400">
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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-700 relative">
        {/* Mobile menu button */}
        <div className="relative md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <Menu />
          </button>

          {/* Mobile dropdown menu */}
          {menuOpen && (
            <nav className="absolute top-full left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-50">
              <ul className="flex flex-col p-4 space-y-2">
                <NavLinks onClick={() => setMenuOpen(false)} user={user} />
              </ul>
            </nav>
          )}
        </div>

        {/* App title */}
        <h1 className="text-2xl font-bold">
          <Link to="/base" className="hover:underline">
            약톡
          </Link>
        </h1>
        {user && <h3>{user.name}</h3>}
      </header>

      <div className="flex">
        {/* Sidebar for desktop */}
        <aside className="hidden md:block w-64 bg-gray-800 p-4 space-y-4">
          <NavLinks onClick={() => setMenuOpen(false)} user={user} />
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
