import { useEffect, useState } from "react";

const Base = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const LoginUser = localStorage.getItem("name");
    if (LoginUser) {
      setUser(LoginUser);
    }
  }, []);

  if (!user) return <p>Please log in to view the project details.</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold">Welcome, {user}!</h2>
    </div>
  );
};

export default Base;
