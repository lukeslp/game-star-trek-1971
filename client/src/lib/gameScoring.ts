/**
 * Game Scoring System - Adapted for actual GameState structure
 */

import type { GameState } from "@/types/game";

export interface GameScore {
  klingonsDestroyed: number;
  timeBonus: number;
  energyBonus: number;
  torpedoBonus: number;
  speedBonus: number;
  noDamageBonus: number;
  perfectionBonus: number;
  total: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  gradeDescription: string;
}

export interface ScoreItem {
  label: string;
  points: number;
  description: string;
}

/**
 * Calculate live score during gameplay (in progress, not final)
 * This shows real-time score as player progresses
 */
export function calculateLiveScore(state: GameState): number {
  // Klingons destroyed so far: 100 points each
  const klingonsKilled = state.initialKlingons - state.klingonsRemaining;
  const klingonScore = klingonsKilled * 100;

  // Energy efficiency bonus (current energy vs starting)
  const energyEfficiency = Math.floor(state.ship.energy / 100);

  // Torpedoes remaining: 50 points each
  const torpedoScore = state.ship.torpedoes * 50;

  // Time efficiency (stardates remaining)
  const timeScore = Math.floor(state.stardatesRemaining * 10);

  // No damage bonus check (all systems at full health)
  const allSystemsHealthy = Object.values(state.ship.damage).every(d => d === 1);
  const damageBonus = allSystemsHealthy ? 500 : 0;

  return klingonScore + energyEfficiency + torpedoScore + timeScore + damageBonus;
}

/**
 * Calculate final score from game state
 */
export function calculateScore(state: GameState): GameScore {
  const score: GameScore = {
    klingonsDestroyed: 0,
    timeBonus: 0,
    energyBonus: 0,
    torpedoBonus: 0,
    speedBonus: 0,
    noDamageBonus: 0,
    perfectionBonus: 0,
    total: 0,
    grade: 'F',
    gradeDescription: 'Mission Failed'
  };

  // If lost, return F grade
  if (!state.victory) {
    return score;
  }

  // Klingons destroyed: 100 points each
  const klingonsKilled = state.initialKlingons - state.klingonsRemaining;
  score.klingonsDestroyed = klingonsKilled * 100;

  // Time remaining: 10 points per stardate
  score.timeBonus = Math.floor(state.stardatesRemaining * 10);

  // Energy remaining: 1 point per 100 energy
  score.energyBonus = Math.floor(state.ship.energy / 100);

  // Torpedoes remaining: 50 points each
  score.torpedoBonus = state.ship.torpedoes * 50;

  // Speed bonus: completed quickly (under 20 stardates used)
  const stardatesUsed = state.stardate - state.initialStardate;
  if (stardatesUsed < 20) {
    score.speedBonus = Math.floor((20 - stardatesUsed) * 100);
  }

  // No damage bonus: all systems at full health
  const allSystemsHealthy = Object.values(state.ship.damage).every(d => d === 1);
  if (allSystemsHealthy) {
    score.noDamageBonus = 1000;
  }

  // Perfection bonus: extremely fast completion (under 15 stardates)
  if (stardatesUsed < 15) {
    score.perfectionBonus = 500;
  }

  // Calculate total
  score.total =
    score.klingonsDestroyed +
    score.timeBonus +
    score.energyBonus +
    score.torpedoBonus +
    score.speedBonus +
    score.noDamageBonus +
    score.perfectionBonus;

  // Determine grade
  const { grade, description } = calculateGrade(score.total);
  score.grade = grade;
  score.gradeDescription = description;

  return score;
}

/**
 * Get grade and description from total score
 */
function calculateGrade(total: number): { grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F', description: string } {
  if (total >= 3000) return { grade: 'S', description: 'Legendary Captain' };
  if (total >= 2000) return { grade: 'A', description: 'Excellent Command' };
  if (total >= 1500) return { grade: 'B', description: 'Good Performance' };
  if (total >= 1000) return { grade: 'C', description: 'Adequate Mission' };
  if (total >= 500) return { grade: 'D', description: 'Barely Passing' };
  return { grade: 'F', description: 'Needs Improvement' };
}

/**
 * Get detailed score breakdown for display
 */
