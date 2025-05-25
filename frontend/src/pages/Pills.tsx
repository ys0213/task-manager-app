import { useEffect, useState } from "react";
import { fetchPills, createPill, fetchPillsByUserID } from "../api/pillApi";
import { useNavigate } from "react-router-dom";

// Pill 타입 정의
interface Pill {
  _id: string;
  name: string;
  description?: string;
  intakeCycle: Array<"morning" | "lunch" | "evening">;
  isCurrentlyUsed: boolean;
  useAlarm: boolean;
  pillType: "pill" | "supplement"; // 약 / 영양보조제
  userId: string;
}

const Pills: React.FC = () => {
  const [pills, setPills] = useState<Pill[]>([]);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [intakeCycle, setIntakeCycle] = useState<Array<"morning" | "lunch" | "evening">>([]);
  const [isCurrentlyUsed, setIsCurrentlyUsed] = useState<boolean>(true);
  const [useAlarm, setUseAlarm] = useState<boolean>(true);
  const [pillType, setPillType] = useState<"pill" | "supplement">("pill");
  const [userId, setUserId] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.id) {
          setUserId(parsed.id);
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
      }
    }
  }, []);

  useEffect(() => {
    if (userId) {
      loadPills(userId);
    }    
  }, [userId]);

  const loadPills = async ( userId:string) => {
    try {
      const data = await fetchPillsByUserID(userId);
      // undefined인 description을 빈 문자열로 처리
      const normalized: Pill[] = data.map((p) => ({
        _id: p._id,
        name: p.name,
        description: p.description ?? "",  // description이 undefined인 경우 빈 문자열로 처리
        intakeCycle: p.intakeCycle,
        isCurrentlyUsed: p.isCurrentlyUsed,
        useAlarm: p.useAlarm,
        pillType: p.pillType, // 약 / 영양보조제
        userId: p.userId,
      }));
      
      setPills(normalized);
    } catch (error) {
      console.error("Failed to load pills", error);
    }
  };

  const handleCreatePill = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      console.error("User ID is missing");
      return;
    }

    const newPill = {
      name,
      description,
      intakeCycle,
      isCurrentlyUsed,
      useAlarm,
      pillType,
      userId
    };

    try {
      const result = await createPill(newPill);
      if (result) {
        setName("");
        setDescription("");
        loadPills(userId);
      }
    } catch (error) {
      console.error("Failed to create pill", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Pills</h2>

      {/* Create Pill Form */}
      <form
        onSubmit={handleCreatePill}
        className="mb-6 bg-white shadow p-4 rounded space-y-2"
      >
        <input
          type="text"
          placeholder="Pill name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Pill
        </button>
      </form>

      {/* Pill List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pills.map((pill) => (
          <div
            key={pill._id}
            className="bg-white shadow rounded p-4 cursor-pointer hover:shadow-md transition"
            onClick={() => navigate(`/pills/${pill._id}`)}
          >
            <h3 className="text-lg font-semibold">{pill.name}</h3>
            <p className="text-sm text-gray-600">{pill.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pills;
