'use client';
import { useCallback, useEffect, useState } from 'react';
import { Cell, levels } from './levels';

export default function SokobanGame() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [level, setLevel] = useState<Cell[][]>(levels[0].map);
  const [playerPos, setPlayerPos] = useState(levels[0].playerPos);
  const [moves, setMoves] = useState(0);
  const [isWin, setIsWin] = useState(false);

  // 在状态声明部分添加历史记录
  const [history, setHistory] = useState<{
    level: Cell[][];
    playerPos: { x: number; y: number };
    moves: number;
  }[]>([]);

  // 在 move 函数中，成功移动后添加历史记录
  const nextLevel = useCallback(() => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(prev => prev + 1);
      setLevel(levels[currentLevel + 1].map);
      setPlayerPos(levels[currentLevel + 1].playerPos);
      setMoves(0);
      setIsWin(false);
      setHistory([]);
    }
  }, [currentLevel]);

  const checkWin = useCallback((newLevel: Cell[][]) => {
    let targetCount = 0;
    let boxOnTargetCount = 0;
    let totalTargets = 0;
  
    for (let y = 0; y < newLevel.length; y++) {
      for (let x = 0; x < newLevel[y].length; x++) {
        const cell = newLevel[y][x];
        if (cell === 'target' || cell === 'playerOnTarget') {
          targetCount++;
          totalTargets++;
        } else if (cell === 'boxOnTarget') {
          boxOnTargetCount++;
          totalTargets++;
        }
      }
    }
  
    // 所有目标点都被箱子覆盖（不包括玩家）
    return targetCount === 0 && boxOnTargetCount === totalTargets && totalTargets > 0;
  }, []);

  const move = useCallback((dx: number, dy: number) => {
    if (isWin) return;

    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;
    const newLevel = [...level.map(row => [...row])];
    
    if (newLevel[newY][newX] === 'wall') return;

    // 保存当前状态到历史记录（在任何改变之前）
    setHistory(prev => [...prev, {
      level: level,
      playerPos: playerPos,
      moves: moves
    }]);

    const currentCell = level[playerPos.y][playerPos.x];
    const targetCell = level[newY][newX];
    
    if (targetCell === 'box' || targetCell === 'boxOnTarget') {
      const boxNewX = newX + dx;
      const boxNewY = newY + dy;
      
      if (level[boxNewY][boxNewX] === 'wall' || 
          level[boxNewY][boxNewX] === 'box' || 
          level[boxNewY][boxNewX] === 'boxOnTarget') {
        setHistory(prev => prev.slice(0, -1));
        return;
      }

      // 移动箱子，保持目标点状态
      if (level[boxNewY][boxNewX] === 'target') {
        newLevel[boxNewY][boxNewX] = 'boxOnTarget';
      } else {
        newLevel[boxNewY][boxNewX] = 'box';
      }

      // 移动玩家到箱子原位置，保持目标点状态
      if (targetCell === 'boxOnTarget') {
        newLevel[newY][newX] = 'playerOnTarget';
      } else {
        newLevel[newY][newX] = 'player';
      }

      // 处理玩家原位置，保持目标点状态
      if (currentCell === 'playerOnTarget') {
        newLevel[playerPos.y][playerPos.x] = 'target';
      } else {
        newLevel[playerPos.y][playerPos.x] = 'floor';
      }
    } else {
      // 普通移动，保持目标点状态
      if (targetCell === 'target') {
        newLevel[newY][newX] = 'playerOnTarget';
      } else {
        newLevel[newY][newX] = 'player';
      }

      if (currentCell === 'playerOnTarget') {
        newLevel[playerPos.y][playerPos.x] = 'target';
      } else {
        newLevel[playerPos.y][playerPos.x] = 'floor';
      }
    }

    setLevel(newLevel);
    setPlayerPos({ x: newX, y: newY });
    setMoves(prev => prev + 1);

    if (checkWin(newLevel)) {
      setIsWin(true);
    }
  }, [isWin, level, playerPos, moves, checkWin]);

  // 修改 useEffect 的依赖数组
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          move(0, -1);
          break;
        case 'ArrowDown':
          move(0, 1);
          break;
        case 'ArrowLeft':
          move(-1, 0);
          break;
        case 'ArrowRight':
          move(1, 0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]); // 只依赖 move 函数

  // 添加撤销功能
  const undo = () => {
    if (history.length === 0) return;
    
    const previousState = history[history.length - 1];
    setLevel(previousState.level);
    setPlayerPos(previousState.playerPos);
    setMoves(previousState.moves);
    setHistory(prev => prev.slice(0, -1));
  };

  // 在重置游戏时清空历史记录
  const resetGame = () => {
    setLevel(levels[currentLevel].map);
    setPlayerPos(levels[currentLevel].playerPos);
    setMoves(0);
    setIsWin(false);
    setHistory([]); // 清空历史记录
  };

  // 在 JSX 中添加撤销按钮
  return (
    <div className="min-h-[100dvh] p-2 flex flex-col">
      <div className="w-full max-w-lg mx-auto flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-2 text-sm">
          <p className="text-muted-foreground">
            第 {currentLevel + 1} 关 - 移动步数: {moves}
          </p>
          {isWin && (
            <div className="flex gap-2">
              {currentLevel < levels.length - 1 ? (
                <button
                  onClick={nextLevel}
                  className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90"
                >
                  下一关
                </button>
              ) : (
                <p className="text-green-500 text-sm">已完成所有关卡！</p>
              )}
              <button
                onClick={resetGame}
                className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/90"
              >
                重新开始
              </button>
            </div>
          )}
        </div>

        <div className="aspect-square max-w-md mx-auto border rounded-lg overflow-hidden bg-background p-2">
          <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${level[0].length}, 1fr)` }}>
            {level.map((row, y) => (
              row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`aspect-square rounded flex items-center justify-center ${
                    cell === 'wall' ? 'bg-gray-800' :
                    cell === 'target' ? 'bg-green-200' :
                    'bg-gray-100'
                  }`}
                >
                  {(cell === 'player' || cell === 'playerOnTarget') && (
                    <svg className="w-4/5 h-4/5 text-blue-500" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <path d="M12 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM8 14a4 4 0 0 0-4 4v4h16v-4a4 4 0 0 0-4-4H8z"/>
                    </svg>
                  )}
                  {(cell === 'box' || cell === 'boxOnTarget') && (
                    <svg 
                      className={`w-4/5 h-4/5 ${cell === 'boxOnTarget' ? 'text-yellow-400' : 'text-yellow-600'}`} 
                      viewBox="0 0 24 24" 
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="1"
                    >
                      <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v10H7V7zm2 2v6h6V9H9z" />
                    </svg>
                  )}
                </div>
              ))
            ))}
          </div>
        </div>

        <div className="mt-4 mx-auto md:hidden">
          <div className="relative bg-black/5 backdrop-blur-lg rounded-2xl p-4 shadow-xl">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-start-2">
                <button
                  onClick={() => move(0, -1)}
                  className="w-full aspect-square rounded-2xl bg-white/80 hover:bg-white flex items-center justify-center shadow-sm hover:shadow-md active:scale-95 transition-all"
                  aria-label="向上移动"
                >
                  <svg className="w-10 h-10 text-primary/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 19V5M5 12l7-7 7 7"/>
                  </svg>
                </button>
              </div>
              <div className="col-start-1 col-span-3 grid grid-cols-3 gap-4">
                <button
                  onClick={() => move(-1, 0)}
                  className="w-full aspect-square rounded-2xl bg-white/80 hover:bg-white flex items-center justify-center shadow-sm hover:shadow-md active:scale-95 transition-all"
                  aria-label="向左移动"
                >
                  <svg className="w-10 h-10 text-primary/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                </button>
                <button
                  onClick={() => move(0, 1)}
                  className="w-full aspect-square rounded-2xl bg-white/80 hover:bg-white flex items-center justify-center shadow-sm hover:shadow-md active:scale-95 transition-all"
                  aria-label="向下移动"
                >
                  <svg className="w-10 h-10 text-primary/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14m-7-7l7 7 7-7"/>
                  </svg>
                </button>
                <button
                  onClick={() => move(1, 0)}
                  className="w-full aspect-square rounded-2xl bg-white/80 hover:bg-white flex items-center justify-center shadow-sm hover:shadow-md active:scale-95 transition-all"
                  aria-label="向右移动"
                >
                  <svg className="w-10 h-10 text-primary/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="mt-3 text-center">
              <button
                onClick={undo}
                disabled={history.length === 0}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-xl text-sm hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                撤销
              </button>
            </div>
          </div>
        </div>

        <div className="mt-2 text-center text-xs text-muted-foreground pb-safe">
          使用键盘方向键或点击按钮控制角色移动
        </div>
      </div>
    </div>
  );
}