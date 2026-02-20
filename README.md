# Star Trek 1971

![React](https://img.shields.io/badge/react-18.0%2B-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-active-success)

A faithful recreation of the classic 1971 text-based Star Trek game with a modern React-based interface.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://dr.eamer.dev/games/star-trek/)

![Star Trek 1971 gameplay](https://raw.githubusercontent.com/lukeslp/game-star-trek-1971/main/screenshot.png)

## About

Command the USS Enterprise in this historic space strategy game. Navigate through quadrants, battle Klingon warships, dock at starbases for repairs, and complete your mission before time runs out.

The original Star Trek game was created in 1971 by Mike Mayfield and became one of the most influential early computer games. This version preserves the core gameplay while reimagining it with modern UI/UX.

## Features

- Classic 1971 gameplay mechanics
- 8x8 galaxy grid with quadrant navigation
- Klingon combat system
- Starbase docking and repairs
- Phaser and photon torpedo weapons
- Long-range and short-range sensors
- Energy and shield management
- Retro terminal aesthetic with modern React UI
- Interactive tour for new players

## Screenshot

*Command interface with galaxy map, sector scan, and console log*

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm)

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Opens at `http://localhost:3000`

### Production Build

```bash
pnpm build
pnpm start
```

## How to Play

1. View your mission briefing
2. Use commands to navigate, scan, and engage enemies
3. Destroy all Klingon ships before the stardate expires

### Commands

| Command | Action |
|---------|--------|
| NAV | Warp to another quadrant |
| SRS | Short-range scan (current sector) |
| LRS | Long-range scan (surrounding quadrants) |
| PHA | Fire phasers |
| TOR | Fire photon torpedo |
| SHE | Adjust shields |
| DAM | Damage report |
| COM | Ship computer |

### Victory Conditions

- **Win**: Destroy all Klingon ships within the time limit
- **Lose**: Enterprise is destroyed or time expires

## Game Mechanics

### Energy Management
- Warp drive consumes energy based on distance
- Phasers draw from ship's power
- Shields reduce damage but can be transferred energy
- Dock at starbases to recharge

### Combat System
- **Phasers**: Guaranteed hit, damage decreases with distance
- **Torpedoes**: Limited supply, must aim using course direction
- **Shields**: Absorb damage
- Klingons return fire each turn

### Quadrant System
- Galaxy divided into 8x8 grid of quadrants
- Each quadrant contains 8x8 sectors
- Stars are navigation hazards
- Starbases provide sanctuary and repairs

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS 4
- Express (production server)
- wouter (routing)

## Tips

- Prioritize Klingon destruction over exploration
- Keep shields up in combat zones
- Conserve torpedoes for crucial moments
- Use starbases strategically for repairs
- Monitor energy levels constantly

## Credits

Original game concept: Mike Mayfield (1971)

## License

MIT

## Author

**Luke Steuber**
- Website: [dr.eamer.dev](https://dr.eamer.dev)
- GitHub: [@lukeslp](https://github.com/lukeslp)
- Bluesky: [@dr.eamer.dev](https://bsky.app/profile/dr.eamer.dev)
