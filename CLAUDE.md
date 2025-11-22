# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Star Trek 1971 is a faithful recreation of the classic 1971 text-based Star Trek game by Mike Mayfield, reimagined with a modern React-based UI while preserving the retro terminal aesthetic and original game mechanics.

**Live URL**: https://dr.eamer.dev/games/star-trek/
**Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS 4, Express
**Design Philosophy**: Retro computer terminal aesthetic with modern UX enhancements

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server (hot reload on port 3000)
pnpm dev

# Type checking (no emit)
pnpm check

# Build production bundle
pnpm build

# Start production server
pnpm start

# Preview production build locally
pnpm preview

# Format code
pnpm format
```

## Architecture Overview

### Core Game Systems

The game is built around three primary classes that form a separation-of-concerns architecture:

1. **GameEngine** (`client/src/lib/gameEngine.ts`)
   - Pure game logic and state management
   - Galaxy generation (8×8 quadrants, each with 8×8 sectors)
   - Entity placement and tracking (Klingons, Starbases, Stars)
   - Ship systems (energy, shields, torpedoes, damage)
   - Combat calculations (phasers, torpedoes, Klingon AI)
   - Movement and navigation (warp drive, impulse power)
   - Stardate and time management
   - Win/loss condition evaluation

2. **CommandProcessor** (`client/src/lib/commandProcessor.ts`)
   - Command parsing and routing
   - Multi-step command flow (e.g., NAV asks for course, then warp factor)
   - Input validation and error handling
   - Maps classic text commands (NAV, SRS, LRS, PHA, TOR, etc.) to engine methods

3. **Game Component** (`client/src/pages/Game.tsx`)
   - React UI rendering and state updates
   - Console output display (scrollable message log)
   - Visual representations (galaxy map, sector scan)
   - Command input interface (text + button panel)
   - Tour integration for first-time users

**Data Flow**: User Input → CommandProcessor → GameEngine → State Update → React Re-render

### Type System

All game state, entities, and configurations are strongly typed in `client/src/types/game.ts`:

- **GameState**: Complete game state including galaxy, ship status, stardates
- **Quadrant**: Contains coords, entity counts, scan status, and entity list
- **Entity**: Union type for all in-game objects (Enterprise, Klingons, Starbases, Stars)
- **Ship**: Energy, shields, torpedoes, damage levels, docked status
- **ShipSystems**: Damage multipliers (0-1) for each subsystem

### Component Structure

```
client/src/
├── components/
│   ├── ui/              # shadcn/ui components (button, input, card, etc.)
│   ├── Map.tsx          # Galaxy/sector visualization component
│   ├── ManusDialog.tsx  # Modal dialogs
│   └── ErrorBoundary.tsx
├── contexts/
│   └── ThemeContext.tsx # Dark/light theme management
├── hooks/
│   ├── useTour.ts       # Driver.js tour integration
│   ├── useMobile.tsx    # Mobile detection
│   └── usePersistFn.ts  # Persistent function references
├── lib/
│   ├── gameEngine.ts    # Core game logic
│   ├── commandProcessor.ts  # Command handling
│   └── utils.ts         # Utility functions (cn, etc.)
├── pages/
│   ├── Game.tsx         # Main game interface
│   ├── Home.tsx         # Landing page
│   └── NotFound.tsx     # 404 page
├── types/
│   └── game.ts          # TypeScript type definitions
└── main.tsx             # App entry point with router
```

## Game Mechanics Reference

### Command System

Classic text commands trigger multi-step dialogues:

- **NAV**: Course (1-9 compass direction) → Warp factor → Energy consumption and movement
- **SRS**: Short-range scan displays 8×8 sector grid with entity symbols
- **LRS**: Long-range scan shows 3×3 quadrant area with numeric codes (KBS format)
- **PHA**: Energy amount → Damage distributed to visible Klingons
- **TOR**: Course → Torpedo travels in straight line until hit or miss
- **SHE**: Transfer energy to/from shields
- **DAM**: Display subsystem damage report
- **COM**: Computer menu → Galactic record or Status report
- **HELP**: Display all available commands

### Entity Symbols

Visual representation in sector scan:
- `E` = Enterprise
- `K` = Klingon warship
- `B` = Starbase
- `*` = Star
- `.` = Empty space

### Combat Mechanics

**Phasers**:
- Guaranteed hit on all visible Klingons
- Damage inversely proportional to distance
- Formula: `damagePerKlingon = (energy / numKlingons) * (1000 / distance)`

**Torpedoes**:
- Travel in straight line from Enterprise
- Limited supply (replenish at starbase)
- Must aim using course direction (1-9)
- Can destroy Klingons or hit stars

**Klingon AI**:
- Fire back after player actions
- Damage reduced by shields
- Damage calculation: `klingonEnergy * (1 + random(0-1)) / distance`

### Energy Management

- Starting energy: 3000 units
- Warp drive: Consumes energy based on distance × warp factor
- Phasers: Direct energy-to-damage conversion
- Shields: Can transfer energy to/from shields (not consumed while up)
- Docking: Instant full recharge at starbase

## Vite Configuration

**Base Path**: `/games/star-trek/` (matches Caddy routing)

The Vite config uses environment-aware base path:
```typescript
const basePath = process.env.VITE_BASE_PATH ?? `/games/${projectSlug}/`;
```

**Aliases**:
- `@/` → `client/src/`
- `@shared/` → `shared/`
- `@assets/` → `attached_assets/`

**Build Output**: `dist/public/` (Express serves this in production)

## Server Configuration

Express server (`server/index.ts`) handles:
- Static file serving from `dist/public/`
- Base path routing support (for Caddy integration)
- SPA fallback for client-side routing (wouter)
- Special handling for `/variants` subdirectory

**Environment Variables**:
- `NODE_ENV=production` for production mode
- `PORT` (default: 3000)
- `BASE_PATH` for reverse proxy setups

## Tour System

First-time users see an interactive tour powered by driver.js.

**Implementation**:
- `useTour` hook manages localStorage tracking (`star-trek-tour-completed`)
- Auto-starts after 500ms for new users
- Manual trigger via help icon (?) in header
- 7 tour steps highlight: header, status, galaxy map, sector scan, console, command panel, input

**Testing Tour**:
```javascript
// Reset tour in browser console
localStorage.removeItem('star-trek-tour-completed');
location.reload();
```

## Styling Approach

**Theme**: Retro computer terminal with Star Trek aesthetic
- **Colors**: Dark background, bright green/cyan accents, amber highlights
- **Typography**: Share Tech Mono (Google Fonts) for authentic terminal feel
- **Layout**: Grid-based with fixed panels and scrollable console
- **Responsive**: Mobile-friendly with adjusted layouts for small screens

**Tailwind CSS 4**:
- Uses Vite plugin (`@tailwindcss/vite`)
- Custom CSS in `client/src/index.css`
- Driver.js tour customization with matching theme

## Common Development Tasks

### Adding a New Command

1. Add command case to `CommandProcessor.processCommand()` switch
2. Implement command method (e.g., `private newCommand()`)
3. Add multi-step input handling if needed (set `awaitingInput` and `inputCallback`)
4. Update `showHelp()` method with new command description
5. Optionally add quick-action button in `Game.tsx`

### Modifying Game Balance

Edit constants in `client/src/types/game.ts`:
```typescript
export const DEFAULT_CONFIG: GameConfig = {
  galaxySize: 8,
  initialKlingons: 15,     // Total Klingons in galaxy
  initialStarbases: 3,     // Total starbases
  initialStardates: 30,    // Time limit in days
  initialEnergy: 3000,     // Starting energy
  initialTorpedoes: 10,    // Starting torpedoes
  // ... other config
};
```

### Adding New UI Elements

1. Ensure element has `data-tour` attribute if relevant for tour
2. Use shadcn/ui components from `components/ui/` for consistency
3. Match retro terminal aesthetic (monospace font, green/cyan accents)
4. Test with keyboard-only navigation for accessibility

### Debugging Game State

Access game state in browser console:
```javascript
// React DevTools Components tab → Game component → hooks → useState(engine)
// Or add console.log in Game.tsx
console.log(engine.getState());
```

## Integration with dr.eamer.dev

**Caddy Configuration**:
The game is served via path-stripped reverse proxy:
```caddyfile
handle_path /games/star-trek/* {
    reverse_proxy localhost:3000
}
```

**Production Deployment**:
1. Build: `pnpm build` (creates `dist/public/` and `dist/index.js`)
2. Server runs: `NODE_ENV=production node dist/index.js`
3. Caddy proxies requests to the Express server

**Service Manager**:
If managed by `/home/coolhand/service_manager.py`, ensure entry matches:
```python
'star-trek': {
    'name': 'Star Trek 1971 Game',
    'script': '/home/coolhand/html/games/star-trek/start.sh',
    'working_dir': '/home/coolhand/html/games/star-trek',
    'port': 3000,  # or assigned port
    'health_endpoint': 'http://localhost:3000/games/star-trek/',
}
```

## Historical Context

The original Star Trek game (1971) was one of the first computer games with widespread distribution, originally written in BASIC for mainframe computers. This implementation preserves:

- Classic 8×8 galaxy grid structure
- Text-based command interface
- Original combat formulas and mechanics
- Stardate system and time pressure
- Quadrant/sector navigation model

While adding modern enhancements:
- React-based UI with visual grids
- Real-time status displays
- Clickable command buttons alongside text input
- Responsive mobile support
- Interactive first-time user tour
- Persistent state management

## Known Considerations

- **No Save/Load**: Games are session-based (refresh = new game)
- **No Multiplayer**: Single-player experience only
- **Classic AI**: Klingons don't move (faithful to original game)
- **Fixed Galaxy Size**: Always 8×8 quadrants (hardcoded in many places)
- **Wouter Patch**: Custom patch applied to wouter routing library (see `patches/`)

## Testing Checklist

When making changes, verify:
- [ ] TypeScript compiles (`pnpm check`)
- [ ] Game initializes correctly (new game shows briefing)
- [ ] All commands work (NAV, SRS, LRS, PHA, TOR, SHE, DAM, COM)
- [ ] Combat mechanics function (phasers, torpedoes, Klingon fire)
- [ ] Win condition triggers (all Klingons destroyed)
- [ ] Loss conditions trigger (time up, energy depleted, ship destroyed)
- [ ] Starbase docking and repair works
- [ ] Tour auto-starts for new users
- [ ] Mobile responsive layout works
- [ ] Production build serves correctly (`pnpm build && pnpm start`)
