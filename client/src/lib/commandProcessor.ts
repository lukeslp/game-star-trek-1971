import { GameEngine } from "./gameEngine";
import { EntityType, SectorCoords } from "@/types/game";

export class CommandProcessor {
  private engine: GameEngine;
  private awaitingInput: string | null = null;
  private inputCallback: ((input: string) => void) | null = null;

  constructor(engine: GameEngine) {
    this.engine = engine;
  }

  public processCommand(input: string): void {
    // If awaiting follow-up input
    if (this.awaitingInput && this.inputCallback) {
      const callback = this.inputCallback;
      this.awaitingInput = null;
      this.inputCallback = null;
      callback(input);
      return;
    }

    const command = input.trim().toUpperCase();
    const state = this.engine.getState();

    if (state.gameOver) {
      this.engine.addMessage("Game over. Type NEW to start a new game.");
      return;
    }

    switch (command) {
      case "HELP":
      case "?":
        this.showHelp();
        break;
      case "NAV":
        this.navigation();
        break;
      case "SRS":
        this.shortRangeScan();
        break;
      case "LRS":
        this.longRangeScan();
        break;
      case "PHA":
        this.phasers();
        break;
      case "TOR":
        this.torpedoes();
        break;
      case "SHE":
        this.shields();
        break;
      case "DAM":
        this.damageReport();
        break;
      case "COM":
        this.computer();
        break;
      case "XXX":
      case "QUIT":
        this.quit();
        break;
      default:
        this.engine.addMessage("Unknown command: " + command);
        this.engine.addMessage("Type HELP for a list of commands.");
    }
  }

  private showHelp(): void {
    this.engine.addMessage("");
    this.engine.addMessage("=== AVAILABLE COMMANDS ===");
    this.engine.addMessage("NAV - Navigate using warp engines");
    this.engine.addMessage("SRS - Short range sensor scan");
    this.engine.addMessage("LRS - Long range sensor scan");
    this.engine.addMessage("PHA - Fire phasers");
    this.engine.addMessage("TOR - Fire photon torpedoes");
    this.engine.addMessage("SHE - Shield control");
    this.engine.addMessage("DAM - Damage report");
    this.engine.addMessage("COM - Library computer");
    this.engine.addMessage("XXX - Resign command");
    this.engine.addMessage("");
  }

  private navigation(): void {
    const state = this.engine.getState();
    
    if (state.ship.damage.navigation < 0.5) {
      this.engine.addMessage("Navigation is damaged!", "warning");
      return;
    }

    this.engine.addMessage("Course (1-9, where 1=up-right, 5=down-left): ");
    this.awaitingInput = "nav_course";
    this.inputCallback = (input: string) => {
      const course = parseFloat(input);
      if (isNaN(course) || course < 1 || course > 9) {
        this.engine.addMessage("Invalid course. Must be 1-9.");
        return;
      }

      this.engine.addMessage("Warp factor (0.1-8.0): ");
      this.awaitingInput = "nav_warp";
      this.inputCallback = (warpInput: string) => {
        const warp = parseFloat(warpInput);
        if (isNaN(warp) || warp < 0.1 || warp > 8.0) {
          this.engine.addMessage("Invalid warp factor. Must be 0.1-8.0.");
          return;
        }

        this.executeNavigation(course, warp);
      };
    };
  }

  private executeNavigation(course: number, warp: number): void {
    const state = this.engine.getState();
    const energyCost = Math.floor(warp * 8);

    if (state.ship.energy < energyCost) {
      this.engine.addMessage("Insufficient energy! Need " + energyCost + ", have " + state.ship.energy, "error");
      return;
    }

    // Calculate direction vector
    const angle = ((course - 1) * 45) * (Math.PI / 180);
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);

    // Calculate new position
    const distance = warp;
    let newSx = state.currentSector.sx + Math.round(dx * distance);
    let newSy = state.currentSector.sy + Math.round(dy * distance);
    let newQx = state.currentQuadrant.qx;
    let newQy = state.currentQuadrant.qy;

