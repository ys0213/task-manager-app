import React, { useEffect, useState } from "react";
import { fetchUsers, UserResponse, updateUser } from "../api/adminApi";
import { useNavigate } from "react-router-dom";
import UserDetailModal from './AdminUserModal';

// User 타입 정의
interface User {
  id: string;
  username: string;
  name: string;
  joinDate: Date;
  isActive: boolean;
  role: string;
  birthDate?: Date;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState<string>("");

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // 검색 및 필터 상태
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'admin'>('all');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');

  const navigate = useNavigate();

  // 현재 로그인한 관리자 ID 가져오기
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed._id) setUserId(parsed._id);
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
      }
    }
  }, []);

  // 사용자 목록 불러오기
  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      const parsed: User[] = data.map((u: UserResponse) => ({
        id: u.id,
        username: u.username,
        name: u.name,
        joinDate: new Date(u.joinDate),
        isActive: u.isActive,
        role: u.role,
        birthDate: u.birthDate ? new Date(u.birthDate) : undefined,
      }));
      setUsers(parsed);
    } catch (error) {
      console.error("Failed to load users", error);
    }
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  
  const handleSaveUser = async (updatedUser: User) => {
    try {
      const updated = await updateUser(updatedUser.id, {
        username: updatedUser.username,
        name: updatedUser.name,
        joinDate: updatedUser.joinDate.toISOString(),
        isActive: updatedUser.isActive,
        role: updatedUser.role,
        birthDate: updatedUser.birthDate ? updatedUser.birthDate.toISOString() : undefined,
      });
      if (updated) {
        await loadUsers();
        setIsModalOpen(false);
      } else {
        alert("업데이트 실패");
      }
    } catch (error) {
      console.error(error);
      alert("업데이트 중 오류가 발생했습니다.");
    }
  };
  

  // 검색 및 필터링 적용된 리스트
  const filteredUsers = users
    .filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(u => filterRole === 'all' || u.role === filterRole)
    .filter(u => {
      if (filterActive === 'active') return u.isActive;
      if (filterActive === 'inactive') return !u.isActive;
      return true;
    })
    .sort((a, b) =>
      sortOrder === 'asc'
        ? a.joinDate.getTime() - b.joinDate.getTime()
        : b.joinDate.getTime() - a.joinDate.getTime()
    );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Users</h2>

      {/* 검색 및 필터 컨트롤 */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="이름 또는 아이디 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded p-2 w-full max-w-xs bg-white text-black"
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          className="border rounded p-2 bg-white text-black"
        >
          <option value="asc" className="bg-white text-black">가입일 오름차순</option>
          <option value="desc" className="bg-white text-black">가입일 내림차순</option>
        </select>

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value as 'all' | 'user' | 'admin')}
          className="border rounded p-2 bg-white text-black"
        >
          <option value="all" className="bg-white text-black">전체유형</option>
          <option value="admin" className="bg-white text-black">관리자</option>
          <option value="user" className="bg-white text-black">일반회원</option>
        </select>

        <select
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value as 'all' | 'active' | 'inactive')}
          className="border rounded p-2 bg-white text-black"
        >
          <option value="all" className="bg-white text-black">전체상태</option>
          <option value="active" className="bg-white text-black">활성화</option>
          <option value="inactive" className="bg-white text-black">탈퇴회원</option>
        </select>
      </div>

      {/* User List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white shadow rounded p-4 cursor-pointer hover:shadow-md transition"
            onClick={() => handleUserClick(user)}
          >
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-600">아이디: {user.username}</p>
            {user.birthDate ? (
              <p className="text-sm text-gray-600">생일: {user.birthDate.toLocaleDateString('ko-KR')}</p>
            ) : (
              <p className="text-sm text-gray-600">생일: 미입력</p>
            )}
            <p className="text-sm text-gray-600">가입일: {user.joinDate.toLocaleDateString('ko-KR')}</p>
            <p className="text-sm text-gray-600">상태: {user.isActive ? '활동중' : '탈퇴회원'}</p>
            <p className="text-sm text-gray-600">유형: {user.role === 'admin' ? '관리자' : '일반회원'}</p>
          </div>
        ))}
      </div>

      {/* User Detail Modal */}
      <UserDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default AdminUsers;
