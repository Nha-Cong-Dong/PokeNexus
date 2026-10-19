# ADR 0005 - Chiến lược ảnh Pokémon dạng Hybrid

- Trạng thái: Đã chấp nhận
- Ngày: 2026-10-19

## Phần 1. Bối cảnh

- Ứng dụng hiển thị ảnh của khoảng 1.300 Pokémon: ảnh nhỏ trong lưới, tìm kiếm, đội hình; ảnh lớn ở trang chi tiết và Bàn Cân.
- Đo thực tế ngày 2026-10-19: sprite 96 x 96 nặng 0,5-1,7 KB mỗi file (tổng ước tính 1,5-3 MB); official artwork nặng 120-145 KB mỗi file (tổng ước tính 170 MB).
- Buổi demo không được phụ thuộc kết nối Internet ([ADR 0002](0002-offline-data-from-csv.md)).
- Repo `PokeAPI/sprites` dùng giấy phép CC0, nhưng nội dung hình ảnh thuộc bản quyền The Pokémon Company.

## Phần 2. Quyết định

- Tự host sprite 96 x 96 trong `frontend/public/sprites/pokemon/{id}.png`, tải bằng script và commit vào repo.
- Artwork lấy trực tiếp từ đường dẫn công khai của `PokeAPI/sprites` lúc hiển thị; lỗi tải thì fallback về sprite, rồi về ảnh dự phòng.
- URL ảnh do frontend sinh từ ID Pokémon (`src/lib/assets.ts`). Backend không lưu, không trả URL ảnh; bỏ cột `pokemon.sprite_url`.

## Phần 3. Các phương án đã cân nhắc

| Phương án | Ưu điểm | Nhược điểm |
|---|---|---|
| Hybrid (chọn) | Lưới, đội hình vẫn có ảnh khi offline; repo chỉ tăng vài MB; trang chi tiết vẫn có ảnh đẹp khi có mạng | Hai nguồn ảnh; cần logic fallback |
| Hotlink toàn bộ | Đơn giản nhất, repo không tăng dung lượng | Mất mạng khi demo thì toàn bộ ảnh vỡ; phụ thuộc hoàn toàn bên thứ ba |
| Tự host toàn bộ | Chạy offline hoàn toàn | Khoảng 170 MB artwork làm nặng repo và bản deploy, clone chậm |

## Phần 4. Hệ quả

- Thêm task T207 (script tải sprite) vào Tuần 2; thêm `scripts/download-sprites.sh` và `.ps1`.
- Ở chế độ offline, trang chi tiết hiển thị sprite phóng to (dùng `image-rendering: pixelated`) thay cho artwork.
- Bỏ `spriteUrl` khỏi response API; đổi nguồn ảnh chỉ cần sửa `src/lib/assets.ts`, không đổi schema hay API.
- Nếu thư mục sprite vượt 15 MB, chuyển sang tải sprite bằng script lúc build và ghi ADR mới thay thế ADR này.
