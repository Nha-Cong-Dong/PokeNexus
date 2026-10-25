# PokeNexus - Kế hoạch đang thực hiện

- Cập nhật: 2026-10-23
- File này theo dõi tiến độ hằng ngày. Kế hoạch gốc (task, ngày, tiêu chí) ở [docs/roadmap.md](docs/roadmap.md); không sửa kế hoạch gốc ở đây.
- Cập nhật khi bắt đầu và kết thúc mỗi phiên làm việc. Chủ nhật đồng bộ trạng thái sang README Phần 7 và GitHub Milestone.

---

## Phần 1. Hiện tại

### I. Tóm tắt

| Mục | Giá trị |
|---|---|
| Tuần | W1 - Ý tưởng và khởi tạo (19/10 - 25/10) |
| Task hôm nay | T206 - `GET /api/v1/pokemon` (Issue #13) |
| Task kế tiếp | T207 - Script tải sprite (Issue #14), T301 rút gọn (Issue #17) |
| Mốc gần nhất | Tag `v0.1.0` ngày 01/11 |

### II. Trạng thái task tuần W1

| Mã | Ngày | Task | Trạng thái | Ghi chú |
|---|---|---|---|---|
| T101 | 19/10 | Bộ tài liệu kế hoạch v0.2 | Xong | Commit `2b97191` trên nhánh `docs/planning-and-ai-guides`, đã merge vào `main` qua PR #4 |
| T102 | 20/10 | Khảo sát bộ CSV PokéAPI | Xong | Làm ngày 21/10; kết quả ở [data/README.md](data/README.md), Phần 4 |
| T103 | 21-22/10 | Wireframe 6 trang | Xong | Làm ngày 23/10; 12 ảnh trong [docs/wireframes/](docs/wireframes/README.md), Issue #9 |
| T104 | 23/10 | Nhãn, milestone, board, Issue W2-W3 | Xong một phần | 14 nhãn, 4 milestone, Issue #9-#26; còn Project board (cần quyền `project`), Issue #10 |
| T105 | 24/10 | Trình bày ý tưởng | Chưa làm | Trình bày miệng, không cần slide hay tài liệu riêng |
| T106 | 25/10 | Buffer, tổng kết tuần | Chưa làm | |

### III. Task W2 làm sớm

| Mã | Ngày gốc | Task | Trạng thái | Ghi chú |
|---|---|---|---|---|
| T201 | 26/10 | Chốt spec 1.0 | Xong | Nhánh `docs/spec-1-0`; chấp nhận cả 3 đề xuất, thêm 2 quy tắc dữ liệu từ T102 |
| T202 | 26/10 | Khởi tạo backend | Xong | `verify` xanh: 22 unit test và 3 test `*IT` (Testcontainers) pass; `spring-boot:run` trên MySQL Docker, Swagger UI và `/health` trả 200 |
| T203 | 27/10 | Khởi tạo frontend | Xong | `lint`, `test` (11 test), `build` xanh; `npm run dev` hiển thị header, 4 mục điều hướng, footer (kiểm tra 23/10) |
| T204 | 28/10 | Flyway migration V1-V3 | Xong | 10 bảng, Entity `typechart` và `pokedex` qua `validate`; `SchemaMigrationIT` (10 test), `PokemonRepositoryIT` (3 test); PR chờ review |
| T205 | 29/10 | Ingestion CSV vào MySQL | Xong | Bộ đầy đủ nạp trong 3,1 s: 18 hệ, 324 hệ số, 1025 loài, 1351 dạng, 484 tiến hóa; `item_name` để NULL |
| T206 | 30/10 | `GET /api/v1/pokemon` | Xong | `?type=dragon&gen=4` có Garchomp; `size=101` trả 400; mặc định 1083 dạng (`DEFAULT` + `REGIONAL`) |

- Giá trị cột Trạng thái: Chưa làm, Đang làm, Bị chặn, Xong, Cắt giảm.

---

## Phần 2. Checklist task đang làm

### I. T102 - Khảo sát bộ CSV PokéAPI

- [x] Tải 12 file CSV vào `data/csv/` theo [data/README.md](data/README.md), Phần 2.
- [x] Xác nhận dòng tiêu đề từng file khớp cột ghi trong `data/README.md`, Phần 1.
- [x] Đếm số dòng từng file.
- [x] `types.csv`: đếm được 18 hệ có ID 1-18.
- [x] `type_efficacy.csv`: đúng 324 dòng với hai hệ trong 1-18.
- [x] Đếm số loài (`pokemon_species.csv`) và số dạng (`pokemon.csv`).
- [x] Liệt kê hậu tố tên dạng (`-mega`, `-gmax`, `-alola`...) để chốt quy tắc `form_category` ([docs/database.md](docs/database.md), Phần 1, mục IV).
- [x] Ghi số Pokémon thiếu sprite (đối chiếu [docs/assets.md](docs/assets.md)).
- [x] Ghi kết quả khảo sát vào [data/README.md](data/README.md), Phần 4.

---

## Phần 3. Blocker và việc cần quyết định

### I. Danh sách

| Vấn đề | Ảnh hưởng | Đề xuất | Trạng thái |
|---|---|---|---|
| Kết quả T101 chưa commit | Thay đổi mới dễ trộn vào PR tài liệu v0.2 | Tách 2 commit trên nhánh `docs/planning-and-ai-guides` | Đã xử lý |
| Chưa chốt nơi lưu kết quả T102 | T201 và T205 cần dùng số liệu này | Thêm mục "Kết quả khảo sát" vào `data/README.md` | Đã xử lý |
| `data/csv/` chưa có dữ liệu | Chặn T102 | Chạy lệnh tải trong `data/README.md`, Phần 2 | Đã xử lý |
| Máy chưa cài Docker | Không chạy được MySQL, Testcontainers, không khởi động được backend; chặn T204, T205 | Cài Docker Desktop; service `MySQL80` chiếm cổng 3306 nên `.env` đặt `DB_PORT=3307` | Đã xử lý |
| `./mvnw` trong Git Bash không tải được Maven (curl lỗi `CRYPT_E_REVOCATION_OFFLINE`) | Lệnh Git Bash của backend thất bại trên máy này | Dùng `.\mvnw.cmd` trong PowerShell (đã tải Maven 3.10.0 vào `~/.m2/wrapper`) | Có cách vòng |
| Node trên máy là 25, `.nvmrc` là 24 | Lệch phiên bản với CI | Tạm dùng Node 25; cài Node 24 (nvm-windows) khi có thời gian | Mở |
| PR `docs/planning-and-ai-guides` chưa merge | Nhánh `docs/spec-1-0`, `chore/init-*` tách nối tiếp từ nhánh này | Merge PR tài liệu trước, sau đó lần lượt các nhánh nối tiếp | Đã xử lý: PR #4-#7 đã merge vào `main` |

---

## Phần 4. Nhật ký

### I. Theo ngày

| Ngày | Việc đã làm | Kết quả kiểm tra |
|---|---|---|
| 2026-10-19 | T101: tài liệu kế hoạch v0.2, ADR 0005, `folder-structure.md`, `design-system.md`, `assets.md`, `git-workflow.md` | Không có link nội bộ gãy (kiểm tra 2026-10-20) |
| 2026-10-20 | Thêm `CLAUDE.md`, `CLAUDE.local.md`, `AGENTS.md`, `MAP.md`, `SPEC.md`, `PLAN.md`, `backend/CLAUDE.md`, `frontend/CLAUDE.md`, `.claude/settings.json`, `.claude/commands/` | Xem PR tương ứng |
| 2026-10-21 | T102 khảo sát CSV; T201 chốt spec 1.0, chỉnh quy tắc `form_category` và chọn dòng tiến hóa | 18 hệ, 324 dòng tương khắc, 1025 loài, 1351 dạng, 9 ID thiếu sprite |
| 2026-10-21 | T202 khung backend (Boot 4.1.1, springdoc 3.1.1); T203 khung frontend (Vite 8, React 19, Tailwind 4.3, React Router 8) | Backend: 22 test pass, 3 IT Skipped (không có Docker). Frontend: lint, 11 test, build pass |
| 2026-10-23 | Cài Docker Desktop, tạo `.env` (`DB_PORT=3307`), chạy MySQL 8.4 bằng Compose; chạy backend bằng `spring-boot:run`; đóng T202; xem frontend bằng trình duyệt | Container `healthy`; `verify`: 22 test và 3 IT pass, 0 Skipped; `GET /api/v1/health` 200 (`pokemonCount` 0, chờ T204-T205); Swagger UI 200 |
| 2026-10-23 | T103 wireframe 6 trang (PR #27); T104 nhãn, milestone, Issue #9-#26; T204 migration V1-V3, Entity, Repository | 12 ảnh wireframe 375/1440 px; `verify`: 27 unit test, 16 IT pass, 0 Skipped; MySQL Docker: `flyway_schema_history` 3 dòng `success = 1`, 11 bảng |
| 2026-10-23 | T205 nạp CSV: `CsvReader`, `FormCategoryResolver`, 5 loader, `IngestionRunner`; thêm `commons-csv` 1.14.1 (đã hỏi) | `verify`: 41 unit test, 24 IT pass, 0 Skipped; MySQL Docker: Charizard 78/84/78/109/85/100 BST 534, `form_category` 1025/58/97/34/137, `/health` `dataLoaded: true` 1351 |
| 2026-10-23 | T206 `GET /api/v1/pokemon`: `PokemonFilter`, `PageRequestFactory`, `PokemonSpecifications`, `PokemonQueryService`, `PokemonController` | `verify`: 48 unit test, 31 IT pass, 0 Skipped; dữ liệu thật: dragon gen 4 trả 6 kết quả có Garchomp, `size=101` 400 `INVALID_PARAMETER` |
