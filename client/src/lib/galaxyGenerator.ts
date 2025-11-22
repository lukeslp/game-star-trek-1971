// Galaxy Generation for Star Trek 1971

import type { Galaxy, QuadrantData, Quadrant, Klingon, Starbase, Star, QuadrantPosition, SectorPosition } from './types';

const GALAXY_SIZE = 8;
const SECTOR_SIZE = 8;

export function generateGalaxy(): { galaxy: Galaxy; totalKlingons: number; totalStarbases: number } {
  // Initialize 8x8 galaxy
  const quadrants: QuadrantData[][] = [];
  let totalKlingons = 0;
  let totalStarbases = 0;

  for (let y = 0; y < GALAXY_SIZE; y++) {
    quadrants[y] = [];
    for (let x = 0; x < GALAXY_SIZE; x++) {
      const klingons = Math.random() < 0.3 ? Math.floor(Math.random() * 3) + 1 : 0;
      const starbases = Math.random() < 0.1 ? 1 : 0;
      const stars = Math.floor(Math.random() * 8) + 1;

      quadrants[y][x] = {
        klingons,
        starbases,
        stars,
        visited: false
      };

      totalKlingons += klingons;
      totalStarbases += starbases;
    }
  }

  // Ensure at least one starbase exists
  if (totalStarbases === 0) {
    const x = Math.floor(Math.random() * GALAXY_SIZE);
    const y = Math.floor(Math.random() * GALAXY_SIZE);
    quadrants[y][x].starbases = 1;
    totalStarbases = 1;
  }

  // Ensure at least 10 Klingons
  while (totalKlingons < 10) {
    const x = Math.floor(Math.random() * GALAXY_SIZE);
    const y = Math.floor(Math.random() * GALAXY_SIZE);
    if (quadrants[y][x].klingons < 3) {
      quadrants[y][x].klingons++;
      totalKlingons++;
    }
  }

  // Start in a random quadrant without Klingons
  let startX = Math.floor(Math.random() * GALAXY_SIZE);
  let startY = Math.floor(Math.random() * GALAXY_SIZE);
  while (quadrants[startY][startX].klingons > 0) {
    startX = Math.floor(Math.random() * GALAXY_SIZE);
    startY = Math.floor(Math.random() * GALAXY_SIZE);
  }

  const currentQuadrant = generateQuadrant({ x: startX, y: startY }, quadrants[startY][startX]);
  quadrants[startY][startX].visited = true;

  return {
    galaxy: {
      quadrants,
      currentQuadrant,
      klingonsRemaining: totalKlingons,
      starbasesRemaining: totalStarbases
    },
    totalKlingons,
    totalStarbases
  };
}

export function generateQuadrant(position: QuadrantPosition, data: QuadrantData): Quadrant {
  const klingons: Klingon[] = [];
  const starbases: Starbase[] = [];
  const stars: Star[] = [];

  const occupied = new Set<string>();

  // Place Klingons
  for (let i = 0; i < data.klingons; i++) {
    const sector = getRandomSector(occupied);
    klingons.push({
      id: `k${i}`,
      sector,
      energy: 200 + Math.floor(Math.random() * 100),
      shields: 100 + Math.floor(Math.random() * 100)
    });
    occupied.add(`${sector.x},${sector.y}`);
  }

  // Place Starbases
  for (let i = 0; i < data.starbases; i++) {
    const sector = getRandomSector(occupied);
    starbases.push({ sector });
    occupied.add(`${sector.x},${sector.y}`);
  }

  // Place Stars
  for (let i = 0; i < data.stars; i++) {
    const sector = getRandomSector(occupied);
    stars.push({ sector });
    occupied.add(`${sector.x},${sector.y}`);
  }

  return {
    position,
    klingons,
    starbases,
    stars,
    data
  };
}

function getRandomSector(occupied: Set<string>): SectorPosition {
  let x, y;
  do {
    x = Math.floor(Math.random() * SECTOR_SIZE);
    y = Math.floor(Math.random() * SECTOR_SIZE);
  } while (occupied.has(`${x},${y}`));

  return { x, y };
}

export function placeShipInQuadrant(quadrant: Quadrant): SectorPosition {
  const occupied = new Set<string>();

  quadrant.klingons.forEach(k => occupied.add(`${k.sector.x},${k.sector.y}`));
  quadrant.starbases.forEach(b => occupied.add(`${b.sector.x},${b.sector.y}`));
  quadrant.stars.forEach(s => occupied.add(`${s.sector.x},${s.sector.y}`));

  return getRandomSector(occupied);
}

export function isAdjacentToStarbase(shipSector: SectorPosition, starbases: Starbase[]): boolean {
  return starbases.some(base => {
    const dx = Math.abs(base.sector.x - shipSector.x);
    const dy = Math.abs(base.sector.y - shipSector.y);
    return dx <= 1 && dy <= 1 && (dx + dy) > 0; // Adjacent but not same square
  });
}

export function calculateDistance(from: SectorPosition, to: SectorPosition): number {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function getCourse(from: SectorPosition, to: SectorPosition): number {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  angle = (90 - angle) % 360;
  if (angle < 0) angle += 360;
  return (angle / 45) + 1;
}
