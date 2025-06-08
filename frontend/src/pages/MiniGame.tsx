import React, { useState, useEffect, useRef } from "react";

type Pill = {
  id: number;
  type: number; // 약 단계 (0부터 시작)
  x: number;    // 위치 X (칸 단위)
  y: number;    // 위치 Y (칸 단위)
};

const PILL_NAMES = [
  "비타민", "유산균", "진통제", "항생제", "염증제",
  "혈압약", "당뇨약", "면역강화제", "백신", "만능치료제"
];

// 단계별 색깔: 하양, 핑크, 빨강, 주황, 노랑, 초록, 하늘, 남색, 보라, 검정
const PILL_COLORS = [
  "#ffffff", "#ffc0cb", "#ff0000", "#ff7f00", "#ffff00",
  "#00ff00", "#00ffff", "#000080", "#800080", "#000000"
];

const BOARD_WIDTH = 6;
const BOARD_HEIGHT = 12;

const BASE_CELL_SIZE = 40; // 기본 셀 크기 (최소 크기)

export default function PillMergeGame() {
  const [pills, setPills] = useState<Pill[]>([]);
  const [nextId, setNextId] = useState(1);
  const [fallingPill, setFallingPill] = useState<Pill | null>(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // 새 알약 떨어뜨림 (랜덤 타입)
  const dropNewPill = () => {
    const type = Math.floor(Math.random() * 3);
    const newPill: Pill = { id: nextId, type, x: Math.floor(BOARD_WIDTH / 2), y: 0 };
    setNextId(id => id + 1);
    setFallingPill(newPill);
  };

  // 게임 시작 및 재시작
  const startGame = () => {
    setPills([]);
    setNextId(1);
    setScore(0);
    setGameStarted(true);
    dropNewPill();
  };

  // 충돌 검사 (특정 좌표에 알약이 있으면 true)
  const isBlocked = (x: number, y: number) => {
    if (x < 0 || x >= BOARD_WIDTH || y >= BOARD_HEIGHT) return true;
    return pills.some(p => p.x === x && p.y === y);
  };

  // 굴러가기 함수 - 바닥이나 알약에 막히면 좌우로 굴러가보기
  const trySlide = (pill: Pill): Pill => {
    // 아래 좌우가 빈 곳인지 확인
    const belowX = pill.x;
    const belowY = pill.y + 1;

    if (!isBlocked(belowX, belowY)) {
      // 아래가 빈 칸이면 굳이 굴러갈 필요 없음
      return pill;
    }

    // 좌우 한 칸씩 확인 (왼쪽 우선)
    const leftX = pill.x - 1;
    const rightX = pill.x + 1;

    const canSlideLeft = !isBlocked(leftX, pill.y) && !isBlocked(leftX, pill.y + 1);
    const canSlideRight = !isBlocked(rightX, pill.y) && !isBlocked(rightX, pill.y + 1);

    if (canSlideLeft) {
      return { ...pill, x: leftX, y: pill.y + 1 };
    }
    if (canSlideRight) {
      return { ...pill, x: rightX, y: pill.y + 1 };
    }
    return pill; // 굴러갈 곳 없으면 제자리
  };

  // 알약이 0.5초마다 떨어짐
  useEffect(() => {
    if (!gameStarted || !fallingPill) return;

    const interval = setInterval(() => {
      setFallingPill(p => {
        if (!p) return null;

        // 아래 위치
        let nextY = p.y + 1;
        let nextX = p.x;

        // 아래가 막혀있으면 굴러가기 시도
        if (isBlocked(nextX, nextY)) {
          const slidPill = trySlide(p);
          if (slidPill.x === p.x && slidPill.y === p.y) {
            // 굴러갈 곳도 없으면 고정
            setPills(prev => [...prev, p]);
            dropNewPill();
            return null;
          } else {
            return slidPill;
          }
        } else {
          // 그냥 아래로 떨어짐
          return { ...p, y: nextY };
        }
      });
    }, 500);

    return () => clearInterval(interval);
  }, [fallingPill, pills, gameStarted]);

  // 인접 체크 함수 (상하좌우)
  const areAdjacent = (a: Pill, b: Pill) => {
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
  };

  // 알약 합치기 로직
  useEffect(() => {
    if (!gameStarted) return;

    let merged = false;
    let newPills = [...pills];

    for (let i = 0; i < newPills.length; i++) {
      for (let j = i + 1; j < newPills.length; j++) {
        if (
          newPills[i].type === newPills[j].type &&
          areAdjacent(newPills[i], newPills[j])
        ) {
          const higherType = Math.min(newPills[i].type + 1, PILL_NAMES.length - 1);
          newPills[i] = { ...newPills[i], type: higherType };
          newPills.splice(j, 1);
          merged = true;
          setScore(score => score + 10);
          break;
        }
      }
      if (merged) break;
    }

    if (merged) {
      setPills(newPills);
    }
  }, [pills, gameStarted]);

  // 게임 시작 초기화
  useEffect(() => {
    if (gameStarted && !fallingPill) {
      dropNewPill();
    }
  }, [fallingPill, gameStarted]);

  // 방향키 이벤트 처리
  useEffect(() => {
    if (!gameStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!fallingPill) return;

      if (e.key === "ArrowLeft") {
        // 왼쪽 이동
        const newX = fallingPill.x - 1;
        if (newX >= 0 && !isBlocked(newX, fallingPill.y)) {
          setFallingPill({ ...fallingPill, x: newX });
        }
      } else if (e.key === "ArrowRight") {
        // 오른쪽 이동
        const newX = fallingPill.x + 1;
        if (newX < BOARD_WIDTH && !isBlocked(newX, fallingPill.y)) {
          setFallingPill({ ...fallingPill, x: newX });
        }
      } else if (e.key === "ArrowDown") {
        // 아래로 빠르게 내리기 (한 칸만)
        const newY = fallingPill.y + 1;
        if (newY < BOARD_HEIGHT && !isBlocked(fallingPill.x, newY)) {
          setFallingPill({ ...fallingPill, y: newY });
        } else {
          // 막히면 고정시키고 새 알약
          setPills(prev => [...prev, fallingPill]);
          dropNewPill();
          setFallingPill(null);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fallingPill, pills, gameStarted]);

  return (
    <div style={{ maxWidth: 350, margin: "auto" }}>
      <h2>약 합치기 게임</h2>
      <button
        onClick={startGame}
        style={{
          padding: "8px 16px",
          fontSize: 16,
          cursor: "pointer",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: 4,
          marginBottom: 12,
        }}
      >
        {gameStarted ? "재시작" : "게임 시작"}
      </button>

      <div>점수: {score}</div>

      <div
        ref={gameAreaRef}
        style={{
          position: "relative",
          width: BOARD_WIDTH * BASE_CELL_SIZE,
          height: BOARD_HEIGHT * BASE_CELL_SIZE,
          border: "2px solid #333",
          marginTop: 16,
          background: "#fafafa",
        }}
      >
        {/* 고정된 알약들 */}
        {pills.map((pill) => {
          const size = BASE_CELL_SIZE + pill.type * 4;
          const offset = (BASE_CELL_SIZE - size) / 2;

          return (
            <div
              key={pill.id}
              style={{
                position: "absolute",
                left: pill.x * BASE_CELL_SIZE + offset,
                top: pill.y * BASE_CELL_SIZE + offset,
                width: size,
                height: size,
                borderRadius: "50%",
                backgroundColor: PILL_COLORS[pill.type],
                border: "1.5px solid #666",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: 12,
                color: "#222",
                userSelect: "none",
                transition: "left 0.2s, top 0.2s",
                boxShadow: "0 0 4px rgba(0,0,0,0.15)",
              }}
              title={PILL_NAMES[pill.type]}
            >
              {PILL_NAMES[pill.type]}
            </div>
          );
        })}

        {/* 떨어지는 알약 */}
        {fallingPill && (
          <div
            style={{
              position: "absolute",
              left: fallingPill.x * BASE_CELL_SIZE + (BASE_CELL_SIZE - (BASE_CELL_SIZE + fallingPill.type * 4)) / 2,
              top: fallingPill.y * BASE_CELL_SIZE + (BASE_CELL_SIZE - (BASE_CELL_SIZE + fallingPill.type * 4)) / 2,
              width: BASE_CELL_SIZE + fallingPill.type * 4,
              height: BASE_CELL_SIZE + fallingPill.type * 4,
              borderRadius: "50%",
              backgroundColor: PILL_COLORS[fallingPill.type],
              border: "1.5px solid #666",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: 12,
              color: "#222",
              userSelect: "none",
              boxShadow: "0 0 6px 2px rgba(0,123,255,0.6)",
              transition: "left 0.1s, top 0.1s",
              zIndex: 10,
            }}
            title={PILL_NAMES[fallingPill.type]}
          >
            {PILL_NAMES[fallingPill.type]}
          </div>
        )}
      </div>
      <p style={{ marginTop: 12, fontSize: 12, color: "#666" }}>
        방향키 ←, →, ↓ 로 조작하세요.
      </p>
    </div>
  );
}
