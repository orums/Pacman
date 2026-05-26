/**
 * maze.js – Pacman Labyrinth
 *
 * Kachel-Typen:
 *  0 = freier Weg (mit Punkt)
 *  1 = Mauer
 *  2 = leerer Weg (kein Punkt)
 *  3 = Power-Pellet
 *  4 = Geister-Haus (Eingang)
 *  5 = Geister-Haus (Innen)
 */

const TILE = {
  EMPTY_DOT: 0,
  WALL: 1,
  EMPTY: 2,
  POWER: 3,
  GHOST_DOOR: 4,
  GHOST_HOUSE: 5
};

// Klassisches 28×31 Pacman-Layout (vereinfacht)
const LEVEL_1 = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,1,0,1,1,0,1],
  [1,3,1,1,0,1,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,1,0,1,1,3,1],
  [1,0,1,1,0,1,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,1,0,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1],
  [1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1],
  [1,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,1],
  [1,1,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,1,1],
  [1,1,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,1,1],
  [1,1,1,1,0,1,1,2,2,2,2,2,2,4,4,2,2,2,2,2,2,1,1,0,1,1,1,1],
  [1,1,1,1,0,1,1,2,1,1,1,1,1,5,5,1,1,1,1,1,2,1,1,0,1,1,1,1],
  [1,1,1,1,0,1,1,2,1,5,5,5,5,5,5,5,5,5,5,1,2,1,1,0,1,1,1,1],
  [2,2,2,2,0,2,2,2,1,5,5,5,5,5,5,5,5,5,5,1,2,2,2,0,2,2,2,2],
  [1,1,1,1,0,1,1,2,1,5,5,5,5,5,5,5,5,5,5,1,2,1,1,0,1,1,1,1],
  [1,1,1,1,0,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,0,1,1,1,1],
  [1,1,1,1,0,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,0,1,1,1,1],
  [1,1,1,1,0,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,0,1,1,1,1],
  [1,1,1,1,0,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,0,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,1,0,1,1,0,1],
  [1,0,1,1,0,1,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,1,0,1,1,0,1],
  [1,3,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,3,1],
  [1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1],
  [1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,1,1,1,1,0,1],
  [1,0,1,1,1,1,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

class Maze {
  constructor(tileSize = 20) {
    this.tileSize = tileSize;
    this.cols = LEVEL_1[0].length;
    this.rows = LEVEL_1.length;
    this.grid = LEVEL_1.map(row => [...row]); // deep copy
    this.totalDots = this.countDots();
    this.dotsEaten = 0;
  }

  countDots() {
    let count = 0;
    for (const row of this.grid) {
      for (const cell of row) {
        if (cell === TILE.EMPTY_DOT || cell === TILE.POWER) count++;
      }
    }
    return count;
  }

  isWall(col, row) {
    if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) return true;
    const t = this.grid[row][col];
    return t === TILE.WALL;
  }

  isGhostDoor(col, row) {
    return this.grid[row]?.[col] === TILE.GHOST_DOOR;
  }

  eatDot(col, row) {
    const t = this.grid[row]?.[col];
    if (t === TILE.EMPTY_DOT) {
      this.grid[row][col] = TILE.EMPTY;
      this.dotsEaten++;
      return { points: 10, power: false };
    }
    if (t === TILE.POWER) {
      this.grid[row][col] = TILE.EMPTY;
      this.dotsEaten++;
      return { points: 50, power: true };
    }
    return null;
  }

  get completed() {
    return this.dotsEaten >= this.totalDots;
  }

  reset() {
    this.grid = LEVEL_1.map(row => [...row]);
    this.dotsEaten = 0;
  }

  draw(ctx) {
    const ts = this.tileSize;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const t = this.grid[r][c];
        const x = c * ts;
        const y = r * ts;

        if (t === TILE.WALL) {
          ctx.fillStyle = '#0000CC';
          ctx.fillRect(x, y, ts, ts);
          // Inner highlight
          ctx.strokeStyle = '#2121DE';
          ctx.lineWidth = 1;
          ctx.strokeRect(x + 1, y + 1, ts - 2, ts - 2);
        } else if (t === TILE.EMPTY_DOT) {
          ctx.fillStyle = '#FFCC88';
          ctx.beginPath();
          ctx.arc(x + ts / 2, y + ts / 2, ts * 0.1, 0, Math.PI * 2);
          ctx.fill();
        } else if (t === TILE.POWER) {
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(x + ts / 2, y + ts / 2, ts * 0.3, 0, Math.PI * 2);
          ctx.fill();
        } else if (t === TILE.GHOST_DOOR) {
          ctx.fillStyle = '#FFB8DE';
          ctx.fillRect(x, y + ts * 0.4, ts, ts * 0.2);
        }
      }
    }
  }
}
