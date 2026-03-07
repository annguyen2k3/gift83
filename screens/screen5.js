/* ══════════════════════════════════════════════════════
   Màn 5 – Mở thiệp & Lời chúc
══════════════════════════════════════════════════════ */

const POEMS = [
    [
        "Tháng 3, tháng của yêu thương",
        "Hôm nay ngày 8, ánh dương rạng ngời",
        "Chúc {name} xinh đẹp tuyệt vời",
        "Luôn luôn vui vẻ, trọn đời an yên",
        "Không còn lo lắng, muộn phiền",
        "Bên trong hạnh phúc, nhiều tiền ngoài thân.",
    ],
    [
        "Chúc {name} một ngày lễ trọn vẹn,",
        "đầy ý nghĩa với những kỷ niệm",
        "đẹp nhất. Chúc {name} luôn vui vẻ,",
        "gặp nhiều may mắn, chúc {name}",
        "mỗi ngày đều cười tươi.",
        "",
        "Chúc {name} ngày càng xinh",
        "đẹp, giỏi giang, chúc {name} cuộc",
        "sống đong đầy bao nhiêu hạnh",
        "phúc đều là của {name}.",
        "",
        "Và đặc biệt là không còn buồn",
        "phiền, tiêu cực, luôn an nhiên.",
        "Mỗi ngày trôi qua đều là ngày",
        "hạnh phúc nhất...",
    ],
    [
        "Chúc {name} mùng 8 tháng 3",
        "Có đủ mọi thứ niềm vui trên đời",
        "Sống một cuộc sống thảnh thơi",
        "Tiền vào đầy ví, tiền vào đầy tim.",
    ],
];

function getRecipientName() {
    const params = new URLSearchParams(window.location.search);
    return params.get("dear") || "em";
}

function createParticleCanvas(container) {
    const canvas = document.createElement("canvas");
    canvas.className = "s5-particle-canvas";
    container.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    let w, h;
    const particles = [];
    const COLORS = ["#FFF0F5", "#FFB3D1", "#E8D5FF", "#FFD700"];
    const RATIOS = [4, 3, 2, 1];
    const colorPool = [];
    RATIOS.forEach((r, i) => {
        for (let j = 0; j < r; j++) colorPool.push(COLORS[i]);
    });

    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 60 : 120;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < COUNT; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: 1 + Math.random() * 3,
            color: colorPool[Math.floor(Math.random() * colorPool.length)],
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            phase: Math.random() * Math.PI * 2,
            speed: 0.5 + Math.random() * 1.5,
        });
    }

    let rafId = null;
    function draw(ts) {
        rafId = requestAnimationFrame(draw);
        ctx.clearRect(0, 0, w, h);
        particles.forEach((p) => {
            p.x += p.vx + Math.sin(ts * 0.001 * p.speed + p.phase) * 0.15;
            p.y += p.vy + Math.cos(ts * 0.0008 * p.speed + p.phase) * 0.1;

            if (p.x < -10) p.x = w + 10;
            if (p.x > w + 10) p.x = -10;
            if (p.y < -10) p.y = h + 10;
            if (p.y > h + 10) p.y = -10;

            const alpha = 0.4 + Math.sin(ts * 0.002 + p.phase) * 0.3;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0.1, alpha);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
    }
    rafId = requestAnimationFrame(draw);

    return function destroy() {
        if (rafId) cancelAnimationFrame(rafId);
        window.removeEventListener("resize", resize);
    };
}

function createDecorativeElements(inner) {
    const decoLeft = document.createElement("div");
    decoLeft.className = "s5-deco s5-deco-left";
    decoLeft.innerHTML = "🌸";
    inner.appendChild(decoLeft);

    const decoRight = document.createElement("div");
    decoRight.className = "s5-deco s5-deco-right";
    decoRight.innerHTML = "🌸";
    inner.appendChild(decoRight);

    const decoTopLeft = document.createElement("div");
    decoTopLeft.className = "s5-deco s5-deco-top-left";
    decoTopLeft.innerHTML = "🌿";
    inner.appendChild(decoTopLeft);

    const decoTopRight = document.createElement("div");
    decoTopRight.className = "s5-deco s5-deco-top-right";
    decoTopRight.innerHTML = "🌿";
    inner.appendChild(decoTopRight);
}

