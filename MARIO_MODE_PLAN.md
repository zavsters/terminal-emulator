# Mario Mode - Action Plan

## Overview
Add a hidden "Mario Mode" that transforms the terminal into a simple 8-bit style 2D side-scrolling game when the user types `mario` command.

## Design Philosophy
- **8-bit aesthetic**: Pixelated, simplified graphics
- **Dark UI integration**: Use black background with magenta accents to match terminal theme
- **Super simple**: Minimal sprites, basic shapes, clean design
- **Smooth gameplay**: 60fps game loop with proper physics

---

## Phase 1: Command Integration

### 1.1 Add `mario` Command
- [ ] Add `mario` command handler to commands object
- [ ] When executed, hide terminal interface
- [ ] Initialize Mario Mode
- [ ] Store terminal state (for restoration)

### 1.2 Terminal State Management
- [ ] Save current terminal output state
- [ ] Hide terminal container (`display: none` or `visibility: hidden`)
- [ ] Show game container
- [ ] Ensure smooth transition

---

## Phase 2: Game Structure Setup

### 2.1 HTML Structure
- [ ] Create game container div in HTML
- [ ] Initially hidden (same as terminal)
- [ ] Fullscreen container matching terminal dimensions
- [ ] Structure:
  ```html
  <div id="mario-game" class="mario-game hidden">
    <canvas id="game-canvas"></canvas>
    <div class="game-ui">
      <div class="instructions">Arrow Keys: Move | Space: Jump | Esc: Exit</div>
    </div>
  </div>
  ```

### 2.2 Canvas Setup
- [ ] Create canvas element
- [ ] Set canvas size to match viewport
- [ ] Get 2D rendering context
- [ ] Set pixelated rendering (disable image smoothing for 8-bit look)

---

## Phase 3: 8-bit Visual Design

### 3.1 Color Palette
- [ ] Background: Black (`#000000`)
- [ ] Sky: Dark purple/magenta gradient (`#1a0033` to `#330066`)
- [ ] Ground: Dark gray with magenta tint (`#2a1a3d`)
- [ ] Mario: Bright magenta (`#ff00ff`) with white details
- [ ] Blocks: Dark magenta (`#660066`) with lighter borders
- [ ] Coins/Items: Cyan (`#00ffff`) to match error color theme

### 3.2 8-bit Styling
- [ ] Use pixelated rendering (`imageSmoothingEnabled = false`)
- [ ] Low resolution sprites (16x16 or 32x32 pixels)
- [ ] Simple geometric shapes (rectangles, circles)
- [ ] Bold, chunky outlines
- [ ] Limited color palette (4-8 colors max)

### 3.3 CSS Styling
- [ ] Game container fullscreen
- [ ] Canvas with pixelated rendering
- [ ] Instructions overlay (top or bottom)
- [ ] Match terminal's dark aesthetic

---

## Phase 4: World/Level Design

### 4.1 Background
- [ ] Sky gradient (dark purple to darker purple)
- [ ] Simple cloud shapes (optional, very minimal)
- [ ] Stars (optional, small dots)

### 4.2 Ground
- [ ] Ground platform at bottom of screen
- [ ] Height: ~20% of screen
- [ ] Solid color with subtle texture/pattern
- [ ] Collision boundary

### 4.3 Blocks/Platforms
- [ ] 3-5 static blocks/platforms
- [ ] Simple rectangles
- [ ] Positioned at different heights
- [ ] Dark magenta with lighter border
- [ ] Collision detection boundaries

### 4.4 World Scrolling
- [ ] Camera follows player horizontally
- [ ] World width: 2-3x screen width
- [ ] Smooth scrolling (or pixel-perfect for 8-bit)
- [ ] Blocks positioned in world coordinates

---

## Phase 5: Player (Mario) Implementation

### 5.1 Player Sprite
- [ ] Simple 8-bit Mario:
  - Body: 16x24px rectangle (magenta)
  - Head: 8x8px circle on top (white or lighter magenta)
  - Hat: Small rectangle on head (darker magenta)
  - Arms/Legs: Simple rectangles
- [ ] Or even simpler: Just a colored rectangle with face details
- [ ] Minimal animation (optional: idle bounce)

### 5.2 Player Properties
- [ ] Position (x, y) in world coordinates
- [ ] Velocity (vx, vy)
- [ ] Size (width, height)
- [ ] On ground flag
- [ ] Facing direction (left/right)

### 5.3 Player Rendering
- [ ] Draw at screen position (world x - camera x)
- [ ] Simple rectangle or pixelated sprite
- [ ] Face direction indicator (optional)

---

## Phase 6: Physics System

### 6.1 Gravity
- [ ] Constant downward acceleration
- [ ] Value: ~0.5 pixels/frame² (adjustable)
- [ ] Applied every frame when not on ground

### 6.2 Horizontal Movement
- [ ] Left/Right arrow keys control horizontal velocity
- [ ] Acceleration when key pressed
- [ ] Friction when key released
- [ ] Max speed limit
- [ ] Smooth deceleration

