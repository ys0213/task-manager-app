import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Pill 타입 정의 (받을 데이터의 형태에 맞게 수정)
interface Pill {
  name: string;
  description: string;
  // 필요에 따라 추가 필드 작성
}

const PillDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();  // useParams에서 id를 string으로 추출
  const [pill, setPill] = useState<Pill | null>(null);  // Pill 타입 혹은 null

  useEffect(() => {
    const fetchPill = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/pills/${id}`);
        const data = await res.json();
        setPill(data);
      } catch (err) {
        console.error("Failed to fetch pill", err);
      }
    };

    if (id) fetchPill();  // id가 있을 때만 fetch 실행
  }, [id]);

  if (!pill) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold">{pill.name}</h2>
      <p className="mt-2 text-gray-600">{pill.description}</p>
      {/* 여기에 프로젝트 관련 작업(Task) 리스트 등도 나중에 추가 가능 */}
    </div>
  );
};

export default PillDetail;
