# Hướng dẫn đóng góp

Tài liệu mô tả quy trình làm việc của dự án PokeNexus: nhánh, commit, Pull Request và tiêu chí hoàn thành.

---

## Phần 1. Chuẩn bị môi trường

### I. Công cụ

- JDK 25, Node.js 24 LTS, Docker, Git. Chi tiết phiên bản ở [README.md](README.md), Phần 5.
- IDE gợi ý: IntelliJ IDEA cho backend, VS Code cho frontend. Bật hỗ trợ EditorConfig để định dạng thống nhất.

### II. Thiết lập lần đầu

```bash
cp .env.example .env
docker compose up -d mysql
```

---

## Phần 2. Quy trình làm việc

### I. Từ Issue đến Pull Request

#### 1. Các bước

- Mỗi việc bắt đầu bằng một Issue (dùng mẫu Feature hoặc Bug), gắn nhãn và milestone.
- Tạo nhánh từ `main` theo quy ước đặt tên ở mục II.
- Commit nhỏ, thường xuyên, theo quy ước ở mục III.
- Mở Pull Request vào `main`, điền đủ mẫu PR, liên kết Issue bằng `Closes #<số>`.
- CI phải xanh trước khi merge. Dùng **Squash and merge** để lịch sử `main` gọn.

### II. Quy ước đặt tên nhánh

| Tiền tố | Dùng cho | Ví dụ |
|---|---|---|
| `feature/` | Tính năng mới | `feature/12-omni-dex-filter` |
| `fix/` | Sửa lỗi | `fix/27-dual-type-multiplier` |
| `docs/` | Chỉ thay đổi tài liệu | `docs/update-api-spec` |
| `chore/` | Cấu hình, công cụ, phụ thuộc | `chore/setup-ci` |
| `refactor/` | Tái cấu trúc, không đổi hành vi | `refactor/synergy-service` |

- Nên đặt số Issue ngay sau tiền tố để dễ truy vết.

### III. Quy ước commit (Conventional Commits)

#### 1. Cú pháp

```text
<type>(<scope>): <mô tả ngắn, thể mệnh lệnh>
```

#### 2. Các type được dùng

| Type | Ý nghĩa |
|---|---|
| `feat` | Thêm tính năng |
| `fix` | Sửa lỗi |
| `docs` | Tài liệu |
| `test` | Thêm hoặc sửa test |
| `refactor` | Tái cấu trúc mã |
| `chore` | Cấu hình, build, phụ thuộc |
| `ci` | Thay đổi CI |

#### 3. Ví dụ

```text
feat(pokedex): add multi-condition filter with pagination
fix(synergy): handle immunity when computing defense score
docs(api): describe synergy recommendation endpoint
test(synergy): cover team weak to rock
chore(deps): bump spring boot to 4.1.2
```

- Scope gợi ý: `pokedex`, `typechart`, `compare`, `synergy`, `team`, `ingestion`, `ui`, `db`, `api`, `deps`.

### IV. Phiên bản và tag

- Gắn tag theo mốc: `v0.1.0` (khung dự án), `v0.2.0` (MVP), `v1.0.0` (bản demo).
- Mỗi tag đi kèm một mục trong [CHANGELOG.md](CHANGELOG.md).

---

## Phần 3. Tiêu chuẩn mã nguồn

### I. Backend (Java)

- Đặt tên: `PascalCase` cho class và interface, `camelCase` cho method và biến, `UPPER_SNAKE_CASE` cho hằng số, package chữ thường.
- Cấu trúc theo tính năng (package by feature); luồng Controller -> Service -> Repository; Controller không gọi Repository.
- DTO dùng Java `record`; không trả Entity ra khỏi tầng Service.
- Lỗi trả về theo chuẩn `ProblemDetail` (RFC 9457) qua một `@RestControllerAdvice` chung.
- Không sửa migration Flyway đã chạy; mọi thay đổi schema tạo file migration mới.

### II. Frontend (TypeScript)

- Component dùng `PascalCase`, hook bắt đầu bằng `use`, file tiện ích dùng `camelCase`.
- Gọi API qua TanStack Query; không gọi `fetch` trực tiếp trong component.
- Màu của các hệ Pokémon chỉ lấy từ một nguồn duy nhất trong mã nguồn.

---

## Phần 4. Tiêu chí hoàn thành (Definition of Done)

### I. Danh sách kiểm tra

- Chạy đúng luồng chính và có xử lý trạng thái đang tải, rỗng, lỗi.
- Có validation đầu vào ở backend và thông báo lỗi dễ hiểu ở frontend.
- Logic nghiệp vụ và thuật toán có unit test; CI xanh.
- Hiển thị ổn ở chiều rộng 375 px và 1440 px.
- Tài liệu liên quan (`docs/api.md`, `docs/database.md`...) đã được cập nhật.
- Không commit bí mật (mật khẩu, khóa) hay file `.env`.
