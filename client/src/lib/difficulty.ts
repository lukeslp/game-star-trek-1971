/**
 * Difficulty System for Star Trek 1971
 * Defines different challenge levels with adjusted parameters
 */

export type Difficulty = 'CADET' | 'CAPTAIN' | 'ADMIRAL';

export interface DifficultySettings {
  // Klingon parameters
  klingonCountMin: number;
  klingonCountMax: number;
  klingonStrengthMultiplier: number;
  
  // Starbase parameters
  starbaseCountMin: number;
  starbaseCountMax: number;
  
  // Time and resources
  timeLimit: number;
  startingEnergy: number;
  startingTorpedoes: number;
  
  // Damage modifiers
  damageMultiplier: number;
  repairMultiplier: number;
  
  // Labels
  label: string;
  description: string;
  color: string;
}

/**
 * Difficulty configurations
 */
export const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySettings> = {
  CADET: {
    klingonCountMin: 5,
    klingonCountMax: 8,
    klingonStrengthMultiplier: 0.7,
    starbaseCountMin: 3,
    starbaseCountMax: 5,
    timeLimit: 40,
    startingEnergy: 3500,
    startingTorpedoes: 12,
    damageMultiplier: 0.8,
    repairMultiplier: 1.5,
    label: 'Cadet',
    description: 'Recommended for new captains. More time, resources, and starbases.',
    color: '#4488FF' // Blue
  },
  
  CAPTAIN: {
    klingonCountMin: 8,
    klingonCountMax: 12,
    klingonStrengthMultiplier: 1.0,
    starbaseCountMin: 2,
    starbaseCountMax: 3,
    timeLimit: 30,
    startingEnergy: 3000,
    startingTorpedoes: 10,
    damageMultiplier: 1.0,
    repairMultiplier: 1.0,
    label: 'Captain',
    description: 'Standard difficulty. Balanced challenge for experienced players.',
    color: '#00FF88' // Green
  },
  
  ADMIRAL: {
    klingonCountMin: 12,
    klingonCountMax: 15,
    klingonStrengthMultiplier: 1.5,
    starbaseCountMin: 1,
    starbaseCountMax: 2,
    timeLimit: 25,
    startingEnergy: 2500,
    startingTorpedoes: 8,
    damageMultiplier: 1.3,
    repairMultiplier: 0.7,
    label: 'Admiral',
    description: 'Extreme challenge. More Klingons, fewer resources, less time.',
    color: '#FF4444' // Red
  }
};

/**
 * Get difficulty settings
 */
export function getDifficultySettings(difficulty: Difficulty): DifficultySettings {
  return DIFFICULTY_SETTINGS[difficulty];
}

/**
 * Get all difficulties for selection screen
 */
export function getAllDifficulties(): Array<{ key: Difficulty; settings: DifficultySettings }> {
  return [
    { key: 'CADET', settings: DIFFICULTY_SETTINGS.CADET },
    { key: 'CAPTAIN', settings: DIFFICULTY_SETTINGS.CAPTAIN },
    { key: 'ADMIRAL', settings: DIFFICULTY_SETTINGS.ADMIRAL }
  ];
}

/**
 * Get difficulty from localStorage or default to CAPTAIN
 */
export function getSavedDifficulty(): Difficulty {
  const saved = localStorage.getItem('startrek_difficulty');
  if (saved && (saved === 'CADET' || saved === 'CAPTAIN' || saved === 'ADMIRAL')) {
    return saved as Difficulty;
  }
  return 'CAPTAIN';
}

/**
 * Save difficulty preference
 */
export function saveDifficulty(difficulty: Difficulty): void {
  localStorage.setItem('startrek_difficulty', difficulty);
}

/**
 * Calculate score multiplier based on difficulty
 */
export function getDifficultyScoreMultiplier(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'CADET':
      return 0.8; // 80% of normal score
    case 'CAPTAIN':
      return 1.0; // Normal score
    case 'ADMIRAL':
      return 1.5; // 150% of normal score
    default:
      return 1.0;
  }
}

/**
 * Get difficulty icon/emoji
 */
export function getDifficultyIcon(difficulty: Difficulty): string {
  switch (difficulty) {
    case 'CADET':
      return '⭐';
    case 'CAPTAIN':
      return '⭐⭐';
    case 'ADMIRAL':
      return '⭐⭐⭐';
    default:
      return '⭐';
  }
}

/**
 * Get difficulty rank name
 */
export function getDifficultyRank(difficulty: Difficulty): string {
  switch (difficulty) {
    case 'CADET':
      return 'Ensign';
    case 'CAPTAIN':
      return 'Captain';
    case 'ADMIRAL':
      return 'Admiral';
    default:
      return 'Captain';
  }
}

