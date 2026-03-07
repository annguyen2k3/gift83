# 🌸 Gift83 – Website Quà Tặng 8/3

## Tổng quan
Website là một món quà kỹ thuật số chúc mừng Ngày Quốc tế Phụ nữ 8/3, được xây dựng với trải nghiệm tương tác nhiều tầng, dẫn dắt người nhận qua một hành trình cảm xúc từ bí ẩn đến bất ngờ và cảm động.

---

## Kịch bản chi tiết

### Màn 1 – Trang chờ (Loading Screen)
- **Mục đích:** Cho phép load trước toàn bộ assets (3D, hiệu ứng, âm thanh) mà không làm người dùng chờ đợi nhàm chán.
- **Giao diện:** Nền tối hoặc gradient nhẹ, có thể có các hạt sáng nhỏ bay lơ lửng (particle background).
- **Tương tác chính:** Nút / vùng **"Nhấn giữ để bắt đầu"** (press-and-hold), thanh tiến trình hiện ra khi đang giữ, thả tay thì reset.
- **Chuyển cảnh:** Khi giữ đủ thời gian → chuyển sang Màn 2 với hiệu ứng fade/wipe.

---

### Màn 2 – Chữ chạy "Happy Women's Day"
- **Hiệu ứng:** Dòng chữ **"Happy Women's Day"** xuất hiện theo kiểu animate từng ký tự (typewriter, glitch, hoặc float-in từ dưới lên).
- **Trang trí:** Pháo hoa nhỏ, cánh hoa rơi nhẹ hoặc confetti xung quanh dòng chữ.
- **Chuyển cảnh:** Tự động sau vài giây → chuyển sang Màn 3.

---

### Màn 3 – Không gian 3D & Hình cầu trái tim
- **Cảnh:** Không gian 3D với **hình cầu** được tạo thành từ nhiều trái tim ❤️ nhỏ xoay quanh, có thể có hiệu ứng phát sáng, hào quang.
- **Tương tác:** Click / Tap vào màn hình → Camera **zoom in** vào bên trong hình cầu.
- **Bên trong hình cầu:**
  - Xuất hiện các hiệu ứng đẹp mắt (tia sáng, hạt lấp lánh, mây sáng...).
  - Hiện ra **2 món quà**:
    - 🌹 **Bó hoa**
    - 💌 **Tấm thiệp**
  - Mỗi món quà được đặt nổi bật, có hoạt ảnh nhẹ (lơ lửng, xoay chậm) để thu hút click.

---

### Màn 4 – Click vào Bó hoa: Vườn hoa nở
- **Hiệu ứng mở:** Bó hoa phình to, tan ra thành đất → từ đó **hoa mọc lên và nở rộ** dần dần tràn màn hình.
- **Chi tiết:**
  - Nhiều loại hoa xuất hiện từ dưới lên (hướng dương, hoa hồng, hoa anh đào...).
  - Sau khi nở đầy màn hình → **cánh hoa bắt đầu rụng, bay tung** theo gió.
  - Hiệu ứng kết thúc sau một khoảng thời gian, màn hình dịu lại.
- **Chuyển về:** Nút quay lại để chọn quà còn lại.

---

### Màn 5 – Click vào Thiệp: Mở thiệp & Lời chúc
- **Hiệu ứng mở thiệp:**
  - Thiệp phóng to ra giữa màn hình, có hiệu ứng **lật/mở** như mở phong bì hoặc gấp giấy.
  - Ánh sáng lóe ra khi thiệp mở.
- **Nội dung bên trong:**
  - Lời chúc được viết theo kiểu chữ đẹp (handwriting font), xuất hiện từng dòng.
  - Có thể kèm hình ảnh nhỏ hoặc hoa lá trang trí xung quanh.
- **Cá nhân hóa (tùy chọn):** Tên người nhận truyền qua URL param `?dear=Huyền` → hiển thị trong lời chúc. Nếu không có tham số, mặc định dùng từ **"bạn"**.
- **Chuyển về:** Nút quay lại hoặc share.

