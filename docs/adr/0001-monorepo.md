# ADR 0001 - Dùng một repo duy nhất (monorepo)

- Trạng thái: Đã chấp nhận
- Ngày: 2026-10-18

## Phần 1. Bối cảnh

- Dự án có backend (Spring Boot), frontend (React) và tài liệu, do một người phát triển trong 4 tuần.
- Thay đổi một tính năng thường chạm cả API lẫn giao diện.

## Phần 2. Quyết định

- Đặt `backend/`, `frontend/`, `docs/`, `data/` trong cùng một repo, dùng chung một CI.

## Phần 3. Các phương án đã cân nhắc

| Phương án | Ưu điểm | Nhược điểm |
|---|---|---|
| Monorepo | Một Pull Request cho cả API và giao diện; một nơi chứa tài liệu; dễ chấm bài | CI phải tách job cho từng phần |
| Hai repo riêng | Tách biệt rõ ràng, triển khai độc lập | Đồng bộ phiên bản API khó; tài liệu phân tán |

## Phần 4. Hệ quả

- CI có job riêng cho backend và frontend, mỗi job tự bỏ qua khi phần tương ứng chưa có mã nguồn.
- Dependabot cấu hình theo từng thư mục.
