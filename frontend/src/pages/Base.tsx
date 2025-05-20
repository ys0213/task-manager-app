import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

const Base = () => {
  // const [user, setUser] = useState<string | null>(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const stored = localStorage.getItem("user");
  //   if (stored) {
  //     try {
  //       const parsed = JSON.parse(stored);
  //       if (parsed.name) {
  //         setUser(parsed.name);
  //         // 로그인된 사용자는 대시보드나 메인으로 리디렉션
  //         navigate("/home");
  //       }
  //     } catch (e) {
  //       console.error("Failed to parse user from localStorage", e);
  //     }
  //   }
  // }, [navigate]);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">환영합니다!</h2>
      <p className="text-lg">처음 오셨습니까?</p>
      <Button
        onClick={() => navigate("/login")}
        className="mt-4 px-4 py-2 text-sm"
      >
        로그인하러 가기
      </Button>
    </div>
  );
};

export default Base;