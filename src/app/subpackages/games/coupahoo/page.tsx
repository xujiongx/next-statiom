'use client';

import GamePage from '@/components/games/GamePage';

export default function CoupAhooGame() {
  const gameConfig = {
    id: 'coupahoo',
    title: 'CoupAhoo 游戏'
  };

  return <GamePage config={gameConfig} />;
}
