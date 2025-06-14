import { useState } from "react";
import { Star } from "lucide-react";

interface ModalRatingFormProps {
  onSubmit: (rating: number) => void;
}

const ModalRatingForm = ({ onSubmit }: ModalRatingFormProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hovered, setHovered] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      alert("1~5점 사이의 평점을 선택해주세요.");
      return;
    }
    onSubmit(rating);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-center">
      <h3 className="text-lg font-semibold">앱 평점을 선택해주세요</h3>

      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            type="button"
            key={value}
            onClick={() => setRating(value)}
            onMouseEnter={() => setHovered(value)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              size={32}
              strokeWidth={1.5}
              className={
                (hovered || rating) >= value
                  ? "fill-yellow-400 stroke-yellow-500"
                  : "stroke-gray-400"
              }
            />
          </button>
        ))}
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        제출하기
      </button>
    </form>
  );
};

export default ModalRatingForm;
