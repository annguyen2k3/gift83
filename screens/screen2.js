const PETAL_COLORS = [
  '#fda4af', '#fb7185', '#f472b6', '#e879f9',
  '#c084fc', '#f9a8d4', '#fecdd3', '#ddd6fe',
  '#fce7f3', '#fbcfe8', '#ffffff',
];

// Xây span từng ký tự với animation-delay
function buildChars(text, baseDelay, gap) {
  let idx = 0;
  return [...text].map((ch) => {
    const delay = (baseDelay + idx * gap).toFixed(2);
    idx++;
    if (ch === ' ') return `<span class="s2-space">&nbsp;</span>`;
    return `<span class="s2-char" style="animation-delay:${delay}s">${ch}</span>`;
  }).join('');
}

export function initScreen2(container, onComplete) {
  container.innerHTML = `
    <canvas class="s2-canvas" id="s2-canvas"></canvas>
    <div class="s2-vignette"></div>

    <div class="s2-phase" id="s2-phase-1"></div>
    <div class="s2-phase" id="s2-phase-2"></div>

    <div class="s2-hint" id="s2-hint">Chạm để tiếp tục</div>
  `;

  const phase1El = container.querySelector('#s2-phase-1');
  const phase2El = container.querySelector('#s2-phase-2');
  const hint     = container.querySelector('#s2-hint');

  // ─── Canvas ───
  const canvas = container.querySelector('#s2-canvas');
  const ctx    = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // ─── Phase 1: "Chúc Mừng" ───
  function showPhase1() {
    phase1El.innerHTML = `
      <div class="s2-big">${buildChars('Chúc Mừng', 0.6, 0.18)}</div>
    `;
    // Snap active (no transition on enter – chars handle their own reveal)
    phase1El.classList.add('active');
  }

  // ─── Phase 2: "Ngày Quốc Tế Phụ Nữ" ───
  function showPhase2() {
    phase2El.innerHTML = `
      <div class="s2-sub-line">${buildChars('Ngày Quốc Tế', 0.05, 0.1)}</div>
      <div class="s2-big s2-big--alt">${buildChars('Phụ Nữ', 1.2, 0.2)}</div>
    `;
    phase2El.classList.add('active');
  }

  // ─── Particle factories ───
  function mkPetal() {
    return {
      x: Math.random() * canvas.width, y: -20,
      vx: (Math.random() - 0.5) * 1.4,
      vy: Math.random() * 1.6 + 0.7,
      rot: Math.random() * Math.PI * 2,
      rotSpd: (Math.random() - 0.5) * 0.07,
      w: Math.random() * 14 + 5, h: Math.random() * 7 + 3,
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      alpha: Math.random() * 0.4 + 0.4,
      swayAmp: Math.random() * 28 + 10,
      swayFrq: Math.random() * 0.015 + 0.007,
      swayOff: Math.random() * Math.PI * 2,
    };
  }

  function mkSparkle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.8,
      r: Math.random() * 2.5 + 0.5,
      alpha: 0, maxA: Math.random() * 0.7 + 0.3,
      spd: Math.random() * 0.025 + 0.008, phase: 'in',
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    };
  }

  function mkFirework(x, y) {
    const color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
    const n = 10 + Math.floor(Math.random() * 7);
    return {
      life: 1.0,
      particles: Array.from({ length: n }, (_, i) => {
        const angle = (i / n) * Math.PI * 2 + Math.random() * 0.3;
        const spd   = Math.random() * 4 + 2;
        return { x, y, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd,
                 r: Math.random() * 2 + 1, alpha: 1, color };
      }),
    };
  }

  // ─── Draw ───
  function drawPetal(p, t) {
    const sx = p.swayAmp * Math.sin(p.swayFrq * t + p.swayOff);
    ctx.save();
    ctx.translate(p.x + sx, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle   = p.color;
    ctx.shadowBlur  = 5;
    ctx.shadowColor = p.color;
    ctx.beginPath();
    ctx.moveTo(0, -p.h / 2);
    ctx.quadraticCurveTo( p.w / 2, 0, 0,  p.h / 2);
    ctx.quadraticCurveTo(-p.w / 2, 0, 0, -p.h / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawSparkle(s) {
    ctx.save();
    ctx.globalAlpha = s.alpha;
    ctx.shadowBlur  = s.r * 10;
    ctx.shadowColor = s.color;
    ctx.fillStyle   = '#fff';
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth   = 0.7;
    ctx.beginPath();
    ctx.moveTo(s.x - s.r * 2.5, s.y); ctx.lineTo(s.x + s.r * 2.5, s.y);
    ctx.moveTo(s.x, s.y - s.r * 2.5); ctx.lineTo(s.x, s.y + s.r * 2.5);
    ctx.stroke();
    ctx.restore();
  }

  function drawFirework(fw) {
    for (const p of fw.particles) {
      p.x += p.vx; p.y += p.vy;
      p.vx *= 0.95; p.vy *= 0.95;
      p.alpha = fw.life;
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.shadowBlur  = p.r * 6;
      ctx.shadowColor = p.color;
      ctx.fillStyle   = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // ─── Anim loop ───
  const petals = [], sparkles = [], fireworks = [];
  let emitting = false, lastTime = null, totalTime = 0;
  let completed = false, animId;

  function animate(ts) {
    animId = requestAnimationFrame(animate);
    if (!lastTime) lastTime = ts;
    const delta = Math.min(ts - lastTime, 80);
    lastTime = ts;
    totalTime += delta;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (emitting) {
      if (Math.random() < 0.4)          petals.push(mkPetal());
      if (totalTime % 650  < delta + 5) sparkles.push(mkSparkle());
      if (totalTime % 1500 < delta + 5) {
        fireworks.push(mkFirework(
          canvas.width  * (0.1 + Math.random() * 0.8),
          canvas.height * (0.1 + Math.random() * 0.5),
        ));
      }
    }

    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i];
      p.y += p.vy; p.rot += p.rotSpd;
      if (p.y > canvas.height + 30) { petals.splice(i, 1); continue; }
      drawPetal(p, totalTime / 1000);
    }

    for (let i = sparkles.length - 1; i >= 0; i--) {
      const s = sparkles[i];
      if (s.phase === 'in') {
        s.alpha += s.spd;
        if (s.alpha >= s.maxA) { s.alpha = s.maxA; s.phase = 'out'; }
      } else {
        s.alpha -= s.spd * 0.7;
        if (s.alpha <= 0) { sparkles.splice(i, 1); continue; }
      }
      drawSparkle(s);
    }

    for (let i = fireworks.length - 1; i >= 0; i--) {
      const fw = fireworks[i];
      fw.life -= delta / 1400;
      if (fw.life <= 0) { fireworks.splice(i, 1); continue; }
      drawFirework(fw);
    }
  }

  requestAnimationFrame(animate);

  // ─── Kịch bản timing ───
  showPhase1();
  setTimeout(() => { emitting = true; }, 1500);

  // Phase 1 thoát → Phase 2 xuất hiện
  setTimeout(() => { phase1El.classList.add('exit'); }, 3800);
  setTimeout(showPhase2, 4450);

  // Hint và advance
  let canAdvance = false;
  setTimeout(() => { canAdvance = true; }, 5500);
  setTimeout(() => hint.classList.add('show'), 6000);

  function advance() {
    if (!canAdvance || completed) return;
    completed = true;
    onComplete();
  }

  container.addEventListener('click',      advance);
  container.addEventListener('touchstart', advance, { passive: true });
  const autoTimer = setTimeout(advance, 9000);

  // ─── Cleanup ───
  return function destroy() {
    cancelAnimationFrame(animId);
    clearTimeout(autoTimer);
    window.removeEventListener('resize', resizeCanvas);
    container.removeEventListener('click', advance);
  };
}
