# Changelog

Mọi thay đổi đáng chú ý của dự án được ghi lại tại đây.

- Định dạng theo [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
- Phiên bản theo [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Bộ chuyển động theo bản thiết kế hi-fi ngày 2026-10-24 cho mọi trang: card và danh sách vào lần lượt, artwork rơi xuống rồi lơ lửng, thanh chỉ số chạy dài, ma trận tương khắc hiện theo đường chéo, màn đối đầu So sánh bay vào, radar phóng từ tâm, nhãn lỗ hổng nghiêm trọng nhấp nháy, màn hình Tổng quan mở kiểu CRT, dải hệ chạy ngang, khối hiện khi cuộn tới (`Reveal`), ảnh hero lộ theo vòng tròn khi đổi khung cảnh. `prefers-reduced-motion` hiện ngay trạng thái cuối.
- Trang Địa hình `/terrain/:terrainId?`: 13 địa hình phủ 18 hệ, mô tả, Pokémon thường gặp, minigame "Who's that Pokémon?" (bóng đen, 4 lựa chọn, chuỗi 5 câu đúng nhận huy hiệu). Header có mục thứ 5 "Địa hình".
- Thử tài Trainer có 5 bộ, mỗi bộ 6 câu (hệ số sát thương, điểm yếu và miễn nhiễm, chỉ số gốc, hệ của Pokémon, vùng đất ra mắt); đáp án tính từ ma trận tương khắc và API chi tiết.
- Team Builder có ô "Loại huyền thoại, thần thoại và Paradox" cho phần đề xuất (gửi `excludeLegendary: true`), mặc định tắt.
- Phần thưởng Trainer dùng chung cho Thử tài Trainer và trang Địa hình: điểm, thưởng chuỗi đúng, Poké/Great/Ultra/Master Ball theo kết quả bộ câu hỏi, huy hiệu, 6 danh hiệu; lưu trong `localStorage`.
- `backend/Dockerfile` multi-stage (Eclipse Temurin 25 JDK để build, JRE để chạy, jar tách layer, user không phải root) và service `backend` (profile `app`) trong Docker Compose: `docker compose --profile app up -d --build` chạy backend cùng MySQL.
- `scripts/bench-synergy.sh`: đo p50, p95 của `analyze` và `recommendations`, thoát mã lỗi khi p95 từ 50 ms.

### Changed

- Bảng chọn địa hình thành dải 13 cột xiên có ảnh nhỏ (`{scene}-thumb.webp`, 400 x 600, tổng 254 KB): cột đang chọn nở rộng với tên lớn và nhãn hệ, hover nở nhẹ; trên mobile cuộn ngang và tự cuộn tới địa hình đang chọn.
- Thanh điều hướng header canh giữa trang; bỏ ống kính tròn xanh trên vỏ Pokédex ở hero vì trùng với logo.
- Khung cảnh đầu các trang con cao hơn (288/480/544 px thay vì 192/320 px; trang Chi tiết 544 px từ `lg`) và đáy chuyển mượt sang màu nền trang (`scene-fade`), không còn đường cắt giữa ảnh và nền.
- Lộ trình 0.6 theo lịch hackathon (review Checkpoint 2): Checkpoint 3 ngày 01/11, triển khai 30-31/10, đóng băng tính năng từ 05/11, demo và `v1.0.0` ngày 08/11 (trước là 15/11).
- `data/README.md` tải CSV từ commit PokéAPI `e2710d3` thay vì nhánh `master`.
- `design-system.md` 0.8: bỏ giới hạn một khoảnh khắc chuyển động mỗi trang; README Phần 7 không còn cột trạng thái (trạng thái chỉ ở `PLAN.md`).
- `excludeLegendary=true` loại thêm 20 Pokémon Paradox (CSV PokéAPI không đánh dấu chúng là huyền thoại).
- Độ phủ tấn công của mỗi Pokémon tính sẵn khi nạp dữ liệu; `SynergyAnalyzer` không còn dựng bảng siêu hiệu quả ở mỗi request.

### Fixed

- Bảng task tuần 3 trong `docs/roadmap.md` bị tách đôi do dòng trống trước T313, làm T313-T315 mất header.
- Nút đáp án đúng và sai của Thử tài Trainer hiện chữ trắng trên nền trắng, vì lớp `bg-surface` của biến thể nút được Tailwind sinh sau lớp ghi đè; bộ câu hỏi đang chọn cũng không có nền vàng.

### Security

- `SaveRateLimiter` theo dõi tối đa 10.000 IP; trước đây map trong bộ nhớ có thể tăng không giới hạn khi nhiều IP khác nhau lưu đội trong cùng một phút.

## [0.2.0] - 2026-10-28

### Added

- Trang Tổng quan ở `/` theo bản thiết kế: hero vỏ Pokédex với 13 vùng đất và Pokémon nổi bật, dải 18 hệ, Bốn vùng đất, Vòng tương khắc, Pokémon hôm nay, Xây đội trong 3 bước, biểu đồ số loài 9 thế hệ, Thử tài Trainer, lời kêu gọi cuối trang.
- Trang Chi tiết Pokémon: khung cảnh theo hệ, artwork, chỉ số, lưới phòng thủ 18 hệ, các dạng, chuỗi tiến hóa.
- Trang Bảng tương khắc: ma trận 18 x 18, chọn 1-2 hệ phòng thủ trên URL.
- Trang Bàn Cân Sức Mạnh: hai ô tìm kiếm, radar chồng lớp, bảng từng chỉ số, kết luận.
- Trang Team Builder: 5 slot đồng bộ URL và `localStorage`, điểm đội, heatmap điểm yếu, độ phủ tấn công, radar trung bình, 3 đề xuất, lưu đội và link chia sẻ; trang Đội chia sẻ.
- Ô tìm kiếm Pokémon (combobox) dùng chung, có ở Omni-Dex; radar chỉ số `StatRadar` vẽ bằng SVG.
- Menu điều hướng mobile đóng bằng `Esc` và trả focus về nút Menu.

### Changed

- Omni-Dex chuyển từ `/` sang `/pokedex`; đặc tả lên 1.2 (F07 Trang Tổng quan), lộ trình lên 0.3 (T311, T312).
- `POST /synergy/analyze` nhận 1-6 Pokémon (trước là 1-5), `POST /synergy/recommendations` vẫn nhận 1-5. Team Builder và trang Đội chia sẻ chấm điểm cả slot 6; điểm của đội đã lưu tính trên mọi thành viên. Đặc tả lên 1.3.
- Lộ trình 0.4: bỏ slide và video demo (T406), ngày 14/11 thành buffer; demo chạy trực tiếp theo kịch bản ở `docs/spec.md`, Phần 4.
- Vùng chạm tối thiểu 40 px trên mobile: nút cỡ `sm`, nút đổi kiểu hiển thị, chip lọc ở Omni-Dex, logo header, link GitHub ở footer, link "Mở bảng tương khắc đầy đủ".

- Tinh gọn tài liệu: bảng truy vết của `SPEC.md` chuyển vào `docs/spec.md`, Phần 6 (spec 1.1, không đổi yêu cầu); bảng "muốn làm gì thì xem ở đâu" của `MAP.md` chuyển vào `docs/README.md`, Phần 2.
- `docs/design-system.md` 0.4: Phần 3 trỏ tới `src/styles/index.css` và `src/main.tsx` thay cho bản chép mã nguồn đã lệch.
- Bỏ dòng trạng thái lỗi thời ở `README.md`, `backend/README.md`, `frontend/README.md`, các file `CLAUDE.md`; bỏ danh sách Issue gợi ý đã tạo xong trong `docs/github-setup.md`.

### Fixed

- Team Builder giữ đề xuất đã chọn cho slot 6 trên URL (`six`), reload không còn mất slot 6.
- Slot ở Team Builder và ô Pokémon ở trang So sánh báo "Chưa tải được" khi API lỗi thay vì hiện "Đang tải…" mãi.

### Removed

- `SPEC.md`, `MAP.md`, `AGENTS.md` ở gốc repo.

## [0.1.0] - 2026-10-25

### Added

- Khởi tạo repo: README, LICENSE, CONTRIBUTING, CHANGELOG.
- Cấu hình dự án: `.gitignore`, `.gitattributes`, `.editorconfig`, `.nvmrc`, `.env.example`.
- `docker-compose.yml` với MySQL 8.4 và Adminer (profile `tools`).
- Tài liệu: sản phẩm, đặc tả MVP, kiến trúc, cơ sở dữ liệu, API, lộ trình, thiết lập GitHub, ADR 0001-0004.
- GitHub: mẫu Issue, mẫu Pull Request, Dependabot, workflow CI.
- Tài liệu kế hoạch v0.2: roadmap theo task và ngày, ERD đầy đủ thuộc tính, kiến trúc C4 và sequence diagram, đặc tả API chi tiết.
- Tài liệu mới: `folder-structure.md`, `design-system.md`, `assets.md`, `git-workflow.md`, ADR 0005 (ảnh Pokémon dạng Hybrid).
- Tài liệu điều hướng ở gốc: `MAP.md` (bản đồ dự án), `SPEC.md` (bảng truy vết đặc tả), `PLAN.md` (tiến độ hiện tại).
- Cấu hình AI agent: `CLAUDE.md`, `backend/CLAUDE.md`, `frontend/CLAUDE.md`, `AGENTS.md`, `.claude/settings.json`, slash command `/task`, `/adr`, `/done`.
- Kết quả khảo sát bộ CSV PokéAPI (`data/README.md`, Phần 4).
- Khung backend Spring Boot 4.1.1, Java 25: `GET /api/v1/health`, `GlobalExceptionHandler` trả `ProblemDetail` có `code`, CORS, Swagger UI, profile `dev`/`prod`/`test`, test tích hợp Testcontainers.
- Khung frontend Vite 8, React 19, TypeScript 6.0: Tailwind 4 với design token, React Router 8 (7 route), TanStack Query, `AppLayout`, ESLint, Prettier, Vitest.
- Wireframe low-fi 6 trang, bản 375 px và 1440 px (`docs/wireframes/`).
- Flyway migration V1-V3 tạo 10 bảng MVP; Entity và Repository cho `typechart`, `pokedex`; `FormCategory`, `PokemonTypeConverter`.
- Nạp CSV PokéAPI vào MySQL khi khởi động (`IngestionRunner`, 5 loader JDBC batch, một transaction, bỏ qua khi đã có dữ liệu); CSV mẫu 23 loài cho test; dependency `commons-csv` 1.14.1.
- `GET /api/v1/pokemon`: lọc theo hệ (tối đa 2), thế hệ, BST, tốc độ, dạng; sắp xếp whitelist có khóa phụ `id`; `PageResponse`; 503 `DATA_NOT_READY` khi chưa nạp dữ liệu.
- Script `scripts/download-sprites.sh` và 1342 sprite tự host trong `frontend/public/sprites/pokemon/`, `placeholder.svg`.
- Omni-Dex bản cơ bản: lưới thẻ Pokémon từ API, bộ lọc hệ, thế hệ, dạng, sắp xếp đồng bộ trên URL, phân trang, trạng thái tải, rỗng, lỗi; `http.ts`, `assets.ts`, `pokemonTypes.ts`, `errorMessages.ts`, `formatters.ts`, `TypeBadge`, `PokemonSprite`, `PokemonCard`.
- Omni-Dex theo design-system 0.3: header đỏ, footer, `PageHero` với 15 khung cảnh (ảnh thật cho `grassland`, `stadium`), thẻ nhuộm màu hệ, chip lọc hệ và thế hệ, lọc BST và tốc độ tối thiểu, ngăn kéo bộ lọc trên mobile, chế độ danh sách.
- Dependabot cho Maven (`/backend`) và npm (`/frontend`), gộp bản minor và patch thành một PR mỗi ecosystem.

### Changed

- Đặc tả MVP lên 1.0: chốt hiển thị dạng đặc biệt, trọng số đề xuất cố định 60/25/15, giới hạn 10 lần lưu đội mỗi phút mỗi IP.
- Quy tắc dữ liệu: dạng totem và Pikachu đội mũ xếp `OTHER`; mỗi loài chọn dòng tiến hóa `is_default = 1` có `id` nhỏ nhất.

- Schema dự kiến: thêm `pokemon.form_category`, bỏ `pokemon.sprite_url`; `teams.share_code` dùng collation `utf8mb4_bin`.
- API dự kiến: bỏ `spriteUrl`; response đề xuất đổi sang object `{ candidateCount, items }`; thêm mã lỗi `code`, mã 429 và 503.
- `CONTRIBUTING.md` rút gọn phần quy ước Git, chi tiết chuyển sang `docs/git-workflow.md`.
- `.gitignore`: commit `CLAUDE.md` và `.claude/`; chỉ bỏ qua `CLAUDE.local.md`, `.claude/settings.local.json`, `.mcp.json`.

[Unreleased]: https://github.com/Nha-Cong-Dong/PokeNexus/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/Nha-Cong-Dong/PokeNexus/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/Nha-Cong-Dong/PokeNexus/releases/tag/v0.1.0
