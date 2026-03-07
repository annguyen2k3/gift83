const WRAP_FRONT = "img/giay_goi_hoa_truoc.png";
const WRAP_BACK = "img/giay_goi_hoa_sau.png";
const ROSE_IMG = "img/canh_hoa_hong.png";

const ROSES = [
    // Hàng 2 (phía sau, 5 ảnh) - rìa thấp hơn giữa
    { x: 20, y: 37, rot: -22, s: 0.48, z: 1 },
    { x: 80, y: 37, rot: 22, s: 0.48, z: 1 },
    { x: 35, y: 31, rot: -12, s: 0.6, z: 2 },
    { x: 65, y: 31, rot: 12, s: 0.6, z: 2 },
    { x: 50, y: 29, rot: 0, s: 0.78, z: 3 },
    // Hàng 1 (phía trước, 3 ảnh) - không có 2 rìa ngoài
    { x: 36, y: 40, rot: -12, s: 0.78, z: 5 },
    { x: 64, y: 40, rot: 12, s: 0.78, z: 5 },
    { x: 50, y: 44, rot: 0, s: 1.1, z: 6 },
];

const CIRCLES = [
    // Hàng 2 (phía sau, 5 ảnh) - rìa thấp hơn giữa
    { x: 20, y: 29, r: 10, rot: -22, z: 1 },
    { x: 80, y: 31, r: 10, rot: 35, z: 1 },
    { x: 35, y: 20, r: 12, rot: -12, z: 2 },
    { x: 65, y: 20, r: 12, rot: 12, z: 2 },
    { x: 50, y: 20, r: 15, rot: 0, z: 3 },
    // Hàng 1 (phía trước, 3 ảnh) - không có 2 rìa ngoài
    { x: 36, y: 35, r: 15, rot: -9, z: 5 },
    { x: 64, y: 35, r: 15, rot: 9, z: 5 },
    { x: 50, y: 40, r: 19, rot: 0, z: 6 },
];

function loadImg(src) {
    return new Promise((res) => {
        const i = new Image();
        i.crossOrigin = "anonymous";
        i.onload = () => res(i);
        i.onerror = () => res(null);
        i.src = src;
    });
}

function mk(tag, cls) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    return e;
}

