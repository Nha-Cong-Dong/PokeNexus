# Changelog

Mọi thay đổi đáng chú ý của dự án được ghi lại tại đây.

- Định dạng theo [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
- Phiên bản theo [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Khởi tạo repo: README, LICENSE, CONTRIBUTING, CHANGELOG.
- Cấu hình dự án: `.gitignore`, `.gitattributes`, `.editorconfig`, `.nvmrc`, `.env.example`.
- `docker-compose.yml` với MySQL 8.4 và Adminer (profile `tools`).
- Tài liệu: sản phẩm, đặc tả MVP, kiến trúc, cơ sở dữ liệu, API, lộ trình, thiết lập GitHub, ADR 0001-0004.
- GitHub: mẫu Issue, mẫu Pull Request, Dependabot, workflow CI.
- Tài liệu kế hoạch v0.2: roadmap theo task và ngày, ERD đầy đủ thuộc tính, kiến trúc C4 và sequence diagram, đặc tả API chi tiết.
- Tài liệu mới: `folder-structure.md`, `design-system.md`, `assets.md`, `git-workflow.md`, ADR 0005 (ảnh Pokémon dạng Hybrid).

### Changed

- Schema dự kiến: thêm `pokemon.form_category`, bỏ `pokemon.sprite_url`; `teams.share_code` dùng collation `utf8mb4_bin`.
- API dự kiến: bỏ `spriteUrl`; response đề xuất đổi sang object `{ candidateCount, items }`; thêm mã lỗi `code`, mã 429 và 503.
- `CONTRIBUTING.md` rút gọn phần quy ước Git, chi tiết chuyển sang `docs/git-workflow.md`.
