# Changelog

Mọi thay đổi đáng chú ý của dự án được ghi lại tại đây.

- Định dạng theo [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
- Phiên bản theo [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/Nha-Cong-Dong/PokeNexus/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Nha-Cong-Dong/PokeNexus/releases/tag/v0.1.0
