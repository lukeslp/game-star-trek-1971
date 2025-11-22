// Game Logic for Star Trek 1971

import type {
  GameState,
  Ship,
  Galaxy,
  QuadrantPosition,
  SectorPosition,
  SystemStatus,
  Condition,
  CommandResult
} from './types';
import {
  generateGalaxy,
  generateQuadrant,
  placeShipInQuadrant,
  isAdjacentToStarbase,
  calculateDistance,
  getCourse
} from './galaxyGenerator';
import {
  firePhasers,
  fireTorpedo,
  klingonAttack,
  applyDamage
} from './combatSystem';

const STARDATE_INCREMENT = 1;
const ENERGY_PER_WARP = 10;
const BASE_ENERGY_DRAIN = 10;

/**
 * Initialize a new game
 */
export function initializeGame(): GameState {
  const { galaxy, totalKlingons, totalStarbases } = generateGalaxy();

  // Initialize ship in starting quadrant
  const ship: Ship = {
    energy: 3000,
    shields: 0,
    torpedoes: 10,
    quadrant: galaxy.currentQuadrant.position,
    sector: placeShipInQuadrant(galaxy.currentQuadrant),
    condition: 'GREEN',
    docked: false,
    destroyed: false
  };

  // Check if docked at start
  ship.docked = isAdjacentToStarbase(ship.sector, galaxy.currentQuadrant.starbases);
  ship.condition = updateCondition(ship, galaxy.currentQuadrant.klingons.length);

  // Initialize systems - all operational
  const systems: SystemStatus[] = [
    { name: 'WARP_ENGINES', damage: 0 },
    { name: 'SHORT_RANGE_SENSORS', damage: 0 },
    { name: 'LONG_RANGE_SENSORS', damage: 0 },
    { name: 'PHASER_CONTROL', damage: 0 },
    { name: 'PHOTON_TUBES', damage: 0 },
    { name: 'DAMAGE_CONTROL', damage: 0 },
    { name: 'SHIELD_CONTROL', damage: 0 },
    { name: 'LIBRARY_COMPUTER', damage: 0 }
  ];

  const initialStardate = 2250 + Math.floor(Math.random() * 50);

  return {
    ship,
    galaxy,
    systems,
    stardate: initialStardate,
    initialStardate,
    timeLimit: 30,
    mission: {
      klingonsAtStart: totalKlingons,
      klingonsDestroyed: 0
    },
    gameOver: false,
    victory: false,
    messages: [
      '*** STAR TREK 1971 ***',
      '',
      `Stardate ${initialStardate}`,
      `Mission: Destroy ${totalKlingons} Klingon warships in ${30} stardates.`,
      `There are ${totalStarbases} starbases in the galaxy for resupply.`,
      '',
      'Type HELP for commands.',
      ''
    ]
  };
}

/**
 * Navigate to a new sector or quadrant
 */