---

## Bảng màu & Ngôn ngữ thị giác

### Bảng màu chính

| Vai trò | Màu | Mã HEX |
|---|---|---|
| Nền chính (tối) | Đen tím sâu | `#0D0010` |
| Nền phụ / gradient | Tím đêm | `#1A0025` |
| Accent 1 – chủ đạo | Hồng đào | `#FF4D8D` |
| Accent 2 – bổ trợ | Hồng tím nhạt | `#D966C0` |
| Accent 3 – sang trọng | Vàng ánh kim | `#FFD700` |
| Ánh sáng / phát sáng | Hồng trắng mờ | `#FFB3D1` |
| Chữ chính | Trắng tinh | `#FFFFFF` |
| Chữ phụ / mô tả | Trắng mờ | `rgba(255,255,255,0.75)` |
| Hạt particle sáng | Trắng xanh lạnh | `#E8D5FF` |

> **Nguyên tắc màu:** Toàn bộ ứng dụng giữ nền tối (dark background) để các màu hồng – tím – vàng bật sáng mạnh, tạo cảm giác huyền ảo, lãng mạn. Tuyệt đối không dùng nền trắng hay màu pastel nhạt làm nền chính.

---

### Gradient thường dùng

| Tên | Định nghĩa CSS |
|---|---|
| Nền toàn cục | `linear-gradient(135deg, #0D0010 0%, #1A0025 50%, #0D0010 100%)` |
| Hiệu ứng ánh hào quang | `radial-gradient(circle, #FF4D8D55 0%, transparent 70%)` |
| Dải sáng trái tim / hoa | `radial-gradient(circle, #FFD70088 0%, #FF4D8D44 40%, transparent 70%)` |
| Nền thiệp (bên trong) | `linear-gradient(160deg, #2D0040 0%, #1A0025 60%, #3D0050 100%)` |

---

## Yêu cầu chung cho hiệu ứng

### 1. Nhất quán về "cảm giác" chuyển động
- **Easing mặc định:** `cubic-bezier(0.25, 0.46, 0.45, 0.94)` (ease-out-quad) — tạo cảm giác mềm mại, không giật cục.
- **Không dùng** `linear` cho bất kỳ hiệu ứng nào liên quan đến vật thể, hoa, particle. Chỉ dùng linear cho thanh tiến trình (progress bar).
- Mọi đối tượng khi xuất hiện phải có **fade-in + scale/translate** kết hợp, không pop ra đột ngột.

### 2. Ánh sáng & phát sáng (Glow)
- Các phần tử nổi bật (trái tim 3D, tiêu đề, nút bấm) phải có `box-shadow` hoặc `filter: drop-shadow` màu hồng/vàng để tạo hiệu ứng glow.
- Glow nên **nhịp thở được** (pulsing glow): opacity dao động nhẹ `0.6 → 1.0` theo vòng lặp khoảng `2–3s`.
- Ánh sáng lóe (`flash/flare`) khi mở thiệp hoặc zoom vào hình cầu: màu trắng → hồng, kéo dài `~300ms` rồi fade out.

### 3. Particle & hạt bay
- **Màu hạt:** Ưu tiên trắng ngà (`#FFF0F5`), hồng nhạt (`#FFB3D1`), tím nhạt (`#E8D5FF`), vàng nhỏ (`#FFD700`) — trộn ngẫu nhiên tỉ lệ 4:3:2:1.
- **Kích thước:** Đa dạng từ `1px` đến `4px` để tạo chiều sâu, các hạt nhỏ hơn ở xa hơn.
- **Tốc độ:** Chậm và trôi, `1–3s` mỗi chu kỳ. Không để hạt bay nhanh hoặc rõ ràng hướng di chuyển.
- **Số lượng:** Tối đa `150 hạt` trên desktop, `80 hạt` trên mobile để đảm bảo hiệu năng.

