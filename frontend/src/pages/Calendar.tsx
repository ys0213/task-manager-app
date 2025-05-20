import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";


const Calendar = () => {
  const [user, setUser] = useState<string | null>(null);
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return <p>Please log in to view the pill details.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Welcome, {user}!</h2>
      <Button
        type="button"
        onClick={handleLogout}
        className="px-4 py-2 text-sm"
      >
        잠만 여기는 캘린더임
      </Button>
    </div>
  );
};

export default Calendar;
