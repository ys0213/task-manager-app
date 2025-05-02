import { useEffect, useState } from "react";
import { fetchUsers, UserResponse } from "../api/adminApi";
import { useNavigate } from "react-router-dom";

// User 타입 정의
interface User {
  id: string;
  username: string;
  name: string;
  joinDate: Date;
  isActive: boolean;
  role : string;
  birthDate?: Date;
}

const Users: React.FC = () => {
  const [users, setusers] = useState<User[]>([]);
  const [userId, setUserId] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed._id) {
          setUserId(parsed._id);
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
      }
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      console.log("Fetched users:", data);
  
      const users: User[] = data.map((u: UserResponse) => ({
        id: u.id,
        username: u.username,
        name: u.name,
        joinDate: new Date(u.joinDate),
        isActive:u.isActive,
        role: u.role,        
        birthDate: u.birthDate ? new Date(u.birthDate) : undefined,
      }));
      console.log("Parsed users:", users);
      setusers(users);
    } catch (error) {
      console.error("Failed to load users", error);
    }
  };


  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Users</h2>


      {/* User List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white shadow rounded p-4 cursor-pointer hover:shadow-md transition"
            onClick={() => navigate(`/user/${user.id}`)}
          >
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-600">아이디 : {user.username}</p>
            {user.birthDate ? (
              <p className="text-sm text-gray-600">생일일 : {user.birthDate.toLocaleDateString('ko-KR')}</p>
            ) : (
              <p className="text-sm text-gray-600">생일일 : 미입력</p>
            )}
            <p className="text-sm text-gray-600">가입일 : {user.joinDate.toLocaleDateString('ko-KR')}</p>
            {user.isActive ? (
              <p className="text-sm text-gray-600">상태 : 활동중</p>
            ) : (
              <p className="text-sm text-gray-600">상태 : 탈퇴회원</p>
            )}
            {user.role==="admin" ? (
              <p className="text-sm text-gray-600">유형 : 관리자</p>
            ) : (
              <p className="text-sm text-gray-600">유형 : 일반회원</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
