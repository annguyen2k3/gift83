import * as THREE from "three";

/* ══════════════════════════════════════════════════════
   Màn 3 – 3D Sphere → Gifts inside sphere
══════════════════════════════════════════════════════ */

const BOUQUET = "img/bo_hoa_hong.png";
const DISC_IMG = "img/\u2014Pngtree\u2014vinyl music disc_5614286.png";

const HEART_PATHS = [
    "img/\u2014Pngtree\u20143d heart design vector_5884040.png",
    "img/\u2014Pngtree\u2014glossy heart best vector ai_7581956.png",
    "img/\u2014Pngtree\u2014valentines day 3d stereo love_8973611.png",
    "img/\u2014Pngtree\u2014a 3d rendering of pink_20317137.png",
];

/* ── Fibonacci sphere distribution ── */
function fibSphere(n, r) {
    const pts = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
        const y = 1 - (i / (n - 1)) * 2;
        const rad = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = phi * i;
        pts.push(
            new THREE.Vector3(
                rad * Math.cos(theta) * r,
                y * r,
                rad * Math.sin(theta) * r,
            ),
        );
    }
    return pts;
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}
function lerpN(a, b, t) {
    return a + (b - a) * t;
}

/* ═══════════════════════════════════════
   Card canvas texture
═══════════════════════════════════════ */

function createCardCanvas() {
    const W = 400,
        H = 520;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const ctx = c.getContext("2d");

    function rr(x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }

    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#2D0040");
    bg.addColorStop(0.6, "#1A0025");
    bg.addColorStop(1, "#3D0050");
    rr(0, 0, W, H, 28);
    ctx.fillStyle = bg;
    ctx.fill();

    rr(6, 6, W - 12, H - 12, 22);
    ctx.strokeStyle = "#FF4D8D";
    ctx.lineWidth = 3;
    ctx.stroke();

    rr(18, 18, W - 36, H - 36, 18);
    ctx.strokeStyle = "rgba(255,215,0,0.35)";
    ctx.lineWidth = 1;
    ctx.stroke();

    /* Corner roses – top-left */
    function drawRose(cx, cy, s, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(cx, cy);
        ctx.beginPath();
        ctx.arc(0, 0, 9 * s, 0, Math.PI * 2);
        ctx.fillStyle = "#FF4D8D";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, 0, 5.5 * s, 0, Math.PI * 2);
        ctx.fillStyle = "#FF6B9D";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, -7 * s, 5 * s, 0, Math.PI * 2);
        ctx.fillStyle = "#D966C0";
        ctx.globalAlpha = alpha * 0.75;
        ctx.fill();
        ctx.globalAlpha = alpha * 0.7;
        ctx.beginPath();
        ctx.arc(6 * s, 4 * s, 4.5 * s, 0, Math.PI * 2);
        ctx.fillStyle = "#FF4D8D";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(-6 * s, 4 * s, 4.5 * s, 0, Math.PI * 2);
        ctx.fillStyle = "#FF6B9D";
        ctx.fill();
        ctx.restore();
    }
    drawRose(56, 60, 1.6, 0.85);
    drawRose(W - 56, 60, 1.6, 0.85);
    drawRose(56, H - 56, 1.2, 0.7);
    drawRose(W - 56, H - 56, 1.2, 0.7);

    /* Heart */
    ctx.save();
    ctx.translate(W / 2, 130);
    ctx.scale(2.5, 2.5);
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.bezierCurveTo(-12, -22, -28, -8, 0, 16);
    ctx.moveTo(0, -8);
    ctx.bezierCurveTo(12, -22, 28, -8, 0, 16);
    const hg = ctx.createLinearGradient(0, -22, 0, 16);
    hg.addColorStop(0, "rgba(255,215,0,0.9)");
    hg.addColorStop(1, "rgba(255,77,141,0.7)");
    ctx.fillStyle = hg;
    ctx.shadowColor = "#FF4D8D";
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.restore();

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    /* Divider */
    ctx.strokeStyle = "rgba(255,77,141,0.55)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(56, 205);
    ctx.lineTo(W - 56, 205);
    ctx.stroke();
    ctx.fillStyle = "rgba(255,215,0,0.85)";
    ctx.beginPath();
    ctx.arc(W / 2, 205, 5, 0, Math.PI * 2);
    ctx.fill();

    /* Text */
    ctx.textAlign = "center";
    ctx.font = '32px "Dancing Script", cursive';
    ctx.fillStyle = "#FFD700";
    ctx.fillText("Tấm Thiệp", W / 2, 250);

    ctx.font = '42px "Dancing Script", cursive';
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Lời chúc", W / 2, 300);

    ctx.font = '20px "Dancing Script", cursive';
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText("Gửi đến trái tim yêu thương,", W / 2, 350);
    ctx.fillText("Mỗi ngày có em là một ngày", W / 2, 380);
    ctx.fillText("thế giới thêm tươi đẹp hơn.", W / 2, 410);

    ctx.strokeStyle = "rgba(255,77,141,0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(80, 440);
    ctx.lineTo(W - 80, 440);
    ctx.stroke();

    ctx.font = '22px "Dancing Script", cursive';
    ctx.fillStyle = "rgba(255,215,0,0.85)";
    ctx.fillText("Chúc mừng 8/3 💕", W / 2, 478);

    /* Bottom heart */
    ctx.save();
    ctx.translate(W / 2, H - 34);
    ctx.scale(1.2, 1.2);
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.bezierCurveTo(-8, -16, -18, -5, 0, 12);
    ctx.moveTo(0, -6);
    ctx.bezierCurveTo(8, -16, 18, -5, 0, 12);
    ctx.fillStyle = "rgba(255,215,0,0.65)";
    ctx.fill();
    ctx.restore();

    return c;
}

