# PokeNexus - Bản đồ dự án

- Phiên bản: 0.1 (cập nhật 2026-10-20)
- Mục đích: trả lời nhanh "muốn làm việc X thì đọc file nào, sửa ở đâu". Không chép nội dung chi tiết; chi tiết nằm ở file được trỏ tới.
- Cây thư mục đích và tên class: [docs/folder-structure.md](docs/folder-structure.md). Mục lục tài liệu: [docs/README.md](docs/README.md).

---

## Phần 1. Trạng thái thư mục

### I. Bảng trạng thái

| Đường dẫn | Nội dung | Trạng thái | Tạo ở |
|---|---|---|---|
| `docs/` | Tài liệu sản phẩm, kỹ thuật, quy trình, ADR | Có | T101 |
| `docs/wireframes/` | Wireframe 6 trang | Thư mục rỗng | T103 |
| `docs/images/` | Ảnh chụp màn hình, sơ đồ cho README | Chưa có | T405 |
| `data/csv/` | CSV PokéAPI (không commit) | Tải trên từng máy; kết quả khảo sát ở `data/README.md`, Phần 4 | T102 |
| `data/dumps/` | File `mysqldump` (không commit) | Xuất sau lần nạp đầu trên từng máy | T205 |
| `backend/` | Spring Boot API | Khung: `common/{config, domain, exception, web}`, `/health`, Swagger; migration V1-V3, Entity `typechart` và `pokedex`; `ingestion` nạp CSV khi khởi động; `GET /api/v1/pokemon` | T202, T204, T205, T206 |
| `frontend/` | React SPA | Khung: `AppLayout`, router 7 route, token Tailwind; trang giữ chỗ | T203 |
| `frontend/public/sprites/` | Sprite tự host (được commit) | Chưa có | T207 |
| `scripts/` | Script tải CSV, sprite, dump DB, đo hiệu năng | Chưa có | T205, T207, T305 |
| `.github/` | Mẫu Issue, PR, CI, Dependabot | Có | T101 |
| `.claude/` | Cấu hình Claude Code dùng chung: quyền, slash command | Có | 2026-10-20 |

- Cập nhật cột Trạng thái khi task trong cột "Tạo ở" hoàn thành.

### II. File ở gốc repo

| File | Vai trò | Commit |
|---|---|---|
| `README.md` | Giới thiệu, cài đặt, lộ trình tóm tắt | Có |
| `CONTRIBUTING.md` | Quy trình đóng góp, Definition of Done | Có |
| `CHANGELOG.md` | Lịch sử thay đổi theo phiên bản | Có |
| `CLAUDE.md` | Quy tắc dự án cho Claude Code | Có |
| `CLAUDE.local.md` | Cấu hình cá nhân của từng máy | Không |
| `AGENTS.md` | Trỏ các công cụ AI khác về `CLAUDE.md` | Có |
| `MAP.md` | Bản đồ điều hướng (file này) | Có |
| `SPEC.md` | Bảng truy vết tính năng, endpoint, trang, task, test | Có |
| `PLAN.md` | Theo dõi tiến độ tuần hiện tại | Có |
| `docker-compose.yml`, `.env.example` | MySQL, Adminer, biến môi trường mẫu | Có |

---

## Phần 2. Muốn làm gì thì xem ở đâu

### I. Backend và dữ liệu

