# Star Trek 1971 - Engagement Enhancement Checklist

**Current Status:** Fully functional, minimal engagement mechanics
**Goal:** Transform into compelling, replayable experience
**Timeline:** 3 phases over 2-3 weeks

---

## Phase 1: Immediate Gratification (12 hours)
**Goal:** Make every action feel good
**Impact:** +70% fun factor

### Visual Feedback (6 hours)
- [ ] Add CSS animations to `/client/src/styles/game.css`
  - [ ] `@keyframes screen-shake` - for weapon fire
  - [ ] `@keyframes phaser-flash` - for phaser hits
  - [ ] `@keyframes explosion` - for Klingon destruction
  - [ ] `@keyframes warp-pulse` - for navigation
  - [ ] `@keyframes shield-activate` - for shield adjustments
  - [ ] `@keyframes energy-drain` - for low energy warning
  - [ ] `@keyframes critical-hit` - for high-damage hits

- [ ] Update grid cell styles
  - [ ] Add glow effects to Enterprise cell
  - [ ] Add pulse animation to Klingon cells
  - [ ] Add sparkle to starbase cells
  - [ ] Add twinkle to star cells

- [ ] Modify `/client/src/lib/combatSystem.ts`
  - [ ] Add visual triggers after phaser fire
  - [ ] Add explosion animation on Klingon destruction
  - [ ] Add screen shake on Enterprise damage
  - [ ] Add flash effect on critical hits

- [ ] Modify `/client/src/lib/gameLogic.ts`
  - [ ] Add warp animation on navigation
  - [ ] Add dock animation on starbase arrival
  - [ ] Add shield glow on shield adjustment

- [ ] Test all animations
  - [ ] Fire phasers → see flash + shake
  - [ ] Destroy Klingon → see explosion
  - [ ] Take damage → see shake + red flash
  - [ ] Navigate → see warp pulse
  - [ ] Dock → see starbase highlight

---

### Sound Effects (4 hours)
- [ ] Create `/client/public/sounds/` directory

- [ ] Download/create sound files (freesound.org, zapsplat.com)
  - [ ] `phaser.mp3` - laser/energy weapon sound (0.3-0.5s)
  - [ ] `torpedo.mp3` - whoosh + explosion (1-1.5s)
  - [ ] `explosion.mp3` - big boom (0.8-1s)
  - [ ] `warp.mp3` - engine hum/whoosh (1-2s)
  - [ ] `shield.mp3` - force field activation (0.5s)
  - [ ] `damage.mp3` - alarm/warning beep (0.3s)
  - [ ] `dock.mp3` - mechanical clunk (0.5s)
  - [ ] `alert.mp3` - computer beep (0.2s)
  - [ ] `victory.mp3` - triumphant fanfare (2-3s)
  - [ ] `defeat.mp3` - sad trombone (1-2s)

- [ ] Create `/client/src/lib/soundManager.ts`
  - [ ] Implement SoundManager class
  - [ ] Add preload functionality
  - [ ] Add volume control
  - [ ] Add mute/unmute toggle
  - [ ] Add error handling for autoplay restrictions

- [ ] Load sounds on game init
  - [ ] Load all sound files
  - [ ] Test loading errors
  - [ ] Add loading indicator if needed

- [ ] Add sound triggers
  - [ ] Phaser fire → play phaser.mp3
  - [ ] Torpedo fire → play torpedo.mp3
  - [ ] Klingon destroyed → play explosion.mp3
  - [ ] Navigation → play warp.mp3
  - [ ] Shield adjustment → play shield.mp3
  - [ ] Damage received → play damage.mp3
  - [ ] Dock at starbase → play dock.mp3
  - [ ] Low energy warning → play alert.mp3
  - [ ] Victory → play victory.mp3
  - [ ] Defeat → play defeat.mp3

- [ ] Add UI controls
  - [ ] Sound toggle button in header
  - [ ] Volume slider (optional)
  - [ ] Save preference to localStorage

- [ ] Test sound system
  - [ ] All sounds play at correct times
  - [ ] Volumes are balanced
  - [ ] Mute button works
  - [ ] No audio overlap issues

---

### Score System (2 hours)
- [ ] Create `/client/src/lib/scoring.ts`
  - [ ] Define GameScore interface
  - [ ] Implement calculateScore function
  - [ ] Define grade thresholds (S/A/B/C/D)
  - [ ] Add scoring criteria:
    - [ ] Klingons destroyed (100 each)
    - [ ] Time remaining bonus (10 per stardate)
    - [ ] Energy remaining (1 per 100)
    - [ ] Torpedoes remaining (50 each)
    - [ ] No damage bonus (1000)
    - [ ] Speed bonus (100 per stardate under 20)