export function navigate(state: GameState, course: number, warp: number): CommandResult {
  const messages: string[] = [];
  const { ship, galaxy, systems } = state;

  // Check warp engines
  const warpSystem = systems.find(s => s.name === 'WARP_ENGINES');
  if (warpSystem && warpSystem.damage > 0) {
    return {
      success: false,
      messages: ['Warp engines are damaged. Repairs needed before navigation.']
    };
  }

  // Calculate energy cost
  const energyCost = Math.floor(warp * ENERGY_PER_WARP);

  if (ship.energy < energyCost) {
    return {
      success: false,
      messages: [`Insufficient energy. Need ${energyCost}, have ${ship.energy}.`]
    };
  }

  // Calculate movement
  const courseRadians = ((course - 1) * 45 - 90) * (Math.PI / 180);
  const distance = warp;

  let newSectorX = ship.sector.x + distance * Math.cos(courseRadians);
  let newSectorY = ship.sector.y + distance * Math.sin(courseRadians);

  let newQuadrantX = ship.quadrant.x;
  let newQuadrantY = ship.quadrant.y;

  // Handle quadrant boundary crossing
  while (newSectorX < 0) {
    newSectorX += 8;
    newQuadrantX--;
  }
  while (newSectorX >= 8) {
    newSectorX -= 8;
    newQuadrantX++;
  }
  while (newSectorY < 0) {
    newSectorY += 8;
    newQuadrantY--;
  }
  while (newSectorY >= 8) {
    newSectorY -= 8;
    newQuadrantY++;
  }

  // Check galaxy bounds
  if (newQuadrantX < 0 || newQuadrantX >= 8 || newQuadrantY < 0 || newQuadrantY >= 8) {
    return {
      success: false,
      messages: ['Navigation error: Cannot leave galaxy bounds.']
    };
  }

  const finalSector: SectorPosition = {
    x: Math.round(newSectorX),
    y: Math.round(newSectorY)
  };

  const changedQuadrant =
    newQuadrantX !== ship.quadrant.x || newQuadrantY !== ship.quadrant.y;

  // Update ship position
  ship.sector = finalSector;
  ship.energy -= energyCost;

  messages.push(`Warp engines engaged at factor ${warp.toFixed(1)}`);
  messages.push(`Energy consumed: ${energyCost}`);

  // If changed quadrant, generate new quadrant
  if (changedQuadrant) {
    const newQuadrant: QuadrantPosition = { x: newQuadrantX, y: newQuadrantY };
    ship.quadrant = newQuadrant;

    const quadrantData = galaxy.quadrants[newQuadrantY][newQuadrantX];
    galaxy.currentQuadrant = generateQuadrant(newQuadrant, quadrantData);
    quadrantData.visited = true;

    messages.push('');
    messages.push(`Entering quadrant ${newQuadrantX + 1},${newQuadrantY + 1}`);

    if (galaxy.currentQuadrant.klingons.length > 0) {
      messages.push(
        `*** ALERT: ${galaxy.currentQuadrant.klingons.length} Klingon warship(s) detected! ***`
      );
    }
  } else {
    messages.push(`Moved to sector ${finalSector.x},${finalSector.y}`);
  }

  // Check for collision
  const collision = checkCollision(finalSector, galaxy.currentQuadrant);
  if (collision) {
    messages.push('');
    messages.push(`*** COLLISION WITH ${collision.toUpperCase()}! ***`);
    messages.push('Ship destroyed!');
    return {
      success: false,
      messages,
      newState: {
        ship: { ...ship, destroyed: true },
        gameOver: true,
        victory: false
      }
    };
  }

  // Update docked status
  ship.docked = isAdjacentToStarbase(ship.sector, galaxy.currentQuadrant.starbases);

  if (ship.docked) {
    messages.push('');
    messages.push('*** DOCKED AT STARBASE ***');
    messages.push('Shields down. Refueling and repairs available.');
    ship.shields = 0;
    ship.energy = 3000;
    ship.torpedoes = 10;

    // Repair one system turn at starbase
    const damagedSystems = systems.filter(s => s.damage > 0);
    if (damagedSystems.length > 0) {
      damagedSystems.forEach(sys => {
        sys.damage = Math.max(0, sys.damage - 1);
      });
      messages.push('Damage control teams working on repairs...');
    }
  }

  // Update condition
  ship.condition = updateCondition(ship, galaxy.currentQuadrant.klingons.length);

  // Klingon attack after move
  if (!ship.docked && galaxy.currentQuadrant.klingons.length > 0) {
    const attack = klingonAttack(state);
    if (attack.shipHit) {
      const damageResult = applyDamage(state, attack.damage);
      ship.shields -= damageResult.shieldDamage;
      ship.energy -= damageResult.hullDamage;

      messages.push(...attack.messages);

      if (damageResult.systemsDamaged.length > 0) {
        messages.push('');
        messages.push('*** SYSTEMS DAMAGED ***');
        damageResult.systemsDamaged.forEach(sysName => {
          messages.push(`  ${sysName.replace('_', ' ')}`);
        });
      }

      if (ship.energy <= 0) {
        messages.push('');
        messages.push('*** ENTERPRISE DESTROYED ***');
        messages.push('Mission failed.');
        return {
          success: false,
          messages,
          newState: {
            ship: { ...ship, destroyed: true },
            gameOver: true,
            victory: false
          }
        };
      }
    } else {
      messages.push(...attack.messages);
    }
  }

  return {
    success: true,
    messages,
    newState: {
      stardate: state.stardate + STARDATE_INCREMENT
    }
  };
}

