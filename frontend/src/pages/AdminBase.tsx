import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MonthlyUserChart from "./charts/MonthlyUserChart";
import ActiveUserPieChart from "./charts/ActiveUserPieChart";
import PillStatsCards from "./charts/PillStatsCards";
import { Users, Pill, NotebookPen } from 'lucide-react';

interface User {
  name: string;
  username: string;
  id: string;
  role: string;
}

const AdminBase = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed: User = JSON.parse(stored);
        if (parsed && parsed.role === "admin") {
          setUser(parsed);
        } else {
          navigate("/login");
        }
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (!user) {
    return null;
  }

  return (
    <div>
      <h3 className="text-1xl font-bold">약톡 관리자용 adminPage</h3>
      <br />
      <div>
      <Link to="/admin/users">
        <span className="inline-flex items-center justify-center rounded-full border border-emerald-500 px-5 py-0.5 text-emerald-700 mr-2"><Users className="w-6 h-6 text-[#333333] mr-2" />Users</span>
      </Link>
      <Link to="/admin/pills">
        <span className="inline-flex items-center justify-center rounded-full border border-emerald-500 px-5 py-0.5 text-emerald-700 mr-2"><Pill className="w-6 h-6 text-[#333333] mr-2" />Pills</span>
      </Link>
      <Link to="/feedbackBoard">
        <span className="inline-flex items-center justify-center rounded-full border border-emerald-500 px-5 py-0.5 text-emerald-700 mr-2"><NotebookPen className="w-6 h-6 text-[#333333] mr-2" />Feedbacks</span>
      </Link>
      </div>
      <br /><br />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-3">
          <PillStatsCards />
        </div>
        <div className="h-32 rounded"><ActiveUserPieChart /></div>
        <div className="h-32 rounded lg:col-span-2"><MonthlyUserChart /></div>
      </div>
    </div>
  );
};

export default AdminBase;
