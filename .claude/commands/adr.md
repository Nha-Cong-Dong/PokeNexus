---
description: Tạo ADR mới trong docs/adr theo mẫu của dự án
argument-hint: "<tiêu đề quyết định>"
disable-model-invocation: true
---

Tạo một Architecture Decision Record cho quyết định: $ARGUMENTS

1. Liệt kê `docs/adr/`, lấy số lớn nhất rồi cộng 1, định dạng 4 chữ số.
2. Đọc 1-2 ADR gần nhất để giữ đúng cấu trúc. Tên file: `NNNN-ten-quyet-dinh.md`, chữ thường, gạch nối, không dấu.
3. Nội dung gồm:
   - Tiêu đề `# ADR NNNN - <Tên quyết định>`, dòng `Trạng thái` (Đề xuất hoặc Đã chấp nhận) và `Ngày` (YYYY-MM-DD).
   - `## Phần 1. Bối cảnh`: vấn đề, ràng buộc, số liệu đo được nếu có.
   - `## Phần 2. Quyết định`.
   - `## Phần 3. Các phương án đã cân nhắc`: bảng Phương án, Ưu điểm, Nhược điểm; ít nhất 2 phương án.
   - `## Phần 4. Hệ quả`: thay đổi lên code, tài liệu, roadmap; cách rollback nếu là thay thế công nghệ.
4. Thiếu thông tin về bối cảnh hoặc phương án thì hỏi người dùng, không tự bịa số liệu.
5. Nếu ADR thay thế ADR cũ, đổi trạng thái ADR cũ thành "Đã thay thế bởi ADR NNNN", không xóa ADR cũ.
6. Cập nhật link ở các tài liệu bị ảnh hưởng và thêm một dòng vào `CHANGELOG.md`, mục `[Unreleased]`.
