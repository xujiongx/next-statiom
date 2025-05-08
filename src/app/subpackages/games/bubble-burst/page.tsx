'use client';

import GamePage from '@/components/games/GamePage';

export default function BubbleBurstGame() {
  const gameConfig = {
    id: 'bubble-burst',
    title: 'Bubble Burst'
  };

  return <GamePage config={gameConfig} />;
}
