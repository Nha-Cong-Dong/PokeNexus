# PokeNexus - Bảng truy vết đặc tả

- Phiên bản: 0.3 (cập nhật 2026-10-25), khớp [docs/spec.md](docs/spec.md) bản 1.0.
- Nguồn chuẩn của yêu cầu và tiêu chí chấp nhận là [docs/spec.md](docs/spec.md). File này chỉ nối mỗi tính năng với user story, endpoint, trang, package, task và test; không chép tiêu chí.
- Yêu cầu thay đổi thì sửa `docs/spec.md` trước, sau đó cập nhật bảng ở đây.

---

## Phần 1. Ma trận truy vết

### I. Tính năng MVP

| Tính năng | User Story | Tiêu chí | Endpoint | Route, trang | Package backend | Task | MoSCoW |
|---|---|---|---|---|---|---|---|
| F01 Omni-Dex | US-01 | [spec](docs/spec.md) Phần 2, mục I | `GET /pokemon`, `GET /pokemon/search` | `/`, `DexPage` | `pokedex` | T206, T301, T302 | Must |
| F02 Chi tiết Pokémon | US-02 | [spec](docs/spec.md) Phần 2, mục II | `GET /pokemon/{idOrName}` | `/pokemon/:idOrName`, `PokemonDetailPage` | `pokedex`, `typechart` | T303 | Must |
| F03 Bảng tương khắc | US-03 | [spec](docs/spec.md) Phần 2, mục III | `GET /types`, `GET /types/matrix` | `/types`, `TypeChartPage` | `typechart` | T304 | Must |
| F04 Bàn Cân Sức Mạnh | US-04 | [spec](docs/spec.md) Phần 2, mục IV | `GET /pokemon/compare` | `/compare`, `ComparePage` | `pokedex` | T308 | Should |
| F05 Team Builder, Synergy | US-05, US-06 | [spec](docs/spec.md) Phần 2, mục V | `POST /synergy/analyze`, `POST /synergy/recommendations` | `/team-builder`, `TeamBuilderPage` | `synergy` | T305, T306 | Must |
| F06 Lưu và chia sẻ đội | US-07 | [spec](docs/spec.md) Phần 2, mục VI | `POST /teams`, `GET /teams/shared/{shareCode}` | `/team/:shareCode`, `SharedTeamPage` | `team` | T307 | Must |

- Mọi endpoint có tiền tố `/api/v1`. Đặc tả: [docs/api.md](docs/api.md), Phần 2. Route: [docs/architecture.md](docs/architecture.md), Phần 6.
- Class cụ thể của từng package: [docs/folder-structure.md](docs/folder-structure.md), Phần 2, mục II.

### II. Nền tảng phục vụ mọi tính năng

| Hạng mục | Nguồn | Task |
|---|---|---|
| Schema và migration V1-V3 | [docs/database.md](docs/database.md), Phần 5 | T204 |
| Ingestion CSV | [docs/database.md](docs/database.md), Phần 5; [data/README.md](data/README.md) | T102, T205 |
| `GET /health`, xử lý lỗi `ProblemDetail`, CORS, Swagger | [docs/api.md](docs/api.md), Phần 2, mục II và Phần 4 | T202 |
| Khung frontend, token UI | [docs/design-system.md](docs/design-system.md) | T203 |
| Sprite tự host | [docs/assets.md](docs/assets.md), Phần 4 | T207 |
| Trạng thái tải, rỗng, lỗi; responsive; accessibility | [docs/design-system.md](docs/design-system.md), Phần 5, 7 | T309 |

---

## Phần 2. Kiểm chứng

### I. Test có đáp án bắt buộc

| Nguồn đáp án | Loại test | Class test dự kiến | Task |
|---|---|---|---|
| [spec](docs/spec.md) Phần 2, mục V.4, ví dụ 1 và 4 | Unit | `SynergyAnalyzerTest` | T305 |
| [spec](docs/spec.md) Phần 2, mục V.4, ví dụ 2 | Unit | `RecommendationEngineTest` | T305 |
| [spec](docs/spec.md) Phần 2, mục V.4, ví dụ 3 | Unit | `TypeChartServiceTest` | T303, T304 |
| [roadmap](docs/roadmap.md) T205, cột Kiểm tra | Tích hợp | `IngestionRunnerIT` | T205 |
| [roadmap](docs/roadmap.md) T206, cột Kiểm tra | Tích hợp | `PokemonControllerIT` | T206 |
| [roadmap](docs/roadmap.md) T307, cột Kiểm tra | Tích hợp | `TeamControllerIT` | T307 |

- Tên class theo quy ước `<Class>Test`, `<Class>IT` ở [docs/folder-structure.md](docs/folder-structure.md), Phần 2, mục III. Tên chốt khi viết test; đổi tên thì cập nhật bảng này.
- Tầng kiểm thử và phạm vi: [docs/architecture.md](docs/architecture.md), Phần 12.

### II. Yêu cầu phi chức năng

| Yêu cầu | Nguồn | Cách đo | Task |
|---|---|---|---|
| Synergy p95 dưới 50 ms | [spec](docs/spec.md) Phần 3 | `scripts/bench-synergy.sh` | T305, T404 |
| Omni-Dex trang đầu dưới 1 giây (local) | [spec](docs/spec.md) Phần 3 | DevTools Network | T301 |
| Dùng được ở 375 px và 1440 px | [spec](docs/spec.md) Phần 3 | Kiểm tra thủ công 6 trang | T309 |
| Không gọi PokéAPI lúc chạy | [spec](docs/spec.md) Phần 3 | Chạy demo khi tắt mạng (trừ artwork) | T403 |

### III. Kịch bản end-to-end

- [docs/spec.md](docs/spec.md), Phần 4. Chạy trước mỗi tag `v0.2.0`, `v1.0.0`.

---

## Phần 3. Câu hỏi còn mở

### I. Trạng thái

| Câu hỏi | Trạng thái | Hạn chốt |
|---|---|---|
| Hiển thị dạng Mega, Gigantamax trong Omni-Dex | Đã chốt | T201 (2026-10-21) |
| Trọng số chấm điểm đề xuất cố định hay cho chỉnh | Đã chốt | T201 (2026-10-21) |
| Giới hạn số lần lưu đội mỗi IP | Đã chốt | T201 (2026-10-21) |

- Nội dung quyết định: [docs/spec.md](docs/spec.md), Phần 5, mục II. Spec đã lên 1.0; câu hỏi mới phát sinh thì thêm dòng ở đây và tăng phiên bản `docs/spec.md`.
