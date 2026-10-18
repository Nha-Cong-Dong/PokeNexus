# ADR 0002 - Nạp dữ liệu từ CSV của PokéAPI thay vì gọi API lúc chạy

- Trạng thái: Đã chấp nhận
- Ngày: 2026-10-18

## Phần 1. Bối cảnh

- Dữ liệu Pokémon (hệ, chỉ số, tiến hóa) gần như không đổi.
- Gọi REST API của PokéAPI cho khoảng 1.300 Pokémon tốn hàng nghìn request; chính sách sử dụng hợp lý của PokéAPI khuyến khích lưu đệm dữ liệu phía người dùng.
- Buổi demo không được phụ thuộc vào kết nối Internet.

## Phần 2. Quyết định

- Dùng bộ CSV công khai trong repo GitHub của PokéAPI (`data/v2/csv`), nạp một lần vào MySQL.
- Ứng dụng chỉ đọc từ MySQL; không gọi PokéAPI lúc chạy.

## Phần 3. Các phương án đã cân nhắc

| Phương án | Ưu điểm | Nhược điểm |
|---|---|---|
| Nạp CSV một lần | Nhanh, không bị giới hạn tần suất, chạy offline | Cần viết chương trình nạp; cập nhật dữ liệu thủ công |
| Gọi REST API lúc chạy | Không cần lưu dữ liệu | Chậm, phụ thuộc mạng, dễ vượt giới hạn tần suất |
| Crawl REST API rồi lưu DB | Dữ liệu dạng JSON quen thuộc | Hàng nghìn request, mất nhiều giờ |

## Phần 4. Hệ quả

- File CSV không commit vào repo (kích thước lớn); hướng dẫn tải ở `data/README.md`.
- Sau khi nạp thành công, xuất `mysqldump` để dựng lại DB nhanh khi cần.
- Hình ảnh (sprite) vẫn lấy từ đường dẫn công khai của PokéAPI; nếu cần chạy offline hoàn toàn thì tải về thư mục tĩnh của frontend.
