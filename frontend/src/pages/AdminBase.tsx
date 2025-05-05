import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MonthlyUserChart from "./MonthlyUserChart";

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
      <h2 className="text-2xl font-bold">This is Admin Page</h2>
      <Link to="/admin/users" className="block hover:underline">
        Users
      </Link>

      <MonthlyUserChart />
    </div>
  );
};

export default AdminBase;
