import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Task와 Comment 타입 정의 (API 스펙에 맞게 추가 필드 조정 가능)
interface Comment {
  id: number;
  text: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  comments: Comment[];
}

export default function TaskDetail() {
  // useParams 타입 지정
  const { id } = useParams<{ id: string }>();

  // 제네릭으로 타입 명시
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return; // id 없으면 fetch 안 함

    const fetchTask = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/tasks/${id}`);
        if (!res.ok) {
          throw new Error("Task not found");
        }
        const data: Task = await res.json();
        setTask(data);
      } catch (err) {
        setError("Failed to fetch task details");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error)   return <p className="text-red-500">{error}</p>;
  if (!task)  return <p className="text-red-500">Task not found.</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Task Detail</h1>

      <div className="bg-white p-6 rounded-2xl shadow mb-4">
        <h2 className="text-xl font-semibold">{task.title}</h2>
        <p className="text-gray-700 mt-2">{task.description}</p>
        <p className="mt-4">
          <span className="font-medium">Status:</span>{" "}
          <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
            {task.status}
          </span>
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-2">Comments</h3>
        {task.comments.length > 0 ? (
          task.comments.map((comment) => (
            <div key={comment.id} className="border-t pt-2 mt-2 text-gray-700">
              {comment.text}
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
}
