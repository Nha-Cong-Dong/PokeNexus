# PokeNexus Backend

- Trạng thái: **đã khởi tạo khung (T202, 2026-10-21).** Có `GET /api/v1/health`, `GlobalExceptionHandler` trả `ProblemDetail`, CORS, Swagger UI. Chưa có migration và dữ liệu (T204, T205).

---

## Phần 1. Công nghệ

### I. Thông số khởi tạo (Spring Initializr)

| Mục | Giá trị |
|---|---|
| Project | Maven (wrapper 3.3.4, Maven 3.10.0, `distributionType=only-script`) |
| Language | Java |
| Spring Boot | 4.1.1 |
| Group | `com.pokenexus` |
| Artifact | `pokenexus-backend` |
| Package name | `com.pokenexus` |
| Packaging | Jar |
| Java | 25 |

### II. Dependency

| Dependency (Initializr) | Artifact thực tế ở Boot 4.1 | Mục đích |
|---|---|---|
| Spring Web | `spring-boot-starter-webmvc` | REST API |
| Spring Data JPA | `spring-boot-starter-data-jpa` | Truy cập dữ liệu |
| MySQL Driver | `mysql-connector-j` | Kết nối MySQL |
| Flyway Migration | `spring-boot-starter-flyway`, `flyway-mysql` | Quản lý schema |
| Validation | `spring-boot-starter-validation` | Kiểm tra đầu vào |
| Lombok | `lombok` | Giảm mã lặp |
| Spring Boot DevTools | `spring-boot-devtools` | Tự khởi động lại khi phát triển |
| Testcontainers | `spring-boot-testcontainers`, `testcontainers-mysql`, `testcontainers-junit-jupiter` | MySQL tạm cho test tích hợp |
| (thêm thủ công) | `springdoc-openapi-starter-webmvc-ui` 3.1.1 | Swagger UI; bản 3.x build trên Spring Boot 4.1 |
| (thêm thủ công, T205) | `commons-csv` 1.14.1 | Đọc CSV PokéAPI theo tên cột |

- Boot 4 tách starter test theo module (`spring-boot-starter-webmvc-test`, `...-data-jpa-test`...). `@WebMvcTest`, `@AutoConfigureMockMvc` nằm ở package `org.springframework.boot.webmvc.test.autoconfigure`.

---

## Phần 2. Lệnh

### I. Chạy và kiểm thử

| Việc | Git Bash | PowerShell |
|---|---|---|
| Build và toàn bộ test | `./mvnw -B verify` | `.\mvnw.cmd -B verify` |
| Chạy với MySQL trong Docker Compose | `./mvnw spring-boot:run` | `.\mvnw.cmd spring-boot:run` |
| Chạy với MySQL do Testcontainers dựng | `./mvnw spring-boot:test-run` | `.\mvnw.cmd spring-boot:test-run` |

- `verify` chạy unit test (`*Test`, Surefire) rồi test tích hợp (`*IT`, Failsafe). Không có Docker thì `*IT` được đánh dấu Skipped, không báo lỗi; CI luôn có Docker nên chạy đủ.
- Cấu hình đọc từ biến môi trường; khi chạy trong `backend/`, file `../.env` được nạp tự động (`spring.config.import`). Profile mặc định là `dev`.
- Swagger UI: `http://localhost:8080/swagger-ui.html`; OpenAPI JSON: `/v3/api-docs`.

---

## Phần 3. Cấu trúc

### I. Package

- Xem [docs/folder-structure.md](../docs/folder-structure.md), Phần 2. Hiện có `common/{config, domain, exception, web}`.
