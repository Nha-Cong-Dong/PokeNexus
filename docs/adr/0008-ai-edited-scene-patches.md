# ADR 0008 - Nhận vùng vá do AI vẽ có Content Credentials trong ảnh khung cảnh

- Trạng thái: Đã chấp nhận
- Ngày: 2026-10-30
- Sửa đổi một phần [ADR 0006](0006-animated-scene-backdrops.md): quy tắc "có dấu vết AI trong metadata thì loại ảnh đã sửa".

## Phần 1. Bối cảnh

- ADR 0006 cho phép xóa HUD, người, Pokémon thừa bằng công cụ AI, nhưng loại mọi file đã sửa có C2PA hoặc nhãn IPTC `trainedAlgorithmicMedia`; chỉ chấp nhận watermark ẩn (SynthID của Gemini API).
- Ngày 2026-10-29 có 13 ảnh chụp game 1920 x 1080 cần xóa nhân vật, bóng, minimap hoặc chữ (8 ảnh cho các scene chỉ có 1 ảnh, 5 ảnh Sword/Shield và Scarlet/Violet). Gemini API không dùng được (plugin `nano-banana-mcp` lỗi 404, key Free Tier lỗi 429, ngày 2026-10-28).
- Chủ dự án sửa 13 ảnh bằng ChatGPT. Đo ngày 2026-10-30:
  - `scripts/check-image-provenance.mjs`: 13/13 `LOẠI` (manifest C2PA ký bởi "OpenAI Media Service API", `softwareAgent` ChatGPT `gpt-image`, `digitalSourceType` `trainedAlgorithmicMedia`).
  - Ảnh xuất ra 1672 x 941. ChatGPT vẽ lại cả khung: ngoài vùng cần xóa, màu lệch trung bình 3-25 mức (0-255) so với ảnh gốc.
- Trước quyết định này còn 2 ảnh 1280 px phóng to (`volcano`, `swamp`) và 7 scene chỉ có 1 ảnh; đóng băng tính năng từ 2026-11-05.

## Phần 2. Quyết định

- Nhận ảnh sửa bằng công cụ AI có gắn Content Credentials (C2PA, IPTC `trainedAlgorithmicMedia` hoặc `compositeWithTrainedAlgorithmicMedia`) với các điều kiện:
  - Chỉ lấy vùng đã xóa. Vùng này được ghép vào ảnh chụp gốc rộng từ 1920 px; phần còn lại giữ nguyên điểm ảnh gốc (đo: thay đổi ngoài vùng ghép bằng 0).
  - Vùng ghép được chỉnh màu cho khớp ảnh gốc ở mép (nội suy hiệu màu từ viền, không dùng AI) và soát ở 100% theo cột "Dấu vết vẽ lại" của [design-system.md](../design-system.md), Phần 4, mục I.2.
  - Cột "Xử lý riêng" trong `frontend/public/scenes/SOURCES.md` ghi: công cụ, vật đã xóa, tỷ lệ diện tích vẽ lại, và việc file trung gian có Content Credentials.
  - File gốc và file do công cụ xuất ra (còn nguyên metadata) được giữ ở thư mục làm việc ngoài repo để đối chiếu.
- Vẫn loại: dùng nguyên file do AI xuất ra (cả khung là ảnh AI vẽ lại); ảnh tạo hoàn toàn bằng AI, ảnh anime, fan art; ảnh có watermark nhìn thấy.
- `scripts/check-image-provenance.mjs` giữ nguyên và vẫn chạy trên file đã sửa trước khi ghép. Với file đã sửa, kết quả `LOẠI` không còn tự động loại ảnh mà chuyển sang quy trình ghép ở trên. Ảnh nguồn (chưa sửa) có kết quả `LOẠI` thì vẫn loại, vì không phải ảnh chụp game.
- Quyết định của chủ dự án ngày 2026-10-30.

## Phần 3. Các phương án đã cân nhắc

| Phương án | Ưu điểm | Nhược điểm |
|---|---|---|
| Giữ ADR 0006, loại 13 ảnh | Quy tắc chặt, file trong repo không có vùng AI vẽ không được nhận biết | Giữ 2 ảnh 1280 px phóng to; 7 scene vẫn 1 ảnh; phải sửa lại bằng công cụ khác trước 2026-11-05 |
| Giữ ADR 0006, sửa lại qua Gemini API (`nano-banana`) | Đúng quy tắc cũ (chỉ có SynthID) | Có phí, gửi ảnh lên máy chủ Google; lần thử 2026-10-28 lỗi 404 và 429; Gemini cũng là ảnh AI vẽ lại, chỉ khác loại nhãn |
| Nhận vùng vá có C2PA, chỉ ghép vùng đã xóa, ghi nhãn trong `SOURCES.md` (chọn) | Dùng được ngay 13 ảnh; hết ảnh 1280 px; mỗi scene có 2-4 ảnh; phần lớn mỗi ảnh vẫn là điểm ảnh gốc | File WebP cuối không mang C2PA (bước chuyển WebP làm mất metadata), nhãn AI chỉ còn trong `SOURCES.md`; vùng ghép phóng từ 1672 lên 1920 px (x1,15) nên mềm hơn xung quanh |
| Dùng nguyên file ChatGPT | Không cần ghép | Cả khung là ảnh AI vẽ lại, lệch màu; ảnh 1672 px phải phóng to, trái quy tắc 1920 px |

## Phần 4. Hệ quả

- `design-system.md` Phần 4, mục I.1 và I.2 cập nhật quy tắc; ADR 0006 ghi chú bị sửa đổi một phần.
- `SOURCES.md` thêm 13 ảnh, ghi rõ vùng vẽ lại bằng ChatGPT; tổng 36 ảnh, 72 file, 8,2 MB (ngân sách 25 MB của ADR 0006 không đổi).
- `src/lib/scenes.ts` tăng `photos` của 8 scene. Không đổi code component.
- Rollback: khôi phục các file `{scene}-{n}-{960,1920}.webp` và `{scene}-thumb.webp` từ commit trước, trả `photos` về số cũ, đổi trạng thái ADR này thành "Đã thay thế".
