# Star Trek 1971

![React](https://img.shields.io/badge/react-18.0%2B-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-active-success)

The 1971 Star Trek text game, rebuilt in React. Same brutal gameplay, better looking terminal.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://dr.eamer.dev/games/star-trek/)

## What is this?

Mike Mayfield wrote the original Star Trek game in 1971 and it became one of the most ported games in computing history. You command the Enterprise, hunt Klingons across an 8x8 galaxy, dock at starbases when you're falling apart, and try to finish before the clock runs out.

This version keeps the original mechanics intact — the galaxy layout, energy management, torpedo physics, all of it — but swaps the teletype interface for a React UI with a retro terminal look. There's also an interactive tour if you've never played the original.

## Running it

```bash
pnpm install
pnpm dev          # localhost:3000
```

Production: `pnpm build && pnpm start`

Needs Node 18+.

## How it plays

You get a mission briefing with a Klingon count and a stardate deadline. Navigate quadrants, scan for enemies, and blow them up before time expires. Dock at starbases to recharge and repair.

### Commands

| Command | What it does |
|---------|--------------|
| NAV | Warp to another quadrant |
| SRS | Short-range scan (your current sector) |
| LRS | Long-range scan (neighboring quadrants) |
| PHA | Fire phasers — always hits, weaker at distance |
| TOR | Fire photon torpedo — limited ammo, aimed by course heading |
| SHE | Redistribute energy to shields |
| DAM | Damage report |
| COM | Ship computer |

### Combat

Phasers are reliable but lose punch over distance. Torpedoes hit hard but you've got a limited supply and need to aim them. Shields soak damage but cost energy. Klingons shoot back every turn, so standing still in a hostile quadrant is a bad plan.

### Energy

Everything costs energy — warping, shooting phasers, running shields. Starbases are the only way to recharge. If you burn through your reserves in deep space, you're done.

### The galaxy

64 quadrants in an 8x8 grid. Each quadrant has 64 sectors. Stars block movement. Starbases are safe harbors. Klingons are everywhere else.

### Win/lose

Destroy every Klingon before the stardate deadline. If the Enterprise blows up or time runs out, game over.

## Practical advice

- Kill Klingons first, explore later
- Shields up before entering hostile quadrants
- Save torpedoes for when they matter
- Keep an eye on energy — running dry is how most games end
- Starbases fix everything, use them

## Stack

React 18, TypeScript, Vite, Tailwind CSS 4, Express (production server), wouter (routing).

## Credits

Original game: Mike Mayfield (1971)

## License

MIT

## Author

**Luke Steuber** — [dr.eamer.dev](https://dr.eamer.dev) · [GitHub](https://github.com/lukeslp) · [Bluesky](https://bsky.app/profile/dr.eamer.dev)
