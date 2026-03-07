/* ═══════════════════════════════════════════
   Màn 2 – Happy Women's Day
   Fireworks với trail + shimmer text + confetti 3D
═══════════════════════════════════════════ */

const PETAL_EMOJIS    = ['🌸', '🌺', '🌷', '🌹', '💮', '🌼'];
const CONFETTI_COLORS = ['#FF4D8D', '#FFD700', '#D966C0', '#FFB3D1', '#E8D5FF', '#FF6B9D', '#7700CC'];
const FW_COLORS       = ['#FF4D8D', '#FFD700', '#D966C0', '#FFB3D1', '#E8D5FF', '#FF6B9D', '#FFFFFF', '#FF9F40'];

const LINES = [
  { id: 's2-g-sub',  text: '🌸  Chúc mừng Ngày Quốc Tế Phụ Nữ  🌸', delay: 0.1  },
  { id: 's2-g-main', text: "Happy Women's Day",                         delay: 0.8  },
  { id: 's2-g-date', text: '8 · 3 · 2026',                             delay: 1.7  },
];

/* ─────────────────────────────────────────
   Text – từng ký tự fade + rise với delay
───────────────────────────────────────── */
function buildText(container) {
  LINES.forEach(({ id, text, delay }) => {
    const el = container.querySelector(`#${id}`);
    if (!el) return;
    el.innerHTML = '';
    [...text].forEach((ch, i) => {
      const span             = document.createElement('span');
      span.className         = 'char-span';
      span.textContent       = ch === ' ' ? '\u00A0' : ch;
      span.style.animationDelay = `${delay + i * 0.048}s`;
      el.appendChild(span);
    });
  });
}

/* ─────────────────────────────────────────
   Petals – emoji rơi xuống
───────────────────────────────────────── */
function startPetals(container) {
  const layer = container.querySelector('#s2-petals-layer');
  const count = window.innerWidth < 768 ? 20 : 38;

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      if (!layer || !layer.isConnected) return;
      const el       = document.createElement('div');
      el.className   = 'petal';
      el.textContent = PETAL_EMOJIS[Math.floor(Math.random() * PETAL_EMOJIS.length)];
      const dur   = Math.random() * 6 + 5;
      const drift = (Math.random() - 0.5) * 220;
      el.style.cssText = `
        left: ${Math.random() * 100}%;
        --p-size:  ${Math.random() * 16 + 14}px;
        --p-dur:   ${dur}s;
        --p-delay: ${Math.random() * 4}s;
        --p-rot:   ${(Math.random() > 0.5 ? 1 : -1) * (Math.random() * 600 + 180)}deg;
        --p-drift: ${drift}px;
      `;
      layer.appendChild(el);
    }, i * 100);
  }
}

/* ─────────────────────────────────────────
   Confetti 3D
───────────────────────────────────────── */
function startConfetti(container) {
  const layer = container.querySelector('#s2-confetti-layer');
  if (!layer) return;
  const count = window.innerWidth < 768 ? 40 : 80;

  for (let i = 0; i < count; i++) {
    const el     = document.createElement('div');
    el.className = 'confetti-piece';
    const isRect = Math.random() > 0.4;
    const w      = Math.random() * 6 + 5;
    const h      = isRect ? w * (Math.random() + 1.2) : w;
    const dur    = Math.random() * 5 + 4;
    const delay  = Math.random() * 4;
    const drift  = (Math.random() - 0.5) * 300;
    const rot    = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 720 + 360);
    const color  = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];

    el.style.cssText = `
      left: ${Math.random() * 100}%;
      --c-w:     ${w}px;
      --c-h:     ${h}px;
      --c-color: ${color};
      --c-dur:   ${dur}s;
      --c-delay: ${delay}s;
      --c-drift: ${drift}px;
      --c-rot:   ${rot}deg;
      --c-br:    ${isRect ? '2px' : '50%'};
    `;
    layer.appendChild(el);
  }
}

