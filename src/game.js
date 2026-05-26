const STATE = { TITLE: 0, PLAYING: 1, DEAD: 3, GAMEOVER: 5 };
const TILE_SIZE = 20;

class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.overlay = document.getElementById('overlay');
    this.titleEl = document.getElementById('overlay-title');
    this.msgEl = document.getElementById('overlay-msg');
    this.btnStart = document.getElementById('btn-start');
    this.maze = new Maze(TILE_SIZE);
    this.pacman = new Pacman(this.maze);
    this.ghosts = [0,1,2,3].map(i => new Ghost(i, this.maze));
    this.input = new InputHandler();
    this.score = 0; this.lives = 3; this.level = 1;
    this.highscore = parseInt(localStorage.getItem('pacman_hs') || '0');
    this.modeTimer = 0; this.modeIdx = 0; this.scatter = true;
    this.modeSchedule = [420, 1200, 420, 1200, 300, 60000];
    this._resize();
    window.addEventListener('resize', () => this._resize());
    this.btnStart.addEventListener('click', () => this._start());
    this.btnStart.addEventListener('touchend', e => { e.preventDefault(); this._start(); });
    this._showOv('PACMAN', 'Tap to Start');
    requestAnimationFrame(() => this._loop());
  }
  _resize() {
    const ts = TILE_SIZE, cols = this.maze.cols, rows = this.maze.rows;
    const maxW = window.innerWidth - 16, maxH = window.innerHeight * 0.65;
    this.scale = Math.min(maxW / (cols * ts), maxH / (rows * ts));
    this.canvas.width = Math.floor(cols * ts * this.scale);
    this.canvas.height = Math.floor(rows * ts * this.scale);
  }
  _start() {
    this.score = 0; this.lives = 3; this.level = 1;
    this.maze.reset(); this.pacman.reset();
    this.ghosts.forEach(g => g.reset());
    this.modeTimer = 0; this.modeIdx = 0; this.scatter = true;
    this.state = STATE.PLAYING;
    this._hideOv(); this._hud();
  }
  _showOv(t, m) { this.titleEl.textContent = t; this.msgEl.textContent = m; this.overlay.classList.remove('hidden'); }
  _hideOv() { this.overlay.classList.add('hidden'); }
  _hud() {
    document.getElementById('score').textContent = this.score;
    document.getElementById('level').textContent = this.level;
    document.getElementById('lives').textContent = this.lives;
    document.getElementById('highscore').textContent = this.highscore;
  }
  _modeSwitch() {
    this.modeTimer++;
    const thr = this.modeSchedule[this.modeIdx] || 60000;
    if (this.modeTimer >= thr) {
      this.modeTimer = 0;
      this.modeIdx = Math.min(this.modeIdx + 1, this.modeSchedule.length - 1);
      this.scatter = !this.scatter;
      this.ghosts.forEach(g => this.scatter ? g.setScatter() : g.setChase());
    }
  }
  _update() {
    if (this.state !== STATE.PLAYING) return;
    const dir = this.input.consume();
    if (dir !== null) this.pacman.setDirection(dir);
    this._modeSwitch();
    this.pacman.update();
    const r = this.maze.eatDot(this.pacman.tileX, this.pacman.tileY);
    if (r) {
      this.score += r.points;
      if (r.power) this.ghosts.forEach(g => g.frighten(300));
      this._hud();
    }
    this.ghosts.forEach(g => g.update(this.pacman));
    for (const g of this.ghosts) {
      if (!g.collidesWith(this.pacman)) continue;
      if (g.mode === GHOST_MODE.FRIGHTENED) { g.eat(); this.score += 200; this._hud(); }
      else if (g.mode !== GHOST_MODE.EATEN) { this._die(); return; }
    }
    if (this.maze.completed) {
      this.level++;
      this.maze.reset(); this.pacman.reset(); this.ghosts.forEach(g => g.reset());
      this._showOv('LEVEL ' + this.level, 'Get Ready!');
      setTimeout(() => { if (this.state === STATE.PLAYING) this._hideOv(); }, 2000);
    }
  }
  _die() {
    this.lives--;
    this._hud();
    if (this.lives <= 0) {
      if (this.score > this.highscore) { this.highscore = this.score; localStorage.setItem('pacman_hs', this.highscore); }
      this.state = STATE.GAMEOVER;
      this._showOv('GAME OVER', 'Score: ' + this.score);
    } else {
      this.pacman.reset(); this.ghosts.forEach(g => g.reset());
      this._showOv('READY!', this.lives + ' lives left');
      setTimeout(() => { if (this.state === STATE.PLAYING) this._hideOv(); }, 1500);
    }
  }
  _draw() {
    const ctx = this.ctx, s = this.scale;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.save(); ctx.scale(s, s);
    ctx.fillStyle = '#000014';
    ctx.fillRect(0, 0, this.maze.cols * TILE_SIZE, this.maze.rows * TILE_SIZE);
    this.maze.draw(ctx);
    this.ghosts.forEach(g => g.draw(ctx));
    this.pacman.draw(ctx);
    ctx.restore();
  }
  _loop() { this._update(); this._draw(); requestAnimationFrame(() => this._loop()); }
}

window.addEventListener('DOMContentLoaded', () => new Game());
