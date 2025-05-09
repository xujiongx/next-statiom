'use client';

import GamePage from '@/components/games/GamePage';

export default function PathToGloryGame() {
  const gameConfig = {
    id: 'path-to-glory',
    title: 'Path to Glory'
  };

  return <GamePage config={gameConfig} />;
}