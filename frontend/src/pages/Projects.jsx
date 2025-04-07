import { useEffect, useState } from "react";
import { fetchProjects, createProject } from "../api/projectApi";
import { useNavigate } from "react-router-dom";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const data = await fetchProjects();
    setProjects(data);
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const newProject = { name, description };
    const result = await createProject(newProject);
    if (result) {
      setName("");
      setDescription("");
      loadProjects();
    }
  };

  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Projects</h2>

      {/* Create Project Form */}
      <form
        onSubmit={handleCreateProject}
        className="mb-6 bg-white shadow p-4 rounded space-y-2"
      >
        <input
          type="text"
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Project
        </button>
      </form>

      {/* Project List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-white shadow rounded p-4 cursor-pointer hover:shadow-md transition"
            onClick={() => navigate(`/projects/${project._id}`)}
            >
            <h3 className="text-lg font-semibold">{project.name}</h3>
            <p className="text-sm text-gray-600">{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
