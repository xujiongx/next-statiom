'use client';

import GamePage from '@/components/games/GamePage';

export default function TheWayOfTheDodoGame() {
  const gameConfig = {
    id: 'the-way-of-the-dodo',
    title: 'The Way of the Dodo'
  };

  return <GamePage config={gameConfig} />;
}