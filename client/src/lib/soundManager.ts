/**
 * Sound Manager for Star Trek 1971
 * Handles loading, playing, and managing game sound effects
 */

class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean;
  private volume: number = 0.7;

  constructor() {
    // Load sound preference from localStorage
    const savedPreference = localStorage.getItem('startrek_sound_enabled');
    this.enabled = savedPreference === null ? true : savedPreference === 'true';
  }

  /**
   * Load a sound file and register it with a name
   */
  load(name: string, path: string): void {
    const audio = new Audio(path);
    audio.preload = 'auto';
    audio.volume = this.volume;
    this.sounds.set(name, audio);
  }

  /**
   * Load all game sound effects
   */
  loadAll(): void {
    // Note: Sound files should be placed in /public/sounds/
    // For now, we'll define the paths and handle gracefully if files don't exist
    const soundFiles = [
      { name: 'phaser', path: '/sounds/phaser.mp3' },
      { name: 'torpedo', path: '/sounds/torpedo.mp3' },
      { name: 'explosion', path: '/sounds/explosion.mp3' },
      { name: 'warp', path: '/sounds/warp.mp3' },
      { name: 'shield', path: '/sounds/shield.mp3' },
      { name: 'damage', path: '/sounds/damage.mp3' },
      { name: 'dock', path: '/sounds/dock.mp3' },
      { name: 'victory', path: '/sounds/victory.mp3' },
      { name: 'defeat', path: '/sounds/defeat.mp3' },
      { name: 'alert', path: '/sounds/alert.mp3' },
    ];

    soundFiles.forEach(({ name, path }) => {
      this.load(name, path);
    });
  }

  /**
   * Play a sound by name
   */
  play(name: string, volumeOverride?: number): void {
    if (!this.enabled) return;

    const sound = this.sounds.get(name);
    if (!sound) {
      console.warn(`Sound "${name}" not found`);
      return;
    }

    try {
      // Clone the audio to allow overlapping sounds
      const clone = sound.cloneNode() as HTMLAudioElement;
      clone.volume = volumeOverride !== undefined ? volumeOverride : this.volume;
      
      // Play and clean up when done
      clone.play().catch((error) => {
        // Handle autoplay restrictions gracefully
        if (error.name !== 'NotAllowedError') {
          console.warn(`Error playing sound "${name}":`, error);
        }
      });

      // Remove clone after playing to prevent memory leaks
      clone.addEventListener('ended', () => {
        clone.remove();
      });
    } catch (error) {
      console.warn(`Error playing sound "${name}":`, error);
    }
  }

  /**
   * Toggle sound on/off
   */
  toggle(): boolean {
    this.enabled = !this.enabled;
    localStorage.setItem('startrek_sound_enabled', String(this.enabled));
    return this.enabled;
  }

  /**
   * Set volume (0.0 to 1.0)
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach((sound) => {
      sound.volume = this.volume;
    });
  }

  /**
   * Check if sounds are enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Stop all currently playing sounds
   */
  stopAll(): void {
    this.sounds.forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });
  }
}

// Export singleton instance
export const soundManager = new SoundManager();

// Initialize sounds when module is imported
soundManager.loadAll();