### 4. Chuyển cảnh giữa các màn
- Mọi chuyển cảnh đều dùng **cross-fade** (overlay trắng/hồng fade in → màn mới hiện → overlay fade out), thời gian `~600ms`.
- Không dùng slide ngang hoặc các hiệu ứng di chuyển màn hình kiểu trình chiếu.
- Âm thanh (nếu có) fade in/out mượt, không cắt đột ngột.

### 5. Typography & chữ động
- **Font chữ chính:** Serif hoặc Handwriting đẹp (ví dụ: `Playfair Display`, `Dancing Script` từ Google Fonts).
- **Font phụ / UI:** Sans-serif nhẹ (ví dụ: `Inter`, `Nunito`).
- Chữ tiêu đề luôn có `text-shadow` màu hồng nhạt để bật trên nền tối.
- Hiệu ứng xuất hiện chữ: ưu tiên **từng ký tự fade-in + translateY(10px → 0)** với delay tăng dần, tránh kiểu typewriter cứng nhắc.

### 6. Tương tác & phản hồi (Feedback)
- Mọi phần tử có thể click phải có trạng thái **hover rõ ràng**: scale nhẹ (`1.05–1.1`) + tăng glow.
- Nút bấm / vùng tương tác cần **ripple effect** hoặc flash màu hồng khi được nhấn.
- Trên mobile, đảm bảo vùng chạm tối thiểu `48x48px` để dễ thao tác.

### 7. Hiệu năng
- Ưu tiên CSS Animation / CSS Transform (`translate`, `scale`, `opacity`) thay vì animate `width/height/top/left` để tránh layout reflow.
- Three.js: giới hạn số lượng geometry, dùng `InstancedMesh` cho particle 3D hàng loạt (trái tim trong hình cầu).
- Toàn bộ animation nên dừng hoặc throttle khi tab bị ẩn (`document.visibilityState === 'hidden'`).

---

## Công nghệ sử dụng
| Phần | Công nghệ |
|---|---|
| Giao diện & hiệu ứng 2D | HTML / CSS / Vanilla JS |
| Particle bay lơ lửng | Canvas API |
| Cánh hoa rơi, vườn hoa | CSS Animation + SVG + JS DOM |
| Mở thiệp / lật thiệp | CSS 3D Transform (perspective, rotateY) |
| Không gian 3D & hình cầu trái tim | Three.js (load qua CDN, không cần build tool) |
| Hiệu ứng particle 3D | Three.js Particles |
| Build tool | **Không cần** – chạy thẳng trên trình duyệt |
| Deploy | GitHub Pages hoặc bất kỳ static hosting |

---

## Cấu trúc file
```
gift83/
├── index.html          # Entry point
├── style.css           # Style chung
├── main.js             # Điều phối các màn
├── screens/
│   ├── screen1.js      # Màn 1 – Loading / Press & Hold
│   ├── screen2.js      # Màn 2 – Happy Women's Day
│   ├── screen3.js      # Màn 3 – Không gian 3D hình cầu
│   ├── screen4.js      # Màn 4 – Vườn hoa nở
│   └── screen5.js      # Màn 5 – Mở thiệp & lời chúc
└── assets/
    └── fonts/          # Font chữ viết tay (Google Fonts)
```

---

## Ghi chú
- **Không cần npm / Vite / build tool** – mở `index.html` trực tiếp là chạy.
- Three.js được load qua `importmap` từ CDN (jsDelivr).
- Tối ưu cho **mobile** (touch) lẫn **desktop** (mouse).
- Tên người nhận truyền qua URL: `?dear=Huyền` → hiển thị trong lời chúc thiệp. Không có tham số → mặc định hiển thị **"bạn"**.
- Toàn bộ lời chúc cấu hình dễ dàng để tặng nhiều người khác nhau.
