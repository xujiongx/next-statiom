'use client';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const games = [
  {
    title: '贪吃蛇',
    description: '经典的贪吃蛇游戏，通过方向键控制蛇移动收集食物',
    href: '/subpackages/games/snake',
  },
  {
    title: '推箱子',
    description: '考验智力的经典推箱子游戏，将箱子推到指定位置',
    href: '/subpackages/games/sokoban',
  },
  {
    title: '数字华容道',
    description: '数字华容道游戏，通过数字移动来完成拼图',
    href: '/subpackages/games/number-puzzle',
  },
  {
    title: 'CoupAhoo',
    description:
      '你终于厌倦了你的舰队和他们的无能。一一击败他们所有 13 人，并在顶部占据一席之地。',
    href: '/subpackages/games/coupahoo',
  },
  {
    title: 'Bubble Burst',
    description:
      '在这个闪闪发光的冒险中，通过克服障碍和避开敌人 （XIII） 泡泡来达到目标',
    href: '/subpackages/games/bubble-burst',
  },
  {
    title: 'The Way of the Dodo',
    description:
      '体验渡渡鸟的冒险之旅，在这个充满挑战的游戏中探索未知世界',
    href: '/subpackages/games/the-way-of-the-dodo',
  },
];

export default function GamesPage() {
  return (
    <div className='p-6'>
      <div className='max-w-4xl mx-auto'>
        <Link
          href='/'
          className='inline-flex items-center text-muted-foreground hover:text-foreground mb-6'
        >
          <ArrowLeft className='w-4 h-4 mr-2' />
          返回首页
        </Link>

        <h1 className='text-2xl font-bold mb-8'>趣味游戏</h1>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {games.map((game) => (
            <Link href={game.href} key={game.href}>
              <div className='p-6 border rounded-lg hover:shadow-lg transition-shadow'>
                <h2 className='text-xl font-semibold mb-2'>{game.title}</h2>
                <p className='text-muted-foreground'>{game.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
