import * as THREE from 'three';

/* ══════════════════════════════════════════════════════
   Màn 3 – Rose Heart Explosion → 3D Sphere → Gifts
══════════════════════════════════════════════════════ */

const ROSE_HEART  = 'img/\u2014Pngtree\u2014pink and red rose flower_20399304.png';
const PETAL_IMGS  = ['img/\u2014Pngtree\u2014warm rose petals falling on_7252943.png', 'img/canh_hoa_hong_hong.png'];
const BOUQUET     = 'img/bo_hoa_hong.png';

const HEART_PATHS = [
  'img/\u2014Pngtree\u20143d heart design vector_5884040.png',
  'img/\u2014Pngtree\u2014glossy heart best vector ai_7581956.png',
  'img/\u2014Pngtree\u2014valentines day 3d stereo love_8973611.png',
  'img/\u2014Pngtree\u2014a 3d rendering of pink_20317137.png',
];

/* ── Fibonacci sphere distribution ── */
function fibSphere(n, r) {
  const pts = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y     = 1 - (i / (n - 1)) * 2;
    const rad   = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = phi * i;
    pts.push(new THREE.Vector3(rad * Math.cos(theta) * r, y * r, rad * Math.sin(theta) * r));
  }
  return pts;
}

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function lerpN(a, b, t)  { return a + (b - a) * t; }

/* ═══════════════════════════════════════
   PHASE 1 – Rose Heart + Petal Explosion
═══════════════════════════════════════ */

function buildPhase1(container) {
  const div = document.createElement('div');
  div.id = 's3-phase1';
  div.innerHTML = `<img id="s3-rose-heart" src="${ROSE_HEART}" alt="" draggable="false">`;
  container.appendChild(div);
  return div;
}

