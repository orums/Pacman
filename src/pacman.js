/**
 * pacman.js – Pacman Spielfigur
 */

const DIR = { UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3 };

const MOVE = [
  { dc: 0, dr: -1 },  // UP
  { dc: 1, dr:  0 },  // RIGHT
  { dc: 0, dr:  1 },  // DOWN
  { dc: -1, dr: 0 }   // LEFT
];

class Pacman {
  constructor(maze) {
    this.maze = maze;
    this.reset();
  }

  reset() {
    this.col = 14;
    this.row = 23;
    this.x = this.col * this.maze.tileSize + this.maze.tileSize / 2;
    this.y = this.row * this.maze.tileSize + this.maze.tileSize / 2;
    this.dir = DIR.LEFT;
    this.nextDir = DIR.LEFT;
    this.speed = 1.5;         // px per frame
    this.mouthAngle = 0.25;   // radians
    this.mouthDir = 1;
    this.moving = false;
  }

  setDirection(dir) {
    this.nextDir = dir;
  }

  _canMove(dir) {
    const ts = this.maze.tileSize;
    const { dc, dr } = MOVE[dir];
    const nextCol = this.col + dc;
    const nextRow = this.row + dr;
    return !this.maze.isWall(nextCol, nextRow);
  }

  update() {
    const ts = this.maze.tileSize;

    // Try to change direction
    if (this._canMove(this.nextDir)) {
      this.dir = this.nextDir;
    }

    if (!this._canMove(this.dir)) {
      this.moving = false;
      return;
    }
    this.moving = true;

    const { dc, dr } = MOVE[this.dir];
    this.x += dc * this.speed;
    this.y += dr * this.speed;

    // Tunnel wrap (left <-> right)
    const maxX = this.maze.cols * ts;
    if (this.x < 0) this.x = maxX;
    if (this.x > maxX) this.x = 0;

    // Snap to grid when crossing tile centre
    this.col = Math.round(this.x / ts);
    this.row = Math.round(this.y / ts);

    // Animate mouth
    this.mouthAngle += 0.08 * this.mouthDir;
    if (this.mouthAngle > 0.4 || this.mouthAngle < 0.02) this.mouthDir *= -1;
  }

  draw(ctx) {
    const ts = this.maze.tileSize;
    const r = ts * 0.45;
    const angle = this.mouthAngle * Math.PI;

    // Rotation based on direction
    const rotations = [Math.PI * 1.5, 0, Math.PI * 0.5, Math.PI];
    const rot = rotations[this.dir];

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(rot);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r, angle, Math.PI * 2 - angle);
    ctx.closePath();
    ctx.fillStyle = '#FFD700';
    ctx.fill();

    // Eye
    ctx.beginPath();
    ctx.arc(r * 0.25, -r * 0.5, r * 0.12, 0, Math.PI * 2);
    ctx.fillStyle = '#000014';
    ctx.fill();

    ctx.restore();
  }

  get tileX() { return Math.round(this.x / this.maze.tileSize); }
  get tileY() { return Math.round(this.y / this.maze.tileSize); }
}
