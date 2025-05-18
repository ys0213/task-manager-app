import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MonthlyUserChart from "./charts/MonthlyUserChart";
import ActiveUserPieChart from "./charts/ActiveUserPieChart";
import PillStatsCards from "./charts/PillStatsCards";
import { Users } from 'lucide-react';

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
      <h3 className="text-1xl font-bold">This Page is only for administrators.</h3>
      <br />
      <Link to="/admin/users">
        <span className="inline-flex items-center justify-center rounded-full border border-emerald-500 px-5 py-0.5 text-emerald-700"><Users className="w-6 h-6 text-[#333333]" />Users</span>
      </Link>
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