/**
 * Fire phasers at Klingons
 */
export function executePhasers(state: GameState, energy: number): CommandResult {
  const combat = firePhasers(state, energy);

  if (!combat.shipHit) {
    // Remove destroyed Klingons
    state.galaxy.currentQuadrant.klingons = state.galaxy.currentQuadrant.klingons.filter(
      k => !combat.klingonsDestroyed.includes(k.id)
    );

    // Update counts
    state.mission.klingonsDestroyed += combat.klingonsDestroyed.length;
    state.galaxy.klingonsRemaining -= combat.klingonsDestroyed.length;
    state.galaxy.currentQuadrant.data.klingons -= combat.klingonsDestroyed.length;

    // Update ship energy
    state.ship.energy -= combat.energyUsed;

    // Check victory
    if (state.galaxy.klingonsRemaining === 0) {
      return {
        success: true,
        messages: [
          ...combat.messages,
          '',
          '*** MISSION ACCOMPLISHED ***',
          'All Klingon warships destroyed!',
          `You completed the mission in ${state.stardate - state.initialStardate} stardates.`
        ],
        newState: {
          gameOver: true,
          victory: true
        }
      };
    }

    // Klingons return fire
    if (state.galaxy.currentQuadrant.klingons.length > 0) {
      const attack = klingonAttack(state);
      if (attack.shipHit) {
        const damageResult = applyDamage(state, attack.damage);
        state.ship.shields -= damageResult.shieldDamage;
        state.ship.energy -= damageResult.hullDamage;

        combat.messages.push(...attack.messages);

        if (state.ship.energy <= 0) {
          return {
            success: false,
            messages: [
              ...combat.messages,
              '',
              '*** ENTERPRISE DESTROYED ***'
            ],
            newState: {
              ship: { ...state.ship, destroyed: true },
              gameOver: true,
              victory: false
            }
          };
        }
      }
    }
  }

  return {
    success: true,
    messages: combat.messages,
    newState: {
      stardate: state.stardate + STARDATE_INCREMENT
    }
  };
}

/**
 * Fire photon torpedo
 */
export function executeTorpedo(state: GameState, course: number): CommandResult {
  const combat = fireTorpedo(state, course);

  // Remove destroyed Klingons
  state.galaxy.currentQuadrant.klingons = state.galaxy.currentQuadrant.klingons.filter(
    k => !combat.klingonsDestroyed.includes(k.id)
  );

  // Update counts
  state.mission.klingonsDestroyed += combat.klingonsDestroyed.length;
  state.galaxy.klingonsRemaining -= combat.klingonsDestroyed.length;
  state.galaxy.currentQuadrant.data.klingons -= combat.klingonsDestroyed.length;
  state.ship.torpedoes -= 1;

  // Check victory
  if (state.galaxy.klingonsRemaining === 0) {
    return {
      success: true,
      messages: [
        ...combat.messages,
        '',
        '*** MISSION ACCOMPLISHED ***',
        'All Klingon warships destroyed!'
      ],
      newState: {
        gameOver: true,
        victory: true
      }
    };
  }

  // Klingons return fire
  if (state.galaxy.currentQuadrant.klingons.length > 0) {
    const attack = klingonAttack(state);
    if (attack.shipHit) {
      const damageResult = applyDamage(state, attack.damage);
      state.ship.shields -= damageResult.shieldDamage;
      state.ship.energy -= damageResult.hullDamage;

      combat.messages.push(...attack.messages);

      if (state.ship.energy <= 0) {
        return {
          success: false,
          messages: [...combat.messages, '', '*** ENTERPRISE DESTROYED ***'],
          newState: {
            ship: { ...state.ship, destroyed: true },
            gameOver: true,
            victory: false
          }
        };
      }
    }
  }

  return {
    success: true,
    messages: combat.messages,
    newState: {
      stardate: state.stardate + STARDATE_INCREMENT
    }
  };
}

