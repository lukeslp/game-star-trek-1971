import {
  DEFAULT_CONFIG,
  EntityType,
  GameConfig,
  GameState,
  Quadrant,
  QuadrantCoords,
  SectorCoords,
  Entity,
  MessageType,
} from "@/types/game";

export class GameEngine {
  private state: GameState;
  private config: GameConfig;

  constructor(config: GameConfig = DEFAULT_CONFIG) {
    this.config = config;
    this.state = this.initializeGame();
  }

  private initializeGame(): GameState {
    const galaxy = this.generateGalaxy();
    const startQuadrant = this.findSafeStartingQuadrant(galaxy);
    const startSector = this.findEmptySector(galaxy[startQuadrant.qx][startQuadrant.qy]);

    // Place Enterprise in starting sector
    galaxy[startQuadrant.qx][startQuadrant.qy].entities.push({
      type: EntityType.ENTERPRISE,
      position: startSector,
    });

    return {
      galaxy,
      currentQuadrant: startQuadrant,
      currentSector: startSector,
      ship: {
        energy: this.config.initialEnergy,
        maxEnergy: this.config.initialEnergy,
        shields: 0,
        torpedoes: this.config.initialTorpedoes,
        maxTorpedoes: this.config.initialTorpedoes,
        shieldsUp: false,
        damage: {
          navigation: 1,
          shortRangeSensors: 1,
          longRangeSensors: 1,
          phasers: 1,
          torpedoes: 1,
          shields: 1,
          computer: 1,
        },
        docked: false,
      },
      klingonsRemaining: this.config.initialKlingons,
      initialKlingons: this.config.initialKlingons,
      stardate: this.config.initialStardate,
      initialStardate: this.config.initialStardate,
      stardatesRemaining: this.config.initialStardates,
      gameOver: false,
      victory: false,
      messages: [
        { text: "=== STAR TREK ===", type: "info" },
        { text: "", type: "normal" },
        { text: "Stardate " + this.config.initialStardate, type: "normal" },
        { text: "", type: "normal" },
        { text: "Your orders are as follows:", type: "normal" },
        { text: "  Destroy the " + this.config.initialKlingons + " Klingon warships which have invaded", type: "warning" },
        { text: "  the galaxy before they can attack Federation Headquarters", type: "warning" },
        { text: "  on stardate " + (this.config.initialStardate + this.config.initialStardates) + ".", type: "warning" },
        { text: "  This gives you " + this.config.initialStardates + " days.", type: "normal" },
        { text: "", type: "normal" },
        { text: "There are " + this.config.initialStarbases + " starbases in the galaxy for resupply.", type: "info" },
        { text: "", type: "normal" },
        { text: "Type HELP for a list of commands.", type: "info" },
        { text: "", type: "normal" },
      ],
    };
  }

  private generateGalaxy(): Quadrant[][] {
    const size = this.config.galaxySize;
    const galaxy: Quadrant[][] = [];

    // Initialize empty galaxy
    for (let qx = 0; qx < size; qx++) {
      galaxy[qx] = [];
      for (let qy = 0; qy < size; qy++) {
        galaxy[qx][qy] = {
          coords: { qx, qy },
          klingons: 0,
          starbases: 0,
          stars: 0,
          scanned: false,
          entities: [],
        };
      }
    }

    // Distribute Klingons
    let klingonsLeft = this.config.initialKlingons;
    while (klingonsLeft > 0) {
      const qx = Math.floor(Math.random() * size);
      const qy = Math.floor(Math.random() * size);
      const numKlingons = Math.min(1 + Math.floor(Math.random() * 3), klingonsLeft);
      
      if (galaxy[qx][qy].klingons === 0) {
        galaxy[qx][qy].klingons = numKlingons;
        klingonsLeft -= numKlingons;
      }
    }

    // Distribute Starbases
    let starbasesLeft = this.config.initialStarbases;
    while (starbasesLeft > 0) {
      const qx = Math.floor(Math.random() * size);
      const qy = Math.floor(Math.random() * size);
      
      if (galaxy[qx][qy].starbases === 0) {
        galaxy[qx][qy].starbases = 1;
        starbasesLeft--;
      }
    }

    // Distribute Stars (1-8 per quadrant)
    for (let qx = 0; qx < size; qx++) {
      for (let qy = 0; qy < size; qy++) {
        galaxy[qx][qy].stars = 1 + Math.floor(Math.random() * 8);
      }
    }

    return galaxy;
  }

  private findSafeStartingQuadrant(galaxy: Quadrant[][]): QuadrantCoords {
    const size = this.config.galaxySize;
    
    // Try to find a quadrant with no Klingons
    for (let attempt = 0; attempt < 100; attempt++) {
      const qx = Math.floor(Math.random() * size);
      const qy = Math.floor(Math.random() * size);
      
      if (galaxy[qx][qy].klingons === 0) {
        return { qx, qy };
      }
    }
    
    // Fallback: any quadrant
    return {
      qx: Math.floor(Math.random() * size),
      qy: Math.floor(Math.random() * size),
    };
  }

  private findEmptySector(quadrant: Quadrant): SectorCoords {
    const size = this.config.quadrantSize;
    
    for (let attempt = 0; attempt < 100; attempt++) {
      const sx = Math.floor(Math.random() * size);
      const sy = Math.floor(Math.random() * size);
      
      const occupied = quadrant.entities.some(
        e => e.position.sx === sx && e.position.sy === sy
      );
      
      if (!occupied) {
        return { sx, sy };
      }
    }
    
    // Fallback
    return { sx: 0, sy: 0 };
  }

