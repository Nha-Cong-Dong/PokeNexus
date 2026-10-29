# PokeNexus - Hướng dẫn cho Claude

- Bách khoa Pokémon kiêm công cụ phân tích đội hình VGC. Monorepo: `backend/` (Spring Boot), `frontend/` (React), `docs/`, `data/`.
- Một người phát triển, 3 tuần (2026-10-18 đến 2026-11-08). Checkpoint 3 (01/11): MVP chạy end-to-end ở local. Checkpoint 4 (08/11): bản hoàn chỉnh chạy trên link thật (không lỗi, đủ tính năng, tính năng mở rộng nếu kịp), demo, tag `v1.0.0`.
- File này chỉ chứa quy tắc riêng của dự án. Tiến độ hiện tại xem [PLAN.md](PLAN.md); không ghi trạng thái vào file này.

---

## Phần 1. Bắt đầu mỗi phiên làm việc

### I. Thứ tự đọc

| Bước | File | Mục đích |
|---|---|---|
| 1 | [PLAN.md](PLAN.md) | Tuần hiện tại, task đang làm, blocker |
| 2 | [docs/README.md](docs/README.md) | Mục lục tài liệu; muốn làm việc X thì đọc và sửa ở đâu (Phần 2) |
| 3 | [docs/spec.md](docs/spec.md), Phần 6 | Task đang làm thuộc tính năng nào, endpoint, trang, test liên quan |
| 4 | Tài liệu trong `docs/` mà `docs/README.md` chỉ tới | Chi tiết để thực hiện |

- Làm việc trong `backend/` hoặc `frontend/` thì đọc thêm `backend/CLAUDE.md` hoặc `frontend/CLAUDE.md`.

### II. Nguồn chuẩn (source of truth)

| Nội dung | Nguồn chuẩn duy nhất |
|---|---|
| Yêu cầu, tiêu chí chấp nhận | `docs/spec.md` |
| Task, ngày, MoSCoW, tiêu chí từng tuần | `docs/roadmap.md` |
| Kiến trúc, thuật toán Synergy, cấu hình | `docs/architecture.md` |
| Endpoint, DTO, mã lỗi | `docs/api.md` |
| Schema, migration, ingestion | `docs/database.md` |
| Tên package, class, thư mục | `docs/folder-structure.md` |
| Token màu, component, pattern UI | `docs/design-system.md` |
| Quyết định kiến trúc | `docs/adr/` |

- `PLAN.md` ở gốc chỉ theo dõi tiến độ và trỏ link. Khi lệch với `docs/`, `docs/` đúng; sửa `PLAN.md` cho khớp.
- Không đoán tên class, endpoint, cột DB. Tên chưa có trong tài liệu thì hỏi hoặc đề xuất cập nhật tài liệu trước.

---

## Phần 2. Công nghệ và lệnh

### I. Phiên bản

| Thành phần | Phiên bản |
|---|---|
| Backend | Java 25, Spring Boot 4.1.x (Spring Framework 7, Jakarta EE 11), Maven Wrapper |
| Database | MySQL 8.4 (Docker), Flyway |
| Frontend | Node.js 24 (`.nvmrc`), React + TypeScript + Vite, Tailwind CSS 4, TanStack Query 5, React Router, Recharts 3 |
| Test | JUnit 5, AssertJ, Mockito, Testcontainers; Vitest, React Testing Library |

- Spring Boot 4 khác Boot 3 ở nhiều điểm. Không làm theo hướng dẫn viết cho Boot 3; đối chiếu tài liệu chính thức bản 4.1 ([ADR 0004](docs/adr/0004-java-25-spring-boot-4.md)).

### II. Lệnh

```bash
docker compose up -d mysql
docker compose ps

cd backend && ./mvnw -B verify
cd frontend && npm run lint && npm run test && npm run build
```

- Lệnh chi tiết từng phần: `backend/CLAUDE.md`, `frontend/CLAUDE.md`.

---

## Phần 3. Ranh giới bắt buộc

### I. Không được vi phạm

