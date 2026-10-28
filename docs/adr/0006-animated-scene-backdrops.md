# ADR 0006 - Nền khung cảnh nhiều ảnh và chuyển động nền

- Trạng thái: Đã chấp nhận
- Ngày: 2026-10-28

## Phần 1. Bối cảnh

- Chạy thử ngày 2026-10-27, người dùng nhận xét ảnh nền mờ, mỗi khung cảnh chỉ có 1 ảnh nên thiếu đa dạng, và muốn nền có chuyển động (video hoặc ảnh động).
- Đo ngày 2026-10-28: 5/14 ảnh nguồn chỉ có 1280 x 720 rồi phóng lên 1600; ứng dụng chỉ phục vụ tối đa 1600 px nên màn hình 1920 px kéo giãn thêm 1,2 lần. Lớp phủ tối ở trang Tổng quan che 60% ảnh với độ mờ 90%.
- [design-system.md](../design-system.md) 0.5 cấm chuyển động lặp vô hạn ("Tối đa một khoảnh khắc mỗi trang, chạy một lần khi tải") và cấm ảnh do AI tạo.
- Ảnh khung cảnh tự host để chạy offline ([ADR 0002](0002-offline-data-from-csv.md)); ngân sách thư mục ảnh khung cảnh trước đây là 5 MB.

## Phần 2. Quyết định

- Mỗi khung cảnh có một bộ 1-5 ảnh, đánh số `{scene}-{n}-{960|1920}.webp`; `src/lib/scenes.ts` lưu số ảnh (`photos`). Chỉ dùng ảnh nguồn rộng từ 1920 px.
- Nền ở hero (một vùng mỗi trang: `PageHero`, `LandingHero`, `PokemonHero`) bắt đầu từ một ảnh ngẫu nhiên, sau mỗi 12 giây chuyển mờ 1,2 giây sang ảnh kế tiếp (ảnh được tải trước khi chuyển), mỗi ảnh phóng chậm 2-10% trong 24 giây.
- Thêm lớp hạt CSS theo môi trường (tuyết, tàn lửa, đom đóm, cánh hoa, tia sáng, cát bay, bụi sáng): 18 hạt trên desktop, 9 trên mobile; chỉ dùng `transform` và `opacity`.
- `prefers-reduced-motion: reduce` thì không chuyển ảnh, không phóng chậm, không có lớp hạt; chỉ hiện một ảnh tĩnh ngẫu nhiên.
- Các nền nhỏ (thẻ Bốn vùng đất, Pokémon hôm nay, `VersusBanner`) chỉ chọn ngẫu nhiên một ảnh, không chuyển động.
- Quy tắc nội dung ảnh nới ra: cho phép nhân vật hoặc Pokémon nhỏ nằm ngoài dải giữa khung (khoảng 30-70% chiều ngang, nơi artwork đứng). Ảnh gốc có HUD, người hoặc Pokémon thừa được xóa bằng công cụ, kể cả công cụ dùng AI, rồi bắt buộc qua bước kiểm duyệt dấu vết AI (watermark nhìn thấy, metadata C2PA và IPTC qua `scripts/check-image-provenance.mjs`); có dấu vết thì loại ảnh đã sửa, giữ ảnh đang dùng. Watermark ẩn như SynthID (có trong mọi ảnh do Gemini API sinh ra, kể cả qua plugin `nano-banana`) được chấp nhận nếu ghi rõ trong `SOURCES.md`. Vẫn cấm ảnh tạo hoàn toàn bằng AI, ảnh anime, fan art (quyết định của chủ dự án ngày 2026-10-28).
- Ngân sách thư mục ảnh khung cảnh tăng từ 5 MB lên 25 MB.

## Phần 3. Các phương án đã cân nhắc

| Phương án | Ưu điểm | Nhược điểm |
|---|---|---|
| Chuyển ảnh, phóng chậm và lớp hạt CSS (chọn) | Không thêm thư viện; chạy offline; mỗi bộ ảnh vài trăm KB; tắt được hoàn toàn theo `prefers-reduced-motion` | Phải sửa quy tắc chuyển động; cần nhiều ảnh nguồn đạt chuẩn |
| Ảnh tĩnh, đổi ngẫu nhiên mỗi lần vào trang | Đơn giản, giữ nguyên quy tắc chuyển động | Không đáp ứng yêu cầu nền có chuyển động |
| Video nền | Chuyển động thật | Không có nguồn video phong cảnh hợp lệ (tải trailer từ YouTube vi phạm điều khoản); 2-5 MB mỗi clip; tốn pin và CPU trên điện thoại |
| Cấm mọi chỉnh sửa bằng AI | Ảnh chắc chắn là ảnh chụp gốc | Rất ít ảnh 1920 px đạt chuẩn vì phần lớn có nhân vật ở giữa hoặc HUD; không đủ 4-5 ảnh mỗi scene |
| Cho phép xóa HUD, người thừa bằng công cụ, có kiểm duyệt dấu vết AI (chọn) | Dùng được thêm nhiều ảnh 1920 px; ghi rõ xử lý trong `SOURCES.md` | Watermark ẩn (SynthID) không phát hiện được nên chấp nhận và ghi nhãn thay vì kiểm tra; ảnh sửa bằng công cụ tự gắn Content Credentials sẽ bị loại; dùng Gemini API thì ảnh chụp game được gửi lên máy chủ Google và có tính phí |

## Phần 4. Hệ quả

- `design-system.md` Phần 2, mục VII và Phần 4 cập nhật quy tắc chuyển động, nguồn ảnh, kích thước; `assets.md` Phần 2-3 cập nhật tên file và ngân sách 25 MB.
- `SceneBackdrop` nhận prop `animated`; thêm `SceneAmbience` và hook `useReducedMotion` trong `components/scene/`.
- Thêm `scripts/check-image-provenance.mjs` (Node, không thư viện ngoài) cho bước kiểm duyệt metadata.
- Repo tăng tối đa khoảng 20 MB do ảnh. Nếu vượt 25 MB thì giảm chất lượng WebP trước, sau đó mới bớt ảnh.
- Nếu phát hiện hiệu năng kém trên điện thoại (khung hình rơi dưới 50 fps khi đo bằng DevTools), tắt lớp hạt dưới breakpoint `md` trước khi bỏ chuyển ảnh.
