const GHOST_MODE = { SCATTER: 0, CHASE: 1, FRIGHTENED: 2, EATEN: 3 };
const GHOST_COLORS = ['#FF0000', '#FFB8FF', '#00FFFF', '#FFB852'];
const SCATTER_TARGETS = [
  { col: 25, row: 0 }, { col: 2, row: 0 },
  { col: 27, row: 30 }, { col: 0, row: 30 }
];

class Ghost {
  constructor(index, maze) {
    this.index = index;
    this.maze = maze;
    this.color = GHOST_COLORS[index];
    this.scatter = SCATTER_TARGETS[index];
    this.reset();
  }
  reset() {
    const ts = this.maze.tileSize;
    this.col = 13 + this.index % 2;
    this.row = 13 + Math.floor(this.index / 2);
    this.x = this.col * ts + ts / 2;
    this.y = this.row * ts + ts / 2;
    this.dir = 0;
    this.mode = GHOST_MODE.SCATTER;
    this.speed = 1.2;
    this.frightenedTimer = 0;
  }
  frighten(dur) {
    if (this.mode !== GHOST_MODE.EATEN) {
      this.mode = GHOST_MODE.FRIGHTENED;
      this.frightenedTimer = dur;
      this.speed = 0.7;
    }
  }
  eat() { this.mode = GHOST_MODE.EATEN; this.speed = 2.5; }
  setChase() { if (this.mode < 2) this.mode = GHOST_MODE.CHASE; }
  setScatter() { if (this.mode < 2) this.mode = GHOST_MODE.SCATTER; }
  _target(pac) {
    const p = { col: pac.tileX, row: pac.tileY };
    if (this.index === 1) {
      const m = MOVE[pac.dir];
      return { col: p.col + m.dc * 4, row: p.row + m.dr * 4 };
    }
    if (this.index === 3) {
      return Math.hypot(this.col - p.col, this.row - p.row) < 8 ? this.scatter : p;
    }
    return p;
  }
  _bestDir(tgt) {
    const opp = (this.dir + 2) % 4;
    let best = -1, bestD = Infinity;
    for (let d = 0; d < 4; d++) {
      if (d === opp) continue;
      const { dc, dr } = MOVE[d];
      const nc = this.col + dc, nr = this.row + dr;
      if (this.maze.isWall(nc, nr)) continue;
      if (this.mode !== GHOST_MODE.EATEN && this.maze.isGhostDoor(nc, nr)) continue;
      const dist = Math.hypot(nc - tgt.col, nr - tgt.row);
      if (dist < bestD) { bestD = dist; best = d; }
    }
    return best === -1 ? opp : best;
  }
  _randDir() {
    const opp = (this.dir + 2) % 4;
    const dirs = [0,1,2,3].filter(d => {
      if (d === opp) return false;
      const { dc, dr } = MOVE[d];
      return !this.maze.isWall(this.col + dc, this.row + dr);
    });
    return dirs.length ? dirs[Math.floor(Math.random() * dirs.length)] : opp;
  }
  update(pac) {
    const ts = this.maze.tileSize;
    if (this.mode === GHOST_MODE.FRIGHTENED) {
      this.frightenedTimer--;
      if (this.frightenedTimer <= 0) { this.mode = GHOST_MODE.SCATTER; this.speed = 1.2; }
    }
    if (this.mode === GHOST_MODE.EATEN) {
      if (Math.abs(this.col - 14) < 1 && Math.abs(this.row - 13) < 1) {
        this.mode = GHOST_MODE.SCATTER; this.speed = 1.2;
      } else { this.dir = this._bestDir({ col: 14, row: 13 }); }
    }
    const cx = Math.round(this.x / ts) * ts + ts / 2;
    const cy = Math.round(this.y / ts) * ts + ts / 2;
    if (Math.abs(this.x - cx) < this.speed + 1 && Math.abs(this.y - cy) < this.speed + 1) {
      this.col = Math.round(this.x / ts);
      this.row = Math.round(this.y / ts);
      this.x = cx; this.y = cy;
      if (this.mode === GHOST_MODE.FRIGHTENED) this.dir = this._randDir();
      else if (this.mode === GHOST_MODE.SCATTER) this.dir = this._bestDir(this.scatter);
      else this.dir = this._bestDir(this._target(pac));
    }
    const { dc, dr } = MOVE[this.dir];
    this.x += dc * this.speed;
    this.y += dr * this.speed;
    const maxX = this.maze.cols * ts;
    if (this.x < 0) this.x = maxX;
    if (this.x > maxX) this.x = 0;
  }
  draw(ctx) {
    const ts = this.maze.tileSize;
    const r = ts * 0.45;
    let color = this.color;
    if (this.mode === GHOST_MODE.EATEN) {
      this._eyes(ctx, this.x, this.y, r); return;
    }
    if (this.mode === GHOST_MODE.FRIGHTENED) {
      color = this.frightenedTimer < 60 && Math.floor(Date.now()/200)%2===0 ? '#FFF' : '#00C';
    }
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.x, this.y - r * 0.1, r, Math.PI, 0);
    for (let i = 0; i < 3; i++) {
      const bx = this.x + r - i * (r * 2 / 3);
      ctx.arc(bx - r / 3, this.y + r * 0.9, r / 3, 0, Math.PI, i % 2 === 0);
    }
    ctx.closePath();
    ctx.fill();
    this._eyes(ctx, this.x, this.y, r);
    ctx.restore();
  }
  _eyes(ctx, x, y, r) {
    [-r*0.3, r*0.3].forEach(ox => {
      ctx.beginPath(); ctx.arc(x+ox, y-r*0.2, r*0.2, 0, Math.PI*2);
      ctx.fillStyle = '#FFF'; ctx.fill();
      ctx.beginPath(); ctx.arc(x+ox+r*0.08, y-r*0.15, r*0.1, 0, Math.PI*2);
      ctx.fillStyle = '#00C'; ctx.fill();
    });
  }
  collidesWith(pac) {
    return Math.hypot(this.x - pac.x, this.y - pac.y) < this.maze.tileSize * 0.8;
  }
}
