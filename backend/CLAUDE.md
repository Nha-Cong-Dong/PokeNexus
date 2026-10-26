# PokeNexus Backend - Hướng dẫn cho Claude

- Nạp khi làm việc trong `backend/`. Bổ sung cho `CLAUDE.md` ở gốc, không lặp lại quy tắc chung.
- Dependency và tên artifact thực tế: [README.md](README.md), Phần 1.

---

## Phần 1. Lệnh

### I. Build, test, chạy

| Việc | Git Bash | PowerShell |
|---|---|---|
| Build và toàn bộ test | `./mvnw -B verify` | `.\mvnw.cmd -B verify` |
| Chỉ unit test | `./mvnw test` | `.\mvnw.cmd test` |
| Một class test | `./mvnw test -Dtest=SynergyAnalyzerTest` | `.\mvnw.cmd test "-Dtest=SynergyAnalyzerTest"` |
| Chạy ứng dụng | `./mvnw spring-boot:run` | `.\mvnw.cmd spring-boot:run` |

- Cần MySQL đang chạy (`docker compose up -d mysql` ở thư mục gốc) và biến môi trường theo `.env.example`.
- Test tích hợp (`*IT`) dùng Testcontainers nên cần Docker đang chạy; không có Docker thì `*IT` bị Skipped (`@Testcontainers(disabledWithoutDocker = true)`), khi báo kết quả phải nêu rõ số test bị Skipped.
- Test web dùng `MockMvcTester` (AssertJ) và `@MockitoBean`; `@WebMvcTest` import từ `org.springframework.boot.webmvc.test.autoconfigure`.
- Swagger UI: `http://localhost:8080/swagger-ui.html`.

---

## Phần 2. Spring Boot 4 và Java 25

### I. Lưu ý khi viết code

- Import `jakarta.*`, không dùng `javax.*` (Jakarta EE 11).
- Spring Boot 4 tách nhỏ starter. Tên starter Flyway, module `flyway-mysql`, phiên bản springdoc-openapi phải tra trên Spring Initializr và tài liệu chính thức, không lấy từ bài viết cho Boot 3.
- Không đoán API mới của Boot 4. Không chắc thì tra tài liệu chính thức hoặc báo rõ "chưa xác minh".

---

## Phần 3. Cấu trúc và phụ thuộc

### I. Package theo tính năng

- `com.pokenexus.{common, ingestion, pokedex, typechart, synergy, team}`. Class của từng package: [docs/folder-structure.md](../docs/folder-structure.md), Phần 2, mục II.
- Package khác chỉ được dùng Service hoặc DTO công khai của nhau theo sơ đồ ở [docs/architecture.md](../docs/architecture.md), Phần 3, mục II. Không dùng Repository hay Entity của package khác.
- `common` không phụ thuộc package tính năng nào.

### II. Phân tầng

- Luồng một chiều Controller -> Service -> Repository. Controller không gọi Repository.
- DTO là Java `record`. Entity không ra khỏi tầng Service; mapping qua class `*Mapper`.
- `@Transactional(readOnly = true)` cho truy vấn, `@Transactional` cho ghi, đặt ở Service.
- Cấu hình `app.*` đọc qua record `AppProperties` (`@ConfigurationProperties`), không dùng `@Value` rải rác.
- `spring.jpa.hibernate.ddl-auto=validate`, `spring.jpa.open-in-view=false`.
- Cột số `UNSIGNED` ánh xạ sang `Integer` hoặc `Long` kèm `@Column(columnDefinition = "tinyint unsigned")` (hoặc `smallint unsigned`, `int unsigned`) để `validate` khớp kiểu. Không dùng `Byte`, `Short` hay `@JdbcTypeCode(TINYINT)`: giá trị 255 hoặc trên 32767 bị tràn.
- Vi phạm `CHECK` của MySQL (mã 3819) được Spring dịch thành `UncategorizedSQLException`, không phải `DataIntegrityViolationException`.

---

## Phần 4. Quy tắc theo chủ đề

### I. API và lỗi

- Endpoint, DTO, tham số phải khớp [docs/api.md](../docs/api.md). Đổi API thì sửa `docs/api.md` trong cùng thay đổi.
- Validate DTO bằng Bean Validation; ràng buộc nghiệp vụ (ID trùng, ID không tồn tại) kiểm tra ở Service.
- Mọi lỗi đi qua `GlobalExceptionHandler`, trả `ProblemDetail` có thuộc tính `code` theo [docs/api.md](../docs/api.md), Phần 4. Lỗi 500 không lộ stack trace.
- Tham số `sort` chỉ nhận whitelist; truy vấn động dùng Specification, không nối chuỗi SQL.

### II. Database và migration

- Migration ở `src/main/resources/db/migration`, tên `V<số>__<mo_ta_snake_case>.sql`.
- Không sửa migration đã merge vào `main`. Trước khi merge, kiểm tra số migration lớn nhất trên `main` để tránh trùng.
- Schema phải khớp [docs/database.md](../docs/database.md); đổi schema thì sửa tài liệu cùng lúc.

### III. Ingestion

- Chỉ chạy khi `app.ingestion.enabled=true` và bảng `pokemon` rỗng; toàn bộ trong một transaction, lỗi thì rollback và dừng với log nêu rõ file và dòng.
- Thứ tự bước, lọc hệ 1-18, quy tắc `form_category`: [docs/database.md](../docs/database.md), Phần 1 mục IV và Phần 5.
- Đọc CSV bằng Apache Commons CSV; ghi bằng JDBC batch.

### IV. Synergy

- Thuật toán, trọng số 60/25/15, quy tắc hòa điểm: [docs/architecture.md](../docs/architecture.md), Phần 5. Trọng số là hằng số `UPPER_SNAKE_CASE`.
- Phân tích và đề xuất chỉ dùng dữ liệu trong bộ nhớ (`PokemonProfileRegistry`, `TypeChartService`), không truy vấn DB.
- Kết quả phải xác định (deterministic) để test ổn định.

---

## Phần 5. Kiểm thử và logging

### I. Kiểm thử

- Unit test: `<Class>Test`. Tích hợp: `<Class>IT` với `@SpringBootTest` và Testcontainers MySQL.
- CSV mẫu khoảng 20 Pokémon ở `src/test/resources/csv/`; CI không dùng bộ CSV đầy đủ.
- 4 ví dụ có đáp án ở [docs/spec.md](../docs/spec.md), Phần 2, mục V.4 là test bắt buộc. Danh sách test: [docs/spec.md](../docs/spec.md), Phần 6, mục II.
- Mỗi logic mới có ít nhất 1 case thường và 1 case biên (rỗng, trùng, vượt giới hạn, ID không tồn tại).

### II. Logging

- Dùng SLF4J; không dùng `System.out.println`.
- Không ghi địa chỉ IP vào log lâu dài.
