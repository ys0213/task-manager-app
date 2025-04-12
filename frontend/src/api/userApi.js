const API_BASE_URL = "http://localhost:5000/api";

export const fetchUser = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/user`);
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    return await response.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const createUser = async (user) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
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