# PokéNexus Backend

- Trạng thái: **chưa khởi tạo mã nguồn.** Dự án Spring Boot được tạo ở Tuần 2 ([docs/roadmap.md](../docs/roadmap.md)).

---

## Phần 1. Công nghệ

### I. Thông số khởi tạo (Spring Initializr)

| Mục | Giá trị |
|---|---|
| Project | Maven |
| Language | Java |
| Spring Boot | 4.1.x (bản ổn định mới nhất) |
| Group | `com.pokenexus` |
| Artifact | `pokenexus-backend` |
| Package name | `com.pokenexus` |
| Packaging | Jar |
| Java | 25 |

### II. Dependency

| Dependency | Mục đích |
|---|---|
| Spring Web | REST API |
| Spring Data JPA | Truy cập dữ liệu |
| MySQL Driver | Kết nối MySQL |
| Flyway Migration | Quản lý schema |
| Validation | Kiểm tra đầu vào |
| Lombok | Giảm mã lặp |
| Spring Boot DevTools | Tự khởi động lại khi phát triển |
| springdoc-openapi (thêm thủ công) | Swagger UI |

- Tên dependency trên Spring Initializr có thể thay đổi theo phiên bản; chọn theo đúng mục đích ở cột bên phải.

---

## Phần 2. Lệnh dự kiến

### I. Chạy và kiểm thử

```bash
./mvnw spring-boot:run
./mvnw test
./mvnw -B verify
```

- Trên Windows dùng `mvnw.cmd` thay cho `./mvnw`.
- Backend đọc cấu hình kết nối DB từ biến môi trường (xem `.env.example` ở thư mục gốc).

---

## Phần 3. Cấu trúc dự kiến

### I. Package

- Xem [docs/architecture.md](../docs/architecture.md), Phần 3, mục I.
