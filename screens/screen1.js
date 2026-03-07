const HOLD_DURATION = 2400; // ms giữ để hoàn thành
const RADIUS = 88;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const COLORS = [
    "#ff6eb4",
    "#e879f9",
    "#c084fc",
    "#ffffff",
    "#fecdd3",
    "#f472b6",
    "#ddd6fe",
];

export function initScreen1(container, onComplete) {
    // ─── DOM ───
    container.innerHTML = `
    <div class="s1-blob s1-blob-1"></div>
    <div class="s1-blob s1-blob-2"></div>
    <div class="s1-blob s1-blob-3"></div>
    <canvas class="s1-canvas" id="s1-canvas"></canvas>

    <div class="s1-content">
      <div class="s1-date" id="s1-date">8 · 3</div>
      <p class="s1-tagline" id="s1-tagline">Món quà nhỏ gửi đến bạn...</p>

      <div class="s1-hold-area" id="s1-hold-area">
        <svg class="s1-ring-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stop-color="#f472b6"/>
              <stop offset="50%"  stop-color="#e879f9"/>
              <stop offset="100%" stop-color="#818cf8"/>
            </linearGradient>
          </defs>
          <circle class="s1-ring-track" cx="100" cy="100" r="${RADIUS}"/>
          <circle
            class="s1-ring-fill"
            id="s1-ring-fill"
            cx="100" cy="100" r="${RADIUS}"
            stroke-dasharray="${CIRCUMFERENCE}"
            stroke-dashoffset="${CIRCUMFERENCE}"
            transform="rotate(-90 100 100)"
          />
        </svg>

        <div class="s1-btn" id="s1-btn">
          <img class="s1-btn-heart" src="img/white_heart.png" alt="♥">
        </div>
      </div>

      <p class="s1-label" id="s1-label">Nhấn giữ để bắt đầu</p>
      <div class="s1-dots" id="s1-dots">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;

    // ─── Refs ───
    const canvas = container.querySelector("#s1-canvas");
    const ctx = canvas.getContext("2d");
    const btn = container.querySelector("#s1-btn");
    const ringFill = container.querySelector("#s1-ring-fill");

    // ─── Canvas resize ───
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // ─── Particle system ───
    function mkParticle(targetX, targetY) {
        const fromBtn = targetX !== undefined;
        return {
            x: fromBtn ? targetX : Math.random() * canvas.width,
            y: fromBtn ? targetY : Math.random() * canvas.height,
            r: Math.random() * (fromBtn ? 2.5 : 2) + 0.5,
            vx: fromBtn
                ? (Math.random() - 0.5) * 3.5
                : (Math.random() - 0.5) * 0.45,
            vy: fromBtn
                ? (Math.random() - 0.5) * 3.5 - 1
                : (Math.random() - 0.5) * 0.45,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            alpha: fromBtn ? 0.9 : Math.random() * 0.55 + 0.1,
            aDir: Math.random() > 0.5 ? 1 : -1,
            aSpd: Math.random() * 0.007 + 0.002,
            burst: fromBtn,
            life: fromBtn ? 1.0 : Infinity,
        };
    }

    const bgParticles = Array.from({ length: 90 }, () => mkParticle());
    let burstParticles = [];

    function emitBurst(cx, cy, count = 4) {
        for (let i = 0; i < count; i++) burstParticles.push(mkParticle(cx, cy));
    }

    function drawParticles(delta) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background particles
        for (const p of bgParticles) {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha += p.aSpd * p.aDir;
            if (p.alpha > 0.75) {
                p.alpha = 0.75;
                p.aDir = -1;
            }
            if (p.alpha < 0.05) {
                p.alpha = 0.05;
                p.aDir = 1;
            }
            if (p.x < -5) p.x = canvas.width + 5;
            if (p.x > canvas.width + 5) p.x = -5;
            if (p.y < -5) p.y = canvas.height + 5;
            if (p.y > canvas.height + 5) p.y = -5;
            drawCircle(p);
        }

        // Burst particles (fly out from button when holding)
        burstParticles = burstParticles.filter((p) => p.life > 0);
        for (const p of burstParticles) {
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.96;
            p.vy *= 0.96;
            p.life -= delta / 900;
            p.alpha = p.life * 0.85;
            drawCircle(p);
        }
    }

    function drawCircle(p) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.shadowBlur = p.r * 7;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // ─── Press & Hold logic ───
    let isHolding = false;
    let progress = 0;
    let lastTime = null;
    let completed = false;
    let frameCount = 0;
    let animId;

    function getBtnCenter() {
        const rect = btn.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }

    function updateRing() {
        ringFill.setAttribute(
            "stroke-dashoffset",
            CIRCUMFERENCE * (1 - progress),
        );
    }

    function onHoldStart(e) {
        if (completed) return;
        e.preventDefault();
        isHolding = true;
        btn.classList.add("holding");
    }

    function onHoldEnd() {
        if (completed) return;
        isHolding = false;
        btn.classList.remove("holding");
    }

    btn.addEventListener("mousedown", onHoldStart);
    btn.addEventListener("touchstart", onHoldStart, { passive: false });
    window.addEventListener("mouseup", onHoldEnd);
    window.addEventListener("touchend", onHoldEnd);
    window.addEventListener("touchcancel", onHoldEnd);

    // ─── Animation loop ───
    function animate(timestamp) {
        animId = requestAnimationFrame(animate);
        if (!lastTime) lastTime = timestamp;
        const delta = Math.min(timestamp - lastTime, 100);
        lastTime = timestamp;
        frameCount++;

        drawParticles(delta);

        if (isHolding && !completed) {
            progress = Math.min(1, progress + delta / HOLD_DURATION);
            updateRing();

            // Emit sparkles from button every 3 frames
            if (frameCount % 3 === 0) {
                const { x, y } = getBtnCenter();
                emitBurst(x, y, 3);
            }

            if (progress >= 1) {
                doTransitionOut();
            }
        } else if (!isHolding && progress > 0 && !completed) {
            progress = Math.max(0, progress - delta / 500);
            updateRing();
        }
    }

    requestAnimationFrame(animate);

    // ─── Transition out ───
    function doTransitionOut() {
        completed = true;
        btn.classList.remove("holding");
        onComplete();
    }

    // ─── Staggered reveal animations ───
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            container.querySelector("#s1-date").classList.add("show");
            setTimeout(
                () =>
                    container
                        .querySelector("#s1-tagline")
                        .classList.add("show"),
                300,
            );
            setTimeout(
                () =>
                    container
                        .querySelector("#s1-hold-area")
                        .classList.add("show"),
                700,
            );
            setTimeout(
                () =>
                    container.querySelector("#s1-label").classList.add("show"),
                1100,
            );
            setTimeout(
                () => container.querySelector("#s1-dots").classList.add("show"),
                1300,
            );
        });
    });

    // ─── Cleanup ───
    return function destroy() {
        cancelAnimationFrame(animId);
        window.removeEventListener("resize", resizeCanvas);
        window.removeEventListener("mouseup", onHoldEnd);
        window.removeEventListener("touchend", onHoldEnd);
        window.removeEventListener("touchcancel", onHoldEnd);
    };
}
