import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Menu } from "lucide-react";

const Layout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-700 relative">
        <div className="relative md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <Menu />
          </button>
          {menuOpen && (
            <nav className="absolute top-full left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-50">
              <ul className="flex flex-col p-4 space-y-2">
                <li>
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block hover:underline"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/projects"
                    onClick={() => setMenuOpen(false)}
                    className="block hover:underline"
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block hover:underline"
                  >
                    Login
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </div>

        <h1 className="text-2xl font-bold">
          <Link to="/" className="hover:underline">
            Task Manager
          </Link>
        </h1>
      </header>

      <div className="flex">
        {/* Sidebar for desktop */}
        <aside className="hidden md:block w-64 bg-gray-800 p-4 space-y-4">
          <Link to="/dashboard" className="block hover:underline">
            Dashboard
          </Link>
          <Link to="/projects" className="block hover:underline">
            Projects
          </Link>
          <Link to="/login" className="block hover:underline">
            Login
          </Link>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