- [ ] Update `/client/src/pages/Game.tsx`
  - [ ] Calculate score on game over
  - [ ] Display score breakdown on victory screen
  - [ ] Display grade with styled badge
  - [ ] Show individual score components

- [ ] Add CSS for score display in `/client/src/styles/game.css`
  - [ ] Grade badges (S = gold, A = silver, etc.)
  - [ ] Score breakdown list styling
  - [ ] Highlight bonus scores

- [ ] Test scoring
  - [ ] Fast win → high score
  - [ ] Slow win → lower score
  - [ ] Perfect run → S rank
  - [ ] Verify all bonuses calculate correctly

---

## Phase 2: Goals & Replayability (16 hours)
**Goal:** Give players reasons to keep playing
**Impact:** +120% replay value

### Difficulty Modes (4 hours)
- [ ] Create `/client/src/lib/difficulty.ts`
  - [ ] Define Difficulty type (CADET/CAPTAIN/ADMIRAL)
  - [ ] Define DifficultySettings interface
  - [ ] Create settings for each difficulty:
    - [ ] CADET: Easy (more resources, time, starbases)
    - [ ] CAPTAIN: Normal (current balance)
    - [ ] ADMIRAL: Hard (fewer resources, more Klingons)

- [ ] Modify `/client/src/lib/gameLogic.ts`
  - [ ] Accept difficulty parameter in initializeGame
  - [ ] Apply difficulty modifiers to:
    - [ ] Klingon count
    - [ ] Klingon strength
    - [ ] Starting energy
    - [ ] Starting torpedoes
    - [ ] Time limit
    - [ ] Starbase count
    - [ ] Damage multiplier

- [ ] Create difficulty selection UI
  - [ ] Add to new game screen
  - [ ] Show description for each difficulty
  - [ ] Show expected challenge level
  - [ ] Save preference to localStorage

- [ ] Update game state
  - [ ] Store current difficulty in gameState
  - [ ] Display difficulty in header
  - [ ] Include difficulty in score calculation

- [ ] Test all difficulties
  - [ ] CADET is easier (verify numbers)
  - [ ] ADMIRAL is challenging (verify balance)
  - [ ] All difficulties are winnable

---

### Achievement System (6 hours)
- [ ] Create `/client/src/lib/achievements.ts`
  - [ ] Define Achievement interface
  - [ ] Create achievement definitions:
    - [ ] First Victory - Complete first mission
    - [ ] Speed Demon - Win in <15 stardates
    - [ ] Perfect Captain - Win with no damage
    - [ ] Sharpshooter - Destroy 100 Klingons (cumulative)
    - [ ] Torpedo Master - Win using only torpedoes
    - [ ] Pacifist - Win without firing phasers
    - [ ] Admiral - Beat Admiral difficulty
    - [ ] Energy Saver - Win with 2000+ energy remaining
    - [ ] Veteran - Complete 10 missions
    - [ ] Legendary Captain - Get S rank on Admiral

- [ ] Implement achievement tracking
  - [ ] Check conditions after each turn
  - [ ] Check conditions on game over
  - [ ] Track cumulative stats (total Klingons, missions)
  - [ ] Save achievement state to localStorage

- [ ] Create achievement notification
  - [ ] Toast component for unlock notification
  - [ ] Show achievement icon + name
  - [ ] Play sound effect
  - [ ] Animate entrance/exit

- [ ] Create achievement gallery
  - [ ] Achievement list view
  - [ ] Show locked vs unlocked
  - [ ] Show unlock date
  - [ ] Show completion percentage
  - [ ] Add to game menu or post-game screen

- [ ] Test achievements
  - [ ] Each achievement unlocks correctly
  - [ ] Notifications display properly
  - [ ] Persistence works across sessions
  - [ ] Cumulative tracking is accurate

---

### Random Events (4 hours)
- [ ] Create `/client/src/lib/events.ts`
  - [ ] Define RandomEvent interface
  - [ ] Create event definitions:
    - [ ] Distress Signal - Nearby starbase under attack
    - [ ] Ion Storm - Energy systems disrupted
    - [ ] Supply Cache - Found abandoned ship supplies
    - [ ] Klingon Ambush - Extra Klingon appears
    - [ ] Nebula - Sensors disrupted
    - [ ] Repair Crew - Random system repaired
    - [ ] Warp Malfunction - Unexpected navigation

- [ ] Implement event system
  - [ ] Roll for event chance after each turn
  - [ ] Apply event effects
  - [ ] Display event message
  - [ ] Add event log to history

- [ ] Balance event probability
  - [ ] Positive events: 8-10% chance
  - [ ] Negative events: 5-8% chance
  - [ ] Neutral events: 3-5% chance

