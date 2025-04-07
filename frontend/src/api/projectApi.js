const API_BASE_URL = "http://localhost:5000/api";

export const fetchProjects = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`);
    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }
    return await response.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const createProject = async (projectData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create project");
      }
  
      return await response.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  };