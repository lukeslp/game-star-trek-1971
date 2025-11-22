import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GameEngine } from "@/lib/gameEngine";
import { CommandProcessor } from "@/lib/commandProcessor";
import { EntityType } from "@/types/game";
import { useTour } from "@/hooks/useTour";
import { HelpCircle, Trophy } from "lucide-react";
import ScoreBreakdown from "@/components/ScoreBreakdown";
import ArcadeNameEntry from "@/components/ArcadeNameEntry";
import LeaderboardDialog from "@/components/LeaderboardDialog";
import {
  calculateScore,
  isHighScore,
  saveHighScore,
  getLastPlayerName,
  setLastPlayerName,
  type GameScore,
} from "@/lib/gameScoring";

const BUTTON_STYLES = {
  primary: "bg-primary/10 border-primary/50 text-primary hover:bg-primary/30 hover:border-primary font-mono text-xl py-4",
  destructive: "bg-destructive/10 border-destructive/50 text-destructive hover:bg-destructive/30 hover:border-destructive font-mono text-xl py-4",
  secondary: "bg-secondary/10 border-secondary/50 text-secondary hover:bg-secondary/30 hover:border-secondary font-mono text-xl py-4",
  accent: "bg-accent/10 border-accent/50 text-accent hover:bg-accent/30 hover:border-accent font-mono text-xl py-4",
  muted: "bg-muted/30 border-muted-foreground/50 text-muted-foreground hover:bg-muted/50 hover:border-muted-foreground font-mono text-xl py-4",
  new: "bg-secondary/20 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-mono text-xl py-4",
} as const;

