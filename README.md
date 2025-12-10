# Star Trek 1971

A faithful recreation of the classic 1971 text-based Star Trek game with a modern minimalist interface.

## About

Command the USS Enterprise in this historic space strategy game. Navigate through quadrants, battle Klingon warships, dock at starbases for repairs, and complete your mission before time runs out.

## Features

- Classic 1971 gameplay mechanics
- 8x8 galaxy grid with quadrant navigation
- Klingon combat system
- Starbase docking and repairs
- Phaser and photon torpedo weapons
- Long-range and short-range sensors
- Energy and shield management
- Modern minimalist UI preserving retro feel

## How to Play

1. Open `index.html` in a web browser (or navigate to the hosted version)
2. View your mission briefing
3. Use commands to navigate, scan, and engage enemies

### Victory Conditions

- **Win**: Destroy all Klingon ships within the time limit
- **Lose**: Enterprise is destroyed or time expires

## Commands & Controls

### Navigation
- **Warp Drive**: Move to different quadrants
- **Impulse Power**: Move within current quadrant

### Combat
- **Phasers**: Energy-based beam weapons
- **Photon Torpedoes**: Limited-quantity guided missiles
- **Shields**: Raise/lower defensive shields

### Sensors
- **Long-Range Scan**: View surrounding quadrants
- **Short-Range Scan**: Detailed view of current quadrant
- **Galaxy Map**: Overview of entire galaxy

### Support
- **Dock at Starbase**: Repair and refuel
- **Status Report**: View ship condition and mission progress

## Game Mechanics

### Energy Management
- Warp drive consumes energy
- Phasers draw from ship's power
- Shields reduce damage but drain energy
- Dock at starbases to recharge

### Combat System
- Phasers: Guaranteed hit, damage decreases with distance
- Torpedoes: Limited supply, must aim carefully
- Shields: Absorb damage but consume energy
- Klingons return fire each turn

### Quadrant System
- Galaxy divided into 8x8 grid
- Each quadrant may contain Klingons, starbases, or stars
- Stars are navigation hazards
- Starbases provide sanctuary and repairs

### Time Pressure
- Stardate advances with each action
- Mission must complete before final stardate
- Balance speed with caution

## Technical Details

- Modern JavaScript with classic game logic
- Responsive CSS design
- No build process required
- Fully playable offline
- Touch-friendly mobile interface

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## File Structure

```
startrek/
├── client/
│   ├── index.html    # Main game page
│   ├── game.js       # Game logic
│   └── styles.css    # Styling
└── README.md         # This file
```

## Historical Context

The original Star Trek game was created in 1971 by Mike Mayfield and became one of the most influential early computer games. This version preserves the core gameplay while adding modern UI/UX improvements.

## Tips for Success

- Prioritize Klingon destruction over exploration
- Keep shields up in combat zones
- Conserve torpedoes for crucial moments
- Use starbases strategically for repairs
- Plan warp routes to avoid stars
- Monitor energy levels constantly

## Credits

Original game: Mike Mayfield (1971)

## License

MIT License - see [LICENSE](LICENSE) file

## Author

**Luke Steuber**

- Website: [lukesteuber.com](https://lukesteuber.com)
- GitHub: [@lukeslp](https://github.com/lukeslp)
- Bluesky: [@lukesteuber.com](https://bsky.app/profile/lukesteuber.com)
