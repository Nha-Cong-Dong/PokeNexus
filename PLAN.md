# PokeNexus - Kế hoạch đang thực hiện

- Cập nhật: 2026-10-28
- File này theo dõi tiến độ hằng ngày. Kế hoạch gốc (task, ngày, tiêu chí) ở [docs/roadmap.md](docs/roadmap.md); không sửa kế hoạch gốc ở đây.
- Cập nhật khi bắt đầu và kết thúc mỗi phiên làm việc. Chủ nhật đồng bộ trạng thái sang README Phần 7 và GitHub Milestone.

---

## Phần 1. Hiện tại

### I. Tóm tắt

| Mục | Giá trị |
|---|---|
| Tuần | W2 - Đặc tả và khung dự án (26/10 - 01/11) |
| Task hôm nay | Đóng T310: merge PR #40, #41, tag `v0.2.0`; toàn bộ task W3 đã xong |
| Task kế tiếp | Tạo Issue cho T311, T312 và T401-T405, T407 (milestone W4); T401 Cây tiến hóa hoặc Bảng tốc độ |
| Mốc gần nhất | Tag `v1.0.0` ngày 15/11 (`v0.1.0` gắn sớm ngày 25/10, `v0.2.0` gắn sớm ngày 28/10) |

### II. Trạng thái task tuần W1

| Mã | Ngày | Task | Trạng thái | Ghi chú |
|---|---|---|---|---|
| T101 | 19/10 | Bộ tài liệu kế hoạch v0.2 | Xong | Commit `2b97191` trên nhánh `docs/planning-and-ai-guides`, đã merge vào `main` qua PR #4 |
| T102 | 20/10 | Khảo sát bộ CSV PokéAPI | Xong | Làm ngày 21/10; kết quả ở [data/README.md](data/README.md), Phần 4 |
| T103 | 21-22/10 | Wireframe 6 trang | Xong | Làm ngày 23/10; 12 ảnh trong [docs/wireframes/](docs/wireframes/README.md), Issue #9 |
| T104 | 23/10 | Nhãn, milestone, board, Issue W2-W3 | Xong | 14 nhãn, 4 milestone, Issue #9-#26; Project board [PokeNexus](https://github.com/orgs/Nha-Cong-Dong/projects/1) tạo ngày 25/10 (Issue #10) |
| T105 | 24/10 | Trình bày ý tưởng | Cắt giảm | Quyết định ngày 26/10: dự án không có buổi trình bày hay pitching ý tưởng nào; không ảnh hưởng tiêu chí W1. Slide và video demo (T406) bỏ khỏi kế hoạch ngày 27/10 |
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
| T301 | 02/11 | Omni-Dex UI | Xong | Theo design-system 0.3; chạy với backend thật 25/10: 1.083 kết quả, `?type=dragon&gen=4` có Garchomp, trạng thái rỗng có nút xóa lọc, reload giữ bộ lọc; 375 px không cuộn ngang; thẻ hiện sau 124-406 ms; PR #31. Từ 26/10 ở `/pokedex` |
| T302 | 02/11 | Tìm kiếm tên, `PokemonSearchBox` | Xong | Làm 26/10. Gõ "char" ra Charmander, Charmeleon, Charizard đầu danh sách; combobox ARIA, mũi tên, `Enter`, `Esc`; có ở Omni-Dex, So sánh, Team Builder |
| T303 | 03/11 | Chi tiết Pokémon | Xong | Làm 26/10. Charizard: Rock x4, Ground x0; `/pokemon/abc-xyz` hiện trang không tìm thấy; thêm chuỗi tiến hóa (endpoint `/evolution`, US-08 làm sớm) và các dạng |
| T304 | 03/11 | Bảng tương khắc | Xong | Làm 26/10. Ma trận 324 ô; `?def=fire&def=flying` cho Rock x4; ma trận cuộn ngang trong khung ở 375 px |
| T305 | 04/11 | Synergy backend | Xong | Làm 26/10. 4 ví dụ đáp án spec V.4 qua test; đề xuất số 1 Iron Treads, lý do "Chống chịu hệ Rock"; p95 analyze 6 ms, recommendations 10 ms (100 lần, local) |
| T306 | 05/11 | Team Builder UI | Xong | Làm 26/10. Hàng Rock gắn "Lỗ hổng nghiêm trọng"; điểm đội 20/100 với đội mẫu; radar SVG; 3 thẻ đề xuất. 27/10: thêm đề xuất số 1 (Iron Treads) vào slot 6 thì điểm lên 48, đạt đủ cột Kiểm tra |
| T307 | 06/11 | Lưu và chia sẻ | Xong | Làm 26/10. `POST /teams` 201 + `Location`, 10 lần mỗi phút mỗi IP (429 + `Retry-After`); trang Đội chia sẻ; `TeamControllerIT` qua |
| T308 | 06/11 | Bàn Cân Sức Mạnh | Xong | Làm 26/10. Garchomp và Salamence: "Garchomp nhanh hơn (102 so với 100)."; radar chồng lớp, bảng từng chỉ số |
| T311 | 07/11 | Trang Tổng quan phần 1 | Xong | Làm 26/10. Hero 13 vùng đất, dải hệ, Bốn vùng đất, Vòng tương khắc (Fire: x2 Grass, Ice, Bug, Steel), Pokémon hôm nay |
| T309 | 07/11 | Trạng thái, responsive, accessibility | Xong | Làm 28/10. 8 trang (10 route) ở 375 và 1440 px: không cuộn ngang, 1 `<h1>`, mọi điểm dừng Tab có vòng focus, đủ skeleton và `ErrorState`; Lighthouse Accessibility 100 cả mobile và desktop; sửa vùng chạm dưới 40 px, `Esc` đóng menu mobile, slot 6 giữ khi reload |
| T310 | 08/11 | Buffer, E2E, tag `v0.2.0` | Xong | Làm 28/10. Kịch bản spec Phần 4 đạt 2 lần liên tiếp (8-11 s mỗi lần, script CDP); CHANGELOG mục 0.2.0; PR #40, #41; tag và GitHub Release `v0.2.0`; Issue #25, #26 đóng |
| T312 | 08/11 | Trang Tổng quan phần 2 | Xong | Làm 26/10. Biểu đồ thế hệ (thế hệ 1 = 151, bấm mở `/pokedex?gen=1`), Thử tài Trainer 5 câu, kêu gọi cuối trang |

