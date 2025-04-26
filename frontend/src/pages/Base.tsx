import { useEffect, useState } from "react";

const Base = () => {
  const [user, setUser] = useState<string | null>(null);

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

  if (!user) {
    return <p>Please log in to view the pill details.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Welcome, {user}!</h2>
    </div>
  );
};

export default Base;
