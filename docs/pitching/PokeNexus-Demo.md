# PokeNexus - Video demo sản phẩm

- Phiên bản: 1.0 (cập nhật 2026-11-05)
- Mục đích: chiếu khi giới thiệu sản phẩm ở buổi pitching ngày 08/11/2026 và làm dự phòng khi mạng chậm (Issue #97).
- File: [PokeNexus-Demo.mp4](PokeNexus-Demo.mp4). H.264 High, `yuv420p`, 1920 × 1080, 30 fps, `+faststart`, không có âm thanh, 23,9 MB (22,8 MiB), thời lượng 04:40.
- Nguồn quay: bản build của `main` (commit `3f3e0f9`) chạy ở local: frontend `http://localhost:4180`, backend `http://localhost:8082/api/v1`, MySQL 8.4 có 1.351 dạng Pokémon. Không quay production vì lúc quay production còn bản cũ.
- Hình ảnh chỉ gồm giao diện PokeNexus và 3 trang chữ tự dựng (mở đầu, thẻ chương, kết thúc). Không có nhạc, không dùng hình ảnh ngoài những gì sản phẩm đang hiển thị.

---

## Phần 1. Danh sách cảnh

### I. Mốc thời gian

| Mốc | Phần | Nội dung |
|---|---|---|
| 00:00 | Mở đầu | Logo chữ PokeNexus, khẩu hiệu, 18 nhãn hệ, hạt màu 18 hệ bay |
| 00:07 | 1. Tổng quan | Hero, chọn vùng đất Núi lửa và Tầng mây, Năm vùng đất, Vòng tương khắc (Water, Ground), Pokémon hôm nay, biểu đồ 9 thế hệ (bấm Thế hệ 4), Thử tài Trainer (2 câu đúng) |
| 00:56 | 2. Pokédex | Lọc hệ Dragon và thế hệ 4, chuyển chế độ danh sách, mở Garchomp |
| 01:13 | 3. Chi tiết Pokémon | Chỉ số (tổng 600), tốc độ cấp 50 (96, 122, 169), phòng thủ, tiến hóa, chuyển sang Garchomp Mega |
| 01:39 | 4. Bảng tương khắc | Fire + Flying: Rock x4, miễn nhiễm Ground; ma trận 18 × 18, làm nổi bật hàng Rock |
| 01:58 | 5. So sánh | Garchomp và Salamence: radar, từng chỉ số, kết luận |
| 02:17 | 6. Team Builder | Xem bảng con ở mục II |
| 03:27 | 7. Lưu và chia sẻ | Lưu "Đội Rồng Lửa", nhận đường dẫn `/team/<mã>`, mở trang đội chia sẻ đủ 6 thành viên |
| 03:48 | 8. Địa hình | Chọn Núi lửa, chơi 1 lượt Who's that Pokémon? |
| 04:04 | 9. Trên điện thoại | 375 × 812 px, cảm ứng: Tổng quan cuộn nhanh (04:06), Pokédex dạng danh sách (04:16), giữ ngón tay 1,5 giây trên thẻ thành viên (04:25) |
| 04:31 | Kết thúc | `https://pokenexus.pages.dev`, `github.com/Nha-Cong-Dong/PokeNexus`, công nghệ chính |

- Mỗi phần mở đầu bằng thẻ tiêu đề 2 giây; mốc trong bảng là lúc thẻ tiêu đề xuất hiện.
- Chú thích phía dưới màn hình mô tả thao tác đang diễn ra. Vòng tròn viền trắng là con trỏ chuột giả; ở phần điện thoại, vòng tròn viền xanh là ngón tay, vòng vàng lớn dần khi giữ.

### II. Team Builder (02:17 đến 03:27)

| Mốc (khoảng) | Nội dung |
|---|---|
| 02:19 | Gõ "charizard": gợi ý có nhãn Mega, Gmax; chọn Charizard bản thường |
| 02:28 | Thêm Gyarados, Dragonite, Talonflame, Volcarona |
| 02:44 | Bản đồ điểm yếu: Rock "Lỗ hổng nghiêm trọng", 5 thành viên yếu, không ai kháng |
| 02:50 | Điểm đội 20/100, 2 lỗ hổng nghiêm trọng Rock và Electric |
| 02:56 | Đổi lối chơi sang Tấn công nhanh |
| 03:02 | Bật "Loại huyền thoại, thần thoại và Paradox": đề xuất số 1 là Excadrill |
| 03:07 | Thêm Excadrill vào slot 6, điểm đội lên 48 (03:11) |
| 03:15 | Rê chuột lên thẻ Charizard, hiện bảng "Xem thông tin chi tiết" |
| 03:19 | Xuất Showdown, bấm "Sao chép" |

### III. Lưu ý khi chiếu

- Video không có tiếng; người thuyết trình nói kèm.
- Đường dẫn chia sẻ trong video là `http://localhost:4180/team/...` vì quay ở local; bản thật có dạng `https://pokenexus.pages.dev/team/...`.
- Pokémon hôm nay đổi theo ngày, câu hỏi Who's that Pokémon? chọn ngẫu nhiên, nên khi demo trực tiếp sẽ khác video. Các số khác (điểm 20 lên 48, Excadrill, 96/122/169) cố định theo dữ liệu.

---

## Phần 2. Cách quay lại

### I. Công cụ

| Thành phần | Vai trò |
|---|---|
| Chrome headless, điều khiển qua Chrome DevTools Protocol | Thao tác chuột, bàn phím, cảm ứng, cuộn; chèn chú thích và con trỏ giả vào trang; quay bằng `Page.startScreencast` |
| Node.js 25 | Chạy script (dùng WebSocket có sẵn, không cài thư viện) |
| ffmpeg 9 trong gói Python `imageio-ffmpeg` | Ghép khung hình theo timestamp, chuyển mờ, ghép nền điện thoại, mã hóa H.264 hai lượt |

- Không thêm dependency vào dự án. Script và khung hình tạm không commit; bản dùng để quay video này nằm ở thư mục tạm của phiên làm việc (có thể bị xóa): `C:\Users\NGUYEN~1\AppData\Local\Temp\claude\abdfda36dad18be4\79091bad-601c-4c14-8c0e-5e52a05532c3\scratchpad\video\`.

| File | Nội dung |
|---|---|
| `cdp.mjs`, `lib.mjs` | Mở Chrome (cổng debug 9343), hàm thao tác và quay |
| `overlay.js` | Con trỏ giả, vòng chạm, chú thích phía dưới, cuộn mượt |
| `pages/` | Trang mở đầu, thẻ chương, kết thúc, nền điện thoại (font lấy từ bản build của frontend) |
| `rec.mjs` | Kịch bản 22 đoạn quay |
| `stage.mjs` | Vẽ nền và khung điện thoại cho phần 9 |
| `build.mjs` | Ghép và mã hóa ra MP4 |

### II. Các bước

- Dựng stack local: MySQL, backend ở cổng 8082, bản build frontend ở cổng 4180 trỏ tới backend đó.
- Cài ffmpeg vào thư mục script: `python -m pip install --target pylib imageio-ffmpeg`.
- `node stage.mjs`, rồi `node rec.mjs` để quay cả 22 đoạn; quay lại một đoạn: `node rec.mjs s6` (tên đoạn ở mảng `ORDER` trong `rec.mjs`).
- `node build.mjs all <đường dẫn>/PokeNexus-Demo.mp4` (khoảng 4 phút).

### III. Cách hoạt động

- Viewport 1440 × 810, Chrome chạy với `--force-device-scale-factor=1.3333333` nên khung hình là 1920 × 1080; `prefers-reduced-motion: no-preference` để giữ hiệu ứng của trang.
- Mỗi khung hình của screencast có timestamp; khi ghép, mỗi khung được giữ đến timestamp của khung kế tiếp, nên chuyển động đúng thời gian thật kể cả khi máy tải nặng.
- Mỗi cảnh chạy thử một lần (không quay) để nạp sẵn ảnh, xóa `localStorage` rồi mới quay; trong lúc quay, script chờ dữ liệu và ảnh trong khung nhìn tải xong.
- Đáp án Who's that Pokémon? được tra qua `GET /pokemon/{id}` từ ảnh đang hiện. Mỗi lần quay cảnh 7 lưu 2 đội vào DB local (lần chạy thử và lần quay).