/* ═══════════════════════════════════════
   Main 3D Scene
═══════════════════════════════════════ */

function buildThreeScene(container, onSelectBouquet, onSelectCard) {
    const canvasEl = document.createElement("canvas");
    canvasEl.id = "s3-three-canvas";
    canvasEl.style.touchAction = "none";
    container.appendChild(canvasEl);

    const glowEl = document.createElement("div");
    glowEl.id = "s3-glow-aura";
    container.appendChild(glowEl);

    const hint = document.createElement("div");
    hint.id = "s3-tap-hint";
    hint.textContent = "✨  Nhấn để mở quà  ✨";
    container.appendChild(hint);

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({
        canvas: canvasEl,
        antialias: true,
        alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        0.1,
        100,
    );

    const isMobile = window.innerWidth < 768;
    const SPHERE_R = isMobile ? 1.4 : 2;
    const CAM_Z = isMobile ? 4.5 : 5.2;
    camera.position.z = CAM_Z;

    /* ── Star particles ── */
    const starCount = isMobile ? 350 : 700;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
        starPos[i * 3] = (Math.random() - 0.5) * 28;
        starPos[i * 3 + 1] = (Math.random() - 0.5) * 28;
        starPos[i * 3 + 2] = (Math.random() - 0.5) * 28;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
        color: 0xffb3d1,
        size: 0.05,
        transparent: true,
        opacity: 0.55,
        sizeAttenuation: true,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    /* ── Heart sphere ── */
    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    const heartCount = isMobile ? 180 : 350;
    const positions = fibSphere(heartCount, SPHERE_R);
    const loader = new THREE.TextureLoader();
    const sprites = [];

    HEART_PATHS.forEach((path, ti) => {
        loader.load(
            path,
            (texture) => {
                positions.forEach((pos, idx) => {
                    if (idx % HEART_PATHS.length !== ti) return;
                    const mat = new THREE.SpriteMaterial({
                        map: texture,
                        transparent: true,
                        depthWrite: true,
                        alphaTest: 0.05,
                    });
                    const sprite = new THREE.Sprite(mat);
                    sprite.position.copy(pos);
                    const s = (0.07 + Math.random() * 0.11) * SPHERE_R;
                    sprite.scale.set(s, s, s);
                    sphereGroup.add(sprite);
                    sprites.push(sprite);
                });
            },
            undefined,
            () => {},
        );
    });

    /* ═══════════════════════════════════════
     Gifts inside the sphere (visible from start)
  ═══════════════════════════════════════ */
    const giftsGroup = new THREE.Group();
    scene.add(giftsGroup);

    /* Bouquet sprite – large, centered */
    const bouquetMat = new THREE.SpriteMaterial({
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
    });
    const bouquetSprite = new THREE.Sprite(bouquetMat);
    bouquetSprite.position.set(0, 0.08, 0);
    bouquetSprite.scale.set(0.001, 0.001, 1);
    const bouquetBaseH = SPHERE_R * 1.02;
    bouquetSprite.userData = {
        type: "bouquet",
        baseH: bouquetBaseH,
        aspect: 1,
        hoverScale: 1,
    };
    giftsGroup.add(bouquetSprite);

    loader.load(BOUQUET, (tex) => {
        bouquetMat.map = tex;
        bouquetMat.needsUpdate = true;
        const aspect = tex.image.width / tex.image.height;
        bouquetSprite.userData.aspect = aspect;
        const h = bouquetSprite.userData.baseH;
        bouquetSprite.scale.set(h * aspect, h, 1);
    });

    /* Card mesh – bottom-right of bouquet, tilted */
    const cardCanvas = createCardCanvas();
    const cardTex = new THREE.CanvasTexture(cardCanvas);
    const cardAspect = 400 / 520;
    const cardH = SPHERE_R * 0.32;
    const cardW = cardH * cardAspect;
    const cardGeo = new THREE.PlaneGeometry(cardW, cardH);
    const cardMeshMat = new THREE.MeshBasicMaterial({
        map: cardTex,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
    });
    const cardMesh = new THREE.Mesh(cardGeo, cardMeshMat);
    cardMesh.position.set(SPHERE_R * 0.18, -SPHERE_R * 0.38, 0.15);
    cardMesh.rotation.z = -0.18;
    cardMesh.userData = { type: "card", hoverScale: 1 };
    giftsGroup.add(cardMesh);

    /* Disc mesh – bottom-left of bouquet */
    const discMeshMat = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
        depthWrite: false,
    });
    const discSize = SPHERE_R * 0.32;
    const discGeo = new THREE.PlaneGeometry(discSize, discSize);
    const discMesh = new THREE.Mesh(discGeo, discMeshMat);
    discMesh.position.set(-SPHERE_R * 0.18, -SPHERE_R * 0.38, 0.15);
    discMesh.userData = { type: "disc" };
    giftsGroup.add(discMesh);

    loader.load(DISC_IMG, (tex) => {
        discMeshMat.map = tex;
        discMeshMat.needsUpdate = true;
    });

    /* Inner sparkle particles */
    const sparkCount = isMobile ? 50 : 100;
    const sparkPosArr = new Float32Array(sparkCount * 3);
    const sparkColArr = new Float32Array(sparkCount * 3);
    const sparkR = SPHERE_R * 0.5;
    const sparkH = SPHERE_R * 0.55;
    const SP_COLS = [
        [1, 0.94, 0.96],
        [1, 0.7, 0.82],
        [0.91, 0.84, 1],
        [1, 0.84, 0],
    ];
    for (let i = 0; i < sparkCount; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.random() * sparkR;
        sparkPosArr[i * 3] = Math.cos(a) * r;
        sparkPosArr[i * 3 + 1] = (Math.random() - 0.5) * sparkH * 2;
        sparkPosArr[i * 3 + 2] = Math.sin(a) * r;
        const c = SP_COLS[i % 4];
        sparkColArr[i * 3] = c[0];
        sparkColArr[i * 3 + 1] = c[1];
        sparkColArr[i * 3 + 2] = c[2];
    }
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute(
        "position",
        new THREE.BufferAttribute(sparkPosArr, 3),
    );
    sparkGeo.setAttribute("color", new THREE.BufferAttribute(sparkColArr, 3));
    const sparkMat = new THREE.PointsMaterial({
        size: 0.045,
        transparent: true,
        opacity: 0.5,
        sizeAttenuation: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
    });
    giftsGroup.add(new THREE.Points(sparkGeo, sparkMat));

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0xff4d8d, 0.8));
    const pointLight = new THREE.PointLight(0xffd700, 1.2, 12);
    pointLight.position.set(2, 2, 3);
    scene.add(pointLight);

    /* ── Hover glow highlight ── */
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 128; glowCanvas.height = 128;
    const gCtx = glowCanvas.getContext('2d');
    const gGrad = gCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gGrad.addColorStop(0, 'rgba(255, 77, 141, 0.75)');
    gGrad.addColorStop(0.35, 'rgba(255, 183, 209, 0.35)');
    gGrad.addColorStop(1, 'rgba(255, 77, 141, 0)');
    gCtx.fillStyle = gGrad;
    gCtx.fillRect(0, 0, 128, 128);
    const glowTex = new THREE.CanvasTexture(glowCanvas);
    const glowMat = new THREE.SpriteMaterial({
      map: glowTex, transparent: true, opacity: 0, depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const glowSprite = new THREE.Sprite(glowMat);
    glowSprite.scale.set(1, 1, 1);
    scene.add(glowSprite);

    /* ── Gift selection hint ── */
    const giftHint = document.createElement('div');
    giftHint.id = 's3-gift-hint';
    giftHint.textContent = '✨ Nhấn vào món quà muốn xem ✨';
    container.appendChild(giftHint);

    /* ── Resize ── */
    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onResize);

    canvasEl.style.opacity = "0";
    glowEl.style.opacity = "0";

    /* ── Raycaster ── */
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    let hoveredObj = null;
    let giftClickable = false;
    let giftSelected = false;

    function updateMouse(e) {
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const y = e.touches ? e.touches[0].clientY : e.clientY;
        mouse.x = (x / window.innerWidth) * 2 - 1;
        mouse.y = -(y / window.innerHeight) * 2 + 1;
    }

    /* ── Drag-to-rotate sphere ── */
    let isDragging = false;
    let dragMoved = false;
    let prevPtrX = 0,
        prevPtrY = 0;
    let sphereVelY = 0.0025;
    let sphereVelX = 0.0008;

    function onDragStart(e) {
        if (phase !== "rotate" && phase !== "gifts") return;
        isDragging = true;
        dragMoved = false;
        const pt = e.touches ? e.touches[0] : e;
        prevPtrX = pt.clientX;
        prevPtrY = pt.clientY;
    }

    function onDragMove(e) {
        if (!isDragging) return;
        const pt = e.touches ? e.touches[0] : e;
        const dx = pt.clientX - prevPtrX;
        const dy = pt.clientY - prevPtrY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragMoved = true;
        sphereVelY = dx * 0.004;
        sphereVelX = dy * 0.002;
        prevPtrX = pt.clientX;
        prevPtrY = pt.clientY;
    }

    function onDragEnd() {
        isDragging = false;
    }

    canvasEl.addEventListener("pointerdown", onDragStart);
    window.addEventListener("pointermove", onDragMove);
    window.addEventListener("pointerup", onDragEnd);

    /* ── Animation state ── */
    let rafId = null;
    let phase = "intro";
    let introStart = null;
    let zoomStart = null;

    const INTRO_DUR = 1400;
    const INTRO_FROM = 3.8;
    const ZOOM_DUR = 1800;
    const CAM_FROM = CAM_Z;
    const CAM_TO = 2.5;

    function easeOutBack(t) {
        const c1 = 1.70158,
            c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }

    /* Common: floating gifts + sparkle drift (runs every frame) */
    function animateGifts(ts) {
        bouquetSprite.position.y = 0.08 + Math.sin(ts * 0.0012) * 0.04;

        const cardBaseY = -SPHERE_R * 0.38;
        cardMesh.position.y = cardBaseY + Math.sin(ts * 0.0012 + 1.5) * 0.03;
        cardMesh.rotation.y = Math.sin(ts * 0.0006) * 0.12;

        const discBaseY = -SPHERE_R * 0.38;
        discMesh.position.y = discBaseY + Math.sin(ts * 0.0012 + 3.0) * 0.03;
        discMesh.rotation.z = ts * 0.0004;

        const sp = sparkGeo.attributes.position.array;
        for (let i = 0; i < sparkCount; i++) {
            sp[i * 3 + 1] += Math.sin(ts * 0.0008 + i * 0.5) * 0.0004;
        }
        sparkGeo.attributes.position.needsUpdate = true;
    }

    /* ── Render loop ── */
    function loop(ts) {
        rafId = requestAnimationFrame(loop);

        /* Gifts float in every phase */
        animateGifts(ts);

        /* — Intro: sphere scales in with gifts already inside — */
        if (phase === "intro") {
            if (!introStart) introStart = ts;
            const elapsed = ts - introStart;
            const t = Math.min(elapsed / INTRO_DUR, 1);
            const et = easeOutBack(t);

            sphereGroup.scale.setScalar(lerpN(INTRO_FROM, 1, et));
            sphereGroup.rotation.y += 0.004;
            sphereGroup.rotation.x += 0.001;

            const giftIntro = easeOutCubic(Math.min(elapsed / 1200, 1));
            giftsGroup.scale.setScalar(lerpN(0.3, 1, giftIntro));

            const fp = Math.min(elapsed / (INTRO_DUR * 0.6), 1);
            canvasEl.style.opacity = fp.toFixed(3);
            glowEl.style.opacity = fp.toFixed(3);

            if (t >= 1) {
                canvasEl.style.opacity = "1";
                glowEl.style.opacity = "1";
                giftsGroup.scale.setScalar(1);
                phase = "rotate";
            }

            /* — Rotate: drag-to-rotate or auto-spin — */
        } else if (phase === "rotate") {
            if (!isDragging) {
                sphereVelY += (0.0025 - sphereVelY) * 0.03;
                sphereVelX += (0.0008 - sphereVelX) * 0.03;
            }
            sphereGroup.rotation.y += sphereVelY;
            sphereGroup.rotation.x += sphereVelX;
            sphereGroup.scale.setScalar(1 + Math.sin(ts * 0.001) * 0.025);

            /* — Zoom: camera dives into sphere — */
        } else if (phase === "zoom") {
            if (!zoomStart) zoomStart = ts;
            const elapsed = ts - zoomStart;
            const t = Math.min(elapsed / ZOOM_DUR, 1);
            const et = easeOutCubic(t);

            camera.position.z = lerpN(CAM_FROM, CAM_TO, et);
            sphereGroup.scale.setScalar(1 + et * 3.5);

            sprites.forEach((s) => {
                s.material.opacity = Math.max(0.1, 1 - et * 0.9);
            });

            bouquetMat.opacity = lerpN(0.85, 1, et);
            cardMeshMat.opacity = lerpN(0.85, 1, et);
            discMeshMat.opacity = lerpN(0.85, 1, et);
            sparkMat.opacity = lerpN(0.5, 0.7, et);

            hint.style.opacity = (1 - Math.min(t * 3, 1)).toFixed(3);

            if (t > 0.4) {
                const gt = (t - 0.4) / 0.6;
                glowEl.style.opacity = (1 - gt * 0.7).toFixed(3);
            }

            if (t >= 1) {
                phase = "gifts";
                hint.style.display = "none";
                giftHint.classList.add('visible');
                setTimeout(() => {
                    giftClickable = true;
                }, 400);
            }

            /* — Gifts: labels visible, clickable, drag-to-rotate — */
        } else if (phase === "gifts") {
            if (!isDragging) {
                sphereVelY += (0.0006 - sphereVelY) * 0.03;
                sphereVelX += (0 - sphereVelX) * 0.03;
            }
            sphereGroup.rotation.y += sphereVelY;
            sphereGroup.rotation.x += sphereVelX;

            /* Hover detection */
            if (giftClickable && !giftSelected) {
                raycaster.setFromCamera(mouse, camera);
                const hits = raycaster.intersectObjects([
                    bouquetSprite,
                    cardMesh,
                ]);
                const newH = hits.length > 0 ? hits[0].object : null;
                if (newH !== hoveredObj) {
                    hoveredObj = newH;
                    canvasEl.style.cursor = hoveredObj ? "pointer" : "default";
                }
            }

            /* Hover scale lerp */
            [bouquetSprite, cardMesh].forEach((obj) => {
                const target = obj === hoveredObj && !giftSelected ? 1.2 : 1;
                const cur = obj.userData.hoverScale;
                const next = cur + (target - cur) * 0.08;
                obj.userData.hoverScale = next;

                if (obj === bouquetSprite) {
                    const h = obj.userData.baseH;
                    const a = obj.userData.aspect;
                    obj.scale.set(h * a * next, h * next, 1);
                } else {
                    obj.scale.set(next, next, next);
                }
            });

            /* Glow highlight follows hovered item */
            if (hoveredObj && !giftSelected) {
                glowSprite.position.copy(hoveredObj.position);
                glowSprite.position.z -= 0.05;
                const pulse = 0.55 + Math.sin(ts * 0.005) * 0.3;
                glowMat.opacity = pulse;
                if (hoveredObj === bouquetSprite) {
                    const gs = bouquetBaseH * 1.6;
                    glowSprite.scale.set(gs * bouquetSprite.userData.aspect, gs, 1);
                } else {
                    const gs = cardH * 2.2;
                    glowSprite.scale.set(gs, gs, 1);
                }
            } else {
                glowMat.opacity = 0;
            }
        }

        renderer.render(scene, camera);
    }

    rafId = requestAnimationFrame(loop);

    /* ── Zoom trigger ── */
    let clickEnabled = false;
    setTimeout(() => {
        clickEnabled = true;
    }, 900);

    function handleZoomClick() {
        if (!clickEnabled || phase !== "rotate" || dragMoved) return;
        container.removeEventListener("click", handleZoomClick);
        phase = "zoom";
    }
    container.addEventListener("click", handleZoomClick);

    /* ── Gift click / tap ── */
    function handleGiftPointer(e) {
        if (!giftClickable || giftSelected) return;
        updateMouse(e);
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects([bouquetSprite, cardMesh]);
        if (hits.length === 0) return;

        giftSelected = true;
        canvasEl.style.cursor = "default";
        const type = hits[0].object.userData.type;

        /* Flash overlay transition */
        const flash = document.createElement("div");
        flash.style.cssText = `
      position:fixed; inset:0; z-index:9999;
      background:radial-gradient(circle,#fff5f8 0%,#FFB3D1 60%,#FF4D8D 100%);
      opacity:0; pointer-events:none; transition:opacity 0.15s ease;
    `;
        document.body.appendChild(flash);
        requestAnimationFrame(() => {
            flash.style.opacity = "0.85";
            setTimeout(() => {
                flash.style.transition = "opacity 0.35s ease";
                flash.style.opacity = "0";
                setTimeout(() => {
                    flash.remove();
                    if (type === "bouquet") onSelectBouquet();
                    else onSelectCard();
                }, 380);
            }, 160);
        });
    }

    canvasEl.addEventListener("click", (e) => {
        if (dragMoved) return;
        handleGiftPointer(e);
    });
    canvasEl.addEventListener("pointermove", updateMouse);

    /* ── Destroy ── */
    function destroy() {
        if (rafId) cancelAnimationFrame(rafId);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("pointermove", onDragMove);
        window.removeEventListener("pointerup", onDragEnd);
        sprites.forEach((s) => {
            s.material.map?.dispose();
            s.material.dispose();
        });
        starGeo.dispose();
        starMat.dispose();
        sparkGeo.dispose();
        sparkMat.dispose();
        glowTex.dispose();
        glowMat.dispose();
        cardGeo.dispose();
        cardMeshMat.dispose();
        cardTex.dispose();
        discGeo.dispose();
        discMeshMat.map?.dispose();
        discMeshMat.dispose();
        bouquetMat.map?.dispose();
        bouquetMat.dispose();
        renderer.dispose();
    }

    return { destroy };
}

/* ═══════════════════════════════════════
   Entry point
═══════════════════════════════════════ */
export function initScreen3(container, onSelectBouquet, onSelectCard) {
    container.innerHTML = "";
    let destroyed = false;

    const ctrl = buildThreeScene(
        container,
        () => {
            if (!destroyed) onSelectBouquet();
        },
        () => {
            if (!destroyed) onSelectCard();
        },
    );

    return function destroy() {
        destroyed = true;
        ctrl.destroy();
        container.innerHTML = "";
    };
}