| Việc cần làm | Đọc trước | Sửa hoặc tạo ở | Tài liệu phải cập nhật |
|---|---|---|---|
| Thêm hoặc sửa endpoint | [docs/api.md](docs/api.md), Phần 1-3 | `backend/.../<feature>/controller`, `dto`, `service` | `docs/api.md` |
| Thêm mã lỗi | [docs/api.md](docs/api.md), Phần 4 | `common/exception/ErrorCode`, `GlobalExceptionHandler` | `docs/api.md`; `frontend/src/lib/errorMessages.ts` |
| Thay đổi schema | [docs/database.md](docs/database.md), Phần 2-5 | `backend/src/main/resources/db/migration/V<n+1>__...sql` | `docs/database.md` |
| Nạp dữ liệu CSV | [data/README.md](data/README.md), [docs/database.md](docs/database.md), Phần 5 | `backend/.../ingestion/` | `data/README.md` nếu thêm file CSV |
| Sửa thuật toán Synergy | [docs/architecture.md](docs/architecture.md), Phần 5 | `backend/.../synergy/service/` | `docs/architecture.md`, Phần 5 |
| Thêm thuộc tính cấu hình | [docs/architecture.md](docs/architecture.md), Phần 10 | `application*.yml`, `common/config/AppProperties` | `docs/architecture.md`, Phần 10; `.env.example` |
| Thêm package hoặc class mới | [docs/folder-structure.md](docs/folder-structure.md), Phần 2 | `backend/src/main/java/com/pokenexus/` | `docs/folder-structure.md` |

### II. Frontend

| Việc cần làm | Đọc trước | Sửa hoặc tạo ở | Tài liệu phải cập nhật |
|---|---|---|---|
| Thêm trang hoặc route | [docs/architecture.md](docs/architecture.md), Phần 6; [docs/design-system.md](docs/design-system.md), Phần 6 | `src/pages/`, `src/app/router.tsx` | `docs/architecture.md`, Phần 6 |
| Thêm component | [docs/design-system.md](docs/design-system.md), Phần 4 | `src/features/<ten>/components/` hoặc `src/components/` | `docs/design-system.md` nếu là component dùng chung |
| Thêm màu, token | [docs/design-system.md](docs/design-system.md), Phần 2-3 | `src/styles/index.css` | `docs/design-system.md` |
| Gọi API mới | [docs/api.md](docs/api.md), Phần 3 | `src/features/<ten>/api.ts`, `hooks.ts`, `src/types/api.ts` | |
| Hiển thị ảnh Pokémon | [docs/assets.md](docs/assets.md), Phần 5 | `src/lib/assets.ts`, `PokemonSprite` | `docs/assets.md` |

### III. Quy trình và phát hành

| Việc cần làm | Đọc trước | Sửa hoặc tạo ở |
|---|---|---|
| Bắt đầu một task | [PLAN.md](PLAN.md), [docs/roadmap.md](docs/roadmap.md), Phần 3 | Nhánh mới theo [docs/git-workflow.md](docs/git-workflow.md), Phần 1 |
| Ghi quyết định kiến trúc | [docs/README.md](docs/README.md), Phần 1, mục II | `docs/adr/NNNN-ten-quyet-dinh.md` |
| Sửa CI | `.github/workflows/ci.yml` | `.github/workflows/` |
| Gắn tag phát hành | [docs/git-workflow.md](docs/git-workflow.md), Phần 6 | `CHANGELOG.md` |
| Thêm sprite, font, ảnh | [docs/assets.md](docs/assets.md) | `frontend/public/`, `frontend/src/assets/` |
| Triển khai production | [docs/architecture.md](docs/architecture.md), Phần 11 | `backend/Dockerfile`, cấu hình hosting |

---

## Phần 3. Luồng dữ liệu tổng quát

### I. Sơ đồ

```text
data/csv/*.csv
   | IngestionRunner (profile dev, chỉ khi bảng pokemon rỗng)
   v
MySQL 8.4  <-- Flyway V1..Vn
   | khởi động: nạp vào bộ nhớ
   v
TypeChartService (18 x 18)  +  PokemonProfileRegistry (defenseScore 18 hệ)
   |
   v
REST /api/v1  -->  SPA React (TanStack Query)  -->  sprite /sprites/pokemon/{id}.png
```

- Chi tiết từng luồng: [docs/architecture.md](docs/architecture.md), Phần 4.
- Quy tắc phụ thuộc giữa package backend: [docs/architecture.md](docs/architecture.md), Phần 3, mục II.
