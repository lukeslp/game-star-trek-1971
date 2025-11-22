# Star Trek 1971 - Classic Text Game Remake

A faithful browser-based remake of the classic 1971 Star Trek text strategy game by Mike Mayfield, featuring a modern GUI interface with retro terminal aesthetics.

## About the Original Game

The original Star Trek game was created by Mike Mayfield in 1971 on a Sigma 7 mainframe computer. It became one of the most ported and beloved games in early computing history, appearing in countless BASIC programming books throughout the 1970s and 1980s. The "Super Star Trek" enhanced version by Bob Leedom (1974) added many improvements that became standard features.

## Game Objective

You are the captain of the USS Enterprise. Your mission is to destroy all Klingon warships in the galaxy before they can attack Federation Headquarters. You have a limited time (measured in stardates) to complete your mission.

## How to Play

### Galaxy Structure

The galaxy is divided into an **8×8 grid of quadrants**. Each quadrant is further divided into an **8×8 grid of sectors**. Your ship occupies one sector within one quadrant at any time.

### Resources

- **Energy**: Used for warp travel, phasers, and life support
- **Shields**: Protect your ship from damage (uses energy)
- **Photon Torpedoes**: Limited ammunition for precise attacks
- **Time**: You have a limited number of stardates to complete your mission

### Commands

Type commands in the input field and press Enter or click Execute.

#### Navigation
- **NAV** - Navigate using warp engines
  - You'll be prompted for course (1-9) and warp factor (0.1-8.0)
  - Course: 1=up-right, 3=right, 5=down-left, 7=left, 9=up
  - Higher warp factors consume more energy

#### Sensors
- **SRS** - Short Range Scan
  - Shows 8×8 sector map of current quadrant
  - Displays: E=Enterprise, K=Klingon, B=Starbase, *=Star

- **LRS** - Long Range Scan
  - Shows 3×3 grid of surrounding quadrants
  - Three-digit code: KBS (Klingons, Bases, Stars)
  - Example: "203" = 2 Klingons, 0 Bases, 3 Stars

#### Weapons
- **PHA** - Fire Phasers
  - Distribute energy among all Klingons in quadrant
  - Damage decreases with distance
  - Consumes energy

- **TOR** - Fire Photon Torpedo
  - Precise aimed weapon using course (1-9)
  - Destroys Klingon with single hit
  - Limited ammunition

#### Defense
- **SHE** - Shield Control
  - Transfer energy between shields and main power
  - Shields must be up to protect from damage
  - Cannot raise shields while docked

#### Information
- **DAM** - Damage Report
  - Shows status of all ship systems
  - Systems can be damaged in combat

- **COM** - Library Computer
  - 1: Galactic Record (full galaxy map)
  - 2: Status Report (mission summary)

#### Other
- **HELP** or **?** - Show command list
- **XXX** or **QUIT** - Resign command

### Starbases

Starbases are your friends! When adjacent to a starbase:
- Energy automatically replenished
- Torpedoes restocked
- All systems instantly repaired
- Shields automatically lowered (you're safe)

### Combat

When Klingons are in your quadrant:
- They attack after your actions
- Damage goes to shields first (if up), then hull
- Hull damage can disable ship systems
- Destroy all Klingons to win!

### Winning and Losing

**Victory**: Destroy all Klingon ships before time runs out

**Defeat** occurs if:
- Time runs out with Klingons remaining
- Your ship's energy reaches zero
- Your ship is destroyed in combat

## Strategy Tips

1. **Visit starbases regularly** to refuel and repair
2. **Raise shields before combat** to protect your ship
3. **Use phasers for multiple enemies** at close range
4. **Use torpedoes for distant targets** to conserve energy
5. **Watch your time limit** - don't waste stardates
6. **Explore systematically** using long-range sensors
7. **Keep energy reserves** for emergency warp travel

## Display Guide

### Status Bar
- **Stardate**: Current game time
- **Time Left**: Stardates remaining
- **Condition**: GREEN (safe), RED (enemies present), DOCKED (at starbase)
- **Energy**: Main power supply
- **Shields**: Shield strength
- **Torpedoes**: Remaining ammunition
- **Klingons**: Enemy ships left in galaxy

### Galaxy Map
- **◆** = Your current quadrant
- **!** = Quadrants with Klingons
- **·** = Explored quadrants

### Sector Map
- **E** = USS Enterprise (you)
- **K** = Klingon warship
- **B** = Starbase
- **\*** = Star
- **.** = Empty space

## Credits

**Original Game**: Mike Mayfield (1971)  
**Super Star Trek**: Bob Leedom (1974)  
**This Remake**: Created with modern web technologies (React, TypeScript, Tailwind CSS)

This remake honors the legacy of one of the most influential early computer games, bringing the classic strategic gameplay to modern browsers with an enhanced visual interface while maintaining the authentic command-line feel.

## Historical Note

The original Star Trek game was designed to run on a teletype terminal with no graphics capability. Players navigated purely through text commands and ASCII maps. This version preserves that authentic experience while adding visual enhancements that make the game more accessible to modern players.

The game's influence on computer gaming history cannot be overstated - it pioneered many concepts that became standard in strategy games, including resource management, turn-based combat, exploration mechanics, and time pressure gameplay.

---

**Live long and prosper!** 🖖
