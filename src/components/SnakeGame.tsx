import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

type Point = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const requestRef = useRef<number>();
  const lastUpdateTimeRef = useRef<number>(0);
  
  const directionRef = useRef(INITIAL_DIRECTION);
  const speedRef = useRef(120);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(s => s.x === newFood.x && s.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    speedRef.current = 120;
    setIsGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'a', 's', 'd'].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === ' ' && !isGameOver) {
      setIsPaused(p => !p);
      return;
    }

    if (isPaused || isGameOver) return;

    let newDir = directionRef.current;
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        if (directionRef.current.y !== 1) newDir = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
      case 's':
        if (directionRef.current.y !== -1) newDir = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
      case 'a':
        if (directionRef.current.x !== 1) newDir = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
      case 'd':
        if (directionRef.current.x !== -1) newDir = { x: 1, y: 0 };
        break;
    }
    directionRef.current = newDir;
    setDirection(newDir);
  }, [isGameOver, isPaused]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const updateGame = useCallback((time: number) => {
    if (isGameOver || isPaused) {
      requestRef.current = requestAnimationFrame(updateGame);
      return;
    }

    if (time - lastUpdateTimeRef.current > speedRef.current) {
      setSnake((prev) => {
        const head = prev[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          return prev;
        }

        // Self collision
        if (prev.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];

        // Food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const nextScore = s + 1;
            if (nextScore > highScore) setHighScore(nextScore);
            return nextScore;
          });
          speedRef.current = Math.max(50, speedRef.current - 2);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });

      lastUpdateTimeRef.current = time;
    }
    requestRef.current = requestAnimationFrame(updateGame);
  }, [food, generateFood, highScore, isGameOver, isPaused]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateGame);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [updateGame]);

  useEffect(() => {
    setFood(generateFood(INITIAL_SNAKE));
  }, [generateFood]);

  return (
    <div className="flex flex-col items-center w-full max-w-full font-display">
      {/* Score Header */}
      <div className="flex gap-5 font-mono mb-8 self-end lg:self-center">
        <div className="bg-card-dark px-4 py-2 border border-neon-green shadow-[0_0_10px_rgba(57,255,20,0.2)] min-w-[120px]">
          <div className="text-[10px] text-neon-green uppercase mb-0.5 tracking-wider">High Score</div>
          <div className="text-[20px] font-bold text-white">{highScore.toString().padStart(6, '0')}</div>
        </div>
        <div className="bg-card-dark px-4 py-2 border border-neon-green shadow-[0_0_10px_rgba(57,255,20,0.2)] min-w-[120px]">
          <div className="text-[10px] text-neon-green uppercase mb-0.5 tracking-wider">Current</div>
          <div className="text-[20px] font-bold text-white">{score.toString().padStart(6, '0')}</div>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative bg-black border-[4px] border-[#222]">
        <div 
          className="grid bg-[#000] relative z-10"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(90vw, 480px)',
            height: 'min(90vw, 480px)'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some(s => s.x === x && s.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`
                  w-full h-full border border-[rgba(255,255,255,0.02)]
                  ${isHead ? 'bg-white shadow-[0_0_12px_#fff] z-20' : ''}
                  ${isSnake && !isHead ? 'bg-neon-green shadow-[0_0_8px_var(--color-neon-green)] border-black z-10' : ''}
                  ${isFood ? 'bg-neon-pink shadow-[0_0_10px_var(--color-neon-pink)] rounded-full z-15' : ''}
                `}
              />
            );
          })}
        </div>

        {/* Overlays */}
        {(isGameOver || isPaused) && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
              <div className="text-[14px] uppercase text-neon-blue border border-neon-blue px-4 py-2 font-display bg-black/80 font-bold tracking-widest text-center shadow-[0_0_10px_rgba(0,243,255,0.2)]">
                {isGameOver ? 'SYS FAILURE: PRESS RESTART' : 'SYS PAUSED: PRESS RESUME'}
              </div>
              <button 
                onClick={resetGame}
                className="mt-6 px-6 py-2 bg-[#1a1a1a] text-white border border-neon-pink hover:bg-neon-pink transition-colors uppercase text-sm font-bold tracking-wider shadow-[0_0_10px_rgba(255,0,255,0.2)]"
              >
                {isGameOver ? 'Override / Restart' : 'Override / Resume'}
              </button>
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-6 text-text-dim text-[10px] font-mono tracking-widest uppercase">
        <span>[WASD] : Move</span>
        <span>[SPACE] : Pause</span>
      </div>
    </div>
  );
}