export function initScreen4(container, onBack) {
    container.innerHTML = "";
    let userSrc = null;

    const wrapper = mk("div", "s4-wrapper");

    const bouquet = mk("div", "s4-bouquet");
    const floater = mk("div", "s4-float");

    const imgBk = mk("img", "s4-wrap s4-wrap--bk");
    imgBk.src = WRAP_BACK;
    imgBk.draggable = false;
    floater.appendChild(imgBk);

    const flowers = mk("div", "s4-flowers");
    const rosesBox = mk("div", "s4-roses");
    ROSES.forEach((r) => {
        const img = mk("img", "s4-rose");
        img.src = ROSE_IMG;
        img.draggable = false;
        img.style.left = r.x + "%";
        img.style.top = r.y + "%";
        img.style.zIndex = r.z;
        img.style.transform = `translate(-50%,-50%) rotate(${r.rot}deg) scale(${r.s})`;
        rosesBox.appendChild(img);
    });
    flowers.appendChild(rosesBox);

    const circlesBox = mk("div", "s4-circles");
    flowers.appendChild(circlesBox);
    floater.appendChild(flowers);

    const imgFt = mk("img", "s4-wrap s4-wrap--ft");
    imgFt.src = WRAP_FRONT;
    imgFt.draggable = false;
    floater.appendChild(imgFt);

    bouquet.appendChild(floater);
    wrapper.appendChild(bouquet);

    const btns = mk("div", "s4-btns");
    const pickBtn = mk("button", "s4-pick-btn");
    pickBtn.textContent = "🌸 Chọn ảnh";
    btns.appendChild(pickBtn);

    const dlBtn = mk("button", "s4-dl-btn");
    dlBtn.textContent = "💾 Lưu ảnh";
    btns.appendChild(dlBtn);
    wrapper.appendChild(btns);

    const desc = mk("p", "s4-desc");
    desc.textContent =
        "Dành tặng cho bạn 1 đoá hoa tươi thắm cho ngày 8/3 thêm rực rỡ. " +
        "Bạn cũng có thể tạo đoá hoa của bản thân bằng avatar PNG. Hãy thử nhé.";
    wrapper.appendChild(desc);

    container.appendChild(wrapper);

    const backBtn = mk("button", "s4-back-btn");
    backBtn.textContent = "✨ Quay lại chọn quà ✨";
    backBtn.addEventListener("click", () => onBack?.());
    container.appendChild(backBtn);

    const fileIn = document.createElement("input");
    fileIn.type = "file";
    fileIn.accept = "image/*";
    fileIn.style.display = "none";
    container.appendChild(fileIn);

    imgBk.onload = () => {
        bouquet.style.aspectRatio =
            imgBk.naturalWidth + "/" + imgBk.naturalHeight;
    };

    pickBtn.addEventListener("click", () => fileIn.click());

    fileIn.addEventListener("change", () => {
        const f = fileIn.files?.[0];
        if (!f) return;
        const rd = new FileReader();
        rd.onload = (ev) => {
            userSrc = ev.target.result;
            renderCircles(userSrc);
        };
        rd.readAsDataURL(f);
    });

    function renderCircles(src) {
        rosesBox.style.display = "none";
        circlesBox.innerHTML = "";

        CIRCLES.forEach((c, i) => {
            const img = mk("img", "s4-user-img");
            img.src = src;
            img.draggable = false;
            img.style.left = c.x + "%";
            img.style.top = c.y + "%";
            img.style.width = c.r * 2 + "%";
            img.style.zIndex = c.z;
            img.style.opacity = "0";
            img.style.transform = `translate(-50%,-50%) rotate(${c.rot}deg) scale(0)`;
            circlesBox.appendChild(img);

            setTimeout(
                () => {
                    img.style.transition =
                        "opacity .45s cubic-bezier(.34,1.56,.64,1)," +
                        "transform .45s cubic-bezier(.34,1.56,.64,1)";
                    img.style.opacity = "1";
                    img.style.transform = `translate(-50%,-50%) rotate(${c.rot}deg) scale(1)`;
                },
                60 + i * 80,
            );
        });
    }

    dlBtn.addEventListener("click", download);

    async function download() {
        const W = 1080,
            H = 1800;
        const cvs = document.createElement("canvas");
        cvs.width = W;
        cvs.height = H;
        const ctx = cvs.getContext("2d");

        const grd = ctx.createLinearGradient(0, 0, 0, H);
        grd.addColorStop(0, "#FFB3D1");
        grd.addColorStop(0.5, "#FFD6E7");
        grd.addColorStop(1, "#FFF5F8");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);

        const [bk, ft, roseImg, usr] = await Promise.all([
            loadImg(WRAP_BACK),
            loadImg(WRAP_FRONT),
            loadImg(ROSE_IMG),
            userSrc ? loadImg(userSrc) : Promise.resolve(null),
        ]);

        const ref = bk || ft;
        if (!ref) return;

        const asp = ref.naturalWidth / ref.naturalHeight;
        let dw, dh;
        if (asp > W / H) {
            dw = W * 0.92;
            dh = dw / asp;
        } else {
            dh = H * 0.88;
            dw = dh * asp;
        }
        const dx = (W - dw) / 2;
        const dy = (H - dh) / 2;

        if (bk) ctx.drawImage(bk, dx, dy, dw, dh);

        if (usr) {
            const imgAsp = usr.naturalWidth / usr.naturalHeight;
            CIRCLES.forEach((c) => {
                const cx = dx + (c.x / 100) * dw;
                const cy = dy + (c.y / 100) * dh;
                const iw = ((c.r * 2) / 100) * dw;
                const ih = iw / imgAsp;

                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate((c.rot * Math.PI) / 180);
                ctx.drawImage(usr, -iw / 2, -ih / 2, iw, ih);
                ctx.restore();
            });
        } else if (roseImg) {
            ROSES.forEach((r) => {
                const cx = dx + (r.x / 100) * dw;
                const cy = dy + (r.y / 100) * dh;
                const rH = dh * 0.58 * r.s;
                const rW = rH * (roseImg.naturalWidth / roseImg.naturalHeight);
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate((r.rot * Math.PI) / 180);
                ctx.drawImage(roseImg, -rW / 2, -rH / 2, rW, rH);
                ctx.restore();
            });
        }

        if (ft) ctx.drawImage(ft, dx, dy, dw, dh);

        const a = document.createElement("a");
        a.download = "bo-hoa-8-3.png";
        a.href = cvs.toDataURL("image/png");
        a.click();
    }

    requestAnimationFrame(() =>
        requestAnimationFrame(() => {
            bouquet.classList.add("s4-in");
            btns.classList.add("s4-in");
        }),
    );

    return () => {
        container.innerHTML = "";
    };
}
