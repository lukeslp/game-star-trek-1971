# Star Trek 1971 - UX Variants

## Overview

This directory contains **5 distinct UX interpretations** of Star Trek 1971, each exploring different modern design paradigms while maintaining identical game mechanics.

**Visit**: `/games/startrek/variants/` to see the variant selector and try each one.

---

## The Five Variants

### 1. Brutalist Terminal (`/brutalist/`)
**Philosophy**: Form follows function. Raw utility over aesthetics.

**Design Elements**:
- Pure black/white/red color scheme
- Monospace font only (Courier New)
- ASCII art for all graphics
- Zero border-radius (sharp edges)
- Dense information display
- Scanline CRT effect
- Blinking text cursor
- Terminal-first interaction

**Best For**:
- Keyboard power users
- Minimalism enthusiasts
- Those who want pure function
- Accessibility (high contrast)
- Low bandwidth/old hardware

**Inspiration**: Unix terminals, DOS games, brutalist architecture

---

### 2. Neumorphic Space Command (`/neumorphic/`)
**Philosophy**: Tactile depth through soft shadows.

**Design Elements**:
- Soft blue-gray palette (#e4e9f2)
- Dual light/dark shadows for depth
- 20px border-radius everywhere
- Embossed/debossed buttons
- Floating panel effects
- Subtle gradients
- Space Grotesk font

**Best For**:
- Desktop users
- Those who want calm, comfortable UI
- Fans of soft UI trend
- Long gaming sessions (easy on eyes)

**Inspiration**: Soft UI trend (2020s), tactile interfaces, neumorphism movement

---

### 3. Glassomorphism HUD (`/glass/`)
**Philosophy**: Layered transparency with frosted glass.

**Design Elements**:
- Backdrop blur (frosted glass effect)
- 10-15% opacity panels
- Animated gradient background
- Neon blue/purple/pink accents
- Orbitron font
- Holographic sensor grid
- Floating stars background
- Translucent overlays

**Best For**:
- Visual appeal
- Modern aesthetics fans
- Those who want "sci-fi" feel
- Showcasing browser capabilities

**Inspiration**: macOS Big Sur, iOS 15+, modern sci-fi UI

---

### 4. Mobile Card Interface (`/mobile/`)
**Philosophy**: Optimized for touch, one-handed use.

**Design Elements**:
- Bottom navigation bar
- Swipe-up modal sheets
- Large 60px+ touch targets
- Card-based layout
- Inter font
- Haptic vibration feedback
- Sheet handle affordance
- Thumb-zone optimized controls

**Best For**:
- Mobile phones
- Touch-first users
- One-handed play
- iOS/Android app feel
- Commuters, casual play

**Inspiration**: iOS/Android design guidelines, Tinder swipe UI, modern mobile apps

---

### 5. Cyberpunk Neon Terminal (`/cyberpunk/`)
**Philosophy**: Retro-future aesthetic with maximum atmosphere.

**Design Elements**:
- Pure black background (#000)
- Neon pink/cyan/yellow palette
- CRT scanline shader
- Glitch text animations
- Chromatic aberration
- Share Tech Mono + Rajdhani fonts
- Angular clipping (cut corners)
- Neon glow effects

**Best For**:
- Atmosphere/immersion
- Cyberpunk aesthetic fans
- Those who want personality
- Screenshot-worthy visuals
- Streamers (looks cool on camera)

**Inspiration**: Blade Runner, Cyberpunk 2077, 1980s arcade cabinets, Matrix

---

## Technical Implementation

### Shared Game Logic
All variants share the same core game mechanics:
- Galaxy generation
- Combat system
- Navigation
- Resource management
- Win/loss conditions

### Variant-Specific
Each variant has unique:
- HTML structure
- CSS styling (400-600 lines each)
- UI update functions
- Event bindings
- Visual effects

### File Structure
```
/variants/
  index.html              # Variant selector
  README.md               # This file
  VARIANTS_PLAN.md        # Design document
  
  brutalist/
    index.html            # Self-contained variant
  
  neumorphic/
    index.html
  
  glass/
    index.html
  
  mobile/
    index.html
  
  cyberpunk/
    index.html
  
  shared/                 # Future: extracted game logic
    game-core.js          # (Pending integration)
```

---

## Design Decisions

### Why 5 Variants?

1. **Explore Design Space**: Each represents a valid 2025 design trend
2. **User Preference**: Some prefer minimal, others maximal
3. **Context Matters**: Desktop vs mobile, casual vs focused
4. **Educational**: Showcases different design approaches
5. **Portfolio**: Demonstrates range and design skills

### What's Different?

**Visual Design**: Colors, shadows, shapes, typography  
**Interaction Model**: Terminal vs GUI vs touch  
**Information Density**: Minimal vs balanced vs dense  
**Atmosphere**: Utilitarian vs calm vs dramatic  

**What's The Same**: All game mechanics, rules, balance

---

## Usage Guidelines

### For Players

**Try Multiple Variants!** Each offers a different experience:
- Morning coffee? Try Neumorphic for calm focus
- Late night? Cyberpunk for atmosphere
- On phone? Mobile variant is optimized
- Just want to play? Brutalist gets out of your way

### For Developers

**Learn From Each**:
- Brutalist: Accessibility, keyboard nav
- Neumorphic: Shadow depth, tactile feedback
- Glassomorphism: Blur effects, layering
- Mobile: Touch optimization, gestures
- Cyberpunk: Visual effects, personality

**Copy/Adapt**: All code is clean, commented, and ready to learn from.

---

## Performance Notes

### Lightest
**Brutalist** (~15KB total, no images, minimal CSS)

### Most Intensive
**Glassomorphism** (~25KB, backdrop-filter can be GPU-heavy)  
**Cyberpunk** (~25KB, multiple animations and effects)

### Mobile Optimized
**Mobile variant** specifically designed for touch devices with reduced effects.

---

## Future Enhancements

Potential additions:
- **Shared game core**: Extract logic into one file, import in all variants
- **Variant switcher**: Switch between variants mid-game
- **Custom variants**: Let users create their own themes
- **More variants**: Terminal-punk, Windows 95, Retro LCD, etc.
- **Full integration**: Connect to complete Star Trek game logic

---

## Accessibility

### Best for Screen Readers
1. **Brutalist** - Pure text, high contrast
2. **Neumorphic** - Clear labels, good contrast
3. **Mobile** - ARIA labels, semantic HTML

### Best for Keyboard Users
1. **Brutalist** - Terminal-first design
2. **Cyberpunk** - Command-line optimized

### Best for Touch
1. **Mobile** - Designed for it
2. **Neumorphic** - Large tap targets

### Best for Visual Impairment
1. **Brutalist** - Maximum contrast (black/white)
2. **Cyberpunk** - High contrast neon

All variants support:
- Keyboard navigation
- Focus indicators
- Semantic HTML
- Reduced motion preferences

---

## Credits

**Original Game**: Mike Mayfield (1971), Bob Leedom (1974)  
**Modern Implementation**: Luke Steuber (2025)  
**UX Variants**: Exploring contemporary design languages  

**Design Influences**:
- Brutalism: Craigslist, early web, Unix terminals
- Neumorphism: Apple design, Dribbble soft UI trend
- Glassomorphism: iOS 15+, Windows 11, modern web
- Mobile: iOS HIG, Material Design 3, native apps
- Cyberpunk: Blade Runner, CP2077, retro computing

---

## License

Same as main Star Trek 1971 implementation.

Free for personal and educational use.  
Attribution appreciated.

---

**Experience the same game 5 different ways. Choose your aesthetic. Command your starship.**

*Visit `/games/startrek/variants/` to begin.*

