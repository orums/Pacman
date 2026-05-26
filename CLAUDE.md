# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

This is a zero-build project. No package manager or bundler is required.

```bash
# Serve locally (requires Node.js for npx)
npx serve .

# Or any static HTTP server — e.g.:
python3 -m http.server 8080
```

Open the printed URL in a browser (or on the iPad via the local IP). There is no build, compile, or lint step.

There is no test suite. All testing is manual in the browser.

## Architecture

A classic Pacman game built with vanilla JavaScript and the HTML5 Canvas API, optimised for iPad and touch devices.

### File layout

```
Pacman/
├── index.html          # Entry point: mounts canvas, HUD, D-Pad, overlay
├── styles/
│   └── main.css        # All styling (CSS variables, responsive, retro theme)
└── src/
    ├── maze.js         # Tile grid, wall/dot data, rendering
    ├── pacman.js       # Pacman character: position, movement, animation
    ├── ghost.js        # Ghost AI (not yet implemented — empty file)
    ├── input.js        # Unified keyboard + swipe + D-Pad input
    └── game.js         # Main game loop, collision, scoring (not yet implemented — empty file)
```

Scripts are loaded in order via plain `<script>` tags in `index.html`: `maze → pacman → ghost → input → game`. Global classes and constants are therefore shared via the window scope — no module system is used.

### Component responsibilities

**`src/maze.js`**
- Manages a 28 × 31 tile grid (`LEVEL_1` array hardcoded as the map).
- Tile types: empty, wall, dot, power pellet, ghost door/house.
- `maze.isWall(col, row)` — used by Pacman for collision.
- `maze.eatDot(col, row)` — clears a tile and returns the point value.
- Renders the maze with blue walls (`#0000CC`) and gold dots (`#FFD700`).

**`src/pacman.js`**
- `DIR` constant: `{ UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3 }` — shared by `input.js` and `game.js`.
- `MOVE` array maps each direction to `{ dc, dr }` deltas.
- Pacman moves at 1.5 px/frame; direction changes are buffered via `nextDir`.
- Grid snapping is based on `Math.round(x / tileSize)`.
- Tunnel wrap: when Pacman exits left/right edge, it reappears on the other side.
- `draw(ctx)` uses `ctx.save/restore` with rotation for directional mouth.

**`src/input.js`**
- `InputHandler` unifies three input sources: keyboard (Arrow + WASD), swipe (≥ 30 px), D-Pad buttons.
- `consume()` returns the current direction without clearing it (holding a key maintains direction).
- `clear()` resets direction to `null` when needed.
- `DIR` is declared in `pacman.js` and must be loaded first.

**`src/ghost.js`** *(not yet implemented)*
- Will contain Ghost class(es) with AI modes: Chase, Scatter, Frightened.
- Ghosts start inside the ghost house; they exit one at a time.

**`src/game.js`** *(not yet implemented)*
- Will initialise all components and run the `requestAnimationFrame` game loop.
- Responsibilities: update → render cycle, collision detection, score/lives tracking, win/lose state, overlay display.

### HTML structure

```
#app
├── <header>          — HUD: score, level, lives, high score
├── <main>
│   └── <canvas id="gameCanvas">
├── #dpad             — Touch D-Pad (visible only on touch devices via CSS)
└── #overlay          — Start / Game Over / Win screen
```

### CSS conventions

- All colours and the font are defined as CSS variables at `:root` (`--yellow`, `--blue`, `--dark`, `--red`, `--pink`, `--cyan`, `--orange`, `--white`, `--font`).
- Font: `'Press Start 2P'` (Google Fonts, retro arcade style; fallback `Courier`).
- Canvas: `image-rendering: pixelated` for crisp pixel art.
- D-Pad is hidden on pointer-capable devices (`@media (pointer: fine)`) and shown on touch devices (`@media (pointer: coarse)`).
- Fluid type with `clamp()` — do not use fixed `px` font sizes in headers.

## JavaScript Conventions

- **No module system** — all code is in the global scope via `<script>` tags. Do not use `import`/`export`.
- **Class-based OOP** — each game entity is a class with `update(dt)` and `draw(ctx)` methods.
- **No external dependencies** — keep it pure vanilla JS. Do not add npm packages.
- **Private methods** are prefixed with `_` (e.g. `_canMove`, `_initKeyboard`).
- **JSDoc header** at the top of each file: `/** filename.js – short description */`.
- Constants that are shared across files (e.g. `DIR`, `MOVE`) live in the file that owns the concept (`pacman.js`) and are accessed globally.
- When adding the game loop in `game.js`, use `requestAnimationFrame`; compute `dt` (delta time in seconds) from timestamps and cap it (e.g. `Math.min(dt, 0.05)`) to avoid spiral-of-death on tab refocus.

## Current Implementation Status

| Feature | Status |
|---|---|
| Maze rendering | Done |
| Pacman movement & animation | Done |
| Keyboard + swipe + D-Pad input | Done |
| Ghost AI | Not started (`ghost.js` is empty) |
| Game loop / `requestAnimationFrame` | Not started (`game.js` is empty) |
| Collision detection | Not started |
| Dot eating & scoring | Not started |
| Power pellets & frightened ghosts | Not started |
| Lives & death sequence | Not started |
| Win condition (all dots eaten) | Not started |
| High score (localStorage) | Not started |
| PWA / service worker | Not started |

## Development Notes

- The game targets iPad and smartphone as the primary platform. Test touch controls, not just keyboard.
- The canvas size is set dynamically in `game.js` (to be implemented) based on `window.innerWidth/innerHeight`.
- `tileSize` is derived from canvas size divided by maze columns (28); all positions scale proportionally.
- The ghost house tiles use a special type so that only ghosts can pass through the door.
- Do not hardcode pixel sizes; always derive them from `maze.tileSize`.
