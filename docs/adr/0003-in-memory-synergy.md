# ADR 0003 - Tính toán Synergy trong bộ nhớ

- Trạng thái: Đã chấp nhận
- Ngày: 2026-10-18

## Phần 1. Bối cảnh

- Đề xuất Pokémon cho vị trí thứ 6 phải chấm điểm toàn bộ ứng viên (khoảng 1.300) theo 18 hệ.
- Điểm của mỗi ứng viên phụ thuộc vào đội hình hiện tại, nên không thể tính sẵn hay đánh index trong DB.

## Phần 2. Quyết định

- Khi ứng dụng khởi động, nạp bảng tương khắc 18 x 18 và hồ sơ phòng thủ của mọi Pokémon vào bộ nhớ.
- Thuật toán phân tích và đề xuất chạy hoàn toàn trên dữ liệu trong bộ nhớ, không truy vấn DB mỗi request.

## Phần 3. Các phương án đã cân nhắc

| Phương án | Ưu điểm | Nhược điểm |
|---|---|---|
| Tính trong bộ nhớ | Rất nhanh (khoảng 23.400 phép tính mỗi lần đề xuất); dễ viết unit test | Tăng thời gian khởi động một chút; dữ liệu phải được nạp lại khi thay đổi |
| Truy vấn SQL mỗi request | Không cần cache | Câu truy vấn phức tạp, khó đọc, khó test, chậm hơn |

## Phần 4. Hệ quả

- Dữ liệu tĩnh chỉ khoảng vài MB, phù hợp với cả gói hosting nhỏ.
- Cache chỉ đọc; nếu sau này dữ liệu được cập nhật, cần cơ chế nạp lại hoặc khởi động lại ứng dụng.
