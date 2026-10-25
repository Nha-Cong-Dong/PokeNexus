# PokeNexus - Kế hoạch đang thực hiện

- Cập nhật: 2026-10-25
- File này theo dõi tiến độ hằng ngày. Kế hoạch gốc (task, ngày, tiêu chí) ở [docs/roadmap.md](docs/roadmap.md); không sửa kế hoạch gốc ở đây.
- Cập nhật khi bắt đầu và kết thúc mỗi phiên làm việc. Chủ nhật đồng bộ trạng thái sang README Phần 7 và GitHub Milestone.

---

## Phần 1. Hiện tại

### I. Tóm tắt

| Mục | Giá trị |
|---|---|
| Tuần | W1 - Ý tưởng và khởi tạo (19/10 - 25/10) |
| Task hôm nay | T106 tổng kết tuần; đóng T301, T208, T209 (làm sớm) |
| Task kế tiếp | T303 chi tiết Pokémon (Issue #19), tạo `TypeChartService` dùng chung cho T304, T305 |
| Mốc gần nhất | Tag `v0.2.0` ngày 08/11 (`v0.1.0` gắn sớm ngày 25/10) |

### II. Trạng thái task tuần W1

| Mã | Ngày | Task | Trạng thái | Ghi chú |
|---|---|---|---|---|
| T101 | 19/10 | Bộ tài liệu kế hoạch v0.2 | Xong | Commit `2b97191` trên nhánh `docs/planning-and-ai-guides`, đã merge vào `main` qua PR #4 |
| T102 | 20/10 | Khảo sát bộ CSV PokéAPI | Xong | Làm ngày 21/10; kết quả ở [data/README.md](data/README.md), Phần 4 |
| T103 | 21-22/10 | Wireframe 6 trang | Xong | Làm ngày 23/10; 12 ảnh trong [docs/wireframes/](docs/wireframes/README.md), Issue #9 |
| T104 | 23/10 | Nhãn, milestone, board, Issue W2-W3 | Xong | 14 nhãn, 4 milestone, Issue #9-#26; Project board [PokeNexus](https://github.com/orgs/Nha-Cong-Dong/projects/1) tạo ngày 25/10 (Issue #10) |
| T105 | 24/10 | Trình bày ý tưởng | Chưa làm | Trình bày miệng, không cần slide hay tài liệu riêng; chờ xác nhận đã trình bày |
| T106 | 25/10 | Buffer, tổng kết tuần | Xong | Rà soát tiến độ, merge PR #28-#32, đồng bộ `PLAN.md`, `MAP.md`, README Phần 7, đóng milestone W1 |

### III. Task W2, W3 làm sớm

| Mã | Ngày gốc | Task | Trạng thái | Ghi chú |
|---|---|---|---|---|
| T201 | 26/10 | Chốt spec 1.0 | Xong | Nhánh `docs/spec-1-0`; chấp nhận cả 3 đề xuất, thêm 2 quy tắc dữ liệu từ T102 |
| T202 | 26/10 | Khởi tạo backend | Xong | `verify` xanh: 22 unit test và 3 test `*IT` (Testcontainers) pass; `spring-boot:run` trên MySQL Docker, Swagger UI và `/health` trả 200 |
| T203 | 27/10 | Khởi tạo frontend | Xong | `lint`, `test` (11 test), `build` xanh; `npm run dev` hiển thị header, 4 mục điều hướng, footer (kiểm tra 23/10) |
| T204 | 28/10 | Flyway migration V1-V3 | Xong | 10 bảng, Entity `typechart` và `pokedex` qua `validate`; `SchemaMigrationIT` (10 test), `PokemonRepositoryIT` (3 test); PR #28 |
| T205 | 29/10 | Ingestion CSV vào MySQL | Xong | Bộ đầy đủ nạp trong 3,1 s: 18 hệ, 324 hệ số, 1025 loài, 1351 dạng, 484 tiến hóa; `item_name` để NULL; PR #29 |
| T206 | 30/10 | `GET /api/v1/pokemon` | Xong | `?type=dragon&gen=4` có Garchomp; `size=101` trả 400; mặc định 1083 dạng (`DEFAULT` + `REGIONAL`); PR #30 |
| T207 | 30/10 | Script tải sprite | Xong | 1342 file, 9 ID thiếu (khớp T102), 1,5 MB; PR #31 |
| T208 | 31/10 | CI đầy đủ, Dependabot | Xong | CI chạy `verify` gồm IT Testcontainers (41 unit, 24 IT trên CI); Dependabot thêm Maven, npm; PR #32 |
| T209 | 01/11 | Buffer, review, tag `v0.1.0` | Xong | Tiêu chí W2 đạt; CHANGELOG mục 0.1.0; tag `v0.1.0` ngày 25/10 |
| T301 | 02/11 | Omni-Dex UI | Xong | Theo design-system 0.3; chạy với backend thật 25/10: 1.083 kết quả, `?type=dragon&gen=4` có Garchomp, trạng thái rỗng có nút xóa lọc, reload giữ bộ lọc; 375 px không cuộn ngang; thẻ hiện sau 124-406 ms; PR #31 |

- Giá trị cột Trạng thái: Chưa làm, Đang làm, Bị chặn, Xong, Cắt giảm.

---

## Phần 2. Checklist task đang làm

### I. T303 - Chi tiết Pokémon (API và UI)

- [ ] `TypeChartService` giữ ma trận 18 x 18 trong bộ nhớ, tính hệ số hệ kép; `TypeChartServiceTest` với ví dụ 3 ở [docs/spec.md](docs/spec.md), Phần 2, mục V.4 (Charizard: Rock 4, Ground 0, Water 2, Electric 2).
- [ ] `GET /api/v1/pokemon/{idOrName}` theo [docs/api.md](docs/api.md), Phần 2, mục IV: 200 `PokemonDetail`, 400 `INVALID_PARAMETER`, 404 `POKEMON_NOT_FOUND`.
- [ ] `PokemonDetailPage`: tên, sprite, hệ, 6 chỉ số dạng thanh, BST, chiều cao, cân nặng, lưới phòng thủ 18 hệ có ghi hệ số.
- [ ] `/pokemon/abc-xyz` hiển thị trang không tìm thấy.
- [ ] Kiểm tra 375 px và 1440 px; cập nhật `docs/api.md`, `docs/folder-structure.md` nếu đổi tên.

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
| PR #29-#31 xếp chồng, không có CI vì `ci.yml` chỉ chạy với PR vào `main` | Chưa đạt Definition of Done "CI xanh" | Merge lần lượt; sau mỗi lần squash, `git rebase --onto main <tip cũ>` rồi push `--force-with-lease` | Đã xử lý: PR #28-#31 merge ngày 25/10, CI xanh từng PR. Từ nay mỗi PR tách từ `main` |
| `gh` thiếu quyền `project`, `read:project` | Chưa tạo được Project board (T104, Issue #10) | Chạy `gh auth refresh -s project,read:project` rồi tạo board theo [docs/github-setup.md](docs/github-setup.md), Phần 6 | Đã xử lý: cấp quyền ngày 25/10, board đã tạo |
| Ruleset `NgKhanh` có danh sách nhánh đích rỗng | `main` chưa được chặn xóa và force push như [docs/git-workflow.md](docs/git-workflow.md), Phần 1 mô tả | Settings > Rules > Rulesets > `NgKhanh` > Target branches > Add target > Include default branch (chỉ `main`, để nhánh làm việc vẫn force push được) | Mở |

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
| 2026-10-23 | T207 sprite; T301 bản cơ bản: `DexPage` gọi API thật, bộ lọc trên URL, phân trang | Frontend: lint sạch, 23 test pass, build pass; chạy thật: trang `/` hiện 1.083 kết quả có sprite, `?type=dragon&gen=4` hiện 6 kết quả có Garchomp |
| 2026-10-25 | T301 theo bản thiết kế: 3 font mới, token v0.3 (`ink`, `dex-red`, màu hệ đậm), header đỏ, footer, `PageHero` và 15 scene (ảnh thật cho `grassland`, `stadium`), card nhuộm màu hệ, chip lọc, BST và tốc độ, ngăn kéo lọc mobile, chế độ danh sách; cập nhật `design-system.md`, `assets.md`, `folder-structure.md`, `architecture.md` | Frontend: lint sạch, 64 test pass, build pass, Prettier sạch; chụp Edge headless với API giả: 1440 px (thẻ, danh sách, rỗng), 375 px không cuộn ngang. Chưa chạy với backend thật vì Docker Desktop đang tắt |
| 2026-10-25 | Rà soát tiến độ (22/32 task chưa xong trước phiên); T301 chạy với backend thật; merge PR #28-#31 (rebase chuỗi PR xếp chồng); T208 Dependabot Maven, npm (PR #32); T209 CHANGELOG 0.1.0, tag `v0.1.0`; T106 đồng bộ tài liệu, đóng milestone W1 | `verify` với Docker: 48 unit test, 31 IT pass, 0 Skipped; frontend lint sạch, 64 test, build pass; CI PR #29-#32 xanh (41 unit, 24 IT trên CI); cây file `main` sau merge trùng nhánh đã kiểm tra; 375 px `scrollWidth` 375 |
| 2026-10-25 | T104: cấp quyền `project` cho `gh`; tạo Project `PokeNexus` (riêng tư), liên kết repo; cột Status `Backlog`, `To Do`, `In Progress`, `In Review`, `Done`; view `Board` lọc milestone W2, W3 và view `Tất cả` dạng bảng; thêm Issue #9-#26 | Board có 18 thẻ: 9 `Done`, 9 `To Do`; workflow "Item closed" và "Pull request merged" đang bật |