export function getScoreBreakdown(score: GameScore, state: GameState): ScoreItem[] {
  const breakdown: ScoreItem[] = [];
  const stardatesUsed = state.stardate - state.initialStardate;

  if (score.klingonsDestroyed > 0) {
    const count = score.klingonsDestroyed / 100;
    breakdown.push({
      label: 'Klingons Destroyed',
      points: score.klingonsDestroyed,
      description: `${count} × 100 points`
    });
  }

  if (score.timeBonus > 0) {
    breakdown.push({
      label: 'Time Remaining',
      points: score.timeBonus,
      description: `${state.stardatesRemaining.toFixed(1)} stardates × 10`
    });
  }

  if (score.energyBonus > 0) {
    breakdown.push({
      label: 'Energy Bonus',
      points: score.energyBonus,
      description: `${state.ship.energy} energy remaining`
    });
  }

  if (score.torpedoBonus > 0) {
    breakdown.push({
      label: 'Torpedo Bonus',
      points: score.torpedoBonus,
      description: `${state.ship.torpedoes} × 50 points`
    });
  }

  if (score.speedBonus > 0) {
    breakdown.push({
      label: 'Speed Bonus',
      points: score.speedBonus,
      description: `Completed in ${stardatesUsed.toFixed(1)} stardates`
    });
  }

  if (score.noDamageBonus > 0) {
    breakdown.push({
      label: 'No Damage Bonus',
      points: score.noDamageBonus,
      description: 'All systems at 100%'
    });
  }

  if (score.perfectionBonus > 0) {
    breakdown.push({
      label: 'Perfection Bonus',
      points: score.perfectionBonus,
      description: 'Lightning fast completion!'
    });
  }

  return breakdown;
}

/**
 * Returns the OKLCH color value for a given letter grade
 * Used for UI styling of score displays
 * @param grade - Letter grade (S, A, B, C, D, or F)
 * @returns OKLCH color string for the grade
 */
export function getGradeColor(grade: string): string {
  switch (grade) {
    case 'S': return 'oklch(0.85 0.25 60)'; // Gold
    case 'A': return 'oklch(0.75 0.2 145)'; // Green
    case 'B': return 'oklch(0.65 0.2 190)'; // Cyan
    case 'C': return 'oklch(0.75 0.2 60)'; // Yellow
    case 'D': return 'oklch(0.65 0.2 30)'; // Orange
    case 'F': return 'oklch(0.6 0.24 27)'; // Red
    default: return 'oklch(0.6 0.15 145)'; // Muted green
  }
}

/**
 * High score entry for leaderboard
 */
export interface HighScoreEntry {
  name: string;
  score: number;
  grade: string;
  date: string;
  timestamp: number;
}

/**
 * Save high score to localStorage
 */
export function saveHighScore(name: string, score: GameScore): void {
  const entry: HighScoreEntry = {
    name: name.toUpperCase().slice(0, 3).padEnd(3, ' '),
    score: score.total,
    grade: score.grade,
    date: new Date().toLocaleDateString(),
    timestamp: Date.now()
  };

  const scores = getHighScores();
  scores.push(entry);
  scores.sort((a, b) => b.score - a.score);
  const top10 = scores.slice(0, 10);

  localStorage.setItem('startrek_high_scores', JSON.stringify(top10));
}

/**
 * Get high scores from localStorage
 */
export function getHighScores(): HighScoreEntry[] {
  const stored = localStorage.getItem('startrek_high_scores');
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Check if score qualifies for leaderboard
 */
export function isHighScore(score: number): boolean {
  const scores = getHighScores();
  if (scores.length < 10) return true;
  return score > scores[scores.length - 1].score;
}

/**
 * Clears all high scores from localStorage
 * WARNING: This operation cannot be undone
 */
export function clearHighScores(): void {
  localStorage.removeItem('startrek_high_scores');
}

/**
 * Retrieves the last used player name from localStorage
 * @returns Last player name or 'AAA' as default
 */
export function getLastPlayerName(): string {
  return localStorage.getItem('startrek_player_name') || 'AAA';
}

/**
 * Stores the player name in localStorage for future use
 * Name is automatically uppercased and limited to 3 characters
 * @param name - Player name to store (will be truncated to 3 chars)
 */
export function setLastPlayerName(name: string): void {
  localStorage.setItem('startrek_player_name', name.toUpperCase().slice(0, 3));
}

/**
 * Gets the hot start preference from localStorage
 * @returns true if hot start is enabled, false otherwise
 */
export function getHotStartPreference(): boolean {
  return localStorage.getItem('startrek_hot_start') === 'true';
}

/**
 * Sets the hot start preference in localStorage
 * @param enabled - Whether hot start should be enabled
 */
export function setHotStartPreference(enabled: boolean): void {
  localStorage.setItem('startrek_hot_start', enabled ? 'true' : 'false');
}