  public populateQuadrant(quadrant: Quadrant): void {
    // Clear existing entities except Enterprise
    const enterprise = quadrant.entities.find(e => e.type === EntityType.ENTERPRISE);
    quadrant.entities = enterprise ? [enterprise] : [];

    // Place Klingons
    for (let i = 0; i < quadrant.klingons; i++) {
      const position = this.findEmptySector(quadrant);
      quadrant.entities.push({
        type: EntityType.KLINGON,
        position,
        energy: 200 + Math.floor(Math.random() * 100), // 200-300 energy
      });
    }

    // Place Starbases
    for (let i = 0; i < quadrant.starbases; i++) {
      const position = this.findEmptySector(quadrant);
      quadrant.entities.push({
        type: EntityType.STARBASE,
        position,
      });
    }

    // Place Stars
    for (let i = 0; i < quadrant.stars; i++) {
      const position = this.findEmptySector(quadrant);
      quadrant.entities.push({
        type: EntityType.STAR,
        position,
      });
    }
  }

  public getState(): GameState {
    return this.state;
  }

  public addMessage(message: string, type: MessageType = 'normal'): void {
    this.state.messages.push({ text: message, type });
  }

  public advanceStardate(amount: number): void {
    this.state.stardate += amount;
    this.state.stardatesRemaining -= amount;
    
    // Passive repair
    this.repairSystems(amount * 0.1);
    
    if (this.state.stardatesRemaining <= 0 && this.state.klingonsRemaining > 0) {
      this.state.gameOver = true;
      this.addMessage("");
      this.addMessage("*** TIME'S UP! ***", "error");
      this.addMessage("The Federation has been conquered by the Klingons.", "error");
      this.addMessage("You destroyed " + (this.state.initialKlingons - this.state.klingonsRemaining) + " of " + this.state.initialKlingons + " Klingons.");
    }
  }

  private repairSystems(amount: number): void {
    const systems = this.state.ship.damage;
    const keys = Object.keys(systems) as (keyof typeof systems)[];
    
    keys.forEach(key => {
      if (systems[key] < 1) {
        systems[key] = Math.min(1, systems[key] + amount);
      }
    });
  }

  public checkDocked(): void {
    const quadrant = this.state.galaxy[this.state.currentQuadrant.qx][this.state.currentQuadrant.qy];
    const { sx, sy } = this.state.currentSector;
    
    // Check if adjacent to starbase
    const starbase = quadrant.entities.find(e => {
      if (e.type !== EntityType.STARBASE) return false;
      const dx = Math.abs(e.position.sx - sx);
      const dy = Math.abs(e.position.sy - sy);
      return dx <= 1 && dy <= 1 && (dx + dy) > 0;
    });
    
    this.state.ship.docked = !!starbase;
    
    if (this.state.ship.docked && !this.state.gameOver) {
      this.addMessage("Docked at starbase. Shields dropped.", "success");
      this.state.ship.shieldsUp = false;
      this.refuelAtStarbase();
    }
  }

  private refuelAtStarbase(): void {
    const energyGained = this.state.ship.maxEnergy - this.state.ship.energy;
    const torpedoesGained = this.state.ship.maxTorpedoes - this.state.ship.torpedoes;
    
    this.state.ship.energy = this.state.ship.maxEnergy;
    this.state.ship.torpedoes = this.state.ship.maxTorpedoes;
    
    // Rapid repair at starbase
    const systems = this.state.ship.damage;
    const keys = Object.keys(systems) as (keyof typeof systems)[];
    keys.forEach(key => {
      systems[key] = 1;
    });
    
    if (energyGained > 0 || torpedoesGained > 0) {
      this.addMessage("Energy and torpedoes replenished. All systems repaired.", "success");
    }
  }

  public checkVictory(): void {
    if (this.state.klingonsRemaining <= 0) {
      this.state.gameOver = true;
      this.state.victory = true;
      this.addMessage("");
      this.addMessage("*** CONGRATULATIONS! ***", "success");
      this.addMessage("The last Klingon battle cruiser has been destroyed.", "success");
      this.addMessage("The Federation has been saved!", "success");
      this.addMessage("");
      this.addMessage("Your efficiency rating: " + this.calculateRating(), "info");
    }
  }

  private calculateRating(): string {
    const klingonsDestroyed = this.state.initialKlingons - this.state.klingonsRemaining;
    const timeUsed = this.state.stardate - this.state.initialStardate;
    const efficiency = klingonsDestroyed / Math.max(timeUsed, 1);
    
    if (efficiency > 1) return "EXCELLENT";
    if (efficiency > 0.5) return "GOOD";
    if (efficiency > 0.25) return "FAIR";
    return "POOR";
  }

  public checkDefeat(): void {
    if (this.state.ship.energy <= 0) {
      this.state.gameOver = true;
      this.addMessage("");
      this.addMessage("*** ENTERPRISE DESTROYED ***", "error");
      this.addMessage("You have been defeated by the Klingons.", "error");
    }
  }

  public getCurrentQuadrant(): Quadrant {
    return this.state.galaxy[this.state.currentQuadrant.qx][this.state.currentQuadrant.qy];
  }

  public getEntity(position: SectorCoords): Entity | undefined {
    const quadrant = this.getCurrentQuadrant();
    return quadrant.entities.find(
      e => e.position.sx === position.sx && e.position.sy === position.sy
    );
  }

  public removeEntity(entity: Entity): void {
    const quadrant = this.getCurrentQuadrant();
    const index = quadrant.entities.indexOf(entity);
    if (index > -1) {
      quadrant.entities.splice(index, 1);
    }
  }
}
