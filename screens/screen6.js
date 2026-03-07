const DEFAULT_AVATAR = "img/avatar_nu.jpg";
const AUDIO_SRC = "audio/gift_music.mp3";
const PARTICLE_COLORS = [
    "#ff6eb4",
    "#e879f9",
    "#c084fc",
    "#ffffff",
    "#fecdd3",
    "#f472b6",
    "#ddd6fe",
];

/* ═══════════════════════════════════════════════════════════════
   CẤU HÌNH THỜI GIAN HIỂN THỊ MỖI DÒNG CHỮ (đơn vị: giây)
   → Điều chỉnh giá trị `at` để căn đúng với nhạc
═══════════════════════════════════════════════════════════════ */
const LINES = [
    { text: "CHÚC NHỮNG NGƯỜI PHỤ NỮ TUYỆT VỜI", at: 1.0 },
    { text: "ĐANG XEM CLIP NÀY", at: 2.5 },
    { text: "SẼ LUÔN TOẢ SÁNG", at: 4.0 },
    { text: "NHƯ...", at: 5.5 },
    { text: "NHƯ...", at: 6.5 },
];

const PHOTO_AT = 9.0;

function el(tag, cls) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    return e;
}

export function initScreen6(container, onBack) {
    container.innerHTML = "";

    const params = new URLSearchParams(window.location.search);
    const dearName = params.get("dear") || "bạn";
    let userSrc = null;
    let playing = false;
    let raf = null;

    /* ── Particle background ── */
    const pCanvas = el("canvas", "s6-particle-canvas");
    container.appendChild(pCanvas);
    const pCtx = pCanvas.getContext("2d");

    function resizeParticleCanvas() {
        pCanvas.width = window.innerWidth;
        pCanvas.height = window.innerHeight;
    }
    resizeParticleCanvas();
    window.addEventListener("resize", resizeParticleCanvas);

    const particles = Array.from({ length: 80 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        color: PARTICLE_COLORS[
            Math.floor(Math.random() * PARTICLE_COLORS.length)
        ],
        alpha: Math.random() * 0.5 + 0.1,
        aDir: Math.random() > 0.5 ? 1 : -1,
        aSpd: Math.random() * 0.006 + 0.002,
    }));

    let pRaf = null;
    function drawParticles() {
        pRaf = requestAnimationFrame(drawParticles);
        pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
        for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha += p.aSpd * p.aDir;
            if (p.alpha > 0.7) {
                p.alpha = 0.7;
                p.aDir = -1;
            }
            if (p.alpha < 0.05) {
                p.alpha = 0.05;
                p.aDir = 1;
            }
            if (p.x < -5) p.x = pCanvas.width + 5;
            if (p.x > pCanvas.width + 5) p.x = -5;
            if (p.y < -5) p.y = pCanvas.height + 5;
            if (p.y > pCanvas.height + 5) p.y = -5;
            pCtx.save();
            pCtx.globalAlpha = Math.max(0, p.alpha);
            pCtx.shadowBlur = p.r * 7;
            pCtx.shadowColor = p.color;
            pCtx.fillStyle = p.color;
            pCtx.beginPath();
            pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            pCtx.fill();
            pCtx.restore();
        }
    }
    drawParticles();

    const wrap = el("div", "s6-wrapper");
    const player = el("div", "s6-player");
    const display = el("div", "s6-display");

    /* ── Phase 1: Text animation ── */
    const txtPhase = el("div", "s6-phase s6-text-phase");
    txtPhase.appendChild(el("div", "s6-diamond-bg"));

    const hdr = el("div", "s6-hdr");
    const h83 = el("div", "s6-83");
    h83.textContent = "8/3";
    hdr.appendChild(h83);
    const hwd = el("div", "s6-hwd");
    hwd.textContent = "HAPPY WOMEN'S DAY";
    hdr.appendChild(hwd);
    txtPhase.appendChild(hdr);

    const nb = el("div", "s6-notebook");
    LINES.forEach((cfg, i) => {
        const line = el("div", "s6-line");
        if (cfg.isName) {
            line.textContent = dearName;
            line.classList.add("s6-line--name");
        } else {
            line.textContent = cfg.text;
            if (i >= 2) line.classList.add("s6-line--accent");
        }
        nb.appendChild(line);
    });
    txtPhase.appendChild(nb);
    display.appendChild(txtPhase);

    /* ── Phase 2: Photo display ── */
    const imgPhase = el("div", "s6-phase s6-photo-phase");
    const bgImg = el("img", "s6-bg-img");
    bgImg.src = "img/bg.jpg";
    bgImg.draggable = false;
    imgPhase.appendChild(bgImg);
    const frame = el("div", "s6-polaroid");
    const photo = el("img", "s6-photo");
    photo.draggable = false;
    frame.appendChild(photo);
    imgPhase.appendChild(frame);
    display.appendChild(imgPhase);

    player.appendChild(display);

    /* ── Controls ── */
    const ctrls = el("div", "s6-controls");
    const pickBtn = el("button", "s6-pick-btn");
    pickBtn.textContent = "Chọn ảnh";
    ctrls.appendChild(pickBtn);

    const playBtn = el("button", "s6-play-btn");
    playBtn.textContent = "\u25B6";
    ctrls.appendChild(playBtn);

    const hint = el("div", "s6-hint");
    hint.textContent = "Hãy chọn 1 bức hình thật xinh đẹp của mình nhé!!!";
    ctrls.appendChild(hint);

    player.appendChild(ctrls);
    wrap.appendChild(player);
    container.appendChild(wrap);

    /* ── Shooting stars overlay (full screen) ── */
    const starsLayer = el("div", "s6-stars-layer");
    container.appendChild(starsLayer);
    let starsActive = false;
    let starTimer = null;

    function spawnStar() {
        if (!starsActive) return;
        const big = Math.random() < 0.12;
        const star = el("span", "s6-star");
        const size = big ? 5 + Math.random() * 4 : 2 + Math.random() * 3;
        const dur = big ? 1.2 + Math.random() * 0.5 : 0.7 + Math.random() * 0.6;
        const top = Math.random() * 50;
        const right = Math.random() * 50;
        const tail = big ? 60 + Math.random() * 50 : 30 + Math.random() * 40;
        star.style.cssText =
            `top:${top}%;right:${right}%;` +
            `width:${size}px;height:${size}px;` +
            `--s6-dur:${dur}s;--s6-tail:${tail}px;`;
        if (big) star.classList.add("s6-star--big");
        starsLayer.appendChild(star);
        star.addEventListener("animationend", () => star.remove());
        starTimer = setTimeout(spawnStar, 60 + Math.random() * 140);
    }

    function startStars() {
        if (starsActive) return;
        starsActive = true;
        spawnStar();
    }

    function stopStars() {
        starsActive = false;
        if (starTimer) {
            clearTimeout(starTimer);
            starTimer = null;
        }
        starsLayer.innerHTML = "";
    }

    const backBtn = el("button", "s6-back-btn");
    backBtn.textContent = "\u2728 Quay l\u1EA1i ch\u1ECDn qu\u00E0 \u2728";
    backBtn.addEventListener("click", () => onBack?.());
    container.appendChild(backBtn);

    /* Hidden file input */
    const fileIn = document.createElement("input");
    fileIn.type = "file";
    fileIn.accept = "image/*";
    fileIn.style.display = "none";
    container.appendChild(fileIn);

    pickBtn.addEventListener("click", () => fileIn.click());
    fileIn.addEventListener("change", () => {
        const f = fileIn.files?.[0];
        if (!f) return;
        const rd = new FileReader();
        rd.onload = (ev) => {
            userSrc = ev.target.result;
            resetPlayer();
        };
        rd.readAsDataURL(f);
    });

    /* ── Audio ── */
    const audio = new Audio(AUDIO_SRC);
    audio.preload = "auto";

    photo.src = DEFAULT_AVATAR;
    resetVisuals();

    playBtn.addEventListener("click", toggle);

    function toggle() {
        playing ? pause() : play();
    }

    function play() {
        if (audio.ended || audio.currentTime >= audio.duration) {
            audio.currentTime = 0;
            resetVisuals();
        }
        audio.play().catch(() => {});
        playing = true;
        playBtn.textContent = "\u23F8";
        tick();
    }

    function pause() {
        audio.pause();
        playing = false;
        playBtn.textContent = "\u25B6";
        if (raf) {
            cancelAnimationFrame(raf);
            raf = null;
        }
    }

    function resetPlayer() {
        pause();
        audio.currentTime = 0;
        photo.src = userSrc || DEFAULT_AVATAR;
        resetVisuals();
    }

    function resetVisuals() {
        txtPhase.style.opacity = "1";
        txtPhase.style.pointerEvents = "auto";
        imgPhase.style.opacity = "0";
        imgPhase.style.pointerEvents = "none";
        nb.querySelectorAll(".s6-line").forEach((l) => {
            l.classList.remove("s6-line-show");
        });
        frame.style.animation = "none";
        frame.offsetHeight;
        frame.style.animation = "";
        stopStars();
    }

    function tick() {
        if (!playing) return;
        raf = requestAnimationFrame(tick);

        const t = audio.currentTime;

        const lines = nb.querySelectorAll(".s6-line");
        LINES.forEach((cfg, i) => {
            if (t >= cfg.at && lines[i]) {
                lines[i].classList.add("s6-line-show");
            }
        });

        if (t >= PHOTO_AT) {
            txtPhase.style.opacity = "0";
            txtPhase.style.pointerEvents = "none";
            imgPhase.style.opacity = "1";
            imgPhase.style.pointerEvents = "auto";
            startStars();
        }
    }

    audio.addEventListener("ended", () => {
        playing = false;
        playBtn.textContent = "\u25B6";
        if (raf) {
            cancelAnimationFrame(raf);
            raf = null;
        }
        stopStars();
    });

    return () => {
        stopStars();
        if (raf) cancelAnimationFrame(raf);
        if (pRaf) cancelAnimationFrame(pRaf);
        window.removeEventListener("resize", resizeParticleCanvas);
        audio.pause();
        audio.src = "";
        container.innerHTML = "";
    };
}