- [ ] Test events
  - [ ] Events trigger at reasonable frequency
  - [ ] Effects are balanced (not too harsh/generous)
  - [ ] Messages are clear

---

### Save/Load System (2 hours)
- [ ] Create save functionality
  - [ ] Serialize game state to JSON
  - [ ] Save to localStorage with timestamp
  - [ ] Create save slot system (3 slots)

- [ ] Create load functionality
  - [ ] Load from localStorage
  - [ ] Validate save data
  - [ ] Handle corrupted saves gracefully

- [ ] Add UI controls
  - [ ] "Save Game" button in menu
  - [ ] "Load Game" option on start screen
  - [ ] Show save date/time
  - [ ] Auto-save on quit

- [ ] Test save/load
  - [ ] Save mid-game → reload → continue correctly
  - [ ] Multiple saves work independently
  - [ ] Corrupted data doesn't break game

---

## Phase 3: Long-Term Engagement (20 hours)
**Goal:** Build lasting player investment
**Impact:** +200% retention

### Captain's Career System (8 hours)
- [ ] Create `/client/src/lib/progression.ts`
  - [ ] Define CaptainProfile interface
  - [ ] Define rank progression (Ensign → Fleet Admiral)
  - [ ] Implement XP system
    - [ ] XP from Klingons destroyed
    - [ ] XP from missions completed
    - [ ] XP from achievements
    - [ ] XP from high scores

- [ ] Create profile system
  - [ ] Captain name input
  - [ ] Total stats tracking:
    - [ ] Total missions
    - [ ] Total Klingons destroyed
    - [ ] Best time
    - [ ] Highest score
    - [ ] Win/loss ratio

- [ ] Create rank progression
  - [ ] 10 ranks with XP thresholds
  - [ ] Rank badges/insignia
  - [ ] Rank perks (small bonuses)

- [ ] Create profile UI
  - [ ] Profile screen showing:
    - [ ] Current rank + progress bar
    - [ ] Total stats
    - [ ] Achievement showcase
    - [ ] Recent missions
  - [ ] Rank-up celebration animation

- [ ] Test progression
  - [ ] XP calculates correctly
  - [ ] Rank-ups trigger appropriately
  - [ ] Stats persist across sessions

---

### Ship Upgrades (6 hours)
- [ ] Define upgrade system
  - [ ] Upgrade categories:
    - [ ] Shields (capacity, recharge rate)
    - [ ] Weapons (damage, efficiency)
    - [ ] Engines (speed, fuel efficiency)
    - [ ] Sensors (range, accuracy)
    - [ ] Hull (max energy, damage resistance)

- [ ] Create upgrade tree
  - [ ] 3-5 upgrades per category
  - [ ] XP cost for each upgrade
  - [ ] Rank requirements

- [ ] Implement upgrade effects
  - [ ] Modify ship stats based on upgrades
  - [ ] Save upgrade state
  - [ ] Display active upgrades

- [ ] Create upgrade UI
  - [ ] Upgrade shop/menu
  - [ ] Show available vs locked upgrades
  - [ ] Show cost and requirements
  - [ ] Preview effect before buying

- [ ] Balance upgrades
  - [ ] Not too powerful (maintain challenge)
  - [ ] Meaningful choices (different playstyles)
  - [ ] Cost progression feels fair

---

### Daily Challenges (4 hours)
- [ ] Create `/client/src/lib/dailyChallenge.ts`
  - [ ] Generate daily seed
  - [ ] Create challenge modifiers:
    - [ ] Time trial (beat in X stardates)
    - [ ] Limited resources (fewer torpedoes)
    - [ ] Increased difficulty (more Klingons)
    - [ ] Special objectives (no shield use, etc.)

- [ ] Implement daily rotation
  - [ ] New challenge each day at midnight
  - [ ] Store daily best score
  - [ ] Track completion streak

- [ ] Create challenge UI
  - [ ] Display today's challenge
  - [ ] Show objective
  - [ ] Show leaderboard (if integrated)
  - [ ] Show streak counter

- [ ] Test daily system
  - [ ] Challenge resets at midnight
  - [ ] Scores persist for each day
  - [ ] Different challenges each day

---

### Tutorial System (2 hours)
- [ ] Create interactive tutorial
  - [ ] Step 1: Explain navigation
  - [ ] Step 2: Demonstrate sensors
  - [ ] Step 3: Practice phaser combat
  - [ ] Step 4: Practice torpedo combat
  - [ ] Step 5: Explain docking

- [ ] Implement tutorial flow
  - [ ] Highlight relevant UI elements
  - [ ] Show tooltips with instructions
  - [ ] Prevent actions until tutorial step complete
  - [ ] Allow skip option

- [ ] Add tutorial triggers
  - [ ] Auto-start on first play
  - [ ] Manual restart from menu
  - [ ] Mark as complete in localStorage

