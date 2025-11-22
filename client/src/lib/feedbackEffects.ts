/**
 * Feedback Effects System
 * Coordinates visual animations and sound effects for game actions
 */

import { soundManager } from './soundManager';

/**
 * Trigger visual animation on a DOM element
 */
function addAnimation(selector: string, animationClass: string, duration: number): void {
  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    element.classList.add(animationClass);
    setTimeout(() => {
      element.classList.remove(animationClass);
    }, duration);
  });
}

/**
 * Trigger visual animation on a specific grid cell
 */
function animateGridCell(x: number, y: number, animationClass: string, duration: number): void {
  // Grid cells are in format: .grid-row[data-y="${y}"] .grid-cell[data-x="${x}"]
  const selector = `.grid-row[data-row="${y}"] > div:nth-child(${x + 1})`;
  addAnimation(selector, animationClass, duration);
}

export const feedbackEffects = {
  /**
   * Phaser fire effect
   */
  phaserFire(targetX?: number, targetY?: number): void {
    soundManager.play('phaser');
    
    if (targetX !== undefined && targetY !== undefined) {
      animateGridCell(targetX, targetY, 'phaser-firing', 600);
    }
    
    // Shake the terminal slightly
    addAnimation('.terminal-panel', 'shake', 500);
  },

  /**
   * Torpedo fire effect
   */
  torpedoFire(targetX?: number, targetY?: number): void {
    soundManager.play('torpedo');
    
    if (targetX !== undefined && targetY !== undefined) {
      // Torpedo has a longer animation
      setTimeout(() => {
        animateGridCell(targetX, targetY, 'exploding', 800);
      }, 200);
    }
  },

  /**
   * Explosion effect (Klingon destroyed)
   */
  explosion(x: number, y: number): void {
    soundManager.play('explosion');
    animateGridCell(x, y, 'exploding', 800);
    
    // Shake screen on explosion
    addAnimation('.terminal-panel', 'shake', 500);
  },

  /**
   * Warp drive effect
   */
  warpDrive(): void {
    soundManager.play('warp');
    
    // Pulse the enterprise cell
    const enterpriseCell = document.querySelector('.grid-cell.enterprise');
    if (enterpriseCell) {
      enterpriseCell.classList.add('warp-effect');
      setTimeout(() => {
        enterpriseCell.classList.remove('warp-effect');
      }, 1000);
    }
  },

  /**
   * Shield transfer effect
   */
  shieldTransfer(): void {
    soundManager.play('shield');
    
    // Animate the enterprise cell
    const enterpriseCell = document.querySelector('.grid-cell.enterprise');
    if (enterpriseCell) {
      enterpriseCell.classList.add('shield-effect');
      setTimeout(() => {
        enterpriseCell.classList.remove('shield-effect');
      }, 800);
    }
  },

  /**
   * Damage received effect
   */
  damageReceived(): void {
    soundManager.play('damage');
    
    // Flash the whole terminal red
    addAnimation('.terminal-panel', 'damage-received', 400);
    
    // Shake the screen
    addAnimation('.game-container', 'shake', 500);
  },

  /**
   * Docking effect
   */
  dock(): void {
    soundManager.play('dock');
    
    // Glow effect on enterprise
    const enterpriseCell = document.querySelector('.grid-cell.enterprise');
    if (enterpriseCell) {
      enterpriseCell.classList.add('success-pulse');
      setTimeout(() => {
        enterpriseCell.classList.remove('success-pulse');
      }, 1000);
    }
  },

  /**
   * Victory effect
   */
  victory(): void {
    soundManager.play('victory');
    
    // Glow effect on game-over message
    setTimeout(() => {
      addAnimation('.game-over-message.victory', 'success-pulse', 1000);
    }, 100);
  },

  /**
   * Defeat effect
   */
  defeat(): void {
    soundManager.play('defeat');
  },

  /**
   * Alert/warning sound
   */
  alert(): void {
    soundManager.play('alert', 0.5); // Quieter volume
  },

  /**
   * Low energy warning (visual + sound)
   */
  lowEnergyWarning(): void {
    this.alert();
    
    // Add low-energy class to relevant elements
    const energyStat = document.querySelector('[data-stat="energy"]');
    if (energyStat) {
      energyStat.classList.add('low-energy');
      setTimeout(() => {
        energyStat.classList.remove('low-energy');
      }, 2000);
    }
  }
};

// Export as default for easy importing
export default feedbackEffects;

