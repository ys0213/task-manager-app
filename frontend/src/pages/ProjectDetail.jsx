import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/projects/${id}`);
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error("Failed to fetch project", err);
      }
    };

    fetchProject();
  }, [id]);

  if (!project) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold">{project.name}</h2>
      <p className="mt-2 text-gray-600">{project.description}</p>
      {/* 여기에 프로젝트 관련 작업(Task) 리스트 등도 나중에 추가 가능 */}
    </div>
  );
};

export default ProjectDetail;
