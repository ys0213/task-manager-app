import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Menu } from "lucide-react";

// Reusable navigation links component
const NavLinks = ({ onClick }) => {
  return (
    <>
      <Link to="/login" onClick={onClick} className="block hover:underline">
        Login
      </Link>
      <Link to="/dashboard" onClick={onClick} className="block hover:underline">
        Dashboard
      </Link>
      <Link to="/projects" onClick={onClick} className="block hover:underline">
        Projects
      </Link>
    </>
  );
};

const Layout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const LoginUser = localStorage.getItem("user");
    if (LoginUser) {
      setUser(LoginUser);
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
                <NavLinks onClick={() => setMenuOpen(false)} />
              </ul>
            </nav>
          )}
        </div>

        {/* App title */}
        <h1 className="text-2xl font-bold">
          <Link to="/base" className="hover:underline">
            Task Manager
          </Link>
        </h1><h3>{user}</h3>
      </header>

      <div className="flex">
        {/* Sidebar for desktop */}
        <aside className="hidden md:block w-64 bg-gray-800 p-4 space-y-4">
          <NavLinks />
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