### 6.3 Jumping
- [ ] Space bar triggers jump
- [ ] Only when on ground
- [ ] Initial upward velocity
- [ ] Gravity reduces upward velocity
- [ ] Can't jump in air (or allow double jump?)

### 6.4 Collision Detection
- [ ] Ground collision (bottom of screen)
- [ ] Block/platform collision:
  - Top collision (landing on block)
  - Side collision (hitting block from side)
  - Bottom collision (hitting block from below)
- [ ] Simple AABB (Axis-Aligned Bounding Box) collision

---

## Phase 7: Controls

### 7.1 Keyboard Input
- [ ] Arrow Left: Move left
- [ ] Arrow Right: Move right
- [ ] Space: Jump
- [ ] Esc: Exit Mario Mode

### 7.2 Input Handling
- [ ] Keydown event listeners
- [ ] Keyup event listeners
- [ ] Prevent default for game keys
- [ ] Store key states (pressed/released)

### 7.3 Input State Management
- [ ] Track which keys are currently pressed
- [ ] Update movement based on key states
- [ ] Handle key combinations

---

## Phase 8: Game Loop

### 8.1 Animation Loop
- [ ] `requestAnimationFrame` for smooth 60fps
- [ ] Update physics (gravity, velocity, position)
- [ ] Check collisions
- [ ] Update camera/world scroll
- [ ] Clear canvas
- [ ] Draw background
- [ ] Draw blocks/platforms
- [ ] Draw player
- [ ] Draw UI overlay

### 8.2 Frame Timing
- [ ] Delta time calculation (optional, for consistent physics)
- [ ] Or fixed timestep (simpler for 8-bit game)

### 8.3 Performance
- [ ] Efficient rendering (only redraw changed areas if possible)
- [ ] Optimize collision detection
- [ ] Limit update frequency if needed

---

## Phase 9: Exit Functionality

### 9.1 Esc Key Handler
- [ ] Listen for Esc key press
- [ ] Stop game loop (cancel animation frame)
- [ ] Clear game state
- [ ] Hide game container
- [ ] Show terminal container
- [ ] Restore terminal state
- [ ] Refocus terminal input

### 9.2 State Cleanup
- [ ] Remove event listeners
- [ ] Clear canvas
- [ ] Reset game variables
- [ ] Ensure no memory leaks

---

## Phase 10: Polish & Integration

### 10.1 Visual Polish
- [ ] Smooth transitions between terminal and game
- [ ] Consistent color scheme
- [ ] Pixel-perfect rendering
- [ ] Clean, minimal UI overlay

### 10.2 Game Feel
- [ ] Responsive controls
- [ ] Satisfying jump physics
- [ ] Smooth movement
- [ ] Proper collision feel

### 10.3 Error Handling
- [ ] Handle canvas not supported
- [ ] Handle window resize
- [ ] Graceful fallback if game fails to start

---

## Implementation Order

1. **Phase 1-2**: Command integration and HTML structure
2. **Phase 3**: Visual design and CSS
3. **Phase 4**: World/level setup
4. **Phase 5**: Player sprite and properties
5. **Phase 6**: Physics system (gravity, movement, collisions)
6. **Phase 7**: Controls
7. **Phase 8**: Game loop
8. **Phase 9**: Exit functionality
9. **Phase 10**: Polish and testing

---

## Technical Specifications

### Canvas Settings
```javascript
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.imageSmoothingEnabled = false; // Pixelated 8-bit look
```

### Player Constants
```javascript
const PLAYER = {
  width: 16,
  height: 24,
  speed: 3,
  jumpPower: -12,
  gravity: 0.5,
  friction: 0.8
};
```

### World Constants
```javascript
const WORLD = {
  width: 2000, // 2-3x screen width
  groundHeight: 100,
  blockSize: 32
};
```

### Color Palette
```javascript
const COLORS = {
  background: '#000000',
  sky: '#1a0033',
  ground: '#2a1a3d',
  mario: '#ff00ff',
  block: '#660066',
  blockBorder: '#880088',
  accent: '#00ffff'
};
```

---

## Success Criteria

✅ `mario` command activates game mode  
✅ Terminal hidden, game visible  
✅ 8-bit pixelated aesthetic  
✅ Dark UI with magenta/cyan accents  
✅ Player can move left/right  
✅ Player can jump  
✅ Gravity works  
✅ Collision detection with ground and blocks  
✅ Smooth 60fps game loop  
✅ Esc key exits and restores terminal  
✅ Terminal state preserved  
✅ Super simple, clean design  

---

## Notes

- Keep it minimal - this is a bonus feature, not a full game
- Focus on feel over features
- 8-bit aesthetic means chunky pixels, limited colors
- Match the terminal's dark, minimalist vibe
- Physics should feel responsive and fun
- Exit should be instant and seamless