- [ ] Test tutorial
  - [ ] All steps work correctly
  - [ ] Can be skipped
  - [ ] Doesn't repeat after completion

---

## Polish & Quality (Ongoing)
**Goal:** Professional finish

### UX Improvements
- [ ] Add loading states
  - [ ] Loading spinner on game start
  - [ ] Smooth transitions between screens

- [ ] Add confirmation dialogs
  - [ ] Confirm quit without saving
  - [ ] Confirm restart mid-game

- [ ] Improve error handling
  - [ ] Graceful handling of missing sounds
  - [ ] Fallback for failed localStorage
  - [ ] User-friendly error messages

- [ ] Add keyboard shortcuts
  - [ ] Common commands (S for SRS, L for LRS)
  - [ ] Number keys for quick commands
  - [ ] ESC for menu

- [ ] Mobile optimization
  - [ ] Touch-friendly buttons
  - [ ] Responsive layout tweaks
  - [ ] Virtual keyboard handling

---

### Accessibility
- [ ] Screen reader support
  - [ ] ARIA labels for all interactive elements
  - [ ] Announce game state changes
  - [ ] Keyboard navigation

- [ ] Visual accessibility
  - [ ] High contrast mode option
  - [ ] Colorblind-friendly palette option
  - [ ] Font size adjustment

- [ ] Audio accessibility
  - [ ] Visual alternatives to sounds
  - [ ] Subtitle-style event log

---

### Performance
- [ ] Optimize animations
  - [ ] Use CSS transforms (GPU accelerated)
  - [ ] Avoid layout thrashing
  - [ ] Debounce rapid events

- [ ] Reduce bundle size
  - [ ] Code splitting if needed
  - [ ] Optimize sound file sizes
  - [ ] Tree-shake unused code

- [ ] Test on slow devices
  - [ ] No frame drops during animations
  - [ ] Responsive input handling

---

## Testing Checklist

### Functional Testing
- [ ] All commands work correctly
- [ ] Combat calculations are accurate
- [ ] Navigation works as expected
- [ ] Game over conditions trigger properly
- [ ] Victory/defeat logic is correct

### Engagement Testing
- [ ] Animations feel satisfying
- [ ] Sounds enhance immersion
- [ ] Scores provide clear goals
- [ ] Achievements are achievable
- [ ] Progression feels rewarding

### User Testing
- [ ] New player can understand game (tutorial helps)
- [ ] Mid-skill player finds challenge engaging
- [ ] Veteran player has mastery goals (S rank, Admiral)
- [ ] Players want to replay after winning

---

## Success Metrics

### Before Implementation
- Session length: ~5-8 minutes
- Completion rate: ~40%
- Replay rate: ~15%
- Player satisfaction: "It works"

### Target After Phase 1
- Session length: 12-15 minutes
- Completion rate: 60%+
- Replay rate: 40%+
- Player satisfaction: "This is fun!"

### Target After Phase 2
- Session length: 20-25 minutes
- Completion rate: 70%+
- Replay rate: 60%+
- Player satisfaction: "One more game..."

### Target After Phase 3
- Session length: 30+ minutes
- Completion rate: 75%+
- Replay rate: 80%+
- Player satisfaction: "I can't stop playing!"

---

## Implementation Notes

### File Organization
```
/games/startrek/
  client/
    src/
      lib/
        gameLogic.ts         [existing - modify]
        combatSystem.ts      [existing - modify]
        soundManager.ts      [create]
        scoring.ts           [create]
        achievements.ts      [create]
        difficulty.ts        [create]
        events.ts            [create]
        progression.ts       [create]
      styles/
        game.css             [existing - modify heavily]
      pages/
        Game.tsx             [existing - modify]
    public/
      sounds/                [create directory]
        phaser.mp3
        torpedo.mp3
        explosion.mp3
        ...
```

### Git Commits
Commit after each major feature:
- "feat(startrek): add visual feedback animations"
- "feat(startrek): add sound effect system"
- "feat(startrek): implement scoring system"
- "feat(startrek): add difficulty modes"
- "feat(startrek): implement achievement system"
- etc.

### Testing Strategy
- Test each feature in isolation
- Test combinations (achievements + scoring)
- Test edge cases (no localStorage, slow connection)
- Get user feedback after each phase
- Iterate based on feedback

---

## Priority Levels

### P0 - Must Have
- Visual feedback (juice)
- Sound effects
- Score system

### P1 - Should Have
- Difficulty modes
- Achievement system
- Save/load

### P2 - Nice to Have
- Random events
- Daily challenges
- Ship upgrades

### P3 - Future
- Multiplayer leaderboards
- Mission variety
- Story mode

---

Ready to transform Star Trek 1971 from functional to phenomenal!
