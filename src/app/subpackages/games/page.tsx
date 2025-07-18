"use client";

import { Gamepad2, Puzzle, Calculator, Zap, Sparkles, Bird, Trophy } from 'lucide-react';
import PageContainer from '@/components/ui/page-container';

export default function GamesPage() {
  const features = [
    {
      id: 'snake',
      title: '贪吃蛇',
      icon: <Gamepad2 className='h-6 w-6' />,
      description: '经典的贪吃蛇游戏，通过方向键控制蛇移动收集食物',
      path: '/subpackages/games/snake',
    },
    {
      id: 'sokoban',
      title: '推箱子',
      icon: <Puzzle className='h-6 w-6' />,
      description: '考验智力的经典推箱子游戏，将箱子推到指定位置',
      path: '/subpackages/games/sokoban',
    },
    {
      id: 'number-puzzle',
      title: '数字华容道',
      icon: <Calculator className='h-6 w-6' />,
      description: '数字华容道游戏，通过数字移动来完成拼图',
      path: '/subpackages/games/number-puzzle',
    },
    {
      id: 'coupahoo',
      title: 'CoupAhoo',
      icon: <Zap className='h-6 w-6' />,
      description: '你终于厌倦了你的舰队和他们的无能。一一击败他们所有 13 人，并在顶部占据一席之地。',
      path: '/subpackages/games/coupahoo',
    },
    {
      id: 'bubble-burst',
      title: 'Bubble Burst',
      icon: <Sparkles className='h-6 w-6' />,
      description: '在这个闪闪发光的冒险中，通过克服障碍和避开敌人 （XIII） 泡泡来达到目标',
      path: '/subpackages/games/bubble-burst',
    },
    {
      id: 'the-way-of-the-dodo',
      title: 'The Way of the Dodo',
      icon: <Bird className='h-6 w-6' />,
      description: '体验渡渡鸟的冒险之旅，在这个充满挑战的游戏中探索未知世界',
      path: '/subpackages/games/the-way-of-the-dodo',
    },
    {
      id: 'path-to-glory',
      title: 'Path to Glory',
      icon: <Trophy className='h-6 w-6' />,
      description: '踏上荣耀之路，在这个精彩的冒险游戏中战胜挑战，赢得最终的胜利',
      path: '/subpackages/games/path-to-glory',
    },
  ];

  return (
    <PageContainer
      title="趣味游戏"
      description="体验各种经典和创新的游戏，从传统的贪吃蛇到精彩的冒险游戏"
      features={features}
      gridCols={{
        sm: 1,
        lg: 2,
        xl: 3,
        "2xl": 3,
      }}
      developmentTipText="更多精彩游戏正在开发中，敬请期待"
    />
  );
}