- Giá trị cột Trạng thái: Chưa làm, Đang làm, Bị chặn, Xong, Cắt giảm.

---

## Phần 2. Checklist task đang làm

### I. T309, T310 - Rà soát và kịch bản E2E

- [x] Chốt mâu thuẫn kịch bản demo (Phần 3): phương án B ngày 27/10, spec 1.3; kịch bản ở [docs/spec.md](docs/spec.md), Phần 4 giữ nguyên.
- [x] Tab qua 8 trang bằng bàn phím, focus nhìn thấy được; kiểm tra lại 375 px và 1440 px (28/10, xem Nhật ký).
- [x] Chạy kịch bản demo ở spec Phần 4 hai lần liên tiếp trên local; ghi kết quả (28/10).
- [x] CHANGELOG mục 0.2.0.
- [x] Tag `v0.2.0` trên `main` sau khi merge PR #40, #41 (28/10).

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
| Kịch bản demo spec Phần 4 ("thêm đề xuất số 1, xác nhận điểm đội tăng") dựng đội 6 thành viên, nhưng `analyze` chỉ nhận 1-5 (ví dụ 4 của spec: 6 Pokémon trả 400) | Bước demo này không kiểm chứng được với đội 5 thành viên; Team Builder hiện đặt đề xuất vào slot 6 và ghi rõ điểm chỉ tính 5 thành viên đầu | Đề xuất: sửa bước demo thành "bỏ một thành viên, thêm đề xuất số 1, điểm đội tăng" (giữ nguyên API và ví dụ 4). Phương án khác: cho `analyze` nhận 6 nhưng phải đổi ví dụ 4 | Đã xử lý 27/10: chọn phương án B (`analyze` nhận 1-6, `recommendations` vẫn 1-5, ví dụ 4 đổi thành 7 Pokémon); spec 1.3, api.md 0.4 |
| `excludeLegendary=true` vẫn đề xuất Pokémon Paradox (Iron Treads, Sandy Shocks, Great Tusk) | Đề xuất có thể bị xem là "huyền thoại" với người chơi VGC | CSV PokéAPI không đánh dấu Paradox là huyền thoại; nếu cần, thêm danh sách loại trừ trong `RecommendationEngine` | Mở |
| Slot 6 của Team Builder chỉ nằm trong state trang | Reload mất đề xuất đã chọn cho slot 6 | Đã thêm tham số `six` để link từ trang Đội chia sẻ mang theo slot 6; slot 6 chọn tay vẫn mất khi reload, xử lý ở T309 | Đã xử lý 28/10: `useTeamDraft` giữ slot 6 và ghi `six` lên URL cùng `ids` |
| Giới hạn lưu đội tính theo `getRemoteAddr()`; profile `prod` bật `forward-headers-strategy: framework` nên lấy giá trị đầu của `X-Forwarded-For` do client tự đặt; `SaveRateLimiter` chỉ dọn cửa sổ hết hạn nên map có thể lớn trong 1 phút | Ở production, script đổi `X-Forwarded-For` mỗi request sẽ vượt giới hạn 10 lần/phút | Khi chọn hosting (T403): chỉ tin header do proxy của nền tảng thêm vào, giới hạn cứng số IP theo dõi | Mở (review PR #39) |
| Trang So sánh gọi 3 request cho mỗi cặp (2 chi tiết + compare); `SynergyAnalyzer` dựng lại bảng 18 x 18 mỗi request | Thừa request và tính toán, chưa ảnh hưởng mục tiêu (p95 6 ms) | Dùng 2 `PokemonDetail` trong response compare; tính sẵn bảng khi nạp `TypeChartService` (T404) | Mở (review PR #39) |
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
| 2026-10-26 | Cắt giảm T105 vì không có buổi trình bày hay pitching; ghi chú ở `docs/roadmap.md`, Phần 3, mục I; bỏ T105 khỏi dòng "Slide trình bày" ở `docs/assets.md`; README Phần 7 ghi "T105 cắt giảm" | Không còn tham chiếu T105 ngoài `docs/roadmap.md` và `PLAN.md`; link nội bộ trong 4 file đã sửa không gãy |
| 2026-10-26 | Tinh gọn tài liệu: gộp `SPEC.md` vào `docs/spec.md` Phần 6, `MAP.md` vào `docs/README.md` Phần 2; xóa `SPEC.md`, `MAP.md`, `AGENTS.md`; bỏ bản chép CSS trong `design-system.md` Phần 3; bỏ dòng trạng thái lỗi thời ở README và CLAUDE.md | Không còn tham chiếu tới 3 file đã xóa ngoài nhật ký và CHANGELOG 0.1.0; mọi link tương đối trong file `.md` trỏ tới file có thật |
| 2026-10-26 | Review PR #39 (15 điểm), sửa 8: nút "Thêm vào đội" dùng `?add=` không xóa đội nháp; link đội chia sẻ mang slot 6 (`six`); Enter ở ô tìm kiếm không chọn gợi ý cũ; hero và biểu đồ thế hệ hiện lỗi đúng; chọn nhanh 2 hệ ở Bảng tương khắc không mất lựa chọn; báo số giây chờ khi bị giới hạn lưu; gộp `getJson`/`postJson` và chính sách thử lại; bỏ code không dùng. Còn lại ghi ở Phần 3 | Mỗi lỗi có test hồi quy (test tìm kiếm và test chọn hệ đã đỏ khi chưa sửa); frontend lint sạch, toàn bộ test pass, build pass |
| 2026-10-26 | Thêm trang Tổng quan vào kế hoạch (spec 1.2 F07, roadmap 0.3 T311, T312; Omni-Dex sang `/pokedex`); làm API còn lại (tương khắc, chi tiết, tìm kiếm, so sánh, tiến hóa, synergy, lưu và chia sẻ đội) và 7 trang giao diện (T302-T308, T311, T312); radar vẽ bằng SVG thay Recharts; cập nhật `api.md`, `architecture.md`, `folder-structure.md`, `design-system.md` | `verify`: 98 unit test, 54 IT pass, 0 Skipped, `BUILD SUCCESS`; frontend lint sạch, Prettier sạch, 182 test pass, build pass (JS 149 KB gzip); chạy thật backend + MySQL Docker (1351 Pokémon) + Vite: 8 trang ở 1440 px và 375 px không cuộn ngang, mỗi trang đúng 1 `<h1>`, không lỗi console; đáp án spec V.4 đúng trên dữ liệu thật |
| 2026-10-27 | Rà soát tiến độ; bỏ slide, video demo (T406) khỏi `docs/roadmap.md` 0.4 và `docs/assets.md` 0.4; phương án B: `analyze` nhận 1-6 (`AnalyzeRequest`, `SynergyAnalyzer.MAX_TEAM_SIZE`), `RecommendationEngine.MAX_TEAM_SIZE` giữ 5, `TeamService` chấm điểm mọi thành viên; Team Builder và trang Đội chia sẻ gửi cả slot 6; spec 1.3, api.md 0.4, architecture.md 0.3 | `verify`: 101 unit test, 54 IT pass, 0 Skipped, `BUILD SUCCESS`; frontend lint sạch, 191 test pass, build pass; API thật (1351 Pokémon): đội mẫu 20 điểm, đề xuất số 1 Iron Treads ("Chống chịu hệ Rock"), thêm vào slot 6 thì 48 điểm và Rock hết lỗ hổng; 7 Pokémon trả 400; đề xuất cho đội 6 trả 400 |
| 2026-10-28 | T309: rà soát 8 trang bằng script Chrome headless (CDP) và Lighthouse 12; vùng chạm 40 px trên mobile (nút `sm`, `ViewToggle`, chip lọc, logo, link footer và vòng tương khắc); `Esc` đóng menu mobile; `useTeamDraft` giữ slot 6 trên URL (`six`); slot Team Builder và ô So sánh báo "Chưa tải được" khi API lỗi. T310: kịch bản demo spec Phần 4 chạy 2 lần; CHANGELOG 0.2.0; design-system 0.4 và architecture 0.3 cập nhật cỡ nút `sm`, tham số `six` | Frontend lint sạch, Prettier sạch, 198 test pass (8 test hồi quy đều đỏ khi chưa sửa), build pass. Trình duyệt thật (backend + MySQL Docker, 1351 Pokémon): 10 route ở 375/1440 px không cuộn ngang, 1 `<h1>`, 0 điểm dừng Tab thiếu focus; chặn backend thì mọi trang có `ErrorState`, trễ API 6 s thì có skeleton; Lighthouse Accessibility 100 ở 8 route x 2 cấu hình. E2E 2/2 đạt: Dragon gen 4 ra 6 kết quả có Garchomp; "Garchomp nhanh hơn (102 so với 100)"; Rock "Lỗ hổng nghiêm trọng"; Iron Treads vào slot 6, điểm 20 lên 48; reload giữ slot 6; link chia sẻ mở ở profile trống đủ 6 thành viên. Backend không đổi, không chạy lại `verify` |
| 2026-10-28 | Merge PR #40 (`analyze` nhận 1-6) và PR #41 (T309, T310); rebase nhánh #41 lên `main` sau khi squash #40; tag `v0.2.0`, GitHub Release từ mục 0.2.0 của CHANGELOG; đóng Issue #25, #26 | CI PR #41 xanh cả 2 job (Backend Java 25, Frontend Node 24); `main` tại `b1517ce`; Release `v0.2.0` là Latest; tiêu chí W3 ở `docs/roadmap.md`, Phần 3, mục V đạt |
| 2026-10-28 | Sửa số khó đọc: chữ số Pixelify Sans bị đọc nhầm (534 thành "S34", 2 m thành "8 m"), chuyển mọi con số sang Nunito 800 `tabular-nums`, token `text-num*`; bảng 4 màu cho 15 khung cảnh (`sceneGradient`, `sceneSwatch`), nền thân trang nhuộm theo khung cảnh (`scene-tint`, `PageBody scene`); thêm 12 ảnh khung cảnh từ Bulbagarden Archives (14/15, `flower-garden` chưa có ảnh đạt yêu cầu); design-system 0.5, assets 0.5, `SOURCES.md` | Frontend lint sạch, Prettier sạch, 201 test pass (test font `StatBar` đỏ khi chưa sửa), build pass (JS 151 KB gzip); ảnh khung cảnh 28 file 1,9 MB, mỗi file dưới 220/70 KB. Trình duyệt thật (backend + MySQL Docker, 1351 Pokémon): 7 route ở 375 px và 5 route ở 1440 px không cuộn ngang, 1 `<h1>`; Charizard hiện 534, 78, 109. Backend không đổi |
| 2026-10-28 | Nền khung cảnh theo ADR 0006: bộ nhiều ảnh mỗi scene (`photos`, `{scene}-{n}-{960,1920}.webp`), chuyển mờ mỗi 12 s, phóng chậm, lớp hạt CSS `SceneAmbience`, tắt khi `prefers-reduced-motion`; 25 ảnh từ Bulbagarden (ảnh 1920 px, 3 ngoại lệ 1280 px cho `volcano`, `swamp`, `stadium`), 5,8 MB; quy tắc ảnh cho phép xóa HUD, nhân vật bằng công cụ kèm kiểm duyệt dấu vết AI (`scripts/check-image-provenance.mjs`). Hero Tổng quan cao bằng màn hình, tên ứng dụng trên tấm nền scrim 75%, artwork tràn khỏi vòng tròn; `PageHero` dùng tấm nền thay lớp phủ rộng; Team Builder rộng 100 rem, 3 cột từ 1344 px. design-system 0.6, assets 0.6 | Frontend lint sạch, Prettier sạch, 206 test pass, build pass (JS 153 KB gzip). Trình duyệt thật: hero vừa màn hình ở 1920x900, 1440x800, 1366x650; bảng điểm yếu đội 6 thành viên không tràn ở 1024-1920 px; ảnh 1920 tải đúng, 0 request ảnh lỗi, 18 hạt; chuyển ảnh ở giây 12-13,2; 375 px không cuộn ngang. Script kiểm duyệt: 4/4 file giả lập bị loại, 27/27 ảnh gốc đạt. Mục tiêu 4-5 ảnh mỗi scene chưa đạt (1-3 ảnh) |
