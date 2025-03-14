'use client';
import { useEffect, useState, useCallback } from 'react';

type Position = {
  x: number;
  y: number;
};

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export default function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [touchStart, setTouchStart] = useState<Position | null>(null);

  const generateFood = useCallback(() => {
    const x = Math.floor(Math.random() * 20);
    const y = Math.floor(Math.random() * 20);
    setFood({ x, y });
  }, []);

  const moveSnake = useCallback(() => {
    if (!isStarted || gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = { ...prevSnake[0] };

      switch (direction) {
        case 'UP':
          head.y = head.y <= 0 ? 19 : head.y - 1;
          break;
        case 'DOWN':
          head.y = head.y >= 19 ? 0 : head.y + 1;
          break;
        case 'LEFT':
          head.x = head.x <= 0 ? 19 : head.x - 1;
          break;
        case 'RIGHT':
          head.x = head.x >= 19 ? 0 : head.x + 1;
          break;
      }

      if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [head];

      if (head.x === food.x && head.y === food.y) {
        generateFood();
        setScore(prev => prev + 1);
        newSnake.push(...prevSnake);
      } else {
        newSnake.push(...prevSnake.slice(0, -1));
      }

      return newSnake;
    });
  }, [direction, food, gameOver, generateFood, isPaused, isStarted]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    setTimeLeft(60);
    generateFood();
  };

  const startGame = () => {
    setIsStarted(true);
    resetGame();
  };

  // 添加倒计时效果
  useEffect(() => {
    if (!isStarted || gameOver || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, gameOver, isPaused]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          setDirection(prev => prev !== 'DOWN' ? 'UP' : prev);
          break;
        case 'ArrowDown':
          setDirection(prev => prev !== 'UP' ? 'DOWN' : prev);
          break;
        case 'ArrowLeft':
          setDirection(prev => prev !== 'RIGHT' ? 'LEFT' : prev);
          break;
        case 'ArrowRight':
          setDirection(prev => prev !== 'LEFT' ? 'RIGHT' : prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // 添加触摸事件处理
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;

    // 判断滑动方向
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 水平滑动
      if (deltaX > 0) {
        setDirection(prev => prev !== 'LEFT' ? 'RIGHT' : prev);
      } else {
        setDirection(prev => prev !== 'RIGHT' ? 'LEFT' : prev);
      }
    } else {
      // 垂直滑动
      if (deltaY > 0) {
        setDirection(prev => prev !== 'UP' ? 'DOWN' : prev);
      } else {
        setDirection(prev => prev !== 'DOWN' ? 'UP' : prev);
      }
    }

    setTouchStart(null);
  };

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, 150);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  return (
    <div className="p-4">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-4">
            <p className="text-muted-foreground">得分: {score}</p>
            {isStarted && <p className="text-muted-foreground">剩余时间: {timeLeft}秒</p>}
          </div>
          <div>
            {!isStarted ? (
              <button
                onClick={startGame}
                className="px-3 py-1.5 bg-primary text-primary-foreground rounded hover:bg-primary/90 text-sm"
              >
                开始游戏
              </button>
            ) : !gameOver ? (
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90 text-sm"
              >
                {isPaused ? '继续' : '暂停'}
              </button>
            ) : (
              <button
                onClick={startGame}
                className="px-3 py-1.5 bg-primary text-primary-foreground rounded hover:bg-primary/90 text-sm"
              >
                重新开始
              </button>
            )}
          </div>
        </div>

        <div className="relative aspect-square border rounded-lg overflow-hidden bg-background mb-4"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="absolute inset-0 grid"
            style={{
              gridTemplateColumns: 'repeat(20, 1fr)',
              gridTemplateRows: 'repeat(20, 1fr)',
            }}
          >
            {snake.map((segment, index) => (
              <div
                key={index}
                className="bg-primary"
                style={{
                  gridColumn: segment.x + 1,
                  gridRow: segment.y + 1,
                }}
              />
            ))}
            <div
              className="bg-destructive"
              style={{
                gridColumn: food.x + 1,
                gridRow: food.y + 1,
              }}
            />
          </div>
        </div>

        <div className="mx-auto md:hidden">
          <div className="relative bg-black/5 backdrop-blur-lg rounded-2xl p-4 shadow-xl">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-start-2">
                <button
                  onClick={() => setDirection(prev => prev !== 'DOWN' ? 'UP' : prev)}
                  className="w-full aspect-square rounded-2xl bg-white/80 hover:bg-white flex items-center justify-center shadow-sm hover:shadow-md active:scale-95 transition-all"
                  aria-label="向上移动"
                >
                  <svg className="w-12 h-12 text-primary/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                </button>
              </div>
              <div className="col-start-1 col-span-3 grid grid-cols-3 gap-6">
                <button
                  onClick={() => setDirection(prev => prev !== 'RIGHT' ? 'LEFT' : prev)}
                  className="w-full aspect-square rounded-2xl bg-white/80 hover:bg-white flex items-center justify-center shadow-sm hover:shadow-md active:scale-95 transition-all"
                  aria-label="向左移动"
                >
                  <svg className="w-12 h-12 text-primary/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setDirection(prev => prev !== 'UP' ? 'DOWN' : prev)}
                  className="w-full aspect-square rounded-2xl bg-white/80 hover:bg-white flex items-center justify-center shadow-sm hover:shadow-md active:scale-95 transition-all"
                  aria-label="向下移动"
                >
                  <svg className="w-12 h-12 text-primary/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setDirection(prev => prev !== 'LEFT' ? 'RIGHT' : prev)}
                  className="w-full aspect-square rounded-2xl bg-white/80 hover:bg-white flex items-center justify-center shadow-sm hover:shadow-md active:scale-95 transition-all"
                  aria-label="向右移动"
                >
                  <svg className="w-12 h-12 text-primary/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 text-center text-xs text-muted-foreground">
          使用键盘方向键或点击按钮控制蛇的移动
        </div>
      </div>
    </div>
  );
}