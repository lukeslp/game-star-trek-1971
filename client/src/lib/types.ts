// Star Trek 1971 Game Types

export type Condition = 'GREEN' | 'RED' | 'DOCKED' | 'YELLOW';
export type SystemName = 'WARP_ENGINES' | 'SHORT_RANGE_SENSORS' | 'LONG_RANGE_SENSORS' |
  'PHASER_CONTROL' | 'PHOTON_TUBES' | 'DAMAGE_CONTROL' | 'SHIELD_CONTROL' | 'LIBRARY_COMPUTER';

export interface Position {
  x: number;
  y: number;
}

export interface QuadrantPosition extends Position {}
export interface SectorPosition extends Position {}

export interface Klingon {
  id: string;
  sector: SectorPosition;
  energy: number;
  shields: number;
}

export interface Starbase {
  sector: SectorPosition;
}

export interface Star {
  sector: SectorPosition;
}

export interface QuadrantData {
  klingons: number;
  starbases: number;
  stars: number;
  visited: boolean;
}

export interface Quadrant {
  position: QuadrantPosition;
  klingons: Klingon[];
  starbases: Starbase[];
  stars: Star[];
  data: QuadrantData;
}

export interface Ship {
  energy: number;
  shields: number;
  torpedoes: number;
  quadrant: QuadrantPosition;
  sector: SectorPosition;
  condition: Condition;
  docked: boolean;
  destroyed: boolean;
}

export interface SystemStatus {
  name: SystemName;
  damage: number; // 0 = working, > 0 = damaged (turns until repair)
}

export interface Galaxy {
  quadrants: QuadrantData[][];
  currentQuadrant: Quadrant;
  klingonsRemaining: number;
  starbasesRemaining: number;
}

export interface GameState {
  ship: Ship;
  galaxy: Galaxy;
  systems: SystemStatus[];
  stardate: number;
  initialStardate: number;
  timeLimit: number;
  mission: {
    klingonsAtStart: number;
    klingonsDestroyed: number;
  };
  gameOver: boolean;
  victory: boolean;
  messages: string[];
}

export interface CommandResult {
  success: boolean;
  messages: string[];
  newState?: Partial<GameState>;
}