/**
 * Transfer energy to shields
 */
export function adjustShields(state: GameState, energy: number): CommandResult {
  const shieldSystem = state.systems.find(s => s.name === 'SHIELD_CONTROL');
  if (shieldSystem && shieldSystem.damage > 0) {
    return {
      success: false,
      messages: ['Shield control is damaged.']
    };
  }

  const { ship } = state;

  if (energy > ship.energy) {
    return {
      success: false,
      messages: [`Insufficient energy. You have ${ship.energy} units available.`]
    };
  }

  ship.shields += energy;
  ship.energy -= energy;

  return {
    success: true,
    messages: [
      `Transferred ${energy} units to shields.`,
      `Shields now at ${ship.shields}`,
      `Energy now at ${ship.energy}`
    ]
  };
}

/**
 * Display short range sensor scan
 */
export function shortRangeScan(state: GameState): CommandResult {
  const srsSystem = state.systems.find(s => s.name === 'SHORT_RANGE_SENSORS');
  if (srsSystem && srsSystem.damage > 0) {
    return {
      success: false,
      messages: ['Short range sensors are damaged.']
    };
  }

  const scan = renderShortRangeScan(state);
  return {
    success: true,
    messages: scan.split('\n')
  };
}

/**
 * Display long range sensor scan
 */
export function longRangeScan(state: GameState): CommandResult {
  const lrsSystem = state.systems.find(s => s.name === 'LONG_RANGE_SENSORS');
  if (lrsSystem && lrsSystem.damage > 0) {
    return {
      success: false,
      messages: ['Long range sensors are damaged.']
    };
  }

  const scan = renderLongRangeScan(state);
  return {
    success: true,
    messages: scan.split('\n')
  };
}

/**
 * Display damage report
 */
export function damageReport(state: GameState): CommandResult {
  const messages: string[] = ['DAMAGE REPORT:', ''];

  let hasDamage = false;
  state.systems.forEach(sys => {
    if (sys.damage > 0) {
      hasDamage = true;
      messages.push(
        `${sys.name.replace('_', ' ').padEnd(20)} - ${sys.damage} turns until repair`
      );
    }
  });

  if (!hasDamage) {
    messages.push('All systems operational.');
  }

  return {
    success: true,
    messages
  };
}

/**
 * Computer functions
 */
export function libraryComputer(state: GameState, func: number): CommandResult {
  const computerSystem = state.systems.find(s => s.name === 'LIBRARY_COMPUTER');
  if (computerSystem && computerSystem.damage > 0) {
    return {
      success: false,
      messages: ['Library computer is damaged.']
    };
  }

  if (func === 1) {
    // Calculate distance to all Klingons
    const messages: string[] = ['DISTANCE CALCULATIONS:', ''];

    if (state.galaxy.currentQuadrant.klingons.length === 0) {
      messages.push('No Klingons in current quadrant.');
    } else {
      state.galaxy.currentQuadrant.klingons.forEach((k, i) => {
        const dist = calculateDistance(state.ship.sector, k.sector);
        messages.push(`Klingon ${i + 1} at (${k.sector.x},${k.sector.y}): ${dist.toFixed(2)} units`);
      });
    }

    return { success: true, messages };
  } else if (func === 2) {
    // Navigation data
    const messages: string[] = ['NAVIGATION DATA:', ''];
    messages.push('COURSE   DIRECTION');
    messages.push('  1      North');
    messages.push('  2      Northeast');
    messages.push('  3      East');
    messages.push('  4      Southeast');
    messages.push('  5      South');
    messages.push('  6      Southwest');
    messages.push('  7      West');
    messages.push('  8      Northwest');

    return { success: true, messages };
  }

  return {
    success: false,
    messages: ['Invalid computer function.']
  };
}