| Quy tắc | Lý do, nguồn |
|---|---|
| Không gọi REST API PokéAPI lúc chạy; dữ liệu chỉ đến từ MySQL | [ADR 0002](docs/adr/0002-offline-data-from-csv.md) |
| Không sửa migration Flyway đã merge vào `main`; thay đổi schema tạo file `V<n+1>__...sql` mới | `docs/database.md`, Phần 5 |
| Backend không lưu, không trả URL ảnh; frontend sinh URL từ ID qua `src/lib/assets.ts` | [ADR 0005](docs/adr/0005-hybrid-image-assets.md) |
| Synergy tính trong bộ nhớ, không truy vấn DB khi phân tích | [ADR 0003](docs/adr/0003-in-memory-synergy.md) |
| Không commit `.env`, CSV trong `data/csv/`, file dump, bí mật | `CONTRIBUTING.md`, Phần 4 |
| Thêm dependency ngoài bảng ở `docs/architecture.md`, Phần 2 phải hỏi trước và ghi lý do trong PR | `docs/architecture.md`, Phần 2 |
| Từ 2026-11-05 chỉ làm `fix`, `docs`, `chore`; không thêm tính năng | `docs/roadmap.md`, Phần 4 |

### II. Phạm vi

- Tính năng ngoài MVP (đăng nhập, chiêu thức, Ability, tính sát thương...) không làm. Ý tưởng mới ghi vào Issue nhãn `priority: future`.
- Thứ tự cắt giảm khi trễ: `docs/roadmap.md`, Phần 4, mục II.

---

## Phần 4. Quy trình làm một task

### I. Các bước

- Đọc dòng task trong `docs/roadmap.md` (cột Đầu vào, Đầu ra, Kiểm tra) và dòng tính năng tương ứng trong `docs/spec.md`, Phần 6.
- Trình bày kế hoạch: Goal, tiêu chí hoàn thành, file sẽ tạo hoặc sửa, test sẽ viết. Chờ xác nhận nếu ảnh hưởng nhiều file.
- Làm theo layer (Entity, Repository, Service, Controller, rồi UI). Sau mỗi layer chạy build hoặc test và báo kết quả thật.
- Đổi API, schema, cấu trúc thư mục thì sửa `docs/api.md`, `docs/database.md`, `docs/folder-structure.md` trong cùng thay đổi.
- Cập nhật `PLAN.md` (trạng thái task, nhật ký). Đề xuất tiêu đề PR theo Phần 5.
- Slash command hỗ trợ: `/task <mã task>`, `/adr <tiêu đề>`, `/done` (trong `.claude/commands/`).

### II. Definition of Done

- Theo `CONTRIBUTING.md`, Phần 4, cộng với cột "Kiểm tra" của task trong roadmap.

---

## Phần 5. Git

### I. Quy ước

- GitHub Flow: chỉ `main` lâu dài, mọi thay đổi qua PR, Squash and merge. Chi tiết: `docs/git-workflow.md`.
- Nhánh: `<feature|fix|docs|chore|refactor|test>/<số Issue>-<mo-ta>`, chữ thường, không dấu.
- Tiêu đề PR và commit: `<type>(<scope>): <mô tả tiếng Anh, thể mệnh lệnh>`.
- Scope hợp lệ: `pokedex`, `typechart`, `compare`, `synergy`, `team`, `ingestion`, `ui`, `db`, `api`, `assets`, `deps`, `docs`.
- Chỉ commit, push, tạo PR khi người dùng yêu cầu. Không force push `main`; nhánh riêng dùng `--force-with-lease`.

---

## Phần 6. Trình bày tài liệu

### I. Định dạng thống nhất với `docs/`

- Tiêu đề file: `# PokeNexus - <Tên tài liệu>`, ngay dưới là dòng phiên bản và ngày cập nhật.
- Đề mục: `## Phần 1. ...`, `### I. ...`, `#### 1. ...`, mức 4 dùng chữ in đậm.
- Các phần ngăn cách bằng `---`. So sánh từ 3 tiêu chí trở lên dùng bảng. Không dùng emoji.
- Link nội bộ dùng đường dẫn tương đối; sau khi sửa tài liệu, kiểm tra không có link gãy.