    // Handle quadrant boundaries
    const quadrantSize = 8;
    while (newSx < 0) {
      newSx += quadrantSize;
      newQx--;
    }
    while (newSx >= quadrantSize) {
      newSx -= quadrantSize;
      newQx++;
    }
    while (newSy < 0) {
      newSy += quadrantSize;
      newQy--;
    }
    while (newSy >= quadrantSize) {
      newSy -= quadrantSize;
      newQy++;
    }

    // Check galaxy boundaries
    if (newQx < 0 || newQx >= 8 || newQy < 0 || newQy >= 8) {
      this.engine.addMessage("You cannot leave the galaxy!", "warning");
      return;
    }

    // Check for collision
    const targetQuadrant = state.galaxy[newQx][newQy];
    const collision = targetQuadrant.entities.find(
      e => e.position.sx === newSx && e.position.sy === newSy && e.type !== EntityType.ENTERPRISE
    );

    if (collision) {
      this.engine.addMessage("Collision detected! Navigation aborted.", "warning");
      return;
    }

    // Move Enterprise
    const oldQuadrant = state.galaxy[state.currentQuadrant.qx][state.currentQuadrant.qy];
    const enterpriseIndex = oldQuadrant.entities.findIndex(e => e.type === EntityType.ENTERPRISE);
    if (enterpriseIndex > -1) {
      oldQuadrant.entities.splice(enterpriseIndex, 1);
    }

    state.currentQuadrant = { qx: newQx, qy: newQy };
    state.currentSector = { sx: newSx, sy: newSy };
    state.ship.energy -= energyCost;

    // Add Enterprise to new quadrant
    const newQuadrantObj = state.galaxy[newQx][newQy];
    if (!newQuadrantObj.scanned) {
      this.engine.populateQuadrant(newQuadrantObj);
      newQuadrantObj.scanned = true;
    }
    
    newQuadrantObj.entities.push({
      type: EntityType.ENTERPRISE,
      position: { sx: newSx, sy: newSy },
    });

    this.engine.addMessage("Warp engines engaged.", "info");
    this.engine.advanceStardate(1);
    this.engine.checkDocked();
    
    if (!state.ship.docked) {
      this.klingonsAttack();
    }
    