// Helper functions

function updateCondition(ship: Ship, klingonCount: number): Condition {
  if (ship.docked) return 'DOCKED';
  if (klingonCount > 0) return 'RED';
  if (ship.energy < 500) return 'YELLOW';
  return 'GREEN';
}

function checkCollision(sector: SectorPosition, quadrant: any): string | null {
  if (quadrant.klingons.some((k: any) => k.sector.x === sector.x && k.sector.y === sector.y)) {
    return 'klingon';
  }
  if (quadrant.stars.some((s: any) => s.sector.x === sector.x && s.sector.y === sector.y)) {
    return 'star';
  }
  if (quadrant.starbases.some((b: any) => b.sector.x === sector.x && b.sector.y === sector.y)) {
    return 'starbase';
  }
  return null;
}

function renderShortRangeScan(state: GameState): string {
  const { ship, galaxy } = state;
  const quadrant = galaxy.currentQuadrant;

  // Build 8x8 grid
  const grid: string[][] = Array(8)
    .fill(null)
    .map(() => Array(8).fill(' . '));

  // Place entities
  quadrant.klingons.forEach(k => {
    grid[k.sector.y][k.sector.x] = ' K ';
  });
  quadrant.starbases.forEach(b => {
    grid[b.sector.y][b.sector.x] = ' B ';
  });
  quadrant.stars.forEach(s => {
    grid[s.sector.y][s.sector.x] = ' * ';
  });
  grid[ship.sector.y][ship.sector.x] = ' E ';

  // Build output
  let output = '\nSHORT RANGE SCAN\n';
  output += `Quadrant: ${ship.quadrant.x + 1},${ship.quadrant.y + 1}\n`;
  output += `Sector: ${ship.sector.x},${ship.sector.y}\n\n`;

  grid.forEach((row, y) => {
    output += row.join('') + `  ${y}\n`;
  });
  output += ' 0  1  2  3  4  5  6  7\n';

  output += `\nCondition: ${ship.condition}`;
  output += `\nEnergy: ${ship.energy}  Shields: ${ship.shields}  Torpedoes: ${ship.torpedoes}`;
  output += `\nKlingons: ${quadrant.klingons.length}  Starbases: ${quadrant.starbases.length}  Stars: ${quadrant.stars.length}`;

  return output;
}

function renderLongRangeScan(state: GameState): string {
  const { ship, galaxy } = state;
  let output = '\nLONG RANGE SCAN\n\n';

  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const qx = ship.quadrant.x + dx;
      const qy = ship.quadrant.y + dy;

      if (qx < 0 || qx >= 8 || qy < 0 || qy >= 8) {
        output += '*** ';
      } else {
        const data = galaxy.quadrants[qy][qx];
        const code = `${data.klingons}${data.starbases}${data.stars}`;
        output += code.padStart(3, '0') + ' ';
      }
    }
    output += '\n';
  }

  output += '\n(Format: KBS - Klingons, Bases, Stars)';

  return output;
}

/**
 * Check time limit
 */
export function checkTimeLimit(state: GameState): boolean {
  return state.stardate - state.initialStardate >= state.timeLimit;
}

/**
 * Advance time and handle end-of-turn logic
 */
export function advanceTurn(state: GameState): void {
  // Passive energy drain
  state.ship.energy -= BASE_ENERGY_DRAIN;

  // Repair systems at starbase
  if (state.ship.docked) {
    state.systems.forEach(sys => {
      if (sys.damage > 0) {
        sys.damage--;
      }
    });
  }

  // Check time limit
  if (checkTimeLimit(state)) {
    state.gameOver = true;
    state.victory = false;
  }

  // Check energy depletion
  if (state.ship.energy <= 0 && !state.ship.docked) {
    state.ship.destroyed = true;
    state.gameOver = true;
    state.victory = false;
  }
}
