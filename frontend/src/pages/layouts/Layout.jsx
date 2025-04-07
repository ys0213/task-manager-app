import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Menu } from "lucide-react";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`bg-gray-800 p-4 space-y-4 w-64 ${
            sidebarOpen ? "block" : "hidden"
          } md:block`}
        >
          <Link to="/dashboard" className="block hover:underline">
            Dashboard
          </Link>
          <Link to="/projects" className="block hover:underline">
            Projects
          </Link>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b border-gray-700">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              <Menu />
            </button>
            <h1 className="text-2xl font-bold">Task Manager</h1>
          </header>

          {/* Routed Content */}
          <main className="flex-1 p-6 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
