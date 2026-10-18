# ADR 0004 - Java 25 và Spring Boot 4.1

- Trạng thái: Đã chấp nhận
- Ngày: 2026-10-18

## Phần 1. Bối cảnh

- Cần chọn phiên bản Java và Spring Boot có thời gian hỗ trợ đủ dài và tương thích với nhau.
- Java 25 là bản LTS mới nhất. Spring Boot 4.0 và 4.1 hỗ trợ Java 25; dòng 3.5 đã hết hỗ trợ mã nguồn mở vào giữa năm 2026.

## Phần 2. Quyết định

- Backend dùng **Java 25** và **Spring Boot 4.1.x** (bản vá mới nhất khi khởi tạo).
- CI và Docker image dùng bản phân phối Eclipse Temurin 25.

## Phần 3. Các phương án đã cân nhắc

| Phương án | Ưu điểm | Nhược điểm |
|---|---|---|
| Java 25 + Spring Boot 4.1 | LTS mới nhất, còn hỗ trợ lâu; dùng được tính năng ngôn ngữ mới | Nhiều bài hướng dẫn trên mạng vẫn viết cho Spring Boot 3 |
| Java 21 + Spring Boot 4.1 | Phổ biến, nhiều tài liệu, công cụ hỗ trợ đầy đủ | Không tận dụng được tính năng Java mới |
| Java 17 + Spring Boot 3.5 | Nhiều tài liệu nhất | Spring Boot 3.5 đã hết hỗ trợ mã nguồn mở |

## Phần 4. Hệ quả

- Spring Boot 4 dựa trên Spring Framework 7 và Jakarta EE 11, có thay đổi so với Boot 3; khi làm theo hướng dẫn trên mạng phải đối chiếu tài liệu chính thức của phiên bản 4.
- Nền tảng hosting phải hỗ trợ chạy Docker image với JDK 25.
- Khi khởi tạo dự án ở Tuần 2, tạo bằng Spring Initializr và chọn đúng Java 25 cùng bản Spring Boot 4.1 mới nhất.
