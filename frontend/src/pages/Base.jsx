import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Base = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/projects/${id}`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch project", err);
      }
    };

    fetchProject();
  }, [id]);

  if (!user) return <p>Please log in to view the project details.</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold">Welcome, {user.name}!</h2>
    </div>
  );
};

export default Base;
