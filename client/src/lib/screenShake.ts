/**
 * Screen Shake Effects for Star Trek 1971
 * Provides visual feedback for combat and damage events
 */

type ShakeIntensity = 'light' | 'medium' | 'heavy' | 'critical';

interface ShakeConfig {
  duration: number;      // milliseconds
  intensity: number;     // pixels of movement
  frequency: number;     // shake cycles per animation frame
}

const SHAKE_CONFIGS: Record<ShakeIntensity, ShakeConfig> = {
  light: { duration: 150, intensity: 2, frequency: 2 },
  medium: { duration: 250, intensity: 4, frequency: 3 },
  heavy: { duration: 400, intensity: 8, frequency: 4 },
  critical: { duration: 600, intensity: 12, frequency: 5 },
};

class ScreenShakeEngine {
  private isShaking = false;
  private enabled = true;

  /**
   * Enable or disable screen shake effects
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled && this.isShaking) {
      this.stopShake();
    }
  }

  /**
   * Check if screen shake is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Trigger a screen shake effect
   * @param intensity - The intensity of the shake effect
   */
  shake(intensity: ShakeIntensity = 'medium'): void {
    if (!this.enabled || this.isShaking) return;

    const config = SHAKE_CONFIGS[intensity];
    this.applyShake(config);
  }

  /**
   * Quick shake for phaser fire or small impacts
   */
  shakePhaserFire(): void {
    this.shake('light');
  }

  /**
   * Medium shake for torpedo impacts
   */
  shakeTorpedoImpact(): void {
    this.shake('medium');
  }

  /**
   * Heavy shake for taking damage
   */
  shakeDamage(): void {
    this.shake('heavy');
  }

  /**
   * Critical shake for major damage or system failures
   */
  shakeCritical(): void {
    this.shake('critical');
  }

  /**
   * Shake when Klingons attack
   */
  shakeKlingonAttack(damageAmount: number): void {
    if (damageAmount > 100) {
      this.shake('critical');
    } else if (damageAmount > 50) {
      this.shake('heavy');
    } else if (damageAmount > 20) {
      this.shake('medium');
    } else {
      this.shake('light');
    }
  }

  private applyShake(config: ShakeConfig): void {
    const gameContainer = document.querySelector('[data-game-container]') as HTMLElement;
    if (!gameContainer) return;

    this.isShaking = true;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;

      if (elapsed >= config.duration) {
        this.stopShake();
        return;
      }

      // Decay the intensity over time
      const progress = elapsed / config.duration;
      const decay = 1 - progress;
      const currentIntensity = config.intensity * decay;

      // Generate random offset
      const offsetX = (Math.random() - 0.5) * 2 * currentIntensity;
      const offsetY = (Math.random() - 0.5) * 2 * currentIntensity;

      gameContainer.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

      requestAnimationFrame(animate);
    };

    animate();
  }

  private stopShake(): void {
    this.isShaking = false;
    const gameContainer = document.querySelector('[data-game-container]') as HTMLElement;
    if (gameContainer) {
      gameContainer.style.transform = '';
    }
  }
}

// Export singleton instance
export const screenShake = new ScreenShakeEngine();
