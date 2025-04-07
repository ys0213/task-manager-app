import { useParams } from "react-router-dom";

export default function TaskDetail() {
  const { id } = useParams();

  // Placeholder task data
  const task = {
    id,
    title: "Fix login bug",
    description: "Users cannot log in with valid credentials.",
    status: "In Progress",
    comments: [
      { id: 1, text: "This bug appears after recent update." },
      { id: 2, text: "Investigating the issue." },
    ],
  };

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
        {task.comments.map((comment) => (
          <div key={comment.id} className="border-t pt-2 mt-2 text-gray-700">
            {comment.text}
          </div>
        ))}
      </div>
    </div>
  );
}
