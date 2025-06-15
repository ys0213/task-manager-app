import { useEffect, useState } from "react";
import { createFeedback, deleteFeedback, updateFeedback, fetchFeedbackList } from "../api/userApi";

interface FeedbackItem {
  _id: string;
  feedback: string;
  feedbackDateTime: string;
  userId:string;
}

interface User {
  _id: string;
  username: string;
  role: string;
}

const FeedbackBoard = () => {
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [newFeedback, setNewFeedback] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch (err) {
        console.error("사용자 정보를 불러오는 중 오류 발생", err);
      }
    }
  }, []);

  const loadFeedback = async () => {
    const data = await fetchFeedbackList();
    setFeedbackList(data);
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const handleCreate = async () => {
    if (!newFeedback.trim()) return;
    await createFeedback(newFeedback, user ? user._id:"");
    setNewFeedback("");
    loadFeedback();
  };

  const handleDelete = async (id: string) => {
    await deleteFeedback(id);
    loadFeedback();
  };

    const handleEdit = (item: FeedbackItem) => {
    setEditingId(item._id);
    setEditingText(item.feedback);
  };

  const handleUpdate = async () => {
    if (!editingText.trim() || !editingId) return;
    await updateFeedback(editingId, editingText);
    setEditingId(null);
    setEditingText("");
    loadFeedback();
  };

  return (
 <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">개발자에게 바라는 점</h2>

      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 border rounded px-2"
          value={newFeedback}
          onChange={(e) => setNewFeedback(e.target.value)}
        />
        <button onClick={handleCreate} className="bg-green-500 text-white px-4 py-1 rounded">
          등록
        </button>
      </div>

      <ul className="space-y-2">
        {feedbackList.map((item) => (
          <li key={item._id} className="border p-2 rounded">
            {editingId === item._id ? (
              <>
                <input
                  className="w-full border rounded px-2 py-1"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <div className="flex gap-2 mt-1">
                  <button onClick={handleUpdate} className="text-blue-500 text-sm">
                    저장
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-gray-500 text-sm">
                    취소
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-sm text-gray-700">{item.feedback}</div>
                <div className="text-xs text-gray-500">{new Date(item.feedbackDateTime).toLocaleString()}</div>
                <div className="flex gap-2 mt-1">
                  {user && user._id==item.userId && (
                  <button onClick={() => handleEdit(item)} className="text-blue-500 text-sm">
                    수정
                  </button>
                  )}
                  {user?.role === "admin" && (
                    <button onClick={() => handleDelete(item._id)} className="text-red-500 text-sm">
                      삭제
                    </button>
                  )}
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeedbackBoard;
