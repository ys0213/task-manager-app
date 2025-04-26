import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../api/userApi";

// 사용자 데이터의 타입 정의
interface UserData {
  email: string;
  name: string;
  password: string;
}

export default function SignUp() {
  const [userData, setUserData] = useState<UserData>({ email: "", name: "", password: "" });
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Handle sign up form submission
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createUser(userData); // ✅ 수정
    if (result) {
      navigate("/login");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSignUp}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text" // 수정된 부분
            name="name"
            value={userData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
        {/* Link to the Login page */}
        <div className="mt-4 text-center">
          <p>
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Login
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
