'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/useUserStore';

export default function NumberPuzzleGame() {
  const { user, updateUser } = useUserStore();
  const [grid, setGrid] = useState<number[][]>([]);
  const [emptyCell, setEmptyCell] = useState<{ row: number; col: number }>({ row: 3, col: 3 });
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);

  // 初始化游戏
  const initGame = () => {
    // 创建有序网格
    const orderedGrid = Array(4)
      .fill(null)
      .map((_, rowIndex) =>
        Array(4)
          .fill(null)
          .map((_, colIndex) => rowIndex * 4 + colIndex + 1)
      );
    
    // 将右下角设为0（空白格）
    orderedGrid[3][3] = 0;
    
    // 打乱网格
    const shuffledGrid = shuffleGrid([...orderedGrid]);
    
    setGrid(shuffledGrid);
    // 找到空白格的位置
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (shuffledGrid[row][col] === 0) {
          setEmptyCell({ row, col });
          break;
        }
      }
    }
    setMoves(0);
    setTimer(0);
    setIsPlaying(true);
    setIsSolved(false);
  };

  // 打乱网格（确保可解）
  const shuffleGrid = (grid: number[][]) => {
    const newGrid = JSON.parse(JSON.stringify(grid)); // 深拷贝
    let empty = { row: 3, col: 3 };
    
    // 执行随机移动来打乱网格
    for (let i = 0; i < 100; i++) {
      const possibleMoves = [];
      
      if (empty.row > 0) possibleMoves.push({ row: empty.row - 1, col: empty.col });
      if (empty.row < 3) possibleMoves.push({ row: empty.row + 1, col: empty.col });
      if (empty.col > 0) possibleMoves.push({ row: empty.row, col: empty.col - 1 });
      if (empty.col < 3) possibleMoves.push({ row: empty.row, col: empty.col + 1 });
      
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      
      // 交换空白格和随机相邻格
      newGrid[empty.row][empty.col] = newGrid[randomMove.row][randomMove.col];
      newGrid[randomMove.row][randomMove.col] = 0;
      
      empty = randomMove;
    }
    
    return newGrid;
  };

  // 移动方块
  const moveCell = (row: number, col: number) => {
    if (!isPlaying || isSolved) return;
    
    // 检查是否可以移动（与空白格相邻）
    const isAdjacent =
      (Math.abs(row - emptyCell.row) === 1 && col === emptyCell.col) ||
      (Math.abs(col - emptyCell.col) === 1 && row === emptyCell.row);
    
    if (!isAdjacent) return;
    
    // 移动方块
    const newGrid = JSON.parse(JSON.stringify(grid)); // 深拷贝
    newGrid[emptyCell.row][emptyCell.col] = newGrid[row][col];
    newGrid[row][col] = 0;
    
    setGrid(newGrid);
    setEmptyCell({ row, col });
    setMoves(moves + 1);
    
    // 检查是否完成
    checkIfSolved(newGrid);
  };

  // 检查是否完成
  const checkIfSolved = (currentGrid: number[][]) => {
    // 检查网格是否有序
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const expectedValue = row * 4 + col + 1;
        // 右下角应该是0
        if (row === 3 && col === 3) {
          if (currentGrid[row][col] !== 0) return;
        } else if (currentGrid[row][col] !== expectedValue) {
          return;
        }
      }
    }
    
    // 如果所有检查都通过，游戏完成
    setIsPlaying(false);
    setIsSolved(true);
    
    // 更新最佳分数
    if (bestScore === null || moves < bestScore) {
      setBestScore(moves);
      
      // 如果用户已登录，更新用户数据
      if (user) {
        updateUser({
          // 这里可以添加游戏分数到用户数据中
        });
      }
    }
  };

  // 计时器
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && !isSolved) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isSolved]);

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 组件挂载时初始化游戏
  useEffect(() => {
    initGame();
  }, []);

  return (
    <div className='p-6'>
      <div className='max-w-md mx-auto'>
        <Link
          href='/subpackages/games'
          className='inline-flex items-center text-muted-foreground hover:text-foreground mb-6'
        >
          <ArrowLeft className='w-4 h-4 mr-2' />
          返回游戏列表
        </Link>

        <h1 className='text-2xl font-bold mb-4'>数字华容道</h1>

        <div className='mb-4 flex justify-between items-center'>
          <div>
            <p className='text-sm text-muted-foreground'>步数: {moves}</p>
            <p className='text-sm text-muted-foreground'>
              时间: {formatTime(timer)}
            </p>
          </div>
          <Button
            onClick={initGame}
            size='sm'
            variant='outline'
            className='flex items-center gap-1'
          >
            <RotateCcw className='w-4 h-4' />
            重新开始
          </Button>
        </div>

        {isSolved && (
          <div className='mb-4 p-3 bg-green-100 dark:bg-green-900 rounded-lg text-center'>
            <p className='font-bold'>恭喜！你完成了拼图</p>
            <p className='text-sm'>
              步数: {moves} | 时间: {formatTime(timer)}
            </p>
            {bestScore !== null && (
              <p className='text-sm mt-1'>
                最佳步数: {bestScore}
                {bestScore === moves && ' (新纪录!)'}
              </p>
            )}
          </div>
        )}

        <div className='grid grid-cols-4 gap-2 mb-6'>
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={`aspect-square flex items-center justify-center text-xl font-bold rounded-lg transition-all ${
                  cell === 0
                    ? 'bg-gray-100 dark:bg-gray-800 cursor-default'
                    : 'bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 cursor-pointer'
                }`}
                onClick={() => cell !== 0 && moveCell(rowIndex, colIndex)}
                disabled={cell === 0}
              >
                {cell !== 0 && cell}
              </button>
            ))
          )}
        </div>

        <div className='mt-6'>
          <h2 className='text-lg font-semibold mb-2'>游戏规则</h2>
          <ul className='list-disc pl-5 space-y-1 text-sm text-muted-foreground'>
            <li>点击数字方块将其移动到相邻的空白格</li>
            <li>按照顺序排列所有数字，从1到15</li>
            <li>右下角应为空白格</li>
            <li>尽可能用最少的步数完成拼图</li>
          </ul>
        </div>
      </div>
    </div>
  );
}