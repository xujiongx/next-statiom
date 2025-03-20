export type Cell = 'wall' | 'floor' | 'target' | 'box' | 'player' | 'boxOnTarget' | 'playerOnTarget';

export type Level = {
  map: Cell[][];
  playerPos: { x: number; y: number };
};

export const levels: Level[] = [
  {
    // 第一关：简单入门
    map: [
      ['wall', 'wall', 'wall', 'wall', 'wall'],
      ['wall', 'floor', 'floor', 'floor', 'wall'],
      ['wall', 'floor', 'box', 'target', 'wall'],
      ['wall', 'player', 'floor', 'floor', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'wall'],
    ],
    playerPos: { x: 1, y: 3 }
  },
  {
    // 第二关：双箱子
    map: [
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
      ['wall', 'floor', 'floor', 'floor', 'floor', 'wall'],
      ['wall', 'floor', 'box', 'box', 'target', 'wall'],
      ['wall', 'floor', 'player', 'floor', 'target', 'wall'],
      ['wall', 'floor', 'floor', 'floor', 'floor', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ],
    playerPos: { x: 2, y: 3 }
  },
  {
    // 第三关：三箱子直线
    map: [
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
      ['wall', 'target', 'target', 'target', 'floor', 'floor', 'wall'],
      ['wall', 'floor', 'box', 'box', 'box', 'floor', 'wall'],
      ['wall', 'floor', 'floor', 'player', 'floor', 'floor', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ],
    playerPos: { x: 3, y: 3 }
  },
  {
    // 第四关：L形
    map: [
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
      ['wall', 'target', 'target', 'target', 'wall', 'wall'],
      ['wall', 'floor', 'box', 'box', 'floor', 'wall'],
      ['wall', 'floor', 'box', 'floor', 'floor', 'wall'],
      ['wall', 'floor', 'player', 'floor', 'floor', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ],
    playerPos: { x: 2, y: 4 }
  },
  {
    // 第五关：回字形
    map: [
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
      ['wall', 'target', 'target', 'target', 'target', 'floor', 'wall'],
      ['wall', 'wall', 'box', 'wall', 'box', 'floor', 'wall'],
      ['wall', 'floor', 'box', 'floor', 'box', 'floor', 'wall'],
      ['wall', 'floor', 'floor', 'player', 'floor', 'floor', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ],
    playerPos: { x: 3, y: 4 }
  },
  // ... 可以继续添加更多关卡
];