export default function Game() {
  const [engine] = useState(() => new GameEngine());
  const [processor] = useState(() => new CommandProcessor(engine));
  const [, forceUpdate] = useState({});
  const [command, setCommand] = useState("");
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [gameScore, setGameScore] = useState<GameScore | null>(null);
  const [showNameEntry, setShowNameEntry] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  const consoleRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { hasSeenTour, startTour} = useTour();

  const state = engine.getState();
  const currentQuadrant = engine.getCurrentQuadrant();

  useEffect(() => {
    // Populate starting quadrant
    if (!currentQuadrant.scanned) {
      engine.populateQuadrant(currentQuadrant);
      currentQuadrant.scanned = true;
      forceUpdate({});
    }

    // Auto-start tour for new users after a short delay
    if (!hasSeenTour) {
      const tourTimer = setTimeout(() => {
        startTour();
      }, 500);
      return () => clearTimeout(tourTimer);
    }
  }, [hasSeenTour, startTour]);

  useEffect(() => {
    // Auto-scroll console to bottom
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [state.messages.length]);

  useEffect(() => {
    // Keep input focused
    inputRef.current?.focus();
  }, [state.messages.length]);

  useEffect(() => {
    // Calculate score when game ends
    if (state.gameOver && !gameScore) {
      const score = calculateScore(state);
      setGameScore(score);

      // Check if it's a high score (only for victories)
      if (state.victory && isHighScore(score.total)) {
        setShowNameEntry(true);
      }
    }
  }, [state.gameOver, gameScore, state]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    engine.addMessage("> " + command);
    processor.processCommand(command);
    setCommand("");
    forceUpdate({});
  };

  const handleCommandClick = (cmd: string) => {
    if (state.gameOver || processor.isAwaitingInput()) return;
    
    engine.addMessage("> " + cmd);
    processor.processCommand(cmd);
    setCommand("");
    forceUpdate({});
  };

  const handleNameSubmit = (name: string) => {
    if (gameScore) {
      saveHighScore(name, gameScore);
      setLastPlayerName(name);
      setShowNameEntry(false);
      setScoreSaved(true);
    }
  };

  const handleNewGame = () => {
    window.location.reload();
  };

  // Create sector grid
  const sectorGrid: string[][] = Array(8)
    .fill(null)
    .map(() => Array(8).fill("."));
  currentQuadrant.entities.forEach(entity => {
    const { sx, sy } = entity.position;
    switch (entity.type) {
      case EntityType.ENTERPRISE:
        sectorGrid[sy][sx] = "E";
        break;
      case EntityType.KLINGON:
        sectorGrid[sy][sx] = "K";
        break;
      case EntityType.STARBASE:
        sectorGrid[sy][sx] = "B";
        break;
      case EntityType.STAR:
        sectorGrid[sy][sx] = "*";
        break;
    }
  });

  // Create galaxy map
  const galaxyMap: string[][] = Array(8)
    .fill(null)
    .map(() => Array(8).fill(""));
  for (let qx = 0; qx < 8; qx++) {
    for (let qy = 0; qy < 8; qy++) {
      const q = state.galaxy[qx][qy];
      const isCurrentQuadrant = qx === state.currentQuadrant.qx && qy === state.currentQuadrant.qy;
      galaxyMap[qy][qx] = isCurrentQuadrant ? "◆" : (q.klingons > 0 ? "!" : "·");
    }
  }

  const getCondition = () => {
    if (state.ship.docked) return { text: "DOCKED", color: "text-secondary" };
    if (currentQuadrant.klingons > 0) return { text: "RED", color: "text-destructive" };
    return { text: "GREEN", color: "text-primary" };
  };

  const condition = getCondition();

  const getEnergyColor = () => {
    const percent = (state.ship.energy / state.ship.maxEnergy) * 100;
    if (percent < 20) return "text-destructive";
    if (percent < 50) return "text-accent";
    return "text-primary";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground p-4">
      {/* Header */}
      <header className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1" />
          <h1 className="text-3xl font-bold text-primary whitespace-nowrap" style={{ textShadow: "0 0 10px currentColor" }}>
            ★ STAR TREK ★
          </h1>
          <div className="flex-1 flex items-center justify-end gap-2">
            <Button
              onClick={startTour}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary"
              title="Take the tour"
            >
              <HelpCircle className="w-6 h-6" />
            </Button>
            <Button
              onClick={() => setShowLeaderboard(true)}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary"
              title="View leaderboard"
            >
              <Trophy className="w-6 h-6" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground text-center">Classic Text Game Remake - 1971</p>
      </header>

      {/* Status Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-4" data-tour="status-bar">
        <div className="status-panel">
          <div className="status-item">
            <span className="status-label">Stardate</span>
            <span className="status-value">{state.stardate.toFixed(1)}</span>
          </div>
        </div>
        <div className="status-panel">
          <div className="status-item">
            <span className="status-label">Time Left</span>
            <span className={`status-value ${state.stardatesRemaining < 5 ? 'text-destructive' : ''}`}>
              {state.stardatesRemaining.toFixed(1)}
            </span>
          </div>
        </div>
        <div className="status-panel">
          <div className="status-item">
            <span className="status-label">Condition</span>
            <span className={`status-value ${condition.color}`}>{condition.text}</span>
          </div>
        </div>
        <div className="status-panel">
          <div className="status-item">
            <span className="status-label">Energy</span>
            <span className={`status-value ${getEnergyColor()}`}>{state.ship.energy}</span>
          </div>
        </div>
        <div className="status-panel">
          <div className="status-item">
            <span className="status-label">Shields</span>
            <span className="status-value">{state.ship.shields}</span>
          </div>
        </div>
        <div className="status-panel">
          <div className="status-item">
            <span className="status-label">Torpedoes</span>
            <span className="status-value">{state.ship.torpedoes}</span>
          </div>
        </div>
        <div className="status-panel">
          <div className="status-item">
            <span className="status-label">Klingons</span>
            <span className={`status-value ${state.klingonsRemaining > 0 ? 'text-destructive' : 'text-primary'}`}>
              {state.klingonsRemaining}
            </span>
          </div>
        </div>
      </div>

      {/* Galaxy and Sector Maps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Galaxy Map */}
        <div className="status-panel" data-tour="galaxy-map">
          <h2 className="text-sm font-bold text-primary mb-2 uppercase tracking-wider">Galaxy Map</h2>
          <div className="game-grid">
            {galaxyMap.map((row, y) => (
              row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`game-cell ${
                    x === state.currentQuadrant.qx && y === state.currentQuadrant.qy
                      ? 'bg-primary/30 text-primary font-bold'
                      : 'text-muted-foreground'
                  }`}
                >
                  {cell}
                </div>
              ))
            ))}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            <p>◆ = Your Position</p>
            <p>! = Klingons Present</p>
            <p>· = Explored</p>
          </div>
        </div>

        {/* Sector Map */}
        <div className="status-panel" data-tour="sector-scan">
          <h2 className="text-sm font-bold text-primary mb-2 uppercase tracking-wider">
            Sector Scan - Q{state.currentQuadrant.qx + 1},{state.currentQuadrant.qy + 1}
          </h2>
          <div className="game-grid">
            {sectorGrid.map((row, y) => (
              row.map((cell, x) => {
                let cellClass = "game-cell";
                if (cell === "E") cellClass += " bg-primary/30 text-primary font-bold";
                else if (cell === "K") cellClass += " bg-destructive/30 text-destructive font-bold";
                else if (cell === "B") cellClass += " bg-secondary/30 text-secondary font-bold";
                else if (cell === "*") cellClass += " bg-accent/30 text-accent";

                return (
                  <div key={`${x}-${y}`} className={cellClass}>
                    {cell}
                  </div>
                );
              })
            ))}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            <p>E = Enterprise | K = Klingon</p>
            <p>B = Starbase | * = Star</p>
          </div>
        </div>
      </div>

      {/* Console and Command Panel Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4 flex-1">
        {/* Console - takes 2/3 width */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="status-panel flex-1 flex flex-col" data-tour="console">
            <h2 className="text-sm font-bold text-primary mb-2 uppercase tracking-wider">Console</h2>
            <div
              ref={consoleRef}
              className="console-output flex-1 min-h-[300px] max-h-[500px]"
            >
              {state.messages.map((msg, i) => (
                <div key={i} className="leading-relaxed">
                  {msg}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Command Panel - takes 1/3 width */}
        <div className="flex flex-col gap-4">
          <div className="status-panel" data-tour="command-panel">
            <h2 className="text-lg font-bold text-primary mb-3 uppercase tracking-wider">Commands</h2>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => { setCommand("NAV"); handleCommandClick("NAV"); }}
                variant="outline"
                className={BUTTON_STYLES.primary}
                disabled={state.gameOver || processor.isAwaitingInput()}
              >
                NAV
              </Button>
              <Button
                onClick={() => { setCommand("SRS"); handleCommandClick("SRS"); }}
                variant="outline"
                className={BUTTON_STYLES.primary}
                disabled={state.gameOver || processor.isAwaitingInput()}
              >
                SRS
              </Button>
              <Button
                onClick={() => { setCommand("LRS"); handleCommandClick("LRS"); }}
                variant="outline"
                className={BUTTON_STYLES.primary}
                disabled={state.gameOver || processor.isAwaitingInput()}
              >
                LRS
              </Button>
              <Button
                onClick={() => { setCommand("PHA"); handleCommandClick("PHA"); }}
                variant="outline"
                className={BUTTON_STYLES.destructive}
                disabled={state.gameOver || processor.isAwaitingInput()}
              >
                PHA
              </Button>
              <Button
                onClick={() => { setCommand("TOR"); handleCommandClick("TOR"); }}
                variant="outline"
                className={BUTTON_STYLES.destructive}
                disabled={state.gameOver || processor.isAwaitingInput()}
              >
                TOR
              </Button>
              <Button
                onClick={() => { setCommand("SHE"); handleCommandClick("SHE"); }}
                variant="outline"
                className={BUTTON_STYLES.secondary}
                disabled={state.gameOver || processor.isAwaitingInput()}
              >
                SHE
              </Button>
              <Button
                onClick={() => { setCommand("DAM"); handleCommandClick("DAM"); }}
                variant="outline"
                className={BUTTON_STYLES.accent}
                disabled={state.gameOver || processor.isAwaitingInput()}
              >
                DAM
              </Button>
              <Button
                onClick={() => { setCommand("COM"); handleCommandClick("COM"); }}
                variant="outline"
                className={BUTTON_STYLES.accent}
                disabled={state.gameOver || processor.isAwaitingInput()}
              >
                COM
              </Button>
              <Button
                onClick={() => { setCommand("HELP"); handleCommandClick("HELP"); }}
                variant="outline"
                className={BUTTON_STYLES.muted}
                disabled={state.gameOver || processor.isAwaitingInput()}
              >
                HELP
              </Button>
              <Button
                onClick={handleNewGame}
                variant="outline"
                className={BUTTON_STYLES.new}
              >
                NEW
              </Button>
            </div>
          </div>

          {/* Directional Pad for Navigation and Torpedoes */}
          {(processor.getAwaitingInputType() === "nav_course" || processor.getAwaitingInputType() === "torpedo_course") && (
            <div className="status-panel">
              <h2 className="text-lg font-bold text-primary mb-3 uppercase tracking-wider">
                {processor.getAwaitingInputType() === "nav_course" ? "Navigation Course" : "Torpedo Course"}
              </h2>
              <p className="text-sm text-muted-foreground mb-3">Select direction (1-9):</p>
              <div className="grid grid-cols-3 gap-3 max-w-60 mx-auto">
                {[
                  { num: "7", dir: "↖", label: "NW", pos: "top-left" },
                  { num: "8", dir: "↑", label: "N", pos: "top-center" },
                  { num: "9", dir: "↗", label: "NE", pos: "top-right" },
                  { num: "4", dir: "←", label: "W", pos: "middle-left" },
                  { num: "5", dir: "•", label: "STOP", pos: "middle-center" },
                  { num: "6", dir: "→", label: "E", pos: "middle-right" },
                  { num: "1", dir: "↙", label: "SW", pos: "bottom-left" },
                  { num: "2", dir: "↓", label: "S", pos: "bottom-center" },
                  { num: "3", dir: "↘", label: "SE", pos: "bottom-right" },
                ].map(({ num, dir, label, pos }) => (
                  <Button
                    key={num}
                    onClick={() => {
                      setCommand(num);
                      engine.addMessage("> " + num);
                      processor.processCommand(num);
                      setCommand("");
                      forceUpdate({});
                    }}
                    variant="outline"
                    className={`
                      ${num === "5" ? "bg-muted/20 border-muted text-muted-foreground" : "bg-primary/10 border-primary/50 text-primary hover:bg-primary/30 hover:border-primary"}
                      font-mono text-sm py-4 px-3 flex flex-col items-center gap-1 h-auto min-h-[80px] aspect-square
                    `}
                    title={`Course ${num} (${label})`}
                  >
                    <span className="text-lg font-bold">{num}</span>
                    <span className="text-2xl">{dir}</span>
                    <span className="text-xs opacity-75">{label}</span>
                  </Button>
                ))}
              </div>
              <div className="mt-3 text-xs text-muted-foreground text-center">
                <p>Based on Star Trek 1971 compass system</p>
                <p>Course 1-8 for movement, 5 for neutral</p>
              </div>
            </div>
          )}

          {/* Phaser Energy Input */}
          {processor.getAwaitingInputType() === "phaser_energy" && (
            <div className="status-panel">
              <h2 className="text-lg font-bold text-destructive mb-3 uppercase tracking-wider">Phaser Energy</h2>
              <p className="text-sm text-muted-foreground mb-3">Available Energy: {state.ship.energy}</p>
              
              {/* Preset Buttons */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[25, 50, 75, 100].map((percent) => {
                  const energy = Math.floor((state.ship.energy * percent) / 100);
                  return (
                    <Button
                      key={percent}
                      onClick={() => {
                        const energyStr = energy.toString();
                        setCommand(energyStr);
                        engine.addMessage("> " + energyStr);
                        processor.processCommand(energyStr);
                        setCommand("");
                        forceUpdate({});
                      }}
                      variant="outline"
                      className="bg-destructive/10 border-destructive/50 text-destructive hover:bg-destructive/30 hover:border-destructive font-mono text-sm py-3 flex flex-col items-center gap-1"
                      disabled={energy <= 0}
                    >
                      <span className="text-xs opacity-75">{percent}%</span>
                      <span className="font-bold">{energy}</span>
                    </Button>
                  );
                })}
              </div>

              {/* Range Slider */}
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max={state.ship.energy}
                  defaultValue="0"
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider-destructive"
                  onChange={(e) => {
                    const value = e.target.value;
                    const energyStr = value;
                    setCommand(energyStr);
                  }}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>{Math.floor(state.ship.energy / 2)}</span>
                  <span>{state.ship.energy}</span>
                </div>
              </div>
            </div>
          )}

          {/* Shield Energy Transfer */}
          {processor.getAwaitingInputType() === "shield_energy" && (
            <div className="status-panel">
              <h2 className="text-lg font-bold text-secondary mb-3 uppercase tracking-wider">Shield Energy</h2>
              <div className="space-y-2 mb-4 text-sm">
                <p>Ship Energy: <span className="text-primary font-mono">{state.ship.energy}</span></p>
                <p>Shield Energy: <span className="text-secondary font-mono">{state.ship.shields}</span></p>
                <p className="text-muted-foreground text-xs">Positive = Transfer TO shields, Negative = Transfer FROM shields</p>
              </div>
              
              {/* Preset Transfer Buttons */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground text-center">TO Shields</p>
                  {[100, 250, 500].map((amount) => (
                    <Button
                      key={`to-${amount}`}
                      onClick={() => {
                        const amountStr = amount.toString();
                        setCommand(amountStr);
                        engine.addMessage("> " + amountStr);
                        processor.processCommand(amountStr);
                        setCommand("");
                        forceUpdate({});
                      }}
                      variant="outline"
                      className="bg-secondary/10 border-secondary/50 text-secondary hover:bg-secondary/30 hover:border-secondary font-mono text-sm py-2 w-full"
                      disabled={state.ship.energy < amount}
                    >
                      +{amount}
                    </Button>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground text-center">FROM Shields</p>
                  {[100, 250, 500].map((amount) => (
                    <Button
                      key={`from-${amount}`}
                      onClick={() => {
                        const amountStr = (-amount).toString();
                        setCommand(amountStr);
                        engine.addMessage("> " + amountStr);
                        processor.processCommand(amountStr);
                        setCommand("");
                        forceUpdate({});
                      }}
                      variant="outline"
                      className="bg-accent/10 border-accent/50 text-accent hover:bg-accent/30 hover:border-accent font-mono text-sm py-2 w-full"
                      disabled={state.ship.shields < amount}
                    >
                      -{amount}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Command Input */}
          <div className="status-panel" data-tour="command-input">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="flex-1">
                <Input
                  ref={inputRef}
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder={processor.isAwaitingInput() ? "Enter value..." : "Or type command manually..."}
                  className="font-mono bg-black/50 border-primary/50 text-foreground text-2xl py-8 px-4"
                  disabled={state.gameOver && command === ""}
                  autoFocus
                />
              </div>
              <Button
                type="submit"
                variant="outline"
                className="bg-primary/20 border-primary text-primary hover:bg-primary hover:text-primary-foreground text-xl px-10 py-8"
              >
                Execute
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Game Over Overlay */}
      {state.gameOver && gameScore && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="max-w-2xl w-full my-8">
            {/* Victory/Defeat Banner */}
            <div className="text-center mb-6">
              <h2
                className={`text-5xl font-bold mb-2 ${state.victory ? 'text-primary' : 'text-destructive'}`}
                style={{ textShadow: "0 0 20px currentColor" }}
              >
                {state.victory ? "★ VICTORY ★" : "☠ GAME OVER ☠"}
              </h2>
              <p className="text-muted-foreground text-lg">
                {state.victory ? "Mission Accomplished!" : "Mission Failed"}
              </p>
            </div>

            {/* Show Name Entry if High Score */}
            {showNameEntry && (
              <div className="mb-6">
                <div className="text-center mb-4">
                  <p className="text-2xl font-bold text-primary mb-2">
                    NEW HIGH SCORE!
                  </p>
                  <p className="text-muted-foreground">
                    You've earned a place in Starfleet history!
                  </p>
                </div>
                <ArcadeNameEntry
                  onSubmit={handleNameSubmit}
                  initialName={getLastPlayerName()}
                />
              </div>
            )}

            {/* Show Score Breakdown (after name entry or if not high score) */}
            {!showNameEntry && (
              <>
                <ScoreBreakdown score={gameScore} state={state} />

                {/* High Score Saved Message */}
                {scoreSaved && (
                  <div className="status-panel text-center mt-6 bg-primary/20 border-primary">
                    <p className="text-primary font-bold text-lg">
                      Score saved to leaderboard!
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 justify-center mt-6">
                  <Button
                    onClick={() => setShowLeaderboard(true)}
                    variant="outline"
                    className="bg-accent/10 border-accent/50 text-accent hover:bg-accent/30 hover:border-accent text-lg px-6 py-6"
                  >
                    <Trophy className="w-5 h-5 mr-2" />
                    View Leaderboard
                  </Button>
                  <Button
                    onClick={handleNewGame}
                    className="bg-primary text-primary-foreground hover:bg-primary/80 text-lg px-8 py-6"
                  >
                    Start New Game
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Leaderboard Dialog */}
      <LeaderboardDialog open={showLeaderboard} onOpenChange={setShowLeaderboard} />
    </div>
  );
}
