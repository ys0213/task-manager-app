import React, { useState, useEffect, useRef } from "react";
import { Pill as PillIcon } from "lucide-react";

const CELL_SIZE = 30;
const BOARD_WIDTH = 20; // 가로 폭 2배로
const BOARD_HEIGHT = 16;
const INITIAL_SNAKE = [{ x: 10, y: 8 }];

type Position = { x: number; y: number };

export default function SnakePillGame() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<"up" | "down" | "left" | "right">("right");
  const [pill, setPill] = useState<Position>({ x: 3, y: 3 });
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const gameInterval = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    if (gameInterval.current) clearInterval(gameInterval.current);
    setSnake(INITIAL_SNAKE);
    setDirection("right");
    setScore(0);
    setPill(randomPill());
    setGameStarted(true);
  };

  const randomPill = () => {
    let pos: Position;
    do {
      pos = {
        x: Math.floor(Math.random() * BOARD_WIDTH),
        y: Math.floor(Math.random() * BOARD_HEIGHT),
      };
    } while (snake.some(s => s.x === pos.x && s.y === pos.y));
    return pos;
  };

  const moveSnake = () => {
    setSnake(prev => {
      const head = prev[0];
      const next = {
        x: head.x + (direction === "right" ? 1 : direction === "left" ? -1 : 0),
        y: head.y + (direction === "down" ? 1 : direction === "up" ? -1 : 0),
      };

      // 충돌 처리
      if (
        next.x < 0 || next.x >= BOARD_WIDTH ||
        next.y < 0 || next.y >= BOARD_HEIGHT ||
        prev.some(seg => seg.x === next.x && seg.y === next.y)
      ) {
        setGameStarted(false);
        if (gameInterval.current) clearInterval(gameInterval.current);
        return prev;
      }

      const newSnake = [next, ...prev];

      if (next.x === pill.x && next.y === pill.y) {
        setScore(score => score + 10);
        setPill(randomPill());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  };

  useEffect(() => {
    if (gameStarted) {
      gameInterval.current = setInterval(moveSnake, 200);
    }

    return () => {
      if (gameInterval.current) clearInterval(gameInterval.current);
    };
  }, [gameStarted, direction]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted) return;

      switch (e.key) {
        case "ArrowUp":
          if (direction !== "down") setDirection("up");
          break;
        case "ArrowDown":
          if (direction !== "up") setDirection("down");
          break;
        case "ArrowLeft":
          if (direction !== "right") setDirection("left");
          break;
        case "ArrowRight":
          if (direction !== "left") setDirection("right");
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, gameStarted]);

  return (
    <div style={{ maxWidth: BOARD_WIDTH * CELL_SIZE + 40, margin: "auto" }}>
      <h2 style={{ textAlign: "left" }}>약 먹기 게임</h2>
      <div style={{ textAlign: "left", marginBottom: 12 }}>
        <button
          onClick={startGame}
          style={{
            padding: "8px 16px",
            fontSize: 16,
            cursor: "pointer",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: 4,
            marginRight: 8,
          }}
        >
          {gameStarted ? "재시작" : "게임 시작"}
        </button>
        <span style={{ fontWeight: "bold" }}>점수: {score}</span>
      </div>

      <div
        style={{
          position: "relative",
          width: BOARD_WIDTH * CELL_SIZE,
          height: BOARD_HEIGHT * CELL_SIZE,
          border: "2px solid #333",
          background: "#f4f4f4",
        }}
      >
        {/* Snake */}
        {snake.map((seg, idx) => (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: seg.x * CELL_SIZE,
              top: seg.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: idx === 0 ? "#007bff" : "#3399ff",
              border: "1px solid #fff",
            }}
          />
        ))}

        {/* Pill */}
        <div
          style={{
            position: "absolute",
            left: pill.x * CELL_SIZE,
            top: pill.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ff0000",
          }}
        >
          <PillIcon size={20} />
        </div>
      </div>

      {!gameStarted && score > 0 && (
        <p style={{ color: "#dc3545", marginTop: 8 }}>게임 종료! 최종 점수: {score}</p>
      )}

      <p style={{ marginTop: 12, fontSize: 12, color: "#666", textAlign: "left" }}>
        방향키 ↑ ↓ ← → 로 조작하세요.
      </p>
    </div>
  );
}
