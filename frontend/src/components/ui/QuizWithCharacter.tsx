import { useEffect, useState } from "react";
import correctImg from "../../assets/YakTok_character_correctImg.svg";
import wrongImg from "../../assets/YakTok_character_wrongImg.svg";
import neutralImg from "../../assets/YakTok_character_base.svg";

interface Quiz {
    question: string;
    choices: string[];
    answer: string;
    }

const quizList: Quiz[] = [
    {
        question: "약을 먹을 때 가장 중요한 것은?",
        choices: ["정해진 시간 지키기", "먹고 싶은 시간에 먹기", "한꺼번에 많이 먹기"],
        answer: "정해진 시간 지키기",
    },
    {
        question: "공복에 먹으면 안 되는 약은?",
        choices: ["소화제", "항생제", "비타민"],
        answer: "항생제",
    },
    {
        question: "약은 어떤 음료와 함께 먹는 게 좋을까요?",
        choices: ["물", "커피", "탄산음료"],
        answer: "물",
    },
    {
        question: "약을 먹고 나서 술을 마셔도 될까요?",
        choices: ["안 된다", "괜찮다", "약에 따라 다르다"],
        answer: "안 된다",
    },
    ];

export default function QuizWithCharacter() {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [characterImg, setCharacterImg] = useState<string>(neutralImg);
    const [animationClass, setAnimationClass] = useState<string>("");
    const [answered, setAnswered] = useState<boolean>(false);
    const [isCorrect, setIsCorrect] = useState<boolean>(false);


    useEffect(() => {
        const randomQuiz = quizList[Math.floor(Math.random() * quizList.length)];
        setQuiz(randomQuiz);
    }, []);

    const handleAnswer = (choice: string) => {
        if (!quiz) return;

        const isCorrect = choice === quiz.answer;
        setCharacterImg(isCorrect ? correctImg : wrongImg);

        // 👉 애니메이션 강제 재실행을 위해 먼저 초기화
        setAnimationClass(""); // 클래스 제거

        // 👉 짧은 지연 후 다시 적용
        setTimeout(() => {
            setAnimationClass(isCorrect ? "animate-jump" : "animate-shake");
        }, 10); // 10ms 정도면 충분
    };

    if (!quiz) return null;

    return (
        <div className="bg-white p-6 rounded-xl max-w-3xl mx-auto">
        {/* 질문 상단 말풍선 스타일 */}
        <div className="bg-yellow-100 text-center text-lg font-semibold text-[#333] p-4 rounded-full mb-6">
            Q. “{quiz.question}”
        </div>

        {/* 캐릭터 + 선택지 영역 */}
        <div className="flex items-center justify-center gap-6">
            {/* 캐릭터 */}
            <div className="w-2/3 flex justify-center">
            <img src={characterImg} alt="캐릭터" className={`w-45 ${animationClass}`}/>
            </div>

            {/* 선택지 */}
            <div className="w-2/3 space-y-3">
            {quiz.choices.map((choice, idx) => (
                <button
                key={idx}
                onClick={() => handleAnswer(choice)}
                disabled={answered}
                className={`w-full text-left px-4 py-2 rounded-xl transition font-semibold
                    ${answered
                    ? choice === quiz.answer
                        ? "bg-green-200 border-green-400 text-green-800"
                        : "text-gray-400"
                    : "border-gray-300 text-gray-700 hover:font-semibold hover:text-[#58D68D]"
                    }`}
                >
                {idx + 1}. {choice}
                </button>
            ))}
            </div>
        </div>
        </div>
    );
}
