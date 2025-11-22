# Star Trek 1971 - UX Variants Plan

## Overview

Create 5 radically different UX/design interpretations of the Star Trek 1971 game. Each variant uses the same game logic but presents it through a distinct modern design language and interaction paradigm.

---

## Variant 1: Brutalist Terminal
**Theme**: Raw, utilitarian, monochrome ASCII aesthetic

### Design Language
- **Pure black/white/gray** - No color except red for alerts
- **Monospace font only** - Courier New, no alternatives
- **ASCII art** for all graphics (galaxy map, sector grid)
- **Sharp edges** - No border-radius
- **Dense information** - Maximum data per screen
- **Terminal-first** - Text commands emphasized over GUI

### Key Features
- Full-screen terminal with ASCII graphics
- Command history with up/down arrows
- Tab completion for commands
- Pure keyboard navigation (no mouse needed)
- Minimalist status bar (one line)
- ASCII art Enterprise/Klingons
- Retro scanlines effect
- Blinking cursor

### Files
- `/startrek/variants/brutalist/index.html`
- `/startrek/variants/brutalist/style.css`
- Copy existing game logic, new UI layer

---

## Variant 2: Neumorphic Space Command
**Theme**: Soft, tactile, depth-based interface

### Design Language
- **Soft shadows** - Dual light/dark shadows for depth
- **Muted blues** - #e4e9f2 background, subtle color palette
- **Rounded everything** - 20px+ border-radius
- **Embossed buttons** - Pressed/raised states
- **Floating panels** - Cards appear to lift off surface
- **Smooth gradients** - Subtle depth cues

### Key Features
- 3-panel layout with soft shadows
- Embossed/debossed interactive elements
- Haptic-feeling buttons (CSS press animations)
- Floating status cards
- Gradient-filled progress bars
- Soft glow on Enterprise position
- Ambient light mode

### Files
- `/startrek/variants/neumorphic/index.html`
- `/startrek/variants/neumorphic/style.css`

---

## Variant 3: Glassomorphism HUD
**Theme**: Frosted glass, blur, transparency, futuristic

### Design Language
- **Backdrop blur** - Frosted glass panels (backdrop-filter)
- **Transparency** - RGBA with 10-30% opacity
- **Bright accents** - Neon blues, cyans on dark background
- **Thin borders** - 1px bright lines
- **Floating UI** - All elements appear to hover
- **Particle background** - Animated stars/nebula

### Key Features
- Dark space background with stars
- Frosted glass panels for all UI
- Holographic sector display
- Neon outline effects
- Animated background (slow-moving stars)
- Blur on inactive panels
- Translucent buttons
- Glow effects on hover

### Files
- `/startrek/variants/glass/index.html`
- `/startrek/variants/glass/style.css`
- `/startrek/variants/glass/particles.js` (background animation)

---

## Variant 4: Card-Based Mobile-First
**Theme**: Tinder-like swipe interface, gesture-driven

### Design Language
- **Large cards** - One action per card
- **Swipe gestures** - Swipe to navigate, choose actions
- **Bottom-sheet UI** - Modals slide up from bottom
- **Thumb-zone optimized** - All controls in easy reach
- **Minimal chrome** - Full-screen cards
- **Progressive disclosure** - Show only what's needed

### Key Features
- Swipeable command cards
- Bottom navigation bar
- Sheet modals for secondary screens
- Haptic feedback (vibration API)
- Pull to refresh
- Gesture-based combat (swipe to fire)
- Card stack for history
- Large touch targets (60px minimum)

### Files
- `/startrek/variants/mobile/index.html`
- `/startrek/variants/mobile/style.css`
- `/startrek/variants/mobile/gestures.js` (swipe handling)

---

## Variant 5: Cyberpunk Neon Terminal
**Theme**: High contrast, neon accents, retro-future aesthetic

### Design Language
- **Pure black background** - #000000
- **Neon accents** - Hot pink, cyan, yellow
- **Scanline overlay** - CRT monitor effect
- **Glitch effects** - Occasional UI glitches
- **Sharp angles** - Aggressive geometric shapes
- **High contrast text** - Bright on pure black
- **Chromatic aberration** - RGB offset on headings

