// Combat System for Star Trek 1971

import type { GameState, Klingon, SectorPosition } from './types';
import { calculateDistance } from './galaxyGenerator';

export interface CombatResult {
  messages: string[];
  klingonsDestroyed: string[];
  shipHit: boolean;
  damage: number;
  energyUsed: number;
}

/**
 * Fire phasers at Klingons in current quadrant
 * Energy is divided among targets, reduced by distance
 */
export function firePhasers(state: GameState, energyAmount: number): CombatResult {
  const result: CombatResult = {
    messages: [],
    klingonsDestroyed: [],
    shipHit: false,
    damage: 0,
    energyUsed: energyAmount
  };

  const { ship, galaxy } = state;
  const klingons = galaxy.currentQuadrant.klingons;

  if (klingons.length === 0) {
    result.messages.push('No Klingons in this quadrant.');
    result.energyUsed = 0;
    return result;
  }

  if (ship.energy < energyAmount) {
    result.messages.push(`Insufficient energy. You have ${ship.energy.toFixed(0)} units available.`);
    result.energyUsed = 0;
    return result;
  }

  // Check if phaser control is damaged
  const phaserSystem = state.systems.find(s => s.name === 'PHASER_CONTROL');
  if (phaserSystem && phaserSystem.damage > 0) {
    result.messages.push('Phaser control is damaged and inoperative.');
    result.energyUsed = 0;
    return result;
  }

  result.messages.push(`Phasers locked on target...`);
  result.messages.push(`Firing ${energyAmount.toFixed(0)} units of energy.`);

  // Divide energy among all Klingons
  const energyPerTarget = energyAmount / klingons.length;

  klingons.forEach((klingon, index) => {
    const distance = calculateDistance(ship.sector, klingon.sector);
    const effectiveEnergy = energyPerTarget * (1 - distance / 10);
    const damageDealt = Math.max(0, effectiveEnergy - klingon.shields * 0.1);

    klingon.shields -= Math.floor(damageDealt * 0.3);
    klingon.energy -= Math.floor(damageDealt);

    result.messages.push(
      `Hit on Klingon at sector ${klingon.sector.x},${klingon.sector.y} - ${damageDealt.toFixed(0)} damage dealt`
    );

    if (klingon.energy <= 0) {
      result.messages.push(`*** Klingon at ${klingon.sector.x},${klingon.sector.y} destroyed! ***`);
      result.klingonsDestroyed.push(klingon.id);
    } else {
      result.messages.push(
        `  Klingon has ${klingon.energy.toFixed(0)} energy remaining`
      );
    }
  });

  return result;
}

/**
 * Fire photon torpedo at specific target
 * Course is 1-8 representing compass directions
 */
export function fireTorpedo(
  state: GameState,
  course: number,
  targetSector?: SectorPosition
): CombatResult {
  const result: CombatResult = {
    messages: [],
    klingonsDestroyed: [],
    shipHit: false,
    damage: 0,
    energyUsed: 0
  };

  const { ship, galaxy } = state;

  if (ship.torpedoes <= 0) {
    result.messages.push('No photon torpedoes remaining.');
    return result;
  }

  // Check if photon tubes are damaged
  const torpedoSystem = state.systems.find(s => s.name === 'PHOTON_TUBES');
  if (torpedoSystem && torpedoSystem.damage > 0) {
    result.messages.push('Photon tubes are damaged and inoperative.');
    return result;
  }

  result.messages.push('Photon torpedo fired!');

  // Calculate torpedo path
  const courseRadians = ((course - 1) * 45 - 90) * (Math.PI / 180);
  let x = ship.sector.x;
  let y = ship.sector.y;

  const dx = Math.cos(courseRadians);
  const dy = Math.sin(courseRadians);

  // Trace torpedo path
  for (let i = 0; i < 8; i++) {
    x += dx;
    y += dy;

    const currentX = Math.round(x);
    const currentY = Math.round(y);

    // Out of bounds
    if (currentX < 0 || currentX >= 8 || currentY < 0 || currentY >= 8) {
      result.messages.push('Torpedo missed - exited quadrant.');
      break;
    }

    // Check for Klingon hit
    const hitKlingon = galaxy.currentQuadrant.klingons.find(
      k => k.sector.x === currentX && k.sector.y === currentY
    );

    if (hitKlingon) {
      result.messages.push(`*** Direct hit on Klingon at ${currentX},${currentY}! ***`);
      result.messages.push('*** Klingon destroyed! ***');
      result.klingonsDestroyed.push(hitKlingon.id);
      break;
    }

    // Check for star hit
    const hitStar = galaxy.currentQuadrant.stars.find(
      s => s.sector.x === currentX && s.sector.y === currentY
    );

    if (hitStar) {
      result.messages.push(`Torpedo detonated against star at ${currentX},${currentY}.`);
      break;
    }

    // Check for starbase hit
    const hitStarbase = galaxy.currentQuadrant.starbases.find(
      b => b.sector.x === currentX && b.sector.y === currentY
    );

    if (hitStarbase) {
      result.messages.push(`*** STARBASE DESTROYED ***`);
      result.messages.push('Court martial proceedings await you!');
      break;
    }
  }

  return result;
}

/**
 * Klingons attack the Enterprise
 * Called after player moves
 */
export function klingonAttack(state: GameState): CombatResult {
  const result: CombatResult = {
    messages: [],
    klingonsDestroyed: [],
    shipHit: false,
    damage: 0,
    energyUsed: 0
  };

  const { ship, galaxy } = state;
  const klingons = galaxy.currentQuadrant.klingons;

  if (klingons.length === 0 || ship.docked) {
    return result;
  }

  result.messages.push('\n*** Klingon attack! ***');

  klingons.forEach(klingon => {
    if (klingon.energy <= 0) return;

    const distance = calculateDistance(ship.sector, klingon.sector);
    const hitProbability = (1 - distance / 10) * (klingon.energy / 300);

    if (Math.random() < hitProbability) {
      const baseDamage = Math.floor(klingon.energy / 10);
      const actualDamage = Math.floor(baseDamage * (0.5 + Math.random() * 0.5));

      result.shipHit = true;
      result.damage += actualDamage;

      result.messages.push(
        `Hit from Klingon at ${klingon.sector.x},${klingon.sector.y} - ${actualDamage} damage!`
      );
    } else {
      result.messages.push(
        `Klingon at ${klingon.sector.x},${klingon.sector.y} missed.`
      );
    }
  });

  return result;
}

/**
 * Calculate damage to shields and systems from attack
 */
export function applyDamage(
  state: GameState,
  damage: number
): { shieldDamage: number; hullDamage: number; systemsDamaged: string[] } {
  const result = {
    shieldDamage: 0,
    hullDamage: 0,
    systemsDamaged: [] as string[]
  };

  // Shields absorb damage first
  if (state.ship.shields > 0) {
    const shieldAbsorb = Math.min(state.ship.shields, damage);
    result.shieldDamage = shieldAbsorb;
    damage -= shieldAbsorb;
  }

  // Remaining damage hits ship systems
  if (damage > 0) {
    result.hullDamage = damage;

    // Random chance to damage a system
    const systemDamageChance = Math.min(0.8, damage / 100);

    if (Math.random() < systemDamageChance) {
      const workingSystems = state.systems.filter(s => s.damage === 0);
      if (workingSystems.length > 0) {
        const targetSystem = workingSystems[Math.floor(Math.random() * workingSystems.length)];
        targetSystem.damage = Math.floor(Math.random() * 3) + 1;
        result.systemsDamaged.push(targetSystem.name);
      }
    }
  }

  return result;
}