/* ─────────────────────────────────────────
   Fireworks Canvas – trail effect + star burst
───────────────────────────────────────── */
class TrailParticle {
  constructor(x, y) {
    const angle   = Math.random() * Math.PI * 2;
    const speed   = Math.random() * 6 + 1.5;
    this.x        = x;
    this.y        = y;
    this.vx       = Math.cos(angle) * speed;
    this.vy       = Math.sin(angle) * speed;
    this.alpha    = 1;
    this.size     = Math.random() * 3.5 + 1;
    this.color    = FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)];
    this.decay    = Math.random() * 0.016 + 0.008;
    this.trail    = [];
    this.isStar   = Math.random() < 0.3;
  }

  update() {
    this.trail.push({ x: this.x, y: this.y, a: this.alpha });
    if (this.trail.length > 6) this.trail.shift();
    this.x    += this.vx;
    this.y    += this.vy;
    this.vy   += 0.045;
    this.vx   *= 0.975;
    this.vy   *= 0.985;
    this.alpha -= this.decay;
  }

  draw(ctx) {
    this.trail.forEach((pt, i) => {
      const ta = pt.a * (i / this.trail.length) * 0.4;
      ctx.save();
      ctx.globalAlpha = Math.max(ta, 0);
      ctx.fillStyle   = this.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, this.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    ctx.save();
    ctx.globalAlpha = Math.max(this.alpha, 0);
    ctx.fillStyle   = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur  = 10;
    if (this.isStar) {
      drawStar5(ctx, this.x, this.y, this.size * 1.5, this.size * 0.6);
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  dead() { return this.alpha <= 0; }
}

function drawStar5(ctx, x, y, outer, inner) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r   = i % 2 === 0 ? outer : inner;
    const ang = (i * Math.PI / 5) - Math.PI / 2;
    if (i === 0) ctx.moveTo(x + r * Math.cos(ang), y + r * Math.sin(ang));
    else         ctx.lineTo(x + r * Math.cos(ang), y + r * Math.sin(ang));
  }
  ctx.closePath();
  ctx.fill();
}

class Burst {
  constructor(w, h) {
    this.x = Math.random() * w * 0.78 + w * 0.11;
    this.y = Math.random() * h * 0.5  + h * 0.05;
    const count    = 60 + Math.floor(Math.random() * 30);
    this.particles = Array.from({ length: count }, () => new TrailParticle(this.x, this.y));
  }
  update() { this.particles = this.particles.filter(p => { p.update(); return !p.dead(); }); }
  draw(ctx) { this.particles.forEach(p => p.draw(ctx)); }
  dead()    { return this.particles.length === 0; }
}

function startFireworks(container) {
  const canvas  = container.querySelector('#s2-fw-canvas');
  const ctx     = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  function onResize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', onResize);

  let fwRafId  = null;
  let fwBursts = [];
  let lastBurst = 0;
  let interval  = 500;

  function loop(ts) {
    ctx.fillStyle = 'rgba(13,0,16,0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (ts - lastBurst > interval) {
      const bCount = Math.random() < 0.3 ? 2 : 1;
      for (let i = 0; i < bCount; i++) {
        fwBursts.push(new Burst(canvas.width, canvas.height));
      }
      lastBurst = ts;
      interval  = Math.random() * 450 + 320;
    }

    fwBursts = fwBursts.filter(b => { b.update(); b.draw(ctx); return !b.dead(); });
    fwRafId  = requestAnimationFrame(loop);
  }

  fwRafId = requestAnimationFrame(loop);

  return function stop() {
    if (fwRafId) { cancelAnimationFrame(fwRafId); fwRafId = null; }
    fwBursts = [];
    window.removeEventListener('resize', onResize);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
}

/* ─────────────────────────────────────────
   Entry point
───────────────────────────────────────── */
export function initScreen2(container, onComplete) {
  container.innerHTML = `
    <canvas id="s2-fw-canvas"></canvas>
    <div id="s2-confetti-layer"></div>
    <div id="s2-petals-layer"></div>
    <div class="s2-content">
      <div class="greeting-container">
        <div class="greeting-sub"  id="s2-g-sub"></div>
        <div class="greeting-main-wrap">
          <div class="greeting-main" id="s2-g-main"></div>
        </div>
        <div class="greeting-date" id="s2-g-date"></div>
      </div>
    </div>
  `;

  buildText(container);
  startPetals(container);
  startConfetti(container);
  const stopFW = startFireworks(container);

  let completed = false;

  function advance() {
    if (completed) return;
    completed = true;
    stopFW();
    onComplete();
  }

  container.addEventListener('click',      advance);
  container.addEventListener('touchstart', advance, { passive: true });
  const autoTimer = setTimeout(advance, 9000);

  return function destroy() {
    stopFW();
    clearTimeout(autoTimer);
    container.removeEventListener('click',      advance);
    container.removeEventListener('touchstart', advance);
  };
}