### Key Features
- CRT scanline shader effect
- Glitch animations on events
- Neon glow on all text
- Sharp geometric UI panels
- Pixelated retro fonts
- VHS tracking effect
- Matrix-style scrolling text
- Neon grid lines

### Files
- `/startrek/variants/cyberpunk/index.html`
- `/startrek/variants/cyberpunk/style.css`
- `/startrek/variants/cyberpunk/effects.js` (CRT/glitch)

---

## Implementation Strategy

### Phase 1: Setup (30 min)
Create variant directory structure:
```
/startrek/variants/
  index.html          # Variant selector
  brutalist/
  neumorphic/
  glass/
  mobile/
  cyberpunk/
  shared/
    game-logic.js     # Copy of core game logic
```

### Phase 2: Build Each Variant (3-4 hours each)

Each variant includes:
1. **HTML structure** tailored to design system
2. **CSS** implementing the design language (400-600 lines)
3. **UI adapter** - Maps game state to that variant's UI
4. **Polish** - Animations, effects specific to that style

### Phase 3: Variant Selector (1 hour)
Create index page showing all 5 variants with:
- Preview image/animation for each
- Description of design approach
- "Play This Variant" buttons
- Comparison grid of features

---

## Technical Approach

### Shared Game Logic
Extract core game logic into `/variants/shared/game-logic.js`:
- Galaxy generation
- Combat system
- Navigation
- All game rules

### Variant-Specific UI Layers
Each variant has custom:
- HTML structure
- CSS styling
- UI update functions
- Event bindings

But all use same game state and rules.

---

## Design Details

### Variant 1: Brutalist
```css
:root {
  --bg: #000000;
  --fg: #ffffff;
  --accent: #ff0000;
}

body {
  font-family: 'Courier New', monospace;
  background: #000;
  color: #fff;
  line-height: 1.2;
}

.panel {
  border: 2px solid #fff;
  padding: 1rem;
  margin: 0;
  border-radius: 0;
}
```

### Variant 2: Neumorphic
```css
:root {
  --bg: #e4e9f2;
  --shadow-light: rgba(255, 255, 255, 0.9);
  --shadow-dark: rgba(163, 177, 198, 0.6);
}

.panel {
  background: var(--bg);
  box-shadow: 
    -12px -12px 24px var(--shadow-light),
    12px 12px 24px var(--shadow-dark);
  border-radius: 20px;
}

button:active {
  box-shadow: 
    inset -6px -6px 12px var(--shadow-light),
    inset 6px 6px 12px var(--shadow-dark);
}
```

### Variant 3: Glassomorphism
```css
.panel {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}

body {
  background: 
    radial-gradient(circle at 20% 50%, rgba(0, 150, 255, 0.3), transparent),
    radial-gradient(circle at 80% 20%, rgba(255, 0, 150, 0.3), transparent),
    #0a0a1a;
}
```

### Variant 4: Mobile Card
```css
.command-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  min-height: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  touch-action: pan-y;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #eee;
  padding: 1rem;
  display: flex;
  justify-content: space-around;
}
```

### Variant 5: Cyberpunk
```css
:root {
  --neon-pink: #ff00ff;
  --neon-cyan: #00ffff;
  --neon-yellow: #ffff00;
}

body {
  background: #000;
  color: var(--neon-cyan);
  font-family: 'Share Tech Mono', monospace;
  position: relative;
}

body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 255, 255, 0.03) 0px,
    transparent 1px,
    transparent 2px,
    rgba(0, 255, 255, 0.03) 3px
  );
  pointer-events: none;
}

.panel {
  border: 2px solid var(--neon-pink);
  box-shadow: 
    0 0 10px var(--neon-pink),
    inset 0 0 10px rgba(255, 0, 255, 0.1);
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%);
}
```

---

## Timeline

**Total**: 15-20 hours
- Setup: 30 min
- Variant 1: 3 hours
- Variant 2: 3 hours
- Variant 3: 4 hours (particles)
- Variant 4: 4 hours (gestures)
- Variant 5: 3 hours
- Selector page: 1 hour
- Polish/testing: 2 hours

---

Ready to build 5 distinct experiences from one game!