export function initScreen5(container, onBack) {
    container.innerHTML = "";
    const name = getRecipientName();
    let destroyed = false;

    const destroyParticles = createParticleCanvas(container);

    const wrapper = document.createElement("div");
    wrapper.className = "s5-wrapper";
    container.appendChild(wrapper);

    /* ── Card (envelope) ── */
    const cardScene = document.createElement("div");
    cardScene.className = "s5-card-scene";
    wrapper.appendChild(cardScene);

    const card = document.createElement("div");
    card.className = "s5-card";
    cardScene.appendChild(card);

    /* Front face */
    const front = document.createElement("div");
    front.className = "s5-card-face s5-card-front";
    front.innerHTML = `
    <div class="s5-front-title">Happy Women's Day</div>
    <div class="s5-front-sub">Nhấn để mở</div>
  `;
    card.appendChild(front);

    /* Back face (inside of card) */
    const back = document.createElement("div");
    back.className = "s5-card-face s5-card-back";

    const inner = document.createElement("div");
    inner.className = "s5-card-inner";

    const heartDeco = document.createElement("div");
    heartDeco.className = "s5-heart-deco";
    heartDeco.innerHTML = "❤️";
    inner.appendChild(heartDeco);

    const dividerTop = document.createElement("div");
    dividerTop.className = "s5-divider";
    inner.appendChild(dividerTop);

    const poemContainer = document.createElement("div");
    poemContainer.className = "s5-poem";

    const chosenPoem = POEMS[Math.floor(Math.random() * POEMS.length)];
    chosenPoem.forEach((line) => {
        const p = document.createElement("p");
        p.className = "s5-poem-line";
        if (line === "") {
            p.classList.add("s5-poem-spacer");
        } else {
            p.textContent = line.replace(/\{name\}/g, name);
        }
        poemContainer.appendChild(p);
    });
    inner.appendChild(poemContainer);

    const dividerBottom = document.createElement("div");
    dividerBottom.className = "s5-divider";
    inner.appendChild(dividerBottom);

    const signature = document.createElement("div");
    signature.className = "s5-signature";
    signature.textContent = "Chúc mừng ngày 8/3 💕";
    inner.appendChild(signature);

    createDecorativeElements(inner);
    back.appendChild(inner);
    card.appendChild(back);

    /* ── Back button ── */
    const backBtn = document.createElement("button");
    backBtn.className = "s5-back-btn";
    backBtn.textContent = "✨ Quay lại chọn quà ✨";
    backBtn.addEventListener("click", () => {
        if (!destroyed && onBack) onBack();
    });
    container.appendChild(backBtn);

    /* ── Open card interaction ── */
    let cardOpened = false;

    function openCard() {
        if (cardOpened) return;
        cardOpened = true;

        card.classList.add("s5-card-open");

        setTimeout(() => {
            const lines = poemContainer.querySelectorAll(".s5-poem-line");
            const delay = lines.length > 8 ? 300 : 450;
            lines.forEach((line, i) => {
                setTimeout(() => {
                    line.classList.add("s5-line-visible");
                }, i * delay);
            });

            setTimeout(
                () => {
                    signature.classList.add("s5-line-visible");
                },
                lines.length * delay + 200,
            );
        }, 800);
    }

    cardScene.addEventListener("click", openCard);
    cardScene.addEventListener("touchend", (e) => {
        e.preventDefault();
        openCard();
    });

    /* ── Entrance animation ── */
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            cardScene.classList.add("s5-card-enter");
        });
    });

    return function destroy() {
        destroyed = true;
        destroyParticles();
        container.innerHTML = "";
    };
}
