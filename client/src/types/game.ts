// Game Types and Interfaces

export interface Position {
  x: number;
  y: number;
}

export interface QuadrantCoords {
  qx: number;
  qy: number;
}

export interface SectorCoords {
  sx: number;
  sy: number;
}

export enum EntityType {
  EMPTY = 0,
  ENTERPRISE = 1,
  KLINGON = 2,
  STARBASE = 3,
  STAR = 4,
}

export interface Entity {
  type: EntityType;
  position: SectorCoords;
  energy?: number; // For Klingons
}

export interface Quadrant {
  coords: QuadrantCoords;
  klingons: number;
  starbases: number;
  stars: number;
  scanned: boolean;
  entities: Entity[];
}

export interface ShipSystems {
  navigation: number; // 0-1, 1 = fully operational
  shortRangeSensors: number;
  longRangeSensors: number;
  phasers: number;
  torpedoes: number;
  shields: number;
  computer: number;
}

export interface Ship {
  energy: number;
  maxEnergy: number;
  shields: number;
  torpedoes: number;
  maxTorpedoes: number;
  shieldsUp: boolean;
  damage: ShipSystems;
  docked: boolean;
}

export interface GameState {
  galaxy: Quadrant[][];
  currentQuadrant: QuadrantCoords;
  currentSector: SectorCoords;
  ship: Ship;
  klingonsRemaining: number;
  initialKlingons: number;
  stardate: number;
  initialStardate: number;
  stardatesRemaining: number;
  gameOver: boolean;
  victory: boolean;
  messages: string[];
}

export interface GameConfig {
  galaxySize: number;
  quadrantSize: number;
  initialKlingons: number;
  initialStarbases: number;
  initialStardate: number;
  initialStardates: number;
  initialEnergy: number;
  initialTorpedoes: number;
}

export const DEFAULT_CONFIG: GameConfig = {
  galaxySize: 8,
  quadrantSize: 8,
  initialKlingons: 17,
  initialStarbases: 3,
  initialStardate: 2000,
  initialStardates: 30,
  initialEnergy: 3000,
  initialTorpedoes: 10,
};