    this.shortRangeScan();
  }

  private shortRangeScan(): void {
    const state = this.engine.getState();
    
    if (state.ship.damage.shortRangeSensors < 0.5) {
      this.engine.addMessage("Short range sensors are damaged!", "warning");
      return;
    }

    const quadrant = this.engine.getCurrentQuadrant();
    
    if (!quadrant.scanned) {
      this.engine.populateQuadrant(quadrant);
      quadrant.scanned = true;
    }

    this.engine.addMessage("");
    this.engine.addMessage("=== SHORT RANGE SCAN ===");
    
    // Create 8x8 grid
    const grid: string[][] = Array(8).fill(null).map(() => Array(8).fill("."));
    
    quadrant.entities.forEach(entity => {
      const { sx, sy } = entity.position;
      switch (entity.type) {
        case EntityType.ENTERPRISE:
          grid[sy][sx] = "E";
          break;
        case EntityType.KLINGON:
          grid[sy][sx] = "K";
          break;
        case EntityType.STARBASE:
          grid[sy][sx] = "B";
          break;
        case EntityType.STAR:
          grid[sy][sx] = "*";
          break;
      }
    });

    // Display grid
    for (let y = 0; y < 8; y++) {
      this.engine.addMessage(grid[y].join(" "));
    }
    
    this.engine.addMessage("");
    this.engine.addMessage("Quadrant: " + (quadrant.coords.qx + 1) + "," + (quadrant.coords.qy + 1));
    this.engine.addMessage("Sector: " + (state.currentSector.sx + 1) + "," + (state.currentSector.sy + 1));
    this.engine.addMessage("Condition: " + (state.ship.docked ? "DOCKED" : quadrant.klingons > 0 ? "RED" : "GREEN"));
    this.engine.addMessage("");
  }

  private longRangeScan(): void {
    const state = this.engine.getState();
    
    if (state.ship.damage.longRangeSensors < 0.5) {
      this.engine.addMessage("Long range sensors are damaged!", "warning");
      return;
    }

    this.engine.addMessage("");
    this.engine.addMessage("=== LONG RANGE SCAN ===");
    
    const { qx, qy } = state.currentQuadrant;
    
    for (let dy = -1; dy <= 1; dy++) {
      let line = "";
      for (let dx = -1; dx <= 1; dx++) {
        const scanQx = qx + dx;
        const scanQy = qy + dy;
        
        if (scanQx < 0 || scanQx >= 8 || scanQy < 0 || scanQy >= 8) {
          line += " *** ";
        } else {
          const q = state.galaxy[scanQx][scanQy];
          const code = "" + q.klingons + q.starbases + q.stars;
          line += " " + code.padStart(3, "0") + " ";
        }
      }
      this.engine.addMessage(line);
    }
    
    this.engine.addMessage("");
    this.engine.addMessage("Format: KBS (Klingons, Bases, Stars)");
    this.engine.addMessage("");
  }

  private phasers(): void {
    const state = this.engine.getState();
    
    if (state.ship.damage.phasers < 0.5) {
      this.engine.addMessage("Phasers are damaged!", "warning");
      return;
    }

    const quadrant = this.engine.getCurrentQuadrant();
    const klingons = quadrant.entities.filter(e => e.type === EntityType.KLINGON);
    
    if (klingons.length === 0) {
      this.engine.addMessage("No enemies in this quadrant.");
      return;
    }

    this.engine.addMessage("Energy available: " + state.ship.energy);
    this.engine.addMessage("Phaser energy (0-" + state.ship.energy + "): ");
    
    this.awaitingInput = "phaser_energy";
    this.inputCallback = (input: string) => {
      const energy = parseInt(input);
      if (isNaN(energy) || energy < 0 || energy > state.ship.energy) {
        this.engine.addMessage("Invalid energy amount.");
        return;
      }

      this.executePhasers(energy);
    };
  }

  private executePhasers(energy: number): void {
    const state = this.engine.getState();
    const quadrant = this.engine.getCurrentQuadrant();
    const klingons = quadrant.entities.filter(e => e.type === EntityType.KLINGON);

    if (klingons.length === 0) return;

    state.ship.energy -= energy;
    const energyPerKlingon = energy / klingons.length;

    this.engine.addMessage("");
    this.engine.addMessage("Phasers fired!", "info");
    
    klingons.forEach(klingon => {
      const dx = klingon.position.sx - state.currentSector.sx;
      const dy = klingon.position.sy - state.currentSector.sy;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const damage = Math.floor(energyPerKlingon / (distance + 1));

      if (klingon.energy) {
        klingon.energy -= damage;
        this.engine.addMessage("Hit Klingon at " + (klingon.position.sx + 1) + "," + (klingon.position.sy + 1) + " for " + damage + " damage", "warning");

        if (klingon.energy <= 0) {
          this.engine.addMessage("*** KLINGON DESTROYED ***", "success");
          this.engine.removeEntity(klingon);
          quadrant.klingons--;
          state.klingonsRemaining--;
        }
      }
    });

    this.engine.addMessage("");
    this.engine.advanceStardate(1);
    this.klingonsAttack();
    this.engine.checkVictory();
  }

  private torpedoes(): void {
    const state = this.engine.getState();
    
    if (state.ship.damage.torpedoes < 0.5) {
      this.engine.addMessage("Torpedo tubes are damaged!", "warning");
      return;
    }

    if (state.ship.torpedoes <= 0) {
      this.engine.addMessage("No torpedoes remaining!", "error");
      return;
    }

    this.engine.addMessage("Torpedoes remaining: " + state.ship.torpedoes);
    this.engine.addMessage("Course (1-9): ");
    
    this.awaitingInput = "torpedo_course";
    this.inputCallback = (input: string) => {
      const course = parseFloat(input);
      if (isNaN(course) || course < 1 || course > 9) {
        this.engine.addMessage("Invalid course.");
        return;
      }

      this.executeTorpedo(course);
    };
  }

  private executeTorpedo(course: number): void {
    const state = this.engine.getState();
    const quadrant = this.engine.getCurrentQuadrant();

    state.ship.torpedoes--;
    
    // Calculate trajectory
    const angle = ((course - 1) * 45) * (Math.PI / 180);
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);

    let x = state.currentSector.sx + 0.5;
    let y = state.currentSector.sy + 0.5;

    this.engine.addMessage("");
    this.engine.addMessage("Torpedo track:");

    for (let i = 0; i < 12; i++) {
      x += dx;
      y += dy;

      const sx = Math.floor(x);
      const sy = Math.floor(y);

      if (sx < 0 || sx >= 8 || sy < 0 || sy >= 8) {
        this.engine.addMessage("Torpedo missed - left quadrant");
        break;
      }

      const target = this.engine.getEntity({ sx, sy });

      if (target) {
        if (target.type === EntityType.KLINGON) {
          this.engine.addMessage("*** KLINGON DESTROYED ***", "success");
          this.engine.removeEntity(target);
          quadrant.klingons--;
          state.klingonsRemaining--;
          break;
        } else if (target.type === EntityType.STAR) {
          this.engine.addMessage("Torpedo absorbed by star", "warning");
          break;
        } else if (target.type === EntityType.STARBASE) {
          this.engine.addMessage("*** STARBASE DESTROYED ***", "error");
          this.engine.addMessage("You have destroyed a Federation starbase!", "error");
          this.engine.removeEntity(target);
          quadrant.starbases--;
          break;
        }
      }
    }

    this.engine.addMessage("");
    this.engine.advanceStardate(1);
    this.klingonsAttack();
    this.engine.checkVictory();
  }

  private shields(): void {
    const state = this.engine.getState();
    
    if (state.ship.damage.shields < 0.5) {
      this.engine.addMessage("Shield control is damaged!", "warning");
      return;
    }

    if (state.ship.docked) {
      this.engine.addMessage("Shields cannot be raised while docked.");
      return;
    }

    this.engine.addMessage("Shields: " + (state.ship.shieldsUp ? "UP" : "DOWN"));
    this.engine.addMessage("Shield energy: " + state.ship.shields);
    this.engine.addMessage("Available energy: " + state.ship.energy);
    this.engine.addMessage("Transfer energy to shields (negative to transfer from shields): ");
    
    this.awaitingInput = "shield_energy";
    this.inputCallback = (input: string) => {
      const amount = parseInt(input);
      if (isNaN(amount)) {
        this.engine.addMessage("Invalid amount.");
        return;
      }

      if (amount > 0 && amount > state.ship.energy) {
        this.engine.addMessage("Insufficient energy!", "error");
        return;
      }

      if (amount < 0 && Math.abs(amount) > state.ship.shields) {
        this.engine.addMessage("Insufficient shield energy!", "error");
        return;
      }

      state.ship.energy -= amount;
      state.ship.shields += amount;
      state.ship.shieldsUp = state.ship.shields > 0;

      this.engine.addMessage("Shield energy now: " + state.ship.shields, "info");
      this.engine.addMessage("Ship energy now: " + state.ship.energy, "info");
    };
  }

  private damageReport(): void {
    const state = this.engine.getState();
    
    this.engine.addMessage("");
    this.engine.addMessage("=== DAMAGE REPORT ===");
    this.engine.addMessage("Navigation:         " + this.formatDamage(state.ship.damage.navigation));
    this.engine.addMessage("Short Range Sensors: " + this.formatDamage(state.ship.damage.shortRangeSensors));
    this.engine.addMessage("Long Range Sensors:  " + this.formatDamage(state.ship.damage.longRangeSensors));
    this.engine.addMessage("Phasers:            " + this.formatDamage(state.ship.damage.phasers));
    this.engine.addMessage("Torpedoes:          " + this.formatDamage(state.ship.damage.torpedoes));
    this.engine.addMessage("Shields:            " + this.formatDamage(state.ship.damage.shields));
    this.engine.addMessage("Computer:           " + this.formatDamage(state.ship.damage.computer));
    this.engine.addMessage("");
  }

  private formatDamage(value: number): string {
    if (value >= 1) return "OPERATIONAL";
    if (value >= 0.5) return "DAMAGED (" + Math.floor(value * 100) + "%)";
    return "OFFLINE";
  }

  private computer(): void {
    const state = this.engine.getState();
    
    if (state.ship.damage.computer < 0.5) {
      this.engine.addMessage("Computer is damaged!", "warning");
      return;
    }

    this.engine.addMessage("");
    this.engine.addMessage("=== LIBRARY COMPUTER ===");
    this.engine.addMessage("1 - Galactic record");
    this.engine.addMessage("2 - Status report");
    this.engine.addMessage("Select function: ");
    
    this.awaitingInput = "computer_function";
    this.inputCallback = (input: string) => {
      const func = parseInt(input);
      
      if (func === 1) {
        this.galacticRecord();
      } else if (func === 2) {
        this.statusReport();
      } else {
        this.engine.addMessage("Invalid function.");
      }
    };
  }

  private galacticRecord(): void {
    const state = this.engine.getState();
    
    this.engine.addMessage("");
    this.engine.addMessage("=== GALACTIC RECORD ===");
    
    for (let qy = 0; qy < 8; qy++) {
      let line = "";
      for (let qx = 0; qx < 8; qx++) {
        const q = state.galaxy[qx][qy];
        const code = "" + q.klingons + q.starbases + q.stars;
        line += " " + code.padStart(3, "0") + " ";
      }
      this.engine.addMessage(line);
    }
    
    this.engine.addMessage("");
  }

  private statusReport(): void {
    const state = this.engine.getState();
    
    this.engine.addMessage("");
    this.engine.addMessage("=== STATUS REPORT ===");
    this.engine.addMessage("Stardate:           " + state.stardate.toFixed(1));
    this.engine.addMessage("Time remaining:     " + state.stardatesRemaining.toFixed(1) + " stardates");
    this.engine.addMessage("Klingons remaining: " + state.klingonsRemaining);
    this.engine.addMessage("Starbases:          " + this.countStarbases());
    this.engine.addMessage("Energy:             " + state.ship.energy);
    this.engine.addMessage("Shields:            " + state.ship.shields);
    this.engine.addMessage("Torpedoes:          " + state.ship.torpedoes);
    this.engine.addMessage("");
  }

  private countStarbases(): number {
    const state = this.engine.getState();
    let count = 0;
    
    for (let qx = 0; qx < 8; qx++) {
      for (let qy = 0; qy < 8; qy++) {
        count += state.galaxy[qx][qy].starbases;
      }
    }
    
    return count;
  }

  private quit(): void {
    this.engine.addMessage("");
    this.engine.addMessage("You have resigned your command.");
    this.engine.addMessage("The Federation will find a new captain.");
    this.engine.getState().gameOver = true;
  }

  private klingonsAttack(): void {
    const state = this.engine.getState();
    const quadrant = this.engine.getCurrentQuadrant();
    const klingons = quadrant.entities.filter(e => e.type === EntityType.KLINGON);

    if (klingons.length === 0) return;

    this.engine.addMessage("");
    this.engine.addMessage("Klingons attack!", "error");

    klingons.forEach(klingon => {
      if (!klingon.energy) return;

      const dx = klingon.position.sx - state.currentSector.sx;
      const dy = klingon.position.sy - state.currentSector.sy;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const damage = Math.floor(klingon.energy / (distance + 1) * 0.3);

      if (state.ship.shieldsUp && state.ship.shields > 0) {
        state.ship.shields -= damage;
        this.engine.addMessage("Shields hit for " + damage + " damage. Shields now at " + Math.max(0, state.ship.shields), "warning");

        if (state.ship.shields <= 0) {
          state.ship.shields = 0;
          state.ship.shieldsUp = false;
          this.engine.addMessage("*** SHIELDS DOWN ***", "error");
        }
      } else {
        state.ship.energy -= damage;
        this.engine.addMessage("Hull hit for " + damage + " damage!", "error");

        // Random system damage
        if (Math.random() < 0.3) {
          const systems = Object.keys(state.ship.damage) as (keyof typeof state.ship.damage)[];
          const system = systems[Math.floor(Math.random() * systems.length)];
          state.ship.damage[system] = Math.max(0, state.ship.damage[system] - 0.2);
          this.engine.addMessage(system + " damaged!", "error");
        }
      }
    });

    this.engine.addMessage("");
    this.engine.checkDefeat();
  }

  public isAwaitingInput(): boolean {
    return this.awaitingInput !== null;
  }

  public getAwaitingInputType(): string | null {
    return this.awaitingInput;
  }
}