/* ─── Spawn 1 cánh hoa: opacity 0 → fade-in khi bay → fade-out ─── */
function spawnCenterPetal(imgSrc, cx, cy, tx, ty, size, flyDur, delayMs, holdMs) {
  const petal     = document.createElement('div');
  petal.className = 's3-petal-fly';
  const rot        = ((Math.random() - 0.5) * 540).toFixed(1);
  const scaleLand  = (0.55 + Math.random() * 0.5).toFixed(2);
  const fadeInDur  = Math.min(flyDur * 0.45, 0.35);
  const fadeOutDur = 0.35;

  petal.style.cssText = `
    left:    ${cx - size / 2}px;
    top:     ${cy - size / 2}px;
    width:   ${size}px;
    height:  ${size}px;
    background: url('${imgSrc}') center / contain no-repeat;
    opacity: 0;
  `;
  document.body.appendChild(petal);

  /* Sau delay: bắt đầu bay + fade-in đồng thời */
  const t1 = setTimeout(() => {
    petal.style.transition = [
      `transform ${flyDur.toFixed(2)}s cubic-bezier(0.12, 0.8, 0.3, 1)`,
      `opacity   ${fadeInDur.toFixed(2)}s ease-out`,
    ].join(', ');
    requestAnimationFrame(() => {
      petal.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${scaleLand})`;
      petal.style.opacity   = '1';
    });

    /* Sau khi bay xong + hold: fade-out */
    const t2 = setTimeout(() => {
      petal.style.transition = `opacity ${fadeOutDur}s ease-in`;
      petal.style.opacity    = '0';
      setTimeout(() => petal.remove(), (fadeOutDur + 0.3) * 1000);
    }, flyDur * 1000 + holdMs);

    petal._t2 = t2;
  }, delayMs);

  petal._t1 = t1;
}

function triggerExplosion(container, onDone) {
  const heart    = container.querySelector('#s3-rose-heart');
  const w        = window.innerWidth;
  const h        = window.innerHeight;
  const cx       = w / 2;
  const cy       = h / 2;
  const isMobile = w < 768;

  /* Dừng animation tim – giữ hiển thị, chờ cánh hoa che phủ mới mờ */
  heart.classList.remove('beating');
  heart.style.animation = 'none';

  /* ── Tham số lưới ── */
  const cols    = isMobile ? 20 : 28;
  const rows    = isMobile ? 22 : 24;
  const total   = isMobile ? 1500 : 2700;
  const HOLD_MS = 0;

  /* Bán kính vùng spawn bên trong trái tim */
  const heartR = Math.min(w * 0.32, h * 0.28, 200);

  /* ── Nhóm A (~30%): đích nằm GẦN trung tâm – che kín trái tim ── */
  const countA  = Math.round(total * 0.30);
  const targetsA = [];
  for (let i = 0; i < countA; i++) {
    const a  = Math.random() * Math.PI * 2;
    const rr = Math.sqrt(Math.random()) * heartR * 1.3;
    targetsA.push({ fx: cx + rr * Math.cos(a), fy: cy + rr * Math.sin(a) * 0.85 });
  }

  /* ── Nhóm B (~70%): lưới phủ toàn màn hình ── */
  const gridTargets = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tx = (c / (cols - 1)) * (w * 1.15) - w * 0.075 - cx + (Math.random() - 0.5) * 30;
      const ty = (r / (rows - 1)) * (h * 1.15) - h * 0.075 - cy + (Math.random() - 0.5) * 30;
      gridTargets.push({ fx: cx + tx, fy: cy + ty });
    }
  }
  gridTargets.sort(() => Math.random() - 0.5);
  while (gridTargets.length < total - countA) {
    gridTargets.push({
      fx: cx + (Math.random() - 0.5) * w * 1.2,
      fy: cy + (Math.random() - 0.5) * h * 1.2,
    });
  }

  /* ── Gộp & xáo trộn ── */
  const allTargets = [...targetsA, ...gridTargets.slice(0, total - countA)];
  allTargets.sort(() => Math.random() - 0.5);

  /* ── Spawn từng cánh từ vị trí ngẫu nhiên trong trái tim ── */
  for (let i = 0; i < total; i++) {
    const { fx, fy } = allTargets[i];
    const imgSrc     = PETAL_IMGS[i % 2];
    const size       = Math.round(12 + Math.random() * 15);
    const flyDur     = 0.8 + Math.random() * 0.7;
    const delayMs    = Math.floor((i / total) * 800);

    const angle = Math.random() * Math.PI * 2;
    const r     = Math.sqrt(Math.random()) * heartR;
    const sx    = cx + r * Math.cos(angle);
    const sy    = cy + r * Math.sin(angle) * 0.85;

    spawnCenterPetal(imgSrc, sx, sy, fx - sx, fy - sy, size, flyDur, delayMs, HOLD_MS);
  }

  /* Trái tim mờ dần sau 1.2s – lúc này cánh hoa đã che phủ vùng trung tâm */
  setTimeout(() => {
    heart.style.transition = 'opacity 0.5s ease-in';
    heart.style.opacity    = '0';
  }, 1200);

  /* onDone khi màn hình đã phủ kín */
  setTimeout(onDone, 1800);
}

/* ═══════════════════════════════════════
   PHASE 2 – Three.js 3D Heart Sphere
═══════════════════════════════════════ */

function buildThreeScene(container, onZoomComplete) {
  const canvas = document.createElement('canvas');
  canvas.id    = 's3-three-canvas';
  container.appendChild(canvas);

  const glowEl = document.createElement('div');
  glowEl.id    = 's3-glow-aura';
  container.appendChild(glowEl);

  const hint        = document.createElement('div');
  hint.id           = 's3-tap-hint';
  hint.textContent  = '✨  Nhấn để khám phá  ✨';
  container.appendChild(hint);

  /* ── Renderer ── */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 5.2;

  /* ── Ambient star particles ── */
  const starCount = window.innerWidth < 768 ? 350 : 700;
  const starPos   = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    starPos[i * 3]     = (Math.random() - 0.5) * 28;
    starPos[i * 3 + 1] = (Math.random() - 0.5) * 28;
    starPos[i * 3 + 2] = (Math.random() - 0.5) * 28;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0xFFB3D1, size: 0.05, transparent: true, opacity: 0.55, sizeAttenuation: true,
  });
  scene.add(new THREE.Points(starGeo, starMat));

  /* ── Heart sphere ── */
  const sphereGroup  = new THREE.Group();
  scene.add(sphereGroup);

  const heartCount = window.innerWidth < 768 ? 120 : 220;
  const positions  = fibSphere(heartCount, 2);
  const loader     = new THREE.TextureLoader();

  let loadedTextures = 0;
  const sprites      = [];

  HEART_PATHS.forEach((path, ti) => {
    loader.load(
      path,
      (texture) => {
        loadedTextures++;
        positions.forEach((pos, idx) => {
          if (idx % HEART_PATHS.length !== ti) return;
          const mat = new THREE.SpriteMaterial({
            map:        texture,
            transparent: true,
            depthWrite:  false,
            blending:    THREE.AdditiveBlending,
          });
          const sprite = new THREE.Sprite(mat);
          sprite.position.copy(pos);
          const s = 0.14 + Math.random() * 0.22;
          sprite.scale.set(s, s, s);
          sphereGroup.add(sprite);
          sprites.push(sprite);
        });
      },
      undefined,
      () => { loadedTextures++; }
    );
  });

  /* ── Lights ── */
  scene.add(new THREE.AmbientLight(0xFF4D8D, 0.8));
  const pointLight = new THREE.PointLight(0xFFD700, 1.2, 12);
  pointLight.position.set(2, 2, 3);
  scene.add(pointLight);

  /* ── Resize ── */
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onResize);

  /* Canvas + glow bắt đầu ẩn, sẽ fade-in cùng hiệu ứng intro */
  canvas.style.opacity  = '0';
  glowEl.style.opacity  = '0';

  /* ── Animation state ── */
  let rafId      = null;
  let phase      = 'intro';
  let introStart = null;
  let zoomStart  = null;
  const INTRO_DUR = 1400;
  const INTRO_FROM = 3.8;
  const ZOOM_DUR  = 1600;
  const CAM_FROM  = 5.2;
  const CAM_TO    = 0.25;

  function easeOutBack(t) {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  function loop(ts) {
    rafId = requestAnimationFrame(loop);

    if (phase === 'intro') {
      if (!introStart) introStart = ts;
      const elapsed = ts - introStart;
      const t       = Math.min(elapsed / INTRO_DUR, 1);
      const et      = easeOutBack(t);

      /* Thu nhỏ từ INTRO_FROM → 1 */
      sphereGroup.scale.setScalar(lerpN(INTRO_FROM, 1, et));

      /* Xoay nhẹ trong lúc thu nhỏ */
      sphereGroup.rotation.y += 0.004;
      sphereGroup.rotation.x += 0.001;

      /* Fade-in canvas + glow */
      const fadeProg = Math.min(elapsed / (INTRO_DUR * 0.6), 1);
      canvas.style.opacity  = fadeProg.toFixed(3);
      glowEl.style.opacity  = fadeProg.toFixed(3);

      if (t >= 1) {
        canvas.style.opacity  = '1';
        glowEl.style.opacity  = '1';
        phase = 'rotate';
      }

    } else if (phase === 'rotate') {
      sphereGroup.rotation.y += 0.0025;
      sphereGroup.rotation.x += 0.0008;

      /* subtle pulsing scale */
      const pulse = 1 + Math.sin(ts * 0.001) * 0.025;
      sphereGroup.scale.setScalar(pulse);

    } else if (phase === 'zoom') {
      if (!zoomStart) zoomStart = ts;
      const elapsed = ts - zoomStart;
      const t       = Math.min(elapsed / ZOOM_DUR, 1);
      const et      = easeOutCubic(t);

      camera.position.z = lerpN(CAM_FROM, CAM_TO, et);

      /* sphere expands as camera dives in */
      const scale = 1 + et * 4;
      sphereGroup.scale.setScalar(scale);

      /* fade out canvas + glow after 65% of zoom */
      if (t > 0.65) {
        const ft = (t - 0.65) / 0.35;
        canvas.style.opacity  = (1 - ft).toFixed(3);
        glowEl.style.opacity  = (1 - ft).toFixed(3);
      }

      if (t >= 1) {
        onZoomComplete();
        return;
      }
    }

    renderer.render(scene, camera);
  }

  rafId = requestAnimationFrame(loop);

  function startZoom() {
    phase             = 'zoom';
    hint.style.opacity = '0';
  }

  function destroy() {
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener('resize', onResize);
    sprites.forEach(s => { s.material.map?.dispose(); s.material.dispose(); });
    starGeo.dispose();
    starMat.dispose();
    renderer.dispose();
  }

  return { startZoom, destroy };
}

/* ═══════════════════════════════════════
   PHASE 3 – Gifts (Bó hoa + Tấm thiệp)
═══════════════════════════════════════ */

function buildGifts(container, onBouquet, onCard) {
  const div = document.createElement('div');
  div.id    = 's3-gifts';
  div.innerHTML = `
    <div class="s3-gifts-title">Chọn món quà dành cho bạn 💝</div>
    <div class="s3-gifts-row">
      <div class="s3-gift" id="s3-gift-bouquet" role="button" tabindex="0" aria-label="Bó hoa yêu thương">
        <div class="s3-gift-inner">
          <img src="${BOUQUET}" alt="Bó hoa" draggable="false">
          <div class="s3-gift-label">🌹 Bó Hoa Yêu Thương</div>
        </div>
      </div>
      <div class="s3-gift" id="s3-gift-card" role="button" tabindex="0" aria-label="Tấm thiệp kỳ diệu">
        <div class="s3-gift-inner">
          ${buildCardGraphic()}
          <div class="s3-gift-label">💌 Tấm Thiệp Kỳ Diệu</div>
        </div>
      </div>
    </div>
    <div class="s3-gifts-sparkles" aria-hidden="true"></div>
  `;
  container.appendChild(div);

  /* Sparkles */
  const sparkleEl = div.querySelector('.s3-gifts-sparkles');
  const STARS = ['✦', '✧', '✶', '⋆', '✸'];
  for (let i = 0; i < 22; i++) {
    const sp       = document.createElement('span');
    sp.className   = 's3-sparkle';
    sp.textContent = STARS[i % STARS.length];
    sp.style.cssText = `
      left: ${(Math.random() * 96).toFixed(1)}%;
      top:  ${(Math.random() * 96).toFixed(1)}%;
      --sp-size:  ${(Math.random() * 10 + 6).toFixed(1)}px;
      --sp-dur:   ${(Math.random() * 2 + 1.2).toFixed(2)}s;
      --sp-delay: ${(Math.random() * 3.5).toFixed(2)}s;
    `;
    sparkleEl.appendChild(sp);
  }

  /* Fade in */
  requestAnimationFrame(() => requestAnimationFrame(() => div.classList.add('visible')));

  /* Events */
  function once(el, fn) {
    function handler(e) {
      e.stopPropagation();
      el.removeEventListener('click',      handler);
      el.removeEventListener('touchstart', handler);
      fn();
    }
    el.addEventListener('click',      handler);
    el.addEventListener('touchstart', handler, { passive: true });
  }

  once(div.querySelector('#s3-gift-bouquet'), onBouquet);
  once(div.querySelector('#s3-gift-card'),    onCard);

  return div;
}

/* ── Hand-crafted card SVG ── */
function buildCardGraphic() {
  return `
    <div class="s3-card-graphic" aria-hidden="true">
      <svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="s3cg1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stop-color="#2D0040"/>
            <stop offset="60%"  stop-color="#1A0025"/>
            <stop offset="100%" stop-color="#3D0050"/>
          </linearGradient>
          <linearGradient id="s3cg2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stop-color="#FFD700" stop-opacity="0.9"/>
            <stop offset="100%" stop-color="#FF4D8D" stop-opacity="0.7"/>
          </linearGradient>
          <filter id="s3glow">
            <feGaussianBlur stdDeviation="1.8" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <!-- Card body -->
        <rect x="4" y="4" width="192" height="252" rx="14" ry="14"
              fill="url(#s3cg1)" stroke="#FF4D8D" stroke-width="1.4" opacity="0.92"/>
        <rect x="10" y="10" width="180" height="240" rx="10" ry="10"
              fill="none" stroke="#FFD700" stroke-width="0.5" opacity="0.4"/>

        <!-- Corner roses – top left -->
        <g transform="translate(28,30)" opacity="0.85">
          <circle cx="0"  cy="0"  r="9"   fill="#FF4D8D"/>
          <circle cx="0"  cy="0"  r="5.5" fill="#FF6B9D"/>
          <circle cx="0"  cy="-7" r="5"   fill="#D966C0" opacity="0.75"/>
          <circle cx="6"  cy="4"  r="4.5" fill="#FF4D8D" opacity="0.7"/>
          <circle cx="-6" cy="4"  r="4.5" fill="#FF6B9D" opacity="0.7"/>
          <ellipse cx="13" cy="6"  rx="6" ry="2.8" fill="#1a3d08" opacity="0.75" transform="rotate(35 13 6)"/>
          <ellipse cx="-13" cy="6" rx="6" ry="2.8" fill="#1a3d08" opacity="0.75" transform="rotate(-35 -13 6)"/>
        </g>

        <!-- Corner roses – top right -->
        <g transform="translate(172,30) scale(-1,1)" opacity="0.85">
          <circle cx="0"  cy="0"  r="9"   fill="#FF4D8D"/>
          <circle cx="0"  cy="0"  r="5.5" fill="#FF6B9D"/>
          <circle cx="0"  cy="-7" r="5"   fill="#D966C0" opacity="0.75"/>
          <circle cx="6"  cy="4"  r="4.5" fill="#FF4D8D" opacity="0.7"/>
          <circle cx="-6" cy="4"  r="4.5" fill="#FF6B9D" opacity="0.7"/>
          <ellipse cx="13" cy="6"  rx="6" ry="2.8" fill="#1a3d08" opacity="0.75" transform="rotate(35 13 6)"/>
          <ellipse cx="-13" cy="6" rx="6" ry="2.8" fill="#1a3d08" opacity="0.75" transform="rotate(-35 -13 6)"/>
        </g>

        <!-- Heart centre top -->
        <path d="M100 38 C100 38 89 27 81 32 C73 37 73 47 81 55 L100 72 L119 55 C127 47 127 37 119 32 C111 27 100 38 100 38Z"
              fill="url(#s3cg2)" filter="url(#s3glow)" opacity="0.95"/>

        <!-- Divider line + dot -->
        <line x1="28" y1="84" x2="172" y2="84" stroke="#FF4D8D" stroke-width="0.7" opacity="0.55"/>
        <circle cx="100" cy="84" r="3.2" fill="#FFD700" opacity="0.85"/>

        <!-- Title -->
        <text x="100" y="102" text-anchor="middle"
              font-family="'Dancing Script',cursive" font-size="15" fill="#FFD700" opacity="0.96">
          Tấm Thiệp
        </text>
        <text x="100" y="122" text-anchor="middle"
              font-family="'Dancing Script',cursive" font-size="20" fill="#FFFFFF" opacity="0.97">
          Yêu Thương
        </text>

        <!-- Handwriting lines -->
        <text x="100" y="148" text-anchor="middle"
              font-family="'Dancing Script',cursive" font-size="9.5" fill="rgba(255,255,255,0.7)">
          Gửi đến trái tim yêu thương,
        </text>
        <text x="100" y="164" text-anchor="middle"
              font-family="'Dancing Script',cursive" font-size="9.5" fill="rgba(255,255,255,0.7)">
          Mỗi ngày có em là một ngày
        </text>
        <text x="100" y="180" text-anchor="middle"
              font-family="'Dancing Script',cursive" font-size="9.5" fill="rgba(255,255,255,0.7)">
          thế giới thêm tươi đẹp hơn.
        </text>

        <!-- Divider bottom -->
        <line x1="40" y1="194" x2="160" y2="194" stroke="#FF4D8D" stroke-width="0.5" opacity="0.4"/>

        <text x="100" y="210" text-anchor="middle"
              font-family="'Dancing Script',cursive" font-size="10" fill="rgba(255,215,0,0.85)">
          Chúc mừng 8/3 💕
        </text>

        <!-- Corner roses – bottom left -->
        <g transform="translate(28,232) scale(1,-1)" opacity="0.7">
          <circle cx="0" cy="0" r="7"   fill="#D966C0"/>
          <circle cx="0" cy="0" r="4.2" fill="#FF6B9D"/>
          <ellipse cx="11" cy="4" rx="5" ry="2.2" fill="#1a3d08" opacity="0.75" transform="rotate(30 11 4)"/>
        </g>

        <!-- Corner roses – bottom right -->
        <g transform="translate(172,232) scale(-1,-1)" opacity="0.7">
          <circle cx="0" cy="0" r="7"   fill="#D966C0"/>
          <circle cx="0" cy="0" r="4.2" fill="#FF6B9D"/>
          <ellipse cx="11" cy="4" rx="5" ry="2.2" fill="#1a3d08" opacity="0.75" transform="rotate(30 11 4)"/>
        </g>

        <!-- Bottom heart -->
        <path d="M100 232 C100 232 93 225 88 228 C83 231 83 237 88 242 L100 252 L112 242 C117 237 117 231 112 228 C107 225 100 232 100 232Z"
              fill="#FFD700" opacity="0.65"/>
      </svg>
    </div>
  `;
}

/* ── Flash overlay ── */
function flashTransition(callback) {
  const flash = document.createElement('div');
  flash.style.cssText = `
    position: fixed; inset: 0; z-index: 9999;
    background: radial-gradient(circle, #fff5f8 0%, #FFB3D1 60%, #FF4D8D 100%);
    opacity: 0; pointer-events: none;
    transition: opacity 0.15s ease;
  `;
  document.body.appendChild(flash);

  requestAnimationFrame(() => {
    flash.style.opacity = '0.85';
    setTimeout(() => {
      flash.style.transition = 'opacity 0.35s ease';
      flash.style.opacity    = '0';
      setTimeout(() => {
        flash.remove();
        callback();
      }, 380);
    }, 160);
  });
}

/* ═══════════════════════════════════════
   Entry point
═══════════════════════════════════════ */
export function initScreen3(container, onSelectBouquet, onSelectCard) {
  container.innerHTML = '';

  let destroyed    = false;
  let threeCtrl    = null;
  const timers     = [];

  const addTimer = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.push(id);
    return id;
  };

  /* ── Phase 1: show rose heart ── */
  const phase1 = buildPhase1(container);

  /* Sau 1.1s (ảnh xuất hiện xong), bắt đầu hiệu ứng đập tim */
  addTimer(() => {
    if (destroyed) return;
    const heart = container.querySelector('#s3-rose-heart');
    if (heart) {
      heart.style.opacity = '1';
      heart.classList.add('beating');
    }
  }, 1100);

  /* Sau 4s đập tim → nổ tung cánh hoa */
  addTimer(() => {
    if (destroyed) return;
    triggerExplosion(container, () => {
      if (destroyed) return;
      /* Petals đang phủ màn hình → ẩn phase1, khởi động sphere ngay bên dưới */
      phase1.style.transition = 'opacity 0.3s ease';
      phase1.style.opacity    = '0';
      addTimer(() => {
        if (destroyed) return;
        phase1.remove();
        startPhase2();
      }, 300);
    });
  }, 1100 + 4000);

  /* ── Phase 2: Three.js sphere ── */
  function startPhase2() {
    /* Đảm bảo xóa sạch cánh hoa còn sót (nếu có) khi sphere đã hiện xong */
    addTimer(() => {
      document.querySelectorAll('.s3-petal-fly').forEach(el => {
        clearTimeout(el._t1);
        clearTimeout(el._t2);
        el.remove();
      });
    }, 2200);

    const ctrl = buildThreeScene(container, () => {
      if (destroyed) return;
      flashTransition(startPhase3);
    });
    threeCtrl = ctrl;

    /* Delay click to avoid accidental trigger */
    let clickEnabled = false;
    addTimer(() => { clickEnabled = true; }, 900);

    function handleClick(e) {
      if (!clickEnabled) return;
      const hint = container.querySelector('#s3-tap-hint');
      if (hint) hint.style.pointerEvents = 'none';
      container.removeEventListener('click',      handleClick);
      container.removeEventListener('touchstart', handleClick);
      ctrl.startZoom();
    }

    container.addEventListener('click',      handleClick);
    container.addEventListener('touchstart', handleClick, { passive: true });
  }

  /* ── Phase 3: gifts ── */
  function startPhase3() {
    if (destroyed) return;

    /* Clean up Three.js canvas elements */
    ['#s3-three-canvas', '#s3-glow-aura', '#s3-tap-hint'].forEach(sel => {
      container.querySelector(sel)?.remove();
    });
    if (threeCtrl) { threeCtrl.destroy(); threeCtrl = null; }

    buildGifts(
      container,
      () => { if (!destroyed) onSelectBouquet(); },
      () => { if (!destroyed) onSelectCard(); },
    );
  }

  /* ── Cleanup ── */
  return function destroy() {
    destroyed = true;
    timers.forEach(clearTimeout);
    if (threeCtrl) { threeCtrl.destroy(); threeCtrl = null; }
    document.querySelectorAll('.s3-petal-fly').forEach(el => {
      clearTimeout(el._t1);
      clearTimeout(el._t2);
      el.remove();
    });
    container.innerHTML = '';
  };
}
