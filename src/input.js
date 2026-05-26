/**
 * input.js – Keyboard & Touch Input Handler
 */

class InputHandler {
  constructor() {
    this.direction = null;
    this.swipeStart = null;
    this._initKeyboard();
    this._initTouch();
    this._initDpad();
  }

  _initKeyboard() {
    const keyMap = {
      'ArrowUp':    DIR.UP,
      'ArrowRight': DIR.RIGHT,
      'ArrowDown':  DIR.DOWN,
      'ArrowLeft':  DIR.LEFT,
      'w': DIR.UP, 'W': DIR.UP,
      'd': DIR.RIGHT, 'D': DIR.RIGHT,
      's': DIR.DOWN,  'S': DIR.DOWN,
      'a': DIR.LEFT,  'A': DIR.LEFT
    };

    document.addEventListener('keydown', e => {
      if (keyMap[e.key] !== undefined) {
        e.preventDefault();
        this.direction = keyMap[e.key];
      }
    });
  }

  _initTouch() {
    const canvas = document.getElementById('gameCanvas');
    const MIN_SWIPE = 30;

    canvas.addEventListener('touchstart', e => {
      e.preventDefault();
      const t = e.touches[0];
      this.swipeStart = { x: t.clientX, y: t.clientY };
    }, { passive: false });

    canvas.addEventListener('touchend', e => {
      e.preventDefault();
      if (!this.swipeStart) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - this.swipeStart.x;
      const dy = t.clientY - this.swipeStart.y;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (Math.max(absDx, absDy) < MIN_SWIPE) return;

      if (absDx > absDy) {
        this.direction = dx > 0 ? DIR.RIGHT : DIR.LEFT;
      } else {
        this.direction = dy > 0 ? DIR.DOWN : DIR.UP;
      }
      this.swipeStart = null;
    }, { passive: false });
  }

  _initDpad() {
    const map = {
      'btn-up':    DIR.UP,
      'btn-right': DIR.RIGHT,
      'btn-down':  DIR.DOWN,
      'btn-left':  DIR.LEFT
    };

    Object.entries(map).forEach(([id, dir]) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      const setDir = e => { e.preventDefault(); this.direction = dir; };
      btn.addEventListener('touchstart', setDir, { passive: false });
      btn.addEventListener('mousedown', setDir);
    });
  }

  consume() {
    const d = this.direction;
    // Keep direction buffered (don't reset) so holding key works
    return d;
  }

  clear() {
    this.direction = null;
  }
}
