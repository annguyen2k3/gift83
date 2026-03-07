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
- **Âm thanh (tùy chọn):** Nhạc nền nhẹ nhàng bắt đầu fade in.
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
- **Cá nhân hóa (tùy chọn):** Tên người nhận có thể được truyền qua URL param để hiển thị trong lời chúc.
- **Chuyển về:** Nút quay lại hoặc share.

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
- Tên người nhận có thể truyền qua URL: `?to=Linh` → hiển thị trong lời chúc thiệp.
- Toàn bộ lời chúc cấu hình dễ dàng để tặng nhiều người khác nhau.
