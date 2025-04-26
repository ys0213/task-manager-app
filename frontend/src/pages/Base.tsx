import { useEffect, useState } from "react";

const Base = () => {
  // Define the user state type as string | null since user can be either string or null
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const loginUser = localStorage.getItem("name");
    if (loginUser) {
      setUser(loginUser);
    }
  }, []);

  if (!user) return <p>Please log in to view the pill details.</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold">Welcome, {user}!</h2>
    </div>
  );
};

export default Base;
