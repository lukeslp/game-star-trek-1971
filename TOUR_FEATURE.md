# Star Trek 1971 - Intro Tour Feature

## Overview

An interactive intro tour has been added to guide new users through the Star Trek 1971 game interface. The tour automatically launches for first-time visitors and can be manually triggered at any time.

## Implementation Details

### Technology
- **Library**: [driver.js](https://driverjs.com/) v1.4.0
- **Storage**: localStorage (key: `star-trek-tour-completed`)
- **Styling**: Custom CSS matching Star Trek theme

### Files Modified

1. **`client/src/hooks/useTour.ts`** (new)
   - Custom React hook for tour management
   - Tracks tour completion via localStorage
   - Configures 7 tour steps highlighting key UI elements
   - Provides `startTour()` and `resetTour()` functions

2. **`client/src/pages/Game.tsx`**
   - Integrated `useTour` hook
   - Auto-starts tour for new users (500ms delay)
   - Added help button (HelpCircle icon) in header to manually restart tour
   - Added `data-tour` attributes to key elements for tour targeting

3. **`client/src/index.css`**
   - Custom CSS for driver.js popovers
   - Star Trek themed styling (glowing borders, monospace font, primary colors)
   - Overlay and highlight effects matching game aesthetic

4. **`package.json`**
   - Added `driver.js` dependency

### Tour Steps

1. **Welcome** - Header/title introduction
2. **Status Display** - Stardate, Time, Condition, Energy, Shields, Torpedoes, Klingons
3. **Galaxy Map** - 8x8 grid, position markers, navigation
4. **Sector Scan** - Current quadrant, entity symbols
5. **Console Output** - Message log and game feedback
6. **Command Panel** - Quick action buttons (NAV, SRS, LRS, PHA, TOR, etc.)
7. **Command Input** - Manual command entry and execution

### Tour Behavior

- **Auto-start**: Launches automatically for new users after 500ms
- **Manual trigger**: Click the help icon (?) in the top-right of the header
- **Completion tracking**: Stored in localStorage, persists across sessions
- **User control**: Can skip, navigate back/forward, or complete tour
- **Responsive**: Works on all screen sizes

### Design Features

- **Star Trek themed**: Glowing green borders, monospace font, dark background
- **Accessible**: Clear progress indicators, keyboard navigation support
- **Non-intrusive**: Easy to skip, doesn't block gameplay
- **Persistent**: Remembers completion status across visits

## Usage

### For Users
1. New users will see the tour automatically on first visit
2. Click the help icon (?) in the header to restart the tour anytime
3. Use "Next →" / "← Back" buttons to navigate
4. Click "Start Mission!" to complete and begin playing

### For Developers

**Start tour programmatically:**
```typescript
import { useTour } from "@/hooks/useTour";

function MyComponent() {
  const { startTour } = useTour();
  
  return (
    <button onClick={startTour}>Start Tour</button>
  );
}
```

**Reset tour completion:**
```typescript
const { resetTour } = useTour();
resetTour(); // Clears localStorage, tour will auto-start on next load
```

**Check tour status:**
```typescript
const { hasSeenTour } = useTour();
console.log(hasSeenTour); // true/false
```

## Testing

1. **First-time experience**: Clear localStorage and reload
   ```javascript
   localStorage.removeItem('star-trek-tour-completed');
   location.reload();
   ```

2. **Manual trigger**: Click the help icon in the header

3. **Completion**: Tour should not auto-start after completion

## Future Enhancements

Potential improvements for future iterations:

- [ ] Add achievement for completing the tour
- [ ] Include tour step for specific game commands (e.g., "Try NAV now")
- [ ] Add animation/effects when highlighting elements
- [ ] Multi-language support
- [ ] Advanced tour for experienced players (strategy tips)
- [ ] Contextual help based on game state

## Browser Compatibility

Works in all modern browsers supporting:
- localStorage API
- CSS custom properties
- ES6+ JavaScript

---

**Author**: Created for dr.eamer.dev/games/star-trek  
**Date**: November 2025  
**Version**: 1.0.0

