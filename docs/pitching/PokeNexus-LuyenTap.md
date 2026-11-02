# PokeNexus - Tài liệu luyện tập pitching và hỏi đáp

- Phiên bản: 0.1 (cập nhật 2026-11-02)
- Mục đích: chuẩn bị cho buổi pitching Checkpoint 4 ngày 08/11: hiểu và tự giải thích được từng phần code, luồng dữ liệu, quyết định thiết kế; trả lời câu hỏi chi tiết của giám khảo (T414, Issue #71).
- Trích dẫn `path:line` tính từ gốc repo, khớp nhánh `main` ngày 2026-11-02 sau PR #76 và PR của T414. Code đổi thì chạy lại bước kiểm trích dẫn (mục Kiểm tra trong mô tả PR của T414).
- Cách soạn: Phần 3 đến Phần 7 do 5 agent đọc toàn bộ file trong phạm vi của mình và soạn; script đã kiểm mọi trích dẫn trỏ tới file có thật và dòng nằm trong file. Phần thuật toán Synergy và số liệu đội demo được đối chiếu thêm với code và API chạy thật. Phần 1, 2, 8, 9 soạn sau cùng để nối các phần.
- Kịch bản lời thoại 15 phút sẽ được thêm vào file này ở T406 (Issue #72).

| Phần | Nội dung |
|---|---|
| 1 | Cách dùng tài liệu, lộ trình học 5 ngày |
| 2 | Tổng quan hệ thống, số liệu đội demo, 10 điều phải tự giải thích được |
| 3 | Dữ liệu, hạ tầng và nền tảng backend |
| 4 | Backend nghiệp vụ: Pokédex, Type chart, Synergy, Team |
| 5 | Frontend nền tảng |
| 6 | Frontend các trang tra cứu |
| 7 | Team Builder từ đầu đến cuối |
| 8 | Câu hỏi tổng quát: sản phẩm, quyết định, quy trình, AI, hạn chế |
| 9 | Tra cứu nhanh: phiên bản, giới hạn, số đo, lệnh, mốc |

---

## Phần 1. Cách dùng tài liệu

### I. Đọc ở đâu, trích dẫn tính thế nào

- Đọc trong VS Code: mở file rồi bấm `Ctrl+Shift+V` để xem dạng đã định dạng. File khoảng 600 KB; GitHub có thể cắt phần cuối khi hiển thị file trên 512 KB, nên đọc trên máy là chắc nhất.
- Mọi trích dẫn có dạng `path:line`, tính từ gốc repo, ở commit ghi trong phần đầu file. Muốn xem tận mắt: trong VS Code bấm `Ctrl+P`, dán nguyên `frontend/src/pages/TeamBuilderPage.tsx:61` rồi `Enter`, editor mở đúng dòng đó.
- Phần 3 đến Phần 7 cùng một khung: mục `I.` bức tranh chung, `II.` từng file, `III.` luồng xử lý, `IV.` câu hỏi, `V.` chỗ tài liệu lệch code.
- Cách đọc tham chiếu: "Phần 4, mục II.VII.8" là Phần 4, mục `### II.`, tiểu mục `#### VII.`, đề mục in đậm `8.`.
- Bên trong Phần 3 đến Phần 7, câu "xem Phần k" hoặc "mục VII.8" (không ghi số Phần) chỉ cấu trúc của chính Phần đó: "Phần k" là mục La Mã thứ k ở cấp `###`, "mục VII.8" là tiểu mục `VII.` đề mục `8.` trong mục `II.`.
- Số liệu ghi "suy ra từ code" là tính tay theo đúng công thức trong code; số liệu đội demo ở Phần 2, mục VI đo từ API thật ngày 2026-11-02.

### II. Lộ trình học 5 ngày

| Ngày | Đọc | Tự kiểm tra cuối ngày |
|---|---|---|
| 03/11 | Phần 2 (toàn bộ), Phần 7 (Team Builder), Phần 4, mục II.VII (thuật toán Synergy) | Tự tính lại điểm 20 của đội demo trên giấy; nói được vì sao Rock bị đánh dấu |
| 04/11 | Phần 4 phần còn lại (backend nghiệp vụ), Phần 3 (dữ liệu, hạ tầng, nền backend) | Vẽ lại đường đi của một request `POST /synergy/analyze` từ trình duyệt tới `TeamAnalysis` |
| 05/11 | Phần 5 (frontend nền tảng), Phần 6 (các trang tra cứu) | Giải thích URL `?type=dragon&gen=4` đi qua những file nào |
| 06/11 | Phần 8 và cột câu hỏi của mọi Phần | Che cột trả lời, tự nói 40 câu ngẫu nhiên; hỏi thử 20 câu với Claude |
| 07/11 | Phần 9, các câu trả lời sai hôm trước | Hỏi thử lần 2; mỗi câu trả lời không quá 30 giây |

### III. Mức ưu tiên

- **Bắt buộc nói được bằng lời của mình** (review Checkpoint 3, Issue #70, khuyên đúng điều này): 10 chủ đề ở Phần 2, mục VII.
- **Nên nắm**: các luồng xử lý (mục III của Phần 3 đến Phần 7) và câu hỏi (mục IV).
- **Tra cứu khi bị hỏi sâu**: phần từng file (mục II của Phần 3 đến Phần 7).

### IV. Cách tự luyện

- Che cột "Trả lời mẫu", nói thành tiếng, rồi mở code ở dòng trích dẫn để đối chiếu.
- Trả lời theo khung: làm gì, ở file nào, vì sao làm vậy, giới hạn là gì.
- Không chắc thì nói thật: "Phần này em chưa kiểm chứng; theo code ở `<file>` thì ..., em sẽ kiểm tra lại." Đừng đoán con số.
- Ghi câu chưa trả lời được vào cuối file nháp của bạn để hỏi lại Claude.

---

## Phần 2. Tổng quan hệ thống

### I. Giới thiệu trong 30 giây

- PokeNexus là bách khoa Pokémon kiêm cố vấn xây đội: tra cứu 1.351 dạng Pokémon, so sánh, xem tương khắc, và quan trọng nhất là Team Builder chấm điểm đội 0-100, chỉ ra hệ mà cả đội cùng yếu, rồi đề xuất 3 Pokémon lấp lỗ hổng kèm lý do bằng lời (`docs/product.md`, Phần 1).
- Dữ liệu lấy từ bộ CSV của PokéAPI, nạp một lần vào MySQL; lúc chạy không gọi API bên ngoài (ADR 0002). Phân tích đội tính hoàn toàn trong bộ nhớ nên p95 dưới 10 ms (ADR 0003, `PLAN.md`).
- Không cần đăng nhập: đội được lưu và chia sẻ bằng mã 8 ký tự.

### II. Con số cần thuộc

| Nội dung | Giá trị | Nguồn |
|---|---|---|
| Số dạng Pokémon trong DB | 1.351 (1.025 loài) | `/api/v1/health` trả `pokemonCount: 1351`; `frontend/src/pages/DexPage.tsx:25` |
| Số hệ, thế hệ | 18 hệ, 9 thế hệ | `docs/spec.md` |
| Endpoint | 14 (health, 7 Pokédex, 2 type chart, 2 Synergy, 2 team) | `@GetMapping`, `@PostMapping` trong `backend/src/main/java` |
| Route frontend | 9 (8 trang và trang 404) | `frontend/src/app/router.tsx:25-61` |
| Điểm đội | `100 - 4 x tổng pressure - 8 x số lỗ hổng`, kẹp trong 0-100 | `backend/src/main/java/com/pokenexus/synergy/model/TeamAnalysis.java:49-50` |
| Hiệu năng Synergy | p95 `analyze` 7,2 ms, `recommendations` 8,6 ms (100 request, local) | `PLAN.md`, nhật ký 28/10; `scripts/bench-synergy.sh` |
| Test | Backend 137 unit và 56 IT; frontend 338 | Lần chạy ngày 02/11 (PR #69, #76) |
| Quy mô code | Backend 93 file Java (khoảng 4.750 dòng); frontend 154 file TS/TSX (khoảng 15.000 dòng, chưa tính test) | Đếm ngày 02/11 |
| Lịch sử | 38 PR đã merge, 49 commit trên `main` (02/11, sau PR #76); tag `v0.1.0`, `v0.2.0` | `gh pr list`, `git tag` |

### III. Kiến trúc

```mermaid
flowchart LR
    U["Trình duyệt"] -->|HTTPS| FE["React SPA<br/>Cloudflare Pages"]
    FE -->|"REST /api/v1, JSON"| BE["Spring Boot 4.1<br/>Railway, Docker"]
    FE -->|"ảnh artwork"| GH["raw.githubusercontent.com<br/>PokeAPI/sprites"]
    BE -->|"JDBC"| DB[("MySQL 8.4")]
    BE --> MEM["Bộ nhớ: bảng tương khắc 18 x 18,<br/>hồ sơ 1.351 Pokémon"]
    CSV["CSV PokéAPI<br/>data/csv"] -.->|"ingestion ở máy dev"| DB
```

- **Frontend** (`frontend/src`): React 19, TypeScript, Vite; mỗi trang là một chunk tải lười; dữ liệu server qua TanStack Query; bộ lọc, cặp so sánh, đội nháp nằm trên URL. Chi tiết: Phần 5.
- **Backend** (`backend/src/main/java/com/pokenexus`): chia package theo tính năng `pokedex`, `typechart`, `synergy`, `team`, cùng `ingestion` (nạp CSV) và `common` (cấu hình, lỗi, filter). Chi tiết: Phần 3, Phần 4.
- **Database**: MySQL 8.4, schema do Flyway tạo từ 3 migration V1-V3 (`backend/src/main/resources/db/migration`).
- **Synergy chạy trong bộ nhớ**: khi khởi động, backend dựng sẵn bảng tương khắc và hồ sơ phòng thủ, tấn công của từng Pokémon; `analyze` và `recommendations` không truy vấn DB (ADR 0003).
- **Ảnh**: backend không trả URL ảnh; frontend tự sinh URL từ ID: sprite nhỏ lấy từ `frontend/public/sprites`, artwork lớn lấy từ kho GitHub của PokéAPI (`frontend/src/lib/assets.ts:3-17`, ADR 0005).
- **Triển khai**: Railway chạy backend (Docker) và MySQL, Cloudflare Pages chạy frontend (ADR 0007; các bước ở `docs/architecture.md`, Phần 11).

### IV. Dữ liệu đi từ đâu tới đâu

1. Ở máy dev, `scripts/download-csv.sh` tải 12 file CSV của PokéAPI, cố định ở một commit (`data/README.md`).
2. Lần đầu backend chạy trên DB rỗng, `ingestion` đọc CSV và ghi vào MySQL (Phần 3, mục II.VI, II.VII).
3. Production không chạy ingestion: `scripts/db-dump.sh export` xuất dữ liệu, `import` nạp vào MySQL trên Railway (Phần 3, mục III.V).
4. Khi khởi động, các registry trong bộ nhớ đọc DB một lần (Phần 4, mục II.VI).
5. Request tra cứu (Pokédex, chi tiết) đọc DB qua JPA; request Synergy chỉ đọc bộ nhớ.
6. Frontend nhận JSON, cache bằng TanStack Query, tự ghép URL ảnh.

### V. Bản đồ trang, endpoint và Phần chi tiết

| Trang | Route | Endpoint chính | Đọc ở |
|---|---|---|---|
| Tổng quan | `/` | `GET /pokemon/{id}`, `GET /pokemon/generations`, `GET /types/matrix` | Phần 6, mục II.I |
| Pokédex | `/pokedex` | `GET /pokemon?...&size=24`, `GET /pokemon/search` (ô tìm) | Phần 6, mục II.II |
| Chi tiết | `/pokemon/:idOrName` | `GET /pokemon/{idOrName}`, `GET /pokemon/{id}/evolution`, `GET /pokemon/speed-tiers` | Phần 6, mục II.III, II.IV |
| So sánh | `/compare` | `GET /pokemon/compare` và 2 lần `GET /pokemon/{id}` | Phần 6, mục II.V |
| Bảng tương khắc | `/types` | `GET /types/matrix` | Phần 6, mục II.VI |
| Địa hình | `/terrain/:terrainId?` | 1-2 lần `GET /pokemon?type=<hệ>&size=100` | Phần 6, mục II.VII |
| Team Builder | `/team-builder` | `POST /synergy/analyze`, `POST /synergy/recommendations`, `POST /teams` | Phần 7 |
| Đội chia sẻ | `/team/:shareCode` | `GET /teams/shared/{shareCode}`, `POST /synergy/analyze` | Phần 7 |

- Endpoint chính xác của từng trang (query key, điều kiện gọi) ghi ở Phần 6 và Phần 7; bảng trên chỉ để định hướng.

### VI. Số liệu thật của đội demo

Đo ngày 2026-11-02 trên backend local, MySQL Docker có 1.351 Pokémon, nhánh đã merge vào `main` ở PR #69.

| Bước demo | Kết quả API |
|---|---|
| Đội Charizard (6), Gyarados (130), Dragonite (149), Talonflame (663), Volcarona (637) | `teamScore` 20; hàng Rock: hệ số `[4, 2, 2, 4, 4]`, 5 yếu, 0 kháng, pressure 8, lỗ hổng nghiêm trọng |
| Đề xuất, lối chơi Cân bằng, ô "Loại huyền thoại..." tắt (mặc định, `frontend/src/pages/TeamBuilderPage.tsx:61`) | 596 ứng viên; 1. Iron Treads 84,6; 2. Great Tusk 83,5; 3. Sandy Shocks 82,2 (cả 3 là Paradox) |
| Lý do đầu của Iron Treads | "Kháng hệ Rock (x0,25): đội đang có 5 thành viên yếu, chưa ai kháng" |
| Thêm Iron Treads | `teamScore` 48; Rock pressure 7, hết lỗ hổng; "Độ phủ tấn công rộng: đánh siêu hiệu quả 14/18 hệ" |
| Bật ô "Loại huyền thoại, thần thoại và Paradox" | 484 ứng viên; 1. Excadrill 85,1; 2. Rhyperior 78,9; 3. Magnezone 77,5; thêm Excadrill cũng ra 48 |

- Khi demo nên bật ô loại huyền thoại để đề xuất số 1 là Excadrill, quen thuộc hơn Iron Treads. Điểm 20 lên 48 khớp ví dụ 5 của spec và test `raisesTheScoreWhenTheSixthMemberResistsRock` (Phần 4, mục II.VII.8).
- `docs/api.md` lấy ví dụ `teamScore` 41.0: đó chỉ là ví dụ minh họa, khi bị hỏi hãy nói số thật là 20.

### VII. Mười điều phải tự giải thích được

**A. Điểm đội tính thế nào**

- Mỗi thành viên nhận một điểm phòng thủ cho từng hệ tấn công: miễn nhiễm +3, x0,25 +2, x0,5 +1, x1 0, x2 -1, x4 -2 (`DefenseScale.java`).
- Với mỗi hệ: `weakness` là tổng mức yếu, `resistCount` là số người kháng; `pressure = max(0, weakness - resistCount)`; lỗ hổng nghiêm trọng khi `weakness >= 2` và không ai kháng.
- `teamScore = 100 - 4 x tổng pressure - 8 x số lỗ hổng`, kẹp 0-100. Chi tiết và ví dụ tính tay: Phần 4, mục II.VII.2 và II.VII.9.

**B. Đề xuất xếp hạng thế nào**

- Lọc ứng viên (dạng thường hoặc dạng vùng, đã tiến hóa hết, không trùng đội, theo lối chơi), rồi chấm 4 thành phần: phòng thủ (kháng đúng hệ đội đang hở thì được thưởng theo pressure), độ phủ thêm, vai trò chỉ số, BST.
- Chuẩn hóa min-max trên tập ứng viên, nhân trọng số của lối chơi (Cân bằng 0,40 / 0,20 / 0,25 / 0,15), lấy top và bỏ ứng viên trùng tổ hợp hệ. Phần 4, mục II.VII.5, II.VII.6.

**C. Vì sao dữ liệu offline từ CSV**: không phụ thuộc giới hạn tốc độ và độ trễ của PokéAPI, dữ liệu cố định phiên bản, demo chạy được khi mạng yếu (ADR 0002; Phần 3).

**D. Vì sao Synergy chạy trong bộ nhớ**: dữ liệu tĩnh, nhỏ (khoảng 0,8 MB); mỗi lần đề xuất duyệt khoảng 1.300 ứng viên x 18 hệ, làm trên RAM nhanh hơn nhiều so với truy vấn SQL (ADR 0003; Phần 4, mục II.VI).

**E. Trạng thái nằm ở đâu**: bộ lọc, cặp so sánh, đội nháp trên URL để chia sẻ được; đội nháp cũng lưu `localStorage`; dữ liệu server trong cache TanStack Query; không dùng thư viện state toàn cục (Phần 5, Phần 7).

**F. Ảnh lấy từ đâu**: frontend sinh URL từ ID; sprite tự host, artwork từ GitHub của PokéAPI; ảnh lỗi thì hiện ảnh thay thế (ADR 0005; Phần 5).

**G. Bảo vệ API**: Bean Validation cho mọi request; body tối đa 16 KB (`RequestBodyLimitFilter`); lưu đội tối đa 10 lần mỗi phút mỗi IP; CORS chỉ cho domain frontend; ô tìm chỉ nhận `[a-z0-9-]` (Phần 3, Phần 4).

**H. Lỗi trả về thế nào**: mọi lỗi thành `ProblemDetail` có `code` (ví dụ `VALIDATION_FAILED`, `RATE_LIMITED`, `DATA_NOT_READY`); frontend dịch `code` sang câu tiếng Việt ở `frontend/src/lib/errorMessages.ts`, không hiện `detail` (Phần 3, mục II.IV; Phần 5).

**I. Kiểm thử**: unit test cho thuật toán bám 5 ví dụ có đáp án của spec; integration test chạy MySQL thật bằng Testcontainers; frontend test bằng Vitest và Testing Library; CI chạy cả hai trên mỗi PR (Phần 3, mục II.X; Phần 5, mục II.X).

**J. Triển khai**: backend đóng gói bằng Dockerfile multi-stage, chạy user không phải root; dữ liệu nhập bằng dump; frontend build trên Cloudflare Pages với `VITE_API_BASE_URL`; build dừng nếu biến này thiếu hoặc không phải `https://` (Phần 3, mục II.IX; Phần 5, mục II.I).

---

## Phần 3. Dữ liệu, hạ tầng và nền tảng backend

- Phạm vi: `data/` (README, cấu trúc thư mục, header và số dòng CSV); `backend/src/main/java/com/pokenexus/PokeNexusApplication.java`; `backend/src/main/java/com/pokenexus/common/**`; `backend/src/main/java/com/pokenexus/ingestion/**`; `backend/src/main/resources/**`; `backend/pom.xml`, `backend/Dockerfile`, `backend/.dockerignore`, `backend/.mvn/wrapper/maven-wrapper.properties`; test của các package trên, hạ tầng test dùng chung và `backend/src/test/resources/**`; `docker-compose.yml`, `.env.example`, `scripts/*`, `.github/**`.
- Trạng thái mã: đọc ở commit `3fbfb8f` (nhánh `fix/51-bug-bash`), đã squash vào `main` thành `c6e0eb1` (PR #69) ngày 2026-11-02; số dòng đã dời theo `main` sau PR #76.
- "Đếm lại" nghĩa là đếm trên `data/csv/` bằng `wc`, `awk` ngày 2026-11-02; không chạy build, test hay ứng dụng.

### I. Bức tranh chung

```mermaid
flowchart LR
    subgraph Root["Gốc repo"]
        ENV[".env / .env.example"]
        DC["docker-compose.yml"]
        SCR["scripts/*"]
        CI[".github/workflows/ci.yml"]
    end
    subgraph Data["data/"]
        CSV["data/csv: 12 file CSV PokeAPI"]
        DUMP["data/dumps/pokenexus.sql"]
    end
    subgraph Res["src/main/resources"]
        YML["application.yml, -dev, -prod"]
        MIG["db/migration V1, V2, V3"]
    end
    APP["PokeNexusApplication"]
    subgraph Common["common"]
        CFG["config: AppProperties, CorsConfig, OpenApiConfig"]
        DOM["domain: PokemonType, StatType, FormCategory, PokemonTypeConverter"]
        EXC["exception: ErrorCode, ApiException, NotFoundException, RateLimitedException, GlobalExceptionHandler"]
        WEB["web: HealthController, HealthService, HealthResponse, PageRequestFactory, PageResponse, RequestBodyLimitFilter, StaticDataCache"]
    end
    subgraph Ing["ingestion"]
        IR["IngestionRunner"]
        CR["CsvReader"]
        FCR["FormCategoryResolver"]
        LD["loader: Type, Generation, Species, Pokemon, Evolution"]
    end
    FEAT["pokedex, typechart, synergy, team"]
    DB[("MySQL 8.4")]

    ENV --> YML
    YML --> CFG
    APP --> Common
    APP --> Ing
    MIG -->|Flyway| DB
    IR --> CFG
    IR --> LD
    LD --> CR
    LD --> FCR
    LD --> DOM
    FCR --> DOM
    CR -->|đọc| CSV
    LD -->|JdbcTemplate batch| DB
    WEB --> EXC
    WEB -->|COUNT pokemon| DB
    FEAT --> WEB
    FEAT --> EXC
    FEAT --> DOM
    FEAT --> CFG
    DC --> DB
    DC -->|mount chỉ đọc| CSV
    SCR -->|download-csv| CSV
    SCR -->|db-dump export| DUMP
    DUMP -->|db-dump import| DB
    CI -->|mvnw verify| APP
```

- `PokeNexusApplication` là điểm vào duy nhất; `@SpringBootApplication` quét mọi bean trong `com.pokenexus` (`PokeNexusApplication.java:6`), gồm loader, filter, controller advice.
- `common` là tầng nền: không import package tính năng nào. Import nội bộ duy nhất là `common.exception` từ `common.web` (`RequestBodyLimitFilter.java:21-22`, `PageRequestFactory.java:8-9`).
- `HealthService` cần biết cache của `typechart` và `synergy` đã nạp chưa nhưng không phụ thuộc chúng: nó chỉ biết interface `StaticDataCache`, còn `TypeChartService.java:25` và `PokemonProfileRegistry.java:24` cài đặt interface đó (đảo ngược phụ thuộc).
- `ingestion` chỉ dùng `common.config` và `common.domain`; ghi DB bằng `JdbcTemplate.batchUpdate`, không đi qua JPA Entity hay Repository của package khác.
- Schema do Flyway sở hữu (`application.yml:16-17`); Hibernate chỉ kiểm tra khớp schema (`application.yml:14`). Dữ liệu tĩnh do `IngestionRunner` nạp, dữ liệu đội do API ghi (`docs/database.md:294`).
- Runtime không gọi PokéAPI: CSV được tải trước bằng script, nạp một lần vào MySQL (ADR 0002 ở `docs/adr/0002-offline-data-from-csv.md:14-15`, `download-csv.sh:6-8`). Production không nạp CSV mà nhập file dump (`application-prod.yml:11`, `docs/architecture.md:462`).
- Mọi lỗi thống nhất: code ném `ApiException` kèm `ErrorCode`; lỗi khung Spring và lỗi bất ngờ đều qua `GlobalExceptionHandler`, trả `ProblemDetail` có thuộc tính `code`.
- Hạ tầng: `docker-compose.yml` dựng MySQL (luôn), backend (profile Compose `app`), Adminer (profile `tools`); `backend/Dockerfile` đóng gói cho Railway; `scripts/` tải dữ liệu, xuất nhập dump, đo hiệu năng; CI chạy `mvnw verify` và build frontend.
- Mọi thuộc tính `app.*` đi qua một record `AppProperties` (`AppProperties.java:8`); biến môi trường và file `../.env` cung cấp giá trị cho placeholder trong `application.yml`.

### II. Từng file

#### I. Điểm vào ứng dụng

**1. `PokeNexusApplication` (`backend/src/main/java/com/pokenexus/PokeNexusApplication.java`)**

- **Vai trò:** class `main` khởi động Spring Boot.
- **Thành phần chính:** `main(String[] args)` gọi `SpringApplication.run(PokeNexusApplication.class, args)` (`PokeNexusApplication.java:9-11`). `@SpringBootApplication` (`:6`) bật auto-configuration và component scan từ package `com.pokenexus`.
- **Phụ thuộc:** không phụ thuộc class dự án. Được dùng bởi `TestPokeNexusApplication.java:8` (chạy app với Testcontainers) và Dockerfile (jar thực thi).
- **Dữ liệu:** không trực tiếp; cấu hình đến từ `application*.yml`.
- **Biên và lỗi:** `AppProperties` không được bật ở đây mà ở `CorsConfig.java:10`.
- **Test:** gián tiếp qua mọi `@SpringBootTest` (`PokeNexusApplicationIT`, `SchemaMigrationIT`, `IngestionRunnerIT`, `IngestionRollbackIT`).

#### II. `common.config`

**1. `AppProperties` (`backend/src/main/java/com/pokenexus/common/config/AppProperties.java`)**

- **Vai trò:** record `@ConfigurationProperties(prefix = "app")` gom mọi thuộc tính riêng của dự án, thay cho `@Value` rải rác (`backend/CLAUDE.md:50`).
- **Thành phần chính:**
  - `Ingestion(enabled, csvDir)`: mặc định `false`, `"../data/csv"` (`AppProperties.java:14-17`).
  - `Cors(allowedOrigins)`: mặc định `["http://localhost:5173"]` (`:19-21`).
  - `Team(saveLimitPerMinute)`: mặc định `10` (`:23-25`).
  - `@DefaultValue` trên ba record con (`:10-12`) bảo đảm không bao giờ `null` dù YAML thiếu cả nhóm.
- **Phụ thuộc:** được bật bởi `@EnableConfigurationProperties(AppProperties.class)` ở `CorsConfig.java:10`. Dùng bởi `CorsConfig.java:24`, `IngestionRunner.java:53,62`, `SaveRateLimiter.java:29-30`.
- **Dữ liệu:** `app.ingestion.enabled`, `app.ingestion.csv-dir`, `app.cors.allowed-origins`, `app.team.save-limit-per-minute` (`application.yml:22-29`). Biến môi trường `APP_INGESTION_CSVDIR` (`docker-compose.yml:45`) và `CORS_ALLOWED_ORIGINS` (`application.yml:27`) đổ vào đây.
- **Biên và lỗi:** `SaveRateLimiter.java:34-35` ném `IllegalArgumentException` lúc khởi động nếu giới hạn nhỏ hơn 1. Danh sách origin nhận chuỗi phân tách dấu phẩy (Spring Boot tự chuyển `String` sang `List<String>`).
- **Test:** không có test riêng; `CorsConfigTest` và `IngestionRunnerIT` dùng gián tiếp.

**2. `CorsConfig` (`backend/src/main/java/com/pokenexus/common/config/CorsConfig.java`)**

- **Vai trò:** cấu hình CORS cho mọi đường dẫn `/api/**`.
- **Thành phần chính:** `addCorsMappings(CorsRegistry)` (`CorsConfig.java:21-29`):
  - Mapping `/api/**` (`:23`); origin lấy từ `AppProperties.cors().allowedOrigins()` (`:24`).
  - Method `GET`, `POST`, `OPTIONS` (`:25`); header request `*` (`:26`).
  - Expose `Location` và `Retry-After` (`:27`): JavaScript ở frontend chỉ đọc được hai header này khi chúng được expose; `Location` có ở 201 lưu đội (`TeamController.java:43`), `Retry-After` có ở 429 (`GlobalExceptionHandler.java:41-43`).
  - `maxAge` 3600 giây (`:13,28`): trình duyệt cache kết quả preflight 1 giờ.
- **Phụ thuộc:** `AppProperties`; implements `WebMvcConfigurer`.
- **Dữ liệu:** `app.cors.allowed-origins` = `${CORS_ALLOWED_ORIGINS:http://localhost:5173}` (`application.yml:27`).
- **Biên và lỗi:** origin lạ gửi preflight nhận 403 và không có `Access-Control-Allow-Origin` (`CorsConfigTest.java:36-43`). Không bật `allowCredentials`. Không có `PUT`, `DELETE` vì API không có endpoint dạng đó. Swagger (`/v3/api-docs`) nằm ngoài `/api/**` nên không có CORS.
- **Test:** `CorsConfigTest` (`@WebMvcTest(HealthController.class)`): origin `http://localhost:5173` được phép (`:26-33`), `http://evil.example` bị 403 (`:36-43`).

**3. `OpenApiConfig` (`backend/src/main/java/com/pokenexus/common/config/OpenApiConfig.java`)**

- **Vai trò:** khai báo metadata cho tài liệu OpenAPI do springdoc sinh.
- **Thành phần chính:** bean `pokeNexusOpenApi()` trả `OpenAPI` với title `PokeNexus API`, version `v1`, mô tả nguồn PokéAPI CSV, license MIT (`OpenApiConfig.java:12-19`).
- **Phụ thuộc:** `springdoc-openapi-starter-webmvc-ui` (`pom.xml:44-48`). Controller bổ sung `@Tag`, `@Operation` (ví dụ `HealthController.java:13,23`).
- **Dữ liệu:** `springdoc.paths-to-match: /api/**`, Swagger UI ở `/swagger-ui.html` (`application.yml:31-35`).
- **Biên và lỗi:** chỉ đường dẫn `/api/**` xuất hiện trong tài liệu.
- **Test:** `PokeNexusApplicationIT.java:43-49` (`/v3/api-docs` chứa `PokeNexus API` và `/api/v1/health`), `:52-56` (`/swagger-ui.html` chuyển hướng 3xx sang `/swagger-ui/index.html`).

#### III. `common.domain`

**1. `PokemonType` (`backend/src/main/java/com/pokenexus/common/domain/PokemonType.java`)**

- **Vai trò:** enum 18 hệ chuẩn, ID trùng ID của PokéAPI.
- **Thành phần chính:**
  - 18 hằng `NORMAL(1)` đến `FAIRY(18)` (`PokemonType.java:7-24`); `COUNT = 18` (`:26`).
  - `id()` (`:42-44`); `index()` = `id - 1` để làm chỉ số mảng 18 x 18 (`:46-48`); `identifier()` = tên chữ thường (`:50-52`).
  - `fromId(int)`: tra mảng `BY_ID` dựng sẵn trong khối `static` (`:28-34`), O(1), trả `Optional.empty()` khi ngoài 1-18 (`:54-59`).
  - `fromIdentifier(String)`: so khớp chính xác, phân biệt hoa thường (`:61-68`).
- **Phụ thuộc:** dùng bởi `TypeLoader.java:14,49`, `PokemonLoader.java:74`, `PokemonTypeConverter`, `PokemonFilter.java:47`, `CompareService.java:107`, `TypeChartService`.
- **Dữ liệu:** khớp `types.id` (V1); hệ 19 `stellar`, 10001, 10002 trong CSV bị loại vì `fromId` trả rỗng.
- **Biên và lỗi:** `fromIdentifier("Fire")` và `fromIdentifier(null)` trả rỗng (`PokemonTypeTest.java:31-33`).
- **Test:** `PokemonTypeTest`: đủ 18 hệ, ID liên tục 1-18 (`:12-16`); tra theo ID, tên, `ROCK.index() = 5` (`:19-24`); loại 0, 19, 10001, `stellar` (`:27-34`).

**2. `StatType` (`backend/src/main/java/com/pokenexus/common/domain/StatType.java`)**

- **Vai trò:** enum 6 chỉ số gốc, ánh xạ `stat_id` 1-6 của `pokemon_stats.csv`.
- **Thành phần chính:** `HP(1,"hp")` đến `SPEED(6,"speed")` (`StatType.java:7-12`); `csvId()`, `identifier()`; `fromCsvId(int)` duyệt tuyến tính, trả rỗng ngoài 1-6 (`:30-34`).
- **Phụ thuộc:** `PokemonLoader.java:34,46,57-62,90`.
- **Dữ liệu:** thay cho việc đọc `stats.csv`: ID 1-6 được mã hóa cứng (xem Phần 5).
- **Biên và lỗi:** `stat_id` 7 (accuracy), 8 (evasion) không thuộc enum; `PokemonLoader.java:90-91` biến điều đó thành lỗi nạp.
- **Test:** `StatTypeTest`: 1, 4, 6 ra đúng enum, `SPECIAL_DEFENSE.identifier()` là `special-defense` (`:10-15`); 0, 7, 9 rỗng (`:18-22`).

**3. `FormCategory` (`backend/src/main/java/com/pokenexus/common/domain/FormCategory.java`)**

- **Vai trò:** enum phân loại dạng Pokémon và quy tắc "dạng nào hiện mặc định".
- **Thành phần chính:** `DEFAULT, REGIONAL, MEGA, GMAX, OTHER` (`FormCategory.java:9-13`); `SHOWN_BY_DEFAULT = {DEFAULT, REGIONAL}` (`:15`); `isShownByDefault()` (`:17-19`); `fromName(String)` so khớp chính xác tên enum (`:21-28`).
- **Phụ thuộc:** `FormCategoryResolver` (lúc nạp); `PokemonFilter.java:58,62` (bộ lọc Omni-Dex mặc định và tham số `form`); `RecommendationEngine.java:102` (tập ứng viên đề xuất); `Pokemon.java:42-44` ánh xạ `@Enumerated(EnumType.STRING)`.
- **Dữ liệu:** cột `pokemon.form_category` `VARCHAR(10)` có `CHECK` 5 giá trị (`backend/src/main/resources/db/migration/V2__create_pokedex_tables.sql:25,50`).
- **Biên và lỗi:** `fromName("mega")` trả rỗng, nên tham số `form=mega` bị `PokemonFilter` báo `INVALID_PARAMETER`.
- **Test:** `FormCategoryTest`: chỉ `DEFAULT`, `REGIONAL` hiện mặc định (`:12-15`); tên chính xác, chữ thường và `null` trả rỗng (`:18-22`).

**4. `PokemonTypeConverter` (`backend/src/main/java/com/pokenexus/common/domain/PokemonTypeConverter.java`)**

- **Vai trò:** JPA `AttributeConverter` giữa `PokemonType` và cột ID hệ kiểu số.
- **Thành phần chính:** `convertToDatabaseColumn` trả `type.id()` hoặc `null` (`PokemonTypeConverter.java:10-12`); `convertToEntityAttribute` trả enum hoặc `null`, ném `IllegalArgumentException("Unknown type id: ...")` khi ID lạ (`:15-21`).
- **Phụ thuộc:** `@Converter` không bật `autoApply`, nên Entity phải gắn tường minh: `Pokemon.java:49,53`.
- **Dữ liệu:** `pokemon.primary_type_id`, `pokemon.secondary_type_id` (`null` khi đơn hệ).
- **Biên và lỗi:** ID ngoài 1-18 trong DB sẽ thành lỗi 500 khi đọc Entity; thực tế không xảy ra vì khóa ngoại tới `types` và `TypeLoader` chỉ nạp 1-18.
- **Test:** `PokemonTypeConverterTest`: 10 và `FIRE`, 18 và `FAIRY` (`:13-16`); `null` giữ `null` (`:19-22`); 19 ném lỗi có chữ "19" (`:25-29`).

#### IV. `common.exception`

**1. `ErrorCode` (`backend/src/main/java/com/pokenexus/common/exception/ErrorCode.java`)**

- **Vai trò:** danh mục 13 mã lỗi nghiệp vụ, mỗi mã gắn một `HttpStatus` (`ErrorCode.java:6-18`); `status()` (`:26-28`).
- **Phụ thuộc:** `ApiException`, `GlobalExceptionHandler`, mọi Service ném lỗi.
- **Dữ liệu:** giá trị `name()` thành thuộc tính `code` của `ProblemDetail` (`GlobalExceptionHandler.java:39,70`).
- **Biên và lỗi:** `PAYLOAD_TOO_LARGE` dùng `HttpStatus.CONTENT_TOO_LARGE` (413) của Spring Framework 7 (`:15`).
- **Test:** gián tiếp qua `GlobalExceptionHandlerTest`, `NotFoundExceptionTest`, `RequestBodyLimitFilterTest`.

| `code` | HTTP | Ném ở đâu | Khi nào |
|---|---|---|---|
| `VALIDATION_FAILED` | 400 | `GlobalExceptionHandler.java:82-84`; `SynergyAnalyzer.java:47,51` | `@Valid @RequestBody` vi phạm Bean Validation (có mảng `errors`); `HandlerMethodValidationException` trên tham số `@RequestBody`; danh sách ID rỗng, quá dài hoặc chứa `null` ở tầng Service |
| `INVALID_PARAMETER` | 400 (hoặc mã gốc 4xx) | `PageRequestFactory.java:57`, `PokemonFilter.java:74`, `CompareService.java:124`, `PokemonQueryService.java:146`, `TeamService.java:92`; dự phòng `GlobalExceptionHandler.java:98` | Tham số query, path sai; `page`, `size`, `sort` ngoài giới hạn; mọi lỗi khung 4xx khác 404 (ví dụ 405, 415, sai kiểu tham số, `@Max` trên `@RequestParam`) giữ mã HTTP gốc |
| `MALFORMED_JSON` | 400 | `GlobalExceptionHandler.java:85` | `HttpMessageNotReadableException`: JSON hỏng, giá trị enum lạ (ví dụ `playStyle`, `docs/api.md:148`) |
| `DUPLICATE_POKEMON` | 400 | `SynergyAnalyzer.java:55`, `TeamService.java:70` | Cùng một ID Pokémon xuất hiện hai lần |
| `DUPLICATE_SLOT` | 400 | `TeamService.java:68` | Hai thành viên trùng `slot` |
| `UNKNOWN_POKEMON` | 400 | `SynergyAnalyzer.java:64`, `TeamService.java:78` | ID trong body không tồn tại |
| `POKEMON_NOT_FOUND` | 404 | `PokemonQueryService.java:82` (qua `NotFoundException`) | `idOrName` trên đường dẫn không tồn tại |
| `TEAM_NOT_FOUND` | 404 | `TeamService.java:95` (qua `NotFoundException`) | `shareCode` hợp lệ nhưng không có đội |
| `ROUTE_NOT_FOUND` | 404 | `GlobalExceptionHandler.java:86,95-96` | `NoResourceFoundException`, `NoHandlerFoundException` hoặc mọi 404 khung khác |
| `PAYLOAD_TOO_LARGE` | 413 | `RequestBodyLimitFilter.java:106` | Body `POST`, `PUT`, `PATCH` vượt 16.384 byte, khi Controller bắt đầu đọc body |
| `RATE_LIMITED` | 429 | `RateLimitedException.java:8`, ném ở `SaveRateLimiter.java:50,57` | Quá 10 lần lưu đội mỗi phút mỗi IP, hoặc đã theo dõi đủ 10.000 IP và IP mới đến |
| `DATA_NOT_READY` | 503 | `PokemonQueryService.java:141`, `SpeedTierService.java:41`, `GenerationProfileService.java:52`, `TypeChartService.java:134`, `PokemonProfileRegistry.java:92` | Bảng `pokemon` rỗng hoặc cache trong bộ nhớ chưa nạp được |
| `INTERNAL_ERROR` | 500 | `GlobalExceptionHandler.java:52,93` | Exception không lường trước, hoặc lỗi khung 5xx |

**2. `ApiException` (`backend/src/main/java/com/pokenexus/common/exception/ApiException.java`)**

- **Vai trò:** `RuntimeException` gốc của mọi lỗi nghiệp vụ, mang một `ErrorCode`.
- **Thành phần chính:** constructor `(ErrorCode, String detail)`; `detail` thành `getMessage()` (`ApiException.java:7-10`); `errorCode()` (`:12-14`).
- **Phụ thuộc:** Service của mọi package và `PageRequestFactory`, `RequestBodyLimitFilter`. Bắt ở `GlobalExceptionHandler.java:34`.
- **Dữ liệu:** không.
- **Biên và lỗi:** unchecked nên ném xuyên tầng không cần khai báo `throws`; khi ném trong method `@Transactional` thì transaction rollback (mặc định Spring rollback với `RuntimeException`).
- **Test:** gián tiếp (`GlobalExceptionHandlerTest`, `PageRequestFactoryTest`, `RequestBodyLimitFilterTest`).

**3. `NotFoundException` (`backend/src/main/java/com/pokenexus/common/exception/NotFoundException.java`)**

- **Vai trò:** `ApiException` chỉ chấp nhận mã có status 404.
- **Thành phần chính:** constructor gọi `requireNotFound` (`NotFoundException.java:5-7`); mã `null` hoặc khác 404 ném `IllegalArgumentException` (`:9-14`).
- **Phụ thuộc:** `PokemonQueryService.java:82`, `TeamService.java:95`.
- **Dữ liệu:** không.
- **Biên và lỗi:** chặn lỗi lập trình kiểu "NotFound mà trả 400" ngay lúc tạo exception.
- **Test:** `NotFoundExceptionTest`: giữ mã và detail (`:11-16`); `VALIDATION_FAILED` (`:19-22`) và `null` (`:25-28`) bị từ chối.

**4. `RateLimitedException` (`backend/src/main/java/com/pokenexus/common/exception/RateLimitedException.java`)**

- **Vai trò:** `ApiException` mã `RATE_LIMITED` kèm số giây chờ.
- **Thành phần chính:** constructor `(detail, retryAfterSeconds)`, ép tối thiểu 1 giây bằng `Math.max(1, ...)` (`RateLimitedException.java:7-10`); `retryAfterSeconds()` (`:12-14`).
- **Phụ thuộc:** ném ở `SaveRateLimiter.java:50,57`; `GlobalExceptionHandler.java:41-43` thêm header `Retry-After`.
- **Dữ liệu:** không.
- **Biên và lỗi:** không bao giờ trả `Retry-After: 0`.
- **Test:** không có test riêng; `TeamControllerIT.java:163` kiểm `Retry-After` trong khoảng 1-60.

**5. `GlobalExceptionHandler` (`backend/src/main/java/com/pokenexus/common/exception/GlobalExceptionHandler.java`)**

- **Vai trò:** `@RestControllerAdvice` kế thừa `ResponseEntityExceptionHandler`, biến mọi exception thành `ProblemDetail` (RFC 9457) có thêm `code` (`GlobalExceptionHandler.java:26-27`).
- **Thành phần chính:**
  - Hằng `CODE_PROPERTY = "code"`, `ERRORS_PROPERTY = "errors"` (`:29-30`).
  - `handleApiException`: log `DEBUG` (`:37`), `ProblemDetail.forStatusAndDetail(status, message)` (`:38`), gắn `code` (`:39`), thêm `Retry-After` nếu là `RateLimitedException` (`:41-43`).
  - `handleUnexpected(Exception)`: log `ERROR` kèm stack trace (`:49`), trả 500 với detail cố định `Unexpected server error` và `code = INTERNAL_ERROR` (`:50-53`); không lộ message gốc.
  - `handleMethodArgumentNotValid`: đặt detail `Request validation failed` và mảng `errors` gồm `FieldViolation(field, message)` (`:56-63`, `:106-112`, `:118`); lỗi cấp object dùng `objectName` làm `field` (`:109-110`); message `null` thay bằng `invalid value` (`:114-116`).
  - `handleExceptionInternal`: điểm chung của mọi lỗi khung Spring; gắn `code` theo `resolveCode` (`:69-71`), log `ERROR` nếu 5xx, `DEBUG` nếu 4xx (`:72-76`).
  - `resolveCode` dùng `switch` theo kiểu, có guard `when` và unnamed pattern `_` (chuẩn từ Java 22) (`:80-89`); `fallbackCode`: 5xx thành `INTERNAL_ERROR`, 404 thành `ROUTE_NOT_FOUND`, còn lại `INVALID_PARAMETER` (`:91-99`).
  - `isRequestBody` phân biệt lỗi validation trên body và trên tham số (`:101-104`).
- **Phụ thuộc:** `ErrorCode`, `ApiException`, `RateLimitedException`; Spring MVC.
- **Dữ liệu:** không; `instance` do Spring tự điền bằng URI request (`GlobalExceptionHandlerTest.java:39`).
- **Biên và lỗi:**
  - `@ExceptionHandler` cụ thể của lớp cha thắng `Exception.class`, nên lỗi khung không rơi vào `handleUnexpected`.
  - `ApiException` mã 5xx (`DATA_NOT_READY`) chỉ log `DEBUG` (`:37`); mức log `com.pokenexus` là `INFO` (`application.yml:40`) nên log `DEBUG` không hiện (xem Phần 5).
  - Vi phạm `CHECK` của MySQL qua JDBC là `UncategorizedSQLException` (`backend/CLAUDE.md:53`), không có handler riêng nên thành 500.
- **Test:** `GlobalExceptionHandlerTest` với `ProbeController` nội bộ (`:113-136`): 404 có đủ `status`, `title`, `detail`, `instance`, `code` và content type `application/problem+json` (`:29-43`); body sai ràng buộc thành `VALIDATION_FAILED` có `errors[].field = name` (`:46-59`); JSON cụt thành `MALFORMED_JSON` (`:62-70`); `size=abc` (`:73-79`) và `size=101` vượt `@Max(100)` (`:82-88`) thành `INVALID_PARAMETER`; route lạ thành `ROUTE_NOT_FOUND` (`:91-97`); lỗi 500 không chứa `secret-connection-string` hay tên exception (`:100-108`). Thêm `HealthControllerTest.java:49-56` (405 thành `INVALID_PARAMETER`).

#### V. `common.web`

**1. `HealthController` (`backend/src/main/java/com/pokenexus/common/web/HealthController.java`)**

- **Vai trò:** endpoint `GET /api/v1/health` (`HealthController.java:12,22`).
- **Thành phần chính:** `health()` gọi `HealthService.check()`; status `DOWN` thành 503, còn lại 200 (`:24-30`).
- **Phụ thuộc:** `HealthService`, `HealthResponse`. Được Railway dùng làm Healthcheck Path (`docs/architecture.md:489`).
- **Dữ liệu:** JSON `{status, dataLoaded, pokemonCount}`.
- **Biên và lỗi:** `UP` với `dataLoaded = false` vẫn trả 200; chỉ mất DB mới trả 503. `POST` vào endpoint này trả 405 `INVALID_PARAMETER`.
- **Test:** `HealthControllerTest` (`@WebMvcTest`, `HealthService` mock): 200 với 1351 (`:23-33`), 503 khi `DOWN` (`:36-46`), 405 dạng problem (`:49-56`). `PokeNexusApplicationIT.java:25-32`: DB rỗng trả `UP`, `false`, `0`.

**2. `HealthService` (`backend/src/main/java/com/pokenexus/common/web/HealthService.java`)**

- **Vai trò:** quyết định trạng thái sống của backend và dữ liệu đã sẵn sàng chưa.
- **Thành phần chính:**
  - Constructor nhận `JdbcTemplate` và `List<StaticDataCache>` (mọi bean cài interface), copy bất biến (`HealthService.java:21-24`).
  - `check()`: đếm `SELECT COUNT(*) FROM pokemon` (`:16,29`); `DataAccessException` thành `HealthResponse.down()` và log `WARN` (`:30-33`); ngược lại `dataLoaded = pokemonCount > 0 && cachesLoaded()` (`:34`).
  - `cachesLoaded()`: mọi cache phải nạp (`:37-44`); `isLoaded(cache)` thử `cache.isLoaded() || cache.reload()`, nuốt `RuntimeException` và trả `false` (`:46-53`).
  - `countPokemon()`: `BadSqlGrammarException` (bảng chưa tồn tại) thành 0 thay vì `DOWN` (`:55-63`).
- **Phụ thuộc:** `TypeChartService`, `PokemonProfileRegistry` qua interface. Dùng bởi `HealthController`.
- **Dữ liệu:** bảng `pokemon`; ở prod `spring.datasource.hikari.connection-timeout: 5000` nên mất DB thì sau khoảng 5 giây trả `DOWN` (`application-prod.yml:7`, `docs/adr/0007-hosting-railway-cloudflare-pages.md:42`).
- **Biên và lỗi:**
  - Phép `&&` ngắn mạch: bảng rỗng thì không gọi `reload()` (`HealthServiceTest.java:69-76`).
  - Health có tác dụng phụ: cache chưa nạp mà DB đã có dữ liệu thì health nạp lại (tự phục hồi khi khởi động lúc DB rỗng rồi nhập dump sau).
- **Test:** `HealthServiceTest` (Mockito): có dữ liệu và cache nạp (`:40-47`); cache rỗng được `reload` (`:50-57`); `reload` thất bại cho `dataLoaded = false` (`:60-66`); bảng rỗng không reload (`:69-76`); bảng chưa tồn tại vẫn `UP` (`:79-87`); mất kết nối thành `DOWN` và không chạm cache (`:90-99`). `IngestionRunnerIT.java:105-108`: sau nạp mẫu trả `up(62)`.

**3. `HealthResponse` (`backend/src/main/java/com/pokenexus/common/web/HealthResponse.java`)**

- **Vai trò:** DTO record `(status, dataLoaded, pokemonCount)` (`HealthResponse.java:3`).
- **Thành phần chính:** hằng `UP`, `DOWN` (`:5-6`); `up(count)` với `dataLoaded = count > 0` (`:8-10`); `of(count, dataLoaded)` (`:12-14`); `down()` = `DOWN, false, 0` (`:16-18`).
- **Phụ thuộc:** `HealthService`, `HealthController`, test.
- **Dữ liệu:** không.
- **Biên và lỗi:** `up()` chỉ dùng trong test; code chạy thật dùng `of()` vì còn xét cache.
- **Test:** gián tiếp ở `HealthServiceTest`, `HealthControllerTest`, `IngestionRunnerIT.java:106`.

**4. `PageRequestFactory` (`backend/src/main/java/com/pokenexus/common/web/PageRequestFactory.java`)**

- **Vai trò:** dựng `PageRequest` an toàn từ `page`, `size`, `sort` của query string, có whitelist.
- **Thành phần chính:**
  - Hằng `DEFAULT_SIZE = 24`, `MAX_SIZE = 100`, `TIE_BREAKER = "id"` (`PageRequestFactory.java:13-15`).
  - `of(page, size, sort, allowedProperties)` (`:20-34`): mặc định trang 0, cỡ 24; `page < 0` lỗi (`:23-25`); `size` ngoài 1-100 lỗi (`:26-28`); `page > Integer.MAX_VALUE / size` lỗi (`:29-32`) để offset `page * size` không tràn `int` (với `size = 24` giới hạn là 89.478.485).
  - `parseSort` (`:36-54`): rỗng thì sắp theo `id` (`:37-39`); thuộc tính ngoài whitelist lỗi (`:42-44`); hướng `asc`, `desc` (`:46-48`); quá 2 phần lỗi (`:49-51`); luôn thêm `id` làm tiêu chí phụ để thứ tự trang ổn định (`:53`).
- **Phụ thuộc:** `PokemonController.java:73` truyền `PokemonQueryService.SORTABLE_PROPERTIES` = `id`, `name`, `baseStatTotal`, `speed` (`PokemonQueryService.java:38`).
- **Dữ liệu:** không.
- **Biên và lỗi:** mọi lỗi là `ApiException(INVALID_PARAMETER)` (`:56-58`); `sort=speed,` (hướng rỗng) bị từ chối do `fromOptionalString` trả rỗng. Whitelist chặn sắp xếp theo cột tùy ý (`docs/architecture.md:378`).
- **Test:** `PageRequestFactoryTest`: mặc định (`:20-26`); thêm `id` làm tiêu chí phụ (`:29-36`); `page = 100.000.000` bị chặn, `89.478.485` hợp lệ (`:39-46`); `size` 101, 0, `page = -1`, `weight`, `up` đều lỗi (`:49-59`).

**5. `PageResponse` (`backend/src/main/java/com/pokenexus/common/web/PageResponse.java`)**

- **Vai trò:** DTO record phân trang `(content, page, size, totalElements, totalPages)` (`PageResponse.java:8`), không lộ kiểu `Page` của Spring Data ra JSON.
- **Thành phần chính:** `from(Page<E>, Function<E,T>)` map nội dung bằng mapper (`:10-17`).
- **Phụ thuộc:** `PokemonQueryService.java:62-67` (`pokemonMapper::toSummary`).
- **Dữ liệu:** không.
- **Biên và lỗi:** không có.
- **Test:** không có test riêng; được kiểm qua `PokemonControllerIT` (ngoài phạm vi chương này).

**6. `RequestBodyLimitFilter` (`backend/src/main/java/com/pokenexus/common/web/RequestBodyLimitFilter.java`)**

- **Vai trò:** servlet filter giới hạn body `POST`, `PUT`, `PATCH` ở 16 KB, kể cả request không gửi `Content-Length`.
- **Thành phần chính:**
  - `MAX_BODY_BYTES = 16 * 1024` = 16.384 byte (`RequestBodyLimitFilter.java:27`); `BODY_METHODS` (`:29`); `shouldNotFilter` bỏ qua method khác (`:32-34`).
  - `doFilterInternal` (`:37-45`): nếu `Content-Length` khai báo không vượt giới hạn (hoặc là `-1` do chunked) thì đọc tối đa 16.385 byte bằng `readNBytes` (`:40-41`); đọc được hơn 16.384 byte thì coi như quá lớn (`:42`). Nếu `Content-Length` khai báo vượt giới hạn thì không đọc gì. Sau đó chuyển `LimitedBodyRequest` xuống chuỗi filter (`:44`).
  - `LimitedBodyRequest` (`:47-111`): `getInputStream()` trả stream trên mảng byte đã đọc (`:57-85`); `getReader()` theo charset của request, mặc định UTF-8 (`:88-92`); `getContentLength()`, `getContentLengthLong()` trả độ dài thật (`:95-102`); `requireBody()` ném `ApiException(PAYLOAD_TOO_LARGE)` khi body quá lớn (`:104-110`).
- **Phụ thuộc:** `@Component` nên Spring Boot tự đăng ký cho mọi URL. Dùng `ApiException`, `ErrorCode`.
- **Dữ liệu:** không.
- **Biên và lỗi:**
  - Lỗi ném "lười": filter không trả 413 ngay; exception xuất hiện khi Controller đọc body bên trong `DispatcherServlet`, nên đi qua `GlobalExceptionHandler` và có cùng định dạng `ProblemDetail`. Lý do thiết kế này không được ghi trong tài liệu (suy ra từ code).
  - Endpoint không đọc body thì không bao giờ có 413.
  - Bộ nhớ mỗi request bị chặn ở 16.385 byte; body hợp lệ lớn nhất (lưu đội 6 thành viên) dưới 1 KB (`docs/architecture.md:374`).
  - Đọc bất đồng bộ (`setReadListener`) không hỗ trợ (`:80-83`).
  - Filter không khai báo `@Order`; thứ tự so với filter khác của Spring Boot chưa xác định từ code.
- **Test:** `RequestBodyLimitFilterTest`: chunked 16.385 byte bị từ chối ở cả `getInputStream` và `getReader` (`:22-29`); `Content-Length` lớn bị từ chối mà không đọc (`:32-39`); body nhỏ và body đúng 16.384 byte đi qua nguyên vẹn (`:42-50`); `GET` giữ nguyên request gốc (`:53-57`). Đầu-cuối: `SynergyControllerTest.java:181-190` gửi body khoảng 20 KB, nhận 413 `PAYLOAD_TOO_LARGE`, `SynergyAnalyzer` không bị gọi.

**7. `StaticDataCache` (`backend/src/main/java/com/pokenexus/common/web/StaticDataCache.java`)**

- **Vai trò:** interface cho cache nạp dữ liệu tĩnh vào RAM: `isLoaded()`, `reload()` (`StaticDataCache.java:3-8`).
- **Thành phần chính:** `reload()` trả `true` nếu sau khi gọi cache đã nạp.
- **Phụ thuộc:** cài đặt bởi `TypeChartService.java:25` (ma trận 18 x 18, `reload` ở `:58`), `PokemonProfileRegistry.java:24` (hồ sơ mọi Pokémon, `reload` ở `:53`). Dùng bởi `HealthService`.
- **Dữ liệu:** gián tiếp `type_efficacy`, `pokemon`.
- **Biên và lỗi:** hai cache tự nạp khi nhận `ApplicationReadyEvent` (`TypeChartService.java:42-49`, `PokemonProfileRegistry.java:38-45`), nuốt lỗi và thử lại khi cần.
- **Test:** mock trong `HealthServiceTest.java:29-30`.

#### VI. `ingestion`

**1. `IngestionRunner` (`backend/src/main/java/com/pokenexus/ingestion/IngestionRunner.java`)**

- **Vai trò:** `ApplicationRunner` nạp 12 file CSV vào 8 bảng tĩnh khi ứng dụng khởi động.
- **Thành phần chính:**
  - `@Component`, `@Order(0)` (`IngestionRunner.java:21-22,25`).
  - `run(args)` (`:52-63`): tắt thì log và thoát (`:53-56`); `pokemon` đã có dòng thì log "skipped" và thoát (`:57-61`); còn lại gọi `ingest(Path.of(csvDir))` (`:62`).
  - `ingest(Path)` (public để test gọi trực tiếp) (`:65-83`): tạo `CsvReader` (`:66`); chạy 5 loader trong một `TransactionTemplate.execute` theo thứ tự Type, Generation, Species, Pokemon, Evolution (`:71-76`); lỗi thì log `ERROR` "rolled back" và ném lại (`:77-80`); thành công thì log thời gian và số dòng (`:81-82`).
  - `countPokemon()` (`:85-88`).
- **Phụ thuộc:** `AppProperties`, `JdbcTemplate`, `TransactionTemplate`, 5 loader.
- **Dữ liệu:** đọc `app.ingestion.enabled`, `app.ingestion.csv-dir`; ghi `types`, `type_efficacy`, `regions`, `generations`, `evolution_chains`, `species`, `pokemon`, `evolution_links`.
- **Biên và lỗi:**
  - Idempotent chỉ dựa trên bảng `pokemon`: rỗng thì nạp, có dòng thì bỏ qua.
  - Một transaction duy nhất: lỗi ở bất kỳ loader nào làm rollback cả các bảng đã ghi trước đó (`IngestionRollbackIT`).
  - Exception ném ra khỏi `ApplicationRunner` làm Spring Boot dừng khởi động, nên ứng dụng không chạy với dữ liệu nửa vời.
  - Đường dẫn CSV tương đối tính theo thư mục làm việc: chạy từ `backend/` thì `../data/csv` trỏ đúng; chạy từ chỗ khác thì `CsvReader` báo "CSV file not found".
  - Log thành công in `counts[0]` là số hệ (18), không phải số dòng `type_efficacy`; số `regions`, `evolution_chains` không được log.
  - Thời gian nạp thực tế: chưa xác định từ code (chỉ được log lúc chạy).
- **Test:** `IngestionRunnerIT`, `IngestionRollbackIT` (mục X).

**2. `CsvReader` (`backend/src/main/java/com/pokenexus/ingestion/CsvReader.java`)**

- **Vai trò:** đọc file CSV theo tên cột bằng Apache Commons CSV, kèm thông báo lỗi chỉ rõ file, dòng, cột.
- **Thành phần chính:**
  - `FORMAT`: `CSVFormat.DEFAULT`, dòng đầu là header, bỏ qua header, `trim` giá trị (`CsvReader.java:18-22`).
  - `read(fileName)`: kiểm tra file tồn tại, ném `IllegalStateException("CSV file not found: <đường dẫn tuyệt đối>")` (`:30-34`); đọc UTF-8, trả `List<Row>` (`:35-41`); lỗi IO bọc thành `IllegalStateException` (`:42-44`).
  - Record `Row(fileName, csvRecord)` (`:47`): `line()` = số record + 1 vì có header (`:49-51`); `text` (không rỗng) (`:53-59`); `integer` (`:61-68`); `optionalInteger` (rỗng thành `null`) (`:70-72`); `flag` (chỉ `0`, `1`) (`:74-80`); `error(column, problem)` tạo message `"<file> line <n>, column '<col>': <vấn đề>"` (`:82-85`); `value` báo lỗi khi thiếu cột (`:87-92`).
- **Phụ thuộc:** `commons-csv` 1.14.1 (`pom.xml:55-59`). Dùng bởi 5 loader.
- **Dữ liệu:** thư mục `app.ingestion.csv-dir`.
- **Biên và lỗi:** đọc theo tên cột nên thêm, đổi thứ tự cột trong nguồn không làm hỏng; thiếu cột là lỗi rõ ràng. Commons CSV xử lý đúng trường có dấu ngoặc kép và dấu phẩy (`docs/architecture.md:57`). Đọc toàn bộ file vào RAM (file lớn nhất 8.106 dòng).
- **Test:** `CsvReaderTest` (`@TempDir`): đọc theo tên cột, giá trị rỗng thành `null`, `line()` = 3 cho record thứ hai (`:20-35`); file thiếu (`:38-43`); message chính xác `pokemon_stats.csv line 3, column 'base_stat': 'abc' is not an integer`, cột thiếu, cờ không phải 0 hoặc 1 (`:46-60`).

**3. `FormCategoryResolver` (`backend/src/main/java/com/pokenexus/ingestion/FormCategoryResolver.java`)**

- **Vai trò:** suy ra `form_category` từ tên dạng và cờ `is_default`.
- **Thành phần chính:** `resolve(name, isDefault)`, áp dụng theo thứ tự, dừng ở quy tắc đầu tiên khớp (`FormCategoryResolver.java:14-31`):
  - `isDefault` thành `DEFAULT` (`:15-17`).
  - Chứa `-totem` hoặc kết thúc `-cap` thành `OTHER` (`:18-20`).
  - Chứa `-alola`, `-galar`, `-hisui`, `-paldea` thành `REGIONAL` (`:9,21-23`).
  - Chứa `-mega` thành `MEGA` (`:24-26`); kết thúc `-gmax` thành `GMAX` (`:27-29`); còn lại `OTHER` (`:30`).
- **Phụ thuộc:** `FormCategory`; dùng ở `PokemonLoader.java:53`.
- **Dữ liệu:** cột `pokemon.form_category`.
- **Biên và lỗi:** quy tắc totem, cap đứng trước regional để `raticate-totem-alola`, `pikachu-alola-cap` không thành dạng vùng (`docs/database.md:45`). Primal (`kyogre-primal`) là `OTHER`. Kết quả với bộ CSV thật (đếm lại, khớp `data/README.md:91`): `DEFAULT` 1025, `REGIONAL` 58, `MEGA` 97, `GMAX` 34, `OTHER` 137.
- **Test:** `FormCategoryResolverTest`: 8 trường hợp cơ bản (`:12-25`); totem và cap trước regional (`:27-35`).

#### VII. `ingestion.loader`

Các loader đều là `@Component`, nhận `CsvReader`, ghi bằng `JdbcTemplate.batchUpdate` với tham số bind, và trả số dòng chính đã ghi.

| Bước | Loader | File CSV đọc | Bảng ghi | Cột CSV dùng |
|---|---|---|---|---|
| 1 | `TypeLoader` | `types.csv`, `type_efficacy.csv` | `types`, `type_efficacy` | `id`, `identifier`; `damage_type_id`, `target_type_id`, `damage_factor` |
| 2 | `GenerationLoader` | `regions.csv`, `generations.csv` | `regions`, `generations` | `id`, `identifier`; `id`, `identifier`, `main_region_id` |
| 3 | `SpeciesLoader` | `evolution_chains.csv`, `pokemon_species.csv` | `evolution_chains`, `species` | `id`; `id`, `identifier`, `generation_id`, `evolution_chain_id`, `evolves_from_species_id`, `is_legendary`, `is_mythical` |
| 4 | `PokemonLoader` | `pokemon_types.csv`, `pokemon_stats.csv`, `pokemon.csv` | `pokemon` | `pokemon_id`, `type_id`, `slot`; `pokemon_id`, `stat_id`, `base_stat`; `id`, `identifier`, `species_id`, `is_default`, `height`, `weight` |
| 5 | `EvolutionLoader` | `evolution_triggers.csv`, `pokemon_species.csv`, `pokemon_evolution.csv` | `evolution_links` | `id`, `identifier`; `id`, `evolves_from_species_id`, `evolution_chain_id`; `id`, `evolved_species_id`, `evolution_trigger_id`, `is_default`, `minimum_level` |

- Thứ tự theo khóa ngoại: `type_efficacy` và `pokemon` cần `types` (`backend/src/main/resources/db/migration/V1__create_reference_tables.sql:13-14`, `backend/src/main/resources/db/migration/V2__create_pokedex_tables.sql:48-49`); `generations` cần `regions` (`backend/src/main/resources/db/migration/V1__create_reference_tables.sql:31`); `species` cần `generations`, `evolution_chains` (`backend/src/main/resources/db/migration/V2__create_pokedex_tables.sql:17-18`); `pokemon`, `evolution_links` cần `species` (`backend/src/main/resources/db/migration/V2__create_pokedex_tables.sql:47,65-67`).
- `stats.csv` không được đọc ở đâu (xem Phần 5).

**1. `TypeLoader` (`backend/src/main/java/com/pokenexus/ingestion/loader/TypeLoader.java`)**

- **Vai trò:** nạp 18 hệ và ma trận tương khắc 324 ô.
- **Thành phần chính:** `EFFICACY_ROWS = 18 * 18 = 324` (`TypeLoader.java:14`). `load` (`:22-46`): lọc `id` 1-18 (`:23-26`); số hệ khác 18 thì ném lỗi (`:27-30`); chèn `types` (`:31`); lọc dòng có cả hai hệ trong 1-18 (`:33-37`); khác 324 dòng thì ném lỗi (`:38-41`); chèn `type_efficacy` (`:42-44`); trả 18 (`:45`).
- **Phụ thuộc:** `PokemonType.fromId` (`:48-50`).
- **Dữ liệu:** `types.csv` có 21 dòng (loại `stellar` 19, `unknown` 10001, `shadow` 10002, `data/README.md:76`); `damage_factor` giữ dạng phần trăm 0, 50, 100, 200.
- **Biên và lỗi:** message chỉ nêu file, không nêu dòng. `damage_factor` lạ bị `CHECK` của DB chặn (`backend/src/main/resources/db/migration/V1__create_reference_tables.sql:15`).
- **Test:** `IngestionRunnerIT.java:40-47` (18 hệ, 324 dòng, Rock đánh Fire = 200).

**2. `GenerationLoader` (`backend/src/main/java/com/pokenexus/ingestion/loader/GenerationLoader.java`)**

- **Vai trò:** nạp vùng và thế hệ.
- **Thành phần chính:** chèn `regions(id, name)` (`GenerationLoader.java:20-23`), rồi `generations(id, name, region_id)` lấy `region_id` từ `main_region_id` (`:25-28`); trả số thế hệ (`:29`).
- **Phụ thuộc:** `CsvReader`.
- **Dữ liệu:** 11 vùng, 9 thế hệ (`data/README.md:78-79`).
- **Biên và lỗi:** vùng chưa gắn thế hệ nào vẫn được nạp; `main_region_id` lạ bị khóa ngoại chặn.
- **Test:** gián tiếp ở `IngestionRunnerIT`.

**3. `SpeciesLoader` (`backend/src/main/java/com/pokenexus/ingestion/loader/SpeciesLoader.java`)**

- **Vai trò:** nạp chuỗi tiến hóa và loài, tính `is_fully_evolved`.
- **Thành phần chính:** chèn `evolution_chains(id)` (`SpeciesLoader.java:23-26`); gom tập ID có xuất hiện ở `evolves_from_species_id` (`:28-32`); chèn `species` với `is_fully_evolved = !preEvolutionIds.contains(id)` (`:33-46`); trả số loài (`:47`).
- **Phụ thuộc:** `CsvReader`.
- **Dữ liệu:** 540 chuỗi, 1025 loài; 568 loài đã tiến hóa hoàn toàn, 71 huyền thoại, 23 thần thoại (đếm lại, khớp `data/README.md:80-81`). `baby_trigger_item_id` bị bỏ qua.
- **Biên và lỗi:** `evolution_chain_id` cho phép rỗng (`optionalInteger`, `:38`); trên bộ thật không loài nào rỗng (đếm lại). Loài có nhánh (Eevee) là chưa tiến hóa hoàn toàn vì có loài khác tiến hóa từ nó.
- **Test:** `IngestionRunnerIT.java:75-81` (12 loài fully evolved trên CSV mẫu; Charmander `false`, Charizard `true`, Mewtwo huyền thoại, Mew thần thoại).

**4. `PokemonLoader` (`backend/src/main/java/com/pokenexus/ingestion/loader/PokemonLoader.java`)**

- **Vai trò:** dựng bản ghi `pokemon` từ 3 file: dạng, hệ, chỉ số.
- **Thành phần chính:**
  - `readTypes` (`PokemonLoader.java:70-84`): hệ phải thuộc 1-18 (`:74-76`), `slot` phải là 1 hoặc 2 (`:77-80`); gom thành mảng `[primary, secondary]` theo `pokemon_id` (`:81`).
  - `readStats` (`:86-96`): `stat_id` phải thuộc 1-6 (`:90-91`); gom thành `EnumMap<StatType, Integer>`.
  - `load` (`:32-68`): mỗi dòng `pokemon.csv` phải có hệ chính (`:42-44`) và đủ 6 chỉ số (`:45-48`); tính `form_category` (`:53`); `height` vào `height_dm`, `weight` vào `weight_hg` (`:63-64`); một lần `batchUpdate` (`:66`).
  - Câu `INSERT` không có `base_stat_total` vì DB tự tính (`:20-24`).
- **Phụ thuộc:** `PokemonType`, `StatType`, `FormCategoryResolver`.
- **Dữ liệu:** 1351 dạng, 1025 mặc định, ID lớn nhất 10326 (`data/README.md:82`, đếm lại). Không lọc dạng nào lúc nạp; việc ẩn Mega, Gmax làm lúc truy vấn (`FormCategory.SHOWN_BY_DEFAULT`). `base_experience`, `order` bị bỏ qua.
- **Biên và lỗi:** dòng chỉ số trùng `(pokemon_id, stat_id)` bị ghi đè trong `EnumMap`, không bị phát hiện. Giá trị cực đại trên bộ thật (đếm lại): chỉ số gốc 255 (đúng giới hạn `TINYINT UNSIGNED`), cao 1000 dm, nặng 10000 hg, tên dài nhất 27 ký tự.
- **Test:** `IngestionRunnerIT.java:50-58` (Charizard Fire/Flying, 78/84/78/109/85/100, BST 534, nặng 905); `:61-72` (đủ 5 nhóm form trên CSV mẫu: 23, 5, 9, 3, 22); `IngestionRollbackIT` (lỗi ở `pokemon_stats.csv`).

**5. `EvolutionLoader` (`backend/src/main/java/com/pokenexus/ingestion/loader/EvolutionLoader.java`)**

- **Vai trò:** nạp cạnh tiến hóa "từ loài A thành loài B", mỗi loài đích một cạnh.
- **Thành phần chính:**
  - Map `trigger id -> identifier` (`EvolutionLoader.java:23-26`); map `species id -> Row` (`:28-31`).
  - Chọn dòng: bỏ dòng `is_default = 0` (`:35-37`); với mỗi `evolved_species_id` giữ dòng có `id` nhỏ nhất (`:38-39`); `TreeMap` để thứ tự chèn ổn định theo ID loài (`:33`).
  - `toLink` (`:52-69`): loài đích phải có trong `pokemon_species.csv` (`:55-57`); loài gốc lấy từ `evolves_from_species_id` của loài đích, thiếu thì lỗi (`:58-61`); trigger phải tồn tại (`:62-66`); `chain_id` lấy từ loài đích (`:67-68`).
  - `INSERT` đặt `item_name` là `NULL` (`:45-48`).
- **Phụ thuộc:** `CsvReader`.
- **Dữ liệu:** bộ thật có 676 dòng, 641 dòng `is_default = 1`, 484 loài đích khác nhau, nên `evolution_links` có 484 dòng (đếm lại); 48 loài có nhiều dòng mặc định (`data/README.md:86`). `trigger_item_id` không được đọc vì không có `items.csv` (`docs/database.md:309`).
- **Biên và lỗi:** `UNIQUE (to_species_id)` ở DB bảo đảm lần nữa mỗi loài một cạnh (`backend/src/main/resources/db/migration/V2__create_pokedex_tables.sql:63`). Điều kiện tiến hóa khác (giờ, thân thiết, địa điểm) bị bỏ qua.
- **Test:** `IngestionRunnerIT.java:84-92` (13 cạnh trên CSV mẫu; Charmeleon thành Charizard `level-up` 36, `item_name` null; Pikachu thành Raichu `use-item`).

#### VIII. `src/main/resources`

**1. `application.yml` (`backend/src/main/resources/application.yml`)**

- **Vai trò:** cấu hình gốc, áp dụng cho mọi profile.
- **Thành phần chính:**
  - `spring.config.import: optional:file:../.env[.properties]` (`application.yml:5`): đọc file `.env` ở gốc repo như file properties khi chạy từ `backend/`; `optional:` nên thiếu file không lỗi.
  - `spring.profiles.default: dev` (`:7`): không có profile nào được kích hoạt thì `dev` có hiệu lực.
  - Datasource `jdbc:mysql://${DB_HOST:localhost}:${DB_PORT:3306}/${DB_NAME:pokenexus}`, user, password (`:8-11`).
  - `ddl-auto: validate`, `open-in-view: false` (`:14-15`); Flyway đọc `classpath:db/migration` (`:17`).
  - `server.port: ${BACKEND_PORT:8080}` (`:20`).
  - `app.*`: ingestion tắt, `csv-dir ../data/csv`, CORS, giới hạn lưu 10 (`:22-29`).
  - springdoc chỉ `/api/**`, Swagger UI bật ở `/swagger-ui.html` (`:31-35`).
  - Log: `root WARN`, `com.pokenexus INFO`, `org.springframework.boot.web INFO` (`:37-41`). Lý do giữ `INFO` cho `org.springframework.boot.web`: chưa xác định từ code.
- **Phụ thuộc:** `.env` (máy dev), biến môi trường (Docker, Railway).
- **Dữ liệu:** `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, `BACKEND_PORT`, `CORS_ALLOWED_ORIGINS`.
- **Biên và lỗi:** mật khẩu mặc định rỗng; máy dev thật dùng cổng 3307 qua `.env` (`CLAUDE.local.md`). `validate` làm ứng dụng không khởi động nếu Entity lệch schema.
- **Test:** gián tiếp qua mọi `@SpringBootTest`.

**2. So sánh profile**

| Thuộc tính | Gốc (`application.yml`) | `dev` (`application-dev.yml`) | `prod` (`application-prod.yml`) | `test` (`application-test.yml`) |
|---|---|---|---|---|
| Kích hoạt khi | Luôn | Không có profile nào active (`application.yml:7`), hoặc `SPRING_PROFILES_ACTIVE=dev` (`docker-compose.yml:38`) | `SPRING_PROFILES_ACTIVE=prod` trên Railway (`docs/architecture.md:494`) | `@ActiveProfiles("test")` trong test |
| `app.ingestion.enabled` | `false` (`:24`) | `true` (`:3`) | `false` (`:11`) | `false` (`:3`); riêng `IngestionRunnerIT` ghi đè `true` |
| `app.ingestion.csv-dir` | `../data/csv` (`:25`) | `../data/csv` (`:4`) | Kế thừa | `src/test/resources/csv` (`:4`) |
| `app.cors.allowed-origins` | `${CORS_ALLOWED_ORIGINS:http://localhost:5173}` | Kế thừa | Kế thừa, Railway đặt domain Pages | `http://localhost:5173` (`:6`) |
| `server.forward-headers-strategy` | Không đặt | Không đặt | `framework` (`:2`) | Không đặt |
| `spring.datasource.hikari.connection-timeout` | Không đặt (Hikari mặc định 30 s theo `docs/architecture.md:435`) | Không đặt | `5000` ms (`:7`) | Không đặt; Testcontainers thay datasource |

**3. `application-dev.yml` (`backend/src/main/resources/application-dev.yml`)**

- **Vai trò:** bật ingestion cho máy dev và Docker Compose local.
- **Thành phần chính:** `app.ingestion.enabled: true`, `csv-dir: ../data/csv` (`application-dev.yml:1-4`).
- **Phụ thuộc:** `IngestionRunner`.
- **Dữ liệu:** trong container, `APP_INGESTION_CSVDIR=/data/csv` ghi đè `csv-dir` (`docker-compose.yml:45`), vì biến môi trường ưu tiên hơn file YAML.
- **Biên và lỗi:** image Docker không đặt profile, nên nếu quên `SPRING_PROFILES_ACTIVE=prod` thì `dev` có hiệu lực: DB rỗng sẽ thử đọc `../data/csv` không tồn tại và dừng khởi động.
- **Test:** không có test riêng.

**4. `application-prod.yml` (`backend/src/main/resources/application-prod.yml`)**

- **Vai trò:** cấu hình chạy sau reverse proxy của Railway.
- **Thành phần chính:**
  - `server.forward-headers-strategy: framework` (`application-prod.yml:2`): Spring Boot đăng ký `ForwardedHeaderFilter`, filter này thay `getRemoteAddr()`, scheme, host bằng giá trị trong header `Forwarded` hoặc `X-Forwarded-*`. `TeamController.java:41` dùng `getRemoteAddr()` làm khóa giới hạn lưu đội, nên phải bật để mỗi người dùng có IP riêng thay vì cùng IP của proxy.
  - Hikari `connection-timeout: 5000` (`:7`): `/health` trả 503 sau khoảng 5 s khi mất DB thay vì 30 s.
  - Ingestion tắt (`:11`): production chỉ nhập dump.
- **Phụ thuộc:** `SaveRateLimiter`, `HealthService`.
- **Dữ liệu:** không có placeholder riêng.
- **Biên và lỗi:** tin header forwarded có rủi ro bị giả mạo nếu proxy không ghi đè; dự án chấp nhận vì chỉ là chống spam cơ bản và có kế hoạch kiểm chứng với cả `X-Forwarded-For` lẫn `Forwarded` (`docs/architecture.md:382,522-523`, `docs/adr/0007-hosting-railway-cloudflare-pages.md:41`). Không bật ở `dev` vì local không có proxy.
- **Test:** không có test tự động; kiểm chứng thủ công sau deploy.

**5. `backend/src/main/resources/db/migration/V1__create_reference_tables.sql` (`backend/src/main/resources/db/migration/V1__create_reference_tables.sql`)**

- **Vai trò:** tạo 4 bảng tham chiếu.
- **Thành phần chính:**
  - `types(id TINYINT UNSIGNED PK, name VARCHAR(20) NOT NULL)`, `uk_types_name` (`:1-6`).
  - `type_efficacy(attacking_type_id, defending_type_id, damage_factor)` đều `TINYINT UNSIGNED`; PK ghép hai hệ (`:12`) nên mỗi cặp hệ chỉ một dòng; hai FK tới `types` (`:13-14`); `ck_type_efficacy_damage_factor CHECK (damage_factor IN (0, 50, 100, 200))` (`:15`).
  - `regions(id, name VARCHAR(30))`, `uk_regions_name` (`:18-23`).
  - `generations(id, name, region_id)`, `uk_generations_name`, FK `fk_generations_regions` (`:25-32`).
  - Mọi bảng `InnoDB`, `utf8mb4`, `utf8mb4_0900_ai_ci`.
- **Phụ thuộc:** chạy bởi Flyway trước mọi bean JPA.
- **Dữ liệu:** `TINYINT UNSIGNED` (0-255) đủ cho ID hệ, vùng, thế hệ; hệ số giữ số nguyên phần trăm khớp CSV (`docs/database.md:30`).
- **Biên và lỗi:** InnoDB tự tạo index cho cột khóa ngoại chưa có index (ví dụ `defending_type_id`).
- **Test:** `SchemaMigrationIT.java:47-53` (đúng 3 phiên bản 1, 2, 3), `:74-80` (200 hợp lệ, 75 vi phạm `CHECK`).

**6. `backend/src/main/resources/db/migration/V2__create_pokedex_tables.sql` (`backend/src/main/resources/db/migration/V2__create_pokedex_tables.sql`)**

- **Vai trò:** tạo 4 bảng bách khoa.
- **Thành phần chính:**
  - `evolution_chains(id SMALLINT UNSIGNED PK)` (`:1-4`): chỉ để nhóm loài cùng chuỗi.
  - `species` (`:6-19`): `name` `UNIQUE`; `evolution_chain_id` cho phép `NULL`; `is_legendary`, `is_mythical` mặc định `FALSE`, `is_fully_evolved` mặc định `TRUE`; index `idx_species_generation` (lọc thế hệ); FK tới `generations`, `evolution_chains`.
  - `pokemon` (`:21-52`): ID `SMALLINT UNSIGNED` (dạng đặc biệt lên tới 10326); 6 chỉ số `TINYINT UNSIGNED`; `base_stat_total SMALLINT UNSIGNED GENERATED ALWAYS AS (...) STORED` (`:35-36`); `height_dm`, `weight_hg`; `uk_pokemon_name`; 6 index `species`, `primary_type`, `secondary_type`, `bst`, `speed`, `form_category` (`:41-46`); 3 FK (`:47-49`); `ck_pokemon_form_category` (`:50`); `ck_pokemon_distinct_types` (`:51`).
  - `evolution_links` (`:54-68`): `id INT UNSIGNED AUTO_INCREMENT`; `uk_evolution_links_to_species` (`:63`); `idx_evolution_links_chain` (`:64`); 3 FK.
- **Phụ thuộc:** V1 (FK tới `types`, `generations`).
- **Dữ liệu:** lý do lưu hệ và chỉ số thành cột: một Pokémon có đúng 1-2 hệ, 6 chỉ số, lọc và sắp xếp không cần JOIN (`docs/database.md:18-22`). Index phục vụ bộ lọc Omni-Dex (`docs/database.md:264-277`); bảng khoảng 1.300 dòng nên index chủ yếu cho kế hoạch truy vấn, chưa phải nút thắt.
- **Biên và lỗi:** `base_stat_total` do DB tính nên không thể lệch 6 chỉ số; `CHECK` chặn form lạ, hệ phụ trùng hệ chính.
- **Test:** `SchemaMigrationIT.java:56-64` (đủ 10 bảng), `:67-71` (BST Charizard 534), `:83-87` (hệ trùng), `:90-94` (form `FOO`).

**7. `backend/src/main/resources/db/migration/V3__create_team_tables.sql` (`backend/src/main/resources/db/migration/V3__create_team_tables.sql`)**

- **Vai trò:** tạo 2 bảng dữ liệu người dùng.
- **Thành phần chính:**
  - `teams` (`:1-11`): `id BIGINT UNSIGNED AUTO_INCREMENT` (không lộ ra API); `user_id` `NULL` dành cho đăng nhập sau MVP; `name VARCHAR(60)`; `share_code CHAR(8) ... COLLATE utf8mb4_bin` (`:5`) và `uk_teams_share_code` (`:10`); `synergy_score DECIMAL(5,2)` `NULL`; `created_at`, `updated_at` tự đặt, `updated_at ON UPDATE CURRENT_TIMESTAMP`.
  - `team_members` (`:13-23`): PK `(team_id, slot)` (`:18`); `uk_team_members_pokemon (team_id, pokemon_id)` (`:19`); FK `ON DELETE CASCADE` tới `teams` (`:20`); FK tới `pokemon` (`:21`); `CHECK (slot BETWEEN 1 AND 6)` (`:22`).
- **Phụ thuộc:** V2 (FK tới `pokemon`).
- **Dữ liệu:** collation `utf8mb4_bin` vì collation mặc định không phân biệt hoa thường, sẽ coi `a1B2c3D4` và `A1b2C3d4` là trùng (`docs/database.md:247`).
- **Biên và lỗi:** ràng buộc trùng slot, trùng Pokémon được Service kiểm trước (`TeamService.java:68,70`); DB là lớp bảo vệ cuối.
- **Test:** `SchemaMigrationIT.java:97-103` (slot 7), `:106-112` (trùng Pokémon thành `DataIntegrityViolationException`), `:115-121` (mã khác hoa thường là khác nhau), `:124-131` (xóa đội xóa thành viên).

#### IX. Build và đóng gói (`backend/`)

**1. `pom.xml` (`backend/pom.xml`)**

- **Vai trò:** định nghĩa build Maven, dependency, plugin.
- **Thành phần chính:** parent `spring-boot-starter-parent` 4.1.2 (`pom.xml:5-10`, được Dependabot nâng từ 4.1.1 ở commit `59d35da`); `java.version` 25 (`:18`); khóa phiên bản springdoc 3.1.1, commons-csv 1.14.1 (`:19-20`).

| Artifact | Scope | Dùng cho | Dòng |
|---|---|---|---|
| `spring-boot-starter-webmvc` | compile | REST Controller, filter, `WebMvcConfigurer` | `:24-27` |
| `spring-boot-starter-data-jpa` | compile | Entity, Repository, Specification; `JdbcTemplate`, `TransactionTemplate` dùng ở ingestion và health có trên classpath qua starter (pom không khai báo starter JDBC riêng) | `:28-31` |
| `spring-boot-starter-flyway` | compile | Chạy migration lúc khởi động (Boot 4 tách starter riêng) | `:32-35` |
| `flyway-mysql` | compile | Module hỗ trợ MySQL của Flyway | `:36-39` |
| `spring-boot-starter-validation` | compile | Bean Validation (`@Valid`, `@NotBlank`...) | `:40-43` |
| `springdoc-openapi-starter-webmvc-ui` 3.1.1 | compile | `/v3/api-docs`, Swagger UI | `:44-48` |
| `mysql-connector-j` | runtime | JDBC driver | `:50-54` |
| `commons-csv` 1.14.1 | compile | `CsvReader` | `:55-59` |
| `lombok` | optional | Getter, constructor cho 10 Entity và 2 khóa ghép (`backend/CLAUDE.md:48`) | `:60-64` |
| `spring-boot-starter-webmvc-test` | test | `@WebMvcTest`, `MockMvcTester`, `@MockitoBean`, JUnit 5, AssertJ, Mockito | `:66-70` |
| `spring-boot-starter-data-jpa-test`, `-flyway-test`, `-validation-test` | test | Starter test theo module của Boot 4; không test nào dùng `@DataJpaTest` hay `@JdbcTest` (grep không có kết quả) | `:71-85` |
| `spring-boot-testcontainers` | test | `@ServiceConnection` | `:86-90` |
| `testcontainers-junit-jupiter` | test | `@Testcontainers(disabledWithoutDocker = true)` | `:91-95` |
| `testcontainers-mysql` | test | `MySQLContainer` | `:96-100` |

- Plugin:
  - `spring-boot-maven-plugin` (`:105-108`): đóng gói jar thực thi, cung cấp `spring-boot:run`, `spring-boot:test-run`.
  - `maven-failsafe-plugin` (`:109-112`): chạy class `*IT` ở pha `integration-test`, `verify`; Surefire (mặc định) chạy `*Test` (`backend/README.md:50`).
  - `maven-compiler-plugin` (`:113-148`): khai báo `annotationProcessorPaths` Lombok cho cả `compile` và `testCompile`. Lý do không ghi trong tài liệu dự án; cấu hình này đúng dạng Spring Initializr sinh khi chọn Lombok.
- **Phụ thuộc:** Maven Wrapper (`maven-wrapper.properties`).
- **Dữ liệu:** không.
- **Biên và lỗi:** thêm dependency ngoài bảng ở `docs/architecture.md`, Phần 2 phải hỏi trước (`CLAUDE.md`, Phần 3).
- **Test:** CI chạy `./mvnw -B -ntp verify` (`ci.yml:49`).

**2. `Dockerfile` (`backend/Dockerfile`)**

- **Vai trò:** build image backend nhiều stage cho Railway và Docker Compose.
- **Thành phần chính:**
  - Stage `build` từ `eclipse-temurin:25-jdk` (`Dockerfile:1`); copy wrapper và `pom.xml` trước, chạy `dependency:go-offline` (`:3-5`) để layer dependency được cache khi chỉ sửa code.
  - Copy `src/`, `package -DskipTests`, đổi tên jar, tách layer bằng `-Djarmode=tools ... extract --layers` (`:6-9`).
  - Stage chạy `eclipse-temurin:25-jre` (`:11`); tạo user hệ thống `pokenexus` (`:12`); copy 4 layer theo thứ tự ít đổi đến hay đổi: `dependencies`, `spring-boot-loader`, `snapshot-dependencies`, `application` (`:14-17`); `USER pokenexus` (`:18`); `EXPOSE 8080` (`:19`).
  - `ENTRYPOINT java -XX:MaxRAMPercentage=75 -jar application.jar` (`:20`): heap tối đa 75% RAM của container.
- **Phụ thuộc:** `docker-compose.yml:29` (`build: ./backend`); Railway Root Directory `backend` (`docs/architecture.md:488`).
- **Dữ liệu:** không đặt `SPRING_PROFILES_ACTIVE`; môi trường chạy phải cung cấp.
- **Biên và lỗi:** test bị bỏ qua khi build image (CI chạy test riêng). Không dùng AOT cache vì bước huấn luyện cần MySQL lúc build (`docs/architecture.md:463`). Số đo: giới hạn 512 MB, 0,5 CPU khởi động 27,5 s, chiếm 277 MiB (`docs/adr/0007-hosting-railway-cloudflare-pages.md:10`).
- **Test:** không có test tự động.

**3. File build phụ**

| File | Nội dung | Dùng bởi |
|---|---|---|
| `backend/.dockerignore` | Loại `target/`, `.idea/`, `.vscode/`, `*.iml`, `*.log` khỏi build context (`.dockerignore:1-5`) | `docker build` |
| `backend/.mvn/wrapper/maven-wrapper.properties` | Wrapper 3.3.4, `distributionType=only-script`, Maven 3.10.0 (`maven-wrapper.properties:1-3`); không có `maven-wrapper.jar` | `mvnw`, `mvnw.cmd`, Dockerfile, CI |
| `backend/mvnw`, `backend/mvnw.cmd` | Script do Maven Wrapper sinh, tải Maven theo file properties; không đọc chi tiết vì là file sinh tự động | Dev, Dockerfile (`:5`), CI (`ci.yml:48-49`) |

#### X. Test và hạ tầng test (`backend/src/test`)

**1. `TestcontainersConfiguration` (`backend/src/test/java/com/pokenexus/TestcontainersConfiguration.java`)**

- **Vai trò:** cấu hình test dựng MySQL 8.4 tạm bằng Testcontainers.
- **Thành phần chính:** `MYSQL_IMAGE = "mysql:8.4"` (`TestcontainersConfiguration.java:12`); bean `MySQLContainer` gắn `@ServiceConnection` (`:14-18`): Spring Boot tự lấy URL, user, password của container thay cho `spring.datasource.*`.
- **Phụ thuộc:** được `@Import` bởi mọi `*IT`; dùng trong `TestPokeNexusApplication`.
- **Dữ liệu:** container cổng ngẫu nhiên, nên không đụng MySQL80 ở 3306 hay Docker 3307 trên máy dev (`CLAUDE.local.md`).
- **Biên và lỗi:** không có Docker thì `*IT` bị Skipped nhờ `@Testcontainers(disabledWithoutDocker = true)`, không báo lỗi; khi báo kết quả phải nêu số test Skipped (`backend/CLAUDE.md:20`).
- **Test:** chính nó là hạ tầng test.

**2. `TestPokeNexusApplication` (`backend/src/test/java/com/pokenexus/TestPokeNexusApplication.java`)**

- **Vai trò:** `main` chạy ứng dụng thật với MySQL do Testcontainers dựng (`./mvnw spring-boot:test-run`, `backend/README.md:48`).
- **Thành phần chính:** `SpringApplication.from(PokeNexusApplication::main).with(TestcontainersConfiguration.class).run(args)` (`TestPokeNexusApplication.java:8`).
- **Phụ thuộc:** `PokeNexusApplication`, `TestcontainersConfiguration`.
- **Dữ liệu:** không đặt profile, nên `dev` có hiệu lực: ingestion bật, đọc `../data/csv` vào container trống.
- **Biên và lỗi:** thiếu `data/csv` thì khởi động thất bại với "CSV file not found".
- **Test:** không phải test; tiện ích chạy tay.

**3. `PokeNexusApplicationIT` (`backend/src/test/java/com/pokenexus/PokeNexusApplicationIT.java`)**

- **Vai trò:** test khói toàn ứng dụng trên DB vừa migrate, chưa có dữ liệu.
- **Thành phần chính:** `@SpringBootTest`, `@AutoConfigureMockMvc`, profile `test` (`:14-18`). Kiểm: health `UP`, `false`, `0` (`:25-32`); `GET /api/v1/pokemon` trả 503 `DATA_NOT_READY` (`:35-40`); `/v3/api-docs` (`:43-49`); Swagger chuyển hướng (`:52-56`).
- **Phụ thuộc:** `TestcontainersConfiguration`.
- **Dữ liệu:** schema V1-V3, không dữ liệu.
- **Biên và lỗi:** chứng minh trường hợp "DB rỗng, ingestion tắt: ứng dụng vẫn chạy, API dữ liệu trả 503" (`docs/architecture.md:139`).
- **Test:** chính nó.

**4. `SchemaMigrationIT` (`backend/src/test/java/com/pokenexus/SchemaMigrationIT.java`)**

- **Vai trò:** kiểm tra migration và mọi ràng buộc DB bằng SQL thuần.
- **Thành phần chính:** `@Transactional` (`:24`) nên mỗi test rollback; `@BeforeEach` chèn Charizard tối thiểu (`:36-44`). 10 test: 3 phiên bản Flyway (`:47-53`); 10 bảng (`:56-64`); BST 534 (`:67-71`); `CHECK` hệ số (`:74-80`); `CHECK` hệ trùng (`:83-87`); `CHECK` form (`:90-94`); `CHECK` slot (`:97-103`); `UNIQUE` thành viên (`:106-112`); share code phân biệt hoa thường (`:115-121`); `CASCADE` (`:124-131`).
- **Phụ thuộc:** `JdbcTemplate`, `TestcontainersConfiguration`.
- **Dữ liệu:** mọi bảng V1-V3.
- **Biên và lỗi:** vi phạm `CHECK` chỉ được kiểm là `DataAccessException` có tên constraint; vi phạm `UNIQUE` là `DataIntegrityViolationException`, khớp ghi chú `backend/CLAUDE.md:53`.
- **Test:** chính nó.

**5. Test của `ingestion`**

- Thư mục: `backend/src/test/java/com/pokenexus/ingestion/`.

| Class | Loại | Ca chính |
|---|---|---|
| `CsvReaderTest` | Unit, `@TempDir` | Đọc theo cột, giá trị rỗng, số dòng; file thiếu; message có file, dòng, cột (`:20-60`) |
| `FormCategoryResolverTest` | Unit, tham số hóa | 8 ca phân loại, 3 ca totem và cap trước regional (`:12-35`) |
| `IngestionRunnerIT` | Tích hợp, `app.ingestion.enabled=true` (`:23`) | Ingestion chạy lúc khởi động context với CSV mẫu; 18 hệ, 324 dòng (`:40-47`); Charizard (`:50-58`); 5 nhóm form 23, 5, 9, 3, 22 (`:61-72`); 12 loài fully evolved (`:75-81`); 13 cạnh tiến hóa (`:84-92`); chạy `run()` lần hai vẫn 62 Pokémon (`:95-102`); health `up(62)` (`:105-108`) |
| `IngestionRollbackIT` | Tích hợp | Copy CSV mẫu vào thư mục tạm, sửa `6,1,78,` thành `6,1,abc,` trong `pokemon_stats.csv` (`:47`); `ingest()` ném `IllegalStateException` nêu file và cột (`:49-52`); `types`, `species`, `pokemon` đều rỗng (`:54-56`) dù `types`, `species` đã ghi trước bước lỗi |

**6. Test của `common`**

- Thư mục: `backend/src/test/java/com/pokenexus/common/{config,domain,exception,web}/`.

| Class | Loại | Ca chính |
|---|---|---|
| `CorsConfigTest` | `@WebMvcTest` | Preflight origin hợp lệ 200, origin lạ 403 (`:26-43`) |
| `FormCategoryTest`, `PokemonTypeTest`, `PokemonTypeConverterTest`, `StatTypeTest` | Unit | Xem mục III |
| `GlobalExceptionHandlerTest` | `@WebMvcTest` với `ProbeController` | 7 ca: 404, `VALIDATION_FAILED`, `MALFORMED_JSON`, 2 ca `INVALID_PARAMETER`, `ROUTE_NOT_FOUND`, 500 ẩn chi tiết (`:29-108`) |
| `NotFoundExceptionTest` | Unit | Giữ mã, từ chối mã khác 404 và `null` (`:11-28`) |
| `HealthControllerTest` | `@WebMvcTest` | 200, 503, 405 (`:23-56`) |
| `HealthServiceTest` | Unit, Mockito | 6 ca ở mục V.2 (`:40-99`) |
| `PageRequestFactoryTest` | Unit | Mặc định, tiêu chí phụ, chặn tràn offset, giới hạn (`:20-59`) |
| `RequestBodyLimitFilterTest` | Unit, `MockHttpServletRequest` | Chunked quá lớn, `Content-Length` quá lớn, đúng giới hạn, `GET` (`:22-57`); helper `chunkedPost` giả `Content-Length = -1` (`:66-81`) |

**7. `application-test.yml` và CSV mẫu (`backend/src/test/resources/`)**

- `application-test.yml`: ingestion tắt, `csv-dir: src/test/resources/csv` (đường dẫn tính từ `backend/`, nơi Maven chạy test), CORS `http://localhost:5173` (`application-test.yml:1-6`).
- CSV mẫu được commit để CI không cần bộ CSV đầy đủ (`docs/architecture.md:540`). Cùng header với bộ thật.

| File | Dòng dữ liệu (mẫu) | Dòng dữ liệu (bộ thật) | Ghi chú |
|---|---|---|---|
| `types.csv` | 21 | 21 | Nạp 18 |
| `type_efficacy.csv` | 324 | 324 | Đủ ma trận |
| `regions.csv` | 11 | 11 | |
| `generations.csv` | 9 | 9 | |
| `evolution_chains.csv` | 10 | 540 | |
| `pokemon_species.csv` | 23 | 1025 | Mẫu: 12 loài fully evolved |
| `pokemon.csv` | 62 | 1351 | Mẫu: 23 mặc định |
| `pokemon_types.csv` | 84 | 2116 | |
| `pokemon_stats.csv` | 372 | 8106 | Đúng 6 dòng mỗi Pokémon (62 x 6, 1351 x 6) |
| `stats.csv` | 9 | 9 | Không được đọc |
| `pokemon_evolution.csv` | 16 | 676 | Mẫu: 13 cạnh; thật: 484 cạnh |
| `evolution_triggers.csv` | 18 | 18 | |

- Số dòng = `wc -l` trừ 1 dòng header; mọi file kết thúc bằng ký tự xuống dòng (đã kiểm).

#### XI. `data/`

**1. `data/README.md`**

- **Vai trò:** hướng dẫn nguồn, tải, lưu ý nạp và kết quả khảo sát CSV (T102).
- **Thành phần chính:** bảng file và bảng đích (`data/README.md:13-26`); lưu ý nạp: lọc hệ 1-18, gom 6 chỉ số, `slot`, `is_fully_evolved`, chọn dòng tiến hóa `is_default = 1` có `id` nhỏ nhất, đọc theo tên cột (`:32-39`); lệnh tải (`:47-53`); cố định commit `e2710d3` (`:56`); giấy phép (`:63-66`); số liệu bộ CSV ngày 2026-10-21 (`:74-87`); phân loại form và sprite (`:91-93`); mẫu đối chiếu chiều cao, cân nặng (`:97-102`).
- **Phụ thuộc:** `scripts/download-csv.*`; nhất quán với `docs/database.md`, Phần 5.
- **Dữ liệu:** 12 file CSV.
- **Biên và lỗi:** đổi SHA nguồn thì phải khảo sát lại số liệu (`:57,104`).
- **Test:** không áp dụng.

**2. Cấu trúc thư mục**

| Đường dẫn | Nội dung | Có trong git |
|---|---|---|
| `data/README.md` | Tài liệu ở mục 1 | Có |
| `data/csv/.gitkeep` | Giữ thư mục rỗng trong git | Có |
| `data/csv/*.csv` | 12 file CSV tải từ PokéAPI, header ở bảng mục X.7 | Không (`.gitignore:32`) |
| `data/dumps/` | `pokenexus.sql` (bản dùng để import), `pokenexus-2026-10-23.sql` (bản cũ) | Không (`.gitignore:33`) |

- File dump hiện có trên máy dev (`data/dumps/pokenexus.sql`, tạo 2026-10-29 bởi mysqldump 8.4.11) chứa `DROP TABLE IF EXISTS`, `CREATE TABLE` và `INSERT` cho 8 bảng tĩnh cùng `flyway_schema_history`, rồi chỉ `CREATE TABLE` cho `teams`, `team_members`; có tắt `FOREIGN_KEY_CHECKS` trong lúc nạp (đã grep, không đọc dữ liệu).

#### XII. Gốc repo: Docker Compose và biến môi trường

**1. `docker-compose.yml` (`docker-compose.yml`)**

- **Vai trò:** dựng môi trường local: MySQL, backend tùy chọn, Adminer tùy chọn.
- **Thành phần chính:**
  - `mysql` (`docker-compose.yml:4-26`): image `mysql:8.4`; tên container `pokenexus-mysql` (script dump dựa vào tên này); `DB_PASSWORD`, `DB_ROOT_PASSWORD` bắt buộc qua cú pháp `${...:?}` (`:11-12`); `TZ Asia/Ho_Chi_Minh`; server `utf8mb4`, `utf8mb4_0900_ai_ci` (`:15-16`) khớp collation của migration; cổng `${DB_PORT:-3306}:3306` (`:18`); volume `mysql-data` (`:20,64-65`); healthcheck `mysqladmin ping` mỗi 10 s, 10 lần thử, chờ đầu 30 s (`:21-26`).
  - `backend` (`:28-50`): build `./backend`; chỉ chạy khi bật profile Compose `app` (`:32`); chờ MySQL `service_healthy` (`:34-36`); `SPRING_PROFILES_ACTIVE` mặc định `dev` (`:38`); nối `mysql:3306` trong mạng Compose (`:39-40`); `APP_INGESTION_CSVDIR=/data/csv` (`:45`) và mount `./data/csv` chỉ đọc (`:48`); cổng `${BACKEND_PORT:-8080}:8080` (`:50`).
  - `adminer` (`:52-62`): profile `tools`, cổng `${ADMINER_PORT:-8081}`.
- **Phụ thuộc:** `.env` ở gốc (Compose tự đọc); `backend/Dockerfile`.
- **Dữ liệu:** `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, `DB_ROOT_PASSWORD`, `DB_PORT`, `BACKEND_PORT`, `ADMINER_PORT`, `SPRING_PROFILES_ACTIVE`, `CORS_ALLOWED_ORIGINS`.
- **Biên và lỗi:** thiếu mật khẩu thì Compose dừng với thông báo "Set DB_PASSWORD in .env". Trong container `DB_PORT` cố định `3306` (`:40`) dù `.env` máy dev đặt 3307 cho cổng host.
- **Test:** không có test tự động.

**2. `.env.example` (`.env.example`)**

- **Vai trò:** mẫu biến môi trường; copy thành `.env` (không commit, `.gitignore:2-4`).
- **Thành phần chính:** nhóm DB (`.env.example:1-6`), Adminer (`:8`), backend `BACKEND_PORT`, `SPRING_PROFILES_ACTIVE=dev`, `CORS_ALLOWED_ORIGINS` (`:10-12`), frontend `FRONTEND_PORT`, `VITE_API_BASE_URL` (`:14-15`).
- **Phụ thuộc:** `application.yml:5` (backend đọc `../.env`), Docker Compose, Vite.
- **Dữ liệu:** mật khẩu là giá trị giả `change-me`.
- **Biên và lỗi:** `DB_PORT=3306` mặc định; máy có MySQL80 chiếm 3306 phải đổi (máy dev dùng 3307).
- **Test:** không áp dụng.

#### XIII. `scripts/`

**1. `db-dump.sh` (`scripts/db-dump.sh`)**

- **Vai trò:** xuất dữ liệu tĩnh từ MySQL local và nhập vào DB đích (Railway).
- **Thành phần chính:**
  - `set -euo pipefail` (`db-dump.sh:2`); container `${MYSQL_CONTAINER:-pokenexus-mysql}` (`:5`); file `${2:-data/dumps/pokenexus.sql}` (`:6`).
  - `export_dump` (`:14-23`): `docker exec` vào container, dùng `MYSQL_PWD` lấy từ biến của chính container (`:17`); tùy chọn `--single-transaction --no-tablespaces --set-gtid-purged=OFF` (`:18`); lần 1 dump cả DB trừ dữ liệu `teams`, `team_members` (`:19`); lần 2 dump `--no-data` hai bảng đó (`:20`); ghi `.part` rồi `mv` (`:20-21`) để không để lại file dở.
  - `import_dump` (`:25-41`): kiểm file tồn tại (`:26`); `TARGET_DB_URL` phải khớp `mysql://user:password@host:port/database` (`:28-31`); tách 5 phần (`:32`); đếm bảng ở DB đích (`:34`); đã có bảng mà không `FORCE=1` thì dừng (`:35-38`); đẩy file vào `mysql` (`:39`); in `pokemon rows` và `flyway migrations` (`:40`).
  - Lệnh con `export`, `import`, sai thì in hướng dẫn (`:8-12,43-47`).
- **Phụ thuộc:** Docker, container `pokenexus-mysql` đang chạy (kể cả khi import, vì dùng client `mysql` bên trong container để nối DB từ xa, máy dev không cần cài client).
- **Dữ liệu:** 8 bảng tĩnh và `flyway_schema_history` có dữ liệu; `teams`, `team_members` chỉ có schema.
- **Biên và lỗi:**
  - Không xuất đội đã lưu ở máy dev: đội thử nghiệm không lên production (`docs/adr/0007-hosting-railway-cloudflare-pages.md:22`).
  - Có `flyway_schema_history` nên Flyway trên production thấy V1-V3 đã chạy và không tạo lại bảng.
  - Regex không cho mật khẩu chứa `@`, user chứa `:`; phần sau `?` của URL bị bỏ.
  - Dump có `DROP TABLE IF EXISTS`, nên `FORCE=1` thay toàn bộ bảng trùng tên ở DB đích.
- **Test:** không có test tự động; kết quả kỳ vọng `pokemon rows: 1351`, `flyway migrations: 3` (`docs/architecture.md:517`).

**2. Các script còn lại**

| File | Việc làm | Chi tiết đáng nhớ |
|---|---|---|
| `download-csv.sh` | Tải 12 CSV vào `data/csv` (hoặc thư mục ở tham số 1) | Cố định commit `e2710d30...` (`download-csv.sh:6`); danh sách 12 file (`:8`); `curl -fsSL --retry 2`, ghi `.part` rồi `mv` (`:12-13`) |
| `download-csv.ps1` | Bản PowerShell của script trên | Tham số `-OutDir` (`download-csv.ps1:1-3`); ép TLS 1.2 (`:7`); cùng SHA (`:12`), cùng 12 file (`:14`); `.part` rồi `Move-Item` (`:19-20`) |
| `download-sprites.sh` | Tải sprite theo ID trong `pokemon.csv` vào `frontend/public/sprites/pokemon` | Cần CSV trước (`download-sprites.sh:11-14`); bỏ qua file đã có (`:23-26`); 4 luồng song song bằng `xargs -P` (`:9,42-43`); ghi ID 404 vào `missing.txt` (`:46`); lỗi mạng thì thoát mã 1 (`:54-57`) |
| `bench-synergy.sh` | Đo p50, p95 của `analyze` và `recommendations` | Mặc định 20 lần khởi động, 100 lần đo, ngân sách 50 ms (`bench-synergy.sh:5-7`); đội 5 và 6 Pokémon (`:8-9`); có request khác 200 thì lỗi (`:25-29`); p95 từ 50 ms trở lên thì thoát khác 0 (`:36,45-48`) |
| `check-image-provenance.mjs` | Tìm dấu vết ảnh do AI tạo trong metadata (C2PA, IPTC, tên công cụ, tham số prompt) | 4 nhóm mẫu (`check-image-provenance.mjs:4-15`); đọc file dạng `latin1` (`:25`); có ảnh bị loại thì thoát mã 1 (`:35`) |

#### XIV. `.github/`

**1. `ci.yml` (`.github/workflows/ci.yml`)**

- **Vai trò:** CI GitHub Actions cho backend và frontend.
- **Thành phần chính:**
  - Kích hoạt: push lên `main`, PR vào `main`, chạy tay (`ci.yml:3-8`); quyền chỉ đọc (`:10-11`); `concurrency` hủy lần chạy cũ cùng ref (`:13-15`).
  - Job `backend` trên `ubuntu-latest` (`:18-49`): bước dò `backend/pom.xml`, không có thì bỏ qua với notice (`:25-33`, di sản từ lúc repo chưa có mã); Temurin 25, cache Maven theo `backend/pom.xml` (`:35-42`); `chmod +x mvnw` rồi `./mvnw -B -ntp verify` (`:44-49`).
  - Job `frontend` (`:51-94`): Node theo `.nvmrc`, cache npm (`:68-74`); `npm ci`, `lint --if-present`, `test --if-present`, `build` (`:76-94`).
- **Phụ thuộc:** `mvnw`, `pom.xml`, `.nvmrc`, `frontend/package-lock.json`.
- **Dữ liệu:** không dùng secret.
- **Biên và lỗi:** `verify` chạy cả `*Test` (Surefire) và `*IT` (Failsafe); runner Ubuntu có Docker nên test Testcontainers chạy đủ (`backend/README.md:50`). Dữ liệu test lấy từ CSV mẫu, không cần mạng tới PokéAPI.
- **Test:** chính nó là cổng kiểm tra trước merge.

**2. File cấu hình tự động hóa khác**

| File | Một dòng |
|---|---|
| `.github/dependabot.yml` | Kiểm tra cập nhật hằng tuần thứ Hai cho GitHub Actions (tiền tố `ci`), Maven `/backend` và npm `/frontend` (tiền tố `chore(deps)`), gom minor và patch thành một PR (`dependabot.yml:3-44`) |
| `.github/pull_request_template.md` | Mẫu PR: mô tả, Issue, loại thay đổi, cách kiểm thử, ảnh chụp, checklist CI xanh, test, tài liệu, không có `.env`, kiểm 375 px |
| `.github/ISSUE_TEMPLATE/config.yml` | Tắt Issue trống, thêm link tới thư mục `docs` |
| `.github/ISSUE_TEMPLATE/bug_report.yml` | Form báo lỗi: mô tả, bước tái hiện, kỳ vọng, thực tế, khu vực (Backend, Frontend, Database, Ingestion, CI), môi trường; nhãn `type: bug` |
| `.github/ISSUE_TEMPLATE/feature_request.yml` | Form tính năng: User Story, tiêu chí chấp nhận, khu vực, mức ưu tiên (MVP, Mở rộng, Hướng phát triển), ghi chú; nhãn `type: feature` |

### III. Luồng xử lý tiêu biểu

#### I. Khởi động lần đầu trên DB rỗng (profile `dev`)

1. `PokeNexusApplication.main` gọi `SpringApplication.run` (`PokeNexusApplication.java:10`).
2. Spring nạp `application.yml`, đọc `../.env` (`application.yml:5`); không có profile active nên `dev` có hiệu lực (`:7`) và `application-dev.yml` bật ingestion (`application-dev.yml:3`).
3. Datasource nối MySQL theo `DB_*` (`application.yml:9-11`). Flyway tạo `flyway_schema_history` và chạy V1, V2, V3 (`application.yml:17`, `backend/src/main/resources/db/migration/V1__create_reference_tables.sql`, `backend/src/main/resources/db/migration/V2__create_pokedex_tables.sql`, `backend/src/main/resources/db/migration/V3__create_team_tables.sql`). Hibernate kiểm Entity khớp schema (`application.yml:14`).
4. Context xong, Spring Boot gọi `ApplicationRunner`: `IngestionRunner.run` (`IngestionRunner.java:52`). Ingestion bật (`:53`), `COUNT(*) FROM pokemon` = 0 (`:57,85-88`), gọi `ingest(Path.of("../data/csv"))` (`:62`).
5. Mở một transaction (`:71`):
   - `TypeLoader.load`: 18 hệ, 324 hệ số (`TypeLoader.java:23-44`).
   - `GenerationLoader.load`: 11 vùng, 9 thế hệ (`GenerationLoader.java:20-28`).
   - `SpeciesLoader.load`: 540 chuỗi, 1025 loài, tính `is_fully_evolved` (`SpeciesLoader.java:23-46`).
   - `PokemonLoader.load`: gom hệ, chỉ số, tính `form_category`, 1351 dòng (`PokemonLoader.java:33-66`).
   - `EvolutionLoader.load`: chọn dòng mặc định, 484 cạnh (`EvolutionLoader.java:23-48`).
6. Commit, log "CSV ingestion finished in ... ms: 18 types, 9 generations, 1025 species, 1351 pokemon, 484 evolution links" (`IngestionRunner.java:81-82`).
7. Sau các runner, Spring Boot phát `ApplicationReadyEvent`: `TypeChartService.loadOnStartup` nạp ma trận 18 x 18 (`TypeChartService.java:42-49`), `PokemonProfileRegistry.loadOnStartup` nạp hồ sơ (`PokemonProfileRegistry.java:38-45`).
8. `GET /api/v1/health`: `HealthController.health` (`HealthController.java:24`) gọi `HealthService.check` (`HealthService.java:26-35`), trả 200 `{"status":"UP","dataLoaded":true,"pokemonCount":1351}`.
9. Lần khởi động sau: `COUNT` > 0 nên log "CSV ingestion skipped" (`IngestionRunner.java:58-60`).
10. Nếu một dòng CSV hỏng: `CsvReader.Row.error` tạo message có file, dòng, cột (`CsvReader.java:82-85`); `IngestionRunner` log "failed and was rolled back" và ném lại (`IngestionRunner.java:77-80`); mọi bảng về rỗng (`IngestionRollbackIT.java:54-56`); ứng dụng dừng khởi động.

#### II. Request bị `RequestBodyLimitFilter` chặn

1. Client gửi `POST /api/v1/synergy/analyze` với body khoảng 20 KB (`SynergyControllerTest.java:183`).
2. `RequestBodyLimitFilter.shouldNotFilter` trả `false` vì là `POST` (`RequestBodyLimitFilter.java:29,32-34`).
3. `doFilterInternal`: nếu `Content-Length` > 16.384 thì bỏ qua đọc; nếu không (hoặc chunked) thì `readNBytes(16.385)` và thấy vượt (`:40-42`). Kết quả `body = null`.
4. Filter chuyển `LimitedBodyRequest(request, null)` xuống chuỗi (`:44`).
5. `DispatcherServlet` chọn `SynergyController.analyze(@Valid @RequestBody ...)` (`SynergyController.java:33`); bộ chuyển JSON gọi `getInputStream()` trên request bọc.
6. `requireBody()` ném `ApiException(PAYLOAD_TOO_LARGE, "Request body must not exceed 16384 bytes")` (`RequestBodyLimitFilter.java:58,104-108`).
7. `GlobalExceptionHandler.handleApiException` (`GlobalExceptionHandler.java:34-45`) dựng `ProblemDetail` status 413 (`ErrorCode.java:15`), `code = PAYLOAD_TOO_LARGE`.
8. Method `analyze` không chạy; `SynergyAnalyzer` không bị gọi (`SynergyControllerTest.java:190`).

```json
{
  "type": "about:blank",
  "title": "Content Too Large",
  "status": 413,
  "detail": "Request body must not exceed 16384 bytes",
  "instance": "/api/v1/synergy/analyze",
  "code": "PAYLOAD_TOO_LARGE"
}
```

- Giá trị `title` là reason phrase Spring sinh cho mã 413; test chỉ kiểm `status` và `code`, nên chữ chính xác của `title` chưa xác định từ test.

#### III. Lưu đội lần thứ 11 trong một phút (exception nghiệp vụ có header)

1. Trình duyệt ở origin hợp lệ gửi preflight `OPTIONS`; `CorsConfig` cho phép `POST` và cache preflight 3600 s (`CorsConfig.java:23-28`).
2. `POST /api/v1/teams` đi qua `RequestBodyLimitFilter` (body dưới 1 KB, đi tiếp). Ở prod, `ForwardedHeaderFilter` (bật bởi `application-prod.yml:2`) đặt `remoteAddr` theo header forwarded.
3. Spring validate `@Valid @RequestBody CreateTeamRequest` trước khi vào thân method; body sai sẽ thành `VALIDATION_FAILED` và không tính vào giới hạn (`TeamController.java:39`).
4. `TeamController.create` gọi `saveRateLimiter.acquire(httpRequest.getRemoteAddr())` (`TeamController.java:41`).
5. `SaveRateLimiter.acquire`: cửa sổ cố định 1 phút, giới hạn lấy từ `AppProperties.team().saveLimitPerMinute()` = 10 (`SaveRateLimiter.java:18,29-30`, `application.yml:29`); lần thứ 11 ném `RateLimitedException("Save limit exceeded, retry later", giây còn lại)` (`SaveRateLimiter.java:56-57`).
6. `RateLimitedException` gắn `RATE_LIMITED` và ép `retryAfterSeconds` tối thiểu 1 (`RateLimitedException.java:7-10`).
7. `GlobalExceptionHandler.handleApiException` trả 429 kèm `Retry-After` (`GlobalExceptionHandler.java:40-44`).
8. Frontend đọc được `Retry-After` vì header được expose (`CorsConfig.java:27`). `TeamControllerIT.java:163` kiểm giá trị 1-60.
9. Biến thể lỗi bất ngờ: một `IllegalStateException` (ví dụ `TeamService.java:108-109` khi không sinh được share code) rơi vào `handleUnexpected`, log `ERROR` kèm stack trace, trả 500 `INTERNAL_ERROR` với detail cố định (`GlobalExceptionHandler.java:47-54`).

#### IV. Lỗi của khung Spring thành `ProblemDetail` có `code`

1. JSON cụt `{"name": ` gửi tới endpoint `@RequestBody`: Jackson ném, Spring tạo `HttpMessageNotReadableException`; lớp cha `ResponseEntityExceptionHandler` xử lý rồi gọi `handleExceptionInternal` đã override (`GlobalExceptionHandler.java:65-78`).
2. `resolveCode` khớp `HttpMessageNotReadableException` thành `MALFORMED_JSON` (`:85`); log `DEBUG` vì 4xx (`:74-75`). Kết quả 400 (`GlobalExceptionHandlerTest.java:62-70`).
3. `GET /api/v1/does-not-exist`: không có handler, Spring ném `NoResourceFoundException`, `resolveCode` thành `ROUTE_NOT_FOUND` (`GlobalExceptionHandler.java:86`), 404 (`GlobalExceptionHandlerTest.java:91-97`).
4. `POST /api/v1/health`: 405; không có nhánh riêng nên `fallbackCode` thành `INVALID_PARAMETER`, giữ mã 405 (`GlobalExceptionHandler.java:91-99`, `HealthControllerTest.java:49-56`).
5. `@Valid` body sai ràng buộc: `handleMethodArgumentNotValid` thêm `detail` và mảng `errors` (`GlobalExceptionHandler.java:56-63`), sau đó cũng đi qua `handleExceptionInternal` để gắn `VALIDATION_FAILED` (`:82`).

#### V. Xuất dump ở máy dev, nhập vào Railway, khởi động production

1. Máy dev đã nạp dữ liệu (luồng I). Chạy `bash scripts/db-dump.sh export` (`db-dump.sh:43-44`).
2. `export_dump`: `docker exec pokenexus-mysql` chạy `mysqldump` với `--single-transaction` (ảnh chụp nhất quán, không khóa bảng InnoDB), bỏ dữ liệu `teams`, `team_members`, thêm schema rỗng của hai bảng đó, ghi `data/dumps/pokenexus.sql` qua file `.part` (`db-dump.sh:14-22`).
3. Trên Railway bật Public Networking của MySQL, lấy `MYSQL_PUBLIC_URL` (`docs/architecture.md:516`).
4. `TARGET_DB_URL='<url>' bash scripts/db-dump.sh import` (`db-dump.sh:45`): kiểm định dạng URL (`:28-31`), đếm bảng ở DB đích và từ chối nếu khác 0 mà không có `FORCE=1` (`:34-38`), đẩy dump qua client `mysql` trong container local (`:39`), in `pokemon rows: 1351`, `flyway migrations: 3` (`:40`, `docs/architecture.md:517`). Tắt Public Networking sau đó.
5. Railway build `backend/Dockerfile` và chạy với `SPRING_PROFILES_ACTIVE=prod` (`docs/architecture.md:488,494`).
6. Flyway đọc `flyway_schema_history` (có trong dump) thấy V1-V3 đã áp dụng, checksum khớp, không làm gì; Hibernate `validate` thành công.
7. `IngestionRunner.run` thấy `enabled = false` và thoát (`application-prod.yml:11`, `IngestionRunner.java:53-56`).
8. Cache nạp ở `ApplicationReadyEvent`; Railway gọi `/api/v1/health`, nhận 200 `UP`, `pokemonCount` 1351 nên chuyển traffic sang bản deploy mới (`docs/architecture.md:489,520`).

### IV. Câu hỏi có thể bị hỏi

| # | Câu hỏi | Trả lời mẫu (2-4 câu, nói được thành lời) | Nguồn |
|---|---|---|---|
| 1 | Dữ liệu Pokémon lấy từ đâu, lúc chạy có gọi PokéAPI không? | Dữ liệu là 12 file CSV trong repo PokéAPI, cố định ở commit `e2710d3` để số liệu giống nhau trên mọi máy. Em nạp một lần vào MySQL; lúc chạy backend chỉ đọc MySQL, không gọi API ngoài. Lý do: dữ liệu gần như không đổi, tránh hàng nghìn request và demo không phụ thuộc mạng. | `download-csv.sh:6-8`, `docs/adr/0002-offline-data-from-csv.md:8-15`, `data/README.md:56` |
| 2 | Ingestion chạy khi nào? | `IngestionRunner` là một `ApplicationRunner`, chạy sau khi context khởi tạo xong. Nó chỉ nạp khi `app.ingestion.enabled = true` và bảng `pokemon` đang rỗng. Profile `dev` bật cờ này, `prod` và `test` tắt, giá trị gốc là tắt. | `IngestionRunner.java:52-63`, `application-dev.yml:3`, `application-prod.yml:11` |
| 3 | Thứ tự nạp là gì, vì sao? | Thứ tự là hệ và tương khắc, vùng và thế hệ, chuỗi và loài, Pokémon, rồi cạnh tiến hóa. Đó là thứ tự của khóa ngoại: bảng con chỉ chèn được khi bảng cha đã có dòng. | `IngestionRunner.java:71-76`, `backend/src/main/resources/db/migration/V2__create_pokedex_tables.sql:17-18,47-49,65-67` |
| 4 | Chạy lại ứng dụng có nạp trùng không? | Không. Trước khi nạp, runner đếm bảng `pokemon`; có dòng là bỏ qua và ghi log. Test gọi `run()` lần hai và kiểm số Pokémon vẫn là 62. | `IngestionRunner.java:57-61`, `IngestionRunnerIT.java:95-102` |
| 5 | Nếu một file CSV hỏng giữa chừng thì sao? | Cả 5 loader chạy trong một `TransactionTemplate`, nên lỗi ở bước cuối cũng rollback các bảng đã ghi trước đó. Message chỉ rõ file, dòng, cột; runner log rồi ném lại, Spring Boot dừng khởi động, không bao giờ chạy với dữ liệu nửa vời. Có test cố tình làm hỏng `pokemon_stats.csv` và kiểm mọi bảng rỗng. | `IngestionRunner.java:71-80`, `CsvReader.java:82-85`, `IngestionRollbackIT.java:40-57` |
| 6 | Điểm yếu của cơ chế idempotent? | Nó chỉ nhìn bảng `pokemon`. Nếu ai đó chèn tay vào `types` mà `pokemon` vẫn rỗng, lần nạp sau sẽ trùng khóa chính, rollback và ứng dụng không khởi động. Cũng không có cơ chế nạp bổ sung khi nguồn CSV đổi; muốn cập nhật phải nạp lại vào DB trống. | `IngestionRunner.java:57-62`, `TypeLoader.java:31`, `data/README.md:57` |
| 7 | Mỗi bảng có bao nhiêu dòng sau khi nạp? | 18 hệ, 324 hệ số, 11 vùng, 9 thế hệ, 540 chuỗi, 1025 loài, 1351 dạng Pokémon và 484 cạnh tiến hóa. Riêng 484 em đếm lại từ CSV: số loài đích khác nhau trong các dòng tiến hóa mặc định. | `data/README.md:74-87`, `TypeLoader.java:14`, đếm lại trên `data/csv` |
| 8 | CSV có hệ `stellar`, `shadow`, `unknown`, xử lý thế nào? | `TypeLoader` chỉ giữ ID 1-18 và kiểm đủ 18 hệ, đủ 324 ô tương khắc, thiếu là dừng. `PokemonLoader` còn từ chối mọi dòng `pokemon_types.csv` có hệ ngoài 1-18. | `TypeLoader.java:24,27-30,34,38-41`, `PokemonLoader.java:74-76` |
| 9 | Dạng nào được giữ, dạng nào bị lọc? | Lúc nạp không lọc dạng nào: đủ 1351 dạng, mỗi dạng được gán `form_category`. Lọc xảy ra lúc truy vấn: Omni-Dex mặc định chỉ hiện `DEFAULT` và `REGIONAL`, đề xuất đội chỉ xét hai nhóm đó và loài đã tiến hóa hoàn toàn. Team Builder vẫn nhận mọi dạng. | `PokemonLoader.java:53`, `FormCategory.java:15`, `PokemonFilter.java:58`, `RecommendationEngine.java:102`, `docs/database.md:47` |
| 10 | Quy tắc phân loại dạng, vì sao totem và cap đứng trước regional? | Quy tắc áp dụng từ trên xuống: mặc định, totem hoặc mũ, vùng, Mega, Gmax, còn lại. Nếu xét vùng trước thì `raticate-totem-alola` hay `pikachu-alola-cap` thành dạng vùng, sai ý nghĩa. Kết quả: 1025, 58, 97, 34, 137. | `FormCategoryResolver.java:14-31`, `FormCategoryResolverTest.java:27-35`, `data/README.md:91` |
| 11 | `is_fully_evolved` tính thế nào? | Một loài đã tiến hóa hoàn toàn khi ID của nó không xuất hiện ở cột `evolves_from_species_id` của loài nào khác. Bộ thật có 568 loài như vậy. Cờ này dùng để lọc ứng viên đề xuất. | `SpeciesLoader.java:29-32,41`, `data/README.md:81` |
| 12 | Một loài có nhiều cách tiến hóa thì chọn dòng nào? | Chỉ xét dòng `is_default = 1`, rồi giữ dòng có `id` nhỏ nhất cho mỗi loài đích; loài gốc lấy từ `evolves_from_species_id`. DB có `UNIQUE (to_species_id)` để bảo đảm mỗi loài một cạnh. `item_name` để NULL vì bộ 12 file không có `items.csv`. | `EvolutionLoader.java:33-40,47,58`, `backend/src/main/resources/db/migration/V2__create_pokedex_tables.sql:63`, `docs/database.md:309` |
| 13 | Vì sao lưu hệ và 6 chỉ số thành cột? | Mỗi Pokémon có đúng 1-2 hệ và 6 chỉ số, nên cột phẳng cho phép lọc, sắp xếp bằng một truy vấn không JOIN. Đánh đổi là không mở rộng được nếu có hệ thứ ba, nhưng luật game không có trường hợp đó. | `docs/database.md:18-22`, `backend/src/main/resources/db/migration/V2__create_pokedex_tables.sql:27-34` |
| 14 | Chọn kiểu dữ liệu ra sao? | Chỉ số dùng `TINYINT UNSIGNED` vì tối đa 255, và bộ thật có đúng giá trị 255. ID Pokémon dùng `SMALLINT UNSIGNED` vì dạng đặc biệt có ID tới 10326. `base_stat_total` là cột sinh tự động `STORED` có index để lọc và sắp xếp. | `backend/src/main/resources/db/migration/V2__create_pokedex_tables.sql:22,29-36,44`, `docs/database.md:26-32` |
| 15 | DB có những ràng buộc `CHECK` nào? | Hệ số chỉ 0, 50, 100, 200; `form_category` chỉ 5 giá trị; hệ phụ khác hệ chính; slot 1-6. Đây là lớp bảo vệ cuối sau validation ở Service, và có test SQL cho từng ràng buộc. | `backend/src/main/resources/db/migration/V1__create_reference_tables.sql:15`, `backend/src/main/resources/db/migration/V2__create_pokedex_tables.sql:50-51`, `backend/src/main/resources/db/migration/V3__create_team_tables.sql:22`, `SchemaMigrationIT.java:74-103` |
| 16 | Vì sao `share_code` dùng collation `utf8mb4_bin`? | Mã chia sẻ là base62, phân biệt hoa thường. Collation mặc định không phân biệt hoa thường nên `a1B2c3D4` và `A1b2C3d4` sẽ đụng `UNIQUE`. Có test chèn hai mã chỉ khác hoa thường và kiểm cả hai được lưu. | `backend/src/main/resources/db/migration/V3__create_team_tables.sql:5`, `docs/database.md:247`, `SchemaMigrationIT.java:115-121` |
| 17 | Flyway hoạt động thế nào? | Lúc khởi động Flyway đọc `db/migration`, so với bảng `flyway_schema_history` và chạy các phiên bản chưa áp dụng. Hibernate để `ddl-auto: validate`, chỉ kiểm tra Entity khớp schema chứ không tự sửa bảng. Test kiểm đúng 3 phiên bản đã chạy thành công. | `application.yml:14,17`, `SchemaMigrationIT.java:47-53` |
| 18 | Vì sao không sửa migration đã merge? | Flyway lưu checksum từng file đã chạy; sửa file cũ thì DB nào đã chạy nó, kể cả production nhập từ dump có sẵn lịch sử, sẽ báo lệch checksum và dừng khởi động. Thay đổi schema phải là file `V4__...`; trước khi merge kiểm số lớn nhất trên `main` để hai nhánh không cùng tạo V4. Ba file V1-V3 được thêm ở một commit và `git log --diff-filter=M` không có lần sửa nào sau đó. | `docs/database.md:293`, `docs/git-workflow.md:193-197`, commit `2076455` |
| 19 | Các profile khác nhau thế nào? | `dev` bật ingestion và là mặc định khi không chọn profile. `prod` tắt ingestion, bật `forward-headers-strategy: framework` và hạ timeout lấy kết nối xuống 5 giây. `test` tắt ingestion và trỏ tới CSV mẫu. | `application.yml:7`, `application-dev.yml:1-4`, `application-prod.yml:1-11`, `application-test.yml:1-6` |
| 20 | Cấu hình kết nối DB lấy từ đâu? | `application.yml` dùng placeholder `DB_HOST`, `DB_PORT`... có giá trị mặc định. Khi chạy từ `backend/`, file `../.env` được import tự động; trong Docker hoặc Railway, giá trị đến từ biến môi trường. | `application.yml:5,9-11`, `docker-compose.yml:38-45`, `docs/architecture.md:495-497` |
| 21 | CORS cấu hình thế nào? | Chỉ `/api/**`, chỉ origin trong `CORS_ALLOWED_ORIGINS`, method GET, POST, OPTIONS, preflight cache 1 giờ. Expose `Location` và `Retry-After` để JavaScript đọc được hai header này. Origin lạ nhận 403, có test. | `CorsConfig.java:23-28`, `CorsConfigTest.java:36-43` |
| 22 | `forward-headers-strategy: framework` để làm gì? | Trên Railway, request đi qua proxy nên `getRemoteAddr()` là IP proxy. Cấu hình này bật `ForwardedHeaderFilter` của Spring để lấy IP thật từ `Forwarded` hoặc `X-Forwarded-For`, và giới hạn lưu đội dùng IP đó làm khóa. Chỉ bật ở `prod` vì local không có proxy. | `application-prod.yml:2`, `TeamController.java:41`, `docs/architecture.md:382` |
| 23 | Header forwarded có thể bị giả không? | Có, nếu proxy không ghi đè header client gửi. Em chấp nhận vì đây chỉ là chống spam cơ bản; theo Railway, edge ghi đè `X-Forwarded-For`, và kế hoạch kiểm chứng là gửi 11 request với IP giả khác nhau, request thứ 11 phải bị 429, làm cả với header `Forwarded`. | `docs/adr/0007-hosting-railway-cloudflare-pages.md:41`, `docs/architecture.md:522-523` |
| 24 | `RequestBodyLimitFilter` chặn body lớn thế nào khi client không gửi `Content-Length`? | Filter không tin `Content-Length`: nếu khai báo nhỏ hoặc không có, nó đọc tối đa 16.385 byte; đọc được hơn 16.384 là quá lớn. Nếu khai báo lớn thì không đọc gì. Body hợp lệ được đưa lại cho Controller qua một request bọc. | `RequestBodyLimitFilter.java:27,40-44`, `RequestBodyLimitFilterTest.java:22-39` |
| 25 | Vì sao 413 không trả thẳng trong filter? | Filter chỉ đánh dấu body quá lớn; exception được ném khi Controller đọc body, tức là bên trong `DispatcherServlet`, nên đi qua `GlobalExceptionHandler` và ra cùng định dạng `ProblemDetail` với `code`. Hệ quả: endpoint không đọc body sẽ không trả 413. Lý do thiết kế không ghi trong tài liệu, đây là điều code thể hiện. | `RequestBodyLimitFilter.java:104-110`, `SynergyControllerTest.java:181-190` |
| 26 | Giới hạn 16 KB có chặt quá không? | Body hợp lệ lớn nhất là lưu đội 6 thành viên, dưới 1 KB, nên 16 KB dư nhiều lần. Mục tiêu là chặn request làm cạn bộ nhớ, không ảnh hưởng người dùng thật. | `docs/architecture.md:374` |
| 27 | Lỗi được trả về theo định dạng nào? | Mọi lỗi là `ProblemDetail` theo RFC 9457, `Content-Type: application/problem+json`, thêm thuộc tính `code`. Frontend dịch thông báo theo `code` chứ không hiện `detail`. | `GlobalExceptionHandler.java:38-39,69-71`, `GlobalExceptionHandlerTest.java:29-43`, `docs/api.md:402` |
| 28 | Lỗi 500 có lộ thông tin nội bộ không? | Không. `handleUnexpected` log `ERROR` kèm stack trace phía server nhưng trả detail cố định `Unexpected server error` và `code = INTERNAL_ERROR`. Test ném exception chứa chuỗi bí mật và kiểm response không chứa chuỗi đó hay tên exception. | `GlobalExceptionHandler.java:47-54`, `GlobalExceptionHandlerTest.java:100-108` |
| 29 | Sai method (405) hay sai `Content-Type` (415) trả `code` gì? | Không có mã riêng; `fallbackCode` giữ mã HTTP gốc và dùng `INVALID_PARAMETER`. 404 khác dùng `ROUTE_NOT_FOUND`, 5xx dùng `INTERNAL_ERROR`. | `GlobalExceptionHandler.java:91-99`, `HealthControllerTest.java:49-56`, `docs/api.md:401` |
| 30 | `NotFoundException` khác `ApiException` ở đâu? | Nó chỉ nhận mã có status 404; truyền mã khác hoặc `null` thì ném `IllegalArgumentException` ngay khi tạo. Đó là cách chặn lỗi lập trình kiểu "không tìm thấy mà trả 400". | `NotFoundException.java:9-14`, `NotFoundExceptionTest.java:19-28` |
| 31 | Health endpoint trả gì, khi nào 503? | Trả `status`, `dataLoaded`, `pokemonCount`. Chỉ khi không truy vấn được DB mới là `DOWN` và 503; bảng chưa tồn tại hoặc rỗng vẫn `UP` 200 với `dataLoaded = false`. `dataLoaded` đúng khi bảng có dòng và mọi cache trong bộ nhớ đã nạp. | `HealthController.java:24-30`, `HealthService.java:26-35,55-63`, `HealthServiceTest.java:69-99` |
| 32 | Mất DB thì bao lâu health báo 503? | Ở `prod`, Hikari chỉ chờ lấy kết nối 5 giây, nên khoảng 5 giây; mặc định là 30 giây. Railway dựa vào mã này để biết dịch vụ hỏng. | `application-prod.yml:7`, `docs/adr/0007-hosting-railway-cloudflare-pages.md:42` |
| 33 | Điểm yếu của health check? | Health trả 200 cả khi `dataLoaded = false`, nên deploy lên DB rỗng vẫn qua Healthcheck của Railway dù API dữ liệu trả 503. Em xử lý bằng quy trình: nhập dump trước lần deploy đầu. Ngoài ra health có tác dụng phụ là thử nạp lại cache, mỗi lần gọi khi cache chưa nạp sẽ truy vấn lại DB. | `HealthController.java:26-28`, `HealthService.java:48`, `docs/architecture.md:514` |
| 34 | Header cache HTTP đặt ở đâu, bao lâu? | `/types` và `/types/matrix` đặt `public, max-age=86400` vì bảng tương khắc không đổi. Chi tiết Pokémon, `speed-tiers`, `generations` đặt `public, max-age=3600`. Endpoint còn lại không đặt. | `TypeController.java:22,33,39`, `PokemonController.java:37,100,108,116` |
| 35 | Giới hạn phân trang và sắp xếp? | `size` mặc định 24, từ 1 đến 100; `page` từ 0 đến `Integer.MAX_VALUE / size` để offset không tràn `int`. `sort` chỉ nhận `id`, `name`, `baseStatTotal`, `speed`, và luôn thêm `id` làm tiêu chí phụ để thứ tự trang ổn định. Sai là 400 `INVALID_PARAMETER`. | `PageRequestFactory.java:13-15,20-54`, `PokemonQueryService.java:38`, `PageRequestFactoryTest.java:39-46` |
| 36 | `db-dump.sh export` xuất những gì, vì sao bỏ đội đã lưu? | Xuất 8 bảng tĩnh cùng `flyway_schema_history`, còn `teams`, `team_members` chỉ có cấu trúc. Đội thử nghiệm ở máy dev không được lên production. Có lịch sử Flyway nên production không chạy lại migration. | `db-dump.sh:14-22`, `docs/adr/0007-hosting-railway-cloudflare-pages.md:22` |
| 37 | `db-dump.sh import` an toàn ra sao? | Kiểm định dạng URL, đếm bảng ở DB đích và từ chối nếu đã có bảng, trừ khi đặt `FORCE=1`. Nó chạy client `mysql` bên trong container local nên máy không cần cài MySQL client, và in số Pokémon cùng số migration để đối chiếu 1351 và 3. Hạn chế: regex không cho mật khẩu chứa `@`. | `db-dump.sh:28-40`, `docs/architecture.md:517` |
| 38 | CI chạy những gì? | Mỗi push, PR vào `main` chạy hai job song song. Backend dùng Temurin 25 và `./mvnw -B -ntp verify`, gồm unit test và test tích hợp Testcontainers vì runner có Docker. Frontend chạy `npm ci`, lint, test, build. Lần chạy cũ cùng nhánh bị hủy. | `ci.yml:3-15,35-49,68-94`, `backend/README.md:50` |
| 39 | Test tích hợp dùng DB nào? Máy không có Docker thì sao? | Testcontainers dựng `mysql:8.4` thật, `@ServiceConnection` tự gắn vào datasource, nên test chạy trên cùng engine với production. Không có Docker thì các class `*IT` bị Skipped chứ không đỏ, và khi báo cáo phải nêu số test Skipped. | `TestcontainersConfiguration.java:12-18`, `PokeNexusApplicationIT.java:18`, `backend/CLAUDE.md:20` |
| 40 | Muốn thêm một bảng dữ liệu tĩnh mới thì làm gì? | Tạo migration `V4__...` mới, viết một loader `@Component` dùng `CsvReader` và `JdbcTemplate.batchUpdate`, chèn vào transaction của `IngestionRunner` đúng vị trí theo khóa ngoại. Thêm file vào hai script tải CSV và CSV mẫu cho test, rồi cập nhật `docs/database.md`. Lưu ý DB đã có `pokemon` sẽ không nạp lại, nên cần nạp lại DB trống rồi xuất dump mới. | `IngestionRunner.java:57-76`, `download-csv.sh:8`, `docs/database.md:293` |

### V. Lệch giữa code và tài liệu

- `stats.csv`: `docs/database.md:305` ghi bước 6 dùng `stats.csv`, `data/README.md:24` ghi "Tra cứu `stat_id`". Code không đọc file này ở đâu; ID 1-6 được mã hóa cứng trong `StatType.java:7-12` và kiểm ở `PokemonLoader.java:90-91`. Script vẫn tải file (`download-csv.sh:8`).
- `docs/architecture.md:109` ghi `ingestion` "chỉ ghi DB qua Repository của chính nó (dùng JDBC batch)". Package `ingestion` không có Repository; loader gọi thẳng `JdbcTemplate.batchUpdate` (ví dụ `TypeLoader.java:31,42-44`).
- `docs/architecture.md:138` giải thích cache nạp sau ingestion vì `IngestionRunner` có "`@Order` nhỏ hơn". `@Order(0)` (`IngestionRunner.java:22,25`) chỉ sắp thứ tự giữa các runner; lý do thật là Spring Boot gọi mọi `ApplicationRunner` trước khi phát `ApplicationReadyEvent` mà hai cache lắng nghe. Kết quả không đổi, chỉ lời giải thích chưa chính xác.
- `docs/architecture.md:401-405` (bảng Cache HTTP) chỉ liệt kê `/types`, `/types/matrix`, `/pokemon/{idOrName}` và ghi "Các endpoint còn lại: Không đặt". Code còn đặt `public, max-age=3600` cho `/pokemon/speed-tiers` (`PokemonController.java:100`) và `/pokemon/generations` (`:108`); `docs/api.md:176,183` đã ghi đúng.
- `docs/architecture.md:362` ghi lỗi 5xx log `ERROR` kèm stack trace. `ApiException` mã 503 `DATA_NOT_READY` chỉ log `DEBUG` (`GlobalExceptionHandler.java:37`); ngoài ra `com.pokenexus` ở mức `INFO` (`application.yml:40`) nên mọi log `DEBUG` của handler (4xx) không hiện với cấu hình hiện tại.
- "CSV mẫu khoảng 20 Pokémon" (`docs/architecture.md:540`, `docs/folder-structure.md:86`, `backend/CLAUDE.md:91`): CSV mẫu có 62 dòng `pokemon.csv` và 23 loài; `IngestionRunnerIT.java:100` kiểm 62.
- `docs/folder-structure.md:37` mô tả `docker-compose.yml` là "MySQL, Adminer"; file còn có service `backend` (profile `app`) (`docker-compose.yml:28-50`). `docs/architecture.md:464` đã ghi đúng.
- `docs/folder-structure.md:62` liệt kê `maven-wrapper.jar` trong `.mvn/wrapper/`; thực tế chỉ có `maven-wrapper.properties` với `distributionType=only-script` (`maven-wrapper.properties:2`).
- `backend/README.md:15` ghi Spring Boot 4.1.1; `pom.xml:8` là 4.1.2 (Dependabot nâng ở commit `59d35da`, 2026-10-26).
- `docs/api.md:387` ghi `VALIDATION_FAILED` "có thêm mảng `errors`". Chỉ nhánh `MethodArgumentNotValidException` thêm `errors` (`GlobalExceptionHandler.java:61`); nhánh `HandlerMethodValidationException` (`:83-84`) và `VALIDATION_FAILED` ném từ Service (`SynergyAnalyzer.java:47,51`) không có `errors`.
- `docs/database.md:310` và `backend/CLAUDE.md:74` ghi lỗi nạp có "log nêu rõ file, dòng". Đúng với lỗi qua `CsvReader.Row.error`, nhưng hai lỗi đếm của `TypeLoader` chỉ nêu tên file (`TypeLoader.java:28-29,39-40`) và lỗi "CSV file not found" chỉ nêu đường dẫn (`CsvReader.java:33`).

---

## Phần 4. Backend nghiệp vụ: Pokédex, Type chart, Synergy, Team

- Phạm vi: `backend/src/main/java/com/pokenexus/{pokedex,typechart,synergy,team}/**` (65 file) và test tương ứng trong `backend/src/test/java/com/pokenexus/{pokedex,typechart,synergy,team}/**` (20 file). Lớp `common`, ingestion, migration, frontend thuộc chương khác; chỉ trích khi luồng đi qua.
- Nguồn đối chiếu: `docs/architecture.md` (Phần 5 là thuật toán Synergy), `docs/api.md`, `docs/database.md`, `docs/spec.md` (5 ví dụ có đáp án nằm ở Phần 2, mục V.4, dòng 85-93), `docs/adr/0003-in-memory-synergy.md`, `PLAN.md`.
- Số liệu "suy ra từ code" được tính tay theo đúng công thức trong code và bảng `backend/src/test/resources/csv/type_efficacy.csv` (bảng tương khắc mẫu, cùng định dạng PokéAPI). Số liệu cần bộ dữ liệu thật (1.351 Pokémon) ghi "cần dữ liệu DB".

### I. Bức tranh chung

#### I. Sơ đồ phụ thuộc

```mermaid
flowchart LR
    subgraph pokedex
        PC[PokemonController] --> PQS[PokemonQueryService]
        PC --> CS[CompareService]
        PC --> ES[EvolutionService]
        PC --> STS[SpeedTierService]
        PC --> GPS[GenerationProfileService]
        CS --> PQS
        ES --> PQS
        PQS --> PR[(PokemonRepository)]
        PQS --> PSPEC[PokemonSpecifications]
        ES --> SR[(SpeciesRepository)]
        ES --> ELR[(EvolutionLinkRepository)]
        ES --> PR
        STS --> PR
        GPS --> PR
        PQS --> PM[PokemonMapper]
        ES --> PM
        STS --> PM
        GPS --> PM
    end
    subgraph typechart
        TC[TypeController] --> TCS[TypeChartService]
        TCS --> TER[(TypeEfficacyRepository)]
    end
    subgraph synergy
        SC[SynergyController] --> SA[SynergyAnalyzer]
        SC --> RE[RecommendationEngine]
        RE --> SA
        RE --> PPR[PokemonProfileRegistry]
        RE --> RS[RoleScorer]
        RE --> RB[ReasonBuilder]
        SA --> PPR
        SA --> TIB[TeamInsightBuilder]
    end
    subgraph team
        TMC[TeamController] --> SRL[SaveRateLimiter]
        TMC --> TS[TeamService]
        TS --> TR[(TeamRepository)]
        TS --> SCG[ShareCodeGenerator]
        TS --> TM[TeamMapper]
    end
    PQS --> TCS
    CS --> TCS
    PPR --> PQS
    PPR --> TCS
    TS --> PQS
    TS --> SA
```

- **Phân tầng một chiều:** Controller chỉ gọi Service; Service gọi Repository hoặc cache trong bộ nhớ (`docs/architecture.md:79-89`). Không Controller nào trong phạm vi gọi Repository.
- **Ranh giới package:** `synergy` dùng `pokedex` qua `PokemonQueryService.findAllCatalogEntries` (`backend/src/main/java/com/pokenexus/synergy/service/PokemonProfileRegistry.java:59`) và `typechart` qua `TypeChartService` (`:55-66`); `team` dùng `PokemonQueryService.findRefs`, `requireDataLoaded` và `SynergyAnalyzer.analyze` (`backend/src/main/java/com/pokenexus/team/service/TeamService.java:72-81`). Khớp sơ đồ `docs/architecture.md:93-105`.
- **Hai cache tĩnh:** `TypeChartService` (ma trận 18 x 18) và `PokemonProfileRegistry` (hồ sơ mọi Pokémon) cài interface `StaticDataCache`, nạp ở `ApplicationReadyEvent` và nạp lại khi cần (`backend/src/main/java/com/pokenexus/typechart/service/TypeChartService.java:42-49`, `backend/src/main/java/com/pokenexus/synergy/service/PokemonProfileRegistry.java:38-45`).
- **Synergy không chạm DB khi xử lý request:** `SynergyAnalyzer`, `RecommendationEngine` chỉ đọc `PokemonProfileRegistry` ([ADR 0003](../adr/0003-in-memory-synergy.md), `docs/adr/0003-in-memory-synergy.md:13-14`). Ngoại lệ: lần gọi đầu khi cache chưa nạp sẽ kích hoạt `reload()` đọc DB (`PokemonProfileRegistry.java:85-95`).
- **Pokédex là đọc thuần:** mọi Entity có `@Immutable` (ví dụ `backend/src/main/java/com/pokenexus/pokedex/entity/Pokemon.java:26`), Service đọc có `@Transactional(readOnly = true)`.
- **Team là phần ghi duy nhất:** `TeamService.create` có `@Transactional` (`TeamService.java:62`), lưu `teams` và `team_members` bằng cascade.
- **Lỗi thống nhất:** Service ném `ApiException(ErrorCode, detail)`; `GlobalExceptionHandler` đổi thành `ProblemDetail` có `code` (`backend/src/main/java/com/pokenexus/common/exception/GlobalExceptionHandler.java:34-45`). Mã HTTP gắn trong enum `ErrorCode` (`backend/src/main/java/com/pokenexus/common/exception/ErrorCode.java:6-18`).
- **Dữ liệu chưa nạp:** mọi đường đọc dữ liệu trả 503 `DATA_NOT_READY` thay vì 404 hoặc 400 khi bảng `pokemon` rỗng (`backend/src/main/java/com/pokenexus/pokedex/service/PokemonQueryService.java:139-143`).
- **Kết quả xác định (deterministic):** mọi danh sách có thứ tự phụ (ID tăng dần, tên hệ, ID hệ) để test ổn định; test `isDeterministicAcrossCalls` (`backend/src/test/java/com/pokenexus/synergy/service/RecommendationEngineTest.java:175-180`).

#### II. Bảng endpoint

| # | Method, path | Controller | Service | Request | Response | Mã trạng thái | `Cache-Control` | Validation |
|---|---|---|---|---|---|---|---|---|
| 1 | `GET /api/v1/pokemon` | `PokemonController.list` (`backend/src/main/java/com/pokenexus/pokedex/controller/PokemonController.java:55-74`) | `PokemonQueryService.search` | Query `type` (lặp, tối đa 2), `gen`, `minBst`, `maxBst`, `minSpeed`, `form` (lặp), `page`, `size`, `sort` | `PageResponse<PokemonSummary>` | 200; 400 `INVALID_PARAMETER`; 503 `DATA_NOT_READY` | Không đặt | `PokemonFilter.of` (`backend/src/main/java/com/pokenexus/pokedex/dto/PokemonFilter.java:26-36`), `PageRequestFactory.of` (`backend/src/main/java/com/pokenexus/common/web/PageRequestFactory.java:20-34`) |
| 2 | `GET /api/v1/pokemon/search` | `search` (`:76-86`) | `searchByName` | `q` (bắt buộc), `limit`, `form` | `List<PokemonRef>` (có thể rỗng) | 200; 400; 503 | Không đặt | `q` 2-30 ký tự sau `strip`, `limit` 1-10 (`PokemonQueryService.java:89-97`) |
| 3 | `GET /api/v1/pokemon/compare` | `compare` (`:88-94`) | `CompareService.compare` | `left`, `right` bắt buộc | `CompareResponse` | 200; 400 (thiếu, trùng, sai định dạng); 404 `POKEMON_NOT_FOUND`; 503 | Không đặt | `backend/src/main/java/com/pokenexus/pokedex/service/CompareService.java:36-43` |
| 4 | `GET /api/v1/pokemon/speed-tiers` | `speedTiers` (`:96-102`) | `SpeedTierService.findTiers` | Không | `List<SpeedTier>` | 200; 503 | `public, max-age=3600` | Không |
| 5 | `GET /api/v1/pokemon/generations` | `generations` (`:104-110`) | `GenerationProfileService.findProfiles` | Không | `List<GenerationProfile>` | 200; 503 | `public, max-age=3600` | Không |
| 6 | `GET /api/v1/pokemon/{idOrName}` | `detail` (`:112-118`) | `PokemonQueryService.findDetail` | Path | `PokemonDetail` | 200; 400; 404; 503 | `public, max-age=3600` | Toàn chữ số (tối đa 9) hoặc `^[a-z0-9-]{1,60}$` (`PokemonQueryService.java:126-137`) |
| 7 | `GET /api/v1/pokemon/{idOrName}/evolution` | `evolution` (`:120-124`) | `EvolutionService.findChain` | Path | `EvolutionResponse` | 200; 400; 404; 503 | Không đặt | Như dòng 6 |
| 8 | `GET /api/v1/types` | `TypeController.types` (`backend/src/main/java/com/pokenexus/typechart/controller/TypeController.java:30-34`) | `TypeChartService.types` | Không | `List<TypeResponse>` (18) | 200; 503 | `public, max-age=86400` | Không |
| 9 | `GET /api/v1/types/matrix` | `matrix` (`:36-40`) | `TypeChartService.matrix` | Không | `TypeMatrixResponse` | 200; 503 | `public, max-age=86400` | Không |
| 10 | `POST /api/v1/synergy/analyze` | `SynergyController.analyze` (`backend/src/main/java/com/pokenexus/synergy/controller/SynergyController.java:31-35`) | `SynergyAnalyzer.analyze` | `AnalyzeRequest` | `AnalyzeResponse` | 200; 400 `VALIDATION_FAILED`, `MALFORMED_JSON`, `DUPLICATE_POKEMON`, `UNKNOWN_POKEMON`; 413; 503 | Không đặt | `@NotNull @Size(min = 1, max = 6) List<@NotNull Integer>` (`backend/src/main/java/com/pokenexus/synergy/dto/AnalyzeRequest.java:9`) |
| 11 | `POST /api/v1/synergy/recommendations` | `recommend` (`:37-41`) | `RecommendationEngine.recommend` | `RecommendationRequest` | `RecommendationResponse` | Như dòng 10 | Không đặt | `pokemonIds` 1-5, `limit` 1-10, `minBaseStatTotal` 0-1530, `playStyle` enum (`backend/src/main/java/com/pokenexus/synergy/dto/RecommendationRequest.java:13-17`) |
| 12 | `POST /api/v1/teams` | `TeamController.create` (`backend/src/main/java/com/pokenexus/team/controller/TeamController.java:37-44`) | `SaveRateLimiter.acquire`, `TeamService.create` | `CreateTeamRequest` | 201 `TeamResponse`, header `Location: /api/v1/teams/shared/{code}` | 201; 400 `VALIDATION_FAILED`, `MALFORMED_JSON`, `DUPLICATE_SLOT`, `DUPLICATE_POKEMON`, `UNKNOWN_POKEMON`; 413; 429 + `Retry-After`; 500 (sinh mã trùng 3 lần); 503 | Không đặt | `backend/src/main/java/com/pokenexus/team/dto/CreateTeamRequest.java:11-12`, `backend/src/main/java/com/pokenexus/team/dto/TeamMemberRequest.java:9-11` |
| 13 | `GET /api/v1/teams/shared/{shareCode}` | `shared` (`:46-50`) | `TeamService.findByShareCode` | Path | `TeamResponse` | 200; 400 `INVALID_PARAMETER`; 404 `TEAM_NOT_FOUND` | Không đặt | `^[A-Za-z0-9]{8}$` (`backend/src/main/java/com/pokenexus/team/service/ShareCodeGenerator.java:13`) |

- 413 `PAYLOAD_TOO_LARGE` đến từ `RequestBodyLimitFilter` (body POST, PUT, PATCH tối đa 16 KB, `backend/src/main/java/com/pokenexus/common/web/RequestBodyLimitFilter.java:27-45`), chạy trước Controller.
- Lỗi khung Spring (thiếu tham số, sai kiểu như `gen=abc`, 405, 415) giữ mã HTTP gốc và nhận `code` `INVALID_PARAMETER` qua `fallbackCode` (`GlobalExceptionHandler.java:91-99`); test `rejectsUnknownTypeAndNonNumericGeneration` (`backend/src/test/java/com/pokenexus/pokedex/controller/PokemonControllerIT.java:351-361`).
- Đường dẫn cố định `/search`, `/compare`, `/speed-tiers`, `/generations` được Spring ưu tiên hơn mẫu `/{idOrName}` (`docs/api.md:68`).

### II. Từng file

#### I. Package `pokedex`

**1. `PokemonController` (`backend/src/main/java/com/pokenexus/pokedex/controller/PokemonController.java`)**

- **Vai trò:** cửa vào REST của Pokédex, chỉ chuyển tham số sang Service và gắn header cache.
- **Thành phần chính:**
  - `list(...)` (`:55-74`): dựng `PokemonFilter.of` rồi `PageRequestFactory.of(page, size, sort, SORTABLE_PROPERTIES)`, gọi `search`.
  - `search(q, limit, form)` (`:76-86`): gợi ý tên, trả `List<PokemonRef>`.
  - `compare(left, right)` (`:88-94`): hai tham số `@RequestParam String` bắt buộc.
  - `speedTiers()`, `generations()`, `detail(idOrName)` (`:96-118`): bọc `ResponseEntity` với `Cache-Control: public, max-age=3600` (hằng `CACHE_ONE_HOUR`, `:37`).
  - `evolution(idOrName)` (`:120-124`): không đặt cache.
- **Phụ thuộc:** 5 Service của `pokedex` (`:39-53`), `PageRequestFactory`, `PageResponse` của `common`. Frontend gọi qua HTTP.
- **Dữ liệu:** không giữ trạng thái; không có cache phía server ở Controller.
- **Biên và lỗi:** thiếu `q`, `left`, `right` hoặc sai kiểu số do Spring ném trước khi vào method, ra 400 `INVALID_PARAMETER`.
- **Test:** `PokemonControllerIT` (21 test, Testcontainers MySQL, CSV mẫu): header cache (`backend/src/test/java/com/pokenexus/pokedex/controller/PokemonControllerIT.java:38`, `:335`, `:367`), lọc, tìm kiếm, so sánh, tiến hóa, tốc độ, thế hệ.

**2. `PokemonQueryService` (`backend/src/main/java/com/pokenexus/pokedex/service/PokemonQueryService.java`)**

- **Vai trò:** Service đọc trung tâm của Pokédex, cũng là "cổng" duy nhất mà `synergy` và `team` dùng để lấy dữ liệu Pokémon.
- **Thành phần chính:**
  - `search(filter, pageable)` (`:61-68`): `findAll(PokemonSpecifications.matching(filter), pageable)`; tổng bằng 0 thì gọi `requireDataLoaded()`; map bằng `PokemonMapper::toSummary` qua `PageResponse.from`.
  - `findDetail(idOrName)` (`:70-75`): `findPokemon`, lấy mọi dạng cùng loài `findBySpeciesIdOrderByIdAsc`, tính lưới phòng thủ `typeChartService.defenseOf(types)`.
  - `findPokemon(idOrName)` (`:77-85`): trả Entity; không thấy thì `requireDataLoaded()` rồi ném `NotFoundException(POKEMON_NOT_FOUND)`.
  - `searchByName(query, limit, forms)` (`:87-109`): kiểm tra độ dài, chuẩn hóa, truy vấn JPQL, chuyển `PokemonRef`.
  - `findRefs(ids)` (`:111-119`): `findByIdIn`, trả `Map<id, PokemonRef>` bất biến; tập rỗng trả `Map.of()`.
  - `findAllCatalogEntries()` (`:121-124`): đọc toàn bảng bằng `JOIN FETCH species`, map sang `PokemonCatalogEntry` cho registry.
  - `requireDataLoaded()` (`:139-143`): `pokemonRepository.count() == 0` thì ném `DATA_NOT_READY`.
- **Phụ thuộc:** `PokemonRepository`, `PokemonMapper`, `TypeChartService`. Được dùng bởi `PokemonController`, `CompareService`, `EvolutionService`, `PokemonProfileRegistry` (`:59`), `TeamService` (`:72`, `:76`, `:98`).
- **Dữ liệu:** hằng `SORTABLE_PROPERTIES = {id, name, baseStatTotal, speed}` (`:38`); `MIN_QUERY_LENGTH 2`, `MAX_QUERY_LENGTH 30`, `DEFAULT_SEARCH_LIMIT = MAX_SEARCH_LIMIT = 10` (`:39-42`); regex `NUMERIC_ID`, `POKEMON_NAME [a-z0-9-]{1,60}`, `SEARCHABLE`, `WHITESPACE` (`:44-47`); `MAX_ID_DIGITS 9` (`:48`).
- **Biên và lỗi:**
  - `idOrName` toàn số nhưng dài hơn 9 ký tự: coi như không tồn tại (tránh tràn `Integer.parseInt`), ra 404 (`:128-130`).
  - Tên có chữ hoa, gạch dưới: 400 `INVALID_PARAMETER` (`:133-135`); test `Char_izard` (`PokemonControllerIT.java:86-89`).
  - `searchByName`: `q` sau `strip` ngoài 2-30 ký tự hoặc `limit` ngoài 1-10 thì 400 (`:90-97`); khoảng trắng bên trong đổi thành `-` (`:99`); còn ký tự ngoài `[a-z0-9-]` thì trả `[]` không báo lỗi (`:100-102`). Nhờ regex này `%` và `_` không lọt vào mẫu `LIKE`.
  - Kết quả rỗng (tìm, lọc, chi tiết) chỉ báo 503 khi bảng rỗng; DB có dữ liệu thì trả rỗng hoặc 404 như thường.
- **Test:** `PokemonControllerIT` (`suggestsPrefixMatchesBeforeContainsMatches` `:93-109`, `rejectsInvalidSearchParameters` `:141-150`, `returnsNotFoundForUnknownPokemonAndBadRequestForMalformedName` `:77-90`, `hidesMegaGmaxAndOtherFormsByDefault` `:296-309`). Không có unit test riêng.

**3. `CompareService` (`backend/src/main/java/com/pokenexus/pokedex/service/CompareService.java`)**

- **Vai trò:** Bàn Cân Sức Mạnh: lấy 2 `PokemonDetail` và kết luận 3 ý (hệ, tổng chỉ số, tốc độ).
- **Thành phần chính:**
  - `compare(left, right)` (`:34-45`): chặn chuỗi giống hệt trước khi truy vấn (`:36-38`), lấy hai chi tiết, chặn tiếp nếu cùng `id` (`:41-43`, ví dụ `445` và `garchomp`).
  - `verdict(left, right)` (`:47-58`, package-private để test): `bestStabMultiplier` mỗi chiều, `compareStat` cho BST và tốc độ, 3 câu tiếng Việt.
  - `bestStabMultiplier(attacker, defender)` (`:60-66`): với mỗi hệ của bên tấn công, tính `typeChartService.multiplier(hệ, các hệ bên phòng thủ)` (tích hệ số), lấy max.
  - `compareStat` (`:68-70`): `difference = |a - b|`, `winner = Winner.of(a, b)`.
  - `displayName` (`:112-117`): viết hoa chữ đầu mỗi đoạn cách bởi `-` (`rotom-wash` thành `Rotom-Wash`); `formatMultiplier` (`:119-121`): `BigDecimal.stripTrailingZeros` (2.0 thành `2`, 0.25 thành `0.25`).
- **Phụ thuộc:** `PokemonQueryService.findDetail` (`:39-40`), `TypeChartService.multiplier` (`:63`).
- **Dữ liệu:** `CompareResponse(left, right, verdict)`.
- **Biên và lỗi:** cùng một Pokémon: 400 `INVALID_PARAMETER` "left and right must be different Pokémon" (`:123-125`); không tồn tại: 404 từ `findPokemon`. "Đòn cùng hệ" chỉ tính theo hệ của Pokémon, không xét chiêu thức thật hay Ability.
- **Test:** `CompareServiceTest`: Garchomp và Salamence hòa hệ x2, hòa BST 600, Garchomp nhanh hơn 2 (`backend/src/test/java/com/pokenexus/pokedex/service/CompareServiceTest.java:40-52`); Charizard và Vaporeon: Vaporeon thắng hệ x2 so với x1 (`:54-65`); chặn trùng không gọi DB và chặn `445` với `garchomp` (`:67-79`); định dạng tên và hệ số (`:81-88`). Tích hợp: `PokemonControllerIT.java:152-189`.

**4. `EvolutionService` (`backend/src/main/java/com/pokenexus/pokedex/service/EvolutionService.java`)**

- **Vai trò:** trả chuỗi tiến hóa của loài chứa Pokémon được hỏi, dạng danh sách phẳng để frontend tự dựng cây.
- **Thành phần chính:**
  - `findChain(idOrName)` (`:46-57`): lấy `Species` qua `findPokemon`; loài không có chuỗi (`evolution_chain_id` NULL) thì trả `chainId = NO_CHAIN_ID = 0` với một giai đoạn (`:28`, `:50-52`).
  - Có chuỗi: `findByChainId(chainId)` lấy mọi `EvolutionLink`, đưa vào `Map<toSpeciesId, link>` (`:53-54`); `findByEvolutionChainIdOrderByIdAsc` lấy mọi loài trong chuỗi (`:56`).
  - `stagesOf` (`:59-71`): một truy vấn `findBySpeciesIdInAndDefaultFormTrue(ids)` lấy dạng mặc định của mọi loài; nếu một loài có nhiều dạng `is_default` thì giữ ID nhỏ hơn (`:63-64`); loài không có dạng mặc định bị bỏ qua (`:67-69`); xếp theo `speciesId`.
  - `toStage` (`:73-80`): loài gốc có `evolvesFromSpeciesId`, `trigger`, `minLevel`, `item` là `null`.
- **Phụ thuộc:** `PokemonQueryService`, `SpeciesRepository`, `EvolutionLinkRepository`, `PokemonRepository`, `PokemonMapper`.
- **Dữ liệu:** `evolution_links.to_species_id` là UNIQUE (`backend/src/main/resources/db/migration/V2__create_pokedex_tables.sql:63`) nên `Collectors.toMap` không bị trùng khóa.
- **Biên và lỗi:** truy cập từ dạng Mega vẫn ra chuỗi của loài (`10034` cho cùng kết quả với `charizard`, `PokemonControllerIT.java:206-209`); thứ tự theo `speciesId` nên Pichu (172) đứng sau Raichu (26) dù là gốc (`:213-228`); frontend dựng cây từ `evolvesFromSpeciesId`.
- **Test:** `PokemonControllerIT.java:191-247` (Charizard, Raichu-Alola, Mewtwo, tên sai định dạng 400, không tồn tại 404). Không có unit test riêng.

**5. `SpeedTierService` (`backend/src/main/java/com/pokenexus/pokedex/service/SpeedTierService.java`)**

- **Vai trò:** gom dạng `DEFAULT` và `REGIONAL` theo tốc độ gốc cho Bảng tốc độ cấp 50 (F09).
- **Thành phần chính:**
  - `findTiers()` (`:35-44`): `findByFormCategoryIn({DEFAULT, REGIONAL})` (`:25`, `:37`), map sang `SpeedEntry(speed, PokemonRef)`; rỗng thì 503.
  - `group(entries)` (`:46-54`): sắp theo `id` tăng dần trước (`:48`), rồi `groupingBy(speed)` vào `TreeMap` thứ tự giảm dần (`:49`); danh sách trong mỗi mốc giữ thứ tự ID.
- **Phụ thuộc:** `PokemonRepository`, `PokemonMapper`.
- **Dữ liệu:** không cache ở server, mỗi request một truy vấn; client cache 1 giờ qua header. Với CSV đầy đủ: 1.083 dạng, 119 mốc (`docs/api.md:177`).
- **Biên và lỗi:** không có Mega, Gmax (`PokemonControllerIT.java:346-347`); tính tốc độ cấp 50, tỷ lệ "nhanh hơn N%" làm ở frontend (`docs/spec.md:155`, `:162`).
- **Test:** `SpeedTierServiceTest`: gom và sắp (`backend/src/test/java/com/pokenexus/pokedex/service/SpeedTierServiceTest.java:28-40`), rỗng (`:42-45`), 503 (`:47-56`); `PokemonControllerIT.java:331-349`.

**6. `GenerationProfileService` (`backend/src/main/java/com/pokenexus/pokedex/service/GenerationProfileService.java`)**

- **Vai trò:** hồ sơ từng thế hệ cho trang Tổng quan: số loài, huyền thoại, thần thoại, BST trung bình, 3 hệ phổ biến, Pokémon mạnh nhất.
- **Thành phần chính:**
  - `findProfiles()` (`:41-57`): đọc trường `volatile profiles` (`:34`); có rồi thì trả luôn; chưa có thì truy vấn `findWithSpeciesByFormCategory(DEFAULT)`, tính, gán vào cache.
  - `summarize(entries)` (`:59-65`): `groupingBy(generation)` vào `TreeMap` nên thế hệ tăng dần.
  - `profileOf` (`:67-94`):
    - `topTypes`: đếm cả hệ thứ hai vào `TreeMap` theo tên, sắp số lượng giảm dần rồi tên tăng dần, lấy 3 (`TOP_TYPE_COUNT`, `:29`, `:68-75`).
    - `averageBaseStatTotal`: trung bình, làm tròn 1 chữ số `HALF_UP` (`:76`, `:90`).
    - `strongest`: max BST trong nhóm không huyền thoại, không thần thoại; hòa thì ID nhỏ hơn thắng nhờ comparator ID đảo ngược (`:77-81`); thế hệ chỉ có huyền thoại thì lấy max BST của mọi thành viên (`:82-84`).
- **Phụ thuộc:** `PokemonRepository`, `PokemonMapper`.
- **Dữ liệu:** chỉ dạng `DEFAULT`, mỗi loài một dạng, nên `speciesCount` bằng số loài (`docs/api.md:184`).
- **Biên và lỗi:** bảng rỗng: 503 và không ghi cache, lần sau tính lại (`:51-53`). Cache không bao giờ bị xóa, không cài `StaticDataCache` nên `/health` không biết tới. Không đồng bộ hóa: 2 request đầu đồng thời có thể cùng tính, kết quả như nhau nên vô hại. Nhánh dự phòng "chỉ có huyền thoại" không có tie-break theo ID, phụ thuộc thứ tự truy vấn (suy ra từ `:82-84`).
- **Test:** `GenerationProfileServiceTest`: Kanto 5 loài, trung bình 572,8, top `fire 2, psychic 2, flying 1`, mạnh nhất Charizard (`backend/src/test/java/com/pokenexus/pokedex/service/GenerationProfileServiceTest.java:33-48`); hòa BST chọn Vaporeon (134) thay Flareon (136), chỉ huyền thoại chọn Mewtwo (`:50-57`); 503 (`:64-73`). `PokemonControllerIT.java:363-379`.

**7. `PokemonRepository` (`backend/src/main/java/com/pokenexus/pokedex/repository/PokemonRepository.java`)**

- **Vai trò:** Spring Data JPA cho bảng `pokemon`, kế thừa `JpaSpecificationExecutor` để lọc động.
- **Thành phần chính:**

| Method | Dòng | Kiểu truy vấn | Fetch | Dùng bởi |
|---|---|---|---|---|
| `findAll(Specification, Pageable)` | `:20-22` | Criteria (Specification) + count | `@EntityGraph("species")` | `search` |
| `findWithSpeciesById` | `:24-25` | Derived | `species`, `species.generation` | `lookup` |
| `findWithSpeciesByName` | `:27-28` | Derived | `species`, `species.generation` | `lookup` |
| `findBySpeciesIdOrderByIdAsc` | `:30` | Derived | Mặc định (LAZY) | `findDetail` (danh sách dạng) |
| `findBySpeciesIdInAndDefaultFormTrue` | `:32` | Derived, `IN` | Mặc định | `EvolutionService` |
| `findByIdIn` | `:34` | Derived, `IN` | Mặc định | `findRefs` |
| `findByFormCategoryIn` | `:36` | Derived, `IN` | Mặc định | `SpeedTierService` |
| `findWithSpeciesByFormCategory` | `:38-39` | Derived | `species`, `species.generation` | `GenerationProfileService` |
| `findAllWithSpecies` | `:41-42` | JPQL `JOIN FETCH p.species ORDER BY p.id` | Fetch join | `findAllCatalogEntries` |
| `searchByName` | `:44-49` | JPQL `LIKE` + `ORDER BY CASE WHEN name LIKE prefix THEN 0 ELSE 1 END, p.id` + `Pageable` | Mặc định | `searchByName` |

- **Phụ thuộc:** Entity `Pokemon`. Chỉ Service trong `pokedex` gọi.
- **Dữ liệu:** bảng `pokemon`; index `form_category`, `species_id`, `primary_type_id`, `secondary_type_id`, `base_stat_total`, `speed` (`backend/src/main/resources/db/migration/V2__create_pokedex_tables.sql:41-46`).
- **Biên và lỗi:** `Pageable` của `searchByName` chỉ dùng làm `LIMIT` (`PageRequest.of(0, maxResults)`, `PokemonQueryService.java:104`).
- **Test:** `PokemonRepositoryIT`: ánh xạ đủ cột Charizard hệ kép (`backend/src/test/java/com/pokenexus/pokedex/repository/PokemonRepositoryIT.java:47-62`), hệ thứ hai NULL (`:64-70`), giá trị không dấu tối đa 255 và trên 32.767 không tràn (`:72-87`).

**8. `PokemonSpecifications` (`backend/src/main/java/com/pokenexus/pokedex/repository/PokemonSpecifications.java`)**

- **Vai trò:** dựng mệnh đề `WHERE` động từ `PokemonFilter` bằng Criteria API, không nối chuỗi SQL.
- **Thành phần chính:** `matching(filter)` (`:18-41`):
  - Mỗi hệ yêu cầu thêm `primaryType = t OR secondaryType = t`; các hệ nối bằng AND, nên Pokémon phải có **tất cả** hệ đã chọn (`:21-25`).
  - `species.generation.id = gen` (`:26-28`), `baseStatTotal >= minBst`, `<= maxBst`, `speed >= minSpeed` (`:29-37`).
  - Luôn có `formCategory IN forms` (`:38`), mặc định `DEFAULT`, `REGIONAL`.
- **Phụ thuộc:** `PokemonFilter`, Entity `Pokemon`. Dùng bởi `PokemonQueryService.search`.
- **Biên và lỗi:** câu SQL Hibernate sinh ra (số JOIN tới `species`) chưa xác định từ code.
- **Test:** `findsGarchompByDragonTypeAndGenerationFour` (`PokemonControllerIT.java:270-285`), `requiresEveryRequestedType` (`:287-293`).

**9. `SpeciesRepository`, `EvolutionLinkRepository` (`M/pokedex/repository/`)**

- **Vai trò:** truy vấn phụ cho chuỗi tiến hóa.
- **Thành phần chính:** `SpeciesRepository.findByEvolutionChainIdOrderByIdAsc` (`SpeciesRepository.java:11`); `EvolutionLinkRepository.findByChainId` (`EvolutionLinkRepository.java:11`), cả hai là derived query.
- **Phụ thuộc:** chỉ `EvolutionService` dùng.
- **Dữ liệu:** `species.evolution_chain_id`, `evolution_links.chain_id` (index `idx_evolution_links_chain`, `backend/src/main/resources/db/migration/V2__create_pokedex_tables.sql:64`).
- **Biên và lỗi:** không có.
- **Test:** gián tiếp qua `PokemonControllerIT` (tiến hóa).

**10. `PokemonMapper` (`backend/src/main/java/com/pokenexus/pokedex/mapper/PokemonMapper.java`)**

- **Vai trò:** đổi Entity `Pokemon` sang các DTO; là nơi duy nhất Entity được "đọc" để ra JSON.
- **Thành phần chính:** `toSummary` (`:22-31`), `toRef` (`:33-35`), `toDetail` (`:37-58`), `toCatalogEntry` (`:60-72`), `toStats` (`:74-82`), `typesOf` (`:84-88`, lọc `null` để Pokémon một hệ có danh sách 1 phần tử), `typeNames` (`:90-92`, `identifier()` chữ thường).
- **Phụ thuộc:** Entity `Pokemon`, `Species`; DTO `pokedex`, `DefenseEntry`. Dùng bởi mọi Service của `pokedex`.
- **Dữ liệu:** `toSummary` đọc `species.getGeneration().getId()` (`:27`): `species` đã được fetch bằng entity graph; `generation` là proxy LAZY, đọc ID của proxy theo cơ chế Hibernate không cần truy vấn thêm (chưa xác minh bằng log SQL trong repo).
- **Biên và lỗi:** phải gọi trong transaction vì `spring.jpa.open-in-view=false` (`backend/src/main/resources/application.yml:15`); mọi Service gọi mapper bên trong method `@Transactional`.
- **Test:** không có test riêng; gián tiếp qua `PokemonControllerIT`, `GenerationProfileServiceTest`, `SpeedTierServiceTest`.

**11. Entity `pokedex` (`M/pokedex/entity/`)**

| File | Bảng | Ánh xạ chính | Fetch | Dùng bởi |
|---|---|---|---|---|
| `Pokemon.java` | `pokemon` | `species` ManyToOne (`:35-37`); `formCategory` `@Enumerated(STRING)` (`:42-44`); `defaultForm` từ `is_default` (`:46-47`); `primaryType`, `secondaryType` qua `PokemonTypeConverter` (`:49-55`); 6 chỉ số `tinyint unsigned` sang `Integer`; `baseStatTotal` `insertable = false, updatable = false` vì là cột sinh `STORED` (`:75-76`, `backend/src/main/resources/db/migration/V2__create_pokedex_tables.sql:35-36`) | `species` LAZY | Repository, Mapper |
| `Species.java` | `species` | `generation` ManyToOne (`:31-33`), `evolutionChain` ManyToOne nullable (`:35-37`), cờ `legendary`, `mythical`, `fullyEvolved` (`:39-46`) | LAZY | Mapper, `EvolutionService` |
| `Generation.java` | `generations` | `id`, `name`, `region` ManyToOne (`:31-33`) | LAZY | Mapper (lấy ID) |
| `Region.java` | `regions` | `id`, `name` | | Không ai đọc trực tiếp trong phạm vi |
| `EvolutionChain.java` | `evolution_chains` | chỉ `id` (`:21-23`) | | `EvolutionService` |
| `EvolutionLink.java` | `evolution_links` | `chain`, `fromSpecies`, `toSpecies` ManyToOne (`:28-38`); `triggerName`, `minLevel`, `itemName` (`:40-47`) | LAZY | `EvolutionService` |

- Mọi Entity có `@Immutable`, `@Getter`, constructor `protected` không tham số (Lombok chỉ dùng cho Entity, `backend/CLAUDE.md` Phần 3).
- Cột `UNSIGNED` ánh xạ `Integer`/`Long` kèm `columnDefinition` để `ddl-auto=validate` khớp kiểu và giá trị 255 không tràn; test `readsUnsignedMaximumsWithoutOverflow` (`PokemonRepositoryIT.java:72-87`).

**12. `PokemonFilter` (`backend/src/main/java/com/pokenexus/pokedex/dto/PokemonFilter.java`)**

- **Vai trò:** record bất biến chứa bộ lọc Omni-Dex, kiêm nơi validate tham số query.
- **Thành phần chính:** `of(...)` (`:26-36`): kiểm tra khoảng `gen` 1-9, `minBst`, `maxBst` 0-1530, `minSpeed` 0-255 (`:21-24`, `:28-31`), `minBst <= maxBst` (`:32-34`); `parseTypes` (`:38-54`): tối đa 2, tên hệ hợp lệ, không trùng; `parseForms` (`:56-65`): rỗng thì `FormCategory.SHOWN_BY_DEFAULT` (`DEFAULT`, `REGIONAL`), tên phải viết hoa đúng enum.
- **Phụ thuộc:** `PokemonType.fromIdentifier`, `FormCategory.fromName`. Dùng bởi `PokemonController.list`, `PokemonSpecifications`, `PokemonQueryService.searchByName` (`parseForms`).
- **Dữ liệu:** `types` là `Set<PokemonType>`, `forms` là `Set<FormCategory>`.
- **Biên và lỗi:** mọi vi phạm ném `ApiException(INVALID_PARAMETER)` (`:73-75`); `form=mega` (chữ thường) bị từ chối.
- **Test:** `PokemonFilterTest` (`backend/src/test/java/com/pokenexus/pokedex/dto/PokemonFilterTest.java:17-52`).

**13. `CompareResponse` (`backend/src/main/java/com/pokenexus/pokedex/dto/CompareResponse.java`)**

- **Vai trò:** DTO kết quả so sánh, chứa enum `Winner` có logic so sánh.
- **Thành phần chính:** `Winner.of(left, right)` dùng `Double.compare`: lớn hơn là `LEFT`, nhỏ hơn là `RIGHT`, bằng là `TIE` (`:12-18`); record con `Verdict`, `TypeAdvantage`, `StatComparison` (`:21-32`).
- **Phụ thuộc:** dùng bởi `CompareService`.
- **Biên và lỗi:** `difference` luôn không âm.
- **Test:** `CompareServiceTest`.

**14. DTO đơn giản của `pokedex`**

| File | Trường | Dùng bởi |
|---|---|---|
| `PokemonRef.java` | `id`, `name`, `types` (chữ thường) | Search, tiến hóa, tốc độ, thế hệ, `findRefs`, `AnalyzeResponse.members` |
| `PokemonSummary.java` | `id`, `name`, `types`, `generation`, `formCategory`, `baseStatTotal`, `speed` | `GET /pokemon` |
| `PokemonDetail.java` | `id`, `name`, `types`, `speciesId`, `speciesName`, `generation`, `formCategory`, `isLegendary`, `isMythical`, `isFullyEvolved`, `stats`, `baseStatTotal`, `heightDm`, `weightHg`, `defense` (18 `DefenseEntry`), `forms` (record `Form(id, name, formCategory)`) | Chi tiết, so sánh |
| `Stats.java` | `hp`, `attack`, `defense`, `specialAttack`, `specialDefense`, `speed` | Chi tiết, catalogue, synergy |
| `PokemonCatalogEntry.java` | `id`, `name`, `types` (`List<PokemonType>`), `formCategory`, `legendary`, `mythical`, `fullyEvolved`, `stats`, `baseStatTotal` | Đầu vào `PokemonProfileRegistry` (không ra API) |
| `SpeedTier.java` | `speed`, `pokemon` (`List<PokemonRef>`) | `/speed-tiers` |
| `GenerationProfile.java` | `generation`, `speciesCount`, `legendaryCount`, `mythicalCount`, `averageBaseStatTotal`, `topTypes` (`TypeCount(type, count)`), `strongest`, `strongestBaseStatTotal`; compact constructor sao chép `topTypes` bất biến (`:15-17`) | `/generations` |
| `EvolutionResponse.java` | `chainId`, `stages` | `/evolution` |
| `EvolutionStage.java` | `speciesId`, `pokemonId`, `name`, `types`, `evolvesFromSpeciesId`, `trigger`, `minLevel`, `item` (4 trường cuối có thể `null`) | `/evolution` |

#### II. Package `typechart`

**1. `TypeController` (`backend/src/main/java/com/pokenexus/typechart/controller/TypeController.java`)**

- **Vai trò:** trả danh sách 18 hệ và ma trận tương khắc.
- **Thành phần chính:** `types()` (`:30-34`), `matrix()` (`:36-40`), cả hai đặt `Cache-Control: public, max-age=86400` (`CACHE_ONE_DAY`, `:22`).
- **Phụ thuộc:** `TypeChartService`.
- **Dữ liệu:** không giữ trạng thái.
- **Biên và lỗi:** chưa nạp bảng thì Service ném 503.
- **Test:** `TypeControllerTest` (`@WebMvcTest`): header 1 ngày (`backend/src/test/java/com/pokenexus/typechart/controller/TypeControllerTest.java:30-55`), 503 `DATA_NOT_READY` (`:57-66`). Tích hợp: `PokemonControllerIT.java:249-268`.

**2. `TypeChartService` (`backend/src/main/java/com/pokenexus/typechart/service/TypeChartService.java`)**

- **Vai trò:** cache 18 x 18 hệ số sát thương trong bộ nhớ và các phép tính trên nó (hệ kép, lưới phòng thủ, siêu hiệu quả).
- **Thành phần chính:**
  - `loadOnStartup()` (`:42-49`): nghe `ApplicationReadyEvent`, gọi `reload()`, lỗi thì chỉ log `warn`.
  - `reload()` (`:56-73`), `synchronized`: đọc `typeEfficacyRepository.findAll()`; phải đủ `MATRIX_SIZE = 324` dòng (`:27`, `:61-64`), nếu không thì giữ trạng thái cũ; điền `matrix[attack][defend] = damage_factor / 100.0` (`:65-69`); gán vào trường `volatile double[][] multipliers` (`:36`, `:70`).
  - `multiplier(attacking, defending)` (`:75-77`) và `multiplier(attacking, Collection)` (`:79-86`): **tích** các hệ số, ví dụ Rock vào Fire/Flying là 2 x 2 = 4; danh sách rỗng ra 1.0.
  - `defenseMultipliers(types)` (`:88-94`): mảng 18 hệ số nhận đòn, theo thứ tự ID hệ.
  - `superEffectiveAgainst(attackingTypes)` (`:96-105`): mảng 18 boolean, `true` khi có hệ tấn công đơn đạt `>= 2.0` vào hệ phòng thủ đơn đó.
  - `defenseOf(types)` (`:107-112`): 18 `DefenseEntry` cho trang chi tiết.
  - `types()` (`:114-117`): gọi `table()` trước để báo 503 khi chưa nạp (sửa lỗi B5 ngày 02/11, `PLAN.md:161`), rồi trả 18 `TypeResponse` từ enum.
  - `matrix()` (`:119-125`): đổi mảng sang `List<List<Double>>`.
  - `table()` (`:127-137`): chưa nạp thì thử `reload()`; vẫn chưa có thì ném `DATA_NOT_READY`.
- **Phụ thuộc:** `TypeEfficacyRepository`, `PokemonType` (`index() = id - 1`, `backend/src/main/java/com/pokenexus/common/domain/PokemonType.java:46-48`). Dùng bởi `TypeController`, `PokemonQueryService`, `CompareService`, `PokemonProfileRegistry`, `HealthService` (qua `StaticDataCache`).
- **Dữ liệu:** `double[18][18]` khoảng 2,6 KB; nguồn bảng `type_efficacy` (`damage_factor IN (0, 50, 100, 200)`, `backend/src/main/resources/db/migration/V1__create_reference_tables.sql:8-16`).
- **Biên và lỗi:**
  - ID hệ ngoài 1-18 trong bảng: `IllegalStateException` (`:139-143`), log ở `loadOnStartup`.
  - Đọc song song an toàn: mảng chỉ được gán một lần sau khi điền xong, trường `volatile`; không ai sửa mảng sau đó.
  - `reload()` gọi từ bên trong class (`loadOnStartup`, `table()`) là self-invocation nên `@Transactional` không qua proxy; truy vấn vẫn chạy trong transaction mặc định của Spring Data. Hai request đầu đồng thời có thể nạp 2 lần liên tiếp (không kiểm tra lại trong `reload`), vô hại.
- **Test:** `TypeChartServiceTest`: ví dụ 3 của spec (Charizard: Rock 4, Ground 0, Water 2, Electric 2, Grass 0.25, `backend/src/test/java/com/pokenexus/typechart/service/TypeChartServiceTest.java:28-41`), thứ tự 18 hệ (`:43-50`), hệ số đơn (`:52-58`), siêu hiệu quả của Ground/Steel (`:60-69`), ma trận (`:71-79`), bảng thiếu dòng ra 503 (`:87-102`), nạp lười khi dữ liệu xuất hiện (`:104-114`).

**3. Entity và Repository `typechart`**

| File | Bảng, khóa | Ghi chú |
|---|---|---|
| `entity/Type.java` | `types`, `id tinyint unsigned`, `name` | `@Immutable`; không có Repository riêng, tên hệ lấy từ enum `PokemonType` |
| `entity/TypeEfficacy.java` | `type_efficacy`, `@EmbeddedId TypeEfficacyId`, `damageFactor` (`:23-27`) | `@AllArgsConstructor` để fixture test dựng dòng |
| `entity/TypeEfficacyId.java` | `attacking_type_id`, `defending_type_id` (`:21-25`) | `@Embeddable`, `Serializable`, `@EqualsAndHashCode` |
| `repository/TypeEfficacyRepository.java` | `JpaRepository<TypeEfficacy, TypeEfficacyId>` | Chỉ dùng `findAll()` trong `reload()` |

**4. DTO `typechart`**

| File | Trường | Dùng bởi |
|---|---|---|
| `DefenseEntry.java` | `attackingType`, `multiplier` | `PokemonDetail.defense` |
| `TypeMatrixResponse.java` | `types` (18 tên), `multipliers[i][j]` = hệ `types[i]` tấn công hệ `types[j]` | `/types/matrix` |
| `TypeResponse.java` | `id`, `name`; `from(PokemonType)` (`:7-9`) | `/types` |

#### III. Package `synergy`

**1. `SynergyController` (`backend/src/main/java/com/pokenexus/synergy/controller/SynergyController.java`)**

- **Vai trò:** cửa vào REST cho phân tích và đề xuất đội.
- **Thành phần chính:** `analyze(@Valid AnalyzeRequest)` (`:31-35`) gọi `synergyAnalyzer.analyze(pokemonIds)`; `recommend(@Valid RecommendationRequest)` (`:37-41`) chuyển nguyên request cho `RecommendationEngine`.
- **Phụ thuộc:** `SynergyAnalyzer`, `RecommendationEngine`.
- **Dữ liệu:** dùng POST vì đầu vào là danh sách có cấu trúc (`docs/api.md:69`).
- **Biên và lỗi:** Bean Validation chặn trước khi vào Service; `playStyle` lạ như `STALL` làm Jackson không đọc được enum nên ra 400 `MALFORMED_JSON` (`backend/src/test/java/com/pokenexus/synergy/controller/SynergyControllerTest.java:168-175`).
- **Test:** `SynergyControllerTest` (`@WebMvcTest`, Service bị mock): định dạng JSON (`:39-68`), đội 6 hợp lệ (`:70-81`), 7 Pokémon ra `VALIDATION_FAILED` kèm `errors` và không gọi Service (`:83-95`), rỗng, thiếu, `null` (`:97-105`), JSON hỏng (`:107-113`), tùy chọn ngoài khoảng (`:153-166`), body trên 16 KB ra 413 (`:181-191`). `SynergyControllerIT` chạy thật với CSV mẫu (`backend/src/test/java/com/pokenexus/synergy/controller/SynergyControllerIT.java:33-104`).

**2. `PokemonProfileRegistry` (`backend/src/main/java/com/pokenexus/synergy/service/PokemonProfileRegistry.java`)**

- **Vai trò:** cache hồ sơ phòng thủ, tấn công của **mọi** Pokémon (mọi dạng) để Synergy không truy vấn DB.
- **Thành phần chính:**
  - `loadOnStartup()` (`:38-45`): nghe `ApplicationReadyEvent`, nuốt lỗi và log.
  - `reload()` (`:52-75`), `synchronized`: bảo đảm type chart đã nạp (`:55-58`); đọc catalogue (`:59`); rỗng thì giữ nguyên (`:60-63`); dựng `PokemonProfile` với `defenseMultipliers` và `superEffectiveAgainst` tính sẵn (`:64-66`), sắp theo ID (`:67`); gán `snapshot = new Snapshot(Map.copyOf(byId), profiles)` (`:69-71`).
  - `find(id)` (`:77-79`), `all()` (`:81-83`): đi qua `current()`.
  - `current()` (`:85-95`): snapshot `null` thì thử `reload()`; vẫn `null` thì 503 `DATA_NOT_READY`.
- **Phụ thuộc:** `PokemonQueryService.findAllCatalogEntries`, `TypeChartService`. Dùng bởi `SynergyAnalyzer.resolveTeam`, `RecommendationEngine.recommend`, `HealthService`.
- **Dữ liệu:** `Snapshot(byId, all)` (`:97-98`), trường `volatile` (`:31`). Với dữ liệu thật khoảng 1.351 hồ sơ (`docs/database.md:42`, `PLAN.md:146`); bộ nhớ chưa đo riêng, ADR ước lượng "khoảng vài MB" cho toàn bộ dữ liệu tĩnh (`docs/adr/0003-in-memory-synergy.md:25`).
- **Biên và lỗi:** thay snapshot bằng một phép gán `volatile` nên reader luôn thấy snapshot cũ hoặc mới đầy đủ, không thấy nửa vời. Dữ liệu không tự làm mới khi DB đổi; phải khởi động lại (`docs/adr/0003-in-memory-synergy.md:26`).
- **Test:** `reportsDataNotReadyWhileRegistryIsEmpty`: rỗng ra 503, có dữ liệu thì tự nạp và chấm 76 (`backend/src/test/java/com/pokenexus/synergy/service/SynergyAnalyzerTest.java:116-131`); `SynergyControllerIT.reportsDataLoadedOnceProfilesAreInMemory` (`:33-41`).

**3. `SynergyAnalyzer` (`backend/src/main/java/com/pokenexus/synergy/service/SynergyAnalyzer.java`)**

- **Vai trò:** phân tích phòng thủ, độ phủ, radar chỉ số và đánh giá bằng lời cho đội 1-6 Pokémon.
- **Thành phần chính:**
  - `analyze(ids)` (`:41-43`): `toResponse(evaluate(resolveTeam(ids, 6)))`.
  - `resolveTeam(ids, maxTeamSize)` (`:45-67`): kiểm tra 1..max (`:46-49`), không `null` (`:50-52`), không trùng (`:53-56`), gom ID không có trong registry thành một lỗi `UNKNOWN_POKEMON` (`:57-65`); giữ thứ tự request.
  - `evaluate(members)` (`:69-77`): OR các mảng `superEffectiveAgainst` của thành viên thành `covered[18]`, dựng `TeamAnalysis`.
  - `toResponse(analysis)` (`:79-109`): 18 `TypeMatrixRow`, danh sách hệ chưa phủ, `StatRadar` trung bình làm tròn 1 chữ số (`:95-101`), `teamScore` làm tròn 1 chữ số (`:104`), insights (`:108`).
  - `roundTo(value, decimals)` (`:111-113`): `BigDecimal` `HALF_UP`, dùng chung cho `RecommendationEngine`.
- **Phụ thuộc:** `PokemonProfileRegistry`, `TeamInsightBuilder`. Dùng bởi `SynergyController`, `RecommendationEngine` (`resolveTeam`, `evaluate`, `roundTo`), `TeamService` (`analyze`).
- **Dữ liệu:** `MIN_TEAM_SIZE 1`, `MAX_TEAM_SIZE 6` (`:28-29`). Không có trường trạng thái ngoài 2 dependency.
- **Biên và lỗi:** validate lại ở Service dù Controller đã có Bean Validation, vì `TeamService` và `RecommendationEngine` gọi trực tiếp; nhận cả dạng Mega (`SynergyControllerIT.java:58-65`).
- **Test:** `SynergyAnalyzerTest` (ví dụ 1, 4, 5 của spec, chi tiết ở mục VII.8).

**4. `RecommendationEngine` (`backend/src/main/java/com/pokenexus/synergy/service/RecommendationEngine.java`)**

- **Vai trò:** chấm điểm mọi ứng viên và chọn top N cho vị trí tiếp theo, mỗi tổ hợp hệ một ứng viên.
- **Thành phần chính:**
  - `recommend(request)` (`:51-99`): giải đội với giới hạn 5 (`MAX_TEAM_SIZE = 6 - 1`, `:31`, `:52`); `evaluate` (`:53`); `TeamStatProfile.of` (`:54`); lọc ứng viên (`:57-59`); rỗng thì trả `candidateCount 0` (`:60-62`); chấm 4 thành phần thô (`:64-67`); tính `Range` min-max (`:68-71`); ngưỡng BST cao (`:72`); xếp hạng (`:74-80`); khử trùng tổ hợp hệ và cắt `limit` (`:82-97`).
  - `isCandidate` (`:101-112`), `isLegendaryLike` (`:114-116`), `defenseValue` (`:118-130`), `addedCoverage` (`:132-140`), `highBaseStatTotalThreshold` (`:142-149`), `rank` (`:151-165`), record `Range.normalize` (`:173-187`).
- **Phụ thuộc:** `SynergyAnalyzer`, `PokemonProfileRegistry`, `ReasonBuilder`, `RoleScorer`.
- **Dữ liệu:** `HIGH_BST_SHARE 0.25`, `SCORE_SCALE 100`, `BREAKDOWN_DECIMALS 3`, `PARADOX_POKEMON_IDS` 20 ID (`:28-34`).
- **Biên và lỗi:** đội 6 người: 400 `VALIDATION_FAILED` từ `resolveTeam` (`RecommendationEngineTest.java:159-164`); không ứng viên nào qua lọc: `items` rỗng, không lỗi (`:148-157`). Chi tiết thuật toán ở mục VII.5.
- **Test:** `RecommendationEngineTest` (12 test, mục VIII).

**5. `RoleScorer` (`backend/src/main/java/com/pokenexus/synergy/service/RoleScorer.java`)**

- **Vai trò:** chấm "vai trò chỉ số" 0-1 của một ứng viên theo lối chơi, kèm lý do bằng lời.
- **Thành phần chính:** `score(candidate, team, style)` (`:25-33`) rẽ nhánh `balance`, `hyperOffense`, `bulky`, `trickRoom` (`:35-79`); hàm phụ `attackComplement` (`:81-95`), `defenseComplement` (`:97-110`), `speedComplement` (`:112-121`), `opposes` (`:123-127`), `strongerAttack`, `attackLabel`, `bulkiness`, `maxLevel50Speed`, `capped` (`:129-148`). Công thức ở mục VII.6.
- **Phụ thuộc:** `TeamStatProfile`, `Stats`, `PlayStyle`. Dùng bởi `RecommendationEngine`.
- **Dữ liệu:** hằng chuẩn `STRONG_ATTACK 140`, `FAST_SPEED_REFERENCE 130`, `TRICK_ROOM_SPEED_CEILING 80`, `BULK_REFERENCE 115`, ngưỡng lý do 0.3, 0.2, 95, 110 (`:16-23`). Record `RoleFit(value, reasons)` (`:150-155`).
- **Biên và lỗi:** `capped` kẹp về 0-1 (`:146-148`); đội rỗng vẫn chạy được (`backend/src/test/java/com/pokenexus/synergy/service/RoleScorerTest.java:65-73`). `maxLevel50Speed` dùng số thực nhân 1.1; vì `double` của 1.1 hơi lớn hơn 1.1 nên `floor` không bị hụt 1 khi kết quả đúng là số nguyên.
- **Test:** `RoleScorerTest`: tốc độ tối đa cấp 50 (100 ra 167, 130 ra 200, 60 ra 123, 0 ra 57, `:20-26`), bù đặc biệt cho đội vật lý (`:28-39`), chỉ đòi tốc độ khi đội chưa có ai nhanh (`:41-53`), Trick Room ưu tiên chậm (`:55-63`).

**6. `ReasonBuilder` (`backend/src/main/java/com/pokenexus/synergy/service/ReasonBuilder.java`)**

- **Vai trò:** sinh lý do (`reasons`, 1-4 câu) và cảnh báo (`cautions`) cho mỗi đề xuất.
- **Thành phần chính:**
  - `build(...)` (`:26-44`): tối đa 2 câu kháng hoặc miễn nhiễm cho hệ có `pressure > 0`, ưu tiên pressure cao rồi ID hệ (`:29-33`); tối đa 2 lý do vai trò (`:34`); 1 câu độ phủ thêm (`:35-37`); "Tổng chỉ số cao (BST n)" nếu thuộc 25% cao nhất, hoặc "Tổng chỉ số BST n" khi chưa có lý do nào (`:38-42`); cắt còn 4 (`:43`).
  - `cautions(...)` (`:46-64`): tối đa 2 hệ ứng viên yếu mà đội đã có từ 2 thành viên yếu (`:48-54`); tối đa 1 câu trùng hệ với từ 2 thành viên (`:55-62`).
  - `resistanceReason` (`:66-76`): hệ số 0 viết "Miễn nhiễm hệ X", còn lại "Kháng hệ X (x0,25 hoặc x0,5)"; `formatMultiplier` (`:78-80`), `displayName` (`:86-89`), `joinNames` (`:82-84`).
- **Phụ thuộc:** `PokemonProfile`, `TeamAnalysis`. Dùng bởi `RecommendationEngine`; `TeamInsightBuilder` dùng lại `displayName`, `joinNames`.
- **Dữ liệu:** hằng giới hạn `:19-24`.
- **Biên và lỗi:** luôn có ít nhất 1 lý do (`RecommendationEngineTest.java:155`).
- **Test:** gián tiếp qua `RecommendationEngineTest.ranksByWeightedScoreWithNormalizedBreakdown` (`:72-77`).

**7. `TeamInsightBuilder` (`backend/src/main/java/com/pokenexus/synergy/service/TeamInsightBuilder.java`)**

- **Vai trò:** chuyển số liệu phân tích thành danh sách điểm mạnh, điểm yếu bằng lời, gắn nhóm `DEFENSE`, `OFFENSE`, `SPEED`, `BALANCE`.
- **Thành phần chính:** `build(analysis)` (`:34-68`) gọi lần lượt `addResistedTypes`, "Không có lỗ hổng nghiêm trọng", độ phủ rộng, các mục vai trò (chỉ khi đội từ 3, `:37`, `:51-56`), `addCriticalHoles`, `addStackedWeaknesses`, độ phủ còn thiếu; cuối cùng sắp ổn định theo `tone` (STRENGTH trước WEAKNESS, `:65-67`). Bảng điều kiện ở mục VII.4.
- **Phụ thuộc:** `TeamAnalysis`, `TeamStatProfile`, `ReasonBuilder`. Dùng bởi `SynergyAnalyzer.toResponse`.
- **Dữ liệu:** hằng `:21-30`.
- **Biên và lỗi:** đội 1-2 thành viên chỉ có mục về hệ (`TeamInsightBuilderTest.java:75-82`); danh sách hệ dài hơn 6 thì ghi "... và N hệ khác" (`:173-178`).
- **Test:** `TeamInsightBuilderTest` (5 test, mục VIII).

**8. `DefenseScale` (`backend/src/main/java/com/pokenexus/synergy/model/DefenseScale.java`)**

- **Vai trò:** thang quy đổi hệ số chịu đòn sang `defenseScore` nguyên.
- **Thành phần chính:** 6 bậc `IMMUNE 0 -> +3`, `QUARTER 0.25 -> +2`, `HALF 0.5 -> +1`, `NEUTRAL 1 -> 0`, `DOUBLE 2 -> -1`, `QUADRUPLE 4 -> -2` (`:4-9`); `scoreOf(multiplier)` duyệt từ nhỏ đến lớn, lấy bậc đầu tiên có `multiplier <= bậc` (`:27-34`), so `<=` nên chịu được sai số số thực.
- **Phụ thuộc:** dùng bởi `PokemonProfile` khi dựng.
- **Test:** gián tiếp (mọi test synergy).

**9. `PlayStyle` (`backend/src/main/java/com/pokenexus/synergy/model/PlayStyle.java`)**

- **Vai trò:** enum 4 lối chơi, mỗi lối có bộ trọng số và giới hạn tốc độ gốc cố định.
- **Thành phần chính:** `BALANCE(0.40, 0.20, 0.25, 0.15, null, null)`, `HYPER_OFFENSE(0.25, 0.25, 0.35, 0.15, 80, null)`, `BULKY(0.50, 0.10, 0.25, 0.15, null, null)`, `TRICK_ROOM(0.30, 0.15, 0.40, 0.15, null, 60)` (`:5-8`); `allowsBaseSpeed(speed)` (`:43-46`). Tổng trọng số mỗi lối bằng 1,00 nên điểm nằm trong 0-100.
- **Phụ thuộc:** `RecommendationRequest`, `RecommendationEngine`, `RoleScorer`, `RecommendationResponse`.
- **Test:** `RecommendationEngineTest.java:81-114`.

**10. `PokemonProfile` (`backend/src/main/java/com/pokenexus/synergy/model/PokemonProfile.java`)**

- **Vai trò:** hồ sơ bất biến của một Pokémon cho Synergy: catalogue + 18 hệ số chịu đòn + 18 `defenseScore` + 18 cờ siêu hiệu quả.
- **Thành phần chính:** constructor kiểm tra độ dài 18 (`:21-27`), `clone()` mảng đầu vào (`:29-30`), tính sẵn `defenseScores` (`:31-34`), `typeCombination = Set.copyOf(EnumSet.copyOf(types))` để so tổ hợp hệ không phụ thuộc thứ tự (`:35`); truy cập `defenseMultiplier`, `defenseScore`, `hitsSuperEffectively` theo `index()` (`:78-88`); `toRef()` (`:90-92`).
- **Phụ thuộc:** `PokemonCatalogEntry`, `DefenseScale`. Dùng khắp `synergy`.
- **Biên và lỗi:** mảng private, không có setter nên chia sẻ an toàn giữa các thread.
- **Test:** gián tiếp.

**11. `TeamAnalysis` (`backend/src/main/java/com/pokenexus/synergy/model/TeamAnalysis.java`)**

- **Vai trò:** kết quả phân tích phòng thủ của một đội; tính toàn bộ trong constructor.
- **Thành phần chính:** vòng 18 hệ x n thành viên (`:32-48`): điểm âm cộng vào `weakness` và `weakCount`, điểm dương tăng `resistCount` (`:36-42`); `pressure = max(0, weakness - resistCount)` (`:44`); `criticalHole = weakness >= 2 && resistCount == 0` (`:45`); `teamScore = clamp(100 - 4 x tổng pressure - 8 x số lỗ hổng, 0, 100)` (`:49-50`); `averageStat` (`:81-83`).
- **Phụ thuộc:** `PokemonProfile`. Tạo bởi `SynergyAnalyzer.evaluate`.
- **Dữ liệu:** hằng `MAX_TEAM_SCORE 100`, `PRESSURE_PENALTY 4`, `CRITICAL_HOLE_PENALTY 8`, `CRITICAL_WEAKNESS_THRESHOLD 2` (`:11-14`). `teamScore` là số nguyên.
- **Test:** `SynergyAnalyzerTest`.

**12. `TeamStatProfile` (`backend/src/main/java/com/pokenexus/synergy/model/TeamStatProfile.java`)**

- **Vai trò:** thống kê chỉ số của đội cho `RoleScorer` và `TeamInsightBuilder`.
- **Thành phần chính:** `of(members)` (`:21-50`): phân loại tấn công từng thành viên theo `attackLean` (vật lý khi `<= -0.15`, đặc biệt khi `>= 0.15`, còn lại nửa mỗi bên, `:31-39`), đếm thành viên nhanh (`>= 100`) và chậm (`<= 50`) (`:40-41`), trung bình tốc độ, phòng thủ, phòng thủ đặc biệt (chia `max(1, size)`, `:47`); `attackLean` (`:52-55`), `defenseLean` (`:57-60`), `attackSkew` (`:62-64`), `defenseSkew` (`:66-69`).
- **Phụ thuộc:** `PokemonProfile`, `Stats`.
- **Biên và lỗi:** đội rỗng không chia cho 0. `slowMembers` được tính nhưng không nơi nào trong main đọc (dead field, tìm bằng grep `slowMembers`).
- **Test:** `RoleScorerTest.java:28-73`.

**13. DTO `synergy`**

| File | Trường | Ghi chú |
|---|---|---|
| `AnalyzeRequest.java` | `pokemonIds` | `@NotNull @Size(min = 1, max = 6) List<@NotNull Integer>` (`:9`) |
| `RecommendationRequest.java` | `pokemonIds` (1-5), `limit` (1-10), `excludeLegendary`, `minBaseStatTotal` (0-1530), `playStyle` | Compact constructor gán mặc định `limit 3`, `excludeLegendary false`, `playStyle BALANCE` (`:19-26`); chạy khi Jackson dựng record, trước Bean Validation |
| `AnalyzeResponse.java` | `members`, `teamScore`, `typeMatrix` (18 `TypeMatrixRow(attackingType, multipliers, weakCount, resistCount, pressure, criticalHole)`), `offensiveCoverage(coveredTypeCount, uncoveredTypes)`, `statRadar` (6 số), `insights` (`TeamInsight(tone, category, text, types)`) | Enum `InsightTone`, `InsightCategory` (`:15-25`); `TeamInsight` sao chép `types` bất biến (`:29-31`) |
| `RecommendationResponse.java` | `playStyle`, `candidateCount`, `items` (`Recommendation(id, name, types, score, breakdown, baseStatTotal, reasons, cautions)`), `Breakdown(defense, offense, role, stats)` | `breakdown` là giá trị đã chuẩn hóa 0-1, làm tròn 3 chữ số |

#### IV. Package `team`

**1. `TeamController` (`backend/src/main/java/com/pokenexus/team/controller/TeamController.java`)**

- **Vai trò:** lưu đội (có giới hạn tần suất) và mở đội theo mã chia sẻ.
- **Thành phần chính:**
  - `create(@Valid CreateTeamRequest, HttpServletRequest)` (`:37-44`): `saveRateLimiter.acquire(httpRequest.getRemoteAddr())` (`:41`), `teamService.create` (`:42`), trả 201 với `Location: /api/v1/teams/shared/{code}` (`SHARED_PATH`, `:27`, `:43`).
  - `shared(shareCode)` (`:46-50`).
- **Phụ thuộc:** `TeamService`, `SaveRateLimiter`.
- **Dữ liệu:** khóa giới hạn là địa chỉ IP do servlet container cung cấp; profile `prod` bật `server.forward-headers-strategy: framework` (`backend/src/main/resources/application-prod.yml:2`) nên giá trị này được lấy từ header proxy (`docs/architecture.md:382`).
- **Biên và lỗi:** `acquire` chạy sau Bean Validation (tham số `@Valid` được giải trước khi vào thân method) nhưng trước kiểm tra nghiệp vụ; request lỗi `DUPLICATE_SLOT`, `UNKNOWN_POKEMON` vẫn bị đếm (`docs/api.md:161`).
- **Test:** `TeamControllerIT` (`backend/src/test/java/com/pokenexus/team/controller/TeamControllerIT.java`), dùng `request.setRemoteAddr` giả IP cho từng test (`:177-186`).

**2. `TeamService` (`backend/src/main/java/com/pokenexus/team/service/TeamService.java`)**

- **Vai trò:** nghiệp vụ lưu và đọc đội.
- **Thành phần chính:**
  - `create(request)` (`:62-87`), `@Transactional`: sắp thành viên theo slot (`:64-66`); slot trùng ra `DUPLICATE_SLOT` (`:67-68`); ID trùng ra `DUPLICATE_POKEMON` (`:69-70`); `findRefs` và tìm ID không tồn tại (`:72-73`); nếu **không ID nào** tìm thấy thì `requireDataLoaded()` để DB rỗng ra 503 thay vì 400 (`:75-77`, sửa lỗi B4 ngày 02/11, `PLAN.md:161`); còn lại `UNKNOWN_POKEMON` (`:78`); `teamScore` từ `synergyAnalyzer.analyze(ids)` (`:81`); dựng `Team` với mã mới, điểm `BigDecimal` 2 chữ số `HALF_UP`, `createdAt` UTC cắt về giây (`:82-84`); thêm thành viên (`:85`); `save` rồi map (`:86`).
  - `findByShareCode(code)` (`:89-99`): sai định dạng ra 400 trước khi truy vấn (`:91-93`); không có ra 404 `TEAM_NOT_FOUND` (`:94-96`); lấy `PokemonRef` của thành viên (`:97-98`).
  - `nextFreeShareCode()` (`:101-110`): tối đa `MAX_SHARE_CODE_ATTEMPTS = 3` lần `next()` + `existsByShareCode`; hết lượt ném `IllegalStateException` (ra 500).
- **Phụ thuộc:** `TeamRepository`, `PokemonQueryService`, `SynergyAnalyzer`, `ShareCodeGenerator`, `TeamMapper`, `Clock` (constructor package-private để test tiêm đồng hồ cố định, `:51-60`).
- **Dữ liệu:** ghi `teams` (tên, mã, `synergy_score DECIMAL(5,2)`, `created_at`) và `team_members` (slot, `pokemon_id`, `nickname`).
- **Biên và lỗi:** điểm đội lưu là điểm của mọi thành viên 1-6 tại thời điểm lưu, không tính lại khi mở (`docs/api.md:377`). Kiểm tra trùng mã rồi mới INSERT không nguyên tử; nếu hai request trùng mã cùng lúc, ràng buộc `uk_teams_share_code` chặn và request sau lỗi 500 (suy ra từ `:101-110`, `backend/src/main/resources/db/migration/V3__create_team_tables.sql:10`); xác suất cực nhỏ.
- **Test:** `TeamServiceTest` (`backend/src/test/java/com/pokenexus/team/service/TeamServiceTest.java`): sắp slot, nickname rỗng thành `null`, điểm 48.00, giờ cắt giây (`:68-94`); đội 1 người 76 (`:96-104`); DB rỗng ra 503 (`:106-114`); 3 lỗi nghiệp vụ không gọi `save` (`:116-125`); thử lại khi trùng mã (`:127-137`); bỏ cuộc sau 3 lần (`:139-148`); validate mã trước khi tra (`:150-159`).

**3. `SaveRateLimiter` (`backend/src/main/java/com/pokenexus/team/service/SaveRateLimiter.java`)**

- **Vai trò:** giới hạn số lần lưu đội mỗi khóa (IP) trong một cửa sổ cố định 1 phút, hoàn toàn trong bộ nhớ.
- **Thành phần chính:**
  - Constructor Spring đọc `app.team.save-limit-per-minute` (mặc định 10, `backend/src/main/java/com/pokenexus/common/config/AppProperties.java:23-24`, `backend/src/main/resources/application.yml:29`), `MAX_TRACKED_CLIENTS = 10_000`, `Clock.systemUTC()` (`:28-31`); constructor package-private cho test (`:33-43`), chặn giá trị nhỏ hơn 1.
  - `acquire(clientKey)` (`:45-59`):
    - Khóa mới mà map đã đủ 10.000: xóa cửa sổ hết hạn; vẫn đủ thì 429 với `Retry-After` là thời điểm kết thúc sớm nhất trong map (`:47-53`, `earliestEnd` `:65-70`).
    - `ConcurrentHashMap.compute` nguyên tử theo khóa: chưa có hoặc hết hạn thì mở cửa sổ mới `(now + 60 s, 1)`, còn lại tăng đếm (`:54-55`).
    - Đếm vượt giới hạn thì `RateLimitedException` với số giây còn lại (`:56-58`).
  - `secondsUntil` (`:72-75`): làm tròn lên theo giây, tối thiểu 1. `Window.isExpired` dùng `!now.isBefore(end)` nên đúng thời điểm `end` là hết hạn (`:79-81`).
- **Phụ thuộc:** `AppProperties`, `RateLimitedException` (đặt `Retry-After` ở `GlobalExceptionHandler.java:41-43`).
- **Dữ liệu:** `ConcurrentMap<String, Window(end, count)>`; không ghi IP vào log (`docs/architecture.md:363`).
- **Biên và lỗi:**
  - Request bị từ chối vẫn làm tăng `count`, nhưng không kéo dài cửa sổ.
  - Không có luồng dọn nền; map chỉ được dọn khi đầy và có khóa mới.
  - Kiểm tra kích thước và `compute` là hai bước riêng, nên khi nhiều khóa mới đến đồng thời, map có thể vượt 10.000 một chút (suy ra từ `:47-55`; test chỉ chạy đơn luồng).
  - Bộ đếm riêng mỗi instance, mất khi khởi động lại.
- **Test:** `SaveRateLimiterTest` (8 test, đồng hồ giả `MutableClock`): 10 lần rồi lần 11 sau 18 giây trả `Retry-After 42` (`backend/src/test/java/com/pokenexus/team/service/SaveRateLimiterTest.java:25-37`); khóa khác độc lập (`:39-46`); sau 60 giây mở cửa sổ mới (`:48-60`); còn 1 ms vẫn báo 1 giây (`:62-72`); đầy thì khóa mới 429 với 30 giây, khóa cũ vẫn được đếm (`:74-89`); dọn khóa hết hạn trước khi từ chối (`:91-100`); không vượt trần (`:102-114`); trần 0 bị từ chối (`:116-120`).

**4. `ShareCodeGenerator` (`backend/src/main/java/com/pokenexus/team/service/ShareCodeGenerator.java`)**

- **Vai trò:** sinh và kiểm tra mã chia sẻ 8 ký tự base62.
- **Thành phần chính:** `next()` lấy 8 ký tự ngẫu nhiên từ bảng 62 ký tự bằng `SecureRandom` (`:11-23`); `isValid(code)` khớp `[A-Za-z0-9]{8}` (`:13`, `:25-27`).
- **Phụ thuộc:** dùng bởi `TeamService`.
- **Dữ liệu:** không gian 62^8, khoảng 2,18 x 10^14 mã (`docs/architecture.md:376`); cột `share_code CHAR(8) ... COLLATE utf8mb4_bin` để phân biệt hoa thường (`backend/src/main/resources/db/migration/V3__create_team_tables.sql:5`).
- **Test:** `ShareCodeGeneratorTest`: 1.000 mã đúng định dạng (`backend/src/test/java/com/pokenexus/team/service/ShareCodeGeneratorTest.java:14-19`), 10.000 mã không trùng (`:21-29`), các trường hợp sai (`:31-38`).

**5. `TeamMapper` (`backend/src/main/java/com/pokenexus/team/mapper/TeamMapper.java`)**

- **Vai trò:** đổi Entity `Team` cùng `Map<id, PokemonRef>` sang `TeamResponse`.
- **Thành phần chính:** `toResponse` sắp thành viên theo slot (`:20`), đổi `synergyScore` sang `Double` hoặc `null` (`:26`), `createdAt` sang `Instant` theo UTC (`:27`); `toMember` ném `IllegalStateException` khi thiếu Pokémon (`:31-37`).
- **Phụ thuộc:** dùng bởi `TeamService`.
- **Biên và lỗi:** thiếu Pokémon gần như không xảy ra vì có khóa ngoại `fk_team_members_pokemon` (`backend/src/main/resources/db/migration/V3__create_team_tables.sql:21`); nếu xảy ra thì 500.
- **Test:** gián tiếp qua `TeamServiceTest`, `TeamControllerIT`.

**6. `TeamRepository` (`backend/src/main/java/com/pokenexus/team/repository/TeamRepository.java`)**

- **Vai trò:** truy cập bảng `teams`.
- **Thành phần chính:** `findByShareCode` với `@EntityGraph("members")` để lấy đội và thành viên trong một truy vấn (`:12-13`); `existsByShareCode` (`:15`).
- **Dữ liệu:** index unique `uk_teams_share_code`.
- **Test:** gián tiếp qua `TeamControllerIT`.

**7. Entity `team`**

| File | Bảng | Ánh xạ chính |
|---|---|---|
| `Team.java` | `teams` | `id` `IDENTITY` `bigint unsigned` (`:28-31`); `userId` để trống cho đăng nhập sau này (`:33-34`); `shareCode char(8)` (`:39-40`); `synergyScore decimal(5,2)` (`:42-43`); `createdAt`; `updatedAt` chỉ đọc, do DB cập nhật (`:45-49`); `members` OneToMany `mappedBy = "team"`, `CascadeType.ALL`, `orphanRemoval` (`:51-53`); getter trả danh sách không sửa được (`:66-68`); `addMember` (`:62-64`) |
| `TeamMember.java` | `team_members` | `@EmbeddedId TeamMemberId` (`:22-23`); `@MapsId("teamId")` ManyToOne LAZY tới `Team` (`:25-28`) nên `team_id` của khóa được lấy từ đội sau khi INSERT; constructor package-private tạo khóa `(null, slot)` (`:36-41`) |
| `TeamMemberId.java` | | Khóa ghép `team_id`, `slot` (`:21-25`) |

- DB bổ sung: khóa chính `(team_id, slot)`, `UNIQUE (team_id, pokemon_id)`, `CHECK slot 1-6`, `ON DELETE CASCADE` (`backend/src/main/resources/db/migration/V3__create_team_tables.sql:18-22`).

**8. DTO `team`**

| File | Trường | Ghi chú |
|---|---|---|
| `CreateTeamRequest.java` | `name` `@NotBlank @Size(max = 60)`, `members` `@NotNull @Size(1, 6) List<@NotNull @Valid TeamMemberRequest>` | Compact constructor `strip()` tên (`:14-16`), nên tên toàn khoảng trắng thành rỗng và bị `@NotBlank` chặn |
| `TeamMemberRequest.java` | `slot` `@NotNull @Min(1) @Max(6)`, `pokemonId` `@NotNull`, `nickname` `@Size(max = 30)` | Nickname rỗng hoặc toàn khoảng trắng thành `null`, còn lại `strip()` (`:13-15`); `pokemonId` không có `@Min`, ID âm ra `UNKNOWN_POKEMON` |
| `TeamResponse.java` | `shareCode`, `name`, `synergyScore` (`Double`, có thể `null`), `createdAt` (`Instant`), `members` (`Member(slot, id, name, types, nickname)`) | Có sẵn tên, hệ để trang Đội chia sẻ không phải gọi thêm API |

#### V. JPA: ánh xạ, truy vấn, N+1, phân trang

**1. Chiến lược fetch**

- Mọi quan hệ `@ManyToOne` trong phạm vi khai báo `FetchType.LAZY` (ví dụ `Pokemon.java:35`, `Species.java:31`, `:35`, `EvolutionLink.java:28-38`, `TeamMember.java:26`). `Team.members` là `@OneToMany`, mặc định LAZY.
- `spring.jpa.open-in-view: false` (`backend/src/main/resources/application.yml:15`): Entity chỉ được đọc trong method `@Transactional` của Service; mapper chạy bên trong các method đó.

**2. Cách tránh N+1**

| Luồng | Cách làm | Số truy vấn (suy ra từ code) |
|---|---|---|
| `GET /pokemon` | `@EntityGraph("species")` trên `findAll(spec, pageable)` (`PokemonRepository.java:20-22`); `generation` chỉ đọc ID | 1 truy vấn trang, thường thêm 1 truy vấn đếm của Spring Data (có thể bỏ khi trang đầu chưa đầy); thêm `count()` nếu tổng bằng 0 |
| `GET /pokemon/{idOrName}` | `findWithSpeciesById/Name` fetch `species`, `species.generation` (`:24-28`); dạng cùng loài 1 truy vấn; lưới phòng thủ trong bộ nhớ | 2 |
| `GET /pokemon/compare` | 2 lần `findDetail` | 4 |
| `GET /{idOrName}/evolution` | Gom theo lô: `findByChainId`, `findByEvolutionChainIdOrderByIdAsc`, `findBySpeciesIdInAndDefaultFormTrue(ids)` | 4, không phụ thuộc số loài trong chuỗi |
| Nạp registry | `JOIN FETCH p.species` (`:41-42`) | 1 |
| `/generations` | `@EntityGraph({"species", "species.generation"})` (`:38-39`) | 1 (lần đầu), 0 khi đã cache |
| `GET /teams/shared/{code}` | `@EntityGraph("members")` (`TeamRepository.java:12-13`) + `findByIdIn` | 2 |
| `POST /teams` | `findByIdIn`, 1-3 `existsByShareCode`, INSERT `teams`, INSERT từng `team_members` (không cấu hình JDBC batch trong `application.yml`) | 3-5 + n |

- Câu SQL cụ thể Hibernate sinh ra (JOIN nào, có lặp JOIN `species` khi vừa fetch vừa lọc theo thế hệ không) chưa xác định từ code; cần bật log SQL để kiểm chứng.

**3. Phân trang và sắp xếp (`PageRequestFactory`, lớp `common`)**

- `page` mặc định 0, không âm; `size` mặc định 24, 1-100 (`backend/src/main/java/com/pokenexus/common/web/PageRequestFactory.java:13-14`, `:21-28`).
- `page <= Integer.MAX_VALUE / size` để `page x size` không tràn `int` (`:29-32`; sửa lỗi B1 "page quá lớn trả 500" ngày 02/11, `PLAN.md:161`).
- `sort=<thuộc tính>,<asc|desc>`: thuộc tính phải thuộc whitelist `SORTABLE_PROPERTIES`; thiếu chiều thì `ASC`; quá 2 phần thì lỗi; luôn thêm `id` làm khóa phụ nếu thuộc tính chính không phải `id` (`:36-54`). Test `sortsByRequestedPropertyThenId`: `speed,desc` ra Jolteon (130) rồi Mewtwo (130, ID lớn hơn) (`PokemonControllerIT.java:311-321`).
- Response dùng `PageResponse` riêng (`backend/src/main/java/com/pokenexus/common/web/PageResponse.java:8-17`) thay vì serialize `Page` của Spring (`docs/api.md:222`).

#### VI. Cấu trúc trong bộ nhớ

| Cấu trúc | Nạp khi nào | Kích thước | An toàn đa luồng | Khi DB rỗng |
|---|---|---|---|---|
| `TypeChartService.multipliers` (`double[18][18]`) | `ApplicationReadyEvent`; nếu thất bại thì lần gọi đầu qua `table()`; `/health` cũng gọi `reload()` (`backend/src/main/java/com/pokenexus/common/web/HealthService.java:46-53`) | 324 số | `volatile` + `synchronized reload`, mảng không sửa sau khi gán | `table()` ném 503; bảng thiếu dòng cũng coi như chưa nạp |
| `PokemonProfileRegistry.snapshot` (`Map<id, profile>` + `List` sắp theo ID) | Như trên, sau khi type chart có | Bằng số dòng `pokemon` (1.351 với dữ liệu thật) | `volatile` + `synchronized reload`, `PokemonProfile` bất biến, `Map.copyOf` | `current()` ném 503 |
| `GenerationProfileService.profiles` | Request đầu tiên tới `/generations` | Số thế hệ (9 với dữ liệu thật) | `volatile`, không khóa (tính trùng vô hại) | 503, không cache lỗi |
| `SaveRateLimiter.windows` | Mỗi lần lưu | Tối đa 10.000 khóa (mềm) | `ConcurrentHashMap.compute` | Không liên quan |

- Thứ tự khởi động: `IngestionRunner` là `ApplicationRunner` có `@Order` (`backend/src/main/java/com/pokenexus/ingestion/IngestionRunner.java:22-23`), chạy trước `ApplicationReadyEvent`, nên cache nạp sau khi CSV đã vào DB (`docs/architecture.md:138`).
- `PokemonProfileRegistry.reload` tự gọi `typeChartService.reload()` nếu type chart chưa nạp (`PokemonProfileRegistry.java:55`), nên thứ tự giữa 2 listener không quan trọng.
- Đo khởi động 5,4 giây với 1.351 Pokémon (`docs/architecture.md:397`); container giới hạn 512 MB dùng 277 MiB (`PLAN.md:154`).

#### VII. Thuật toán Synergy chuyên sâu

**1. Hệ số chịu đòn và thang điểm**

- Hệ số hệ kép là **tích** hai hệ số đơn (`TypeChartService.java:79-86`). Ví dụ Charizard (Fire/Flying) nhận Rock: 2 x 2 = 4; nhận Ground: 2 x 0 = 0 (miễn nhiễm thắng mọi thứ).
- Quy đổi sang `defenseScore` (`DefenseScale.java:4-9`):

| Hệ số | 0 | 0.25 | 0.5 | 1 | 2 | 4 |
|---|---|---|---|---|---|---|
| `defenseScore` | +3 | +2 | +1 | 0 | -1 | -2 |

- Thang này ghi ở `docs/architecture.md:211-216` nhưng tài liệu không giải thích vì sao chọn các con số. Cách hiểu (suy luận, không có trong tài liệu): miễn nhiễm +3 cao hơn x0,25 vì chặn hoàn toàn; x4 chỉ -2 chứ không -4, nên một thành viên x4 nặng gấp đôi x2 nhưng không lấn át cả đội.
- 18 hệ số, 18 điểm và 18 cờ siêu hiệu quả của mỗi Pokémon tính sẵn khi nạp registry (`PokemonProfile.java:21-35`, `PokemonProfileRegistry.java:64-66`). Chỉ tính theo hệ; Ability (Levitate), vật phẩm nằm ngoài MVP (`docs/architecture.md:220`).

**2. Phân tích đội (`TeamAnalysis`)**

```text
FOR mỗi hệ tấn công a trong 18 hệ:
    weakness[a]     = tổng (-defenseScore) của thành viên có điểm âm
    weakCount[a]    = số thành viên có điểm âm
    resistCount[a]  = số thành viên có điểm dương (gồm miễn nhiễm)
    pressure[a]     = max(0, weakness[a] - resistCount[a])
    criticalHole[a] = weakness[a] >= 2 AND resistCount[a] == 0
teamScore = clamp(100 - 4 x SUM(pressure) - 8 x COUNT(criticalHole), 0, 100)
```

- Nguồn: `TeamAnalysis.java:32-50`. Độ phức tạp `O(18 x n)`, `n <= 6`.
- `weakness` cộng theo mức (x4 tính 2), còn `resistCount` chỉ đếm người (một miễn nhiễm cũng chỉ trừ 1 pressure). Nghĩa là "1 người kháng bù 1 đơn vị yếu".
- `criticalHole` dùng `weakness`, không dùng `weakCount`: một thành viên chịu x4 mà không ai kháng đã là lỗ hổng (Charizard một mình bị đánh dấu Rock, `SynergyControllerIT.java:51-53`).
- Điểm luôn là số nguyên; `roundTo(..., 1)` chỉ để thống nhất định dạng `76.0`.

**3. Độ phủ tấn công và radar**

- `covered[d] = OR` trên thành viên của `superEffectiveAgainst[d]`, tức tồn tại một hệ của thành viên đánh hệ phòng thủ đơn `d` được `>= x2` (`SynergyAnalyzer.java:69-77`, `TypeChartService.java:96-105`).
- `coveredTypeCount = 18 - số hệ chưa phủ`; `uncoveredTypes` theo thứ tự ID hệ (`SynergyAnalyzer.java:91-93`, `:106`).
- Hạn chế: tính theo hệ của Pokémon (giả định có chiêu cùng hệ), không theo chiêu thức thật; xét hệ phòng thủ đơn, không xét tổ hợp hệ kép.
- `statRadar`: trung bình cộng 6 chỉ số gốc, làm tròn 1 chữ số (`:95-101`).

**4. Đánh giá đội (`TeamInsightBuilder`)**

| Thứ tự thêm | Điều kiện | Tone, nhóm | Mẫu câu |
|---|---|---|---|
| 1 | Hệ có `weakCount = 0` và `resistCount >= max(2, (n + 1) / 2)`; sắp `resistCount` giảm dần rồi ID (`:70-81`) | STRENGTH, DEFENSE | "Chịu tốt hệ ...: từ k thành viên kháng, không ai yếu" |
| 2 | `n >= 3` và không có lỗ hổng (`:41-44`) | STRENGTH, DEFENSE | "Không có lỗ hổng nghiêm trọng" |
| 3 | Độ phủ `>= 14` (`:45-50`) | STRENGTH, OFFENSE | "Độ phủ tấn công rộng: đánh siêu hiệu quả c/18 hệ" |
| 4 | `n >= 3`: cân bằng tấn công (`:105-126`) | WEAKNESS hoặc STRENGTH, BALANCE | "Chỉ có sát thương vật lý..." / "Chỉ có sát thương đặc biệt..." / "Cân bằng sát thương: p vật lý, s đặc biệt[, m cả hai]" |
| 5 | `n >= 3`: tốc độ (`:128-144`); trung bình `<= 60` ưu tiên trước | STRENGTH hoặc WEAKNESS, SPEED | "Đội chậm, hợp lối chơi Trick Room..." / "Chưa có thành viên nhanh..." / "k thành viên nhanh (tốc độ gốc từ 100)" |
| 6 | `n >= 3`: `|defenseSkew| >= 0.2` (`:146-159`) | WEAKNESS, BALANCE | "Phòng thủ đặc biệt yếu hơn hẳn phòng thủ vật lý (trung bình a so với b)" |
| 7 | `n >= 3`: hệ đầu tiên (theo ID) có từ 3 thành viên mang (`:161-171`) | WEAKNESS, BALANCE | "k thành viên cùng hệ X: dễ bị một hệ tấn công khắc chế" |
| 8 | Mọi lỗ hổng, tối đa 2, pressure giảm dần (`:83-92`) | WEAKNESS, DEFENSE | "Lỗ hổng nghiêm trọng hệ X: k thành viên yếu, không ai kháng" |
| 9 | Không phải lỗ hổng, `weakCount >= 3`, tối đa 2 (`:94-103`) | WEAKNESS, DEFENSE | "k thành viên cùng yếu hệ X, chỉ r kháng" |
| 10 | `n >= 3` và độ phủ `< 14` (`:60-64`) | WEAKNESS, OFFENSE | "Chưa đánh siêu hiệu quả được u hệ: ..." |

- Cuối cùng sắp ổn định theo `tone` (`:65-67`): mọi STRENGTH lên trước, giữ thứ tự thêm bên trong mỗi nhóm.
- Các mục vai trò chỉ xét khi đội từ 3 vì đội 1-2 người chưa đủ để nói về cân bằng (`docs/architecture.md:298`).

**5. Đề xuất vị trí tiếp theo (`RecommendationEngine`)**

**A. Lọc ứng viên (`isCandidate`, `:101-112`)**

- `formCategory` là `DEFAULT` hoặc `REGIONAL` (không Mega, Gmax, totem...).
- Loài đã tiến hóa hoàn toàn (`species.is_fully_evolved`).
- Không có trong đội.
- `excludeLegendary = true`: loại huyền thoại, thần thoại và 20 Pokémon Paradox (ID 984-995, 1005, 1006, 1009, 1010, 1020-1023, `:32-34`, `:114-116`) vì CSV PokéAPI không đánh dấu Paradox là huyền thoại (`docs/architecture.md:245`).
- Tốc độ gốc thỏa `playStyle.allowsBaseSpeed` (Hyper Offense `>= 80`, Trick Room `<= 60`).
- `minBaseStatTotal` nếu có.
- `candidateCount` đếm sau bước lọc, trước bước khử trùng tổ hợp hệ (`:98`).

**B. Bốn thành phần thô**

| Thành phần | Công thức | Nguồn |
|---|---|---|
| `defense` | Tổng trên 18 hệ: `s > 0` cộng `pressure[a] x s`; `s < 0` trừ `(1 + pressure[a]) x (-s)` | `:118-130` |
| `offense` | Số hệ đội chưa phủ mà ứng viên đánh siêu hiệu quả | `:132-140` |
| `role` | `RoleScorer.score(candidate, teamStats, style).value()` | `:66` |
| `stats` | BST của ứng viên | `:71` |

- Ý nghĩa `defense`: kháng một hệ chỉ có giá trị khi đội đang bị hở ở hệ đó (pressure > 0); yếu thì luôn bị phạt ít nhất `-s`, và phạt nặng hơn nếu đội vốn đã hở hệ đó (`1 + pressure`). Vì vậy ứng viên "đắp" vào chỗ hở được thưởng, ứng viên "chồng" điểm yếu bị phạt.

**C. Chuẩn hóa và điểm**

```text
norm(x) = (x - min) / (max - min)        nếu max > min
norm(x) = 1 nếu x > 0, ngược lại 0        nếu mọi ứng viên bằng nhau
score   = round1( 100 x ( wD x norm(defense) + wO x norm(offense) + wR x norm(role) + wP x norm(BST) ) )
```

- Nguồn: `Range.of`, `normalize` (`:173-187`); `rank` (`:151-165`). `min`, `max` lấy trên tập ứng viên đã lọc, nên điểm chỉ có nghĩa **tương đối trong một lần gọi**.
- `breakdown` trả 4 giá trị chuẩn hóa làm tròn 3 chữ số (`:159-163`).

**D. Xếp hạng và hòa điểm (`:74-80`)**

- `score` (đã làm tròn 1 chữ số) giảm dần; hòa thì BST cao hơn trước; vẫn hòa thì ID nhỏ hơn trước. Bảo đảm kết quả xác định.

**E. Khử trùng tổ hợp hệ và cắt (`:82-97`)**

- Duyệt danh sách đã xếp; `usedCombinations.add(profile.typeCombination())` thất bại thì bỏ qua; đủ `limit` thì dừng.
- `typeCombination` là `Set` nên Fire/Flying và Flying/Fire là một tổ hợp. Chỉ khử trùng giữa các đề xuất với nhau, không so với tổ hợp hệ của đội.

**F. Ngưỡng BST cao (`:142-149`)**

- Sắp BST giảm dần, `topCount = max(1, ceil(N x 0,25))`, ngưỡng là BST ở vị trí `topCount`; mọi ứng viên có BST bằng hoặc hơn ngưỡng được lý do "Tổng chỉ số cao". Khi hòa ở ngưỡng, nhóm này có thể hơn 25%.

**G. Độ phức tạp**

- `O(N x 18 + N log N)` với N khoảng 1.300 (`docs/architecture.md:269`); ADR ước tính khoảng 23.400 phép tính mỗi lần đề xuất (`docs/adr/0003-in-memory-synergy.md:20`).

**6. Lối chơi (`PlayStyle`) và vai trò chỉ số (`RoleScorer`)**

| `playStyle` | Phòng thủ | Độ phủ | Vai trò | Sức mạnh | Lọc tốc độ gốc | Vai trò chỉ số (`RoleScorer`) |
|---|---|---|---|---|---|---|
| `BALANCE` (mặc định) | 0,40 | 0,20 | 0,25 | 0,15 | Không | `0,4 x attackComplement + 0,3 x defenseComplement + 0,3 x speedComplement` (`:35-41`) |
| `HYPER_OFFENSE` | 0,25 | 0,25 | 0,35 | 0,15 | `>= 80` | `0,55 x min(1, Spe / 130) + 0,45 x min(1, max(Atk, SpA) / 140)` (`:43-59`) |
| `BULKY` | 0,50 | 0,10 | 0,25 | 0,15 | Không | `0,6 x min(1, bulk / 115) + 0,4 x defenseComplement`, `bulk = (HP + Def + SpD) / 3` (`:61-70`, `:137-139`) |
| `TRICK_ROOM` | 0,30 | 0,15 | 0,40 | 0,15 | `<= 60` | `0,45 x clamp(1 - Spe / 80) + 0,35 x min(1, max(Atk, SpA) / 140) + 0,2 x min(1, bulk / 115)` (`:72-79`) |

- `attackComplement` (`:81-95`): `skew = (số đặc biệt - số vật lý) / n` của đội, `lean = (SpA - Atk) / max(Atk, SpA)` của ứng viên; `fit = (1 - skew x lean) / 2 x min(1, max(Atk, SpA) / 140)`. Đội thiên vật lý (`skew < 0`) gặp ứng viên đặc biệt (`lean > 0`) thì `skew x lean < 0`, fit tăng.
- `defenseComplement` (`:97-110`): cùng dạng, dùng `defenseSkew` của đội (`(SpD tb - Def tb) / max`) và `defenseLean` của ứng viên, nhân độ trâu chuẩn hóa.
- `speedComplement` (`:112-121`): `wanted = max(1, ceil(n / 3))`, `need = clamp(1 - fast / wanted)`; giá trị `need x min(1, Spe / 130) + (1 - need) x 0,5`. Đội đã đủ người nhanh thì thành phần này hằng 0,5 cho mọi ứng viên (trung tính).
- Lý do vai trò chỉ thêm khi lệch rõ: `|skew| >= 0,3` (tấn công) hoặc `>= 0,2` (phòng thủ), ứng viên lệch ngược chiều `>= 0,15` và (với tấn công) chỉ số tấn công mạnh hơn `>= 110` (`:86`, `:101`, `:123-127`).
- Tốc độ tối đa cấp 50 trong câu lý do: `floor(((2 x gốc + 31 + 63) x 50 / 100 + 5) x 1,1)` (`:141-144`), khớp mức "Tối đa" của spec F09 (`docs/spec.md:161`).

**7. Lý do và cảnh báo (`ReasonBuilder`)**

- Thứ tự lý do: kháng hoặc miễn nhiễm (tối đa 2), vai trò (tối đa 2), độ phủ thêm (1), BST (1); cắt còn 4 (`ReasonBuilder.java:26-44`). Nếu đã có 4 câu trước đó thì câu BST bị cắt.
- Cảnh báo: yếu thêm một hệ mà đội đã có từ 2 người yếu (tối đa 2, sắp `weakCount` giảm dần); trùng hệ với từ 2 thành viên (chỉ 1 câu, hệ trùng nhiều nhất) (`:46-64`). Tối đa 3 cảnh báo.

**8. Năm ví dụ có đáp án (`docs/spec.md:85-93`)**

**A. Ví dụ 1: Charizard, Gyarados, Dragonite, Talonflame, Volcarona; Rock 5/5 yếu, 0 kháng, lỗ hổng nghiêm trọng**

- Bước 1, hệ số Rock vào từng thành viên (tích hai hệ):
  - Charizard Fire/Flying: Rock vào Fire 2 x Rock vào Flying 2 = 4, điểm -2.
  - Gyarados Water/Flying: 1 x 2 = 2, điểm -1.
  - Dragonite Dragon/Flying: 1 x 2 = 2, điểm -1.
  - Talonflame Fire/Flying: 4, điểm -2.
  - Volcarona Bug/Fire: Rock vào Bug 2 x Rock vào Fire 2 = 4, điểm -2.
- Bước 2: `weakness = 2 + 1 + 1 + 2 + 2 = 8`, `weakCount = 5`, `resistCount = 0`.
- Bước 3: `pressure = max(0, 8 - 0) = 8`; `criticalHole = (8 >= 2) AND (0 == 0) = true`.
- Kiểm chứng: `flagsRockAsCriticalHoleForSpecExampleOneTeam` khẳng định `[4.0, 2.0, 2.0, 4.0, 4.0]`, 5, 0, 8, `true` (`backend/src/test/java/com/pokenexus/synergy/service/SynergyAnalyzerTest.java:32-42`).

**B. Ví dụ 2: đề xuất số 1 có lý do liên quan tới Rock**

- Pressure của đội (mục VII.9): Rock 8, Electric 4, Flying 1, Water 1, Ice 1, Dragon 1.
- Ứng viên kháng Rock được cộng `8 x s`: x0,25 (`s = 2`) được 16, x0,5 được 8. Đây là số hạng lớn nhất có thể trong `defenseValue`, nên ứng viên kháng Rock gần như luôn có `defense` chuẩn hóa cao nhất.
- `ReasonBuilder` sắp câu kháng theo pressure giảm dần, nên câu Rock luôn đứng đầu nếu ứng viên kháng Rock (`ReasonBuilder.java:29-33`).
- Với catalogue của unit test (`backend/src/test/java/com/pokenexus/synergy/service/SynergyFixture.java:30-70`), tính tay `defenseValue` và độ phủ thêm của 13 ứng viên:

| Ứng viên | Hệ | `defenseValue` | Độ phủ thêm |
|---|---|---|---|
| excadrill | Ground/Steel | 25 | Poison, Electric, Fairy |
| swampert | Water/Ground | 18 | Poison, Electric |
| garchomp | Dragon/Ground | 13 | Poison, Electric |
| flygon | Ground/Dragon | 13 | Poison, Electric |
| metagross | Steel/Psychic | 7 | Poison, Fairy |
| raichu | Electric | 4 | Flying, Water |
| jolteon | Electric | 4 | Flying, Water |
| mewtwo | Psychic | -3 | Poison |
| mew | Psychic | -3 | Poison |
| vaporeon | Water | -4 | Không |
| tyranitar | Rock/Dark | -8 | Flying, Ghost |
| ninetales-alola | Ice/Fairy | -9 | Flying |
| salamence | Dragon/Flying | -15 | Không |

- `defenseValue` của Excadrill chi tiết: Rock x0,25 `+2 x 8 = 16`; Electric miễn nhiễm `+3 x 4 = 12`; Flying x0,5 `+1 x 1`; Dragon x0,5 `+1 x 1`; Water x2 `-(1 + 1) x 1 = -2`; Fighting, Ground, Fire x2 mỗi hệ `-(1 + 0) x 1`; tổng `16 + 12 + 1 + 1 - 2 - 3 = 25`.
- Chuẩn hóa: defense `(25 + 15) / 40 = 1,0`; offense `3 / 3 = 1,0`; stats `(508 - 485) / (680 - 485) = 0,118`; role 0,703 (test khẳng định). Điểm `100 x (0,4 x 1 + 0,2 x 1 + 0,25 x 0,703 + 0,15 x 0,118) = 79,4` (`backend/src/test/java/com/pokenexus/synergy/service/RecommendationEngineTest.java:58-79`).
- Lý do của Excadrill đúng như test: "Kháng hệ Rock (x0,25): đội đang có 5 thành viên yếu, chưa ai kháng", "Miễn nhiễm hệ Electric: đội đang có 3 thành viên yếu, chưa ai kháng", "Đánh siêu hiệu quả hệ Poison, Electric, Fairy mà đội chưa phủ được"; cảnh báo "Thêm điểm yếu hệ Water: đội đã có 3 thành viên yếu". Không có câu BST vì ngưỡng 25% là 600 (`ceil(13 x 0,25) = 4`, BST thứ 4 là 600) mà Excadrill chỉ 508.
- Top 3 BALANCE trong fixture: Excadrill, Garchomp, Metagross; Flygon bị bỏ vì trùng tổ hợp Ground/Dragon với Garchomp xếp trên (`RecommendationEngineTest.java:53-55`, `:62-63`).
- Dữ liệu thật: nhật ký 28/10 ghi top 3 Iron Treads, Sandy Shocks, Great Tusk (`PLAN.md:146`) nhưng là trước PR #60 (31/10) đổi trọng số và thêm vai trò; kết quả hiện tại cần dữ liệu DB.

**C. Ví dụ 3: Charizard nhận Rock 4, Ground 0, Water 2, Electric 2**

- Rock: 2 x 2 = 4. Ground: Ground vào Fire 2 x Ground vào Flying 0 = 0. Water: Water vào Fire 2 x Water vào Flying 1 = 2. Electric: Electric vào Fire 1 x Electric vào Flying 2 = 2.
- Kiểm chứng: `TypeChartServiceTest.java:28-41` (unit) và `PokemonControllerIT.java:57-62` (`defense[5]` Rock 4.0, `defense[4]` Ground 0.0, `defense[10]` Water 2.0, `defense[12]` Electric 2.0 theo chỉ số `id - 1`).

**D. Ví dụ 4: 7 Pokémon trả 400**

- Lớp 1 ở Controller: `@Size(max = 6)` (`AnalyzeRequest.java:9`) làm `MethodArgumentNotValidException`, `GlobalExceptionHandler` trả 400 `VALIDATION_FAILED` kèm `errors: [{ field: "pokemonIds", message: "size must be between 1 and 6" }]`; Service không được gọi (`SynergyControllerTest.java:83-95`).
- Lớp 2 ở Service: `resolveTeam` kiểm tra lại kích thước (`SynergyAnalyzer.java:46-49`), test `rejectsSevenPokemonFromSpecExampleFour` (`SynergyAnalyzerTest.java:101-105`).

**E. Ví dụ 5: thêm Excadrill, điểm 20 lên 48, Rock có 1 kháng, hết lỗ hổng**

- Excadrill Ground/Steel nhận Rock: 0,5 x 0,5 = 0,25, điểm +2, nên Rock: `weakness 8`, `resistCount 1`, `pressure 7`, `criticalHole false`.
- Electric: Electric vào Ground 0, Excadrill miễn nhiễm, nên `pressure 4 - 1 = 3`, hết lỗ hổng.
- Water: Excadrill nhận 2 x 1 = 2, nên `weakness 4`, `resist 2`, `pressure 2` (tăng 1).
- Flying, Dragon: Excadrill kháng, pressure 1 về 0. Ice: Ice vào Ground 2 x Ice vào Steel 0,5 = 1, pressure giữ 1. Fire, Fighting, Ground: Excadrill yếu nhưng đội có 4-5 người kháng, pressure vẫn 0.
- Tổng pressure `7 + 3 + 2 + 1 = 13`, lỗ hổng 0: `100 - 4 x 13 - 8 x 0 = 48`.
- Kiểm chứng: `raisesTheScoreWhenTheSixthMemberResistsRock` (`SynergyAnalyzerTest.java:88-99`).

**9. Đội demo: bảng 18 hệ và vì sao Rock bị đánh dấu**

- Thứ tự cột: Charizard, Gyarados, Dragonite, Talonflame, Volcarona. Tính từ `type_efficacy.csv` mẫu theo `TeamAnalysis`.

| Hệ tấn công | Hệ số 5 thành viên | `weakCount` | `weakness` | `resistCount` | `pressure` | Lỗ hổng |
|---|---|---|---|---|---|---|
| Normal | 1, 1, 1, 1, 1 | 0 | 0 | 0 | 0 | Không |
| Fighting | 0.5 x 5 | 0 | 0 | 5 | 0 | Không |
| Flying | 1, 1, 1, 1, 2 | 1 | 1 | 0 | 1 | Không (weakness < 2) |
| Poison | 1 x 5 | 0 | 0 | 0 | 0 | Không |
| Ground | 0, 0, 0, 0, 1 | 0 | 0 | 4 | 0 | Không |
| Rock | 4, 2, 2, 4, 4 | 5 | 8 | 0 | 8 | Có |
| Bug | 0.25, 0.5, 0.5, 0.25, 0.5 | 0 | 0 | 5 | 0 | Không |
| Ghost | 1 x 5 | 0 | 0 | 0 | 0 | Không |
| Steel | 0.5, 0.5, 1, 0.5, 0.5 | 0 | 0 | 4 | 0 | Không |
| Fire | 0.5, 0.5, 0.5, 0.5, 1 | 0 | 0 | 4 | 0 | Không |
| Water | 2, 0.5, 0.5, 2, 2 | 3 | 3 | 2 | 1 | Không (có người kháng) |
| Grass | 0.25, 1, 0.25, 0.25, 0.25 | 0 | 0 | 4 | 0 | Không |
| Electric | 2, 4, 1, 2, 1 | 3 | 4 | 0 | 4 | Có |
| Psychic | 1 x 5 | 0 | 0 | 0 | 0 | Không |
| Ice | 1, 1, 4, 1, 0.5 | 1 | 2 | 1 | 1 | Không (có người kháng) |
| Dragon | 1, 1, 2, 1, 1 | 1 | 1 | 0 | 1 | Không (weakness < 2) |
| Dark | 1 x 5 | 0 | 0 | 0 | 0 | Không |
| Fairy | 0.5, 1, 2, 0.5, 0.5 | 1 | 1 | 3 | 0 | Không |

- Tổng pressure `1 + 8 + 1 + 4 + 1 + 1 = 16`, 2 lỗ hổng: `100 - 64 - 16 = 20` (test `:44-67`, `teamScore 20.0`).
- **Vì sao Rock bị đánh dấu:** 4/5 thành viên mang hệ Flying hoặc Fire, đều nhận Rock x2; ba con mang **cả hai** (Charizard, Talonflame) hoặc Bug/Fire (Volcarona) nên nhận x4. Không ai có hệ Ground, Steel, Fighting để kháng Rock, nên `resistCount = 0` và `weakness = 8` vượt xa ngưỡng 2.
- Electric cũng là lỗ hổng (Gyarados Water/Flying nhận x4), test khẳng định (`SynergyAnalyzerTest.java:50-54`). Ice không phải lỗ hổng dù Dragonite nhận x4, vì Volcarona kháng Ice.
- Độ phủ: hệ của đội (Fire, Flying, Water, Dragon, Bug) đánh siêu hiệu quả 11 hệ; chưa phủ Normal, Flying, Poison, Ghost, Water, Electric, Fairy (`SynergyAnalyzerTest.java:69-77`). Radar `85.4, 96.8, 77.6, 95.6, 91.8, 97.4` theo chỉ số trong fixture.
- Insights suy ra từ code (4 câu có dấu * được test khẳng định ở `backend/src/test/java/com/pokenexus/synergy/service/TeamInsightBuilderTest.java:26-30`):
  - STRENGTH: "Chịu tốt hệ Fighting, Bug, Ground, Steel, Fire, Grass: từ 3 thành viên kháng, không ai yếu"; "Cân bằng sát thương: 2 vật lý, 2 đặc biệt, 1 cả hai" (Gyarados, Dragonite vật lý; Charizard, Volcarona đặc biệt; Talonflame lệch -0,086 nên tính cả hai); "3 thành viên nhanh (tốc độ gốc từ 100)" *.
  - WEAKNESS: "4 thành viên cùng hệ Flying: dễ bị một hệ tấn công khắc chế" *; "Lỗ hổng nghiêm trọng hệ Rock: 5 thành viên yếu, không ai kháng" *; "Lỗ hổng nghiêm trọng hệ Electric: 3 thành viên yếu, không ai kháng" *; "3 thành viên cùng yếu hệ Water, chỉ 2 kháng"; "Chưa đánh siêu hiệu quả được 7 hệ: Normal, Flying, Poison, Ghost, Water, Electric và 1 hệ khác".
  - Không có câu lệch phòng thủ vì `defenseSkew = (91,8 - 77,6) / 91,8 = 0,155 < 0,2`.

#### VIII. Test và fixture trong phạm vi

| File | Loại | Điểm chính |
|---|---|---|
| `backend/src/test/java/com/pokenexus/pokedex/controller/PokemonControllerIT.java` | Tích hợp, Testcontainers, CSV mẫu (`app.ingestion.enabled=true`, `:21`) | 21 test: chi tiết, tìm kiếm, so sánh, tiến hóa, type chart, lọc, sắp xếp, `size=101` ra 400, tốc độ, thế hệ |
| `backend/src/test/java/com/pokenexus/pokedex/dto/PokemonFilterTest.java` | Unit | Parse hệ, mặc định form, chặn hệ lạ, trùng, quá 2, khoảng số |
| `backend/src/test/java/com/pokenexus/pokedex/repository/PokemonRepositoryIT.java` | Tích hợp, tự chèn dữ liệu bằng `JdbcTemplate` | Ánh xạ cột, NULL, giá trị không dấu tối đa |
| `backend/src/test/java/com/pokenexus/pokedex/service/CompareServiceTest.java` | Unit, mock `PokemonQueryService`, type chart thật từ CSV | 4 test so sánh |
| `backend/src/test/java/com/pokenexus/pokedex/service/GenerationProfileServiceTest.java` | Unit | Tổng hợp, hòa, chỉ huyền thoại, 503 |
| `backend/src/test/java/com/pokenexus/pokedex/service/SpeedTierServiceTest.java` | Unit | Gom mốc, rỗng, 503 |
| `backend/src/test/java/com/pokenexus/typechart/controller/TypeControllerTest.java` | `@WebMvcTest` | Header 1 ngày, 503 |
| `backend/src/test/java/com/pokenexus/typechart/service/TypeChartFixture.java` | Fixture | Đọc `backend/src/test/resources/csv/type_efficacy.csv`, lọc hệ 1-18, mock Repository, gọi `reload()` (`:24-46`) |
| `backend/src/test/java/com/pokenexus/typechart/service/TypeChartServiceTest.java` | Unit | Ví dụ 3, thứ tự, ma trận, 503, nạp lười |
| `backend/src/test/java/com/pokenexus/synergy/controller/SynergyControllerTest.java` | `@WebMvcTest` | Validation, `MALFORMED_JSON`, 413, JSON mẫu (số liệu trong mock là giả, ví dụ `412`, `86.8`) |
| `backend/src/test/java/com/pokenexus/synergy/controller/SynergyControllerIT.java` | Tích hợp | Health 62 Pokémon, Charizard 76, Mega trong đội, lỗi, đề xuất đã tiến hóa hoàn toàn và khác tổ hợp |
| `backend/src/test/java/com/pokenexus/synergy/service/SynergyFixture.java` | Fixture | Catalogue 21 Pokémon viết tay (`:30-70`), thêm Iron Treads cho test Paradox (`:72-74`); đội ví dụ (`:26-28`) |
| `backend/src/test/java/com/pokenexus/synergy/service/SynergyAnalyzerTest.java` | Unit | Ví dụ 1, 4, 5; Charizard 76; lỗi; registry rỗng |
| `backend/src/test/java/com/pokenexus/synergy/service/RecommendationEngineTest.java` | Unit | Ví dụ 2; 13 ứng viên; xếp hạng 79,4; Hyper Offense 9 ứng viên; Trick Room 1 ứng viên 100 điểm; Bulky; lọc; Paradox; đội 6 lỗi; mặc định; xác định |
| `backend/src/test/java/com/pokenexus/synergy/service/RoleScorerTest.java` | Unit | Tốc độ cấp 50, bù tấn công, nhu cầu tốc độ, Trick Room, đội rỗng |
| `backend/src/test/java/com/pokenexus/synergy/service/TeamInsightBuilderTest.java` | Unit | Đội demo, đội toàn vật lý, đội chậm không ai nhanh, đội Trick Room trung bình 30, đội 2 người |
| `backend/src/test/java/com/pokenexus/team/controller/TeamControllerIT.java` | Tích hợp | Lưu 6 thành viên, `Location`, mở lại, phân biệt hoa thường, 404, 400, lỗi nghiệp vụ, 10 lần rồi 429 |
| `backend/src/test/java/com/pokenexus/team/service/SaveRateLimiterTest.java` | Unit, `MutableClock` | 8 test cửa sổ và trần |
| `backend/src/test/java/com/pokenexus/team/service/ShareCodeGeneratorTest.java` | Unit | Định dạng, không trùng, `isValid` |
| `backend/src/test/java/com/pokenexus/team/service/TeamServiceTest.java` | Unit, mock | 7 test nghiệp vụ lưu, đọc |

- Synergy unit test dùng `SynergyFixture` (dữ liệu viết tay), không dùng bảng `pokemon` CSV; tích hợp dùng `backend/src/test/resources/csv/` (62 dòng `pokemon`, `SynergyControllerIT.java:39`).

### III. Luồng xử lý tiêu biểu

#### I. `GET /api/v1/pokemon?type=dragon&gen=4`

1. Request GET không qua đọc body (`RequestBodyLimitFilter.shouldNotFilter`, `backend/src/main/java/com/pokenexus/common/web/RequestBodyLimitFilter.java:31-34`); DispatcherServlet chọn `PokemonController.list` (`backend/src/main/java/com/pokenexus/pokedex/controller/PokemonController.java:55-70`).
2. `PokemonFilter.of(["dragon"], 4, null, null, null, null)` (`:71`): `gen` trong 1-9, hệ hợp lệ, `forms` mặc định `{DEFAULT, REGIONAL}` (`backend/src/main/java/com/pokenexus/pokedex/dto/PokemonFilter.java:26-65`).
3. `PageRequestFactory.of(null, null, null, SORTABLE_PROPERTIES)` ra `page 0, size 24, sort id ASC` (`backend/src/main/java/com/pokenexus/common/web/PageRequestFactory.java:20-38`).
4. `PokemonQueryService.search` mở transaction chỉ đọc (`backend/src/main/java/com/pokenexus/pokedex/service/PokemonQueryService.java:61-63`), dựng Specification: `(primary = DRAGON OR secondary = DRAGON) AND species.generation.id = 4 AND formCategory IN (...)` (`backend/src/main/java/com/pokenexus/pokedex/repository/PokemonSpecifications.java:21-38`).
5. `PokemonRepository.findAll(spec, pageable)` với entity graph `species` (`backend/src/main/java/com/pokenexus/pokedex/repository/PokemonRepository.java:20-22`) trả `Page<Pokemon>`.
6. Tổng khác 0 nên bỏ qua `requireDataLoaded` (`PokemonQueryService.java:64-66`); `PageResponse.from(page, mapper::toSummary)` (`backend/src/main/java/com/pokenexus/common/web/PageResponse.java:10-17`, `backend/src/main/java/com/pokenexus/pokedex/mapper/PokemonMapper.java:22-31`).
7. Response 200 (CSV mẫu, `backend/src/test/java/com/pokenexus/pokedex/controller/PokemonControllerIT.java:270-285`; dữ liệu thật trả 6 kết quả, `PLAN.md:154`):

```json
{
  "content": [
    { "id": 443, "name": "gible", "types": ["dragon", "ground"], "generation": 4, "formCategory": "DEFAULT", "baseStatTotal": 300, "speed": 42 },
    { "id": 444, "name": "gabite", "types": ["dragon", "ground"], "generation": 4, "formCategory": "DEFAULT", "baseStatTotal": 410, "speed": 82 },
    { "id": 445, "name": "garchomp", "types": ["dragon", "ground"], "generation": 4, "formCategory": "DEFAULT", "baseStatTotal": 600, "speed": 102 }
  ],
  "page": 0, "size": 24, "totalElements": 3, "totalPages": 1
}
```

- BST, tốc độ của Gible (300, 42), Gabite (410, 82) cộng từ `backend/src/test/resources/csv/pokemon_stats.csv`; test chỉ khẳng định ID, tên của hai con này và đủ trường của Garchomp.
- Biến thể lỗi: `type=stellar` ra 400 `INVALID_PARAMETER`; `size=101` ra 400; bảng rỗng ra 503.

#### II. `POST /api/v1/synergy/analyze` với đội demo

1. `RequestBodyLimitFilter` đọc tối đa 16 KB (`RequestBodyLimitFilter.java:36-45`); Jackson dựng `AnalyzeRequest`; `@Valid` kiểm tra 1-6 phần tử, không `null` (`backend/src/main/java/com/pokenexus/synergy/dto/AnalyzeRequest.java:9`).
2. `SynergyController.analyze` (`backend/src/main/java/com/pokenexus/synergy/controller/SynergyController.java:31-35`) gọi `SynergyAnalyzer.analyze`.
3. `resolveTeam(ids, 6)` (`backend/src/main/java/com/pokenexus/synergy/service/SynergyAnalyzer.java:45-67`) gọi `registry.find(id)` cho từng ID; lần đầu nếu snapshot chưa có thì `reload()` (`backend/src/main/java/com/pokenexus/synergy/service/PokemonProfileRegistry.java:85-95`).
4. `evaluate` OR 5 mảng `superEffectiveAgainst` (`SynergyAnalyzer.java:69-77`), dựng `TeamAnalysis` (`backend/src/main/java/com/pokenexus/synergy/model/TeamAnalysis.java:24-51`): pressure, lỗ hổng, điểm 20.
5. `toResponse` dựng 18 dòng, danh sách chưa phủ, radar (`SynergyAnalyzer.java:79-109`); `TeamInsightBuilder.build` (`backend/src/main/java/com/pokenexus/synergy/service/TeamInsightBuilder.java:34-68`).
6. Không có truy vấn DB khi registry đã nạp. p95 đo được 7,2 ms với đội 5 (`docs/architecture.md:397`).

```json
{
  "pokemonIds": [6, 130, 149, 663, 637]
}
```

```json
{
  "members": [
    { "id": 6, "name": "charizard", "types": ["fire", "flying"] },
    { "id": 130, "name": "gyarados", "types": ["water", "flying"] },
    { "id": 149, "name": "dragonite", "types": ["dragon", "flying"] },
    { "id": 663, "name": "talonflame", "types": ["fire", "flying"] },
    { "id": 637, "name": "volcarona", "types": ["bug", "fire"] }
  ],
  "teamScore": 20.0,
  "typeMatrix": [
    { "attackingType": "rock", "multipliers": [4.0, 2.0, 2.0, 4.0, 4.0], "weakCount": 5, "resistCount": 0, "pressure": 8, "criticalHole": true },
    { "attackingType": "electric", "multipliers": [2.0, 4.0, 1.0, 2.0, 1.0], "weakCount": 3, "resistCount": 0, "pressure": 4, "criticalHole": true }
  ],
  "offensiveCoverage": { "coveredTypeCount": 11, "uncoveredTypes": ["normal", "flying", "poison", "ghost", "water", "electric", "fairy"] },
  "statRadar": { "hp": 85.4, "attack": 96.8, "defense": 77.6, "specialAttack": 95.6, "specialDefense": 91.8, "speed": 97.4 },
  "insights": [
    { "tone": "STRENGTH", "category": "SPEED", "text": "3 thành viên nhanh (tốc độ gốc từ 100)", "types": [] },
    { "tone": "WEAKNESS", "category": "DEFENSE", "text": "Lỗ hổng nghiêm trọng hệ Rock: 5 thành viên yếu, không ai kháng", "types": ["rock"] }
  ]
}
```

- `typeMatrix` thật có 18 dòng, `insights` thật có 8 mục (Phần 2, mục VII.9); khối trên rút gọn. Số liệu khớp `SynergyAnalyzerTest.java:32-77`.

#### III. `POST /api/v1/synergy/recommendations` với `playStyle: HYPER_OFFENSE`

1. Jackson dựng `RecommendationRequest`; compact constructor gán `limit 3`, `excludeLegendary false` nếu thiếu (`backend/src/main/java/com/pokenexus/synergy/dto/RecommendationRequest.java:22-26`); `@Valid` kiểm tra `pokemonIds` 1-5, `limit` 1-10.
2. `RecommendationEngine.recommend` (`backend/src/main/java/com/pokenexus/synergy/service/RecommendationEngine.java:51-99`): `resolveTeam(ids, 5)`, `evaluate`, `TeamStatProfile.of`.
3. Lọc `registry.all()`: chỉ `DEFAULT`/`REGIONAL`, đã tiến hóa hoàn toàn, ngoài đội, tốc độ gốc `>= 80` (`:101-112`, `backend/src/main/java/com/pokenexus/synergy/model/PlayStyle.java:6`).
4. Chấm `defenseValue`, `addedCoverage`, `RoleScorer.hyperOffense` (`backend/src/main/java/com/pokenexus/synergy/service/RoleScorer.java:43-59`), BST; chuẩn hóa min-max; điểm với trọng số 0,25/0,25/0,35/0,15 (`RecommendationEngine.java:151-165`).
5. Sắp, khử trùng tổ hợp hệ, lấy 3; `ReasonBuilder` sinh lý do, cảnh báo (`:82-97`).

```json
{
  "pokemonIds": [6, 130, 149, 663, 637],
  "limit": 3,
  "excludeLegendary": false,
  "playStyle": "HYPER_OFFENSE"
}
```

```json
{
  "playStyle": "HYPER_OFFENSE",
  "candidateCount": 9,
  "items": [
    { "id": 150, "name": "mewtwo", "types": ["psychic"], "score": "số 0-100, 1 chữ số thập phân",
      "breakdown": { "defense": "0-1", "offense": "0-1", "role": "0-1", "stats": "0-1" }, "baseStatTotal": 680,
      "reasons": ["Tốc độ gốc 130 (tối đa 200 ở cấp 50) và Tấn công đặc biệt 154: đánh trước, đánh mạnh"],
      "cautions": ["có thể rỗng"] },
    { "id": 530, "name": "excadrill", "types": ["ground", "steel"] },
    { "id": 445, "name": "garchomp", "types": ["dragon", "ground"] }
  ]
}
```

- Đây là kết quả trên `SynergyFixture` (`backend/src/test/java/com/pokenexus/synergy/service/RecommendationEngineTest.java:81-92`): 9 ứng viên, thứ tự Mewtwo, Excadrill, Garchomp, lý do đầu của Mewtwo như trên. `score`, `breakdown`, `cautions` không được test khẳng định nên ghi bằng chuỗi mô tả kiểu. Dữ liệu thật: cần dữ liệu DB.

#### IV. `POST /api/v1/teams` rồi `GET /api/v1/teams/shared/{shareCode}`

1. Bean Validation trên `CreateTeamRequest` (tên đã `strip`, 1-6 thành viên, slot 1-6, nickname tối đa 30) (`backend/src/main/java/com/pokenexus/team/dto/CreateTeamRequest.java:10-16`, `backend/src/main/java/com/pokenexus/team/dto/TeamMemberRequest.java:8-15`).
2. `TeamController.create` gọi `saveRateLimiter.acquire(remoteAddr)` (`backend/src/main/java/com/pokenexus/team/controller/TeamController.java:41`, `backend/src/main/java/com/pokenexus/team/service/SaveRateLimiter.java:45-59`).
3. `TeamService.create` (`backend/src/main/java/com/pokenexus/team/service/TeamService.java:62-87`) mở transaction ghi: sắp slot, kiểm tra trùng, `findRefs` (1 truy vấn `IN`), `synergyAnalyzer.analyze` (trong bộ nhớ), `nextFreeShareCode` (`:101-110`), dựng `Team` và `TeamMember`, `save` cascade.
4. `TeamMapper.toResponse` (`backend/src/main/java/com/pokenexus/team/mapper/TeamMapper.java:18-29`); Controller trả 201, `Location` (`TeamController.java:43`).
5. Mở lại: `TeamService.findByShareCode` kiểm tra regex (`TeamService.java:91-93`), `findByShareCode` với entity graph `members` (`backend/src/main/java/com/pokenexus/team/repository/TeamRepository.java:12-13`), `findRefs`, map. Điểm đội là giá trị đã lưu, không tính lại.

```json
{
  "name": "  Demo Team  ",
  "members": [
    { "slot": 6, "pokemonId": 150, "nickname": "Boss" },
    { "slot": 1, "pokemonId": 6, "nickname": null },
    { "slot": 2, "pokemonId": 445, "nickname": "Chomp" },
    { "slot": 3, "pokemonId": 373, "nickname": "" },
    { "slot": 4, "pokemonId": 134 },
    { "slot": 5, "pokemonId": 135, "nickname": "Volt" }
  ]
}
```

```json
{
  "shareCode": "a1B2c3D4",
  "name": "Demo Team",
  "synergyScore": 52.0,
  "createdAt": "2026-11-06T09:30:00Z",
  "members": [
    { "slot": 1, "id": 6, "name": "charizard", "types": ["fire", "flying"], "nickname": null },
    { "slot": 2, "id": 445, "name": "garchomp", "types": ["dragon", "ground"], "nickname": "Chomp" },
    { "slot": 3, "id": 373, "name": "salamence", "types": ["dragon", "flying"], "nickname": null },
    { "slot": 4, "id": 134, "name": "vaporeon", "types": ["water"], "nickname": null },
    { "slot": 5, "id": 135, "name": "jolteon", "types": ["electric"], "nickname": "Volt" },
    { "slot": 6, "id": 150, "name": "mewtwo", "types": ["psychic"], "nickname": "Boss" }
  ]
}
```

- Request và thứ tự response lấy từ `backend/src/test/java/com/pokenexus/team/controller/TeamControllerIT.java:31-77`; `shareCode`, `createdAt` là ví dụ (thực tế ngẫu nhiên và theo giờ chạy).
- `synergyScore 52.0` suy ra từ code với `type_efficacy.csv` mẫu: pressure Rock 2, Ice 3, Dragon 2, Ghost 1, Dark 1, Fairy 1 (tổng 10), lỗ hổng Dragon (Garchomp, Salamence đều x2, không ai kháng), nên `100 - 40 - 8 = 52`. Test không ghi số mà so với lời gọi `analyze` thật cùng 6 ID (`:167-175`).
- Header: `Location: /api/v1/teams/shared/<shareCode>`. Đổi hoa thường của mã thì 404 `TEAM_NOT_FOUND` (`:92-107`), mã `abc` thì 400 (`:115-118`).

#### V. Lần lưu thứ 11 từ cùng một IP trong 1 phút

1. Lần 1 (t = 0): khóa chưa có, `compute` tạo `Window(end = t + 60 s, count = 1)` (`backend/src/main/java/com/pokenexus/team/service/SaveRateLimiter.java:54-55`).
2. Lần 2-10: `count` tăng tới 10, không vượt `limitPerWindow = 10`.
3. Lần 11 (giả sử t = 18 s): `count = 11 > 10`, ném `RateLimitedException("Save limit exceeded, retry later", secondsUntil(now, end))` (`:56-58`); `secondsUntil` làm tròn lên 42 giây (`:72-75`).
4. `TeamService.create` không được gọi, không ghi DB.
5. `GlobalExceptionHandler.handleApiException` thấy `RateLimitedException`, thêm header `Retry-After` (`backend/src/main/java/com/pokenexus/common/exception/GlobalExceptionHandler.java:41-43`); `ErrorCode.RATE_LIMITED` là 429 (`backend/src/main/java/com/pokenexus/common/exception/ErrorCode.java:16`).
6. Từ t = 60 s, `isExpired` đúng nên lần lưu kế tiếp mở cửa sổ mới (`SaveRateLimiter.java:79-81`).

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 42
Content-Type: application/problem+json

{
  "type": "about:blank",
  "title": "Too Many Requests",
  "status": 429,
  "detail": "Save limit exceeded, retry later",
  "instance": "/api/v1/teams",
  "code": "RATE_LIMITED"
}
```

- Kiểm chứng: `backend/src/test/java/com/pokenexus/team/service/SaveRateLimiterTest.java:25-37` (42 giây), `backend/src/test/java/com/pokenexus/team/controller/TeamControllerIT.java:147-165` (10 lần 201, lần 11 là 429 với `Retry-After` 1-60, IP khác vẫn 201). Khối JSON theo `docs/api.md:420-433`.

#### VI. Khởi động khi DB rỗng, rồi dữ liệu xuất hiện

1. Ingestion tắt hoặc chưa chạy; `ApplicationReadyEvent` kích hoạt `TypeChartService.loadOnStartup` và `PokemonProfileRegistry.loadOnStartup`; `type_efficacy` không đủ 324 dòng nên log "not loaded", không ném lỗi (`backend/src/main/java/com/pokenexus/typechart/service/TypeChartService.java:42-49`, `:61-64`).
2. `GET /api/v1/types`: `types()` gọi `table()`, thử `reload()` thất bại, ném 503 `DATA_NOT_READY` (`:114-117`, `:127-137`).
3. `POST /api/v1/synergy/analyze`: `registry.find` gọi `current()`, `reload()` không có dữ liệu, 503 (`backend/src/main/java/com/pokenexus/synergy/service/PokemonProfileRegistry.java:85-95`).
4. `GET /api/v1/pokemon/charizard`: `findWithSpeciesByName` rỗng, `requireDataLoaded` thấy `count() == 0`, 503 thay vì 404 (`backend/src/main/java/com/pokenexus/pokedex/service/PokemonQueryService.java:79-82`).
5. `POST /api/v1/teams`: mọi ID không tìm thấy, `requireDataLoaded` ra 503 thay vì 400 `UNKNOWN_POKEMON` (`backend/src/main/java/com/pokenexus/team/service/TeamService.java:74-77`).
6. Sau khi dữ liệu được nạp vào DB, request kế tiếp (hoặc `/health`) gọi `reload()` thành công; không cần khởi động lại (`backend/src/test/java/com/pokenexus/typechart/service/TypeChartServiceTest.java:104-114`, `backend/src/test/java/com/pokenexus/synergy/service/SynergyAnalyzerTest.java:128-130`).

### IV. Câu hỏi có thể bị hỏi

| # | Câu hỏi | Trả lời mẫu (2-4 câu, nói được thành lời) | Nguồn |
|---|---|---|---|
| 1 | `PokemonController` làm những gì? | Nó chỉ nhận tham số, gọi đúng Service và gắn header cache. Không có logic nghiệp vụ hay truy vấn trong Controller, vì kiến trúc bắt buộc luồng Controller, Service, Repository một chiều. Validate tham số query nằm trong `PokemonFilter.of` và `PageRequestFactory.of`. | `backend/src/main/java/com/pokenexus/pokedex/controller/PokemonController.java:55-124`, `docs/architecture.md:87` |
| 2 | Lọc 2 hệ là AND hay OR? | AND giữa các hệ, OR giữa hai cột. Mỗi hệ thêm một điều kiện "cột hệ 1 bằng t hoặc cột hệ 2 bằng t", các điều kiện nối bằng AND, nên Pokémon phải có đủ cả hai hệ. Lọc Fire và Flying trên dữ liệu mẫu chỉ ra Charizard. | `backend/src/main/java/com/pokenexus/pokedex/repository/PokemonSpecifications.java:21-25`, `backend/src/test/java/com/pokenexus/pokedex/controller/PokemonControllerIT.java:287-293` |
| 3 | Làm sao chống SQL injection ở sort và lọc? | Lọc dùng Criteria API qua Specification với tham số bind, không nối chuỗi. `sort` chỉ nhận 4 thuộc tính trong whitelist, sai thì 400. Ô tìm kiếm còn lọc bằng regex `[a-z0-9-]+` nên ký tự `%`, `_` không lọt vào `LIKE`. | `PokemonSpecifications.java:18-41`, `backend/src/main/java/com/pokenexus/common/web/PageRequestFactory.java:42-44`, `backend/src/main/java/com/pokenexus/pokedex/service/PokemonQueryService.java:100-102` |
| 4 | Phân trang giới hạn thế nào, vì sao chặn `page` lớn? | `size` 1-100, mặc định 24; `page` không âm và tối đa `Integer.MAX_VALUE / size`. Chặn trên để `page x size` không tràn `int`, trước đây `page` cực lớn gây 500 và đã sửa trong bug bash 02/11. Luôn có khóa phụ `id` để thứ tự ổn định giữa các trang. | `PageRequestFactory.java:13-34`, `PLAN.md:161` |
| 5 | N+1 được tránh thế nào? | Các truy vấn trả nhiều Pokémon dùng `@EntityGraph` hoặc `JOIN FETCH` để lấy `species` cùng lúc; chuỗi tiến hóa gom ID rồi truy vấn `IN` một lần; đội chia sẻ fetch `members` bằng entity graph. Mapper chỉ đọc ID của `generation`, không chạm trường khác của proxy. Tôi chưa bật log SQL để đếm chính xác số câu. | `backend/src/main/java/com/pokenexus/pokedex/repository/PokemonRepository.java:20-42`, `backend/src/main/java/com/pokenexus/pokedex/service/EvolutionService.java:59-64`, `backend/src/main/java/com/pokenexus/team/repository/TeamRepository.java:12-13` |
| 6 | Vì sao Entity có `@Immutable`? | Dữ liệu Pokédex chỉ đọc, được nạp từ CSV một lần. `@Immutable` cho Hibernate biết không cần dirty checking và không bao giờ UPDATE các bảng này. Chỉ `Team`, `TeamMember` là ghi được. | `backend/src/main/java/com/pokenexus/pokedex/entity/Pokemon.java:26`, `backend/src/main/java/com/pokenexus/team/entity/Team.java:22-26` |
| 7 | `base_stat_total` lấy từ đâu? | Là cột sinh `STORED` trong MySQL bằng tổng 6 chỉ số, có index để lọc và sắp. Entity đánh dấu `insertable = false, updatable = false` để Hibernate không ghi vào cột này. | `backend/src/main/resources/db/migration/V2__create_pokedex_tables.sql:35-36`, `Pokemon.java:75-76` |
| 8 | Tìm kiếm tên xếp kết quả thế nào? | Một câu JPQL lấy tên chứa `q`, sắp bằng `CASE WHEN tên bắt đầu bằng q THEN 0 ELSE 1`, rồi theo ID; `LIMIT` qua `Pageable`. `q` được trim, chữ thường, khoảng trắng thành gạch nối. Gõ "ch" ra Charmander, Charmeleon, Charizard trước rồi mới tới Pikachu. | `PokemonRepository.java:44-49`, `PokemonQueryService.java:87-109`, `PokemonControllerIT.java:93-109` |
| 9 | DB rỗng thì API trả gì? | Trả 503 `DATA_NOT_READY` chứ không phải 404 hay 400. Mỗi đường đọc khi không thấy kết quả sẽ hỏi `count()` của bảng `pokemon`; cache trong bộ nhớ thì ném 503 khi chưa nạp được. Nhờ vậy frontend phân biệt "chưa có dữ liệu" với "không tồn tại". | `PokemonQueryService.java:139-143`, `backend/src/main/java/com/pokenexus/typechart/service/TypeChartService.java:127-137`, `backend/src/main/java/com/pokenexus/synergy/service/PokemonProfileRegistry.java:85-95` |
| 10 | `idOrName` khi nào 400, khi nào 404? | Toàn chữ số thì coi là ID, dài quá 9 chữ số thì coi như không tồn tại, ra 404. Còn lại phải khớp `^[a-z0-9-]{1,60}$`, không khớp (ví dụ có chữ hoa) thì 400 `INVALID_PARAMETER`. Đúng định dạng mà không có thì 404 `POKEMON_NOT_FOUND`. | `PokemonQueryService.java:126-137`, `PokemonControllerIT.java:77-90` |
| 11 | So sánh "lợi thế hệ" tính thế nào? | Với mỗi hệ của bên A, tính hệ số khi đánh vào toàn bộ hệ của bên B (nhân lại), lấy giá trị lớn nhất; làm tương tự chiều ngược, bên lớn hơn thắng. Garchomp và Salamence đều có đòn Dragon x2 nên hòa, BST cùng 600, Garchomp nhanh hơn 2. Chỉ xét hệ, không xét chiêu thức hay Ability. | `backend/src/main/java/com/pokenexus/pokedex/service/CompareService.java:47-66`, `backend/src/test/java/com/pokenexus/pokedex/service/CompareServiceTest.java:40-52` |
| 12 | So sánh `445` với `garchomp` thì sao? | Bị chặn 400. Bước đầu so chuỗi giống hệt; bước hai, sau khi tra DB, so `id` của hai kết quả, nên ID và tên cùng một Pokémon vẫn bị phát hiện. | `CompareService.java:36-43`, `CompareServiceTest.java:67-79` |
| 13 | Chuỗi tiến hóa dựng thế nào, nhánh Eevee? | Backend trả danh sách phẳng mọi loài trong chuỗi, xếp theo `speciesId`, mỗi loài kèm `evolvesFromSpeciesId`, điều kiện. Frontend dựng cây từ quan hệ cha con nên nhánh nhiều con như Eevee tự nhiên ra nhiều nhánh. Loài không có chuỗi trả `chainId 0` với một giai đoạn. | `backend/src/main/java/com/pokenexus/pokedex/service/EvolutionService.java:46-80`, `docs/api.md:172` |
| 14 | Speed tiers làm gì, vì sao không có Mega? | Gom dạng `DEFAULT`, `REGIONAL` theo tốc độ gốc, mốc nhanh nhất trước, trong mốc theo ID. Spec F09 định nghĩa tỷ lệ "nhanh hơn N%" chỉ trên hai loại dạng này, nên backend lọc đúng như vậy. Tốc độ cấp 50 và tỷ lệ tính ở frontend; backend chỉ trả mốc tốc độ gốc, client cache 1 giờ. | `backend/src/main/java/com/pokenexus/pokedex/service/SpeedTierService.java:25-54`, `docs/spec.md:155-162` |
| 15 | Hồ sơ thế hệ chọn "mạnh nhất" thế nào, có cache không? | Lấy BST cao nhất trong nhóm không huyền thoại, không thần thoại, hòa thì ID nhỏ hơn; thế hệ chỉ có huyền thoại thì lấy BST cao nhất. Kết quả tính một lần rồi giữ trong trường `volatile` vì dữ liệu tĩnh, kèm header cache 1 giờ. | `backend/src/main/java/com/pokenexus/pokedex/service/GenerationProfileService.java:41-94` |
| 16 | Type chart nạp lúc nào, nếu thiếu dòng thì sao? | Nạp ở `ApplicationReadyEvent`, sau ingestion. Phải đủ 324 dòng mới nhận, thiếu thì giữ trạng thái chưa nạp và API trả 503; lần gọi sau sẽ thử nạp lại. Hệ số lưu dạng `damage_factor / 100`. | `TypeChartService.java:42-73`, `backend/src/test/java/com/pokenexus/typechart/service/TypeChartServiceTest.java:87-114` |
| 17 | Hệ số hệ kép tính thế nào? | Nhân hệ số của từng hệ phòng thủ. Rock vào Fire/Flying là 2 x 2 = 4; Ground vào Fire/Flying là 2 x 0 = 0. Đây đúng luật game và được kiểm bằng ví dụ 3 của spec. | `TypeChartService.java:79-86`, `TypeChartServiceTest.java:28-41` |
| 18 | Vì sao Synergy tính trong bộ nhớ? | Đề xuất phải chấm khoảng 1.300 ứng viên trên 18 hệ, và điểm phụ thuộc đội hiện tại nên không đánh index hay tính sẵn trong DB được. Nạp sẵn bảng tương khắc và hồ sơ vào RAM cho tốc độ cao, dễ unit test. Đánh đổi là dữ liệu đổi thì phải nạp lại hoặc khởi động lại. | `docs/adr/0003-in-memory-synergy.md:8-26` |
| 19 | `PokemonProfileRegistry` an toàn đa luồng thế nào? | Snapshot là record bất biến, gán qua một trường `volatile`; `reload` có `synchronized` để không nạp chồng. Mỗi `PokemonProfile` sao chép mảng và không có setter. Reader không cần khóa và luôn thấy snapshot cũ hoặc mới trọn vẹn. | `PokemonProfileRegistry.java:31`, `:52-75`, `backend/src/main/java/com/pokenexus/synergy/model/PokemonProfile.java:21-36` |
| 20 | Thang `defenseScore` là gì, vì sao miễn nhiễm +3? | Hệ số 0, 0.25, 0.5, 1, 2, 4 đổi thành +3, +2, +1, 0, -1, -2, cách đều nhau một bậc. Miễn nhiễm chặn hoàn toàn nên nằm bậc cao nhất. Đây là lựa chọn thiết kế; tài liệu không ghi lý do chọn đúng các số này, nên nếu bị hỏi sâu thì nói thẳng là chọn theo thang bậc đều, chưa hiệu chỉnh bằng dữ liệu. | `backend/src/main/java/com/pokenexus/synergy/model/DefenseScale.java:4-34`, `docs/architecture.md:211-216` |
| 21 | `pressure` và `criticalHole` là gì? | Với mỗi hệ tấn công, `pressure` bằng tổng mức yếu trừ số người kháng, không âm; nó đo mức hở còn lại sau khi đồng đội che. `criticalHole` là mức yếu từ 2 trở lên mà không ai kháng, tức hệ đó đánh vào đội không có ai đổi vào đỡ. | `backend/src/main/java/com/pokenexus/synergy/model/TeamAnalysis.java:32-48` |
| 22 | Công thức `teamScore`? Đội demo ra bao nhiêu? | `100 - 4 x tổng pressure - 8 x số lỗ hổng`, kẹp 0-100. Đội demo có tổng pressure 16 (Rock 8, Electric 4, Flying, Water, Ice, Dragon mỗi hệ 1) và 2 lỗ hổng, nên 100 - 64 - 16 = 20. | `TeamAnalysis.java:49-50`, `backend/src/test/java/com/pokenexus/synergy/service/SynergyAnalyzerTest.java:44-67` |
| 23 | Vì sao Rock bị đánh dấu ở đội demo? | Bốn con mang Flying hoặc Fire, Volcarona là Bug/Fire, nên Rock đánh x2 hoặc x4 vào cả 5 con; tổng mức yếu là 8. Không ai có Ground, Steel hay Fighting để kháng, nên `resistCount = 0`, đủ điều kiện lỗ hổng nghiêm trọng. | `SynergyAnalyzerTest.java:32-42`, `docs/spec.md:89` |
| 24 | Thêm Excadrill vì sao điểm lên 48? | Excadrill Ground/Steel nhận Rock x0,25 và miễn nhiễm Electric, nên cả hai lỗ hổng biến mất (mất 16 điểm phạt) và pressure Rock, Electric giảm 1 mỗi hệ. Nó thêm 1 pressure ở Water nhưng xóa pressure Flying và Dragon. Tổng pressure còn 13, điểm 100 - 52 = 48. | `SynergyAnalyzerTest.java:88-99`, `docs/spec.md:93` |
| 25 | Độ phủ tấn công tính thế nào, hạn chế gì? | Một hệ phòng thủ được tính là phủ nếu có thành viên mang hệ đánh nó x2. Giả định mỗi Pokémon có chiêu cùng hệ, không xét chiêu thật, cũng không xét tổ hợp hệ kép phía đối thủ. Phần này tính sẵn khi nạp registry nên mỗi request chỉ OR các mảng boolean. | `backend/src/main/java/com/pokenexus/synergy/service/SynergyAnalyzer.java:69-77`, `TypeChartService.java:96-105` |
| 26 | Đánh giá đội (insights) sinh ra thế nào? | `TeamInsightBuilder` xét lần lượt các điều kiện cố định: hệ chịu tốt, không lỗ hổng, độ phủ rộng, cân bằng vật lý đặc biệt, tốc độ, lệch phòng thủ, trùng hệ, lỗ hổng, yếu chồng, độ phủ còn thiếu. Mục vai trò chỉ xét khi đội từ 3 người. Kết quả sắp điểm mạnh trước điểm yếu. | `backend/src/main/java/com/pokenexus/synergy/service/TeamInsightBuilder.java:34-68`, `docs/architecture.md:284-298` |
| 27 | Ứng viên đề xuất bị lọc những gì? | Chỉ dạng thường, dạng vùng; đã tiến hóa hoàn toàn; không có trong đội; theo tùy chọn loại huyền thoại, thần thoại, Paradox; BST tối thiểu; và giới hạn tốc độ của lối chơi. Mega vẫn được đưa vào đội để phân tích nhưng không được đề xuất. | `backend/src/main/java/com/pokenexus/synergy/service/RecommendationEngine.java:101-116`, `docs/spec.md:231` |
| 28 | Paradox là gì, vì sao hard-code ID? | 20 Pokémon Paradox của thế hệ 9 rất mạnh nhưng CSV PokéAPI không đánh dấu là huyền thoại. Để `excludeLegendary` có ý nghĩa, chúng được liệt kê bằng ID. Nhược điểm là phải sửa tay khi game có Paradox mới. | `RecommendationEngine.java:32-34`, `docs/architecture.md:245` |
| 29 | Điểm đề xuất gồm những gì? | Bốn thành phần: phòng thủ, độ phủ thêm, vai trò chỉ số, BST. Mỗi thành phần chuẩn hóa min-max về 0-1 trên tập ứng viên, nhân trọng số của lối chơi (Cân bằng 40/20/25/15), rồi nhân 100. `breakdown` trả 4 giá trị chuẩn hóa để người dùng thấy vì sao. | `RecommendationEngine.java:151-165`, `backend/src/main/java/com/pokenexus/synergy/model/PlayStyle.java:5-8` |
| 30 | Công thức `defenseValue` có ý nghĩa gì? | Kháng hệ `a` được cộng `pressure[a] x s`, nên chỉ có giá trị ở chỗ đội đang hở. Yếu hệ `a` bị trừ `(1 + pressure[a]) x mức yếu`, luôn bị phạt và phạt nặng hơn nếu đội đã hở hệ đó. Với đội demo, kháng Rock x0,25 được 16 điểm, lớn nhất trong mọi số hạng. | `RecommendationEngine.java:118-130` |
| 31 | `playStyle` thay đổi gì? | Đổi bộ trọng số, đổi cách tính vai trò chỉ số trong `RoleScorer`, và lọc tốc độ gốc: Hyper Offense chỉ nhận từ 80, Trick Room tối đa 60. Ví dụ Trick Room trên đội demo của fixture chỉ còn Swampert. | `PlayStyle.java:5-46`, `backend/src/main/java/com/pokenexus/synergy/service/RoleScorer.java:25-79`, `RecommendationEngineTest.java:94-104` |
| 32 | Vai trò chỉ số ở lối Cân bằng tính gì? | 40% bù lệch tấn công: đội thiên vật lý thì ưu tiên ứng viên đặc biệt mạnh; 30% bù lệch phòng thủ; 30% nhu cầu tốc độ: đội chưa có đủ 1/3 thành viên tốc độ gốc từ 100 thì ưu tiên ứng viên nhanh. Đội đã đủ người nhanh thì phần tốc độ là hằng 0,5 cho mọi ứng viên. | `RoleScorer.java:35-41`, `:81-121` |
| 33 | Hòa điểm xử lý thế nào? Kết quả có ổn định không? | Sắp theo điểm đã làm tròn 1 chữ số, hòa thì BST cao hơn, rồi ID nhỏ hơn. Không có ngẫu nhiên, không phụ thuộc thứ tự `HashMap`, nên cùng đầu vào luôn ra cùng kết quả; có test gọi hai lần so bằng nhau. | `RecommendationEngine.java:74-80`, `RecommendationEngineTest.java:175-180` |
| 34 | Vì sao 3 đề xuất không trùng tổ hợp hệ? | Để người dùng có lựa chọn thật sự khác nhau; ba con cùng Ground/Dragon sẽ chỉ là một lời khuyên. Engine duyệt danh sách đã xếp và bỏ con nào có tổ hợp hệ đã dùng, ví dụ Flygon bị bỏ vì Garchomp cùng hệ xếp trên. | `RecommendationEngine.java:82-91`, `RecommendationEngineTest.java:53-55` |
| 35 | Lý do và cảnh báo sinh thế nào? | Lý do theo thứ tự: tối đa 2 hệ kháng ở chỗ đội hở, tối đa 2 lý do vai trò, hệ phủ thêm, BST cao; tối đa 4 câu và luôn có ít nhất 1. Cảnh báo khi ứng viên yếu thêm một hệ mà đội đã có từ 2 người yếu, hoặc trùng hệ với từ 2 thành viên. | `backend/src/main/java/com/pokenexus/synergy/service/ReasonBuilder.java:26-64` |
| 36 | Phân tích 7 Pokémon, hoặc xin đề xuất cho đội 6 thì sao? | Cả hai trả 400 `VALIDATION_FAILED`. Bean Validation chặn ở Controller (`@Size` 6 và 5), Service kiểm tra lại vì còn được gọi trực tiếp từ `TeamService` và test. Phân tích nhận 6 để chấm cả slot 6, đề xuất chỉ nhận 5 vì đội phải còn chỗ trống. | `backend/src/main/java/com/pokenexus/synergy/dto/AnalyzeRequest.java:9`, `backend/src/main/java/com/pokenexus/synergy/dto/RecommendationRequest.java:13`, `docs/spec.md:234` |
| 37 | Lưu đội diễn ra thế nào? | Kiểm tra giới hạn tần suất, rồi trong một transaction: kiểm tra slot, Pokémon trùng, ID tồn tại, chấm điểm bằng `SynergyAnalyzer`, sinh mã, lưu `teams` và `team_members` bằng cascade. Trả 201 kèm `Location` tới đường dẫn chia sẻ. | `backend/src/main/java/com/pokenexus/team/controller/TeamController.java:37-44`, `backend/src/main/java/com/pokenexus/team/service/TeamService.java:62-87` |
| 38 | Mã chia sẻ sinh thế nào, có trùng không? | 8 ký tự base62 từ `SecureRandom`, khoảng 2,18 x 10^14 tổ hợp nên khó đoán. Trước khi lưu kiểm tra tồn tại, trùng thì sinh lại, tối đa 3 lần rồi 500. Cột có collation `utf8mb4_bin` và UNIQUE nên phân biệt hoa thường và DB chặn trùng lần cuối. | `backend/src/main/java/com/pokenexus/team/service/ShareCodeGenerator.java:11-23`, `TeamService.java:101-110`, `backend/src/main/resources/db/migration/V3__create_team_tables.sql:5-10` |
| 39 | Giới hạn lưu đội hoạt động thế nào? | 10 lần mỗi phút mỗi IP, cửa sổ cố định trong `ConcurrentHashMap`. Lần 11 trả 429 với `Retry-After` là số giây tới hết cửa sổ, làm tròn lên. Theo dõi tối đa 10.000 IP; đầy thì dọn cửa sổ hết hạn, vẫn đầy thì IP mới nhận 429. | `backend/src/main/java/com/pokenexus/team/service/SaveRateLimiter.java:18-75`, `backend/src/test/java/com/pokenexus/team/service/SaveRateLimiterTest.java:25-114` |
| 40 | IP lấy từ đâu, giả mạo header được không? | Lấy `getRemoteAddr()`; ở `prod` bật `forward-headers-strategy: framework` nên Spring thay bằng IP trong header proxy. Railway ghi đè `X-Forwarded-For`, nhưng header `Forwarded` (RFC 7239) được Spring đọc trước và chưa kiểm chứng trên Railway, đang mở trong PLAN là B3. Đây là chống spam cơ bản, chấp nhận rủi ro. | `TeamController.java:41`, `backend/src/main/resources/application-prod.yml:2`, `PLAN.md:115`, `docs/architecture.md:382` |
| 41 | Mở đội đã lưu có tính lại điểm không? | Không, trả `synergy_score` đã lưu lúc tạo (DECIMAL 2 chữ số). Tên, hệ của thành viên thì lấy mới qua `findRefs`. Nếu sau này đổi thuật toán, điểm cũ vẫn giữ. | `TeamService.java:89-99`, `docs/api.md:377` |
| 42 | Hiệu năng đo được bao nhiêu? | Mục tiêu p95 dưới 50 ms. Đo 28/10 với 1.351 Pokémon trong Docker: `analyze` 7,2 ms (đội 5), 6,9 ms (đội 6), `recommendations` 8,6 ms; phần lớn là chi phí HTTP. Số này đo trước PR #60 (31/10) thêm vai trò chỉ số; tài liệu chưa ghi số đo lại sau đó. | `docs/spec.md:196`, `docs/architecture.md:392-397`, `PLAN.md:56` |
| 43 | Điểm yếu thật thà của thuật toán? | Chỉ xét hệ, bỏ qua Ability như Levitate, chiêu thức, vật phẩm. `teamScore` chỉ đo phòng thủ. Điểm đề xuất chuẩn hóa tương đối nên không so được giữa hai lần gọi, và tập 1 ứng viên luôn được 100. Trọng số là lựa chọn thiết kế dựa trên hướng dẫn cộng đồng, chưa hiệu chỉnh bằng dữ liệu trận đấu. | `docs/architecture.md:220`, `:266`, `RecommendationEngineTest.java:94-104` |
| 44 | Muốn thêm một lối chơi mới thì sửa đâu? | Thêm hằng vào enum `PlayStyle` với 4 trọng số và giới hạn tốc độ, thêm nhánh trong `switch` của `RoleScorer.score` (compiler bắt buộc vì `switch` phủ hết enum), viết test trong `RecommendationEngineTest`, cập nhật `docs/api.md`, `docs/architecture.md`. Frontend thêm lựa chọn. | `PlayStyle.java:5-8`, `RoleScorer.java:25-33` |
| 45 | Test bảo đảm những gì? | 5 ví dụ có đáp án của spec là unit test bắt buộc (`SynergyAnalyzerTest`, `RecommendationEngineTest`, `TypeChartServiceTest`). Tích hợp chạy MySQL 8.4 thật bằng Testcontainers với CSV mẫu, kiểm cả header cache, mã lỗi, giới hạn 429. Unit test Synergy dùng catalogue viết tay để không phụ thuộc DB. | `docs/spec.md:262-268`, `backend/src/test/java/com/pokenexus/synergy/service/SynergyFixture.java:30-70` |

### V. Lệch giữa code và tài liệu

- **Cache HTTP:** `docs/architecture.md:399-405` chỉ liệt kê `/types`, `/types/matrix` (1 ngày), `/pokemon/{idOrName}` (1 giờ) và ghi "Các endpoint còn lại: Không đặt". Code còn đặt `public, max-age=3600` cho `/pokemon/speed-tiers` và `/pokemon/generations` (`backend/src/main/java/com/pokenexus/pokedex/controller/PokemonController.java:96-110`); `docs/api.md:176`, `:183` thì đã ghi đúng.
- **Sơ đồ đề xuất:** `docs/architecture.md:174` vẽ `RecommendationEngine` gọi `analyze(ids)`; code gọi `resolveTeam` và `evaluate`, không dựng `AnalyzeResponse` hay insights (`backend/src/main/java/com/pokenexus/synergy/service/RecommendationEngine.java:52-53`).
- **Vòng lặp mã chia sẻ:** `docs/architecture.md:199-202` vẽ vòng "next() rồi INSERT" tối đa 3 lần. Code kiểm tra bằng `existsByShareCode` tối đa 3 lần rồi INSERT đúng một lần; trùng ở bước INSERT (đua giữa hai request) không được thử lại mà ra lỗi ràng buộc (`backend/src/main/java/com/pokenexus/team/service/TeamService.java:86`, `:101-110`).
- **Số ví dụ có đáp án:** `docs/architecture.md:541` ghi "Bốn ví dụ có đáp án ở spec, mục V.4"; `docs/spec.md:87-93` có 5 ví dụ (ví dụ 5 thêm ở spec 1.3). `PLAN.md:48` cũng ghi "4 ví dụ" (nhật ký cũ).
- **Phiên bản spec được trích:** `docs/architecture.md:270` ghi "(spec 1.6, Phần 5)"; `docs/spec.md:3` là phiên bản 1.5.
- **Tên DTO:** `docs/architecture.md:154` ghi `PageResponse<PokemonSummaryResponse>`; code dùng `PokemonSummary` (`PokemonController.java:57`).
- **Lỗi của endpoint tiến hóa và so sánh:** `docs/api.md:171` chỉ nêu 404 cho `/evolution`, `docs/api.md:121` nêu 400 cho thiếu tham số hoặc trùng; code còn trả 400 `INVALID_PARAMETER` khi `idOrName` sai định dạng ở cả hai (`backend/src/main/java/com/pokenexus/pokedex/service/PokemonQueryService.java:133-135`; test `backend/src/test/java/com/pokenexus/pokedex/controller/PokemonControllerIT.java:243-246`).
- **Ví dụ response trong api.md:** `docs/api.md:460-478` (ghi "minh họa") cho đội demo `teamScore 41.0` và `coveredTypeCount 12` với 3 hệ chưa phủ (12 + 3 khác 18). Code cho chính request đó ra `20.0`, 11 hệ phủ, 7 hệ chưa phủ (`backend/src/test/java/com/pokenexus/synergy/service/SynergyAnalyzerTest.java:64`, `:73-75`). Dễ gây nhầm nếu giám khảo đọc api.md.
- **Kích thước CSV mẫu:** `docs/folder-structure.md:86`, `docs/architecture.md:540`, `backend/CLAUDE.md` ghi "khoảng 20 Pokémon"; `backend/src/test/resources/csv/pokemon.csv` có 62 dòng dữ liệu và test khẳng định `pokemonCount 62` (`backend/src/test/java/com/pokenexus/synergy/controller/SynergyControllerIT.java:39`). Unit test Synergy dùng 21 mục trong `SynergyFixture`, không dùng CSV.
- **Kết quả đề xuất ghi trong PLAN:** `PLAN.md:48`, `:138`, `:143` ghi đề xuất số 1 là Iron Treads với lý do "Chống chịu hệ Rock". Câu lý do hiện tại là "Kháng hệ Rock (x...)" (`backend/src/main/java/com/pokenexus/synergy/service/ReasonBuilder.java:74`) và trọng số đã đổi ở PR #60 ngày 31/10; nhật ký là lịch sử, kết quả hiện tại trên dữ liệu thật chưa được ghi lại.
- **Trường không dùng:** `TeamStatProfile.slowMembers` và hằng `SLOW_BASE_SPEED` được tính (`backend/src/main/java/com/pokenexus/synergy/model/TeamStatProfile.java:12`, `:18`, `:41`) nhưng không nơi nào trong main đọc; tài liệu không nhắc tới.

---

## Phần 5. Frontend nền tảng: khởi động, routing, thư viện dùng chung, component

- Phạm vi: `frontend/src/main.tsx`, `frontend/src/app/**`, `frontend/src/lib/**`, `frontend/src/components/**`, `frontend/src/types/**`, `frontend/src/test/**`, `frontend/src/pages/RouteErrorPage.tsx`, `frontend/src/pages/NotFoundPage.tsx`, `frontend/src/styles/index.css`, cấu hình trong `frontend/` (`package.json`, `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `.prettierrc`, `.prettierignore`, `index.html`) và bố cục `frontend/public/`.
- Ngoài phạm vi: `features/**` và 8 trang còn lại trong `pages/`; chỉ nhắc tới khi chúng là nơi gọi code trong phạm vi.
- Tổng số file: 68 file trong `src` thuộc phạm vi (52 file mã, 16 file test) và 9 file cấu hình.

### I. Bức tranh chung

```mermaid
flowchart TD
    HTML["index.html<br/>div#root"] --> MAIN["main.tsx<br/>font, index.css, StrictMode"]
    MAIN --> APP["app/App.tsx"]
    APP --> PROV["app/providers.tsx<br/>QueryClientProvider"]
    PROV --> QC["lib/queryClient.ts<br/>retry, refetch"]
    QC --> HTTP["lib/http.ts<br/>ApiError"]
    APP --> RP["RouterProvider<br/>react-router/dom"]
    RP --> ROUTER["app/router.tsx<br/>routes, lazyPage"]
    ROUTER --> LAYOUT["app/layout/AppLayout<br/>Header, Footer, ScrollRestoration"]
    ROUTER --> ERRP["pages/RouteErrorPage<br/>pages/NotFoundPage"]
    ROUTER -->|"import() theo route"| PAGES["8 trang lazy<br/>(ngoài phạm vi)"]
    PAGES --> FEAT["features/*<br/>api.ts, hooks.ts"]
    FEAT --> HTTP
    FEAT --> TYPES["types/api.ts"]
    HTTP --> TYPES
    PAGES --> SCENE["components/scene<br/>PageHero, SceneBackdrop"]
    ERRP --> SCENE
    ERRP --> UI["components/ui<br/>Panel, buttonStyles"]
    PAGES --> UI
    PAGES --> PKM["components/pokemon"]
    LAYOUT --> PKM
    PKM -->|"PokemonSearchBox"| FEAT
    SCENE --> LSCN["frontend/src/lib/scenes.ts, lib/assets.ts"]
    PKM --> LPKM["lib/assets, formatters, pokemonTypes"]
    SCENE --> RM["scene/useReducedMotion"]
    MOTION["components/motion<br/>Reveal, usePauseOffscreen"] --> RM
    CSS["styles/index.css<br/>token, utility, keyframes"] -.->|"class Tailwind"| UI
    CSS -.-> SCENE
    CSS -.-> PKM
```

- **Điểm vào:** `index.html` nạp `main.tsx`; `main.tsx` nạp font và CSS toàn cục rồi render `App` trong `StrictMode` (`frontend/src/main.tsx:1-22`). `App` lồng `RouterProvider` trong `AppProviders` (`frontend/src/app/App.tsx:6-11`).
- **`app/` chỉ dựng khung:** provider, bảng route, layout chung (Header, Footer, skip link, `ScrollRestoration`). Không chứa logic nghiệp vụ.
- **`pages/` ghép tính năng:** mỗi trang là một chunk riêng nhờ `lazy` (`frontend/src/app/router.tsx:14-21`). Hai trang trong phạm vi (`RouteErrorPage`, `NotFoundPage`) được import tĩnh vì phải có sẵn khi chunk khác lỗi (`frontend/src/app/router.tsx:4-5`).
- **Dữ liệu server chỉ đi một đường:** `features/*/api.ts` gọi `getJson`/`postJson` trong `frontend/src/lib/http.ts`, `features/*/hooks.ts` bọc bằng `useQuery`. Component không gọi `fetch` trực tiếp (`frontend/CLAUDE.md`, Phần 3, mục I).
- **Ảnh không đến từ backend:** URL sprite, artwork, ảnh khung cảnh chỉ sinh trong `frontend/src/lib/assets.ts` từ ID hoặc mã scene (ADR 0005, `frontend/src/lib/assets.ts:12-30`).
- **Hệ thống khung cảnh:** dữ liệu ở `frontend/src/lib/scenes.ts` (15 scene, bảng màu, số ảnh, kiểu hạt), hiển thị ở `components/scene`, keyframes và utility ở `frontend/src/styles/index.css`. Chuyển động tắt theo `prefers-reduced-motion` ở cả JS và CSS.
- **Ba tầng lỗi:** lỗi render hoặc lỗi tải chunk rơi vào `errorElement` (`RouteErrorPage`); lỗi API hiện `ErrorState` với thông điệp tiếng Việt theo `code`; URL lạ rơi vào route `*` (`NotFoundPage`).
- **Hai chỗ phá ranh giới tầng (cần biết khi bị hỏi):** `frontend/src/components/pokemon/PokemonSearchBox.tsx` import hook từ `features/dex` (`frontend/src/components/pokemon/PokemonSearchBox.tsx:3-4`); `frontend/src/app/layout/footerPokemon.ts` import `GENERATIONS` từ `features/landing` (`frontend/src/app/layout/footerPokemon.ts:1`).
- **Kiểm thử:** Vitest chạy trên jsdom, React Testing Library; `frontend/src/test/renderRoute.tsx` dựng router thật từ mảng `routes` với lazy đã giải sẵn và `fetch` giả.

### II. Từng file

#### I. Cấu hình và điểm vào

**1. `package.json` (`frontend/package.json`)**

- **Vai trò:** khai báo gói `pokenexus-frontend`, ESM (`"type": "module"`), yêu cầu Node từ 24 (`frontend/package.json:2-8`), script và dependency.
- **Thành phần chính:** các script (`frontend/package.json:9-18`):

| Script | Lệnh | Mục đích |
|---|---|---|
| `dev` | `vite` | Dev server có HMR ở cổng 5173 |
| `build` | `tsc -b && vite build` | Kiểm tra kiểu theo project references (`tsconfig.json`), đạt thì Vite đóng gói vào `dist/` |
| `lint` | `eslint .` | Chạy cấu hình flat ở `eslint.config.js` |
| `test` | `vitest run` | Chạy toàn bộ test một lần (CI) |
| `test:watch` | `vitest` | Chạy test theo dõi thay đổi |
| `format` | `prettier --write .` | Định dạng lại mã |
| `format:check` | `prettier --check .` | Chỉ kiểm tra định dạng |
| `preview` | `vite preview` | Phục vụ thử thư mục `dist/` |

- **Phụ thuộc:** bảng dưới, phiên bản đã cài đọc từ `node_modules` (react-router 8.5.0, @tanstack/react-query 5.104.5, vite 8.3.5, react 19.3.1, tailwindcss 4.3.3, typescript 6.0.3, vitest 5.0.5).

| Gói | Loại | Mục đích | Nơi dùng |
|---|---|---|---|
| `@fontsource/dela-gothic-one` | runtime | Font Display (tiêu đề, logo), chỉ weight 400 | `frontend/src/main.tsx:1-3` |
| `@fontsource-variable/nunito` | runtime | Font Text dạng variable | `frontend/src/main.tsx:4` |
| `@fontsource-variable/pixelify-sans` | runtime | Font Pixel trang trí | `frontend/src/main.tsx:5` |
| `@tanstack/react-query` | runtime | Cache dữ liệu server, trạng thái tải, lỗi, retry | `providers.tsx`, `frontend/src/lib/queryClient.ts`, `features/*/hooks.ts` |
| `react`, `react-dom` | runtime | UI, `createRoot` | `main.tsx`, toàn bộ component |
| `react-router` | runtime | Data router, `Link`, `NavLink`, `ScrollRestoration` | `frontend/src/app/router.tsx`, layout |
| `@eslint/js`, `eslint`, `typescript-eslint`, `globals` | dev | Lint JS, TS, biến toàn cục trình duyệt | `eslint.config.js` |
| `eslint-plugin-react-hooks` | dev | Quy tắc gọi hook | `eslint.config.js:15` |
| `eslint-plugin-react-refresh` | dev | Cảnh báo file export lẫn component và thứ khác làm hỏng Fast Refresh | `eslint.config.js:16` |
| `@vitejs/plugin-react` | dev | Biên dịch JSX, Fast Refresh | `vite.config.ts:23` |
| `@tailwindcss/vite`, `tailwindcss` | dev | Tailwind 4 chạy như plugin Vite, đọc `@theme` | `vite.config.ts:23`, `frontend/src/styles/index.css:1` |
| `vite`, `vitest`, `jsdom` | dev | Build, test runner, DOM giả cho test | `vite.config.ts:29-34` |
| `@testing-library/react`, `/dom`, `/user-event`, `/jest-dom` | dev | Render, truy vấn theo vai trò, mô phỏng gõ phím, matcher `toBeInTheDocument` | mọi file test, `frontend/src/test/setup.ts:1` |
| `@types/node`, `@types/react`, `@types/react-dom` | dev | Kiểu cho `vite.config.ts` (`node:url`, `process`) và React | `tsconfig.node.json:6` |
| `prettier` | dev | Định dạng | `.prettierrc` |
| `typescript` (`~6.0.3`) | dev | Kiểm tra kiểu; ghim bản 6.0 vì typescript-eslint 8.72 chỉ hỗ trợ dưới 6.1 | `frontend/README.md`, Phần 1 |

- **Dữ liệu:** không có.
- **Biên và lỗi:** không cài Recharts, biểu đồ vẽ bằng SVG tự viết (`StatRadar`). Dấu `^` cho phép nâng minor khi `npm install` mới; `package-lock.json` khóa bản thật.
- **Test:** không có test riêng.

**2. `vite.config.ts` (`frontend/vite.config.ts`)**

- **Vai trò:** cấu hình Vite cho dev, build và Vitest; chặn build Cloudflare Pages khi địa chỉ API sai.
- **Thành phần chính:**
  - `ENV_DIR` là thư mục cha của `frontend/` (gốc repo), tính từ `import.meta.url` (`frontend/vite.config.ts:8`).
  - `assertPagesApiBaseUrl(mode)` (`frontend/vite.config.ts:10-18`): chỉ chạy khi `process.env.CF_PAGES === '1'` (biến Cloudflare đặt khi build); đọc `VITE_API_BASE_URL` bằng `loadEnv(mode, ENV_DIR, 'VITE_')`, `trim()`; không khớp `^https://[^/\s]+` thì ném `Error`, build dừng.
  - `defineConfig` lấy từ `vitest/config` để có khóa `test` có kiểu (`frontend/vite.config.ts:6`). Chỉ gọi kiểm tra khi `command === 'build'` (`frontend/vite.config.ts:21`), nên `npm run dev` không bị ảnh hưởng.
  - `plugins: [react(), tailwindcss()]`, `envDir: '..'` (đọc `.env` ở gốc repo), `server.port: 5173`, `strictPort: true` (cổng bận thì báo lỗi, không tự đổi cổng làm lệch `CORS_ALLOWED_ORIGINS`) (`frontend/vite.config.ts:23-28`).
  - `test`: `environment: 'jsdom'`, `setupFiles: ['./src/test/setup.ts']`, `css: false` (không xử lý CSS khi test), `restoreMocks: true` (tự khôi phục `vi.spyOn` sau mỗi test) (`frontend/vite.config.ts:29-34`).
- **Phụ thuộc:** `node:url`, `@tailwindcss/vite`, `@vitejs/plugin-react`, `vite`, `vitest/config`.
- **Dữ liệu:** biến `CF_PAGES`, `VITE_API_BASE_URL`; file `.env` ở gốc (`.env.example:15` mẫu `http://localhost:8080/api/v1`).
- **Biên và lỗi:** regex chỉ đòi `https://` và có host; không kiểm tra hậu tố `/api/v1`. Build local (không có `CF_PAGES`) cho phép `http://localhost`.
- **Test:** không có test riêng.

**3. `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`**

- **Vai trò:** `tsconfig.json` chỉ tham chiếu hai project (`frontend/tsconfig.json:1-4`); `tsconfig.app.json` cho `src`, `tsconfig.node.json` cho `vite.config.ts`.
- **Thành phần chính:**

| Cờ | Giá trị | Hệ quả thấy được trong code |
|---|---|---|
| `strict` | `true` | Mọi kiểu null phải xử lý |
| `noUncheckedIndexedAccess` | `true` (chỉ app) | Truy cập mảng có kiểu `T` hoặc `undefined`, nên có `matrix.multipliers[row]?.[column] ?? 1` (`frontend/src/lib/typeEffectiveness.ts:17`), `options[active]` kiểm tra lại (`frontend/src/components/pokemon/PokemonSearchBox.tsx:95-97`) |
| `erasableSyntaxOnly` | `true` | Cấm enum, namespace, parameter property; vì vậy `ApiError` khai báo trường rồi gán trong constructor (`frontend/src/lib/http.ts:12-21`) |
| `verbatimModuleSyntax` | `true` | Import kiểu phải viết `import type` (`frontend/src/lib/http.ts:1`) |
| `moduleResolution` | `bundler` | Vite giải module, TS chỉ kiểm tra |
| `noEmit` | `true` | TS không sinh JS; Vite build |
| `types` | `vite/client` (app), `node` (node) | `import.meta.env` có kiểu |
| `jsx` | `react-jsx` | Không cần `import React` |
| `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` | `true` | `switch` ở `PokemonSearchBox` dùng `break` đầy đủ |
| `target` / `lib` | `es2023` / `ES2023, DOM, DOM.Iterable` | Dùng được `Array.prototype.at` (`frontend/src/components/scene/SceneBackdrop.tsx:38`) |

- **Phụ thuộc:** dùng bởi `tsc -b` trong script `build`.
- **Dữ liệu:** `tsBuildInfoFile` đặt trong `node_modules/.tmp` (`frontend/tsconfig.app.json:3`).
- **Biên và lỗi:** `tsconfig.node.json` dùng `module: nodenext` và chỉ bao `vite.config.ts` (`frontend/tsconfig.node.json:8,19`).
- **Test:** không có test riêng.

**4. `eslint.config.js` (`frontend/eslint.config.js`)**

- **Vai trò:** cấu hình ESLint dạng flat.
- **Thành phần chính:** bỏ qua `dist`, `coverage` (`frontend/eslint.config.js:9`); áp cho `**/*.{ts,tsx}` bộ `js.recommended`, `tseslint.recommended`, `reactHooks.flat.recommended`, `reactRefresh.vite` (`frontend/eslint.config.js:11-17`); `globals.browser` (`frontend/eslint.config.js:20`).
- **Quy tắc riêng:** `no-console` là lỗi, chỉ cho `warn`, `error` (`frontend/eslint.config.js:23`); `no-restricted-syntax` chặn thuộc tính JSX `dangerouslySetInnerHTML` (`frontend/eslint.config.js:24-30`), là một lớp chống XSS bên cạnh việc React tự escape.
- **Dữ liệu, Biên và lỗi:** không có.
- **Test:** không có test riêng.

**5. Định dạng mã và trang HTML**

| File | Nội dung | Ghi chú |
|---|---|---|
| `frontend/.prettierrc` | `semi: false`, `singleQuote: true`, `trailingComma: "all"`, `printWidth: 100` (`frontend/.prettierrc:1-6`) | Giải thích vì sao code không có dấu chấm phẩy |
| `frontend/.prettierignore` | `dist`, `coverage`, `package-lock.json`, `public/sprites`, `README.md`, `CLAUDE.md` (`frontend/.prettierignore:1-6`) | Không định dạng tài liệu viết tay và sprite |
| `frontend/index.html` | `<html lang="vi">`, favicon SVG, viewport, meta description, `<title>PokeNexus</title>`, `div#root`, `<script type="module" src="/src/main.tsx">` (`frontend/index.html:2-15`) | `lang="vi"` để trình đọc màn hình đọc đúng tiếng Việt; không có thẻ Open Graph |

**6. `main.tsx` (`frontend/src/main.tsx`)**

- **Vai trò:** điểm vào JS: nạp font, CSS toàn cục, gắn React vào `#root`.
- **Thành phần chính:**
  - Import 3 subset Dela Gothic One (`latin`, `latin-ext`, `vietnamese`) thay vì `400.css`, để không kéo hàng trăm file subset tiếng Nhật vào build (`frontend/src/main.tsx:1-3`; `docs/design-system.md`, Phần 3, mục II).
  - Import `wght.css` bản variable của Nunito và Pixelify Sans: một file mỗi subset cho mọi weight (`frontend/src/main.tsx:4-5`).
  - Import `frontend/src/./styles/index.css` (`frontend/src/main.tsx:6`).
  - Tìm `#root`, không có thì ném lỗi rõ ràng (`frontend/src/main.tsx:13-16`); `createRoot(...).render(<StrictMode><App /></StrictMode>)` (`frontend/src/main.tsx:18-22`).
- **Phụ thuộc:** `react`, `react-dom/client`, `./app/App`. Không ai import file này; `index.html` nạp nó.
- **Dữ liệu:** không có.
- **Biên và lỗi:** `StrictMode` ở dev chạy effect hai lần; vì vậy mọi effect có observer hoặc timer (`Reveal`, `usePauseOffscreen`, `SceneBackdrop`) đều có hàm dọn.
- **Test:** không có test riêng.

#### II. `src/app`

**1. `App` (`frontend/src/app/App.tsx`)**

- **Vai trò:** gốc cây React, lồng router trong provider.
- **Thành phần chính:** `App()` trả `<AppProviders><RouterProvider router={router} /></AppProviders>` (`frontend/src/app/App.tsx:6-11`).
- **Phụ thuộc:** `RouterProvider` lấy từ `react-router/dom` (`frontend/src/app/App.tsx:1`); bản này chỉ là `RouterProvider` của `react-router` được truyền sẵn `flushSync` của `react-dom` (`frontend/node_modules/react-router/dist/development/lib/dom-export/dom-router-provider.js:15-20`). Dùng bởi `main.tsx`.
- **Dữ liệu, Biên và lỗi:** không có.
- **Test:** không có test riêng; test route tự dựng `QueryClientProvider` + `RouterProvider` tương đương (`frontend/src/test/renderRoute.tsx:24-28`).

**2. `AppProviders` (`frontend/src/app/providers.tsx`)**

- **Vai trò:** cung cấp `QueryClient` cho toàn app.
- **Thành phần chính:** `AppProviders({ children })`; `const [queryClient] = useState(createQueryClient)` (`frontend/src/app/providers.tsx:10-12`). Truyền hàm (không gọi) vào `useState` nên client chỉ tạo một lần cho vòng đời component, không bị tạo lại mỗi lần render.
- **Phụ thuộc:** `@tanstack/react-query`, `frontend/src/lib/queryClient.ts`. Dùng bởi `App.tsx`.
- **Dữ liệu:** cache query nằm trong client này (bộ nhớ, mất khi tải lại trang).
- **Biên và lỗi:** không có devtools, không persist cache.
- **Test:** không có test riêng.

**3. `routes`, `router` (`frontend/src/app/router.tsx`)**

- **Vai trò:** bảng route duy nhất của app, kèm cơ chế tải trang theo nhu cầu và trang lỗi.
- **Thành phần chính:**
  - `pageFallback`: `div aria-busy="true"` cao hết màn hình, có chữ ẩn "Đang tải trang…" cho trình đọc màn hình (`frontend/src/app/router.tsx:8-12`).
  - `lazyPage(load)`: trả `{ lazy: async () => ({ Component: await load() }), hydrateFallbackElement: pageFallback }` (`frontend/src/app/router.tsx:14-21`). `load` là `async () => (await import('../pages/X')).X`, nên mỗi trang thành một chunk riêng (bản build có sẵn trong `frontend/dist/assets` có `DexPage-*.js`, `ComparePage-*.js`...).
  - `routes` (export để test dùng lại) và `router = createBrowserRouter(routes)` tạo một lần khi nạp module (`frontend/src/app/router.tsx:23-68`).

```tsx
function lazyPage(
  load: () => Promise<ComponentType>,
): Pick<RouteObject, 'lazy' | 'hydrateFallbackElement'> {
  return {
    lazy: async () => ({ Component: await load() }),
    hydrateFallbackElement: pageFallback,
  }
}
```

- Bảng route (`frontend/src/app/router.tsx:23-66`):

| Đường dẫn | Thành phần | Cách nạp | Dòng |
|---|---|---|---|
| `/` (cha) | `AppLayout`, `errorElement: RouteErrorPage` | Tĩnh | 24-27 |
| (route bọc không `path`) | `errorElement: RouteErrorPage` | Tĩnh | 29-31 |
| index | `LandingPage` | lazy | 32-35 |
| `pokedex` | `DexPage` | lazy | 36 |
| `pokemon/:idOrName` | `PokemonDetailPage` | lazy | 37-40 |
| `types` | `TypeChartPage` | lazy | 41-44 |
| `compare` | `ComparePage` | lazy | 45-48 |
| `team-builder` | `TeamBuilderPage` | lazy | 49-52 |
| `team/:shareCode` | `SharedTeamPage` | lazy | 53-56 |
| `terrain/:terrainId?` | `TerrainPage` (tham số tùy chọn) | lazy | 57-60 |
| `*` | `NotFoundPage` | Tĩnh | 61 |

- **Phụ thuộc:** `react-router`, `pages/NotFoundPage`, `pages/RouteErrorPage`, `./layout/AppLayout`, 8 trang qua `import()`. Dùng bởi `App.tsx`, `frontend/src/test/renderRoute.tsx`, `router.test.tsx`, `routeErrors.test.tsx`.
- **Dữ liệu:** URL params `idOrName`, `shareCode`, `terrainId`; query string do từng trang quản lý.
- **Biên và lỗi:**
  - Hai tầng `errorElement`: lỗi trong một trang (render hoặc import chunk) dừng ở route bọc không `path`, nên `RouteErrorPage` hiện trong `Outlet` của `AppLayout`, Header và Footer vẫn còn. Lỗi trong chính `AppLayout` rơi lên `errorElement` của route `/`, khi đó không còn Header (`docs/architecture.md:341`).
  - Lần tải đầu: khi route khớp có `lazy`, router khởi tạo ở trạng thái chưa xong (`frontend/node_modules/react-router/dist/development/lib/router/router.js:175-177`) và render `hydrateFallbackElement` của route lá trong khi vẫn render các route cha (`frontend/node_modules/react-router/dist/development/lib/hooks.js:744-781`). Vì vậy Header hiện ngay, phần thân là `pageFallback`.
  - Điều hướng sau đó: router chạy hàm `lazy` trong pha tải của điều hướng (`frontend/node_modules/react-router/dist/development/lib/router/router.js:2269-2290`). App không dùng `useNavigation` (tìm trong `src` không thấy) nên không có thanh tiến trình khi chờ chunk.
  - `NavLink` của mục `/` dùng `end` nhưng `NAV_ITEMS` không có mục `/`, nên `end` luôn `false` (`frontend/src/app/layout/Header.tsx:54`).
- **Test:** `frontend/src/app/router.test.tsx`:
  - Layout có 5 link điều hướng đúng thứ tự, mục Pokédex có `aria-current="page"`, footer có chữ PokéAPI (dòng 21-39).
  - 7 đường dẫn mỗi trang có đúng một `h1` với tiêu đề mong đợi (dòng 41-54).
  - Layout hiện ngay trong khi module trang đang tải (dòng 56-68).
  - Tham số `rotom-wash` đi tới request `/api/v1/pokemon/rotom-wash` (dòng 70-81).
  - Chuyển trang gọi `window.scrollTo(0, 0)` (dòng 83-92); bấm chip lọc Dragon ở Pokédex đổi query thành `?type=dragon` mà không cuộn (dòng 94-108).
  - Đường dẫn lạ hiện "Không tìm thấy trang", bấm "Về Pokédex" sang `/pokedex` (dòng 110-119).
  - `frontend/src/app/routeErrors.test.tsx`: giả lập `import('../pages/TypeChartPage')` ném `TypeError('Failed to fetch dynamically imported module')` (dòng 8-10); khẳng định có tiêu đề "Không hiển thị được trang", vẫn còn điều hướng chính, có nút "Tải lại trang" và link về `/` (dòng 17-32).

**4. `AppLayout`, `MAIN_CONTENT_ID` (`frontend/src/app/layout/AppLayout.tsx`)**

- **Vai trò:** khung chung của mọi trang.
- **Thành phần chính:**
  - `MAIN_CONTENT_ID = 'main-content'` (`frontend/src/app/layout/AppLayout.tsx:6`).
  - Skip link "Bỏ qua đến nội dung" ẩn bằng `sr-only`, hiện khi focus (`focus:not-sr-only focus:absolute ... focus:z-50`) (`frontend/src/app/layout/AppLayout.tsx:11-16`).
  - `Header`, `<main id="main-content" className="w-full flex-1 pb-20">` chứa `Outlet`, `Footer`, `ScrollRestoration` (`frontend/src/app/layout/AppLayout.tsx:17-22`). `pb-20` chừa chỗ cho hàng Pokémon của footer nhô lên.
- **Phụ thuộc:** `react-router` (`Outlet`, `ScrollRestoration`), `Header`, `Footer`. Dùng bởi `router.tsx:26`.
- **Dữ liệu:** `ScrollRestoration` lưu vị trí cuộn trong `sessionStorage` khóa `react-router-scroll-positions`, theo `location.key` (`frontend/node_modules/react-router/dist/development/lib/dom/lib.d.ts:1332-1356`).
- **Biên và lỗi:** điều hướng mới thì cuộn về đầu, Back hoặc Forward thì khôi phục. Các hook chỉ đổi query string của trang đang mở truyền `preventScrollReset` để giữ vị trí: `frontend/src/features/dex/useDexSearchParams.ts:117`, `frontend/src/features/compare/useCompareSearchParams.ts:34`, `frontend/src/features/team-builder/useTeamDraft.ts:127`, `frontend/src/features/typechart/useDefendingTypes.ts:39`, `frontend/src/features/terrain/components/TerrainPicker.tsx:50`.
- **Test:** không có file riêng; được kiểm qua `router.test.tsx:83-108` (cuộn) và `router.test.tsx:21-39` (khung).

**5. `Header` (`frontend/src/app/layout/Header.tsx`)**

- **Vai trò:** thanh đầu trang màu `dex-red`, logo, điều hướng desktop và menu mobile.
- **Thành phần chính:**
  - `ON_RED_FOCUS`: vòng focus trắng trên nền đỏ (`frontend/src/app/layout/Header.tsx:7-8`).
  - `desktopLinkClass`, `mobileLinkClass`: hàm nhận `{ isActive }` từ `NavLink`; mục đang chọn có viền `dex-yellow` (gạch dưới 3 px ở desktop, viền trái 4 px ở mobile) (`frontend/src/app/layout/Header.tsx:10-18`).
  - State `menuOpen`, ref `menuButtonRef`; `handleKeyDown` gắn trên `<header>`: `Escape` khi menu mở thì đóng và trả focus về nút menu (`frontend/src/app/layout/Header.tsx:21-28, 33`).
  - `<header className="sticky top-0 z-40 ...">`; lưới `md:grid-cols-[1fr_auto_1fr]` để nav nằm giữa (`frontend/src/app/layout/Header.tsx:31-35`).
  - Logo là `Link to="/"`, chấm tròn trang trí `aria-hidden` (`frontend/src/app/layout/Header.tsx:36-45`).
  - Nav desktop `aria-label="Điều hướng chính"`, ẩn dưới `md` (`frontend/src/app/layout/Header.tsx:47-60`).
  - Nút menu 44 x 44 px, `aria-label="Mở menu"`, `aria-expanded`, `aria-controls="mobile-nav"`, ẩn từ `md` (`frontend/src/app/layout/Header.tsx:62-82`).
  - Nav mobile chỉ render khi `menuOpen`; bấm link thì đóng menu (`frontend/src/app/layout/Header.tsx:85-106`).
- **Phụ thuộc:** `react-router` (`Link`, `NavLink`), `navItems.ts`. Dùng bởi `AppLayout`.
- **Dữ liệu:** token `dex-red`, `dex-red-hover`, `dex-yellow`, `shadow-header`, `primary` (`frontend/src/styles/index.css:84-92`).
- **Biên và lỗi:** `aria-current="page"` do `NavLink` tự gắn. Khi menu đóng, `aria-controls` trỏ tới id chưa có trong DOM. Menu không tự đóng khi đổi trang bằng nút Back.
- **Test:** `frontend/src/app/layout/Header.test.tsx`: chỉ mục hiện tại có `aria-current` (dòng 17-26); menu đóng cho tới khi bấm nút, mở thì có 5 link (dòng 28-40); chọn link thì đóng (dòng 42-54); `Escape` đóng và trả focus về nút (dòng 56-68).

**6. `Footer` (`frontend/src/app/layout/Footer.tsx`)**

- **Vai trò:** chân trang: 4 Pokémon ngẫu nhiên đứng trên sóng, mô tả, điều hướng phụ, liên hệ, ghi nguồn dữ liệu và bản quyền.
- **Thành phần chính:**
  - Hằng `REPOSITORY_URL`, `POKEAPI_URL`, `CONTACT_TITLE_ID` (`frontend/src/app/layout/Footer.tsx:9-11`); `CONTACTS` gồm Facebook, Email, GitHub với icon SVG vẽ trong code (`frontend/src/app/layout/Footer.tsx:24-56`).
  - `PokemonParade` (nội bộ): `useState(() => pickFooterPokemon())` chọn một lần (`frontend/src/app/layout/Footer.tsx:58-59`); mỗi Pokémon là `Link` tới `/pokemon/{name}` với `aria-label="Xem {Tên}"`, ảnh `PokemonSprite variant="artwork" size={112}` với `alt=""` vì tên đã có ở link (`frontend/src/app/layout/Footer.tsx:63-89`). Nhãn tên nổi khi hover hoặc focus là `aria-hidden` (`frontend/src/app/layout/Footer.tsx:73-78`).
  - `ContactLink` (nội bộ): link ngoài có `target="_blank" rel="noreferrer"` (`frontend/src/app/layout/Footer.tsx:95-119`).
  - `Footer`: sóng SVG `aria-hidden` (`frontend/src/app/layout/Footer.tsx:126-133`); nav `aria-label="Điều hướng chân trang"` lặp `NAV_ITEMS` (`frontend/src/app/layout/Footer.tsx:153-167`); danh sách liên hệ `aria-labelledby` tiêu đề "Liên hệ" (`frontend/src/app/layout/Footer.tsx:169-178`); dòng ghi nguồn PokéAPI và bản quyền, link "Mã nguồn" (`frontend/src/app/layout/Footer.tsx:183-198`).
- **Phụ thuộc:** `PokemonSprite`, `formatPokemonName`, `pickFooterPokemon`, `NAV_ITEMS`. Dùng bởi `AppLayout`.
- **Dữ liệu:** token `scrim`, `dex-yellow`, `dex-red`.
- **Biên và lỗi:** Footer nằm trong `AppLayout` nên không remount khi đổi trang; 4 Pokémon giữ nguyên tới khi tải lại trang. Artwork tải từ GitHub; mất mạng thì `PokemonSprite` lùi về sprite rồi placeholder.
- **Test:** `frontend/src/app/layout/Footer.test.tsx`: link liên hệ đúng `href`, `target`, `rel` (dòng 37-52); 5 link khám phá theo thứ tự (dòng 54-63); ghi nguồn PokéAPI, bản quyền, link mã nguồn (dòng 65-80); 4 Pokémon dẫn tới trang chi tiết, tên truy cập là "Xem ..." (dòng 82-94); đổi trang thì giữ nguyên Pokémon dù `Math.random` đổi giá trị (dòng 96-113).

**7. `pickFooterPokemon`, `FOOTER_POKEMON` (`frontend/src/app/layout/footerPokemon.ts`)**

- **Vai trò:** nguồn và thuật toán chọn Pokémon cho footer.
- **Thành phần chính:**
  - `FooterPokemon = { id, name }`, `FOOTER_POKEMON_COUNT = 4` (`frontend/src/app/layout/footerPokemon.ts:3-8`).
  - `FOOTER_POKEMON` = 9 Pokémon nổi tiếng cộng mọi Pokémon khởi đầu của `GENERATIONS` (9 thế hệ x 3 = 27), tổng 36 (`frontend/src/app/layout/footerPokemon.ts:10-25`).
  - `pickFooterPokemon(random = Math.random)`: chép pool, mỗi vòng lấy chỉ số `Math.min(floor(random() * len), len - 1)` rồi `splice`, nên không trùng; dừng khi đủ 4 hoặc hết pool (`frontend/src/app/layout/footerPokemon.ts:27-35`).
- **Phụ thuộc:** `features/landing/generations`. Dùng bởi `Footer.tsx`.
- **Dữ liệu:** ID và tên cố định trong code.
- **Biên và lỗi:** `Math.min(..., len - 1)` chặn trường hợp `random()` trả đúng 1. Hàm nhận `random` làm tham số để test xác định được.
- **Test:** `frontend/src/app/layout/footerPokemon.test.ts`: pool chứa đủ starter của 9 thế hệ và Pikachu, không trùng ID (dòng 6-16); `random` luôn 0 vẫn ra 4 Pokémon khác nhau (dòng 18-25); `random` khác cho kết quả khác (dòng 27-32).

**8. `NAV_ITEMS` (`frontend/src/app/layout/navItems.ts`)**

| File | Export | Dùng bởi |
|---|---|---|
| `frontend/src/app/layout/navItems.ts` | `NavItem = { to, label }`; `NAV_ITEMS` 5 mục: `/pokedex` Pokédex, `/types` Tương khắc, `/compare` So sánh, `/team-builder` Xây đội, `/terrain` Địa hình (dòng 1-12) | `Header.tsx:4`, `Footer.tsx:7` |

- Không có mục trang chủ; về `/` bằng logo.

#### III. `src/pages` (hai trang trong phạm vi)

**1. `RouteErrorPage` (`frontend/src/pages/RouteErrorPage.tsx`)**

- **Vai trò:** giao diện khi route lỗi (lỗi render hoặc không tải được chunk).
- **Thành phần chính:** `PageHero scene="lab"` tiêu đề "Không hiển thị được trang", `PageBody`, `Panel aria-label="Hướng dẫn"` (`frontend/src/pages/RouteErrorPage.tsx:10-12`); nút "Tải lại trang" gọi `window.location.reload()` (`frontend/src/pages/RouteErrorPage.tsx:18-24`); `Link to="/" reloadDocument` "Về trang Tổng quan" (`frontend/src/pages/RouteErrorPage.tsx:25-27`).
- **Phụ thuộc:** `PageHero`, `PageBody`, `buttonClassName`, `Panel`. Dùng bởi `router.tsx:27,30`.
- **Dữ liệu:** không có.
- **Biên và lỗi:**
  - `reloadDocument` buộc tải lại cả tài liệu, nên sau một lần deploy trình duyệt lấy `index.html` mới với tên chunk mới, thay vì điều hướng client-side bằng bundle cũ.
  - Không gọi `useRouteError`, nên không phân biệt loại lỗi và không hiển thị chi tiết kỹ thuật.
  - Khi là `errorElement` của route `/` (layout lỗi), trang này hiện mà không có Header, Footer.
- **Test:** `frontend/src/app/routeErrors.test.tsx:17-32`.

**2. `NotFoundPage` (`frontend/src/pages/NotFoundPage.tsx`)**

- **Vai trò:** giao diện cho URL không khớp route nào.
- **Thành phần chính:** `PageHero scene="lab"` "Không tìm thấy trang", câu giải thích, hai `Link`: "Về Pokédex" (`primary`) và "Về trang Tổng quan" (`secondary`) (`frontend/src/pages/NotFoundPage.tsx:10-21`).
- **Phụ thuộc:** như `RouteErrorPage`. Dùng bởi `router.tsx:61`.
- **Dữ liệu:** không có.
- **Biên và lỗi:** đây là 404 phía client. Mã HTTP mà máy chủ tĩnh trả cho đường dẫn lạ do Cloudflare Pages quyết định (ADR 0007 dòng 20: không có `404.html` nên Pages trả `index.html` cho mọi route); chưa xác định từ code. Pokémon không tồn tại ở `/pokemon/xyz` do `PokemonDetailPage` xử lý, không phải trang này.
- **Test:** `frontend/src/app/router.test.tsx:110-119`.

#### IV. `src/lib`

**1. `assets.ts` (`frontend/src/lib/assets.ts`)**

- **Vai trò:** nơi duy nhất sinh URL ảnh (ADR 0005, `docs/assets.md`, Phần 5).
- **Thành phần chính:**

| Export | Kết quả | Dòng |
|---|---|---|
| `PLACEHOLDER_URL` | `/sprites/placeholder.svg` | 6 |
| `SCENE_WIDTHS`, `SceneWidth` | `[960, 1920] as const` và kiểu hợp của hai số đó | 8-10 |
| `getSpriteUrl(id)` | `/sprites/pokemon/{id}.png` (tự host) | 12-14 |
| `getArtworkUrl(id)` | `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png` | 3-4, 16-18 |
| `sceneUrl(scene, photo, width)` | `/scenes/{scene}-{photo}-{width}.webp` | 20-22 |
| `sceneThumbUrl(scene)` | `/scenes/{scene}-thumb.webp` | 24-26 |
| `sceneSrcSet(scene, photo)` | `"/scenes/x-1-960.webp 960w, /scenes/x-1-1920.webp 1920w"` | 28-30 |

- **Phụ thuộc:** kiểu `SceneId` từ `frontend/src/lib/scenes.ts`. Dùng bởi `PokemonSprite.tsx:3`, `SceneBackdrop.tsx:3`, `frontend/src/features/terrain/components/TerrainPicker.tsx:6,56`.
- **Dữ liệu:** đường dẫn tương đối gốc `/` nên chạy được trên mọi domain của static hosting.
- **Biên và lỗi:** `lab`, `stadium` không có file `-thumb` trong `public/scenes`; `sceneThumbUrl` chỉ được gọi cho 13 địa hình. Hàm không kiểm tra ID tồn tại; xử lý lỗi tải nằm ở component.
- **Test:** không có test riêng; URL được khẳng định gián tiếp ở `SceneBackdrop.test.tsx:43-47` và `PokemonSearchBox.test.tsx:89`.

**2. `writeClipboard` (`frontend/src/lib/clipboard.ts`)**

- **Vai trò:** sao chép chữ vào clipboard, không bao giờ ném lỗi.
- **Thành phần chính:** `writeClipboard(text): Promise<boolean>`; không có `navigator` hoặc `navigator.clipboard.writeText` thì trả `false`; `writeText` bị từ chối thì bắt lỗi, trả `false` (`frontend/src/lib/clipboard.ts:1-10`).
- **Phụ thuộc:** API trình duyệt. Dùng bởi `frontend/src/features/team-builder/components/ShareLinkField.tsx:4,24` và `ShowdownDialogs.tsx`.
- **Dữ liệu:** không có.
- **Biên và lỗi:** Clipboard API chỉ có trong secure context; nơi gọi xử lý `false` bằng cách focus và bôi đen ô link để người dùng tự sao chép (`frontend/src/features/team-builder/components/ShareLinkField.tsx:23-30`).
- **Test:** không có test riêng (có kiểm gián tiếp trong test của team-builder, ngoài phạm vi).

**3. `errorMessageFor` (`frontend/src/lib/errorMessages.ts`)**

- **Vai trò:** đổi `code` lỗi thành câu tiếng Việt cho người dùng.
- **Thành phần chính:** `ERROR_MESSAGES` có 14 mã: 13 mã của backend (`backend/src/main/java/com/pokenexus/common/exception/ErrorCode.java:6-18`) và `NETWORK_ERROR` do frontend tự sinh (`frontend/src/lib/errorMessages.ts:1-16`); `FALLBACK_MESSAGE = 'Đã có lỗi xảy ra.'` (dòng 18); `errorMessageFor(code, retryAfterSeconds?)`: riêng `RATE_LIMITED` có số giây thì ghép "Hãy thử lại sau N giây", còn lại tra bảng hoặc trả câu dự phòng (dòng 20-25).
- **Phụ thuộc:** không import gì. Dùng bởi 15 file, ví dụ `frontend/src/pages/DexPage.tsx:143`, `frontend/src/components/pokemon/PokemonSearchBox.tsx:63`, `frontend/src/features/team-builder/components/SaveTeamDialog.tsx:95-96`.
- **Dữ liệu:** mã lỗi theo `docs/api.md`, Phần 4.
- **Biên và lỗi:** `code` là `undefined` (lỗi không phải `ApiError`, ví dụ JSON hỏng) thì ra câu dự phòng. `detail` tiếng Anh của backend không bao giờ đi qua hàm này.
- **Test:** không có test riêng; gián tiếp ở `PokemonSearchBox.test.tsx:151-163` (503 `DATA_NOT_READY`) và `frontend/src/pages/DexPage.test.tsx:245-254`.

**4. `formatters.ts` (`frontend/src/lib/formatters.ts`)**

- **Vai trò:** định dạng hiển thị theo quy ước tiếng Việt.
- **Thành phần chính:**
  - `formatPokemonName(name)`: tách theo `-`, bỏ đoạn rỗng, viết hoa chữ đầu, nối bằng dấu cách (`charizard-mega-x` thành `Charizard Mega X`) (dòng 3-9).
  - `formatDexNumber(id)`: `#` + đệm 0 tới 4 chữ số, không cắt số dài (dòng 11-13).
  - `formatNumber(value)`: `Intl.NumberFormat('vi-VN')` (dòng 1, 15-17).
  - `formatHeight(dm)`, `formatWeight(hg)`: chia 10, tối đa 1 chữ số thập phân, dấu phẩy kiểu Việt (dòng 19-27).
  - `formatMultiplier(m)`: bảng `x0`, `x¼`, `x½`, `x1`, `x2`, `x4`, ngoài bảng thì `x` + số thập phân (dòng 29-40).
- **Phụ thuộc:** `Intl`. Dùng bởi 43 file (Footer, PokemonCard, DexNumber, MultiplierCell, các feature).
- **Dữ liệu:** đơn vị gốc từ API: `heightDm`, `weightHg` (`frontend/src/types/api.ts:74-75`).
- **Biên và lỗi:** tên có gạch nối thật như `ho-oh` thành `Ho Oh` (mất gạch nối). Chuỗi rỗng trả rỗng.
- **Test:** `frontend/src/lib/formatters.test.ts`: tên (dòng 13-17), số Pokédex `#0006`, `#10034` (dòng 19-22), `1.083` (dòng 24-26), `1,7 m`, `90,5 kg`, `2 m` (dòng 28-32), hệ số kể cả `x1,5` (dòng 34-40).

**5. `http.ts` (`frontend/src/lib/http.ts`)**

- **Vai trò:** lớp gọi REST duy nhất, chuẩn hóa mọi lỗi thành `ApiError`.
- **Thành phần chính:**
  - `API_BASE_URL`: `VITE_API_BASE_URL` đã `trim()`, rỗng thì dùng `http://localhost:8080/api/v1`, bỏ mọi dấu `/` cuối (dòng 3-7). Giá trị được Vite thay vào lúc build.
  - `QueryValue`: `string | number | undefined | readonly (string | number)[]` (dòng 9).
  - `ApiError extends Error`: `status`, `code`, `retryAfterSeconds`; `message` là `detail` hoặc `HTTP {status}`; `name = 'ApiError'` (dòng 11-23).
  - `buildUrl(path, params)`: `URLSearchParams`, bỏ giá trị `undefined`, mảng thành nhiều khóa lặp (`type=fire&type=water`) (dòng 25-34).
  - `getJson<T>(path, params?, signal?)`: header `Accept: application/json`, truyền `AbortSignal` (dòng 36-42).
  - `postJson<T>(path, body, signal?)`: `POST`, `Content-Type: application/json`, `JSON.stringify(body)` (dòng 44-51).
  - `request<T>` (nội bộ): `fetch` ném lỗi thì: `AbortError` ném lại nguyên, lỗi khác thành `ApiError(0, 'NETWORK_ERROR')`; `!response.ok` thì đọc ProblemDetail và ném `ApiError(status, code ?? 'INTERNAL_ERROR', detail, retryAfter)`; thành công thì `response.json()` ép kiểu `T` (dòng 53-71).
  - `readRetryAfter`: chỉ nhận dạng số giây nguyên (`^\d+$`) (dòng 73-77). `readProblem`: `response.json()` lỗi thì trả `undefined` (dòng 79-85).
- **Phụ thuộc:** kiểu `ProblemDetail` (`frontend/src/types/api.ts:211-216`). Dùng bởi 26 file: mọi `features/*/api.ts`, `frontend/src/lib/queryClient.ts`, các trang kiểm tra `instanceof ApiError`.
- **Dữ liệu:** biến môi trường `VITE_API_BASE_URL`; header `Retry-After`.
- **Biên và lỗi:**
  - Không kiểm tra kiểu lúc chạy: JSON sai cấu trúc vẫn được ép thành `T`.
  - Thành công nhưng thân không phải JSON (ví dụ base URL sai trỏ vào trang HTML) thì `response.json()` ném `SyntaxError`, không phải `ApiError`; người dùng thấy câu dự phòng.
  - `Retry-After` dạng ngày giờ HTTP bị bỏ qua.
  - Response 204 không có thân sẽ làm `response.json()` lỗi; chưa xác định từ code có endpoint nào trả 204.
- **Test:** không có test riêng; các nhánh được khẳng định qua `PokemonSearchBox.test.tsx` (URL, 503), `frontend/src/pages/DexPage.test.tsx:245-254`, `frontend/src/pages/TeamBuilderPage.test.tsx:369-384` (`Retry-After: 42`).

**6. `motion.ts` (`frontend/src/lib/motion.ts`)**

- **Vai trò:** tính độ trễ animation cho danh sách vào lần lượt.
- **Thành phần chính:** `STAGGER_MAX_MS = 640`; `staggerDelay(index, stepMs = 40, baseMs = 0)` trả `{ animationDelay: min(base + index*step, base + 640) ms }` (`frontend/src/lib/motion.ts:3-7`).
- **Phụ thuộc:** kiểu `CSSProperties`. Dùng bởi 16 file feature (lưới Pokédex, heatmap, TerrainPicker...).
- **Dữ liệu:** không có.
- **Biên và lỗi:** danh sách dài không bắt phần tử cuối chờ quá 640 ms.
- **Test:** `frontend/src/lib/motion.test.ts`: `0ms`, `90ms`, `630ms` (dòng 6-10); chặn trần, kể cả khi có `baseMs` (dòng 12-15).

**7. `pokemonTypes.ts` (`frontend/src/lib/pokemonTypes.ts`)**

- **Vai trò:** danh sách 18 hệ và ánh xạ hệ sang class token Tailwind.
- **Thành phần chính:**
  - `TYPE_NAMES`: 18 hệ theo thứ tự trong game (normal, fire, water, ...) (dòng 3-22).
  - `TYPE_CLASSES` (nội bộ): `bg-type-{hệ}` và `text-ink` hoặc `text-on-primary` tùy độ tương phản (dòng 24-43).
  - `TYPE_SCOPES` (nội bộ): gán hai biến CSS `--type-base`, `--type-deep` bằng class arbitrary property (dòng 45-66).
  - `isTypeName` (type guard), `typeClassName`, `typeScopeClassName`, `typeLabel` (viết hoa chữ đầu) (dòng 68-82).
- **Phụ thuộc:** kiểu `TypeName`. Dùng bởi 33 file, gồm `TypeBadge`, `PokemonCard`, `frontend/src/lib/scenes.ts`.
- **Dữ liệu:** token `--color-type-*`, `--color-type-*-deep` (`frontend/src/styles/index.css:94-130`).
- **Biên và lỗi:** class được viết nguyên chuỗi trong map thay vì ghép `bg-type-${type}`, vì Tailwind sinh CSS bằng cách quét chuỗi trong mã nguồn; chuỗi ghép động sẽ không được sinh.
- **Test:** không có test riêng.

**8. `queryClient.ts` (`frontend/src/lib/queryClient.ts`)**

- **Vai trò:** cấu hình mặc định của TanStack Query.
- **Thành phần chính:**

```ts
export function retryUnlessClientError(failureCount: number, error: Error): boolean {
  if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false
  return failureCount < 1
}
```

  - `retryUnlessClientError` (dòng 5-8): lỗi 4xx không thử lại; lỗi khác (5xx, `NETWORK_ERROR` status 0, lỗi không phải `ApiError`) thử lại đúng 1 lần.
  - `createQueryClient()`: `queries.retry = retryUnlessClientError`, `refetchOnWindowFocus: false` (dòng 10-19).
- **Phụ thuộc:** `@tanstack/react-query`, `ApiError`. Dùng bởi `providers.tsx:4,11`.
- **Dữ liệu:** các mặc định khác giữ nguyên của thư viện:

| Tùy chọn | Giá trị hiệu lực | Nguồn |
|---|---|---|
| `retry` | 1 lần cho lỗi không phải 4xx | `frontend/src/lib/queryClient.ts:5-8` |
| Độ trễ retry | `min(1000 * 2^failureCount, 30000)`, lần thử lại đầu chờ 1 giây | `frontend/node_modules/@tanstack/query-core/src/retryer.ts:87-89` |
| `refetchOnWindowFocus` | `false` | `frontend/src/lib/queryClient.ts:15` |
| `staleTime` | Mặc định 0; từng hook đặt riêng (`Infinity` cho dữ liệu tĩnh, 5 phút cho danh sách và tìm kiếm) | `frontend/src/features/dex/hooks.ts:6,12,23`; `docs/architecture.md:328-338` |
| `gcTime` | Mặc định 5 phút | `frontend/node_modules/@tanstack/query-core/src/removable.ts:46` |
| Mutation | Không đặt, nên mutation không retry | `frontend/src/lib/queryClient.ts:12-17` |

- **Biên và lỗi:** `failureCount` bắt đầu từ 0 ở lần lỗi đầu và tăng sau khi quyết định thử lại (`frontend/node_modules/@tanstack/query-core/src/retryer.ts:251-268`), nên tổng cộng 2 lần gọi.
- **Test:** không có test riêng. `renderRoute` trong test đặt `retry: false` để test không chờ (`frontend/src/test/renderRoute.tsx:22`).

**9. `scenes.ts` (`frontend/src/lib/scenes.ts`)**

- **Vai trò:** dữ liệu và hàm thuần của hệ thống khung cảnh.
- **Thành phần chính:**
  - `SceneId`: 15 mã (dòng 6-21); `AmbienceKind`: 7 kiểu hạt (dòng 23); `Scene`: `name`, `sky`, `horizon`, `ground`, `accent`, `photos`, `ambience` (dòng 30-38).
  - `SCENES`: bảng 15 scene, mỗi scene 4 màu, số ảnh (2-4), kiểu hạt và màu hạt (dòng 40-176).
  - `nextPhoto(current, count, failed)`: duyệt vòng từ ảnh kế tiếp, bỏ ảnh đã lỗi; hết ảnh thì `null` (dòng 178-188).
  - `sceneGradient(scene)`: quầng `radial-gradient` màu nhấn (hex + alpha `66`, `00`) ở góc trên phải, cộng `linear-gradient` trời 0%, chân trời 56%, đất 62%, đáy tối hơn bằng `color-mix(in oklab, ground 70%, #000)` (dòng 190-196).
  - `sceneTintStyle(scene)`: `{ '--scene-accent': accent }` (dòng 198-200). `sceneSwatch(scene)`: gradient hai nửa cho chấm tròn chọn vùng (dòng 202-205).
  - `TYPE_SCENES` (nội bộ, dòng 207-226); `sceneForTypes(types)`: rỗng thì `grassland`; hệ 1 là Normal và có hệ 2 thì theo hệ 2; còn lại theo hệ 1 (dòng 228-233). `typesForScene(scene)`: ánh xạ ngược (dòng 235-237).
- **Phụ thuộc:** `TYPE_NAMES`, `TypeName`. Dùng bởi 17 file: `components/scene/*`, `frontend/src/lib/assets.ts`, `PokemonDetailPage`, `TerrainPage`, các feature landing, compare, terrain.
- **Dữ liệu:** `--scene-accent` được utility `scene-tint`, `scene-fade` đọc (`frontend/src/styles/index.css:744-766`).
- **Biên và lỗi:** `nextPhoto(null, 0, [])` trả `null`; tất cả ảnh lỗi trả `null`, component chỉ còn gradient. Backend không biết gì về scene (`docs/design-system.md`, Phần 4, mục II).
- **Test:** `frontend/src/lib/scenes.test.ts`: 18 hệ đơn (dòng 14-35), hệ kép lấy hệ 1 (dòng 37-39), ngoại lệ Normal (dòng 41-43), rỗng thành `grassland` (dòng 45-47), 15 scene với màu hex hợp lệ (dòng 49-56), gradient chứa đúng mốc màu (dòng 58-66), số ảnh và kiểu hạt hợp lệ (dòng 68-76), `nextPhoto` 6 trường hợp kể cả hết ảnh (dòng 78-85), `sceneTintStyle` (dòng 87-89).

**10. `typeEffectiveness.ts` (`frontend/src/lib/typeEffectiveness.ts`)**

- **Vai trò:** tra hệ số sát thương từ ma trận do backend trả về.
- **Thành phần chính:** `AttackProfile` (dòng 3-7); `singleMultiplier(matrix, atk, def)`: `indexOf` tìm hàng, cột; không thấy thì 1 (dòng 9-18); `multiplierAgainst(matrix, atk, defs)`: nhân các hệ số, mảng rỗng trả 1 (dòng 20-26); `attackProfile(matrix, atk)`: chia hệ phòng thủ thành x0, lớn hơn 1, nhỏ hơn 1 (dòng 28-37).
- **Phụ thuộc:** kiểu `TypeMatrix`, `TypeName`. Dùng bởi `features/typechart` (bảng, `defense.ts`, `matrixFocus.ts`) và `features/landing` (`TypeWheel`, `quiz.ts`).
- **Dữ liệu:** ma trận lấy từ API (`['types', 'matrix']`), không chép bảng tương khắc vào frontend.
- **Biên và lỗi:** hệ lạ coi là trung tính.
- **Test:** `frontend/src/lib/typeEffectiveness.test.ts`: tra đơn (dòng 21-24), hệ lạ là 1 (dòng 26-28), hệ kép x4, x0, rỗng (dòng 30-34), nhóm của Ground (dòng 36-42).

**11. `useMediaQuery`, `LG_MEDIA_QUERY` (`frontend/src/lib/useMediaQuery.ts`)**

- **Vai trò:** hook đọc media query trong JS, an toàn với concurrent rendering.
- **Thành phần chính:** `LG_MEDIA_QUERY = '(min-width: 64rem)'` (1024 px, trùng breakpoint `lg` mặc định của Tailwind) (dòng 4); `mediaQueryList` trả `null` khi không có `window.matchMedia` (dòng 6-8); `useMediaQuery(query)`: `subscribe` bọc `useCallback([query])`, lắng nghe sự kiện `change`; `useSyncExternalStore(subscribe, getSnapshot, () => false)` (dòng 10-25).
- **Phụ thuộc:** React. Dùng duy nhất ở `frontend/src/pages/TeamBuilderPage.tsx:27,68` để render khối đề xuất ở đúng một vị trí trong DOM theo bố cục (dòng 266, 332, 367), giữ thứ tự DOM khớp thứ tự hiển thị trên mobile.
- **Dữ liệu:** không có.
- **Biên và lỗi:** jsdom không có `matchMedia` nên hook trả `false` (bố cục mobile) trong test; snapshot phía server là `false`.
- **Test:** không có test riêng; `frontend/src/pages/TeamBuilderPage.test.tsx:491-494` giả `matchMedia` với đúng chuỗi `(min-width: 64rem)`.

#### V. `src/components/ui`

**1. `buttonClassName` (`frontend/src/components/ui/buttonStyles.ts`)**

- **Vai trò:** chuỗi class nút dùng chung cho `<button>` và `<Link>`.
- **Thành phần chính:** `ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'cta'`, `ButtonSize = 'sm' | 'md'` (dòng 1-2); `BASE`: bo 10 px, `not-disabled:active:translate-y-0.5` và mất bóng khi nhấn (cảm giác nút cứng), `disabled:opacity-50` (dòng 4-5); `VARIANTS` có gờ dưới 3 px (dòng 7-14); `SIZES`: `sm` cao 40 px (36 px từ `md`), `md` cao 44 px (dòng 16-19); `buttonClassName(variant = 'primary', size = 'md')` (dòng 21-26).
- **Phụ thuộc:** token `primary`, `primary-hover`, `ink`, `surface`, `dex-yellow`. Dùng bởi 26 file.
- **Dữ liệu, Biên và lỗi:** chưa có biến thể `danger` và trạng thái `loading` (`docs/design-system.md:371` ghi "làm khi cần").
- **Test:** không có test riêng.

**2. `Panel` (`frontend/src/components/ui/Panel.tsx`)**

- **Vai trò:** khung nội dung đặt trên khung cảnh.
- **Thành phần chính:** `Panel({ className, ...props })` render `<section>` nền `surface`, viền `ink` 2 px, bo 24 px, `shadow-block-lg`, chuyển tiếp mọi prop (`aria-label`...) (`frontend/src/components/ui/Panel.tsx:3-10`).
- **Phụ thuộc:** token. Dùng bởi 14 file, gồm `RouteErrorPage`, `NotFoundPage`.
- **Dữ liệu:** không có.
- **Biên và lỗi:** `<section>` cần tên truy cập; người gọi phải truyền `aria-label` hoặc `aria-labelledby`, component không ép.
- **Test:** không có test riêng.

**3. `GameDialog` (`frontend/src/components/ui/GameDialog.tsx`)**

- **Vai trò:** hộp kiểu hộp thoại game (viền dày, viền trong, nhãn người nói).
- **Thành phần chính:** nhận mọi prop của `div` cộng `speaker?`; viền `ink` 3 px, viền trong bằng `outline-2 -outline-offset-8 outline-border`; `speaker` hiện thành chip ở mép trên (`frontend/src/components/ui/GameDialog.tsx:3-21`).
- **Phụ thuộc:** token. Dùng bởi `EmptyState`, `ErrorState`, `VerdictPanel`, `LandingHero`, `TrainerQuiz`, `SharedTeamPage`.
- **Dữ liệu:** không có.
- **Biên và lỗi:** không phải `<dialog>` thật, không bẫy focus; chỉ là khối trình bày.
- **Test:** không có test riêng.

**4. `EmptyState` (`frontend/src/components/ui/EmptyState.tsx`)**

- **Vai trò:** trạng thái rỗng.
- **Thành phần chính:** props `title`, `description?`, `action?`, `speaker = 'Pokédex'`; render `GameDialog` với `<h3>` tiêu đề, mô tả, tối đa một vùng hành động (`frontend/src/components/ui/EmptyState.tsx:5-20`).
- **Phụ thuộc:** `GameDialog`. Dùng bởi 7 file (DexPage, ComparePage, TeamBuilderPage...).
- **Dữ liệu:** không có.
- **Biên và lỗi:** cấp tiêu đề cố định `h3`, không tự điều chỉnh theo vị trí.
- **Test:** không có test riêng.

**5. `ErrorState` (`frontend/src/components/ui/ErrorState.tsx`)**

- **Vai trò:** trạng thái lỗi API có nút thử lại.
- **Thành phần chính:** props `message`, `onRetry`; `GameDialog role="alert" speaker="Pokédex"`, đoạn thông điệp và nút "Thử lại" (`frontend/src/components/ui/ErrorState.tsx:4-18`).
- **Phụ thuộc:** `buttonClassName`, `GameDialog`. Dùng bởi 12 file; ví dụ `frontend/src/pages/DexPage.tsx:141-145` truyền `errorMessageFor(code)` và `refetch`.
- **Dữ liệu:** không có.
- **Biên và lỗi:** `role="alert"` làm trình đọc màn hình đọc ngay khi lỗi xuất hiện. Component không tự chọn thông điệp; nơi gọi phải dùng `errorMessageFor`.
- **Test:** không có test riêng; `frontend/src/pages/DexPage.test.tsx:250-253` khẳng định `alert` có câu tiếng Việt và nút "Thử lại".

**6. `Pagination` (`frontend/src/components/ui/Pagination.tsx`)**

- **Vai trò:** phân trang 0-based.
- **Thành phần chính:** props `page`, `totalPages`, `onChange`; `totalPages <= 1` thì không render (dòng 16-17); `<nav aria-label="Phân trang">` (dòng 21-24); nút "Trước" vô hiệu ở trang 0 (dòng 25-32); từ `sm` hiện danh sách số từ `pageItems`, trang hiện tại là `<span aria-current="page">` có chữ ẩn "Trang " (dòng 33-63); dưới `sm` chỉ hiện "n / tổng" (dòng 64-66); nút "Sau" vô hiệu ở trang cuối (dòng 67-74).
- **Phụ thuộc:** `buttonClassName`, `pageItems`. Dùng bởi `frontend/src/pages/DexPage.tsx`.
- **Dữ liệu:** trang hiển thị = `page + 1`.
- **Biên và lỗi:** dấu "…" là `li aria-hidden`; nút số có `aria-label="Trang N"`.
- **Test:** chỉ có test cho `pageItems`.

**7. `pageItems` (`frontend/src/components/ui/pageItems.ts`)**

- **Vai trò:** thuật toán chọn số trang hiển thị.
- **Thành phần chính:** `PageItem = number | 'gap'`; tối đa 7 trang thì liệt kê đủ; nhiều hơn thì giữ trang đầu, cuối, trang hiện tại và hai bên, thêm một trang kề ở mép khi đang ở trang đầu hoặc cuối, chèn `'gap'` giữa hai số cách nhau hơn 1 (`frontend/src/components/ui/pageItems.ts:1-19`).
- **Phụ thuộc:** không có. Dùng bởi `Pagination.tsx:2`.
- **Biên và lỗi:** `totalPages <= 0` trả mảng rỗng (dòng 6).
- **Test:** `frontend/src/components/ui/pageItems.test.ts`: tối đa 7 trang (dòng 6-9), có khoảng trống ở đầu, giữa, cuối (dòng 11-15), không chèn gap giữa hai trang kề (dòng 17-19), không có trang (dòng 21-23).

#### VI. `src/components/motion`

**1. `Reveal` (`frontend/src/components/motion/Reveal.tsx`)**

- **Vai trò:** khối hiện dần khi cuộn tới.
- **Thành phần chính:** props `variant` (`up`, `left`, `right`, `zoom`, `tilt`; mặc định `up`), `delay` ms, `className`, `children` (dòng 5-12); `seen` khởi tạo `true` khi không có `IntersectionObserver` (dòng 20); effect tạo observer với `rootMargin '0px 0px -10% 0px'`, `threshold 0.1`, thấy một lần thì `setSeen(true)` và ngắt (dòng 14-15, 22-36); `visible = seen || reducedMotion` (dòng 38); render `div` có `data-revealed`, class `reveal reveal-{variant}` và `is-in` khi hiện, `transitionDelay` khi `delay > 0` (dòng 40-47).
- **Phụ thuộc:** `useReducedMotion`. Dùng bởi 5 khối ở trang Tổng quan (`ClosingCta`, `DailyPokemon`, `FeatureRegions`, `GenerationChart`, `TeamSteps`).
- **Dữ liệu:** class CSS `.reveal`, `.reveal-*:not(.is-in)`, `.reveal-grow-y`, `.reveal-draw` (`frontend/src/styles/index.css:724-732, 803-845`).
- **Biên và lỗi:** chỉ quan sát một lần; ra khỏi màn hình không ẩn lại. Giảm chuyển động thì hiện ngay.
- **Test:** `frontend/src/components/motion/Reveal.test.tsx`: không có observer thì hiện ngay (dòng 36-43); chờ giao cắt rồi ngắt observer, có `transitionDelay` (dòng 45-63); giảm chuyển động thì không ẩn (dòng 65-71).

**2. `usePauseOffscreen`, `OFFSCREEN_ATTRIBUTE` (`frontend/src/components/motion/usePauseOffscreen.ts`)**

- **Vai trò:** tạm dừng animation CSS của các khối nằm ngoài màn hình.
- **Thành phần chính:** `OFFSCREEN_ATTRIBUTE = 'data-offscreen'`, `ROOT_MARGIN = '200px 0px'` (dòng 3-5); effect lấy các con trực tiếp là `HTMLElement` của container, một `IntersectionObserver` bật hoặc tắt thuộc tính theo `isIntersecting`; dọn thì ngắt observer và xóa thuộc tính (dòng 7-28).
- **Phụ thuộc:** React. Dùng duy nhất ở `frontend/src/pages/LandingPage.tsx:15-19` (container chứa 9 khối).
- **Dữ liệu:** CSS `[data-offscreen] * { animation-play-state: paused }` (`frontend/src/styles/index.css:1032-1036`).
- **Biên và lỗi:** chỉ quan sát các con có lúc mount (deps là `[containerRef]`); con thêm sau không được quan sát. Chỉ dừng animation CSS; `setInterval` đổi ảnh của `SceneBackdrop` vẫn chạy (chỉ bỏ qua khi tab ẩn). Không có observer thì không làm gì.
- **Test:** `frontend/src/components/motion/usePauseOffscreen.test.tsx`: đánh dấu và xóa dấu theo giao cắt (dòng 44-62), ngắt và dọn khi unmount (dòng 64-74), không có observer thì không đánh dấu (dòng 76-81).

#### VII. `src/components/scene`

**1. `useReducedMotion` (`frontend/src/components/scene/useReducedMotion.ts`)**

- **Vai trò:** đọc `prefers-reduced-motion: reduce` và cập nhật khi người dùng đổi cài đặt.
- **Thành phần chính:** `subscribe` lắng nghe `change`; `getSnapshot` trả `matches` hoặc `false`; `useSyncExternalStore(subscribe, getSnapshot, () => false)` (`frontend/src/components/scene/useReducedMotion.ts:3-22`).
- **Phụ thuộc:** React. Dùng bởi `Reveal.tsx:3`, `SceneBackdrop.tsx:6`.
- **Biên và lỗi:** không có `matchMedia` thì coi là không giảm chuyển động.
- **Test:** không có test riêng; được giả lập ở `Reveal.test.tsx:24-29`, `SceneBackdrop.test.tsx:106-109`.

**2. `SceneBackdrop`, `SCENE_INTERVAL_MS`, `SCENE_FADE_MS` (`frontend/src/components/scene/SceneBackdrop.tsx`)**

- **Vai trò:** nền ảnh khung cảnh có gradient dự phòng, đổi ảnh và lớp hạt khi được phép.
- **Thành phần chính:**
  - Hằng `SCENE_INTERVAL_MS = 12_000`, `SCENE_FADE_MS = 1_200`, `SIZES = '100vw'` (dòng 8-11).
  - `SceneBackdrop({ scene, priority = false, animated = false })`: `moving = animated && !reducedMotion`; `div aria-hidden` có `data-scene`, nền là `sceneGradient(scene)`; render `ScenePhotos key={scene}` và `SceneAmbience` khi `moving` (dòng 41-56).
  - `ScenePhotos` (nội bộ) giữ state `{ layers, failed, nextId }`; ảnh đầu chọn ngẫu nhiên trong `1..photos` (dòng 19-35, 64-66).
  - `stateRef` đồng bộ state cho callback của interval mà không phải tạo lại interval (dòng 67, 71-73).
  - `canRotate = rotating && còn hơn 1 ảnh chưa lỗi` (dòng 68). Interval 12 giây: tab ẩn thì bỏ lượt; tính `nextPhoto`; tải trước bằng `new Image()` với `sizes`, `srcset`, `src`; `onload` gọi `decode()` rồi mới thêm lớp mới `entering: true`, chỉ giữ lớp cũ cuối cùng; `onerror` ghi ảnh vào `failed`; cờ `cancelled` chặn `setState` sau khi dọn (dòng 75-114).
  - Effect mờ dần: khi có hơn 1 lớp, sau 1,2 giây chỉ giữ lớp cuối (dòng 116-122).
  - `handleError(photo)`: ảnh đang hiện bị lỗi thì bỏ khỏi vòng, chọn ảnh thay thế bằng `nextPhoto`; hết ảnh thì không còn `<img>`, chỉ còn gradient (dòng 124-137).
  - Mỗi lớp là `<img>` `alt=""`, `decoding="async"`, `srcSet` 960w và 1920w, `sizes="100vw"`, `fetchPriority="high"` chỉ cho lớp hiện tại khi `priority`, `object-[center_60%]`; class `animate-scene-enter` cho lớp mới, `animate-scene-drift` khi đang xoay (dòng 139-156).
- **Phụ thuộc:** `sceneSrcSet`, `sceneUrl`, `nextPhoto`, `SCENES`, `sceneGradient`, `SceneAmbience`, `useReducedMotion`. Dùng bởi `PageHero` và 6 component feature (`LandingHero`, `PokemonHero`, `VersusBanner`, `DailyPokemon`, `FeatureRegions`, `DetailStates`).
- **Dữ liệu:** file `public/scenes/{scene}-{n}-{960|1920}.webp`; keyframes `scene-fade`, `scene-drift` (`frontend/src/styles/index.css:153-155, 489-505`).
- **Biên và lỗi:** đổi `scene` thì `key` đổi, `ScenePhotos` mount lại với state mới. Ảnh lỗi không bao giờ hiện icon ảnh vỡ. Tải trước rồi `decode()` nên không có khung trắng khi chuyển ảnh.
- **Test:** `frontend/src/components/scene/SceneBackdrop.test.tsx`: ảnh trang trí hai cỡ trên gradient, `fetchpriority="high"` (dòng 35-49); ảnh đầu ngẫu nhiên (dòng 51-59); bỏ ảnh lỗi, hết ảnh thì giữ gradient (dòng 61-75); chuyển mờ sang ảnh 2 sau 12 giây, lớp cũ bị gỡ sau 1,2 giây, có lớp hạt (dòng 77-101); giảm chuyển động thì một ảnh tĩnh, không hạt (dòng 103-119); không `animated` thì không xoay, không hạt (dòng 121-131).

**3. `SceneAmbience` (`frontend/src/components/scene/SceneAmbience.tsx`)**

- **Vai trò:** lớp hạt trang trí theo môi trường (tuyết, tàn lửa, đom đóm, cánh hoa, tia điện, cát, bụi sáng).
- **Thành phần chính:** `PARTICLES`: 18 hạt tính một lần lúc nạp module bằng dãy phân bố đều dựa trên tỷ lệ vàng (không dùng `Math.random`, nên vị trí ổn định giữa các lần render) (dòng 5-19); component đặt `--particle-color`, mỗi hạt có `--x`, `--y`, `--size`, `--delay`, `--duration`, `--drift`; hạt chỉ số lẻ có `max-md:hidden`, nên mobile còn 9 hạt (dòng 25-52).
- **Phụ thuộc:** `SCENES`. Dùng bởi `SceneBackdrop.tsx:53`.
- **Dữ liệu:** class `scene-ambience`, `ambience-{kind}`, `ambience-particle` và 6 keyframes `ambience-*` dùng đơn vị container query `cqh`, `cqw` (`frontend/src/styles/index.css:871-1030`).
- **Biên và lỗi:** chỉ animate `transform`, `opacity`; `aria-hidden`.
- **Test:** không có file riêng; `SceneBackdrop.test.tsx:82-85, 118, 130`.

**4. `PageHero`, `PageBody` (`frontend/src/components/scene/PageHero.tsx`)**

- **Vai trò:** dải khung cảnh đầu trang chứa `<h1>` và vùng nội dung đè lên mép dưới.
- **Thành phần chính:**
  - `PageHero({ scene, title, subtitle?, wide?, eyebrow?, aside?, topBand? })` (dòng 7-15, 30-38).
  - `const [initialScene] = useState(scene)` ghi scene ban đầu; lớp nền bọc trong `div key={scene}`, scene khác lúc đầu thì có `animate-iris` (lộ ảnh theo vòng tròn) (dòng 39, 62-67).
  - `<section aria-labelledby="page-title">` cao 288, 480, 544 px theo `md`, `lg`, có `style={sceneTintStyle(scene)}` (dòng 56-61).
  - Tấm tiêu đề `bg-scrim/75`, `<h1 id="page-title">` font display, `line-clamp-3` trên mobile (dòng 41-54).
  - Lớp `scene-fade` phủ đáy (dòng 69-72), `SceneLabel` (dòng 73), vị trí tấm tiêu đề (dòng 74-85).
  - `PageBody({ scene?, wide?, className?, children })`: kéo lên `-mt-16`, `md:-mt-28`, `lg:-mt-32` cùng biến `--hero-overlap` bằng đúng độ đè; có `scene` thì thêm `scene-tint` (dòng 90-100).
  - `containerClassName(wide)`: `max-w-[100rem]` hoặc `max-w-7xl` (dòng 26-28).
- **Phụ thuộc:** `sceneTintStyle`, `SceneBackdrop` (luôn `priority animated`, dòng 66), `SceneLabel`. Dùng bởi 9 file, gồm 2 trang lỗi.
- **Dữ liệu:** id cố định `page-title`; biến `--scene-accent`, `--hero-overlap`.
- **Biên và lỗi:** id cố định nên mỗi trang chỉ được một `PageHero`. Tiêu đề dài bị cắt 3 dòng trên mobile.
- **Test:** không có test riêng; `router.test.tsx:41-54` khẳng định mỗi trang đúng một `h1`.

**5. `SceneLabel` (`frontend/src/components/scene/SceneLabel.tsx`)**

- **Vai trò:** chip "Khung cảnh: {tên}" giải thích vì sao nền đổi.
- **Thành phần chính:** props `scene`, `inline = false`; mặc định đặt góc trên phải và ẩn dưới `md`; `inline` thì hiện trong dòng (`frontend/src/components/scene/SceneLabel.tsx:3-30`).
- **Phụ thuộc:** `SCENES`. Dùng bởi `PageHero`, `DailyPokemon`, `LandingHero`, `PokemonHero`.
- **Biên và lỗi:** là `<p>`, không phải link; icon ghim `aria-hidden`.
- **Test:** không có test riêng.

#### VIII. `src/components/pokemon`

**1. `PokemonSprite` (`frontend/src/components/pokemon/PokemonSprite.tsx`)**

- **Vai trò:** ảnh Pokémon có chuỗi dự phòng.
- **Thành phần chính:** props `id`, `alt`, `size = 96`, `variant = 'sprite' | 'artwork'`, `className` (dòng 5-11); `sourcesFor`: sprite thì `[sprite, placeholder]`, artwork thì `[artwork, sprite, placeholder]` (dòng 13-16); state `failure = { id, level }`, level chỉ áp dụng khi `failure.id === id`, nên đổi `id` tự về level 0 mà không cần effect (dòng 25-26); `<img>` có `width`, `height`, `loading="lazy"`, sprite thêm `[image-rendering:pixelated]` (dòng 29-38); `onError` tăng level tới nguồn cuối (dòng 39-41).
- **Phụ thuộc:** `getArtworkUrl`, `getSpriteUrl`, `PLACEHOLDER_URL`. Dùng bởi 15 file (Footer, PokemonCard, PokemonSearchBox, PokemonHero, VersusBanner...).
- **Dữ liệu:** `public/sprites/pokemon/{id}.png`; artwork trên `raw.githubusercontent.com`.
- **Biên và lỗi:** nguồn cuối lỗi thì dừng, không lặp vô hạn. Đổi `variant` mà giữ `id` thì level cũ vẫn giữ. Luôn `loading="lazy"`, không có prop tắt, kể cả ảnh lớn đầu trang.
- **Test:** không có test riêng; `PokemonSearchBox.test.tsx:89` khẳng định `src="/sprites/pokemon/6.png"`.

**2. `PokemonCard` (`frontend/src/components/pokemon/PokemonCard.tsx`)**

- **Vai trò:** thẻ Pokémon trong lưới Pokédex và trang Địa hình.
- **Thành phần chính:** prop `pokemon: PokemonSummary`; toàn thẻ là `Link` tới `/pokemon/{name}`; `primaryType = types[0] ?? 'normal'`; class `type-card` cộng `typeScopeClassName(primaryType)`; vệt sáng `shine-sweep`; `TypeGlyph` mờ trang trí; tên, `DexNumber`, nhãn hệ dạng chữ, BST `text-num`; sprite trên đế trắng bo hữu cơ, `alt` là tên (`frontend/src/components/pokemon/PokemonCard.tsx:14-62`).
- **Phụ thuộc:** `Link`, `formatPokemonName`, `typeLabel`, `typeScopeClassName`, `DexNumber`, `PokemonSprite`, `TypeGlyph`. Dùng bởi `frontend/src/features/dex/components/PokemonGrid.tsx`, `frontend/src/features/terrain/components/TerrainPokemon.tsx`.
- **Dữ liệu:** utility `type-card` đọc `--type-deep` (`frontend/src/styles/index.css:734-742`); `animate-hop`.
- **Biên và lỗi:** điều hướng theo `name`, không theo `id`. Focus có viền `ink` 3 px.
- **Test:** không có test riêng (được kiểm trong test DexPage, ngoài phạm vi).

**3. `PokemonSearchBox` (`frontend/src/components/pokemon/PokemonSearchBox.tsx`)**

- **Vai trò:** ô tìm Pokémon theo mẫu ARIA combobox, dùng ở Pokédex, So sánh, Xây đội.
- **Thành phần chính:**
  - Props `label`, `onSelect`, `excludeIds = []`, `placeholder`, `id?`, `hideLabel` (dòng 13-20, 34-41).
  - `useDebouncedValue` 250 ms (dòng 22, 25-32); `usePokemonSearch(query)` (dòng 51), query key `['pokemon', 'search', chuỗi đã trim và viết thường]`, chỉ bật khi dài 2-30 ký tự, `staleTime` 5 phút (`frontend/src/features/dex/hooks.ts:17-24`).
  - `settled`: chữ đã debounce trùng chữ đang gõ (dòng 54); `options` lọc bỏ `excludeIds` (dòng 55); `popupOpen` khi đang mở và gõ từ 2 ký tự (dòng 56); `expanded` khi có gợi ý (dòng 57); `active` kẹp trong khoảng hợp lệ (dòng 58).
  - `status` cho vùng `role="status"`: lỗi (dịch qua `errorMessageFor`), "Đang tìm…", "Không tìm thấy...", "N gợi ý..." (dòng 60-68, 191-196).
  - Bàn phím: mũi tên xuống, lên xoay vòng; `Enter` chỉ chọn khi `expanded && settled`; `Escape` đóng popup, bấm lần nữa xóa chữ (dòng 82-110).
  - Input `role="combobox"`, `maxLength={30}`, `aria-autocomplete="list"`, `aria-expanded`, `aria-controls`, `aria-activedescendant` (dòng 129-151); listbox, option `aria-selected`; `onMouseDown` của option gọi `preventDefault` để input không mất focus trước khi `click` chạy (dòng 157-176).
- **Phụ thuộc:** `SEARCH_MAX_LENGTH`, `SEARCH_MIN_LENGTH` từ `frontend/src/features/dex/api.ts:28-29`, `usePokemonSearch`, `errorMessageFor`, `formatPokemonName`, `ApiError`, `DexNumber`, `PokemonSprite` (40 px), `TypeBadge`. Dùng bởi `frontend/src/features/compare/components/CompareSlot.tsx`, `frontend/src/pages/DexPage.tsx`, `frontend/src/pages/TeamBuilderPage.tsx`.
- **Dữ liệu:** request `GET /pokemon/search?q=...&limit=8` (`frontend/src/features/dex/api.ts:30-34`); dropdown `z-45`.
- **Biên và lỗi:** cờ `settled` chặn việc `Enter` chọn gợi ý của truy vấn cũ khi người dùng gõ tiếp. `maxLength` 30 khớp giới hạn API. Rời ô (`blur`) thì đóng popup.
- **Test:** `frontend/src/components/pokemon/PokemonSearchBox.test.tsx`: dán chuỗi dài bị cắt ở 30 ký tự (dòng 40-53); không chọn gợi ý cũ khi đang gõ (dòng 55-75); gợi ý có sprite, số, hệ, `Enter` chọn đúng mục, URL `/api/v1/pokemon/search?q=char` (dòng 77-105); `ArrowUp` xoay vòng, `Escape` đóng, chọn bằng chuột (dòng 107-124); dưới 2 ký tự không gọi API (dòng 126-136); loại `excludeIds` và báo không còn gì (dòng 138-149); lỗi 503 hiện câu tiếng Việt (dòng 151-163).

**4. `TypeBadge` (`frontend/src/components/pokemon/TypeBadge.tsx`)**

- **Vai trò:** nhãn hệ dạng viên thuốc, luôn có chữ.
- **Thành phần chính:** props `type`, `size = 'sm' | 'md'` (cao 24 hoặc 32 px); class `typeClassName(type)`; chữ `typeLabel(type)` (`frontend/src/components/pokemon/TypeBadge.tsx:4-22`).
- **Phụ thuộc:** `pokemonTypes`. Dùng bởi 18 file.
- **Biên và lỗi:** màu không bao giờ đứng một mình.
- **Test:** không có test riêng.

**5. `TypeGlyph` (`frontend/src/components/pokemon/TypeGlyph.tsx`)**

- **Vai trò:** icon nét đơn cho 18 hệ.
- **Thành phần chính:** `GLYPHS: Record<TypeName, string>` là path SVG 24 x 24 (dòng 3-25); `TypeGlyph({ type, className, strokeWidth = 1.6 })` render `<svg aria-hidden>` (dòng 33-48).
- **Phụ thuộc:** kiểu `TypeName`. Dùng bởi 7 file (PokemonCard, các khối trang Tổng quan, TerrainPicker).
- **Biên và lỗi:** chỉ trang trí, không thay tên hệ.
- **Test:** không có test riêng.

**6. `DexNumber` (`frontend/src/components/pokemon/DexNumber.tsx`)**

- **Vai trò:** số Pokédex `#0006`.
- **Thành phần chính:** `<span className="tabular-nums font-extrabold">{formatDexNumber(id)}</span>` (`frontend/src/components/pokemon/DexNumber.tsx:8-10`).
- **Phụ thuộc:** `formatDexNumber`. Dùng bởi 11 file.
- **Biên và lỗi:** ID từ 10000 hiện 5 chữ số.
- **Test:** không có test riêng; hàm được test ở `formatters.test.ts:19-22`.

**7. `MultiplierCell` (`frontend/src/components/pokemon/MultiplierCell.tsx`)**

- **Vai trò:** ô hệ số sát thương có màu và nhãn chữ.
- **Thành phần chính:** props `multiplier`, `className`; class từ `multiplierWeightClassName` và `multiplierClassName`; nội dung `formatMultiplier` (`frontend/src/components/pokemon/MultiplierCell.tsx:4-17`).
- **Phụ thuộc:** `formatMultiplier`, `multiplierStyles`. Dùng bởi `WeaknessHeatmap`, `DefenseResult`, `MatrixFocusPanel`, `MatrixLegend`.
- **Biên và lỗi:** không có thuộc tính `title`.
- **Test:** không có test riêng.

**8. `multiplierClassName`, `multiplierWeightClassName` (`frontend/src/components/pokemon/multiplierStyles.ts`)**

- **Vai trò:** ánh xạ hệ số sang class nền, chữ, độ đậm.
- **Thành phần chính:** map theo `String(multiplier)` cho 0, 0.25, 0.5, 1, 2, 4; giá trị lạ dùng kiểu trung tính (`frontend/src/components/pokemon/multiplierStyles.ts:1-14`); x0 và x4 `font-extrabold`, còn lại `font-bold` (dòng 16-18).
- **Phụ thuộc:** token `--color-mult-*` (`frontend/src/styles/index.css:132-137`). Dùng bởi 8 file.
- **Biên và lỗi:** thang xanh dương sang cam, không dùng xanh lục và đỏ, để người mù màu đỏ-lục vẫn phân biệt (`docs/design-system.md`, Phần 2, mục III).
- **Test:** không có test riêng.

**9. `NeutralMark` (`frontend/src/components/pokemon/NeutralMark.tsx`)**

- **Vai trò:** ô x1 trong bảng nhiều ô: chấm mờ cho mắt, chữ "x1" cho trình đọc màn hình.
- **Thành phần chính:** `span aria-hidden` chấm 6 px và `span.sr-only` "x1" (`frontend/src/components/pokemon/NeutralMark.tsx:5-15`).
- **Phụ thuộc:** token `border`. Dùng bởi `TeamSteps`, `WeaknessHeatmap`, `MatrixLegend`, `TypeMatrixTable`.
- **Test:** không có test riêng.

**10. `StatBar` (`frontend/src/components/pokemon/StatBar.tsx`)**

- **Vai trò:** một dòng chỉ số gồm nhãn, số, thanh ngang kiểu thanh HP.
- **Thành phần chính:** props `label`, `value`, `max = 255`, `delayMs = 0`; `toneClassName`: dưới 60 `stat-low`, dưới 90 `stat-mid`, dưới 120 `stat-good`, còn lại `stat-high` (dòng 8-13); `percent` kẹp 0-100, `max <= 0` thì 0 (dòng 16); render `dt` nhãn, `dd` số, `dd aria-hidden` thanh có `animate-grow-x` và `animationDelay` (dòng 18-33).
- **Phụ thuộc:** token `stat-*`. Dùng bởi `frontend/src/features/pokemon-detail/components/StatPanel.tsx`.
- **Dữ liệu:** người gọi phải bọc trong `<dl>`.
- **Biên và lỗi:** giá trị 0 không vẽ vạch phân cách; vượt `max` thì đầy thanh. Con số luôn hiện, thanh chỉ minh họa.
- **Test:** `frontend/src/components/pokemon/StatBar.test.tsx`: 102/255 là 40%, thanh `aria-hidden` (dòng 16-23); 6 mốc màu (dòng 25-34); số dùng `tabular-nums text-num`, không dùng font pixel (dòng 36-42); 300 thành 100% (dòng 44-46); 0 không có vạch (dòng 48-53).

**11. `StatRadar` (`frontend/src/components/pokemon/StatRadar.tsx`)**

- **Vai trò:** biểu đồ radar 6 trục vẽ bằng SVG, không dùng thư viện biểu đồ.
- **Thành phần chính:**
  - Props `title`, `series` (mỗi series `label`, `stats`, `tone: 'primary' | 'accent'`), `max = 255`, `fill = 'solid' | 'light'`, `legendAboveOnMobile` (dòng 4-10).
  - Hằng hình học: khung 420 x 380, tâm (210, 186), bán kính 120, 4 vòng 25-100% (dòng 14-21).
  - `angleAt` bắt đầu từ đỉnh (-π/2) (dòng 40-42); `pointAt` làm tròn 0,1 (dòng 44-54); `ratioOf` kẹp 0..max (dòng 56-58); `labelPosition` chọn `text-anchor` theo cos, nhãn 2 dòng bằng `tspan` (dòng 64-81, 150-154).
  - `scale = max > 0 ? max : 255` tránh chia cho 0 (dòng 90).
  - `<svg role="img" aria-label>` với `aria-label` liệt kê đủ 6 giá trị mỗi series (dòng 91-99).
  - Series `accent` có nét đứt `8 5`, chú giải cũng nét đứt, nên phân biệt được cả khi in trắng đen (dòng 25-33, 132, 172); mỗi series `animate-radar-in` trễ 300 ms + 150 ms mỗi series (dòng 119-125).
- **Phụ thuộc:** `describeStats`, `STAT_AXES`, `STAT_MAX`. Dùng bởi `CompareRadar`, `CoverageAndStats`.
- **Biên và lỗi:** giá trị âm hoặc vượt `max` bị kẹp.
- **Test:** `frontend/src/components/pokemon/StatRadar.test.tsx`: hai polygon, đúng class màu, `aria-label` đầy đủ, nhãn trục 2 dòng (dòng 39-62); `fill="light"` và chú giải lên trên ở mobile (dòng 64-81); mặc định (dòng 83-93); `hp: 400` với `max=100` thành điểm (210,66), toàn 0 dồn về tâm (dòng 95-110).

**12. `STAT_AXES`, `STAT_MAX`, `describeStats` (`frontend/src/components/pokemon/statAxes.ts`)**

| File | Export | Dùng bởi |
|---|---|---|
| `frontend/src/components/pokemon/statAxes.ts` | `StatKey`, `StatAxis`; `STAT_AXES` 6 trục theo thứ tự HP, Tấn công, Phòng thủ, Tấn công đặc biệt, Phòng thủ đặc biệt, Tốc độ, kèm nhãn tách dòng (dòng 3-18); `STAT_MAX = 255` (dòng 20); `describeStats(stats)` trả "HP 108, Tấn công 130, ..." (dòng 22-24) | `StatRadar`, `features/compare` (`StatDuelTable`, `scale.ts`), `frontend/src/features/landing/quiz.ts`, `StatPanel`, `CoverageAndStats` |

#### IX. `src/types`

**1. `api.ts` (`frontend/src/types/api.ts`)**

- **Vai trò:** kiểu DTO khớp `docs/api.md`, Phần 3; là hợp đồng giữa frontend và backend.
- **Thành phần chính:**

| Nhóm | Kiểu | Dòng |
|---|---|---|
| Hệ, dạng | `TypeName` (18 hệ), `FormCategory` | 1-21 |
| Phân trang | `PageResponse<T>` (`content`, `page`, `size`, `totalElements`, `totalPages`) | 23-29 |
| Pokémon | `PokemonRef` (`id`, `name`, `types`, không có URL ảnh), `PokemonSummary`, `Stats`, `DefenseEntry`, `PokemonForm`, `PokemonDetail` | 31-78 |
| So sánh | `Winner`, `CompareResponse` | 80-91 |
| Tương khắc | `TypeMatrix`, `TypeMatrixRow` | 93-96, 130-137 |
| Tiến hóa, tốc độ, thế hệ | `EvolutionStage`, `EvolutionResponse`, `SpeedTier`, `GenerationProfile` | 98-128 |
| Synergy | `AnalyzeRequest`, `AnalyzeResponse`, `InsightTone`, `InsightCategory`, `TeamInsight`, `PlayStyle`, `RecommendationRequest`, `Recommendation`, `RecommendationResponse` | 139-185 |
| Đội | `TeamMemberRequest`, `CreateTeamRequest`, `TeamMember`, `TeamResponse` | 187-209 |
| Lỗi | `ProblemDetail` (`status`, `title?`, `detail?`, `code?`) | 211-216 |

- **Phụ thuộc:** không import gì; được 87 file dùng.
- **Biên và lỗi:** chỉ là kiểu lúc biên dịch, không kiểm tra lúc chạy. `TypeName` trong file này theo thứ tự ID của PokéAPI, khác thứ tự hiển thị `TYPE_NAMES`.
- **Test:** không áp dụng.

#### X. `src/test` và danh sách file test

**1. `setup.ts` (`frontend/src/test/setup.ts`)**

- **Vai trò:** chạy trước mọi file test.
- **Thành phần chính:** nạp matcher `@testing-library/jest-dom/vitest` (dòng 1); jsdom chưa có `HTMLDialogElement.showModal` thì gắn bản tối giản: `showModal` đặt `open = true`, `close` đặt `open = false` và phát sự kiện `close` (dòng 5-14); `cleanup()` sau mỗi test (dòng 16-18).
- **Phụ thuộc:** khai báo ở `vite.config.ts:31`.
- **Biên và lỗi:** polyfill không bẫy focus như trình duyệt thật.

**2. `renderRoute.tsx` (`frontend/src/test/renderRoute.tsx`)**

- **Vai trò:** bộ công cụ test route.
- **Thành phần chính:**
  - `resolveLazyRoutes` gọi trước mọi hàm `lazy` và trộn `Component` vào route, đệ quy theo `children` (dòng 9-17); `eagerRoutes` tính bằng top-level `await` (dòng 19), nên test render đồng bộ.
  - `renderRoute(path)`: `QueryClient` với `retry: false`, `createMemoryRouter(eagerRoutes, { initialEntries: [path] })`, trả router để test gọi `navigate` hoặc đọc `state.location` (dòng 21-30).
  - `jsonResponse(body, status = 200)`: `Content-Type` là `application/problem+json` khi từ 400 (dòng 32-37); `pageOf(content, totalPages)` (dòng 39-41); `stubFetch(...responses)`: trả lần lượt các response, sau đó mặc định trang rỗng; thay `fetch` toàn cục (dòng 43-49).
- **Phụ thuộc:** `routes`, kiểu `PageResponse`, `PokemonSummary`. Dùng bởi `router.test.tsx`, `PokemonSearchBox.test.tsx` và 6 file test trang.

**3. Toàn bộ file test trong phạm vi**

| File test | Đối tượng | Số case | Kiểm tra chính |
|---|---|---|---|
| `frontend/src/app/router.test.tsx` | `routes`, layout | 13 (7 từ `it.each`) | Điều hướng, `h1`, lazy, tham số, cuộn, 404 |
| `frontend/src/app/routeErrors.test.tsx` | `errorElement` | 1 | Chunk lỗi vẫn giữ Header, có nút tải lại |
| `frontend/src/app/layout/Header.test.tsx` | `Header` | 4 | `aria-current`, menu mobile, `Escape` trả focus |
| `frontend/src/app/layout/Footer.test.tsx` | `Footer` | 5 | Link liên hệ, điều hướng, ghi nguồn, 4 Pokémon ổn định |
| `frontend/src/app/layout/footerPokemon.test.ts` | `pickFooterPokemon` | 3 | Pool đủ starter, không trùng |
| `frontend/src/lib/formatters.test.ts` | formatter | 5 | Tên, số, đơn vị, hệ số |
| `frontend/src/lib/motion.test.ts` | `staggerDelay` | 2 | Bước, trần 640 ms |
| `frontend/src/lib/scenes.test.ts` | scene | 26 (18 từ `it.each`) | Ánh xạ hệ, gradient, `nextPhoto` |
| `frontend/src/lib/typeEffectiveness.test.ts` | tương khắc | 4 | Tra đơn, hệ kép, nhóm |
| `frontend/src/components/ui/pageItems.test.ts` | `pageItems` | 4 | Khoảng trống, rỗng |
| `frontend/src/components/motion/Reveal.test.tsx` | `Reveal` | 3 | Observer, giảm chuyển động |
| `frontend/src/components/motion/usePauseOffscreen.test.tsx` | `usePauseOffscreen` | 3 | Đánh dấu, dọn |
| `frontend/src/components/scene/SceneBackdrop.test.tsx` | `SceneBackdrop` | 6 | Ảnh, xoay, lỗi, giảm chuyển động |
| `frontend/src/components/pokemon/PokemonSearchBox.test.tsx` | `PokemonSearchBox` | 7 | Combobox, debounce, lỗi |
| `frontend/src/components/pokemon/StatBar.test.tsx` | `StatBar` | 10 (6 từ `it.each`) | Tỷ lệ, màu, kẹp |
| `frontend/src/components/pokemon/StatRadar.test.tsx` | `StatRadar` | 4 | Polygon, `aria-label`, kẹp |

- File không có test riêng: `App`, `providers`, `AppLayout`, `navItems`, `assets`, `clipboard`, `errorMessages`, `http`, `pokemonTypes`, `queryClient`, `useMediaQuery`, 6 component `ui` (trừ `pageItems`), `PageHero`, `SceneLabel`, `SceneAmbience`, `useReducedMotion`, `PokemonSprite`, `PokemonCard`, `TypeBadge`, `TypeGlyph`, `DexNumber`, `MultiplierCell`, `multiplierStyles`, `NeutralMark`, `statAxes`. Phần lớn được kiểm gián tiếp như đã ghi ở từng mục.

#### XI. `frontend/src/styles/index.css` (tóm tắt theo nhóm)

**1. Cơ chế**

- `@import 'tailwindcss'` (dòng 1). Tailwind 4 không có `tailwind.config.js`; token khai báo bằng `@theme` trong CSS, mỗi biến sinh class (`--color-type-fire` thành `bg-type-fire`) (`docs/design-system.md`, Phần 3, mục I).
- Hai custom variant: `dark` theo class `.dark` (dòng 3), `short` cho màn hình thấp dưới 50rem (dòng 4), dùng ở `LandingHero` (`lg:short:...`).
- `@font-face` "Dela Gothic One Fallback" dựa trên Arial Black, chỉnh `size-adjust`, `ascent-override`, `descent-override` để chữ dự phòng chiếm gần đúng chỗ của font thật, giảm nhảy bố cục khi font tải xong (dòng 6-13).

**2. Token**

| Nhóm | Nội dung | Dòng |
|---|---|---|
| Ngữ nghĩa light | `--pn-bg`, `surface`, `surface-muted`, `border`, `border-strong`, `ink`, `ink-muted`, `primary`, `primary-hover`, `on-primary`, `accent`, `success`, `warning`, `danger`, `focus-ring` trên `:root` | 15-31 |
| Ngữ nghĩa dark | Cùng tên, giá trị tối, dưới class `.dark` (chưa có nút bật) | 33-49 |
| Ánh xạ ngữ nghĩa | `@theme inline`: `--color-bg: var(--pn-bg)`... để class đổi theo `.dark` | 51-67 |
| Font | `--font-display` (Dela Gothic One + fallback), `--font-sans` (Nunito), `--font-pixel` (Pixelify Sans) | 70-73 |
| Cỡ chữ | `text-display-xl` 36/40, `text-display` 28/34, `text-num-lg` 32/32, `text-num` 16/16 | 75-82 |
| Vỏ Pokédex | `dex-red`, `dex-red-hover`, `dex-yellow` | 84-86 |
| Bóng | `shadow-block`, `-lg`, `-hover`, `shadow-blob`, `shadow-header` (bóng đặc lệch xuống) | 88-92 |
| 18 màu hệ | `--color-type-{hệ}` | 94-111 |
| 18 màu hệ đậm | `--color-type-{hệ}-deep` cho nền card chữ trắng | 113-130 |
| Hệ số | `--color-mult-0`, `025`, `05`, `1`, `2`, `4` | 132-137 |
| Mức hở đội | `--color-pressure-safe/low/mid/high` | 139-142 |
| Thanh chỉ số | `--color-stat-low/mid/good/high` | 144-147 |
| Scrim | `--color-scrim` cố định, không đổi theo theme | 149 |
| Trang trí trang Tổng quan | `band-*` (9), `isle-*`, `scrim-raised`, `dex-red-deep`, `dex-red-edge`, `answer-hover` | 527-551 |
| Easing | `--ease-emphasized`, `--ease-spring`, `--ease-overshoot` | 157-159 |

**3. Animation**

| Nhóm | Token `--animate-*` | Dòng token, keyframes |
|---|---|---|
| Vào trang, danh sách | `card-in`, `fade-up`, `slide-in-left/right`, `pop-in`, `chip-on`, `cell-in`, `grow-x`, `grow-y` | 161-169; 188-286 |
| Chi tiết, So sánh | `drop-in`, `drop-shadow`, `float`, `float-shadow`, `fly-in-left/right`, `vs-pop`, `radar-in`, `pulse-ring`, `shine` | 170-179; 288-414 |
| Trang Tổng quan | `title-in`, `boot`, `iris`, `rise`, `marquee`, `bob`, `draw`, `drift-a/b`, `cloud`, `twinkle`, `orb`, `isle-shadow`, `ring-in`, `spin-slow`, `path-draw` | 180-186, 553-561; 416-487, 563-626 |
| Khung cảnh | `scene-drift` (phóng chậm 24 giây), `scene-enter` (mờ vào 1,2 giây cộng drift) | 153-155; 489-505 |
| Tương tác | `hop` (sprite nhảy 4 px), `sheet-in` (ngăn kéo lọc) | 151-152; 507-524 |
| Hạt khung cảnh | `ambience-fall`, `-flutter`, `-rise`, `-glow`, `-spark`, `-blow` (đơn vị `cqh`, `cqw`) | 943-1030 |

**4. Utility và class component**

| Tên | Tác dụng | Dòng |
|---|---|---|
| `type-blob`, `type-ring`, `type-card`, `type-tint`, `type-glow` | Nền, vòng 18 màu, card, nền nhạt, quầng theo `--type-base`/`--type-deep` | 629-685, 734-742, 768-770, 798-801 |
| `scene-tint`, `scene-fade` | Nền thân trang nhuộm 18% màu nhấn rồi nhạt dần 32 rem; dải 6 nấc nối ảnh với nền | 744-766 |
| `poster-cut`, `poster-scrim`, `poster-rays` | Poster "Pokémon hôm nay" | 772-796 |
| `scan-grid`, `aura-mask`, `bar-stripes`, `dot-field`, `text-outline` | Họa tiết trang trí | 687-722 |
| `.reveal*`, `.reveal-grow-y`, `.reveal-draw` | Trạng thái ẩn và hiện của `Reveal` | 724-732, 803-845 |
| `.shine-sweep`, `.chip-pop` | Vệt sáng khi hover hoặc focus; chip nảy khi `aria-pressed="true"` | 847-869 |
| `.scene-ambience`, `.ambience-*` | Lớp hạt, `container-type: size` | 871-940 |

**5. Quy tắc toàn cục**

- `[data-offscreen] *` dừng animation (dòng 1032-1036).
- `body` nền `bg`, chữ `ink`, font `sans` (dòng 1038-1042).
- `@layer base`: `:focus-visible` viền 2 px `focus-ring` cách 2 px (dòng 1045-1048); `prefers-reduced-motion: reduce` đặt mọi animation, transition còn 0,01 ms, chạy 1 lần, tắt cuộn mượt (dòng 1050-1059).

#### XII. `public/`

| Đường dẫn | Nội dung | Cách tạo | Cách dùng |
|---|---|---|---|
| `frontend/public/favicon.svg` | Icon tròn SVG | Tự vẽ | `frontend/index.html:5` |
| `frontend/public/sprites/pokemon/{id}.png` | 1342 sprite 96 x 96 | `scripts/download-sprites.sh`: đọc cột `id` của `data/csv/pokemon.csv`, tải từ `PokeAPI/sprites`, 4 luồng, thử lại 2 lần, bỏ qua file đã có (`scripts/download-sprites.sh:20-43`) | `getSpriteUrl` |
| `frontend/public/sprites/missing.txt` | 9 ID trả 404 (ví dụ 10264-10271, 10301) | Script ghi khi gặp 404 (`scripts/download-sprites.sh:32-34, 46`) | Không đọc lúc chạy; các ID này rơi về placeholder |
| `frontend/public/sprites/placeholder.svg` | Hình tròn xám, `aria-label="Chưa có ảnh"` | Tự vẽ | `PLACEHOLDER_URL` |
| `frontend/public/scenes/{scene}-{n}-{960,1920}.webp` | 36 ảnh x 2 cỡ = 72 file | Ảnh chụp game từ Bulbagarden Archives, cắt 16:9, Lanczos, WebP; 13 ảnh có vùng xóa vẽ lại bằng ChatGPT, ghép vào ảnh gốc (`frontend/public/scenes/SOURCES.md:3-10`; ADR 0008) | `sceneUrl`, `sceneSrcSet` |
| `frontend/public/scenes/{scene}-thumb.webp` | 13 ảnh dọc 400 x 600 (không có `lab`, `stadium`) | Cắt dọc giữa ảnh 1 bản 1920 | `sceneThumbUrl` ở `TerrainPicker` |
| `frontend/public/scenes/SOURCES.md` | Nguồn và xử lý từng ảnh | Viết tay | Tài liệu bản quyền |

- File trong `public/` được phục vụ nguyên tên ở gốc domain, không qua bundler, không gắn hash. Không có `_headers` hay `_redirects`; SPA fallback dựa vào mặc định của Cloudflare Pages (ADR 0007 dòng 20).

### III. Luồng xử lý tiêu biểu

#### I. Mở app tới khi hiện trang

1. Trình duyệt tải `index.html` có `div#root` và script module (`frontend/index.html:14-15`); ở bản build, script và CSS đã được thay bằng file có hash (`frontend/dist/index.html`).
2. `main.tsx` nạp font và `index.css` (`frontend/src/main.tsx:1-6`), tìm `#root` (`frontend/src/main.tsx:13-16`), render `App` trong `StrictMode` (`frontend/src/main.tsx:18-22`).
3. `App` tạo `AppProviders` (`frontend/src/app/App.tsx:8`); `useState(createQueryClient)` tạo một `QueryClient` với retry và refetch đã cấu hình (`frontend/src/app/providers.tsx:11`, `frontend/src/lib/queryClient.ts:10-19`).
4. `router` đã được tạo lúc import module (`frontend/src/app/router.tsx:68`). URL `/pokedex` khớp route có `lazy`, nên router chưa khởi tạo xong (`frontend/node_modules/react-router/dist/development/lib/router/router.js:175-177`) và render `AppLayout` với `pageFallback` trong `Outlet` (`frontend/node_modules/react-router/dist/development/lib/hooks.js:744-781`, `frontend/src/app/router.tsx:8-12`).
5. `AppLayout` hiện skip link, Header, `main`, Footer, `ScrollRestoration` (`frontend/src/app/layout/AppLayout.tsx:10-23`); Footer chọn 4 Pokémon (`frontend/src/app/layout/Footer.tsx:59`).
6. Chunk `DexPage` tải xong (`frontend/src/app/router.tsx:36`), trang render `PageHero`; `SceneBackdrop` vẽ gradient ngay rồi ảnh `fetchpriority="high"` phủ lên (`frontend/src/components/scene/SceneBackdrop.tsx:50, 151`).
7. Trang gọi `usePokemonList` (`frontend/src/pages/DexPage.tsx:34`), dữ liệu đi qua `frontend/src/lib/http.ts` (luồng III).

#### II. Điều hướng tới trang lazy mà chunk không tải được

1. Người dùng bấm "Tương khắc" (`frontend/src/app/layout/Header.tsx:54`); router chạy hàm `lazy` của route `types` (`frontend/src/app/router.tsx:41-44`).
2. `import('../pages/TypeChartPage')` bị từ chối, ví dụ sau một lần deploy file chunk cũ không còn trên máy chủ (`TypeError: Failed to fetch dynamically imported module`).
3. Route `types` không có `errorElement`; lỗi đi lên route bọc không `path` có `errorElement: <RouteErrorPage />` (`frontend/src/app/router.tsx:29-31`).
4. `RouteErrorPage` hiện trong `Outlet` của `AppLayout` (`frontend/src/app/layout/AppLayout.tsx:18-20`), nên Header, Footer còn nguyên.
5. Người dùng bấm "Tải lại trang" (`window.location.reload()`) hoặc "Về trang Tổng quan" (`reloadDocument`) (`frontend/src/pages/RouteErrorPage.tsx:18-27`); trình duyệt lấy `index.html` mới với tên chunk mới.
6. Kiểm chứng: `frontend/src/app/routeErrors.test.tsx:8-32`.

#### III. API trả 503 `DATA_NOT_READY` và người dùng thấy gì

1. `DexPage` gọi `usePokemonList(filter)` (`frontend/src/pages/DexPage.tsx:34`), query key `['pokemon', 'list', filter]`, `staleTime` 5 phút (`frontend/src/features/dex/hooks.ts:8-15`).
2. `fetchPokemonList` gọi `getJson('/pokemon', params, signal)` (`frontend/src/features/dex/api.ts:7-26`); `buildUrl` ghép base URL và query string (`frontend/src/lib/http.ts:25-34`).
3. `request` gọi `fetch` (`frontend/src/lib/http.ts:56`); response 503, `response.ok` sai.
4. `readProblem` đọc ProblemDetail (`frontend/src/lib/http.ts:79-85`); ném `ApiError(503, 'DATA_NOT_READY', detail, retryAfter)` (`frontend/src/lib/http.ts:61-68`).
5. TanStack Query gọi `retryUnlessClientError(0, err)`: 503 không phải 4xx, `0 < 1` nên thử lại sau 1 giây (`frontend/src/lib/queryClient.ts:5-8`; `frontend/node_modules/@tanstack/query-core/src/retryer.ts:87-89`). Lần lỗi thứ hai `failureCount` là 1, dừng.
6. `DexPage` render `ErrorState` với `errorMessageFor('DATA_NOT_READY')` (`frontend/src/pages/DexPage.tsx:141-145`), ra câu "Dữ liệu Pokémon đang được nạp. Hãy thử lại sau ít phút." (`frontend/src/lib/errorMessages.ts:13`).
7. `ErrorState` có `role="alert"` nên trình đọc màn hình đọc ngay; nút "Thử lại" gọi `refetch` (`frontend/src/components/ui/ErrorState.tsx:11-15`). `detail` tiếng Anh không hiện (`frontend/src/pages/DexPage.test.tsx:245-254`).
8. Nếu là lỗi mạng (backend tắt): `fetch` ném lỗi, thành `ApiError(0, 'NETWORK_ERROR')` (`frontend/src/lib/http.ts:57-60`), câu "Không kết nối được máy chủ..." (`frontend/src/lib/errorMessages.ts:14`).

#### IV. Từ ID Pokémon tới ảnh trên màn hình

1. Backend trả `PokemonSummary` chỉ có `id`, `name`, `types`... không có URL ảnh (`frontend/src/types/api.ts:31-42`; ADR 0005 Phần 2).
2. `PokemonCard` render `<PokemonSprite id={pokemon.id} alt={displayName} />` (`frontend/src/components/pokemon/PokemonCard.tsx:57`).
3. `sourcesFor(id, 'sprite')` trả `['/sprites/pokemon/{id}.png', '/sprites/placeholder.svg']`; với `artwork` thêm URL GitHub ở đầu (`frontend/src/components/pokemon/PokemonSprite.tsx:13-16`; `frontend/src/lib/assets.ts:3-18`).
4. `<img>` có `width`, `height` (chống nhảy bố cục), `loading="lazy"`, sprite có `image-rendering: pixelated` (`frontend/src/components/pokemon/PokemonSprite.tsx:29-38`).
5. Ảnh lỗi (offline, hoặc ID thuộc `missing.txt`): `onError` tăng `level`, ảnh chuyển nguồn kế tiếp tới placeholder (`frontend/src/components/pokemon/PokemonSprite.tsx:39-41`).
6. Ảnh khung cảnh đi đường tương tự: `sceneUrl(scene, photo, 1920)` và `sceneSrcSet` cho `srcset` 960w, 1920w với `sizes="100vw"`; trình duyệt tự chọn cỡ theo màn hình (`frontend/src/lib/assets.ts:20-30`; `frontend/src/components/scene/SceneBackdrop.tsx:143-152`).

#### V. Khung cảnh chuyển động, dừng khi ngoài màn hình và khi giảm chuyển động

1. Trang chi tiết chọn scene bằng `sceneForTypes(types)` (`frontend/src/lib/scenes.ts:228-233`); trang khác truyền scene cố định cho `PageHero`.
2. `PageHero` luôn gọi `SceneBackdrop` với `priority animated` (`frontend/src/components/scene/PageHero.tsx:66`).
3. `useReducedMotion()` đọc media query (`frontend/src/components/scene/useReducedMotion.ts:20-22`); bật giảm chuyển động thì `moving` sai: không interval, không drift, không `SceneAmbience` (`frontend/src/components/scene/SceneBackdrop.tsx:42-53, 141`).
4. Không giảm chuyển động: mỗi 12 giây tải trước và `decode()` ảnh kế tiếp rồi thêm lớp mờ vào; tab ẩn thì bỏ lượt (`frontend/src/components/scene/SceneBackdrop.tsx:75-114`); sau 1,2 giây gỡ lớp cũ (`frontend/src/components/scene/SceneBackdrop.tsx:116-122`).
5. Đổi scene trên cùng trang (ví dụ trang Địa hình): `key={scene}` mount lại lớp nền với `animate-iris` (`frontend/src/components/scene/PageHero.tsx:62-65`).
6. Trang Tổng quan: `usePauseOffscreen` đánh dấu khối cách màn hình hơn 200 px bằng `data-offscreen` (`frontend/src/components/motion/usePauseOffscreen.ts:5-22`); CSS dừng mọi animation bên trong (`frontend/src/styles/index.css:1032-1036`).
7. Lưới an toàn ở CSS: `prefers-reduced-motion: reduce` rút mọi animation, transition còn 0,01 ms (`frontend/src/styles/index.css:1050-1059`); `Reveal` hiện ngay (`frontend/src/components/motion/Reveal.tsx:38`).

### IV. Câu hỏi có thể bị hỏi

| # | Câu hỏi | Trả lời mẫu (2-4 câu, nói được thành lời) | Nguồn |
|---|---|---|---|
| 1 | Từ lúc mở trình duyệt tới khi thấy trang, code chạy qua những file nào? | `index.html` nạp `main.tsx`; file này nạp font, CSS rồi render `App` trong `StrictMode`. `App` bọc `RouterProvider` trong `AppProviders` để mọi trang dùng chung một `QueryClient`. Router khớp URL, dựng `AppLayout`, rồi tải chunk của trang. | `frontend/src/main.tsx:1-22`, `frontend/src/app/App.tsx:6-11` |
| 2 | Bảng route có những gì, route nào có tham số? | Có 8 trang dưới `/`: trang chủ, `pokedex`, `pokemon/:idOrName`, `types`, `compare`, `team-builder`, `team/:shareCode`, `terrain/:terrainId?` (tham số tùy chọn), cộng `*` cho 404. Tất cả nằm dưới `AppLayout` và một route bọc không `path` để bắt lỗi. | `frontend/src/app/router.tsx:23-66` |
| 3 | Code splitting làm thế nào, có lợi gì? | Mỗi trang khai báo bằng `lazyPage(() => import(...))`, Vite tách thành chunk riêng như `DexPage-*.js`. Người vào trang Pokédex không phải tải code Team Builder. Bản build có sẵn trong `dist` cho thấy file JS ban đầu khoảng 117 KB sau gzip, dưới ngân sách 300 KB. | `frontend/src/app/router.tsx:14-21`; `docs/architecture.md:394`; đo `gzip -c` trên `frontend/dist/assets/index-*.js` (build lúc 17:27 ngày 2026-11-02, trước commit HEAD) |
| 4 | Trong lúc chunk đang tải, người dùng thấy gì? | Lần tải đầu, React Router render layout và `hydrateFallbackElement` là một khối `aria-busy` có chữ ẩn "Đang tải trang…", nên Header hiện ngay. Các lần điều hướng sau, router tải chunk xong mới đổi trang; app chưa có thanh tiến trình cho giai đoạn này. | `frontend/src/app/router.tsx:8-12, 19`; `router.test.tsx:56-68`; `react-router/.../router.js:175-177` |
| 5 | Vì sao có hai `errorElement`? | Route bọc không `path` bắt lỗi của từng trang, nên trang lỗi hiện bên trong layout và vẫn có Header để đi tiếp. `errorElement` ở route `/` là dự phòng khi chính `AppLayout` lỗi. | `frontend/src/app/router.tsx:24-31`; `docs/architecture.md:341` |
| 6 | Sau khi deploy bản mới, người đang mở tab cũ bấm sang trang khác thì sao? | Tên chunk cũ có thể không còn, `import()` lỗi. Lỗi rơi vào `RouteErrorPage` có nút "Tải lại trang"; tải lại sẽ lấy `index.html` mới. Test `routeErrors.test.tsx` giả lập đúng lỗi "Failed to fetch dynamically imported module". | `frontend/src/pages/RouteErrorPage.tsx:18-27`; `frontend/src/app/routeErrors.test.tsx:8-32` |
| 7 | Vì sao link "Về trang Tổng quan" trong trang lỗi có `reloadDocument`? | Điều hướng client-side vẫn dùng bundle cũ đang lỗi. `reloadDocument` buộc trình duyệt tải lại cả tài liệu từ máy chủ, nên lấy được bản mới. Trang 404 thì không cần vì bundle vẫn tốt. | `frontend/src/pages/RouteErrorPage.tsx:25`; `frontend/src/pages/NotFoundPage.tsx:18` |
| 8 | Cuộn trang khi chuyển trang hoạt động thế nào? | `ScrollRestoration` trong `AppLayout` cuộn về đầu khi sang trang mới và khôi phục vị trí khi Back, lưu vị trí trong `sessionStorage`. Khi chỉ đổi bộ lọc trên URL, các hook truyền `preventScrollReset` nên trang không nhảy lên đầu. Có test cho cả hai trường hợp. | `frontend/src/app/layout/AppLayout.tsx:22`; `frontend/src/features/dex/useDexSearchParams.ts:117`; `router.test.tsx:83-108` |
| 9 | Đường dẫn lạ có trả HTTP 404 không? | Không từ phía app: đây là SPA, `NotFoundPage` chỉ là giao diện 404 phía client qua route `*`. Cloudflare Pages trả `index.html` cho mọi đường dẫn vì không có `404.html`; mã HTTP cụ thể do Pages quyết định, chưa xác định từ code. | `frontend/src/app/router.tsx:61`; ADR 0007 dòng 20 |
| 10 | TanStack Query cấu hình mặc định ra sao? | Retry dùng hàm riêng: lỗi 4xx không thử lại, lỗi khác thử lại một lần sau 1 giây. Tắt `refetchOnWindowFocus` vì dữ liệu Pokémon gần như tĩnh. `staleTime` để từng hook đặt: `Infinity` cho dữ liệu tĩnh, 5 phút cho danh sách và tìm kiếm. | `frontend/src/lib/queryClient.ts:5-19`; `frontend/src/features/dex/hooks.ts:6-24`; `docs/architecture.md:328-338` |
| 11 | Vì sao không thử lại lỗi 4xx? | Lỗi 4xx là lỗi của yêu cầu (tham số sai, Pokémon không tồn tại, bị giới hạn tần suất); gửi lại y nguyên vẫn lỗi và còn làm 429 nặng hơn. Lỗi 5xx và lỗi mạng có thể tạm thời nên thử lại một lần. | `frontend/src/lib/queryClient.ts:5-8` |
| 12 | Vì sao tạo `QueryClient` bằng `useState(createQueryClient)`? | Truyền hàm khởi tạo vào `useState` thì client chỉ tạo một lần và giữ nguyên qua mọi lần render. Tạo trực tiếp trong thân component sẽ mất cache mỗi lần render lại. Test cũng tự tạo client riêng để không dùng chung cache giữa các test. | `frontend/src/app/providers.tsx:11`; `frontend/src/test/renderRoute.tsx:22` |
| 13 | Một request đi qua `http.ts` thế nào? | `buildUrl` ghép base URL với query string, mảng thành nhiều khóa lặp. `request` gọi `fetch`; lỗi mạng thành `ApiError(0, 'NETWORK_ERROR')`, status không ok thì đọc ProblemDetail và ném `ApiError` có `code`. Thành công thì trả `response.json()`. | `frontend/src/lib/http.ts:25-71` |
| 14 | Vì sao `AbortError` không bị bọc thành `ApiError`? | TanStack Query hủy request cũ qua `AbortSignal` khi query key đổi hoặc component rời trang. Đó là hủy chủ động, không phải lỗi mạng; bọc thành `NETWORK_ERROR` sẽ làm hiện thông báo lỗi sai. | `frontend/src/lib/http.ts:57-58` |
| 15 | Lỗi từ backend biến thành câu tiếng Việt ở đâu? | `ApiError` mang `code` từ ProblemDetail. Component gọi `errorMessageFor(code)` để tra bảng 14 mã; mã lạ ra "Đã có lỗi xảy ra.". `detail` tiếng Anh không bao giờ hiện cho người dùng. | `frontend/src/lib/errorMessages.ts:1-25`; `frontend/src/pages/DexPage.tsx:141-145` |
| 16 | `Retry-After` được dùng thế nào? | `readRetryAfter` đọc header nếu là số giây nguyên và gắn vào `ApiError.retryAfterSeconds`. Khi lưu đội bị 429, hộp thoại hiện "Hãy thử lại sau N giây". Dạng ngày giờ HTTP chưa được hỗ trợ. | `frontend/src/lib/http.ts:73-77`; `frontend/src/lib/errorMessages.ts:21-23`; `frontend/src/pages/TeamBuilderPage.test.tsx:369-384` |
| 17 | Địa chỉ backend cấu hình ở đâu, sao tránh được bản production gọi `localhost`? | Lấy từ `VITE_API_BASE_URL`, Vite thay vào lúc build; không có thì dùng `http://localhost:8080/api/v1`. Khi build trên Cloudflare Pages (`CF_PAGES=1`), `vite.config.ts` cho build thất bại nếu giá trị thiếu hoặc không bắt đầu bằng `https://`. | `frontend/src/lib/http.ts:3-7`; `frontend/vite.config.ts:10-21`; `docs/architecture.md:509-510` |
| 18 | Vì sao backend không trả URL ảnh? | Theo ADR 0005, URL ảnh là chuyện hiển thị: backend không biết frontend host ở đâu. Frontend sinh URL từ ID trong `frontend/src/lib/assets.ts`; đổi nguồn ảnh chỉ sửa một file, không đổi API hay schema. | ADR 0005 Phần 2, 4; `frontend/src/lib/assets.ts:12-30` |
| 19 | Mất mạng lúc demo thì ảnh có vỡ không? | Sprite 96 px tự host trong `public/sprites`, nên vẫn hiện. Artwork lấy từ GitHub; lỗi thì `PokemonSprite` tự chuyển sang sprite, rồi sang `placeholder.svg`. Ảnh khung cảnh tự host; nếu lỗi vẫn còn gradient màu dự phòng. | `frontend/src/components/pokemon/PokemonSprite.tsx:13-16, 39-41`; `frontend/src/components/scene/SceneBackdrop.tsx:50, 124-137` |
| 20 | Làm sao tránh nhảy bố cục (CLS) vì ảnh và font? | `PokemonSprite` luôn đặt `width`, `height`; ảnh khung cảnh nằm trong khung có chiều cao cố định với `object-cover`. Font Display có `@font-face` dự phòng chỉnh kích thước cho gần font thật. | `frontend/src/components/pokemon/PokemonSprite.tsx:35-36`; `frontend/src/components/scene/PageHero.tsx:59`; `frontend/src/styles/index.css:6-13` |
| 21 | Khung cảnh được chọn thế nào cho mỗi Pokémon? | Lấy hệ ở slot 1 tra bảng 18 hệ sang 15 scene; nếu hệ 1 là Normal và có hệ 2 thì theo hệ 2, ví dụ Pidgey ra `sky`. Không dùng `habitat` của PokéAPI vì chỉ 386 loài có giá trị. | `frontend/src/lib/scenes.ts:207-233`; `docs/design-system.md`, Phần 2, mục VI.2 |
| 22 | Ảnh nền đổi mỗi 12 giây mà không nháy trắng bằng cách nào? | Interval tạo `new Image()` tải trước ảnh kế tiếp, chờ `onload` rồi `decode()` mới thêm lớp mới. Lớp mới mờ dần vào trên lớp cũ trong 1,2 giây, sau đó lớp cũ bị gỡ. Tab ẩn thì bỏ lượt để không tốn mạng. | `frontend/src/components/scene/SceneBackdrop.tsx:75-122` |
| 23 | Ảnh khung cảnh bị lỗi 404 thì sao? | Ảnh lỗi được ghi vào `failed` và bị bỏ khỏi vòng xoay, `nextPhoto` chọn ảnh khác. Hết ảnh thì không còn `<img>`, chỉ còn gradient vẽ bằng màu của scene. Có test cho cả hai trường hợp. | `frontend/src/components/scene/SceneBackdrop.tsx:105-108, 124-137`; `SceneBackdrop.test.tsx:61-75` |
| 24 | Trang Tổng quan nhiều animation, làm sao không tốn CPU? | `usePauseOffscreen` dùng một `IntersectionObserver` gắn `data-offscreen` cho khối ở xa màn hình hơn 200 px, CSS dừng mọi animation bên trong. Animation lặp chỉ dùng `transform` và `opacity` để chạy trên GPU. Lớp hạt mobile chỉ còn 9 hạt. | `frontend/src/components/motion/usePauseOffscreen.ts:5-27`; `frontend/src/styles/index.css:1032-1036`; `frontend/src/components/scene/SceneAmbience.tsx:38` |
| 25 | Hỗ trợ người bật giảm chuyển động ở mấy lớp? | Lớp JS: `useReducedMotion` tắt đổi ảnh, drift, lớp hạt, và `Reveal` hiện ngay. Lớp CSS: `@media (prefers-reduced-motion: reduce)` rút mọi animation, transition xuống 0,01 ms. Hook dùng `useSyncExternalStore` nên đổi cài đặt hệ điều hành là cập nhật ngay. | `frontend/src/components/scene/useReducedMotion.ts:1-22`; `frontend/src/styles/index.css:1050-1059`; `frontend/src/components/motion/Reveal.tsx:38` |
| 26 | Trình duyệt cũ không có `IntersectionObserver` thì nội dung có bị ẩn mãi không? | Không. `Reveal` khởi tạo `seen = true` khi không có observer, nên nội dung hiện ngay; `usePauseOffscreen` thì không làm gì. Có test cho cả hai. | `frontend/src/components/motion/Reveal.tsx:20`; `Reveal.test.tsx:36-43`; `usePauseOffscreen.test.tsx:76-81` |
| 27 | Có những lựa chọn accessibility nào ở khung chung? | `lang="vi"`, skip link tới `#main-content`, nav có `aria-label`, mục đang chọn có `aria-current="page"` kèm gạch chân chứ không chỉ màu. Menu mobile có `aria-expanded`, `aria-controls`, `Escape` đóng và trả focus về nút. Mỗi trang có đúng một `h1` trong `PageHero`. | `frontend/index.html:2`; `frontend/src/app/layout/AppLayout.tsx:11-18`; `frontend/src/app/layout/Header.tsx:24-28, 62-69`; `router.test.tsx:41-54` |
| 28 | Ô tìm kiếm hỗ trợ bàn phím và trình đọc màn hình thế nào? | Theo mẫu ARIA combobox: input `role="combobox"` với `aria-activedescendant` trỏ tới option đang chọn, phím mũi tên xoay vòng, `Enter` chọn, `Escape` đóng. Vùng `role="status"` đọc "N gợi ý" hoặc thông báo lỗi. Option chặn `mousedown` để input không mất focus trước khi click. | `frontend/src/components/pokemon/PokemonSearchBox.tsx:82-110, 129-176, 191-196` |
| 29 | Gõ nhanh rồi `Enter` có chọn nhầm kết quả của chữ cũ không? | Không. Có debounce 250 ms và cờ `settled` so chữ đã debounce với chữ đang gõ; chưa khớp thì `Enter` không chọn. Test gõ "ga" rồi gõ tiếp "rchomp" + `Enter` khẳng định không chọn Gastly. | `frontend/src/components/pokemon/PokemonSearchBox.tsx:22, 54, 97`; `PokemonSearchBox.test.tsx:55-75` |
| 30 | Responsive dựa trên những breakpoint nào, sao còn cần `useMediaQuery`? | Dùng breakpoint mặc định của Tailwind (`sm` 640, `md` 768, `lg` 1024, `xl` 1280) và một variant `short` cho màn hình thấp. Hầu hết bố cục đổi bằng CSS. `useMediaQuery` chỉ dùng ở Team Builder để khối đề xuất nằm đúng một chỗ trong DOM, giữ thứ tự đọc khớp thứ tự nhìn thấy. | `frontend/src/styles/index.css:4`; `frontend/src/lib/useMediaQuery.ts:4-25`; `frontend/src/pages/TeamBuilderPage.tsx:68, 240, 332, 367` |
| 31 | Vì sao `pokemonTypes.ts` viết đủ 18 chuỗi class thay vì ghép `bg-type-${type}`? | Tailwind sinh CSS bằng cách quét chuỗi trong mã nguồn lúc build. Chuỗi ghép động không xuất hiện nguyên văn nên class không được sinh. Map viết đầy đủ còn giữ một nguồn duy nhất cho màu hệ. | `frontend/src/lib/pokemonTypes.ts:24-66` |
| 32 | Token màu tổ chức thế nào, có dark mode không? | Token ngữ nghĩa khai báo ở `:root` và `.dark`, nối vào Tailwind qua `@theme inline` để class tự đổi theo theme. Dark mode mới có token, chưa có nút bật, là mức Could. Màu hệ, `scrim`, vỏ Pokédex cố định ở mọi theme. | `frontend/src/styles/index.css:15-67, 149`; `docs/design-system.md`, Phần 9 |
| 33 | Biểu đồ radar có truy cập được không, sao không dùng Recharts? | SVG có `role="img"` và `aria-label` liệt kê đủ 6 chỉ số mỗi series. Series thứ hai có nét đứt để không chỉ phân biệt bằng màu. Chỉ cần radar 6 trục nên tự vẽ, không thêm dependency. | `frontend/src/components/pokemon/StatRadar.tsx:91-99, 25-33`; `docs/architecture.md:65` |
| 34 | Test route làm sao chạy được khi trang là lazy? | `renderRoute.tsx` gọi trước mọi hàm `lazy` bằng top-level `await`, tạo bảng route "eager" rồi dùng `createMemoryRouter`. `stubFetch` thay `fetch` toàn cục để test không gọi mạng. `setup.ts` thêm `showModal` cho `<dialog>` vì jsdom thiếu. | `frontend/src/test/renderRoute.tsx:9-49`; `frontend/src/test/setup.ts:5-14` |
| 35 | Cấu hình TypeScript có gì đặc biệt? | Bật `strict` và `noUncheckedIndexedAccess`, nên mọi truy cập mảng phải xử lý `undefined`. `erasableSyntaxOnly` cấm enum và parameter property, vì vậy `ApiError` khai báo trường rõ ràng. `tsc -b` chạy trước `vite build`, lỗi kiểu là build dừng. | `frontend/tsconfig.app.json:16-21`; `frontend/src/lib/http.ts:11-23`; `frontend/package.json:11` |
| 36 | Chống XSS ở frontend thế nào? | React tự escape chuỗi khi render. ESLint báo lỗi nếu ai dùng `dangerouslySetInnerHTML`. Tên đội, biệt danh do người dùng nhập chỉ được render dạng text. | `frontend/eslint.config.js:24-30`; `docs/architecture.md:379` |
| 37 | Vì sao 4 Pokémon ở footer không đổi khi chuyển trang? | Footer nằm trong `AppLayout`, không bị mount lại khi đổi route, và danh sách được chọn trong `useState` khởi tạo lười. Chỉ khi tải lại trang mới chọn lại. Test giả `Math.random` đổi giá trị rồi chuyển trang để khẳng định. | `frontend/src/app/layout/Footer.tsx:59`; `Footer.test.tsx:96-113` |
| 38 | Muốn thêm một trang mới thì làm gì? | Tạo `pages/XPage.tsx` export component có tên, thêm một route `lazyPage(...)` trong mảng con của route bọc để tự có `errorElement` và layout. Nếu cần trên menu thì thêm vào `NAV_ITEMS`, Header và Footer tự hiện. Dùng `PageHero` để có đúng một `h1`, cập nhật bảng route ở `docs/architecture.md`. | `frontend/src/app/router.tsx:28-62`; `frontend/src/app/layout/navItems.ts:6-12` |
| 39 | Điểm yếu thật của phần nền tảng là gì? | `http.ts` ép kiểu JSON, không kiểm tra lúc chạy. `PokemonSprite` luôn `loading="lazy"`, kể cả artwork lớn đầu trang. `usePauseOffscreen` chỉ dừng CSS, interval đổi ảnh vẫn chạy khi hero khuất. `PokemonSearchBox` ở `components/` lại phụ thuộc `features/dex`. | `frontend/src/lib/http.ts:70`; `frontend/src/components/pokemon/PokemonSprite.tsx:37`; `frontend/src/components/scene/SceneBackdrop.tsx:78-79`; `frontend/src/components/pokemon/PokemonSearchBox.tsx:3-4` |
| 40 | Còn thiếu gì so với thiết kế? | Chưa có `Skeleton`, `Toast`, `Dialog`, `Card` dùng chung trong `components/ui`; chưa có nút dark mode; chưa có thẻ Open Graph. Một số file chưa có test riêng như `http.ts`, `queryClient.ts`. Repo chưa có `_headers` để đặt cache cho file tĩnh. | `docs/folder-structure.md:174`; `frontend/index.html`; danh sách file `frontend/public/` |

### V. Lệch giữa code và tài liệu

- **Test được tài liệu nhắc nhưng không tồn tại:** `docs/architecture.md:536` liệt kê unit test cho `TypeBadge`, `MultiplierCell`; `frontend/CLAUDE.md:18` có lệnh mẫu `npx vitest run src/components/pokemon/TypeBadge.test.tsx`. Không có `TypeBadge.test.tsx` hay test `MultiplierCell` trong `frontend/src/components/pokemon/`.
- **Cây thư mục đích chưa khớp code:** `docs/folder-structure.md:174` liệt kê `Card`, `Dialog`, `Skeleton`, `Toast` trong `components/ui`; dòng 148 có `public/og-image.png`; dòng 195 có `src/assets/logo.svg`. Cả 6 mục chưa có. Danh sách `pages/` ở dòng 160-161 thiếu `RouteErrorPage.tsx`. Dòng 197 mô tả `renderRoute.tsx` dùng "MemoryRouter", code dùng `createMemoryRouter` (`frontend/src/test/renderRoute.tsx:23`).
- **Logo:** `docs/assets.md:22` ghi logo ở `frontend/src/assets/logo.svg`; thư mục `src/assets` không tồn tại, logo ở Header là một `span` vẽ bằng CSS (`frontend/src/app/layout/Header.tsx:40-44`).
- **Cỡ sprite ở ô tìm kiếm:** `docs/assets.md:114` ghi 48 px; code dùng 40 px (`frontend/src/components/pokemon/PokemonSearchBox.tsx:177`).
- **Props của `PokemonSprite`:** `docs/design-system.md:402` ghi props `id`, `name` và "đứng trên đế bóng elip"; code dùng prop `alt`, không có `name`, và không tự vẽ đế (đế nằm trong `PokemonCard`) (`frontend/src/components/pokemon/PokemonSprite.tsx:5-11`).
- **`MultiplierCell` thiếu `title`:** `docs/design-system.md:400` yêu cầu `title` mô tả đầy đủ (ví dụ "Rock gây x4"); code không có (`frontend/src/components/pokemon/MultiplierCell.tsx:11-15`).
- **`DexNumber` "luôn 4 chữ số":** `docs/design-system.md:398`; code đệm tối thiểu 4 và hiện 5 chữ số với ID từ 10000 (`frontend/src/lib/formatters.ts:11-13`, `formatters.test.ts:21`). `docs/assets.md` cũng dùng ví dụ `10034`.
- **`ErrorState` có biến thể `inline`, `page`:** `docs/design-system.md:378`; code chỉ có một dạng (`frontend/src/components/ui/ErrorState.tsx:4-7`).
- **Lề trang mobile:** `docs/design-system.md:249` ghi 16 px; `PageHero` và `PageBody` dùng `px-3` (12 px) (`frontend/src/components/scene/PageHero.tsx:75, 96`). Header dùng `px-4` (16 px).
- **`fetchpriority` của ảnh khung cảnh:** `docs/design-system.md:358` ghi chỉ trang Tổng quan và Chi tiết đặt `high`, trang khác dùng `loading="lazy"` nếu dưới màn hình đầu; `PageHero` luôn truyền `priority` (`frontend/src/components/scene/PageHero.tsx:66`), nên mọi trang dùng `PageHero` đều `high`, và `SceneBackdrop` không bao giờ đặt `loading` (`frontend/src/components/scene/SceneBackdrop.tsx:143-154`).
- **Chiều cao Header:** sơ đồ `docs/design-system.md:490` ghi 60 px; code cao 56 px dưới `md`, 60 px từ `md` (`frontend/src/app/layout/Header.tsx:35`).
- **Recharts:** `CLAUDE.md:48` ở gốc liệt kê Recharts 3 trong stack frontend; `frontend/package.json` không có, `frontend/README.md` ghi "Không cài".
- **Script sprite bản PowerShell:** ADR 0005 Phần 4 (dòng 29) nhắc `download-sprites.sh` và `.ps1`; repo chỉ có bản `.sh` (`scripts/`), khớp `docs/folder-structure.md`, Phần 4. Đây là ghi chép lịch sử của ADR, không ảnh hưởng chạy.

**Ghi chú thêm: điều chưa xác định từ code (không phải lệch tài liệu)**

- Mã HTTP và header cache mà Cloudflare Pages trả cho `index.html`, `/sprites/**`, đường dẫn lạ: repo không có `_headers`, `_redirects`; hành vi do nền tảng quyết định.
- Số đo LCP, CLS, khung hình thực tế: chưa đo trong phạm vi tài liệu này. Kích thước bundle lấy từ `frontend/dist` có sẵn (build 17:27 ngày 2026-11-02), không chạy build mới.
- Endpoint nào trả 204 không có thân (ảnh hưởng `response.json()` trong `http.ts`): không thấy trong phạm vi frontend đã đọc.

---

## Phần 6. Frontend các trang tra cứu: Tổng quan, Pokédex, Chi tiết, So sánh, Bảng tương khắc, Địa hình, Thử tài Trainer

- Phạm vi: `frontend/src/features/{landing,dex,pokemon-detail,compare,typechart,speed,terrain,trainer}/**` (93 file, gồm test) và `frontend/src/pages/{LandingPage,DexPage,PokemonDetailPage,ComparePage,TypeChartPage,TerrainPage}.tsx` cùng 6 file `.test.tsx` (12 file). Tổng 105 file, đã đọc toàn bộ.
- Tài liệu đối chiếu: `docs/spec.md` 1.5, `docs/api.md` 0.8, `docs/architecture.md` 0.9, `docs/design-system.md`, `docs/folder-structure.md` 0.6. Khi lệch nhau, code là nguồn chuẩn; điểm lệch ghi ở Phần 5.
- Ngoài phạm vi chương (chỉ nhắc khi cần): `components/`, `lib/`, `app/`, Team Builder, Shared Team.

### I. Bức tranh chung

```mermaid
flowchart LR
  subgraph P["Trang (pages/)"]
    LP["LandingPage /"]
    DP["DexPage /pokedex"]
    PD["PokemonDetailPage /pokemon/:idOrName"]
    CP["ComparePage /compare"]
    TC["TypeChartPage /types"]
    TP["TerrainPage /terrain/:terrainId?"]
  end
  subgraph F["Feature (features/)"]
    FL["landing"]
    FD["dex"]
    FPD["pokemon-detail"]
    FS["speed"]
    FC["compare"]
    FT["typechart"]
    FTR["terrain"]
    FTN["trainer"]
  end
  subgraph A["REST API /api/v1"]
    A1["GET /pokemon"]
    A2["GET /pokemon/search"]
    A3["GET /pokemon/{idOrName}"]
    A4["GET /pokemon/{idOrName}/evolution"]
    A5["GET /pokemon/compare"]
    A6["GET /types/matrix"]
    A7["GET /pokemon/speed-tiers"]
    A8["GET /pokemon/generations"]
  end
  LS[("localStorage: pokenexus.trainer")]
  LP --> FL
  LP --> FT
  LP --> FPD
  LP --> FTN
  DP --> FD
  PD --> FPD
  PD --> FS
  FPD -.->|defenseSummary| FT
  CP --> FC
  CP --> FPD
  CP -.->|PokemonSearchBox| FD
  TC --> FT
  TP --> FTR
  TP --> FTN
  FL --> A8
  FL --> A3
  FD --> A1
  FD --> A2
  FPD --> A3
  FPD --> A4
  FS --> A7
  FS --> A3
  FC --> A5
  FT --> A6
  FTR --> A1
  FTN --> LS
```

| Trang | Route | Trạng thái trên URL | Request khi mở trang | Lưu cục bộ |
|---|---|---|---|---|
| Tổng quan | `/` | Không | `GET /pokemon/{id}` (hero), `GET /types/matrix`, `GET /pokemon/{id}` (hôm nay), `GET /pokemon/generations` | `pokenexus.trainer` |
| Pokédex | `/pokedex` | `type`, `gen`, `minBst`, `maxBst`, `minSpeed`, `form`, `sort`, `page`, `view` | `GET /pokemon?...&size=24` | Không |
| Chi tiết | `/pokemon/:idOrName` | Path param | `GET /pokemon/{idOrName}`, rồi `GET /pokemon/{id}/evolution`, `GET /pokemon/speed-tiers` | Không |
| So sánh | `/compare` | `left`, `right` | 2 lần `GET /pokemon/{key}` rồi `GET /pokemon/compare` | Không |
| Bảng tương khắc | `/types` | `def` (lặp, tối đa 2) | `GET /types/matrix` | Không |
| Địa hình | `/terrain/:terrainId?` | Path param | 1-2 lần `GET /pokemon?type=<hệ>&size=100&sort=id,asc` | `pokenexus.trainer` |

- **Route lazy:** mọi trang là một chunk riêng, nạp qua `lazyPage()` (`frontend/src/app/router.tsx:14-21`, `:33-60`). Route Địa hình có tham số tùy chọn `terrainId?` (`frontend/src/app/router.tsx:58`).
- **Page mỏng, logic thuần tách riêng:** page chỉ ghép hook và component. Thuật toán nằm trong file `.ts` thuần có unit test: `level50.ts`, `scale.ts`, `defense.ts`, `matrixFocus.ts`, `evolution.ts`, `quiz.ts`, `whosThat.ts`, `progress.ts`, `regions.ts`, `describeDefense.ts`, `emptyMessage.ts`.
- **URL là nơi giữ trạng thái chia sẻ được:** bộ lọc Pokédex, cặp so sánh, hệ phòng thủ. Trạng thái tạm (ô đang làm nổi bật trên ma trận, câu quiz đang làm, vùng đất ở hero, thế hệ đang chọn) nằm trong `useState`.
- **Server state đi qua TanStack Query:** mọi request dùng `getJson()` (`frontend/src/lib/http.ts:36-42`), lỗi HTTP thành `ApiError(status, code)` (`frontend/src/lib/http.ts:61-68`). Chính sách thử lại: 4xx không thử lại, lỗi khác thử lại 1 lần (`frontend/src/lib/queryClient.ts:5-8`).
- **Cache dùng chung giữa các trang:** key `['pokemon', 'detail', key]` (`frontend/src/features/pokemon-detail/hooks.ts:5-7`) được trang Chi tiết, So sánh, hero, Pokémon hôm nay, quiz, `TeamSpeedList` dùng chung; key `['types', 'matrix']` dùng chung cho Bảng tương khắc, Vòng tương khắc và quiz.
- **Tính toán ở client:** hệ số hệ kép, tóm tắt phòng thủ, tốc độ cấp 50, tỷ lệ tốc độ, thang biểu đồ so sánh, cây tiến hóa, câu đố, trò chơi đoán bóng. Backend chỉ trả dữ liệu thô; ngoại lệ là câu kết luận so sánh (`verdict.summary`) và hồ sơ thế hệ do backend tính.
- **Trạng thái bền duy nhất ở client:** tiến độ Trainer trong `localStorage` khóa `pokenexus.trainer` (`frontend/src/features/trainer/useTrainerProgress.ts:5`), đồng bộ giữa các tab qua sự kiện `storage`.
- **Phụ thuộc chéo feature:** `pokemon-detail` dùng `typechart/defense.ts` và `speed/`; `landing` dùng `typechart/hooks.ts`, `pokemon-detail/hooks.ts`, `trainer/`; `ComparePage` dùng `pokemon-detail/hooks.ts`; `frontend/src/components/pokemon/PokemonSearchBox.tsx:3-4` dùng `dex/api.ts` và `dex/hooks.ts`; `frontend/src/pages/TeamBuilderPage.tsx:25` dùng `speed/components/TeamSpeedList`; `frontend/src/app/layout/footerPokemon.ts:1` dùng `landing/generations.ts`.

### II. Từng file

#### I. Trang Tổng quan (`/`) và feature `landing`

**1. `LandingPage` (`frontend/src/pages/LandingPage.tsx`)**

- **Vai trò:** trang mở đầu, xếp 9 khối theo thứ tự cố định và tạm dừng animation của khối nằm ngoài màn hình.
- **Thành phần chính:** `LandingPage()` không props. Tạo `blocksRef` và gọi `usePauseOffscreen(blocksRef)` (dòng 15-16): hook này gắn thuộc tính `data-offscreen` cho khối con cách viewport hơn 200 px theo chiều dọc (`frontend/src/components/motion/usePauseOffscreen.ts:3-5`, `:14-22`), CSS dừng animation trong khối đó.
- **Cây component:** `LandingHero`, `TypeTicker`, `FeatureRegions`, `TypeWheel`, `DailyPokemon`, `TeamSteps`, `GenerationChart`, `TrainerQuiz`, `ClosingCta` (dòng 20-28). Lớp `overflow-x-clip` (dòng 19) chặn cuộn ngang do các khối xoay nghiêng.
- **Phụ thuộc:** 9 component của `features/landing/components`, `usePauseOffscreen`. Được nạp lazy ở route index (`frontend/src/app/router.tsx:32-35`).
- **Dữ liệu:** không có URL param. Request phát sinh từ các khối con: hero, Pokémon hôm nay (`GET /pokemon/{id}`), Vòng tương khắc và quiz (`GET /types/matrix`, một request dùng chung), biểu đồ thế hệ (`GET /pokemon/generations`). `Reveal` luôn render con (`frontend/src/components/motion/Reveal.tsx:38-47`), nên mọi request chạy ngay khi mở trang, không chờ cuộn tới.
- **Biên và lỗi:** mỗi khối có trạng thái lỗi riêng; khối tĩnh (TeamSteps, FeatureRegions, ClosingCta) luôn hiện.
- **Responsive:** do từng khối tự xử lý (xem các mục dưới).
- **Test:** `frontend/src/pages/LandingPage.test.tsx`, 9 case: một `h1` "PokeNexus" và 2 link hero (dòng 98-113); artwork nằm giữa tiêu đề và hộp thoại (115-128); chọn "Núi lửa" thì gọi `/pokemon/6` (130-147); 5 thẻ đảo dẫn đúng 5 route (149-157); Vòng tương khắc liệt kê hệ Fire gây x2 và đổi sang Electric (159-182); biểu đồ thế hệ và hồ sơ Kanto, Johto (184-214); quiz trả lời đúng, sai (216-259); API 503 thì từng khối báo lỗi riêng (261-277).

**2. `fetchGenerationProfiles`, `useGenerationProfiles`, `useQuizDetails` (`frontend/src/features/landing/api.ts`, `frontend/src/features/landing/hooks.ts`)**

- **Vai trò:** tầng dữ liệu của trang Tổng quan.
- **Thành phần chính:**
  - `fetchGenerationProfiles(signal?)` gọi `GET /pokemon/generations`, trả `GenerationProfile[]` (`api.ts` dòng 4-6).
  - `useGenerationProfiles()` dùng key `['pokemon', 'generations']`, `staleTime: Infinity` (`hooks.ts` dòng 10-16).
  - `useQuizDetails(ids)` dùng `useQueries`, mỗi ID một query với key `pokemonDetailKey(id)` và `staleTime: Infinity` (`hooks.ts` dòng 25-31). `combine` gộp thành `{ details: Map<id, PokemonDetail>, isError, errorCode, retry }` (dòng 32-45); `retry()` chỉ refetch query đang lỗi (dòng 42-44).
- **Phụ thuộc:** `getJson`, `ApiError`, `fetchPokemonDetail`, `pokemonDetailKey` của `pokemon-detail`. Dùng bởi `GenerationChart`, `TrainerQuiz`.
- **Dữ liệu:** endpoint `GET /api/v1/pokemon/generations` và `GET /api/v1/pokemon/{id}`. Key chi tiết dùng chung với trang Chi tiết khi cùng dạng khóa (số ID).
- **Biên và lỗi:** `errorCode` lấy mã của `ApiError` đầu tiên trong các query lỗi (dòng 39-41).
- **Test:** không có test riêng; được kiểm qua `LandingPage.test.tsx` (184-214, 216-259).

**3. `regions.ts` (`frontend/src/features/landing/regions.ts`)**

- **Vai trò:** chọn vùng đất cho hero và Pokémon hôm nay theo ngày.
- **Thành phần chính:**
  - `LANDING_REGIONS`: 13 cặp `{ scene, pokemonId }` (dòng 8-22), ví dụ `volcano` đi với Charizard (6), `haunted` với Gengar (94).
  - `dayNumber(date)`: số ngày kể từ 1970-01-01 theo ngày lịch địa phương (dòng 26-28).
  - `regionForDate(date)`: `LANDING_REGIONS[dayNumber % 13]` (dòng 30-33).
  - `SPECIES_COUNT = 1025` (dòng 35), `dailyPokemonId(date)` (dòng 37-39).
- **Công thức:**

```text
dayNumber(d)      = floor( Date.UTC(năm địa phương, tháng địa phương, ngày địa phương) / 86 400 000 )
regionForDate(d)  = LANDING_REGIONS[ dayNumber(d) mod 13 ]
dailyPokemonId(d) = ( (Math.imul(dayNumber(d), 2654435761) >>> 0) mod 1025 ) + 1
```

- **Giải thích:**
  - Lấy năm, tháng, ngày theo giờ máy người dùng rồi đưa vào `Date.UTC` để được mốc 00:00 UTC của ngày đó; chia cho số ms mỗi ngày ra số nguyên. Nhờ vậy giờ trong ngày và giờ mùa hè không làm lệch ngày.
  - `2654435761` là hằng số băm nhân (xấp xỉ 2^32 / tỉ lệ vàng). `Math.imul` nhân 32 bit, `>>> 0` đổi về số không dấu, nên hai ngày liền nhau cho ID cách xa nhau thay vì tăng dần.
  - Ví dụ tính tay: 2026-11-02 có `dayNumber = 20759`, `20759 mod 13 = 11`, hero mở ở `haunted` (Rừng đêm) với Gengar.
- **Phụ thuộc:** kiểu `SceneId`. Dùng bởi `LandingHero`, `DailyPokemon`, `GenerationChart` (lấy `SPECIES_COUNT`).
- **Biên và lỗi:** `?? LANDING_REGIONS[0]` phòng chỉ số lỗi (dòng 32). Kết quả luôn trong 1-1025.
- **Test:** `regions.test.ts`: đủ 13 scene, không có `stadium`, `lab` (dòng 6-12); cùng ngày cùng số dù khác giờ (14-17); đổi vùng theo ngày (19-24); ID trong 1-1025 suốt 400 ngày (26-34); hai ngày liền nhau khác Pokémon (36-38).

**4. `describeDefense` (`frontend/src/features/landing/describeDefense.ts`)**

- **Vai trò:** sinh một câu tiếng Việt mô tả phòng thủ cho khối Pokémon hôm nay.
- **Thành phần chính:** `describeDefense({ name, defense })` (dòng 11-30) chia 18 mục `defense` thành: x4 (`>= 4`), x2 (`> 1` và `< 4`), số hệ kháng (`> 0` và `< 1`), miễn nhiễm (`=== 0`). `listTypes` nối tên hệ kiểu "A, B và C" (dòng 5-9).
- **Kết quả mẫu:** "Charizard yếu x4 trước Rock, x2 trước Water và Electric, nhưng kháng 1 hệ và miễn nhiễm Ground."
- **Phụ thuộc:** `formatPokemonName`, `typeLabel`. Dùng bởi `DailyPokemon` (`frontend/src/features/landing/components/DailyPokemon.tsx:154`).
- **Biên và lỗi:** không có điểm yếu thì "không có điểm yếu nào"; không kháng thì "không kháng hệ nào".
- **Test:** `describeDefense.test.ts`: Lucario (dòng 12-30), x4 đứng trước x2 (32-37), không yếu không kháng (39-43).

**5. `quiz.ts` (`frontend/src/features/landing/quiz.ts`)**

- **Vai trò:** ngân hàng câu hỏi Thử tài Trainer và hàm chấm đáp án từ dữ liệu thật (không ghi cứng đáp án).
- **Thành phần chính:**
  - 6 loại câu (dòng 20-74): `multiplier`, `immunity`, `attacker` (cần ma trận hệ); `stat`, `typing`, `region` (cần chi tiết Pokémon).
  - `QUIZ_SETS`: 5 bộ `damage`, `weakness`, `stats`, `typing`, `region`, mỗi bộ 6 câu, mỗi câu 3 lựa chọn (dòng 103-365).
  - `BADGE_MIN_CORRECT = 5` (dòng 96); `quizBadgeId(setId) = "quiz:" + setId` (dòng 367-369); `QUIZ_BADGES` (dòng 371-374).
  - `detailIdsFor(question)`: câu `stat` cần chi tiết cả 3 Pokémon, `typing` và `region` cần chi tiết Pokémon chủ đề, câu về hệ trả `[]` (dòng 376-380).
  - `evaluateQuestion(question, { matrix, details })` (dòng 517-529) trả `EvaluatedQuestion { prompt, subject, options[], correctIndex, explanation }` hoặc `undefined` khi chưa đủ dữ liệu.
- **Thuật toán chấm:**

```text
multiplier : total = Π singleMultiplier(matrix, attacking, d) với d thuộc defending ; đúng khi option == total
immunity   : đúng khi singleMultiplier(matrix, attacking, option) == 0
attacker   : đúng khi Π singleMultiplier(matrix, option, d) == target
stat       : đúng khi giá trị chỉ số của option == max(giá trị của 3 option)
typing     : đúng khi tập hệ của option trùng tập detail.types (không xét thứ tự)
region     : đúng khi option == detail.generation
correctIndex = uniqueIndex(mảng đúng/sai)  -> chỉ số duy nhất đúng, hoặc -1 nếu 0 hoặc từ 2 option đúng
```

- **Giải thích:**
  - `uniqueIndex` (dòng 405-408) cố ý trả `-1` khi dữ liệu cho 0 hoặc nhiều đáp án đúng (ví dụ hòa chỉ số), để không bao giờ chấm sai một câu mập mờ thành đúng.
  - `sameTypes` (dòng 401-403) so độ dài và từng phần tử nên `['flying', 'water']` khớp lựa chọn "Water/Flying".
  - Lời giải thích tự sinh: `explainMultiplier` nêu hệ miễn nhiễm trước, nếu không thì nêu từng hệ số rồi tích (dòng 410-425); `explainImmunity` nêu hệ số của cả 3 lựa chọn (dòng 427-436).
- **Phụ thuộc:** `multiplierAgainst`, `singleMultiplier` (`frontend/src/lib/typeEffectiveness.ts:9-26`), `STAT_AXES`, `formatMultiplier`, `GENERATIONS`, kiểu `Badge`. Dùng bởi `TrainerQuiz`.
- **Biên và lỗi:** chưa có ma trận thì câu về hệ trả `undefined` (dòng 526); thiếu chi tiết bất kỳ option nào thì câu `stat` trả `undefined` (dòng 480-481).
- **Test:** `quiz.test.ts`: 5 bộ x 6 câu x 3 lựa chọn và 5 huy hiệu (dòng 68-87); 12 câu về hệ đều có đúng một đáp án trên ma trận thật, kèm danh sách đáp án (89-113); giải thích từng bước (115-125); ma trận trung tính làm câu miễn nhiễm thành `-1` (127-131); chờ dữ liệu (133-139); chọn chỉ số cao nhất và từ chối hòa (141-165); hệ không xét thứ tự và tên vùng (167-184).

**6. `LandingHero` (`frontend/src/features/landing/components/LandingHero.tsx`)**

- **Vai trò:** hero của trang Tổng quan: vỏ Pokédex đỏ, `h1` "PokeNexus", hộp thoại Giáo sư có 2 nút, Pokémon nổi bật và bộ chọn 13 vùng đất.
- **Thành phần chính:**
  - `LandingHero()`: state `region` khởi tạo bằng `regionForDate(new Date())`; `initialScene` chụp một lần (dòng 148-149) để lần render đầu không chạy hiệu ứng `iris`, chỉ chạy khi người dùng đổi vùng (dòng 177-179).
  - `FeaturedPokemon({ region })` (dòng 55-145): `usePokemonDetail(region.pokemonId)`; tên hiện "Đang tải", "Chưa tải được" hoặc tên Pokémon (dòng 57); có dữ liệu thì hiện thẻ Chiều cao, Cân nặng (dòng 88-101) và nhãn hệ; lỗi thì có nút "Thử lại" gọi `refetch` (dòng 118-126).
  - `StatCallout` (dòng 40-49) là `<dl>` nhỏ.
  - Nút "Mở Pokédex" (`/pokedex`) và "Xây đội ngay" (`/team-builder`) (dòng 223-234); 13 chip vùng đất `aria-pressed` gọi `setRegion` (dòng 244-269).
- **Phụ thuộc:** `usePokemonDetail`, `regions.ts`, `SceneBackdrop`, `SceneLabel`, `GameDialog`, `PokemonSprite`, `TypeBadge`, `formatHeight`, `formatWeight`.
- **Dữ liệu:** `GET /pokemon/{pokemonId}` (số ID), key `['pokemon', 'detail', '<id>']`.
- **Biên và lỗi:** đổi vùng giữa lúc tải không lỗi, query cũ vẫn ở cache. Vùng được chọn theo ngày khi mount, không tự đổi qua nửa đêm.
- **Responsive:** từ `lg` hero cao `100svh - 3.75rem` (dòng 154) và chia 2 cột (dòng 189); chip vùng đất cuộn ngang có snap (dòng 247); vòng màu hệ dưới chân artwork chỉ hiện từ `lg` (dòng 64).
- **Test:** `LandingPage.test.tsx` dòng 98-147 (một `h1`, thứ tự artwork, đổi vùng gọi `/pokemon/6`).

**7. `TypeWheel` (`frontend/src/features/landing/components/TypeWheel.tsx`)**

- **Vai trò:** khối "Vòng tương khắc": 18 hệ xếp trên vòng tròn, chọn một hệ tấn công để xem hệ nhận x2, x½, x0.
- **Thành phần chính:**
  - State `selected` mặc định `'fire'` (dòng 76); `useTypeMatrix()` (dòng 77); `attackProfile(matrix, selected)` chia hệ phòng thủ thành `superEffective`, `notVeryEffective`, `noEffect` (dòng 78; `frontend/src/lib/typeEffectiveness.ts:28-37`).
  - `chipPosition(index)` (dòng 22-28) và `connectorPath` (dòng 38-47), xem công thức dưới.
  - `badgeFor` gắn nhãn x2, x½, x0 lên chip hệ phòng thủ (dòng 30-36); chip không liên quan mờ 40% (dòng 210).
- **Công thức vị trí chip (đơn vị %):**

```text
angle(i) = (i * 360 / 18 - 90) độ, đổi sang radian
left(i)  = 50 + 42 * cos(angle)
top(i)   = 50 + 42 * sin(angle)
connector: "M nguồn Q 50 50 đích" cho mỗi hệ nhận x2 (đường cong Bézier bậc 2, điểm điều khiển ở tâm)
```

- **Phụ thuộc:** `useTypeMatrix`, `attackProfile`, `multiplierStyles`, `TypeBadge`, `TypeGlyph`, `ErrorState`.
- **Dữ liệu:** `GET /types/matrix`, key `['types', 'matrix']`.
- **Biên và lỗi:** lỗi thì `ErrorState` có "Thử lại" (dòng 137-138); chưa có dữ liệu thì "Đang tải bảng tương khắc..." (dòng 139-140). Thứ tự hệ trong danh sách x2 theo `matrix.types` của API, không theo `TYPE_NAMES` (khác với trang `/types`).
- **Responsive:** cột chữ và vòng xếp dọc, thành hàng từ `lg` (dòng 120); tên hệ dưới chip chỉ hiện từ `md` (dòng 241).
- **Test:** `LandingPage.test.tsx` dòng 159-182 (Fire gây x2 lên Grass, Ice, Bug, Steel; nhãn `aria-label` "Grass, nhận x2"; đổi sang Electric).

**8. `DailyPokemon` (`frontend/src/features/landing/components/DailyPokemon.tsx`)**

- **Vai trò:** khối "Pokémon hôm nay" dạng poster.
- **Thành phần chính:** props `date` mặc định `new Date()` (dòng 51). `id = dailyPokemonId(date)` (dòng 52), `usePokemonDetail(id)` (dòng 53); khung cảnh theo hệ `sceneForTypes(data.types)` hoặc `grassland` khi chưa có dữ liệu (dòng 54). Hiện số, tên (cỡ chữ theo từ dài nhất qua `NAME_SIZES`, dòng 28-46), hệ, BST, câu `describeDefense(data)` (dòng 154), link "Xem chi tiết" `/pokemon/{name}` và "Thêm vào đội" `/team-builder?add={id}` (dòng 156-167).
- **Phụ thuộc:** `regions.ts`, `describeDefense`, `usePokemonDetail`, `Reveal`, `SceneBackdrop`, `SceneLabel`.
- **Dữ liệu:** `GET /pokemon/{id}`; ngày hiển thị qua `Intl.DateTimeFormat('vi-VN')` (dòng 22-26) và thuộc tính `dateTime` ISO (dòng 57, 116).
- **Biên và lỗi:** lỗi thì `ErrorState` (dòng 122-128); đang tải thì câu chờ (dòng 129-130). `date` được tính mỗi lần render nên nếu trang re-render sau nửa đêm thì đổi Pokémon.
- **Responsive:** 1 cột, 2 cột từ `lg` (dòng 74); kích thước artwork đổi theo `md`, `lg`, `xl` (dòng 85).
- **Test:** không có test riêng; `LandingPage.test.tsx` dòng 261-277 kiểm trang vẫn dùng được khi API lỗi.

**9. `GenerationChart` (`frontend/src/features/landing/components/GenerationChart.tsx`)**

- **Vai trò:** biểu đồ cột số loài mới của 9 thế hệ và thẻ hồ sơ thế hệ đang chọn.
- **Thành phần chính:**
  - `useGenerationProfiles()` (dòng 22); state `selected` mặc định 1 (dòng 23); `byGeneration` là `Map` theo `generation` (dòng 24).
  - Tổng loài và chiều cao cột (dòng 26-27, 68), xem công thức dưới.
  - `GenerationProfileCard({ info, profile, pending })` (dòng 124-245): 3 số (loài mới, BST trung bình, "huyền thoại + thần thoại"), 3 starter tĩnh từ `GENERATIONS` (link `/pokemon/{id}`), 3 hệ phổ biến với thanh tỉ lệ (dòng 200), Pokémon mạnh nhất trừ huyền thoại (link `/pokemon/{strongest.id}`), nút `/pokedex?gen=n` (dòng 240).
- **Công thức:**

```text
total      = Σ speciesCount (khi chưa có dữ liệu: 1025)
max        = max(speciesCount..., 1)
chiều cao  = max(count / max * 100, 4) %   (chưa có số: 30 %, nền xám)
độ rộng thanh hệ phổ biến = count / topTypes[0].count * 100 %
```

- **Phụ thuộc:** `useGenerationProfiles`, `GENERATIONS` (vùng, năm, starter, màu cột), `SPECIES_COUNT`, `Reveal`, `PokemonSprite`, `TypeBadge`.
- **Dữ liệu:** `GET /pokemon/generations`, key `['pokemon', 'generations']`, `staleTime: Infinity`.
- **Biên và lỗi:** lỗi thì toàn khung thay bằng `ErrorState` (dòng 57-61); đang tải thì số cột là "...", thẻ hồ sơ có skeleton. Thanh hệ phổ biến giả định `topTypes` xếp giảm dần (api.md nói "3 hệ xuất hiện nhiều nhất"); nếu không, thanh có thể vượt 100% nhưng bị `overflow-hidden` cắt.
- **Responsive:** danh sách cột có `min-w-190` và cuộn ngang trên màn hẹp (dòng 64-65); từ `lg` cột và thẻ hồ sơ nằm cạnh nhau (dòng 63).
- **Test:** `LandingPage.test.tsx` dòng 184-214 (tiêu đề "1.025 loài qua 9 thế hệ", 9 nút cột, hồ sơ Kanto "4 + 1", Johto "425,8", link `/pokedex?gen=2`).

**10. `TrainerQuiz` (`frontend/src/features/landing/components/TrainerQuiz.tsx`)**

- **Vai trò:** khối "Thử tài Trainer": chọn bộ câu hỏi, trả lời, chấm điểm, phát Ball và huy hiệu, hiện Thẻ Trainer.
- **Thành phần chính:**
  - State `QuizState { setIndex, index, picked, correct, answered, streak, earned, finished, prize, badgeEarned }` (dòng 46-72).
  - `useTrainerProgress()` (dòng 84); `useTypeMatrix()` (dòng 89); `useQuizDetails(detailIdsFor(question))` (dòng 90); `evaluateQuestion(...)` (dòng 91-94).
  - `needsMatrix = detailIdsFor(question).length === 0` chọn nguồn lỗi cần hiển thị (dòng 95-101).
  - `pick(option)` (dòng 107-121): bỏ qua nếu đã chọn hoặc chưa chấm được; `streak = đúng ? streak + 1 : 0`; `gained = pointsForAnswer(đúng, streak)`; cập nhật state cục bộ và gọi `update(recordAnswer(current, gained, streak))` để ghi tiến độ.
  - `next()` (dòng 123-135): chưa tới câu cuối thì sang câu sau; câu cuối thì `prize = prizeFor(correct, 6)`, `badgeEarned = correct >= 5`, cộng Ball và huy hiệu `quiz:<id>` vào tiến độ, đánh dấu `finished`.
  - `chooseSet(i)` reset state cục bộ về `initialState(i)` (dòng 103-105); nút "Làm lại bộ này" và "Bộ tiếp theo" (`(i + 1) % 5`) (dòng 259-272).
  - `optionClassName` (dòng 74-80) tô xanh đáp án đúng, đỏ lựa chọn sai, mờ 45% còn lại; dùng modifier `!` của Tailwind 4 để thắng lớp nền của biến thể `secondary`.
- **Phụ thuộc:** `quiz.ts`, `trainer/progress.ts`, `useTrainerProgress`, `useTypeMatrix`, `useQuizDetails`, `TrainerCard`, `BallIcon`, `GameDialog`, `ErrorState`.
- **Dữ liệu:** `GET /types/matrix` cho câu về hệ; `GET /pokemon/{id}` cho câu chỉ số, hệ, vùng; ghi `localStorage` khóa `pokenexus.trainer`.
- **Biên và lỗi:** lỗi API thì `ErrorState` với nút thử lại đúng nguồn (dòng 223-230); chưa đủ dữ liệu thì "Đang chuẩn bị câu hỏi..." (dòng 275-276); nút "Câu tiếp" bị khóa tới khi chọn (dòng 340). Nếu `correctIndex = -1` thì mọi lựa chọn bị chấm sai và không có ô xanh.
- **Responsive:** 3 đáp án xếp dọc, 3 cột từ `sm` (dòng 283); quả cầu hệ trang trí chỉ hiện từ `md` (dòng 149); bố cục ngang từ `lg` (dòng 160).
- **Test:** `LandingPage.test.tsx` dòng 216-240 (đúng: ô `bg-success!`, có dấu tick, giải thích, "Đúng 1 trên 1", sang "Câu 2/6") và 242-259 (sai: ô `bg-danger!`, đáp án đúng vẫn xanh).

**11. Component tĩnh và dữ liệu tĩnh của Tổng quan**

| File | Export | Dùng bởi | Ghi chú |
|---|---|---|---|
| `frontend/src/features/landing/generations.ts` | `GENERATIONS` (9 thế hệ: vùng, năm, lớp màu cột, 3 starter), `StarterInfo`, `GenerationInfo` | `GenerationChart`, `quiz.ts` (`regionLabel`), `frontend/src/app/layout/footerPokemon.ts` | Dữ liệu tĩnh; số liệu động lấy từ API |
| `frontend/src/features/landing/components/FeatureRegions.tsx` | `FeatureRegions` | `LandingPage` | 5 thẻ đảo dẫn tới `/pokedex`, `/types`, `/compare`, `/team-builder`, `/terrain` (dòng 29-96); hình xem trước tĩnh (`MINI_MATRIX` 6x6, dòng 103-106); lưới 1, 2 (`sm`), 5 cột (`xl`) (dòng 364). Test: `frontend/src/pages/LandingPage.test.tsx:149-157` |
| `frontend/src/features/landing/components/TypeTicker.tsx` | `TypeTicker` | `LandingPage` | Dải 18 nhãn hệ chạy ngang; render 2 danh sách để cuộn liền, danh sách thứ hai `aria-hidden` và ẩn khi giảm chuyển động (dòng 14, 35-36) |
| `frontend/src/features/landing/components/TeamSteps.tsx` | `TeamSteps` | `LandingPage` | 3 bước xây đội với minh họa tĩnh (`SAMPLE_TEAM`, `SAMPLE_HEATMAP`, dòng 19-25); link `/team-builder` |
| `frontend/src/features/landing/components/ClosingCta.tsx` | `ClosingCta` | `LandingPage` | Tiêu đề, một câu, 2 nút như hero |
| `frontend/src/features/landing/components/SectionTitle.tsx` | `SectionTitle` | Các khối Tổng quan | `<h2>` font display, `tone` sáng hoặc tối |
| `frontend/src/features/landing/components/SectionDecor.tsx` | `Aura`, `Blob`, `Cloud`, `Spark`, `Wave` | Các khối Tổng quan | Lớp trang trí `aria-hidden`; `Cloud` ẩn khi giảm chuyển động (dòng 49) |

#### II. Pokédex (`/pokedex`) và feature `dex`

**1. `DexPage` (`frontend/src/pages/DexPage.tsx`)**

- **Vai trò:** trang Omni-Dex: lọc, sắp xếp, phân trang, đổi kiểu xem, tìm theo tên.
- **Thành phần chính:**
  - `useDexSearchParams()` lấy `filter`, `view` và các hàm ghi URL (dòng 32-33); `usePokemonList(filter)` (dòng 34); state `filtersOpen` cho ngăn kéo (dòng 35).
  - `openPokemon` điều hướng `/pokemon/{name}` khi chọn trong ô tìm (dòng 38).
  - `countLabel` (dòng 40-46): có bộ lọc thì "N Pokémon khớp bộ lọc"; không thì "Hiển thị a–b trong N Pokémon" với `a = page * size + 1`, `b = page * size + content.length`. Ví dụ trang 2 không lọc: "Hiển thị 25–48 trong 1.083 Pokémon".
- **Cây component:** `PageHero` (grassland) → `PageBody` gồm `aside` (ô tìm, nút "Xóa bộ lọc (n)", `DexFilters`) và `section` kết quả (tiêu đề `aria-live`, `ViewToggle`, `DexToolbar` có ô tìm thứ hai, lưới hoặc danh sách, `Pagination`); ngoài cùng là `FilterSheet` chứa `DexFilters layout="sheet"` (dòng 94-193).
- **Phụ thuộc:** `useDexSearchParams`, `usePokemonList`, `emptyResultMessage`, `PokemonSearchBox`, `PageHero`, `EmptyState`, `ErrorState`, `Pagination`, `errorMessageFor`.
- **Dữ liệu:** URL `type` (lặp), `gen`, `minBst`, `maxBst`, `minSpeed`, `form` (lặp), `sort`, `page` (đếm từ 1), `view`. Request `GET /pokemon?type&gen&minBst&maxBst&minSpeed&form&sort&page&size=24`, key `['pokemon', 'list', filter]`. `view` không nằm trong `filter` nên đổi kiểu xem không gọi lại API.
- **Trạng thái:** lỗi trước, rồi tải lần đầu, rồi rỗng, rồi có dữ liệu (dòng 141-166):
  - Lỗi: `ErrorState` với thông điệp theo `code`, nút "Thử lại" gọi `refetch`.
  - Tải lần đầu: `PokemonGridSkeleton` (12 ô).
  - Rỗng: `EmptyState` + `emptyResultMessage(filter)` + nút "Xóa bộ lọc".
  - Tải lại khi đổi bộ lọc: giữ dữ liệu cũ (`keepPreviousData`), mờ 60% và `aria-busy` (dòng 155-158).
- **Responsive:** từ `lg` có cột lọc trái 256 px (`hidden ... lg:flex lg:w-64`, dòng 112); dưới `lg` dùng nút "Bộ lọc (n)" mở `FilterSheet`. Tiêu đề đầy đủ chỉ cho trình đọc màn hình dưới `lg` (`max-lg:sr-only`, dòng 62), thay bằng dòng gọn "N Pokémon · Trang x/y" (dòng 66-69). Dòng kết quả (`countRow`, dòng 57-72) và thẻ công cụ (`toolbar`, dòng 74-90) được đặt vào DOM theo `useMediaQuery(LG_MEDIA_QUERY)` (dòng 36, 138): dưới `lg` thẻ công cụ đứng trước để thứ tự `Tab` khớp thứ tự nhìn (PR #76). Có 2 ô tìm, mỗi ô chỉ hiện ở một breakpoint.
- **Test:** `frontend/src/pages/DexPage.test.tsx`, 12 case: thẻ có sprite, số, hệ, BST, link (dòng 57-76); URL được gửi sang API, `page=2` trên URL thành `page=1` khi gọi API (78-103); bấm chip hệ thì về trang đầu (105-118); đủ 2 hệ thì khóa chip khác (120-130); BST áp dụng khi rời ô và từ chối khoảng ngược (132-146); đổi sang danh sách không gọi lại API (148-162); dưới `lg` nút "Bộ lọc" đứng trước nhóm "Kiểu hiển thị" trong DOM (164-176); từ `lg` nhóm "Kiểu hiển thị" đứng trước ô "Sắp xếp" (178-190); ngăn kéo mở, đóng (192-206); rỗng và xóa bộ lọc giữ `view=list` (208-221); chọn trong ô tìm mở trang chi tiết (223-243); lỗi 503 hiện câu tiếng Việt, không hiện `detail` (245-254).

**2. `useDexSearchParams` và các hàm parse (`frontend/src/features/dex/useDexSearchParams.ts`)**

- **Vai trò:** chuyển qua lại giữa query string và đối tượng `DexFilter`, là nguồn duy nhất của trạng thái lọc.
- **Thành phần chính:**
  - Hằng: `FORM_CATEGORIES` (dòng 7-13), `SORT_OPTIONS` 4 giá trị (dòng 14), `DEX_VIEWS` (dòng 15), `MAX_GENERATION = 9`, `MAX_BST = 1530` (= 6 x 255), `MAX_SPEED = 255` (dòng 16-18).
  - `parseDexFilter(params)` (dòng 54-72): `type` lọc theo `isTypeName`, bỏ trùng, lấy tối đa 2; `gen` 1-9; `minBst`, `maxBst` trong 0-1530 và bị bỏ cả hai nếu `minBst > maxBst` (dòng 59); `minSpeed` 0-255; `form` hợp lệ, bỏ trùng; `sort` ngoài whitelist thành `id,asc`; `page` trên URL đếm từ 1, bên trong đếm từ 0 (dòng 70).
  - `parseDexView` chỉ nhận `list`, còn lại là `cards` (dòng 74-76).
  - `toSearchParams(filter, view)` (dòng 78-90) bỏ mọi giá trị mặc định để URL sạch; ghi `page + 1` khi khác 0.
  - `countActiveFilters` (dòng 92-100): mỗi hệ tính 1, thế hệ 1, khoảng BST 1, tốc độ 1, dạng 1 (dù chọn bao nhiêu dạng).
  - Hook `useDexSearchParams()` (dòng 102-155) trả `{ filter, view, updateFilter, setPage, setView, clearFilter, activeCount }`.
- **Cơ chế ghi URL:**
  - `latestRef` giữ query string mới nhất (dòng 106-110). `write(build)` dựng URL mới từ `latestRef.current`, cập nhật ref ngay, rồi gọi `setSearchParams(next, { preventScrollReset: true })` (dòng 112-120).
  - Lý do: hai lần ghi liên tiếp trước khi React render lại (ví dụ rời ô BST rồi bấm chip hệ) vẫn giữ cả hai thay đổi.
  - Không truyền `replace`, nên mỗi lần đổi bộ lọc là một mục lịch sử mới; nút Back hoàn tác bộ lọc. `preventScrollReset` giữ vị trí cuộn.
  - `updateFilter` luôn đưa `page` về 0 (dòng 122-128); `setPage` giữ bộ lọc (129-133); `setView` giữ bộ lọc và trang (134-137); `clearFilter` giữ `view` (138-144).
- **Phụ thuộc:** `useSearchParams` của React Router, `isTypeName`. Dùng bởi `DexPage`, `DexFilters`, `StatRangeFields`, `DexToolbar`, `ViewToggle`, `emptyMessage.ts`, `dex/api.ts`.
- **Biên và lỗi:** giá trị lạ bị bỏ qua thay vì báo lỗi, nên link hỏng vẫn mở được trang. `type` phân biệt hoa thường ("FIRE" bị bỏ), khác `def` ở trang `/types` (có chuẩn hóa chữ thường).
- **Test:** `useDexSearchParams.test.ts`: đọc đủ tham số (dòng 15-32); bỏ giá trị lạ, trùng, vượt giới hạn (34-51); bỏ khoảng BST ngược (53-58); nhận 0 (60-65); `view` (69-73); URL mặc định rỗng và round-trip (77-87); đếm bộ lọc (91-100); hai lần ghi trước một lần render (110-120).

**3. `fetchPokemonList`, `searchPokemon` (`frontend/src/features/dex/api.ts`)**

- **Vai trò:** gọi 2 endpoint của Omni-Dex.
- **Thành phần chính:**
  - `DEX_PAGE_SIZE = 24` (dòng 5).
  - `fetchPokemonList(filter, signal?)` gửi `type`, `gen`, `minBst`, `maxBst`, `minSpeed`, `form`, `sort`, `page`, `size` (dòng 7-26); `buildUrl` bỏ giá trị `undefined` và lặp khóa cho mảng (`frontend/src/lib/http.ts:25-34`).
  - `SEARCH_MIN_LENGTH = 2`, `SEARCH_MAX_LENGTH = 30`, `SEARCH_LIMIT = 8` (dòng 28-30).
  - `searchPokemon(query, signal?)` gọi `GET /pokemon/search?q=<trim>&limit=8` (dòng 32-34).
- **Phụ thuộc:** `getJson`, kiểu `DexFilter`. Dùng bởi `dex/hooks.ts`; hằng số tìm kiếm còn được `frontend/src/components/pokemon/PokemonSearchBox.tsx:3` dùng.
- **Dữ liệu:** `page` gửi API đếm từ 0, khớp `docs/api.md` Phần 1. Giới hạn 2-30 ký tự khớp ràng buộc `q` ở `docs/api.md` Phần 2, mục V.
- **Biên và lỗi:** URLSearchParams mã hóa dấu phẩy của `sort` thành `%2C`.
- **Test:** gián tiếp qua `DexPage.test.tsx` dòng 62-87, 179-199.

**4. `usePokemonList`, `usePokemonSearch` (`frontend/src/features/dex/hooks.ts`)**

- **Vai trò:** bọc 2 hàm API bằng TanStack Query.
- **Thành phần chính:**
  - `usePokemonList(filter)`: key `['pokemon', 'list', filter]`, `staleTime` 5 phút, `placeholderData: keepPreviousData` (dòng 8-15).
  - `usePokemonSearch(query)`: chuẩn hóa `trim().toLowerCase()`, key `['pokemon', 'search', trimmed]`, chỉ chạy khi độ dài 2-30 (dòng 17-25), `staleTime` 5 phút.
- **Phụ thuộc:** `dex/api.ts`. Dùng bởi `DexPage` và `PokemonSearchBox` (Pokédex, So sánh, Team Builder).
- **Dữ liệu:** key danh sách là cả đối tượng `filter`; TanStack Query băm key theo nội dung nên cùng bộ lọc thì trúng cache.
- **Biên và lỗi:** `PokemonSearchBox` thêm debounce 250 ms (`frontend/src/components/pokemon/PokemonSearchBox.tsx:22`, `:50`), `maxLength = 30` trên ô nhập (`:135`) và chỉ cho Enter chọn khi kết quả khớp chữ đang gõ (`settled`, `:54`, `:97`).
- **Test:** gián tiếp qua `DexPage.test.tsx`.

**5. `emptyResultMessage` (`frontend/src/features/dex/emptyMessage.ts`)**

- **Vai trò:** viết câu giải thích vì sao bộ lọc ra 0 kết quả.
- **Thành phần chính:** ghép các phần "hệ A + B", "thuộc Thế hệ n", phần BST (`bstPart`, dòng 4-9), "có Tốc độ từ n trở lên"; gợi ý nới khoảng BST nếu có lọc BST (dòng 19-22); không có phần nào thì chỉ trả gợi ý (dòng 24).
- **Phụ thuộc:** `typeLabel`, `DexFilter`. Dùng bởi `DexPage` (dòng 141).
- **Biên và lỗi:** chỉ lọc dạng thì câu ngắn "Thử bỏ bớt một điều kiện.".
- **Test:** `emptyMessage.test.ts` dòng 11-31 (4 case).

**6. `DexFilters` (`frontend/src/features/dex/components/DexFilters.tsx`)**

- **Vai trò:** form lọc dùng chung cho cột lọc và ngăn kéo.
- **Thành phần chính:** props `filter`, `onChange(change)`, `layout` (`sidebar` 2 cột chip, `sheet` 3 cột chip). Chip hệ: thêm vào cuối rồi `slice(0, 2)`, bấm lại để bỏ (dòng 37-42), khóa chip chưa chọn khi đủ 2 (dòng 69). Chip thế hệ chọn một, bấm lại để bỏ (dòng 97). Chip dạng bật tắt nhiều giá trị (dòng 44-49). `StatRangeFields` cho BST, tốc độ (dòng 107-112). Mọi chip có `aria-pressed`.
- **Phụ thuộc:** `useDexSearchParams` (hằng, kiểu), `StatRangeFields`, `pokemonTypes`. Dùng bởi `DexPage` (2 chỗ).
- **Dữ liệu:** mọi thay đổi gọi `updateFilter` nên ghi lên URL ngay.
- **Biên và lỗi:** form chặn submit (dòng 55). Không chọn dạng nào thì backend mặc định `DEFAULT` và `REGIONAL` (nhãn ở dòng 116).
- **Test:** `DexPage.test.tsx` dòng 89-114.

**7. `StatRangeFields` (`frontend/src/features/dex/components/StatRangeFields.tsx`)**

- **Vai trò:** 3 ô số "Từ", "Đến" (BST) và "Tốc độ tối thiểu", có kiểm tra hợp lệ.
- **Thành phần chính:**
  - Giữ bản nháp dạng chuỗi (`draft`). Khi giá trị từ URL đổi, so chuỗi `source` với `syncedSource` ngay trong lúc render rồi đặt lại nháp và xóa lỗi (dòng 42-53); đây là mẫu "điều chỉnh state khi props đổi" mà không cần `useEffect`.
  - `parseValue` trả `undefined` (ô trống), `null` (sai định dạng hoặc vượt trần) hoặc số (dòng 28-34).
  - `commit()` (dòng 55-72): báo lỗi "BST là số nguyên từ 0 đến 1530." hoặc "Giá trị "Từ" phải nhỏ hơn hoặc bằng "Đến"."; lỗi thì không ghi URL; không đổi gì thì không ghi.
  - Áp dụng khi rời ô (`onBlur`, dòng 89) hoặc Enter (dòng 74-79).
  - Thanh minh họa khoảng BST trên thang 180-720 (dòng 14-15, 36-38, 130-138).
- **Phụ thuộc:** `MAX_BST`, `MAX_SPEED`. Dùng bởi `DexFilters`.
- **Biên và lỗi:** ô lỗi có `aria-invalid` và `aria-describedby` trỏ tới dòng lỗi (dòng 110-111, 153-154).
- **Test:** `DexPage.test.tsx` dòng 116-130.

**8. `DexToolbar`, `FilterSheet` (`frontend/src/features/dex/components/DexToolbar.tsx`, `frontend/src/features/dex/components/FilterSheet.tsx`)**

- **Vai trò:** thanh công cụ (nút mở bộ lọc, ô sắp xếp, ô tìm dưới `lg`) và ngăn kéo bộ lọc trên mobile.
- **Thành phần chính:**
  - `DexToolbar`: nhãn sắp xếp tiếng Việt (`DexToolbar.tsx` dòng 13-18); nút "Bộ lọc (n)" chỉ hiện dưới `lg` (dòng 33-50); `<select>` gọi `onSortChange` (dòng 59-70); thẻ không tự đổi vị trí bằng CSS `order`; `DexPage` đặt nó trước dòng kết quả trong DOM khi dưới `lg` (PR #76).
  - `FilterSheet`: `<dialog>` gốc của trình duyệt; `useEffect` gọi `showModal()` hoặc `close()` theo `open` (`FilterSheet.tsx` dòng 14-19); bấm vào nền (target là chính dialog) thì đóng (dòng 26-28); Esc đóng qua sự kiện `close` (dòng 25); chỉ render nội dung khi mở (dòng 56); ẩn từ `lg` (dòng 29).
- **Phụ thuộc:** `SORT_OPTIONS`. Dùng bởi `DexPage`.
- **Biên và lỗi:** nút "Xem N kết quả" chỉ đóng ngăn kéo vì bộ lọc đã áp dụng ngay khi bấm chip.
- **Test:** `DexPage.test.tsx` dòng 148-162.

**9. Component hiển thị kết quả**

| File | Export | Dùng bởi | Ghi chú |
|---|---|---|---|
| `frontend/src/features/dex/components/PokemonGrid.tsx` | `PokemonGrid`, `PokemonGridSkeleton` | `DexPage` | 2 cột, từ `sm` là `repeat(auto-fill, minmax(196px, 1fr))` (dòng 9-10); thẻ vào lần lượt 30 ms (dòng 20); skeleton 12 ô (dòng 11) |
| `frontend/src/features/dex/components/PokemonList.tsx` | `PokemonList` | `DexPage` | Mỗi hàng là link `/pokemon/{name}` có sprite, số, tên, hệ, BST (dòng 22-39) |
| `frontend/src/features/dex/components/ViewToggle.tsx` | `ViewToggle` | `DexPage` | 2 nút icon "Thẻ màu", "Danh sách" có `aria-pressed` (dòng 8-15, 27-34). Test: `frontend/src/pages/DexPage.test.tsx:148-162` |

#### III. Chi tiết Pokémon (`/pokemon/:idOrName`) và feature `pokemon-detail`

**1. `PokemonDetailPage` (`frontend/src/pages/PokemonDetailPage.tsx`)**

- **Vai trò:** trang chi tiết một Pokémon theo ID hoặc tên.
- **Thành phần chính:**
  - `useParams()` lấy `idOrName` (dòng 26); `usePokemonDetail(idOrName)` (dòng 27).
  - `isNotFound(error)`: `ApiError` có `status 404` hoặc `code` thuộc `POKEMON_NOT_FOUND`, `INVALID_PARAMETER` (dòng 19-23).
  - Thứ tự: lỗi "không tìm thấy" → `PokemonNotFound`; lỗi khác → `DetailError` có "Thử lại"; đang tải → `DetailSkeleton`; có dữ liệu → `PokemonDetailView` (dòng 29-39).
  - `PokemonDetailView` (dòng 42-64) nhuộm trang theo khung cảnh của hệ (`sceneTintStyle(sceneForTypes(detail.types))`, dòng 45-46).
- **Cây component:** `PokemonHero` (con: `StatPanel` chứa `SpeedBenchmark`; `below`: `EvolutionChain`, `FormSwitcher` khi có hơn 1 dạng) rồi `DefenseGrid` (dòng 48-61).
- **Phụ thuộc:** feature `pokemon-detail`, `speed` (qua `StatPanel`), `typechart/defense.ts` (qua `DefenseGrid`), `frontend/src/lib/scenes.ts`.
- **Dữ liệu:** `GET /pokemon/{idOrName}` key `['pokemon', 'detail', idOrName chữ thường]`; sau khi có `detail`, `EvolutionChain` gọi `GET /pokemon/{detail.id}/evolution` và `SpeedBenchmark` gọi `GET /pokemon/speed-tiers`.
- **Biên và lỗi:** tên 400 `INVALID_PARAMETER` (sai định dạng) cũng hiện trang "không tìm thấy"; tên trùng đường dẫn API bị chặn ở client (mục 2).
- **Responsive:** biến `--hero-overlap` 17.5rem, từ `lg` 34rem (dòng 45); bố cục 2 cột từ `lg` do `PokemonHero` xử lý.
- **Test:** `frontend/src/pages/PokemonDetailPage.test.tsx`, 10 case: Charizard đủ chỉ số, thông tin, lưới 18 ô và câu tóm tắt (dòng 124-202); tốc độ cấp 50 94, 120, 167 và "Nhanh hơn 33%" (204-225); cây tiến hóa, "Lv 16", "Lv 36", `aria-current` và các dạng (227-255); skeleton giữ chỗ (257-276); thứ tự đọc (278-300); evolution lỗi thì ẩn khối, không có `alert` (302-317); tên lạ hiện trang không tìm thấy (319-339); `/pokemon/generations` và `/pokemon/speed-tiers` không gọi API (341-356); lỗi 500 (358-371).

**2. `fetchPokemonDetail`, `fetchEvolution` và đường dẫn dành riêng (`frontend/src/features/pokemon-detail/api.ts`)**

- **Vai trò:** gọi chi tiết và chuỗi tiến hóa, chặn tên trùng đường dẫn cố định của API.
- **Thành phần chính:**
  - `RESERVED_POKEMON_PATHS = { search, compare, speed-tiers, generations }` (dòng 4-9).
  - `pokemonPath(idOrName)` (dòng 11-17): nếu tên (chữ thường) nằm trong tập trên thì ném `new ApiError(404, 'POKEMON_NOT_FOUND')` mà không gọi mạng; ngược lại trả `/pokemon/` + `encodeURIComponent(key)`.
  - `fetchPokemonDetail` (dòng 19-24), `fetchEvolution` → `/pokemon/{key}/evolution` (dòng 26-31).
- **Lý do:** backend ưu tiên đường dẫn cố định hơn mẫu `/pokemon/{idOrName}` (`docs/api.md` Phần 2, mục I). Nếu không chặn, URL `/pokemon/generations` sẽ nhận về mảng hồ sơ thế hệ, trang chi tiết đọc sai kiểu và crash.
- **Phụ thuộc:** `getJson`, `ApiError`. Dùng bởi `pokemon-detail/hooks.ts`, `landing/hooks.ts`.
- **Biên và lỗi:** `encodeURIComponent` chặn ký tự lạ làm hỏng đường dẫn.
- **Test:** `PokemonDetailPage.test.tsx` dòng 341-356.

**3. `pokemonDetailKey`, `usePokemonDetail`, `useEvolution`, `usePokemonDetails` (`frontend/src/features/pokemon-detail/hooks.ts`)**

- **Vai trò:** hook dữ liệu chi tiết, dùng ở nhiều trang.
- **Thành phần chính:**
  - `pokemonDetailKey(x) = ['pokemon', 'detail', String(x).toLowerCase()]` (dòng 5-7). Đoạn `detail` tránh trùng key `['pokemon', 'generations']`, `['pokemon', 'speed-tiers']`.
  - `usePokemonDetail(idOrName | undefined)`: `enabled` khi khóa khác rỗng, `staleTime: Infinity` (dòng 9-17).
  - `useEvolution`: key `['pokemon', 'evolution', key]`, `staleTime: Infinity` (dòng 19-27).
  - `usePokemonDetails(ids)`: `useQueries` nhiều ID, trả mảng kết quả (dòng 29-37).
- **Phụ thuộc:** `api.ts`. Dùng bởi `PokemonDetailPage`, `ComparePage`, `LandingHero`, `DailyPokemon`, `EvolutionChain`, `TeamSpeedList`, `landing/hooks.ts`.
- **Biên và lỗi:** khóa theo chuỗi người dùng gõ, nên `'garchomp'` và `'445'` là hai mục cache khác nhau cho cùng một Pokémon.
- **Test:** gián tiếp qua các test trang.

**4. `evolution.ts` (`frontend/src/features/pokemon-detail/evolution.ts`)**

- **Vai trò:** dựng cây tiến hóa từ danh sách phẳng và tạo nhãn điều kiện.
- **Thành phần chính:**
  - `buildEvolutionTree(stages)` (dòng 55-84), xem thuật toán dưới.
  - `evolutionStepLabel(stage)` (dòng 36-42): loài gốc → `null`; có `minLevel` → "Lv n"; có `item` → "Dùng <Tên vật phẩm>"; không có `trigger` → `null`; còn lại tra `TRIGGER_LABELS` 17 mục (dòng 12-30) hoặc "Điều kiện đặc biệt".
  - `evolutionMethod(stage)` chọn icon `level`, `item`, `trade`, `special` (dòng 44-49).
  - `stageLabel(depth)`: "Cơ bản", "Giai đoạn 1", "Giai đoạn 2", sâu hơn là "Giai đoạn n" (dòng 51-53).
  - `treeSummary(roots)`: "k giai đoạn" với k = độ sâu lớn nhất + 1, thêm ", n nhánh tiến hóa" nếu số lá > 1 (dòng 86-97).
- **Thuật toán dựng cây:**

```text
1. speciesIds = tập speciesId có trong danh sách
2. childrenOf[p] = các stage có evolvesFromSpeciesId = p, chỉ khi p thuộc speciesIds
3. roots = stage có evolvesFromSpeciesId = null hoặc cha không có trong danh sách
4. grow(stage, depth): đánh dấu placed, con = childrenOf[stage] chưa placed, grow(con, depth + 1)
5. stage nào còn chưa placed (chu trình) thì thêm làm gốc depth 0
```

- **Ví dụ:**
  - Eevee: 8 loài cùng `evolvesFromSpeciesId = 133` nên thành 8 con của một gốc; tóm tắt "2 giai đoạn, 8 nhánh tiến hóa".
  - Wurmple: Silcoon và Cascoon là con của Wurmple, mỗi nhánh có một con; tóm tắt "3 giai đoạn, 2 nhánh tiến hóa".
  - Dữ liệu lỗi có chu trình (A từ B, B từ A): bước 5 lấy A làm gốc, B là con, tập `placed` ngăn lặp vô hạn.
- **Phụ thuộc:** `formatPokemonName`, kiểu `EvolutionStage`. Dùng bởi `EvolutionChain`.
- **Biên và lỗi:** danh sách rỗng trả `[]`; `treeSummary([])` trả "1 giai đoạn".
- **Test:** `evolution.test.ts`: chuỗi thẳng và độ sâu (dòng 39-48); Eevee 8 nhánh (50-61); nhánh tách lồng nhau (63-76); cha vắng mặt và chu trình (78-83); rỗng (85-88); nhãn điều kiện (92-110); icon và tên giai đoạn (114-125).

**5. `EvolutionChain` (`frontend/src/features/pokemon-detail/components/EvolutionChain.tsx`)**

- **Vai trò:** khối "Tiến hóa" dạng cây dọc.
- **Thành phần chính:**
  - `useEvolution(detail.id)` (dòng 40) dùng số ID, không dùng tên trên URL.
  - Đang tải: khung skeleton cao 384 px (`h-96`) để khối "Các dạng" phía dưới không bị đẩy (dòng 41-51).
  - Không có dữ liệu (kể cả khi lỗi) thì trả `null` (dòng 52).
  - Đánh số thứ tự duyệt trước (pre-order) cho từng loài để tính độ trễ hiện lần lượt (dòng 55-60, 102).
  - Chỉ 1 loài thì "X không tiến hóa." (dòng 72-73).
  - `EvolutionBranch` đệ quy: nhánh con nằm trong `<ol>` thụt lề, có đường nối dọc và khuỷu ngang bằng `::before`, `::after` (dòng 29-30, 98-119).
  - `EvolutionCard` (dòng 126-175): link `/pokemon/{pokemonId}`; `aria-current="page"` khi `pokemonId === detail.id`; nhuộm màu khi cùng `speciesId` (dòng 130-136), nên đang xem Charizard Mega X thì thẻ Charizard vẫn được nhuộm.
- **Phụ thuộc:** `evolution.ts`, `useEvolution`, `Panel`, `PokemonSprite`, `TypeBadge`, `DexNumber`.
- **Dữ liệu:** `GET /pokemon/{id}/evolution`, key `['pokemon', 'evolution', '<id>']`.
- **Biên và lỗi:** lỗi endpoint thì khối biến mất, không báo lỗi; quyết định này coi tiến hóa là thông tin phụ.
- **Test:** `PokemonDetailPage.test.tsx` dòng 227-276, 302-317.

**6. `StatPanel` (`frontend/src/features/pokemon-detail/components/StatPanel.tsx`)**

- **Vai trò:** panel "Chỉ số cơ bản": 6 thanh, tổng BST, khối tốc độ cấp 50, 4-5 ô thông tin, 2 nút hành động.
- **Thành phần chính:** `facts` gồm chiều cao (dm / 10, đơn vị m), cân nặng (hg / 10, kg), thế hệ, phân loại (`rarityLabel`), thêm "Dạng" khi không phải `DEFAULT` (dòng 22-30); 6 `StatBar` theo `STAT_AXES` với độ trễ `300 + 90 x i` ms (dòng 12-13, 48-55); `SpeedBenchmark` (dòng 58); link "So sánh" `/compare?left={id}` và "Thêm vào đội" `/team-builder?add={id}` (dòng 73-84).
- **Phụ thuộc:** `StatBar`, `STAT_AXES`, `SpeedBenchmark`, `labels.ts`, `formatHeight`, `formatWeight`.
- **Dữ liệu:** không gọi API trực tiếp.
- **Biên và lỗi:** `<dl key={detail.id}>` buộc thanh chỉ số chạy lại animation khi đổi Pokémon (dòng 47).
- **Test:** `PokemonDetailPage.test.tsx` dòng 146-178.

**7. `DefenseGrid` (`frontend/src/features/pokemon-detail/components/DefenseGrid.tsx`)**

- **Vai trò:** khối "Phòng thủ": câu tóm tắt, 3 nhóm Yếu, Kháng, Miễn nhiễm, nhóm Trung tính và lưới 18 ô.
- **Thành phần chính:**
  - `toEntries(defense)` dựng 18 mục theo thứ tự `TYPE_NAMES`, thiếu thì coi là x1 (dòng 41-46).
  - `GROUPS` (dòng 20-39): Yếu (`> 1`, xếp giảm dần), Kháng (`0 < m < 1`, xếp tăng dần nên x¼ trước), Miễn nhiễm (`= 0`); nhóm rỗng bị bỏ (dòng 50-53).
  - Câu tóm tắt dùng `defenseSummary(name, entries)` của `typechart/defense.ts` (dòng 62).
  - Lưới 18 ô "Hệ số nhận từ 18 hệ" (dòng 117-136).
- **Phụ thuộc:** `typechart/defense.ts`, `multiplierStyles`, `formatMultiplier`, `pokemonTypes`. Dùng bởi `PokemonDetailPage`.
- **Dữ liệu:** lấy `detail.defense` do backend tính sẵn; không gọi thêm API.
- **Responsive:** nhóm Trung tính là một câu trên mobile, chip từ `md` (dòng 100-103); lưới 3 cột, 6 cột từ `sm` (dòng 120).
- **Test:** `PokemonDetailPage.test.tsx` dòng 180-201 ("Charizard yếu trước 3 hệ, nặng nhất là Rock x4. Kháng 6 hệ và miễn nhiễm Ground.", ô Rock x4, Ground x0, Grass x¼).

**8. `PokemonHero` (`frontend/src/features/pokemon-detail/components/PokemonHero.tsx`)**

- **Vai trò:** phần đầu trang: khung cảnh theo hệ, artwork, breadcrumb, số Pokédex, `h1` tên, nhãn hệ; nhận `children` (panel phải) và `below` (dưới artwork).
- **Thành phần chính:** khung cảnh `sceneForTypes(detail.types)` (dòng 24); tên dài hơn 14 ký tự dùng cỡ chữ nhỏ hơn từ `lg` (dòng 21, 26-29); breadcrumb "Pokédex / Tên" (dòng 47-62); số Pokédex lấy `speciesId` (dòng 85-88); `key={detail.id}` để artwork chạy lại hiệu ứng rơi (dòng 70).
- **Phụ thuộc:** `SceneBackdrop`, `SceneLabel`, `PokemonSprite`, `TypeBadge`, `DexNumber`, `sceneForTypes`. Dùng bởi `PokemonDetailPage`.
- **Responsive:** lưới 2 cột từ `lg`, `xl` mở rộng cột phải lên 30rem (dòng 40); vùng ảnh nền cao 280 px, 544 px từ `lg` (dòng 33).
- **Test:** `PokemonDetailPage.test.tsx` dòng 137-144.

**9. Trạng thái và thành phần phụ**

| File | Export | Dùng bởi | Ghi chú |
|---|---|---|---|
| `frontend/src/features/pokemon-detail/components/DetailStates.tsx` | `DetailSkeleton`, `DetailError`, `PokemonNotFound` | `PokemonDetailPage` | Skeleton có `h1` ẩn "Chi tiết Pokémon" và `role="status"` (dòng 21-37); lỗi dùng `errorMessageFor(code)` (39-48); không tìm thấy hiện chuỗi người dùng gõ và 2 link về Pokédex, Tổng quan (50-73) |
| `frontend/src/features/pokemon-detail/components/FormSwitcher.tsx` | `FormSwitcher` | `PokemonDetailPage` (khi `forms.length > 1`) | Link `/pokemon/{form.name}`, dạng đang xem có `aria-current` và nhãn "Đang xem" (dòng 22-38) |
| `frontend/src/features/pokemon-detail/labels.ts` | `FORM_LABELS`, `rarityLabel` | `StatPanel`, `FormSwitcher` | Thần thoại ưu tiên hơn Huyền thoại (dòng 11-15) |

#### IV. Tốc độ cấp 50 (feature `speed`, dùng ở Chi tiết và Team Builder)

**1. `level50.ts` (`frontend/src/features/speed/level50.ts`)**

- **Vai trò:** công thức tốc độ cấp 50, tỷ lệ "nhanh hơn N%" và mốc lân cận.
- **Thành phần chính:**
  - `LEVEL = 50` (dòng 19); `PRESETS` (dòng 21-25): `min` IV 0, EV 0, tính cách 9/10; `neutral` IV 31, EV 0, 10/10; `max` IV 31, EV 252, 11/10.
  - `level50Speed(base, preset)` (dòng 27-31), `level50Spread(base)` (dòng 33-39).
  - `rankSpeed(tiers, base, selfId?)` (dòng 41-59) trả `{ slower, tied, faster, total, percentSlower }`.
  - `nearestTiers(tiers, base)` (dòng 61-68).
- **Công thức:**

```text
raw            = floor( (2 * base + IV + floor(EV / 4)) * 50 / 100 ) + 5
speed          = floor( raw * natureTenths / 10 )     natureTenths thuộc {9, 10, 11}
percentSlower  = floor( slower / (slower + tied + faster) * 100 ), bằng 0 nếu tổng = 0
faster tier    = mốc cuối cùng có speed > base   (mốc nhanh hơn gần nhất)
slower tier    = mốc đầu tiên có speed < base    (mốc chậm hơn gần nhất)
```

- **Giải thích:**
  - Nhân số nguyên rồi chia 10 thay vì nhân 0,9 hoặc 1,1 để tránh sai số dấu phẩy động (`docs/spec.md` Phần 2, mục IX).
  - Garchomp gốc 102: min = floor(107 x 9 / 10) = 96; neutral = floor(235 x 0,5) + 5 = 122; max = floor(154 x 11 / 10) = 169.
  - So tốc độ gốc là đủ vì ở cùng mức đầu tư, tốc độ cấp 50 không giảm khi tốc độ gốc tăng. Ở mức Tối thiểu có thể hòa: gốc 5 và gốc 6 đều ra 9.
  - `rankSpeed` bỏ chính Pokémon theo `id`; làm tròn xuống nên còn ai bằng tốc độ thì không bao giờ ra 100%.
  - `nearestTiers` dựa vào thứ tự mốc giảm dần theo `speed` mà backend bảo đảm (`docs/api.md` Phần 2, mục XIII).
- **Phụ thuộc:** kiểu `SpeedTier`. Dùng bởi `SpeedBenchmark`, `TeamSpeedList`.
- **Biên và lỗi:** Pokémon không có trong bảng mốc (dạng Mega, Gmax) thì không bị trừ khỏi tổng.
- **Test:** `level50.test.ts`: Garchomp 96, 122, 169 (dòng 16-18); gốc 200 max 277, gốc 5 min 9 (20-23); bỏ chính mình (27-35); không có trong mốc (37-45); không làm tròn lên 100 (47-53); mốc rỗng (55-57); mốc lân cận (61-68).

**2. `fetchSpeedTiers`, `useSpeedTiers` (`frontend/src/features/speed/api.ts`, `frontend/src/features/speed/hooks.ts`)**

- **Vai trò:** tải bảng mốc tốc độ một lần mỗi phiên.
- **Thành phần chính:** `GET /pokemon/speed-tiers` (`api.ts` dòng 4-6); key `['pokemon', 'speed-tiers']`, `staleTime: Infinity` (`hooks.ts` dòng 5-11).
- **Phụ thuộc:** `getJson`. Dùng bởi `SpeedBenchmark`, `TeamSpeedList`.
- **Dữ liệu:** khoảng 59 KB chưa nén theo `docs/api.md` Phần 2, mục XIII.
- **Biên và lỗi:** lỗi được từng component xử lý riêng.
- **Test:** gián tiếp qua `PokemonDetailPage.test.tsx` 204-225 và `TeamSpeedList.test.tsx`.

**3. `SpeedBenchmark` (`frontend/src/features/speed/components/SpeedBenchmark.tsx`)**

- **Vai trò:** khối "Tốc độ ở cấp 50" trong `StatPanel`.
- **Thành phần chính:** props `pokemonId`, `base`. 3 ô Tối thiểu, Không đầu tư, Tối đa tính ngay tại chỗ (dòng 19-24, 37-47). `SpeedStanding` (dòng 63-88): "Nhanh hơn N% Pokémon ở cùng mức đầu tư", thanh phần trăm, số Pokémon bằng tốc độ gốc, mốc "Vừa thua" (mốc nhanh hơn gần nhất) và "Vừa vượt" (mốc chậm hơn gần nhất). `NeighbourTier` hiện tối đa 3 tên có link rồi "và N Pokémon khác" (dòng 10, 90-113).
- **Phụ thuộc:** `useSpeedTiers`, `level50.ts`, `SpeedPercentBar`, `formatPokemonName`.
- **Dữ liệu:** `GET /pokemon/speed-tiers`.
- **Biên và lỗi:** có dữ liệu thì xếp hạng; lỗi thì "Chưa tải được bảng tốc độ để so sánh." nhưng vẫn giữ 3 ô; đang tải thì skeleton (dòng 48-54).
- **Test:** `PokemonDetailPage.test.tsx` dòng 204-225.

**4. `TeamSpeedList` (`frontend/src/features/speed/components/TeamSpeedList.tsx`)**

- **Vai trò:** panel "Tốc độ cấp 50" của Team Builder, xếp thành viên từ nhanh đến chậm.
- **Thành phần chính:** `usePokemonDetails(ids)` và `useSpeedTiers()` (dòng 16-17); có thành viên lỗi thì "Chưa tải được chỉ số tốc độ của đội." (dòng 19-21); chưa đủ dữ liệu thì skeleton (dòng 24-32); sắp xếp giảm dần theo tốc độ gốc (dòng 34); mỗi `SpeedRow` có 3 ô và tỷ lệ (dòng 61-107).
- **Phụ thuộc:** `usePokemonDetails`, `useSpeedTiers`, `level50.ts`, `SpeedPercentBar`. Dùng bởi `frontend/src/pages/TeamBuilderPage.tsx:367`.
- **Dữ liệu:** `GET /pokemon/{id}` cho từng thành viên (key dùng chung với trang Chi tiết khi khóa là số ID) và `GET /pokemon/speed-tiers`.
- **Biên và lỗi:** mốc lỗi thì vẫn hiện 3 ô và câu báo (dòng 43-45). Câu chú thích ghi cứng "1.083 dạng thường và dạng vùng" (dòng 46-50).
- **Test:** `TeamSpeedList.test.tsx`: thứ tự Garchomp, Charizard, Snorlax và 100%, 33%, 0% (dòng 77-95); mốc lỗi vẫn có 169 (97-106); thành viên lỗi (108-114).

**5. Component phụ**

| File | Export | Dùng bởi | Ghi chú |
|---|---|---|---|
| `frontend/src/features/speed/components/SpeedPercentBar.tsx` | `SpeedPercentBar` | `SpeedBenchmark`, `TeamSpeedList` | Thanh `aria-hidden`, độ rộng kẹp trong 0-100% (dòng 9) |

#### V. So sánh (`/compare`) và feature `compare`

**1. `ComparePage` (`frontend/src/pages/ComparePage.tsx`)**

- **Vai trò:** "Bàn Cân Sức Mạnh": chọn 2 Pokémon, hiện banner đối đầu, bảng chỉ số, radar, đòn cùng hệ và kết luận từ API.
- **Thành phần chính:**
  - `useCompareSearchParams()` lấy `left`, `right`, `setSide`, `swap` (dòng 39); 2 lần `usePokemonDetail` (dòng 40-41); state `notice` cho thông báo chọn trùng (dòng 42).
  - `sameChoice`: hai khóa URL giống nhau, hoặc đã tải xong và cùng `id` (ví dụ `garchomp` và `445`) (dòng 46-48).
  - `useCompare(...)` chỉ bật khi cả hai chi tiết đã có và không trùng; truyền tên chuẩn `data.name` (dòng 49-53), nên `?left=445` và `?left=garchomp` trúng cùng cache.
  - `missingSide`: bên có lỗi 404 (dòng 54); `detailError`: lỗi chi tiết khác 404 (dòng 55-57); `pair`, `pairPending`, `versus` quyết định hero (dòng 58-70).
  - `select(side, pokemon)` từ chối Pokémon đang ở bên kia (so tên, so ID URL, so `id` đã tải), đặt `notice` và trả `false` (dòng 72-83).
  - `clear(side)` xóa một bên (dòng 85-88); `slotOf(side)` dựng props cho ô chọn (dòng 90-95).
- **Thứ tự hiển thị kết quả (`renderResult`, dòng 97-205):**
  - Cả hai trống: `EmptyState` có link mẫu `?left=garchomp&right=salamence` (dòng 98-111).
  - Một bên 404: "Không tìm thấy Pokémon" + nút bỏ chọn bên đó (dòng 112-129).
  - Trùng: "Hai bên đang là cùng một Pokémon", không gọi `/compare` (dòng 130-138).
  - Lỗi chi tiết khác: `ErrorState`, "Thử lại" chỉ refetch bên lỗi (dòng 139-149).
  - Thiếu một bên: "Chọn thêm một Pokémon" (dòng 150-160).
  - `/compare` lỗi `INVALID_PARAMETER`: `EmptyState`; lỗi khác: `ErrorState` (dòng 161-173).
  - Đang tải: `CompareSkeleton` (dòng 174, 245-255).
  - Có kết quả: khối có `key` theo cặp ID để chạy lại animation (dòng 180), gồm `StatDuelTable`, `CompareRadar`, `StabPanel`, `VerdictPanel`, và 2 link chỉ hiện trên mobile "Xem B" và "Đưa A vào đội" `/team-builder?add={left.id}` (dòng 189-202).
- **Hero:** có cặp thì `VersusBanner` (key theo cặp ID); đang chờ cặp thì `VersusBannerSkeleton`; còn lại là `PageHero` stadium "Bàn Cân Sức Mạnh" (dòng 209-223).
- **Phụ thuộc:** feature `compare`, `usePokemonDetail`, `EmptyState`, `ErrorState`, `PageHero`, `errorMessageFor`.
- **Dữ liệu:** URL `left`, `right`. Request: `GET /pokemon/{left}`, `GET /pokemon/{right}` (key `['pokemon', 'detail', key]`), rồi `GET /pokemon/compare?left=<tên>&right=<tên>` (key `['compare', left, right]`); gõ tìm thì `GET /pokemon/search`.
- **Responsive:** trên mobile bảng chỉ số đứng trước radar, từ `lg` radar đứng trước (`lg:order-first`, dòng 183); tỉ lệ cột 1:1,4 và 1:1,6 từ `lg` (dòng 181, 185); khi có banner, `PageBody` đẩy nội dung xuống theo `--hero-overlap` (dòng 224-227).
- **Test:** `frontend/src/pages/ComparePage.test.tsx`, 10 case: trống, không gọi API, link mẫu (dòng 117-131); đủ banner, radar, bảng, STAB, kết luận (133-178); ô chọn gọn, Esc trả focus (180-224); bỏ chọn quay về hero stadium (226-239); chọn bên thứ hai, ẩn Pokémon bên kia khỏi gợi ý, gọi `/compare` đúng 1 lần (241-272); trùng không gọi `/compare` (274-282); đổi bên qua URL (284-292); 404 một bên (294-306); 400 cả hai bên hiện "Chưa tải được Pokémon này." (308-319); `/compare` 503 (321-332).

**2. `useCompareSearchParams` (`frontend/src/features/compare/useCompareSearchParams.ts`)**

- **Vai trò:** đọc, ghi cặp `left`, `right` trên URL.
- **Thành phần chính:**
  - `parsePokemonKey(value)`: `trim().toLowerCase()`, chấp nhận nếu khớp `^[a-z0-9-]{1,60}$` (dòng 6-11), cùng mẫu với `idOrName` ở `docs/api.md` Phần 1.
  - `otherSide(side)` (dòng 13-15).
  - `update(next)` dùng dạng hàm của `setSearchParams` để giữ tham số khác, xóa bên `undefined`, kèm `preventScrollReset` (dòng 22-38); không `replace`, nên mỗi lần đổi cặp là một mục lịch sử.
  - `setSide(side, value)` (dòng 40-45), `swap()` đổi `left` và `right` (dòng 47).
- **Phụ thuộc:** `useSearchParams`. Dùng bởi `ComparePage`, kiểu `CompareSide` dùng ở các component so sánh.
- **Biên và lỗi:** giá trị sai mẫu (ví dụ "mr. mime") coi như chưa chọn. `setSide` lấy giá trị bên còn lại từ lần render hiện tại, không dùng ref như `useDexSearchParams`.
- **Test:** `useCompareSearchParams.test.ts` dòng 5-24.

**3. `fetchCompare`, `useCompare` (`frontend/src/features/compare/api.ts`, `frontend/src/features/compare/hooks.ts`)**

- **Vai trò:** gọi endpoint so sánh.
- **Thành phần chính:** `GET /pokemon/compare?left&right` (`api.ts` dòng 4-10); `useCompare(pair?)`: key `['compare', left, right]`, `enabled: pair !== undefined`, `staleTime: Infinity` (`hooks.ts` dòng 10-17).
- **Phụ thuộc:** `getJson`. Dùng bởi `ComparePage`.
- **Dữ liệu:** `CompareResponse { left, right, verdict { typeAdvantage, statTotal, speed, summary[] } }` (`frontend/src/types/api.ts:82-91`).
- **Biên và lỗi:** đổi bên tạo key mới nên gọi lại API (câu kết luận phụ thuộc chiều trái, phải).
- **Test:** `ComparePage.test.tsx` dòng 150-152, 265.

**4. `scale.ts` (`frontend/src/features/compare/scale.ts`)**

- **Vai trò:** chọn thang đo chung cho thanh chỉ số và radar.
- **Công thức:**

```text
statScale(...stats) = min(255, max(150, ceil(max chỉ số / 50) * 50))
totalScale(...totals) = max(720, ...totals)
percentOf(value, scale) = scale <= 0 ? 0 : kẹp(value / scale * 100, 0, 100)
```

- **Giải thích:** thang làm tròn lên bội số 50 để radar không bị bẹp khi hai Pokémon có chỉ số thấp, nhưng không vượt trần 255. Garchomp và Salamence có chỉ số cao nhất 135 nên thang là 150; Attack 130 chiếm 86,7%, 135 chiếm 90%; tổng 600 trên thang 720 là 83,3%.
- **Phụ thuộc:** `STAT_AXES`, `STAT_MAX = 255` (`frontend/src/components/pokemon/statAxes.ts:11-20`). Dùng bởi `StatDuelTable`, `CompareRadar`.
- **Biên và lỗi:** thang 0 trả 0%, tránh chia cho 0.
- **Test:** `scale.test.ts` dòng 15-37.

**5. `ComparePicker`, `CompareSlot` (`frontend/src/features/compare/components/ComparePicker.tsx`, `frontend/src/features/compare/components/CompareSlot.tsx`)**

- **Vai trò:** khung chọn 2 bên gọn, mở ô tìm tại chỗ, quản lý focus.
- **Thành phần chính:**
  - `ComparePicker`: state `open` mỗi bên (dòng 36); `editing = chưa chọn hoặc đang mở` (dòng 66); `excludeIds` là ID bên kia để ô tìm không gợi ý trùng (dòng 65, 75); `focusTarget` ref + `useEffect` không mảng phụ thuộc, chạy sau mỗi render để đưa focus tới nút "Đổi Pokémon" hoặc ô tìm (dòng 37-54); chọn thành công mới đóng ô (dòng 81-83); nút đổi bên khóa khi cả hai trống (dòng 91-97); `notice` hiện qua `role="status"` (dòng 123-125).
  - `CompareSlot`: hàng gọn có nhãn "Pokémon 1, 2" (mobile) hoặc "Bên trái, phải" (desktop) (dòng 38-64); `statusText`: "Chưa chọn", "Không tìm thấy...", "Chưa tải được Pokémon này.", "Đang tải…" (dòng 71-76); nút toggle có `aria-expanded`, `aria-controls` (dòng 130-154); khung chỉnh có `PokemonSearchBox`, "Bỏ chọn", nút đóng (dòng 157-207); Esc đóng khung nếu ô tìm chưa xử lý phím đó (`isDefaultPrevented`, dòng 97-101).
- **Phụ thuộc:** `PokemonSearchBox`, `DexNumber`, `buttonStyles`. Dùng bởi `ComparePage`.
- **Dữ liệu:** ô tìm gọi `GET /pokemon/search`.
- **Biên và lỗi:** chọn trùng thì `onSelect` trả `false`, khung vẫn mở và thông báo lỗi màu `danger`.
- **Test:** `ComparePage.test.tsx` dòng 180-272.

**6. `StatDuelTable` (`frontend/src/features/compare/components/StatDuelTable.tsx`)**

- **Vai trò:** bảng "Từng chỉ số" 6 chỉ số + Tổng, thanh chạy từ giữa ra hai bên.
- **Thành phần chính:** `rows` 6 chỉ số dùng `statScale`, hàng Tổng dùng `totalScale` (dòng 38-54); `leadLabel` hiện "+chênh lệch" cho bên lớn hơn (dòng 27-29); bên lớn hơn in đậm hơn (dòng 31-33); `StatBarTrack` thanh trái neo phải, thanh phải neo trái (dòng 202-214).
- **Phụ thuộc:** `scale.ts`, `STAT_AXES`, `Panel`, `staggerDelay`.
- **Responsive:** dưới `md` là `<dl>` mỗi chỉ số 2 dòng (dòng 65-110); từ `md` là `<table>` có `caption`, `th scope` (dòng 112-189).
- **Biên và lỗi:** bằng nhau thì không bên nào có "+".
- **Test:** `ComparePage.test.tsx` dòng 165-168 (hàng Tốc độ "102+2", hàng Tổng 600).

**7. `StabPanel` (`frontend/src/features/compare/components/StabPanel.tsx`)**

- **Vai trò:** "Đòn cùng hệ": hệ số mà đòn mang hệ của mỗi bên gây lên bên kia.
- **Thành phần chính:** `stabMultipliers(attacker, defender)` lấy từng hệ của bên tấn công rồi tra mảng `defense` 18 mục của bên phòng thủ, thiếu thì x1 (dòng 22-27); hiển thị 2 chiều A đánh B, B đánh A (dòng 30-33).
- **Phụ thuộc:** `formatMultiplier`, `multiplierStyles`, `pokemonTypes`. Dùng bởi `ComparePage`.
- **Dữ liệu:** dùng `defense` có sẵn trong `CompareResponse`, không gọi ma trận.
- **Biên và lỗi:** không có.
- **Test:** `ComparePage.test.tsx` dòng 142-148 (Garchomp đánh Salamence "Dragonx2Groundx0").

**8. Banner, radar, kết luận**

| File | Export | Dùng bởi | Ghi chú |
|---|---|---|---|
| `frontend/src/features/compare/components/VersusBanner.tsx` | `VersusBanner`, `VersusBannerSkeleton` | `ComparePage` | Hero 440 px (`h-110`), `h1` ẩn "So sánh A và B" (dòng 72-75); mỗi bên một khung cảnh theo hệ, cắt chéo bằng `clip-path` (dòng 40-61, 77-81); bảng tên `NamePlate` (156-179); skeleton có `h1` "Bàn Cân Sức Mạnh" (181-190) |
| `frontend/src/features/compare/components/CompareRadar.tsx` | `CompareRadar` | `ComparePage` | Bọc `StatRadar` với thang `statScale`, series trái `primary`, phải `accent`, chú thích trên biểu đồ ở mobile (dòng 18, 28-37) |
| `frontend/src/features/compare/components/VerdictPanel.tsx` | `VerdictPanel` | `ComparePage` | Hiện nguyên `verdict.summary` của API, các ý hiện lần lượt; rỗng thì "Chưa có kết luận cho cặp này." (dòng 26-44) |

#### VI. Bảng tương khắc (`/types`) và feature `typechart`

**1. `TypeChartPage` (`frontend/src/pages/TypeChartPage.tsx`)**

- **Vai trò:** ma trận 18 x 18 và công cụ tính phòng thủ hệ kép.
- **Thành phần chính:** `useTypeMatrix()` (dòng 23); `useDefendingTypes()` (dòng 24); state `focus` cho hàng hoặc cột đang làm nổi bật (dòng 25), đổi qua `toggleFocus` (dòng 102).
- **Cây component:** `PageHero` (lab) → `PageBody` gồm Panel 1 (`DualTypePicker` + `DefenseResult`) và Panel 2 (tiêu đề, `MatrixLegend`, `TypeMatrixTable` + `MatrixFocusPanel`) (dòng 29-117).
- **Phụ thuộc:** feature `typechart`, `Panel`, `EmptyState`, `ErrorState`.
- **Dữ liệu:** URL `def` lặp tối đa 2 lần; `GET /types/matrix`, key `['types', 'matrix']`, `staleTime: Infinity`. `focus` không lên URL. Bấm chọn hệ không phát sinh request.
- **Trạng thái:** lỗi thì toàn bộ thân trang là `ErrorState` (dòng 35-39); đang tải thì `DefenseResult` báo chờ và ma trận là skeleton `role="status"` (dòng 72-80); ma trận rỗng thì `EmptyState` có nút "Tải lại" (dòng 81-96).
- **Responsive:** câu hướng dẫn "Vuốt ngang để xem đủ cột" dưới `lg`, "Các ô khác mờ đi" từ `lg` (dòng 66-67); ma trận và panel tóm tắt nằm cạnh nhau khi đủ rộng nhờ `flex-[999_1_600px]` và `flex-[1_1_280px]` (dòng 103; `frontend/src/features/typechart/components/MatrixFocusPanel.tsx:30`).
- **Test:** `frontend/src/pages/TypeChartPage.test.tsx`, 9 case: 19 tiêu đề cột, 18 tiêu đề hàng, 324 ô (dòng 22-47); chọn Fire và Flying (49-70); bỏ `def` lạ, giữ tối đa 2 (72-82); gợi ý chọn thêm và "Bỏ chọn" (84-98); một điểm yếu duy nhất (100-112); ô x1 trống nhưng đọc được "x1" (114-124); làm nổi bật hàng Fire (126-157); làm nổi bật cột Ground và bấm lần hai để tắt (159-182); lỗi 503 (184-194).

**2. `useDefendingTypes` (`frontend/src/features/typechart/useDefendingTypes.ts`)**

- **Vai trò:** lưu 1-2 hệ phòng thủ đang chọn trên URL.
- **Thành phần chính:** `DEFENDING_PARAM = 'def'`, `MAX_DEFENDING_TYPES = 2` (dòng 7-8); `parseDefendingTypes`: `trim`, chữ thường, lọc hệ hợp lệ, bỏ trùng, lấy 2 (dòng 10-13); `withDefendingTypes` thay các `def` và giữ tham số khác (dòng 15-23); hook trả `{ selected, toggle, clear }` (dòng 25-57).
- **Cơ chế ghi URL:** giống `useDexSearchParams`, dùng `latestRef` để 2 lần bấm liên tiếp không mất lần đầu (dòng 28-42); khác ở chỗ truyền `replace: true` (dòng 39), nên bật tắt hệ không tạo mục lịch sử.
- **Phụ thuộc:** `useSearchParams`, `isTypeName`. Dùng bởi `TypeChartPage`; hằng số dùng ở `DualTypePicker`, `DefenseResult`.
- **Biên và lỗi:** bấm hệ thứ ba khi đã đủ 2 thì `slice(0, 2)` bỏ hệ mới (dòng 47-49); giao diện cũng khóa chip đó.
- **Test:** `useDefendingTypes.test.ts`: parse (dòng 9-24), giữ tham số khác (28-32), 2 lần bật trước 1 render (42-52), bỏ và xóa (54-62).

**3. `fetchTypeMatrix`, `useTypeMatrix` (`frontend/src/features/typechart/api.ts`, `frontend/src/features/typechart/hooks.ts`)**

- **Vai trò:** tải ma trận tương khắc.
- **Thành phần chính:** `GET /types/matrix` (`api.ts` dòng 4-6); key `['types', 'matrix']`, `staleTime: Infinity` (`hooks.ts` dòng 5-11).
- **Phụ thuộc:** `getJson`. Dùng bởi `TypeChartPage`, `TypeWheel`, `TrainerQuiz`.
- **Dữ liệu:** `TypeMatrix { types[], multipliers[i][j] }`, hàng `i` là hệ tấn công, cột `j` là hệ phòng thủ; `types` theo ID hệ 1-18 (`docs/api.md` Phần 1, Phần 3). Server gửi `Cache-Control: max-age=86400`.
- **Biên và lỗi:** không có.
- **Test:** gián tiếp qua `TypeChartPage.test.tsx`.

**4. `defense.ts` (`frontend/src/features/typechart/defense.ts`)**

- **Vai trò:** tính hệ số nhận của 1-2 hệ phòng thủ và viết câu tóm tắt.
- **Thành phần chính:**
  - `matrixTypes(matrix)`: các hệ của ma trận theo thứ tự hiển thị `TYPE_NAMES` (Normal, Fire, Water, ...), không theo thứ tự ID của API (dòng 16-18).
  - `defendingEntries(matrix, defending)`: với mỗi hệ tấn công, `multiplierAgainst` (dòng 20-28).
  - `groupByMultiplier(entries)`: bỏ x1, gom theo hệ số, xếp giảm dần (dòng 30-39).
  - `defenseSummary(subject, entries)`: câu điểm yếu (`weaknessSentence`, dòng 45-56) + câu kháng, miễn nhiễm (dòng 58-74).
- **Công thức hệ kép:**

```text
singleMultiplier(a, d) = multipliers[index(a)][index(d)], hệ không có trong ma trận thì 1
multiplierAgainst(a, [d1, d2]) = singleMultiplier(a, d1) * singleMultiplier(a, d2)
Ví dụ phòng thủ Fire/Flying: Rock 2 x 2 = 4 ; Ground 1 x 0 = 0 ; Grass 0,5 x 0,5 = 0,25 ; Water 2 x 1 = 2
```

- **Quy tắc câu điểm yếu:** 0 điểm yếu → "không yếu trước hệ nào"; 1 điểm yếu → "chỉ có một điểm yếu: X, và đòn đó gây xN"; mọi điểm yếu cùng mức → "yếu trước A, B xN"; còn lại → "yếu trước k hệ, nặng nhất là ...".
- **Phụ thuộc:** `multiplierAgainst` (`frontend/src/lib/typeEffectiveness.ts:20-26`), `formatMultiplier`, `typeLabel`. Dùng bởi `DefenseResult`, `matrixFocus.ts`, `TypeMatrixTable`, `DefenseGrid` (trang Chi tiết).
- **Biên và lỗi:** chọn rỗng thì mọi hệ x1; ma trận rỗng trả `[]`.
- **Test:** `defense.test.ts` dòng 14-79 (thứ tự hiển thị, nhóm Fire/Flying từ x4 tới x0, chọn rỗng, ma trận rỗng, 3 dạng câu tóm tắt).

**5. `matrixFocus.ts` (`frontend/src/features/typechart/matrixFocus.ts`)**

- **Vai trò:** logic làm nổi bật một hàng (hệ tấn công) hoặc một cột (hệ phòng thủ).
- **Thành phần chính:**
  - `MatrixFocus { axis: 'attack' | 'defense', type }`.
  - `toggleFocus(current, next)`: bấm lại đúng ô đang chọn thì về `null`, khác thì đổi (dòng 34-36).
  - `isFocused` (dòng 38-40); `isCellLit(focus, attacking, defending)`: không có focus thì sáng hết; trục `attack` sáng khi `attacking === focus.type`, trục `defense` sáng khi `defending === focus.type` (dòng 42-49).
  - `bucketOf`: 0 → 0; > 1 → 2; < 1 → 0,5; x1 → `null` (dòng 51-56).
  - `focusGroups(matrix, focus)`: 3 nhóm theo `FOCUS_MULTIPLIERS = [2, 0.5, 0]` với tiêu đề riêng mỗi trục (dòng 18-23, 58-70).
- **Phụ thuộc:** `singleMultiplier`, `matrixTypes`. Dùng bởi `TypeChartPage`, `TypeMatrixTable`, `MatrixFocusPanel`.
- **Biên và lỗi:** ma trận rỗng thì 3 nhóm rỗng.
- **Test:** `matrixFocus.test.ts` dòng 8-60.

**6. `TypeMatrixTable` (`frontend/src/features/typechart/components/TypeMatrixTable.tsx`)**

- **Vai trò:** bảng HTML 18 x 18.
- **Thành phần chính:** tiêu đề cột là nút có `aria-pressed`, hiện 3 chữ đầu và tên đầy đủ cho trình đọc màn hình (dòng 72-94); tiêu đề hàng là nút tên hệ (dòng 102-116); mỗi ô có `title` "A tấn công B: xN" và mờ 20% khi không sáng (dòng 118-124); `MatrixCell` x1 dùng `NeutralMark`, x0 và x4 chữ đậm hơn (dòng 25-40); độ trễ animation `(hàng + cột) x 18 ms` tạo sóng theo đường chéo (dòng 10, 128).
- **Phụ thuộc:** `matrixTypes`, `matrixFocus.ts`, `singleMultiplier`, `multiplierStyles`.
- **Responsive:** vùng cuộn có `role="region"`, `tabIndex=0` để cuộn bằng bàn phím (dòng 51-55); tiêu đề hàng và cột `sticky`.
- **Biên và lỗi:** không có.
- **Test:** `TypeChartPage.test.tsx` dòng 22-47, 114-182.

**7. `DualTypePicker`, `DefenseResult` (`frontend/src/features/typechart/components/DualTypePicker.tsx`, `frontend/src/features/typechart/components/DefenseResult.tsx`)**

- **Vai trò:** bộ chọn hệ phòng thủ và kết quả tương ứng.
- **Thành phần chính:**
  - `DualTypePicker`: 18 chip `aria-pressed`, khóa chip chưa chọn khi đủ 2 (`DualTypePicker.tsx` dòng 26, 60); nút "Bỏ chọn" khóa khi chưa chọn (dòng 34-41); gợi ý gọn `compactHint` theo số hệ đã chọn (dòng 19-23).
  - `DefenseResult`: chỉ tính khi có ma trận và đã chọn (`DefenseResult.tsx` dòng 24); câu tóm tắt trong vùng `aria-live="polite"` (dòng 48-50); danh sách nhóm có `key` theo lựa chọn để chạy lại hiệu ứng trượt (dòng 53); "Trung tính x1 với n hệ còn lại." (dòng 75-77); gợi ý `pickHint` (dòng 12-16).
- **Phụ thuộc:** `defense.ts`, `MAX_DEFENDING_TYPES`, `MultiplierCell`, `TypeBadge`.
- **Responsive:** dòng nhãn hệ đã chọn và gợi ý dài chỉ hiện từ `lg` (`DefenseResult.tsx` dòng 42; `DualTypePicker.tsx` dòng 44-45).
- **Biên và lỗi:** chưa có ma trận thì "Đang tải bảng tương khắc…" và `aria-busy`.
- **Test:** `TypeChartPage.test.tsx` dòng 49-112.

**8. Panel phụ và dữ liệu test**

| File | Export | Dùng bởi | Ghi chú |
|---|---|---|---|
| `frontend/src/features/typechart/components/MatrixFocusPanel.tsx` | `MatrixFocusPanel` | `TypeChartPage` | `<aside aria-live>`, tiêu đề "Fire tấn công" hoặc "Ground phòng thủ", 3 nhóm, "Không có" khi nhóm rỗng, nút "Bỏ chọn" (dòng 24-77) |
| `frontend/src/features/typechart/components/MatrixLegend.tsx` | `MatrixLegend` | `TypeChartPage` | Chú giải x2, x½, x0 và ô x1 nét đứt (dòng 4-31) |
| `frontend/src/features/typechart/typeMatrixFixture.ts` | `TYPE_MATRIX_FIXTURE` | `defense.test.ts`, `matrixFocus.test.ts`, `quiz.test.ts`, `TypeChartPage.test.tsx` | Ma trận thật theo thứ tự ID của API (dòng 3-22), chỉ khai báo ô khác x1 (24-77). Nằm trong `src/` nhưng chỉ phục vụ test |

#### VII. Địa hình (`/terrain/:terrainId?`) và feature `terrain`

**1. `TerrainPage` (`frontend/src/pages/TerrainPage.tsx`)**

- **Vai trò:** giới thiệu 13 địa hình, Pokémon thường gặp, trò chơi "Who's that Pokémon?" và Thẻ Trainer.
- **Thành phần chính:**
  - `useParams()` lấy `terrainId` (dòng 46); `valid` khi không có hoặc là ID hợp lệ (dòng 47); `terrain` mặc định `grassland` (dòng 48); `types = terrainTypes(terrain)` (dòng 49).
  - `useTerrainPool(types)` và `useTrainerProgress()` gọi trước lệnh `return` sớm để giữ đúng quy tắc hook (dòng 50-51); ID lạ thì `<Navigate to="/terrain" replace />` (dòng 53).
  - Lỗi pool dựng một `ErrorState` dùng chung cho 2 khối (dòng 56-58).
- **Cây component:** `PageHero` theo địa hình → Panel "Chọn địa hình" (`TerrainPicker`) → lưới 2:3 gồm Panel mô tả (tên, mô tả, nhãn hệ, số Pokémon mỗi hệ) và Panel trò chơi (`WhosThatPokemon key={terrain}`) → Panel danh sách (`TerrainPokemon`) → `TrainerCard` với 13 huy hiệu địa hình (dòng 62-145).
- **Phụ thuộc:** feature `terrain`, `trainer`, `SCENES`, `TypeBadge`, `Panel`, `EmptyState`, `ErrorState`.
- **Dữ liệu:** path param `terrainId`; mỗi hệ một request `GET /pokemon?type=<hệ>&size=100&sort=id,asc`, key `['pokemon', 'type-pool', hệ]`; đọc, ghi `localStorage` `pokenexus.trainer`.
- **Biên và lỗi:** lỗi API thì trò chơi và danh sách hiện `ErrorState`, phần chọn và mô tả vẫn dùng được; danh sách rỗng thì `EmptyState`. `key={terrain}` làm trò chơi khởi tạo lại khi đổi địa hình.
- **Responsive:** lưới mô tả và trò chơi tỉ lệ 2:3 từ `lg` (dòng 75).
- **Test:** `frontend/src/pages/TerrainPage.test.tsx`, 5 case: Núi lửa gọi `type=fire&size=100`, link "Xem đủ 85 Pokémon hệ Fire" (dòng 59-81); trả lời đúng, cộng 5 điểm, ghi `localStorage`, focus nút đầu ở lượt 2 (83-106); 5 câu đúng liên tiếp nhận huy hiệu, Thẻ Trainer "1/13" (108-126); ID lạ chuyển về `/terrain` (128-134); 503 có nút "Thử lại" (136-142).

**2. `terrains.ts` (`frontend/src/features/terrain/terrains.ts`)**

- **Vai trò:** danh sách địa hình, mô tả, ánh xạ sang hệ và huy hiệu.
- **Thành phần chính:** `TERRAIN_IDS` 13 khung cảnh tự nhiên, bỏ `stadium`, `lab` (dòng 5-19); `DEFAULT_TERRAIN = 'grassland'` (dòng 23); `TERRAIN_DESCRIPTIONS` (dòng 25-46); `isTerrainId` (dòng 48-50); `terrainTypes(t) = typesForScene(t)` (dòng 52-54); `terrainBadgeId(t) = "terrain:" + t` (dòng 56-58); `TERRAIN_BADGES` (dòng 60-63).
- **Cách ánh xạ hệ:** `typesForScene(scene)` lọc `TYPE_NAMES` có `TYPE_SCENES[type] === scene` (`frontend/src/lib/scenes.ts:207-226`, `:235-237`), tức là phép nghịch đảo của bảng hệ sang khung cảnh. Vì mỗi hệ chỉ thuộc một khung cảnh, 13 địa hình phủ đủ 18 hệ, mỗi hệ đúng một lần (ví dụ `forest` → Grass, Bug; `power-plant` → Electric, Steel; `sky` → Flying, Dragon).
- **Phụ thuộc:** `SCENES`, `typesForScene`, kiểu `Badge`. Dùng bởi `TerrainPage`, `TerrainPicker`, `WhosThatPokemon`.
- **Biên và lỗi:** `isTerrainId(undefined)` trả `false`.
- **Test:** `whosThat.test.ts` dòng 37-52.

**3. `fetchTypePool`, `mergePools`, `useTerrainPool` (`frontend/src/features/terrain/api.ts`, `frontend/src/features/terrain/hooks.ts`)**

- **Vai trò:** tải và gộp danh sách Pokémon theo các hệ của địa hình.
- **Thành phần chính:**
  - `TERRAIN_POOL_SIZE = 100`; `fetchTypePool(type)` gọi `GET /pokemon?type&size=100&sort=id,asc` (`api.ts` dòng 4-15).
  - `mergePools(pages)`: gộp vào `Map` theo `id` để bỏ trùng (Pokémon mang cả 2 hệ của địa hình), rồi xếp theo `id` (`hooks.ts` dòng 21-25).
  - `useTerrainPool(types)`: `useQueries` mỗi hệ một query, key `['pokemon', 'type-pool', type]`, `staleTime: Infinity` (dòng 27-33); `combine` chỉ trả `pokemon` và `totals` khi mọi query thành công (dòng 34-43); `totals[i].total = totalElements` của hệ thứ i; `retry` chỉ refetch query lỗi (dòng 49-51).
- **Phụ thuộc:** `getJson`, `ApiError`. Dùng bởi `TerrainPage`.
- **Dữ liệu:** không có endpoint riêng cho địa hình; tái dùng `GET /pokemon` theo `docs/spec.md` Phần 2, mục VIII. Không truyền `form` nên backend mặc định `DEFAULT`, `REGIONAL`.
- **Biên và lỗi:** một hệ lỗi thì cả khối báo lỗi; `pokemon` vẫn `undefined` để hiện skeleton khi đang tải.
- **Test:** `whosThat.test.ts` dòng 54-61 (`mergePools`); `TerrainPage.test.tsx` dòng 59-81.

**4. `whosThat.ts` (`frontend/src/features/terrain/whosThat.ts`)**

- **Vai trò:** tạo một lượt đoán bóng Pokémon.
- **Thành phần chính:** `OPTION_COUNT = 4`, `WHOS_THAT_POINTS = 5`, `TERRAIN_BADGE_STREAK = 5` (dòng 4-6); `pickIndex(n, random) = min(n - 1, floor(random() x n))` (dòng 13-15); `distinctByName` bỏ Pokémon trùng tên hiển thị (dòng 17-25); `createRound(pool, random, previousAnswerId?)` (dòng 27-49).
- **Thuật toán `createRound`:**

```text
1. candidates = pool sau khi bỏ trùng tên hiển thị; ít hơn 4 thì trả undefined
2. answerPool = candidates bỏ previousAnswerId nếu candidates > 4, ngược lại giữ nguyên
3. answer = answerPool[pickIndex]
4. options = [answer] + 3 Pokémon rút ngẫu nhiên không hoàn lại từ phần còn lại
5. Trộn Fisher-Yates: i chạy từ 3 xuống 1, đổi chỗ options[i] với options[pickIndex(i + 1)]
```

- **Giải thích:** hàm nhận `random` làm tham số để test truyền nguồn ngẫu nhiên cố định. Với `random = () => 0`, đáp án luôn nằm ở vị trí cuối sau khi trộn; test trang dựa vào điều này.
- **Phụ thuộc:** `formatPokemonName`. Dùng bởi `WhosThatPokemon`.
- **Biên và lỗi:** đúng 4 ứng viên thì có thể lặp đáp án vừa hỏi.
- **Test:** `whosThat.test.ts` dòng 65-95 (4 lựa chọn khác nhau có đáp án, đáp án cuối khi random = 0, không lặp, cần 4 tên khác nhau).

**5. `WhosThatPokemon` (`frontend/src/features/terrain/components/WhosThatPokemon.tsx`)**

- **Vai trò:** giao diện trò chơi đoán bóng.
- **Thành phần chính:**
  - State `round` (khởi tạo lười bằng `createRound`), `roundNumber`, `outcome`, `streak`, `tally` (dòng 51-55).
  - `pick(index)` (dòng 74-90): `nextStreak = đúng ? streak + 1 : 0`; `gained = pointsForAnswer(đúng, nextStreak, 5)`; `earnsBadge = nextStreak >= 5`; `newBadge` chỉ khi chưa có huy hiệu; gọi `onProgress` để cộng điểm, cập nhật chuỗi dài nhất và trao huy hiệu `terrain:<id>`.
  - `nextRound()` truyền ID đáp án cũ để tránh lặp (dòng 92-96); từ lượt 2, focus vào nút đáp án đầu tiên (dòng 58-60).
  - Ảnh artwork tô đen bằng `brightness-0` cho tới khi trả lời (dòng 107); `alt` không lộ tên khi chưa trả lời (dòng 104).
- **Phụ thuộc:** `whosThat.ts`, `trainer/progress.ts`, `ProgressUpdate`, `PokemonSprite`, `EmptyState`. Dùng bởi `TerrainPage`.
- **Dữ liệu:** không gọi API; ghi tiến độ qua `onProgress` (hàm `update` của trang).
- **Biên và lỗi:** pool không đủ 4 tên khác nhau thì `EmptyState` "Chưa đủ Pokémon để chơi" (dòng 62-69). Điểm mỗi lượt đúng: 5, 5, 10, 10, ... (từ câu đúng thứ 3 liên tiếp cộng thêm 5).
- **Test:** `TerrainPage.test.tsx` dòng 83-126.

**6. `TerrainPicker`, `TerrainPokemon` (`frontend/src/features/terrain/components/TerrainPicker.tsx`, `frontend/src/features/terrain/components/TerrainPokemon.tsx`)**

- **Vai trò:** dải chọn 13 địa hình và lưới Pokémon thường gặp.
- **Thành phần chính:**
  - `TerrainPicker`: mỗi địa hình là `Link` tới `/terrain/{id}` có `preventScrollReset` và `aria-current` (`TerrainPicker.tsx` dòng 48-53); `useEffect` cuộn ngang để cột đang chọn nằm giữa khi danh sách tràn (dòng 23-29); có huy hiệu thì hiện `BallIcon` Master và chữ ẩn ", đã có huy hiệu" (dòng 92, 114).
  - `TerrainPokemon`: 12 Pokémon đầu (`SHOWCASE_SIZE`) và link "Xem đủ N Pokémon hệ X trong Pokédex" tới `/pokedex?type=x` (`TerrainPokemon.tsx` dòng 10, 21, 33-40).
- **Phụ thuộc:** `terrains.ts`, `sceneThumbUrl`, `SCENES`, `BallIcon`, `PokemonCard`.
- **Responsive:** `TerrainPicker` cuộn ngang dưới `lg`, cột 64 px, cột chọn 176 px; từ `lg` một hàng, cột chọn nở `grow-[3.6]`, hover nở `1.6` (dòng 34, 45). Lưới Pokémon 2, 3 (`sm`), 4 (`lg`), 6 (`xl`) cột (`TerrainPokemon.tsx` dòng 20).
- **Biên và lỗi:** không có.
- **Test:** `TerrainPage.test.tsx` dòng 59-81.

#### VIII. Tiến độ Trainer (feature `trainer`, dùng ở Tổng quan và Địa hình)

**1. `progress.ts` (`frontend/src/features/trainer/progress.ts`)**

- **Vai trò:** mô hình dữ liệu và luật thưởng của tiến độ Trainer, toàn hàm thuần.
- **Thành phần chính:**
  - `TrainerProgress { points, bestStreak, badges[], balls { poke, great, ultra, master } }` (dòng 12-17); `EMPTY_PROGRESS` (dòng 34-39).
  - `RANKS`: Tân binh 0, Trainer 100, Trainer ưu tú 300, Thủ lĩnh Gym 600, Tứ Thiên Vương 1000, Nhà vô địch 1500 (dòng 41-48).
  - `POINTS_PER_CORRECT = 10`, `STREAK_BONUS = 5`, `STREAK_BONUS_FROM = 3` (dòng 50-52).
  - `pointsForAnswer`, `rankFor`, `prizeFor`, `recordAnswer`, `awardBadge` (không thêm trùng), `awardBall` (dòng 54-98).
  - `parseProgress(raw)` đọc phòng thủ (dòng 104-131).
- **Công thức:**

```text
pointsForAnswer(đúng, streak, base = 10) = 0 nếu sai ; base + (streak >= 3 ? 5 : 0) nếu đúng
rankFor(points): current = hạng cuối cùng có minPoints <= points ; next = hạng kế tiếp
prizeFor(correct, total): correct <= 0 -> không có ; = total -> master ; = total - 1 -> ultra ; = total - 2 -> great ; còn lại -> poke
Một bộ quiz đúng 6/6: 10 + 10 + 15 + 15 + 15 + 15 = 80 điểm
```

- **`parseProgress`:** chuỗi rỗng, JSON hỏng, không phải object đều trả `EMPTY_PROGRESS`; số phải là số nguyên không âm, sai thì về 0 (`countOf`, dòng 100-102); `badges` chỉ giữ chuỗi và bỏ trùng; thiếu loại Ball nào thì loại đó là 0.
- **Phụ thuộc:** không. Dùng bởi `useTrainerProgress`, `TrainerCard`, `TrainerQuiz`, `WhosThatPokemon`, `quiz.ts`, `terrains.ts`.
- **Biên và lỗi:** `rankFor(5000)` có `next = undefined`.
- **Test:** `progress.test.ts`: điểm và thưởng chuỗi (dòng 15-21), hạng (23-34), Ball (36-43), không trùng huy hiệu (45-58), đọc dữ liệu hỏng (60-79).

**2. `useTrainerProgress` (`frontend/src/features/trainer/useTrainerProgress.ts`)**

- **Vai trò:** giữ tiến độ trong state React, lưu `localStorage` và đồng bộ giữa các tab.
- **Thành phần chính:**
  - `TRAINER_STORAGE_KEY = 'pokenexus.trainer'` (dòng 5).
  - `readStored()` và `writeStored()` bọc `try/catch` (dòng 7-21), vì `localStorage` có thể ném lỗi (trình duyệt chặn bộ nhớ, hết dung lượng).
  - `useState(readStored)` đọc lười một lần khi mount (dòng 26).
  - Cờ `dirty`: chỉ ghi khi đã có cập nhật thật (dòng 27-31). Mở trang mà chưa chơi thì không ghi, tránh đè dữ liệu tab khác bằng bản cũ.
  - Lắng nghe sự kiện `storage` của `window`: khóa trùng `pokenexus.trainer` hoặc `key === null` (khi tab khác gọi `localStorage.clear()`) thì đọc lại (dòng 33-39).
  - `update(change)` dùng `setProgress((current) => change(current))` nên luôn áp lên bản mới nhất, kể cả bản vừa nạp từ tab khác (dòng 41-44).
- **Phụ thuộc:** `parseProgress`. Dùng bởi `TrainerQuiz`, `TerrainPage` (mỗi trang một bản; `WhosThatPokemon` nhận `update` qua props).
- **Dữ liệu:** `localStorage['pokenexus.trainer']` là JSON của `TrainerProgress`.
- **Biên và lỗi:** sự kiện `storage` chỉ bắn ở tab khác, không bắn ở tab vừa ghi. Hai tab cùng ghi gần như đồng thời thì bản ghi sau thắng; không có khóa.
- **Test:** `useTrainerProgress.test.ts` dòng 12-29: tab khác ghi huy hiệu, tab này cộng 10 điểm, kết quả có cả 50 điểm và huy hiệu.

**3. Component hiển thị tiến độ**

| File | Export | Dùng bởi | Ghi chú |
|---|---|---|---|
| `frontend/src/features/trainer/components/TrainerCard.tsx` | `TrainerCard` | `TrainerQuiz`, `TerrainPage` | Danh hiệu, điểm, thanh tiến tới hạng sau `filled = min(1, (points - current.min) / (next.min - current.min))`, 4 loại Ball, huy hiệu đạt trên tổng (dòng 23-26); `headingLevel` h2 hoặc h3 |
| `frontend/src/features/trainer/components/BallIcon.tsx` | `BallIcon` | `TrainerCard`, `TrainerQuiz`, `TerrainPicker` | SVG 4 loại Ball, màu theo token (dòng 3-15) |

### III. Luồng xử lý tiêu biểu

#### I. Lọc "Dragon, thế hệ 4" trên Pokédex rồi mở Garchomp

1. Người dùng vào `/pokedex`; router nạp chunk `DexPage` (`frontend/src/app/router.tsx:36`).
2. `useDexSearchParams` đọc URL rỗng ra bộ lọc mặc định (`frontend/src/features/dex/useDexSearchParams.ts:54-72`). `usePokemonList` gửi `GET /api/v1/pokemon?sort=id%2Casc&page=0&size=24` (`frontend/src/features/dex/api.ts:7-26`); trong lúc chờ là `PokemonGridSkeleton` (`frontend/src/pages/DexPage.tsx:146-147`).
3. Bấm chip "Dragon": `toggleType` tạo `['dragon']` (`frontend/src/features/dex/components/DexFilters.tsx:37-42`) → `updateFilter` đặt `page = 0` (`frontend/src/features/dex/useDexSearchParams.ts:122-128`) → `write` đẩy URL `?type=dragon` vào lịch sử với `preventScrollReset` (`:112-120`).
4. Bộ lọc đổi nên key `['pokemon', 'list', filter]` đổi; request mới `GET /api/v1/pokemon?type=dragon&sort=id%2Casc&page=0&size=24`. Lưới cũ vẫn hiện, mờ 60% (`frontend/src/pages/DexPage.tsx:155-158`).
5. Bấm chip "Thế hệ 4": `onChange({ gen: 4 })` (`frontend/src/features/dex/components/DexFilters.tsx:97`) → URL `?type=dragon&gen=4` → `GET /api/v1/pokemon?type=dragon&gen=4&sort=id%2Casc&page=0&size=24`. Tiêu đề thành "N Pokémon khớp bộ lọc" vì `activeCount = 2` (`frontend/src/pages/DexPage.tsx:42-43`).
6. Bấm thẻ Garchomp: `PokemonCard` là link `/pokemon/garchomp` (`frontend/src/components/pokemon/PokemonCard.tsx:20`). Router nạp `PokemonDetailPage` (`frontend/src/app/router.tsx:37-40`).
7. `usePokemonDetail('garchomp')` gửi `GET /api/v1/pokemon/garchomp` (`frontend/src/features/pokemon-detail/hooks.ts:9-17`); trong lúc chờ là `DetailSkeleton`.
8. Có dữ liệu: `EvolutionChain` gửi `GET /api/v1/pokemon/445/evolution` (`frontend/src/features/pokemon-detail/components/EvolutionChain.tsx:40`), `SpeedBenchmark` gửi `GET /api/v1/pokemon/speed-tiers` (`frontend/src/features/speed/hooks.ts:5-11`). Tốc độ cấp 50 hiện 96, 122, 169 (`frontend/src/features/speed/level50.ts:27-31`).
9. Bấm Back: URL về `/pokedex?type=dragon&gen=4`; key danh sách còn trong cache 5 phút nên không gọi lại (`frontend/src/features/dex/hooks.ts:6-14`).

#### II. So sánh Garchomp với Salamence, bắt đầu từ trang Chi tiết

1. Ở trang Garchomp bấm "So sánh": link `/compare?left=445` (`frontend/src/features/pokemon-detail/components/StatPanel.tsx:73-78`).
2. `parsePokemonKey('445')` hợp lệ (`frontend/src/features/compare/useCompareSearchParams.ts:6-11`). `usePokemonDetail('445')` gửi `GET /api/v1/pokemon/445`: đây là request mới vì key `'445'` khác key `'garchomp'` (`frontend/src/features/pokemon-detail/hooks.ts:5-7`).
3. Thiếu bên phải nên hiện "Chọn thêm một Pokémon" (`frontend/src/pages/ComparePage.tsx:150-160`); ô tìm bên phải đang mở vì `value` chưa có (`frontend/src/features/compare/components/ComparePicker.tsx:66`).
4. Gõ "sala": sau 250 ms debounce, `GET /api/v1/pokemon/search?q=sala&limit=8` (`frontend/src/components/pokemon/PokemonSearchBox.tsx:22`, `frontend/src/features/dex/api.ts:32-34`). Garchomp bị loại khỏi gợi ý nhờ `excludeIds` (`frontend/src/features/compare/components/ComparePicker.tsx:65`, `:75`).
5. Enter chọn Salamence: `ComparePage.select('right', ...)` kiểm tra không trùng rồi `setSide` (`frontend/src/pages/ComparePage.tsx:72-83`) → URL `?left=445&right=salamence` (`frontend/src/features/compare/useCompareSearchParams.ts:22-45`).
6. `usePokemonDetail('salamence')` gửi `GET /api/v1/pokemon/salamence`; trong lúc chờ là `VersusBannerSkeleton` (`frontend/src/pages/ComparePage.tsx:62-69`, `:215-216`).
7. Đủ 2 chi tiết: `VersusBanner` hiện; `useCompare` gửi `GET /api/v1/pokemon/compare?left=garchomp&right=salamence` bằng tên chuẩn (`frontend/src/pages/ComparePage.tsx:49-53`, `frontend/src/features/compare/hooks.ts:10-17`); trong lúc chờ là `CompareSkeleton`.
8. Có kết quả: `StatDuelTable` tính thang 150 (`frontend/src/features/compare/scale.ts:8-12`), `StabPanel` tra `defense` ra Garchomp đánh Salamence Dragon x2, Ground x0 (`frontend/src/features/compare/components/StabPanel.tsx:22-27`), `VerdictPanel` hiện 3 câu từ API (`frontend/src/features/compare/components/VerdictPanel.tsx:26-41`).
9. Bấm đổi bên: `swap()` → URL `?left=salamence&right=445` (`frontend/src/features/compare/useCompareSearchParams.ts:47`). Hai chi tiết trúng cache; key so sánh mới `['compare', 'salamence', 'garchomp']` nên gọi lại `GET /pokemon/compare`.

#### III. Chọn hệ kép Fire/Flying trên Bảng tương khắc

1. Vào `/types`: `useTypeMatrix` gửi `GET /api/v1/types/matrix` (`frontend/src/features/typechart/hooks.ts:5-11`); nếu đã mở trang Tổng quan trước đó thì trúng cache vì `staleTime: Infinity`.
2. Bấm chip "Fire": `DualTypePicker` gọi `onToggle` (`frontend/src/features/typechart/components/DualTypePicker.tsx:61`) → `toggle` → `update` dựng `?def=fire` từ `latestRef` và gọi `setSearchParams(..., { replace: true, preventScrollReset: true })` (`frontend/src/features/typechart/useDefendingTypes.ts:34-50`).
3. `DefenseResult` tính `defendingEntries(matrix, ['fire'])` (`frontend/src/features/typechart/components/DefenseResult.tsx:24`); gợi ý "Chọn thêm 1 hệ nếu Pokémon có hệ kép" (`:12-16`).
4. Bấm "Flying": URL `?def=fire&def=flying`, thay thế mục lịch sử hiện tại; các chip còn lại bị khóa (`frontend/src/features/typechart/components/DualTypePicker.tsx:26`, `:60`).
5. Tính: mỗi hệ tấn công `a` có hệ số `m(a, fire) x m(a, flying)` (`frontend/src/lib/typeEffectiveness.ts:20-26`); `groupByMultiplier` cho x4 Rock, x2 Water Electric, x½ Fire Fighting Steel Fairy, x¼ Grass Bug, x0 Ground (`frontend/src/features/typechart/defense.ts:30-39`).
6. `defenseSummary` ra "Fire + Flying yếu trước 3 hệ, nặng nhất là Rock x4. Kháng 6 hệ và miễn nhiễm Ground." (`frontend/src/features/typechart/defense.ts:58-74`); không có request mới nào.
7. Bấm tiêu đề hàng "Fire" trên ma trận: `setFocus(toggleFocus(null, { axis: 'attack', type: 'fire' }))` (`frontend/src/pages/TypeChartPage.tsx:102`); `isCellLit` làm mờ các hàng khác (`frontend/src/features/typechart/matrixFocus.ts:42-49`); `MatrixFocusPanel` hiện 3 nhóm "Gây x2 lên", "Bị giảm còn x½ khi đánh", "Không tác dụng lên". Bấm lại thì tắt.

#### IV. Trả lời một câu Thử tài Trainer và thấy tiến độ ở tab khác

1. Trang `/` mount `TrainerQuiz` với bộ `damage`, câu 1 (Gyarados, đòn Electric) (`frontend/src/features/landing/components/TrainerQuiz.tsx:83-88`). `useTrainerProgress` đọc `localStorage['pokenexus.trainer']` (`frontend/src/features/trainer/useTrainerProgress.ts:26`).
2. Câu về hệ nên `detailIdsFor` trả `[]`, chỉ cần ma trận; `useTypeMatrix` dùng chung request `GET /api/v1/types/matrix` với `TypeWheel` (`frontend/src/features/landing/quiz.ts:376-380`).
3. `evaluateQuestion` tính `2 x 2 = 4`, đáp án đúng là "x4" (chỉ số 2) (`frontend/src/features/landing/quiz.ts:442-450`).
4. Bấm "x4": `pick(2)` → `streak = 1`, `gained = 10` → `update(recordAnswer(...))` (`frontend/src/features/landing/components/TrainerQuiz.tsx:107-121`). `update` đặt `dirty = true`; `useEffect` ghi JSON `{"points":10,"bestStreak":1,...}` vào `localStorage` (`frontend/src/features/trainer/useTrainerProgress.ts:29-31`, `:41-44`).
5. Tab khác đang mở `/terrain/volcano` nhận sự kiện `storage` có `key = 'pokenexus.trainer'`, gọi `setProgress(readStored())` (`frontend/src/features/trainer/useTrainerProgress.ts:33-39`); `TrainerCard` ở đó hiện 10 điểm. Không có request HTTP nào trong bước này.
6. Hết bộ: `next()` tính `prizeFor(correct, 6)` và `correct >= 5` thì trao huy hiệu `quiz:damage` (`frontend/src/features/landing/components/TrainerQuiz.tsx:123-135`); lại ghi `localStorage` và tab kia cập nhật số Ball.
7. Với bộ `stats`, câu 1 cần chi tiết 3 Pokémon nên `useQuizDetails([135, 26, 101])` gửi 3 request `GET /api/v1/pokemon/{id}` (`frontend/src/features/landing/hooks.ts:25-31`).

#### V. Chơi "Who's that Pokémon?" ở Núi lửa

1. Vào `/terrain/volcano`; `isTerrainId('volcano')` đúng (`frontend/src/pages/TerrainPage.tsx:47-48`). `terrainTypes('volcano')` ra `['fire']` (`frontend/src/features/terrain/terrains.ts:52-54`).
2. `useTerrainPool(['fire'])` gửi `GET /api/v1/pokemon?type=fire&size=100&sort=id%2Casc` (`frontend/src/features/terrain/api.ts:6-15`); thành công thì `mergePools` và `totals` (`frontend/src/features/terrain/hooks.ts:34-43`).
3. `WhosThatPokemon` tạo lượt đầu bằng `createRound(pool, Math.random)` (`frontend/src/features/terrain/components/WhosThatPokemon.tsx:51`); artwork tô đen (`:107`).
4. Chọn đúng: `pick` tính `nextStreak = 1`, `gained = 5`, gọi `onProgress` (chính là `update` của trang) để cộng điểm (`:74-90`); artwork hiện màu và có link "Xem <tên>".
5. "Pokémon tiếp theo": `createRound(pool, random, id cũ)` để không lặp (`:92-96`); focus về nút đáp án đầu (`:58-60`).
6. Đúng 5 lượt liên tiếp: `earnsBadge` nên `awardBadge(..., 'terrain:volcano')`; câu "Bạn nhận huy hiệu Núi lửa!" và Thẻ Trainer "1/13" (`frontend/src/pages/TerrainPage.test.tsx:108-126`).
7. Nếu vào `/terrain/abc`: `<Navigate to="/terrain" replace />` (`frontend/src/pages/TerrainPage.tsx:53`), trang hiển thị Đồng cỏ; mục lịch sử lỗi bị thay thế.

#### VI. Xem cây tiến hóa Eevee

1. Vào `/pokemon/eevee`: `GET /api/v1/pokemon/eevee`, rồi `GET /api/v1/pokemon/133/evolution` (`frontend/src/features/pokemon-detail/components/EvolutionChain.tsx:40`).
2. Response `stages` là danh sách phẳng xếp theo `speciesId` (`docs/api.md` Phần 2, mục XII). `buildEvolutionTree` gom 8 stage có `evolvesFromSpeciesId = 133` vào `childrenOf[133]` (`frontend/src/features/pokemon-detail/evolution.ts:57-64`).
3. Eevee là gốc duy nhất; `grow` tạo 8 con ở độ sâu 1 (`:66-79`). `treeSummary` ra "2 giai đoạn, 8 nhánh tiến hóa" (`:86-97`).
4. Mỗi thẻ con có nhãn điều kiện, ví dụ "Dùng Water Stone" khi `item = 'water-stone'` (`:36-42`), link tới `/pokemon/{pokemonId}`. Thẻ Eevee có `aria-current="page"` (`frontend/src/features/pokemon-detail/components/EvolutionChain.tsx:134-135`).

### IV. Câu hỏi có thể bị hỏi

| # | Câu hỏi | Trả lời mẫu (2-4 câu, nói được thành lời) | Nguồn |
|---|---|---|---|
| 1 | Trang Tổng quan gọi những API nào, nếu backend chết thì sao? | Bốn request: chi tiết Pokémon nổi bật, ma trận hệ, chi tiết Pokémon hôm nay, hồ sơ thế hệ. Mỗi khối tự có trạng thái lỗi kèm nút thử lại; khối tĩnh và các nút điều hướng vẫn dùng được. Test có case trả 503 cho mọi request để kiểm điều này. | `frontend/src/pages/LandingPage.test.tsx:261-277`, `frontend/src/features/landing/components/LandingHero.tsx:57`, `frontend/src/features/landing/components/GenerationChart.tsx:57-61` |
| 2 | "Pokémon hôm nay" chọn thế nào, sao cả ngày ra cùng một con? | Lấy số ngày kể từ 1970 theo ngày lịch máy người dùng, nhân với hằng số băm 2654435761 bằng phép nhân 32 bit, lấy dư 1025 rồi cộng 1. Không dùng giờ phút nên cả ngày ra cùng một ID; hàm băm làm hai ngày liền nhau cách xa nhau. | `frontend/src/features/landing/regions.ts:26-39`, `frontend/src/features/landing/regions.test.ts:26-38` |
| 3 | Sao dùng `Date.UTC` với năm tháng ngày địa phương? | Để đếm ngày theo lịch người dùng đang thấy, nhưng tính ra mốc 00:00 UTC nên chia cho 86 400 000 luôn ra số nguyên, không bị lệch vì múi giờ hay giờ mùa hè. | `frontend/src/features/landing/regions.ts:26-28`, `frontend/src/features/landing/regions.test.ts:14-17` |
| 4 | Biểu đồ thế hệ lấy dữ liệu ở đâu? | Một request `GET /pokemon/generations` trả 9 hồ sơ, cache `Infinity`. Trước đây trang gọi 9 lần `GET /pokemon?gen=n&size=1`; api.md ghi rõ endpoint mới thay cách cũ. Chiều cao cột là tỉ lệ với thế hệ nhiều loài nhất, tối thiểu 4%. | `frontend/src/features/landing/hooks.ts:10-16`, `frontend/src/features/landing/components/GenerationChart.tsx:26-27`, `:68`, `docs/api.md` Phần 2 mục XIV |
| 5 | Câu hỏi quiz có ghi cứng đáp án không? | Không. File quiz chỉ chứa đề và lựa chọn; đáp án tính lúc chạy từ ma trận hệ hoặc chi tiết Pokémon của API. Nếu dữ liệu cho 0 hoặc 2 đáp án đúng, `uniqueIndex` trả -1 để không chấm nhầm. | `frontend/src/features/landing/quiz.ts:405-408`, `:517-529`, `frontend/src/features/landing/quiz.test.ts:89-113` |
| 6 | Điểm Trainer cộng thế nào? | Quiz: đúng được 10 điểm, từ câu đúng thứ 3 liên tiếp cộng thêm 5; sai về chuỗi 0 và không có điểm. Một bộ 6/6 được 80 điểm. Who's that Pokémon dùng cùng hàm với điểm gốc 5. | `frontend/src/features/trainer/progress.ts:50-61`, `frontend/src/features/terrain/components/WhosThatPokemon.tsx:78` |
| 7 | Ball, huy hiệu, danh hiệu xác định thế nào? | Hết bộ: 6/6 Master, 5/6 Ultra, 4/6 Great, 1-3 Poké, 0 không có. Đúng từ 5/6 nhận huy hiệu `quiz:<bộ>`; Who's that cần chuỗi 5 câu đúng để nhận `terrain:<id>`. Danh hiệu là mốc điểm lớn nhất đã vượt trong 6 mốc 0-1500. | `frontend/src/features/trainer/progress.ts:41-48`, `:63-77`, `frontend/src/features/landing/quiz.ts:96`, `frontend/src/features/terrain/whosThat.ts:6` |
| 8 | Tiến độ lưu ở đâu, đồng bộ giữa các tab ra sao? | `localStorage` khóa `pokenexus.trainer`, giá trị JSON. Mỗi trang dùng hook đăng ký sự kiện `storage`; tab khác ghi thì tab này đọc lại. Cập nhật dùng `setState` dạng hàm nên áp lên bản mới nhất, không làm mất huy hiệu tab kia vừa nhận. | `frontend/src/features/trainer/useTrainerProgress.ts:5`, `:33-44`, `frontend/src/features/trainer/useTrainerProgress.test.ts:12-29` |
| 9 | Sao cần cờ `dirty` trước khi ghi? | Nếu ghi ngay khi mount, một tab mở lâu với dữ liệu cũ sẽ đè lên tiến độ mới ở tab khác. Chỉ khi người dùng thật sự trả lời mới ghi. | `frontend/src/features/trainer/useTrainerProgress.ts:27-31`, `:41-44` |
| 10 | `localStorage` bị chặn hoặc dữ liệu hỏng thì sao? | Đọc, ghi đều bọc `try/catch`; lỗi thì dùng tiến độ rỗng và bỏ qua việc ghi. `parseProgress` chỉ nhận số nguyên không âm, chuỗi huy hiệu, bỏ trùng; JSON hỏng trả về rỗng. | `frontend/src/features/trainer/useTrainerProgress.ts:7-21`, `frontend/src/features/trainer/progress.ts:100-131`, `frontend/src/features/trainer/progress.test.ts:60-79` |
| 11 | Hai tab cùng chơi thì có mất điểm không? | Có thể. Không có khóa hay hợp nhất ở mức trường; tab nào ghi sau thì thắng. Với một người chơi một tab thì không gặp, nhưng đây là điểm yếu thật nếu muốn tiến độ chính xác tuyệt đối. | `frontend/src/features/trainer/useTrainerProgress.ts:15-21`, `:29-31` |
| 12 | Vì sao bộ lọc Pokédex nằm trên URL? | Để gửi link là người khác thấy đúng kết quả, reload không mất, nút Back hoàn tác bộ lọc. URL là nguồn duy nhất; component không giữ bản sao bộ lọc. | `frontend/src/features/dex/useDexSearchParams.ts:102-155`, `docs/architecture.md:309` |
| 13 | URL `page=2` nhưng API nhận `page=1`, vì sao? | URL đếm từ 1 cho người đọc, API đếm từ 0 theo Spring. Hàm parse trừ 1, hàm ghi cộng 1, trang 1 thì bỏ khỏi URL. | `frontend/src/features/dex/useDexSearchParams.ts:70`, `:87`, `frontend/src/pages/DexPage.test.tsx:78-103` |
| 14 | `latestRef` trong `useDexSearchParams` để làm gì? | Hai lần ghi liên tiếp trước khi React render lại, ví dụ rời ô BST rồi bấm chip hệ ngay, nếu dựng từ `searchParams` của lần render cũ thì lần sau đè mất lần trước. Ref giữ bản mới nhất và cập nhật ngay khi ghi. Có test riêng cho tình huống này. | `frontend/src/features/dex/useDexSearchParams.ts:106-120`, `frontend/src/features/dex/useDexSearchParams.test.ts:110-120` |
| 15 | Push hay replace lịch sử ở từng trang? | Pokédex và So sánh push, vì mỗi bộ lọc hay cặp là một trạng thái đáng quay lại bằng Back. Bảng tương khắc replace, vì bật tắt hệ rất nhanh và không đáng tạo mục lịch sử. Cả ba đều `preventScrollReset` để không nhảy lên đầu trang. | `frontend/src/features/dex/useDexSearchParams.ts:117`, `frontend/src/features/compare/useCompareSearchParams.ts:34`, `frontend/src/features/typechart/useDefendingTypes.ts:39` |
| 16 | Đổi bộ lọc có làm lưới trắng xóa không? | Không. `keepPreviousData` giữ trang cũ trong lúc tải trang mới, giao diện mờ 60% và `aria-busy`. Danh sách cache 5 phút nên quay lại bộ lọc cũ không gọi lại. | `frontend/src/features/dex/hooks.ts:6-14`, `frontend/src/pages/DexPage.tsx:155-158` |
| 17 | Đổi kiểu xem thẻ, danh sách có gọi API không? | Không. `view` có trên URL nhưng không nằm trong đối tượng `filter` làm query key, nên dữ liệu dùng lại. | `frontend/src/features/dex/useDexSearchParams.ts:74-76`, `frontend/src/pages/DexPage.test.tsx:148-162` |
| 18 | Nhập BST sai thì sao? | Ô số giữ bản nháp; chỉ áp dụng khi rời ô hoặc Enter. Sai định dạng, vượt 1530 hoặc "Từ" lớn hơn "Đến" thì hiện lỗi dưới ô, `aria-invalid` và không đổi URL. Parse URL cũng bỏ cả cặp nếu min lớn hơn max. | `frontend/src/features/dex/components/StatRangeFields.tsx:55-72`, `frontend/src/features/dex/useDexSearchParams.ts:59`, `frontend/src/pages/DexPage.test.tsx:132-146` |
| 19 | Giới hạn ô tìm tên là gì? | 2 đến 30 ký tự sau khi trim, khớp ràng buộc của API; ô nhập có `maxLength=30`, query chỉ bật trong khoảng đó, debounce 250 ms, lấy tối đa 8 gợi ý. Enter chỉ chọn khi kết quả đã khớp chữ đang gõ. | `frontend/src/features/dex/api.ts:28-34`, `frontend/src/features/dex/hooks.ts:17-25`, `frontend/src/components/pokemon/PokemonSearchBox.tsx:22`, `:54`, `:135` |
| 20 | Gõ `/pokemon/generations` trên thanh địa chỉ thì sao? | Frontend chặn 4 tên trùng đường dẫn cố định của API và ném lỗi 404 giả lập, không gọi mạng; trang hiện "Không tìm thấy Pokémon". Nếu không chặn, backend trả mảng hồ sơ thế hệ và trang chi tiết đọc sai kiểu. | `frontend/src/features/pokemon-detail/api.ts:4-17`, `frontend/src/pages/PokemonDetailPage.test.tsx:341-356` |
| 21 | Trang Chi tiết phân biệt "không tìm thấy" với lỗi khác thế nào? | 404 hoặc mã `POKEMON_NOT_FOUND`, `INVALID_PARAMETER` thì hiện trang hướng dẫn về Pokédex. Lỗi khác hiện `ErrorState` có nút thử lại; thông điệp lấy theo mã lỗi, không hiện `detail` kỹ thuật. | `frontend/src/pages/PokemonDetailPage.tsx:19-38`, `frontend/src/pages/PokemonDetailPage.test.tsx:319-339`, `:358-371` |
| 22 | Cache chi tiết có dùng chung giữa trang không? | Có, key `['pokemon', 'detail', khóa chữ thường]`, `staleTime: Infinity`, dùng ở Chi tiết, So sánh, hero, Pokémon hôm nay, quiz, Team Builder. Điểm yếu: khóa là chuỗi trên URL nên `garchomp` và `445` là hai mục cache, có thể gọi lại cùng một Pokémon. | `frontend/src/features/pokemon-detail/hooks.ts:5-17`, `frontend/src/features/pokemon-detail/components/StatPanel.tsx:74` |
| 23 | Cây tiến hóa dựng thế nào, Eevee 8 nhánh xử lý ra sao? | API trả danh sách phẳng có `evolvesFromSpeciesId`. Frontend gom con theo cha, lấy loài không có cha làm gốc rồi đệ quy; Eevee có 8 con nên thành 8 nhánh. Nhánh tách tiếp như Wurmple được lồng; tập `placed` chặn chu trình. | `frontend/src/features/pokemon-detail/evolution.ts:55-84`, `frontend/src/features/pokemon-detail/evolution.test.ts:50-83` |
| 24 | Endpoint tiến hóa lỗi thì sao? | Khối Tiến hóa biến mất, không hiện lỗi, phần còn lại của trang vẫn đủ. Đây là thông tin phụ nên chọn ẩn thay vì làm rối trang. Trong lúc tải có khung giữ chỗ 384 px để khối dưới không nhảy. | `frontend/src/features/pokemon-detail/components/EvolutionChain.tsx:41-52`, `frontend/src/pages/PokemonDetailPage.test.tsx:257-276`, `:302-317` |
| 25 | Công thức tốc độ cấp 50? | `raw = floor((2 x gốc + IV + floor(EV/4)) x 50/100) + 5`, rồi nhân tính cách bằng số nguyên 9, 10, 11 chia 10 và làm tròn xuống. Garchomp gốc 102 ra 96, 122, 169. Không nhân 0,9 trực tiếp để tránh sai số dấu phẩy động. | `frontend/src/features/speed/level50.ts:21-31`, `frontend/src/features/speed/level50.test.ts:16-18` |
| 26 | "Nhanh hơn N%" tính trên tập nào? | Trên bảng mốc tốc độ gốc của 1.083 dạng thường và dạng vùng, bỏ chính Pokémon đó theo ID, lấy số chậm hơn chia tổng, làm tròn xuống. So tốc độ gốc là đủ vì cùng mức đầu tư thì thứ tự không đổi; làm tròn xuống để còn ai bằng tốc độ thì không bao giờ ra 100%. | `frontend/src/features/speed/level50.ts:41-59`, `frontend/src/features/speed/level50.test.ts:47-53`, `docs/api.md` Phần 2 mục XIII |
| 27 | "Vừa thua", "Vừa vượt" lấy từ đâu? | Bảng mốc xếp giảm dần theo tốc độ. "Vừa thua" là mốc cuối cùng còn nhanh hơn, "Vừa vượt" là mốc đầu tiên chậm hơn; mỗi mốc hiện tối đa 3 tên có link. | `frontend/src/features/speed/level50.ts:61-68`, `frontend/src/features/speed/components/SpeedBenchmark.tsx:83-84`, `:90-113` |
| 28 | Trang So sánh gọi bao nhiêu request, có thừa không? | Ba: chi tiết bên trái, chi tiết bên phải, rồi `/compare`. Đúng là thừa vì `CompareResponse` đã chứa 2 chi tiết. Lý do giữ: cần chi tiết riêng để hiện tên, ảnh trong ô chọn, báo 404 đúng bên, phát hiện trùng trước khi gọi `/compare` và dựng banner sớm; chi tiết cũng dùng chung cache với trang khác. | `frontend/src/pages/ComparePage.tsx:40-53`, `frontend/src/types/api.ts:82-91` |
| 29 | Chọn cùng một Pokémon hai bên thì sao? | Bị chặn ở 3 lớp: ô tìm ẩn Pokémon bên kia; `select` từ chối và báo; nếu URL nhập tay `left=garchomp&right=445` thì so `id` sau khi tải, hiện "Hai bên đang là cùng một Pokémon" và không gọi `/compare`. | `frontend/src/features/compare/components/ComparePicker.tsx:65`, `frontend/src/pages/ComparePage.tsx:46-48`, `:72-83`, `frontend/src/pages/ComparePage.test.tsx:274-282` |
| 30 | Thang của thanh chỉ số và radar tính thế nào? | Lấy chỉ số cao nhất của cả hai, làm tròn lên bội 50, kẹp trong 150-255. Tổng dùng thang 720 trừ khi có tổng lớn hơn. Hai bên luôn chung một thang nên so bằng mắt được. | `frontend/src/features/compare/scale.ts:4-21`, `frontend/src/features/compare/scale.test.ts:15-37` |
| 31 | Đòn cùng hệ và kết luận do ai tính? | Đòn cùng hệ tính ở client: lấy hệ của bên tấn công tra mảng `defense` 18 mục của bên kia. Kết luận 3 câu do backend sinh trong `verdict.summary`; frontend chỉ hiển thị. | `frontend/src/features/compare/components/StabPanel.tsx:22-27`, `frontend/src/features/compare/components/VerdictPanel.tsx:12-41` |
| 32 | Hệ số phòng thủ hệ kép tính thế nào? | Nhân hệ số của đòn lên từng hệ. Ví dụ Fire/Flying gặp Rock: 2 x 2 = 4; gặp Ground: 1 x 0 = 0; gặp Grass: 0,5 x 0,5 = 0,25. Sau đó bỏ nhóm x1 và gom theo hệ số giảm dần. | `frontend/src/lib/typeEffectiveness.ts:20-26`, `frontend/src/features/typechart/defense.ts:20-39` |
| 33 | Làm nổi bật hàng, cột trên ma trận hoạt động thế nào, sao không lưu lên URL? | State `focus` gồm trục và hệ; bấm lại cùng tiêu đề thì tắt. Ô sáng khi cùng hàng (trục tấn công) hoặc cùng cột (trục phòng thủ), ô khác mờ 20%. Đây là trạng thái xem tạm thời nên giữ trong `useState`, không đáng chia sẻ qua link. | `frontend/src/features/typechart/matrixFocus.ts:34-49`, `frontend/src/pages/TypeChartPage.tsx:25`, `:102` |
| 34 | Thứ tự hệ trên ma trận khác thứ tự API? | API trả 18 hệ theo ID (Normal, Fighting, Flying...). Frontend hiển thị theo `TYPE_NAMES` (Normal, Fire, Water...) qua `matrixTypes`; tra ô vẫn theo chỉ số của API nên không sai. Riêng Vòng tương khắc liệt kê theo thứ tự API. | `frontend/src/features/typechart/defense.ts:16-18`, `frontend/src/lib/typeEffectiveness.ts:9-18`, `:28-37` |
| 35 | Địa hình lấy Pokémon thế nào khi không có endpoint riêng? | Hệ của địa hình là nghịch đảo bảng hệ sang khung cảnh. Mỗi hệ gọi `GET /pokemon?type=x&size=100&sort=id,asc`, gộp bỏ trùng theo ID; số "N Pokémon hệ X" lấy `totalElements`. | `frontend/src/features/terrain/terrains.ts:52-54`, `frontend/src/features/terrain/hooks.ts:21-55`, `frontend/src/lib/scenes.ts:235-237` |
| 36 | Who's that Pokémon tạo lựa chọn thế nào để công bằng? | Bỏ trùng tên hiển thị, chọn đáp án khác lượt trước (khi có hơn 4 ứng viên), rút 3 nhiễu không hoàn lại, rồi trộn Fisher-Yates. Hàm nhận nguồn ngẫu nhiên làm tham số nên test được kết quả cố định. | `frontend/src/features/terrain/whosThat.ts:27-49`, `frontend/src/features/terrain/whosThat.test.ts:65-95` |
| 37 | ID địa hình lạ trên URL thì sao? | Trang vẫn gọi hook trước (đúng quy tắc hook) rồi trả `<Navigate to="/terrain" replace />`, nên về Đồng cỏ và URL lỗi không nằm trong lịch sử. | `frontend/src/pages/TerrainPage.tsx:46-53`, `frontend/src/pages/TerrainPage.test.tsx:128-134` |
| 38 | Chính sách thử lại khi lỗi? | Cấu hình chung: lỗi 4xx không thử lại vì gửi lại cũng sai; lỗi mạng, 5xx thử lại 1 lần. Không tự refetch khi đổi focus cửa sổ. Test tắt hẳn retry để chạy nhanh. | `frontend/src/lib/queryClient.ts:5-18`, `frontend/src/test/renderRoute.tsx:22` |
| 39 | Trang có tải hết JavaScript một lần không? | Không. Mỗi trang là route lazy, nạp chunk khi vào route; trong lúc nạp có khung chờ `aria-busy`. | `frontend/src/app/router.tsx:8-21`, `:33-60` |
| 40 | Giao diện mobile của Pokédex và So sánh khác desktop thế nào? | Pokédex: dưới 1024 px bộ lọc là ngăn kéo `<dialog>`, từ 1024 px là cột trái 256 px. So sánh: mobile bảng chỉ số hai dòng đứng trước radar và có 2 nút hành động; desktop là bảng `<table>`, radar đứng trước. | `frontend/src/pages/DexPage.tsx:112`, `frontend/src/features/dex/components/FilterSheet.tsx:14-29`, `frontend/src/features/compare/components/StatDuelTable.tsx:65`, `:112`, `frontend/src/pages/ComparePage.tsx:183`, `:189` |
| 41 | Muốn thêm một bộ câu hỏi quiz thì làm gì? | Thêm một phần tử vào `QUIZ_SETS` với `id`, `title`, `badge`, 6 câu thuộc 6 loại có sẵn. Huy hiệu tự sinh từ `QUIZ_BADGES`, nút chọn bộ tự hiện. Cần cập nhật test đang khẳng định đúng 5 bộ. | `frontend/src/features/landing/quiz.ts:103-374`, `frontend/src/features/landing/quiz.test.ts:68-87` |
| 42 | Muốn thêm bộ lọc mới cho Pokédex thì sửa đâu? | Thêm trường vào `DexFilter`, `parseDexFilter`, `toSearchParams`, `countActiveFilters`, tham số trong `fetchPokemonList` và control trong `DexFilters`; backend phải hỗ trợ tham số đó. Query key tự đổi vì là cả đối tượng `filter`. | `frontend/src/features/dex/useDexSearchParams.ts:23-100`, `frontend/src/features/dex/api.ts:7-26` |
| 43 | Test trang được viết thế nào? | Render route thật trong `createMemoryRouter` với QueryClient mới, thay `fetch` bằng `vi.stubGlobal` trả JSON giả, rồi tương tác bằng `userEvent` và kiểm URL, request đã gửi, nội dung theo vai trò ARIA. Logic thuần có unit test riêng. | `frontend/src/test/renderRoute.tsx:21-49`, `frontend/src/pages/DexPage.test.tsx:78-103` |
| 44 | Điểm yếu nào bạn biết mà chưa sửa? | Trang So sánh gọi 3 request; cache chi tiết tách theo tên và ID; quiz làm lại vô hạn nên có thể cày điểm; tiến độ giữa 2 tab ghi đè nhau; câu "1.083 dạng" ghi cứng trong `TeamSpeedList`; mock `/pokemon?gen=` trong test Tổng quan đã thừa sau khi đổi sang `/pokemon/generations`. | `frontend/src/pages/ComparePage.tsx:40-53`, `frontend/src/features/speed/components/TeamSpeedList.tsx:46-50`, `frontend/src/pages/LandingPage.test.tsx:72-82` |

### V. Lệch giữa code và tài liệu

- `docs/design-system.md:565` ghi biểu đồ thế hệ dùng `GET /api/v1/pokemon?gen=<n>&form=DEFAULT&size=1`; code gọi `GET /pokemon/generations` (`frontend/src/features/landing/api.ts:4-6`), khớp `docs/api.md` Phần 2 mục XIV.
- `docs/spec.md:255` (ma trận tính năng, dòng F07) liệt kê `GET /pokemon` cho trang Tổng quan; code dùng `GET /pokemon/generations` thay cho nó (cùng file, Phần 2 mục VII đã ghi đúng).
- `docs/spec.md:250` (F02) chỉ ghi `GET /pokemon/{idOrName}`; trang Chi tiết còn gọi `GET /pokemon/{id}/evolution` (`frontend/src/features/pokemon-detail/components/EvolutionChain.tsx:40`) và `GET /pokemon/speed-tiers` (`frontend/src/features/speed/components/SpeedBenchmark.tsx:18`).
- `docs/spec.md:252` (F04) chỉ ghi `GET /pokemon/compare`; `ComparePage` còn gọi 2 lần `GET /pokemon/{idOrName}` và `GET /pokemon/search` (`frontend/src/pages/ComparePage.tsx:40-41`).
- `docs/design-system.md:551` (sơ đồ trang Tổng quan) ghi "Thử tài Trainer: 5 câu, 3 đáp án mỗi câu"; code có 5 bộ, mỗi bộ 6 câu (`frontend/src/features/landing/quiz.ts:103-365`), khớp `docs/spec.md:124`.
- `docs/architecture.md:309` liệt kê trạng thái URL của `/pokedex` thiếu `view`; code ghi `view=list` lên URL (`frontend/src/features/dex/useDexSearchParams.ts:88`).
- `docs/architecture.md:342` xếp `TerrainPicker` vào nhóm "hook chỉ đổi query string"; thực tế `TerrainPicker` đổi path param `/terrain/{id}` (`frontend/src/features/terrain/components/TerrainPicker.tsx:49-50`). Phần `preventScrollReset` thì khớp.
- `docs/design-system.md:447` lấy ví dụ skeleton "24 card xám"; `PokemonGridSkeleton` render 12 ô (`frontend/src/features/dex/components/PokemonGrid.tsx:11`). Tài liệu ghi là "ví dụ" nên mức lệch nhỏ.
- `docs/design-system.md:425` ghi chữ "VS" font Display 104 px; code dùng huy hiệu tròn 104 px (`md:size-26`) với chữ 40 px (`frontend/src/features/compare/components/VersusBanner.tsx:142`).
- `docs/design-system.md:423` ghi "tên hệ ở hàng, cột là nút `aria-pressed`"; code làm cả tiêu đề hàng lẫn tiêu đề cột là nút `aria-pressed` (`frontend/src/features/typechart/components/TypeMatrixTable.tsx:80-91`, `:106-115`). Có thể là cách viết tắt, chưa xác định ý tài liệu.
- `docs/folder-structure.md:167` liệt kê `features/typechart/` chỉ có `api.ts, hooks.ts, components/`; thực tế còn `defense.ts`, `matrixFocus.ts`, `useDefendingTypes.ts` (có ở bảng `:213`) và `typeMatrixFixture.ts` (không được nhắc ở đâu). Tương tự `pokemon-detail/` (`:166`) thiếu `evolution.ts`, `labels.ts` ở cây thư mục; `SectionTitle` và `SpeedPercentBar` không có trong bảng ánh xạ.
- `docs/architecture.md:325`, `:340` mô tả tiến độ Trainer "đọc khi mở, ghi khi thay đổi" nhưng không nhắc cơ chế đồng bộ giữa tab bằng sự kiện `storage` (`frontend/src/features/trainer/useTrainerProgress.ts:33-39`). Đây là thiếu sót mô tả, không mâu thuẫn.

---

## Phần 7. Team Builder từ đầu đến cuối

- Phạm vi: `frontend/src/features/team-builder/**` (6 file lõi, 12 component, 5 file test), `frontend/src/pages/TeamBuilderPage.tsx`, `frontend/src/pages/SharedTeamPage.tsx` và 2 file test của chúng. Tổng 27 file. Backend chỉ trích dẫn điểm đến (Controller, Service), không phân tích sâu.

### I. Bức tranh chung

```mermaid
flowchart LR
    subgraph URLS["Trạng thái trình duyệt"]
        URL[("URL: ids, six, add")]
        LS[("localStorage: pokenexus.teamDraft")]
    end
    subgraph PAGES["Trang"]
        TBP["TeamBuilderPage"]
        STP["SharedTeamPage"]
    end
    subgraph HOOKS["Hook"]
        UTD["useTeamDraft"]
        UTA["useTeamAnalysis"]
        UREC["useRecommendations"]
        USAVE["useSaveTeam"]
        USH["useSharedTeam"]
        UPD["usePokemonDetails (pokemon-detail)"]
        USB["PokemonSearchBox + usePokemonSearch (debounce 250 ms)"]
    end
    subgraph API["frontend/src/features/team-builder/api.ts, pokemon-detail/api.ts, lib/http.ts"]
        A1["analyzeTeam"]
        A2["fetchRecommendations"]
        A3["createTeam"]
        A4["fetchSharedTeam"]
        A5["searchAllForms"]
        A6["fetchPokemonDetail"]
    end
    subgraph BE["Backend /api/v1"]
        E1["POST /synergy/analyze: SynergyController.analyze -> SynergyAnalyzer"]
        E2["POST /synergy/recommendations: SynergyController.recommend -> RecommendationEngine"]
        E3["POST /teams: TeamController.create -> SaveRateLimiter, TeamService.create"]
        E4["GET /teams/shared/code: TeamController.shared -> TeamService.findByShareCode"]
        E5["GET /pokemon/search: PokemonController.search"]
        E6["GET /pokemon/idOrName: PokemonController.detail"]
    end
    URL <--> UTD
    LS <--> UTD
    TBP --> UTD
    TBP --> UTA
    TBP --> UREC
    TBP --> USB
    TBP -->|SaveTeamDialog| USAVE
    TBP -->|ShowdownDialogs| UPD
    TBP -->|ShowdownImport| A5
    TBP -->|ShowdownImport| A6
    STP --> USH
    STP --> UTA
    STP -->|ShowdownExport| UPD
    UTA --> A1 --> E1
    UREC --> A2 --> E2
    USAVE --> A3 --> E3
    USH --> A4 --> E4
    A5 --> E5
    UPD --> A6 --> E6
    USB --> E5
```

- **Trang là nơi ghép, không gọi `fetch`:** `TeamBuilderPage` chỉ gọi hook (`frontend/src/pages/TeamBuilderPage.tsx:60-77`); mọi HTTP đi qua `frontend/src/features/team-builder/api.ts` và `frontend/src/lib/http.ts:36-71`, đúng quy tắc của `frontend/CLAUDE.md`, Phần 3.
- **Một nguồn sự thật cho đội nháp:** `useTeamDraft` (`useReducer`) giữ `ids` (tối đa 5) và `sixth`; URL và `localStorage` chỉ là bản đồng bộ (`frontend/src/features/team-builder/useTeamDraft.ts:100-165`).
- **Dữ liệu server do TanStack Query quản lý:** phân tích, đề xuất, đội chia sẻ là query có `staleTime: Infinity`; lưu đội là mutation (`frontend/src/features/team-builder/hooks.ts:16-52`).
- **Tính toán Synergy nằm hết ở backend:** frontend không tính hệ số, `pressure` hay `teamScore`; chỉ sắp xếp, lọc và hiển thị (`frontend/src/features/team-builder/teamAnalysis.ts:17-35`).
- **Logic thuần tách khỏi component:** `teamAnalysis.ts` (định dạng, validate tên, dựng body lưu) và `showdown.ts` (parse, chuẩn hóa tên, lập kế hoạch nhập) không phụ thuộc React, test bằng unit test thuần.
- **Không có endpoint riêng cho Showdown:** nhập dùng `GET /pokemon/{idOrName}` và `GET /pokemon/search` với mọi `form`; xuất dùng `GET /pokemon/{id}` (`frontend/src/features/team-builder/components/ShowdownDialogs.tsx:22-28`, `docs/spec.md:186`).
- **Ranh giới phạm vi:** panel "Tốc độ cấp 50" dùng `TeamSpeedList` của feature `speed` (`frontend/src/pages/TeamBuilderPage.tsx:367`), ô tìm kiếm dùng `PokemonSearchBox` chung (`frontend/src/pages/TeamBuilderPage.tsx:228-234`); hai phần này thuộc chương khác.
- **Lỗi hiển thị bằng `code`, không bằng `detail`:** `ApiError.code` đi qua `errorMessageFor` (`frontend/src/lib/errorMessages.ts:20-25`), test khẳng định "developer detail" không lộ ra (`frontend/src/pages/TeamBuilderPage.test.tsx:366`).

### II. Từng file

#### I. Lõi tính năng `frontend/src/features/team-builder/`

**1. `api` (`frontend/src/features/team-builder/api.ts`)**

- **Vai trò:** lớp gọi REST của Team Builder và các hằng số dùng chung (giới hạn đội, số đề xuất, độ dài tên).
- **Thành phần chính:**
  - Hằng số: `RECOMMENDATION_LIMIT = 3`, `DEFAULT_PLAY_STYLE = 'BALANCE'`, `MAX_TEAM_SIZE = 6`, `TEAM_NAME_MAX_LENGTH = 60` (`frontend/src/features/team-builder/api.ts:14-17`).
  - `isValidShareCode(code)`: regex `^[A-Za-z0-9]{8}$` (`frontend/src/features/team-builder/api.ts:19`, `23-25`).
  - `sharePath(shareCode)`: trả `/team/{code}` (`frontend/src/features/team-builder/api.ts:27-29`).
  - `analyzeTeam(ids, signal?)`: `POST /synergy/analyze` body `{ pokemonIds }`, copy mảng để không lộ tham chiếu readonly (`frontend/src/features/team-builder/api.ts:31-37`).
  - `fetchRecommendations(ids, limit, excludeLegendary, playStyle, signal?)`: chỉ thêm `excludeLegendary` khi `true`, chỉ thêm `playStyle` khi khác `BALANCE` (`frontend/src/features/team-builder/api.ts:46-51`), để body ngắn và dựa vào mặc định của backend (`backend/src/main/java/com/pokenexus/synergy/dto/RecommendationRequest.java:22-26`).
  - `createTeam(request)`: `POST /teams`, không truyền `signal` nên không hủy được (`frontend/src/features/team-builder/api.ts:55-57`).
  - `fetchSharedTeam(code, signal?)`: `GET /teams/shared/{code}` có `encodeURIComponent` (`frontend/src/features/team-builder/api.ts:59-61`).
  - `searchAllForms(query, signal?)`: `GET /pokemon/search` với `limit=10` và cả 5 `form` (`frontend/src/features/team-builder/api.ts:20-21`, `63-69`).
- **Phụ thuộc:** `getJson`, `postJson` (`frontend/src/lib/http.ts:36-51`), kiểu từ `frontend/src/types/api.ts`. Được dùng bởi `frontend/src/features/team-builder/hooks.ts`, `frontend/src/features/team-builder/teamAnalysis.ts`, `ShowdownDialogs`, `SaveTeamDialog`, `ShareLinkField`, `RecommendationList`, hai trang.
- **Dữ liệu:** 5 endpoint ở trên; query string mảng được lặp khóa `form=DEFAULT&form=REGIONAL&...` (`frontend/src/lib/http.ts:29-30`).
- **Biên và lỗi:** mọi lỗi HTTP thành `ApiError(status, code)`; lỗi mạng thành `ApiError(0, 'NETWORK_ERROR')`; `AbortError` được ném lại nguyên vẹn để không hiện lỗi giả khi query bị hủy (`frontend/src/lib/http.ts:53-71`).
- **Test:** không có test riêng; được kiểm gián tiếp qua `bodiesSentTo` trong `frontend/src/pages/TeamBuilderPage.test.tsx:109-114`, `156-159`, `176-179`.

**2. `hooks` (`frontend/src/features/team-builder/hooks.ts`)**

- **Vai trò:** bọc API bằng TanStack Query và tính chênh lệch điểm đội giữa hai lần phân tích.
- **Thành phần chính:**
  - `useTeamAnalysis(ids)`: key `['synergy', 'analyze', ids]`, `enabled: ids.length > 0`, `staleTime: Infinity`, `placeholderData: keepPreviousData` (`frontend/src/features/team-builder/hooks.ts:16-24`).
  - `useRecommendations(ids, excludeLegendary = false, playStyle = 'BALANCE', limit = 3)`: key `['synergy', 'recommendations', ids, limit, excludeLegendary, playStyle]`, cùng `enabled`, `staleTime`, `placeholderData` (`frontend/src/features/team-builder/hooks.ts:26-39`).
  - `useSaveTeam()`: `useMutation({ mutationFn: createTeam })` (`frontend/src/features/team-builder/hooks.ts:41-43`).
  - `useSharedTeam(code)`: key `['teams', 'shared', code]`, `enabled: isValidShareCode(code)`, `staleTime: Infinity`, không có placeholder (`frontend/src/features/team-builder/hooks.ts:45-52`).
  - `useScoreDelta(score, teamKey)`: giữ `{ teamKey, score, delta }` trong state; `score` undefined thì xóa lịch sử, trả 0; `teamKey` đổi thì `delta = round(score mới) - round(score cũ)`; lần đầu trả 0 (`frontend/src/features/team-builder/hooks.ts:54-72`). Cập nhật state ngay trong render, đúng mẫu "điều chỉnh state khi prop đổi" của React.
- **Phụ thuộc:** `frontend/src/features/team-builder/api.ts`; dùng bởi `TeamBuilderPage`, `SharedTeamPage`, `SaveTeamDialog`.
- **Dữ liệu:** 3 query key và 1 mutation ở trên. `signal` của TanStack được truyền xuống `fetch` (`frontend/src/features/team-builder/hooks.ts:19`, `34`, `48`), nên query mất observer khi key đổi có thể bị hủy.
- **Biên và lỗi:** retry mặc định của app: không retry lỗi 4xx, thử lại 1 lần với lỗi khác (`frontend/src/lib/queryClient.ts:5-8`); `refetchOnWindowFocus: false` (`frontend/src/lib/queryClient.ts:15`). Key chứa mảng `ids` theo thứ tự, nên `[6,130]` và `[130,6]` là hai cache khác nhau.
- **Test:** không có test riêng; `useScoreDelta` được kiểm qua "+12 so với lần trước" (`frontend/src/pages/TeamBuilderPage.test.tsx:209-233`) và "+28" (`frontend/src/pages/TeamBuilderPage.test.tsx:273-294`).

**3. `useTeamDraft` (`frontend/src/features/team-builder/useTeamDraft.ts`)**

- **Vai trò:** state toàn cục duy nhất của frontend: đội nháp 5 thành viên cộng thành viên slot 6, đồng bộ hai chiều với URL và `localStorage`.
- **Thành phần chính:**
  - Hằng số: `MAX_DRAFT_SIZE = 5`, `DRAFT_PARAM = 'ids'`, `ADD_PARAM = 'add'`, `SIXTH_PARAM = 'six'`, `DRAFT_STORAGE_KEY = 'pokenexus.teamDraft'` (`frontend/src/features/team-builder/useTeamDraft.ts:4-8`).
  - `sanitizeIds`: lọc số nguyên an toàn dương, bỏ trùng bằng `Set`, cắt còn 5 (`frontend/src/features/team-builder/useTeamDraft.ts:22-32`).
  - `parseDraftIds(raw)`: tách dấu phẩy, trim, chỉ nhận chuỗi toàn chữ số `^\d+$` rồi `sanitizeIds` (`frontend/src/features/team-builder/useTeamDraft.ts:34-42`); `1e3`, `-4`, `abc` bị loại.
  - `teamDraftReducer`: `add` bỏ qua ID sai, trùng hoặc khi đủ 5 (trả lại đúng object cũ); `remove`; `replace` (sanitize, gắn `sixth`); `setSixth` (giá trị sai thì xóa); `clear` (`frontend/src/features/team-builder/useTeamDraft.ts:48-65`).
  - `initialDraft(params)`: URL `ids` thắng `localStorage`; đọc `six`; nếu có `add` thì chạy reducer `add` lên bản nháp (`frontend/src/features/team-builder/useTeamDraft.ts:88-94`).
  - `useTeamDraft()`: trả `{ ids, sixth, isFull, add, remove, replace, clear, setSixth }`; các hàm bọc `useCallback` để tham chiếu ổn định (`frontend/src/features/team-builder/useTeamDraft.ts:146-164`).
- **Cơ chế đồng bộ (effect `frontend/src/features/team-builder/useTeamDraft.ts:109-144`):**
  - `syncedRef` nhớ khóa `"ids|six"` lần đồng bộ cuối (`frontend/src/features/team-builder/useTeamDraft.ts:104`).
  - Nhánh 1, state vừa đổi do người dùng: ghi `localStorage`, ghi URL nếu URL lệch (`frontend/src/features/team-builder/useTeamDraft.ts:130-136`).
  - Nhánh 2, URL đổi từ bên ngoài (Link, Back/Forward) và có `ids` khác state, không có `add`: `dispatch replace` theo URL (`frontend/src/features/team-builder/useTeamDraft.ts:137-141`).
  - Nhánh 3, còn lại (ví dụ vào `/team-builder` trống từ menu): giữ state, ghi lại URL (`frontend/src/features/team-builder/useTeamDraft.ts:142-143`).
  - Ghi URL bằng `setSearchParams(..., { replace: true, preventScrollReset: true })` và luôn xóa `add` (`frontend/src/features/team-builder/useTeamDraft.ts:116-128`): không sinh mục lịch sử cho mỗi lần sửa và không bị `ScrollRestoration` (`frontend/src/app/layout/AppLayout.tsx:22`) kéo về đầu trang.
- **Phụ thuộc:** `useSearchParams` của React Router. Dùng bởi `TeamBuilderPage`; `MAX_DRAFT_SIZE` dùng thêm ở `TeamSlots`, `SharedTeamPage`.
- **Dữ liệu:** URL `ids` (ví dụ `ids=6,130,149`), `six` (một ID), `add` (một ID, chỉ lấy giá trị `add` đầu tiên vì `URLSearchParams.get`); `localStorage['pokenexus.teamDraft']` chỉ lưu chuỗi `ids`, không lưu `six` (`frontend/src/features/team-builder/useTeamDraft.ts:133`, `142`). Nguồn tạo `?add=`: `frontend/src/features/landing/components/DailyPokemon.tsx:163`, `frontend/src/features/pokemon-detail/components/StatPanel.tsx:80`, `frontend/src/pages/ComparePage.tsx:197`.
- **Biên và lỗi:** `localStorage` ném lỗi (chế độ riêng tư, bị chặn) thì nuốt lỗi, đọc ra mảng rỗng (`frontend/src/features/team-builder/useTeamDraft.ts:67-82`); `six` sai định dạng bị bỏ; `sixth` được giữ lại qua `remove` của reducer và chỉ bị xóa bởi `clear` hoặc `setSixth(null)`.
- **Test:** `frontend/src/features/team-builder/useTeamDraft.test.tsx` (Phần 2, mục IV.1).

**4. `teamAnalysis` (`frontend/src/features/team-builder/teamAnalysis.ts`)**

- **Vai trò:** hàm thuần định dạng và chuyển đổi dữ liệu phân tích, validate tên đội, dựng danh sách thành viên để lưu.
- **Thành phần chính:**
  - `pressureLevel(pressure)`: `<= 0` An toàn, `<= 2` Thấp, `<= 4` Trung bình, còn lại Cao; trả `{ label, className }` theo token `bg-pressure-*` (`frontend/src/features/team-builder/teamAnalysis.ts:10-22`).
  - `sortRowsByPressure(rows)`: `criticalHole` trước, rồi `pressure` giảm, rồi `weakCount` giảm, hòa thì giữ thứ tự API (sort ổn định bằng chỉ số gốc) (`frontend/src/features/team-builder/teamAnalysis.ts:24-35`).
  - `formatScore(score)`: làm tròn thành số nguyên (`frontend/src/features/team-builder/teamAnalysis.ts:37-39`).
  - `scoreBarClassName(score)`: từ 50 `bg-stat-good`, từ 20 `bg-stat-mid`, dưới 20 `bg-danger` (`frontend/src/features/team-builder/teamAnalysis.ts:41-45`).
  - `analysisSummary({ teamScore, typeMatrix })`: câu cho vùng `aria-live`, liệt kê các hệ `criticalHole` theo thứ tự API (`frontend/src/features/team-builder/teamAnalysis.ts:47-53`).
  - `buildTeamMembers(ids, sixthId)`: đánh `slot` từ 1, nối `sixthId` nếu chưa có trong `ids`, `nickname: null` (`frontend/src/features/team-builder/teamAnalysis.ts:55-61`).
  - `teamNameError(name)`: sau `trim`, rỗng thì "Hãy đặt tên cho đội.", quá 60 thì "Tên đội tối đa 60 ký tự." (`frontend/src/features/team-builder/teamAnalysis.ts:63-68`).
  - `formatSavedDate(iso)`: `Intl.DateTimeFormat('vi-VN')` dạng `dd/mm/yyyy`, chuỗi sai trả `null` (`frontend/src/features/team-builder/teamAnalysis.ts:70-79`).
- **Phụ thuộc:** `typeLabel` (`frontend/src/lib/pokemonTypes.ts`), `TEAM_NAME_MAX_LENGTH`. Dùng bởi `WeaknessHeatmap`, `TeamScoreGauge`, `RecommendationCard`, `SaveTeamDialog`, hai trang.
- **Dữ liệu:** đọc `teamScore`, `typeMatrix[].criticalHole`, `attackingType`, `pressure`, `weakCount`; ghi body `TeamMemberRequest[]`.
- **Biên và lỗi:** ma trận rỗng thì sort trả rỗng; `sixthId` trùng `ids` không bị thêm lần hai; tên chỉ khoảng trắng bị coi là rỗng.
- **Test:** `frontend/src/features/team-builder/teamAnalysis.test.ts` (Phần 2, mục IV.2).

**5. `showdown` (`frontend/src/features/team-builder/showdown.ts`)**

- **Vai trò:** chuyển qua lại giữa văn bản đội Pokémon Showdown và ID Pokémon trong DB, không phụ thuộc React.
- **Thành phần chính:**
  - `parseShowdown(text)`: tách dòng theo `\r?\n`; dòng trống hoặc bắt đầu `===` kết thúc khối; dòng đầu mỗi khối là dòng tên, các dòng sau trong khối bật `ignoredDetails`; có `@` cũng bật `ignoredDetails` và cắt phần vật phẩm; số dòng tính từ 1 (`frontend/src/features/team-builder/showdown.ts:98-119`).
  - `speciesOf(head)`: bỏ hậu tố giới tính `(M)`/`(F)` ở cuối, nếu còn `(...)` ở cuối thì lấy phần trong ngoặc làm tên loài (dạng `Biệt danh (Loài)`) (`frontend/src/features/team-builder/showdown.ts:36-37`, `92-96`).
  - `slugify`: tách dấu NFD rồi bỏ dấu, chữ thường, `♀` thành `-f`, `♂` thành `-m`, bỏ `' ’ . : %`, ký tự khác thành `-`, cắt `-` hai đầu (`frontend/src/features/team-builder/showdown.ts:75-85`).
  - `normalizeShowdownName(species)`: `slugify` rồi tra bảng ngoại lệ Showdown sang PokéAPI, ví dụ `indeedee-f` thành `indeedee-female`, `necrozma-dusk-mane` thành `necrozma-dusk`, `ogerpon-wellspring` thành `ogerpon-wellspring-mask` (`frontend/src/features/team-builder/showdown.ts:42-57`, `87-90`, `121-124`).
  - `resolveShowdownName(species, api)`: tên phải khớp `^[a-z0-9-]{1,60}$`; thử đúng tên (`getPokemon`, 404 thì `null`, lỗi khác ném tiếp); rồi tìm theo tiền tố (chỉ khi 2-30 ký tự, lấy kết quả đầu tiên có `name.startsWith`); rồi bỏ dần đoạn `-xxx` cuối và thử đúng tên (`frontend/src/features/team-builder/showdown.ts:126-156`).
  - `planImport(entries, refs)`: dòng có ref `null` vào `unmatched`; bỏ trùng theo `id` (giữ lần đầu); lấy tối đa 6; `ids` là 5 con đầu, `sixth` là con thứ 6; đếm `duplicates`, `overflow` (`frontend/src/features/team-builder/showdown.ts:158-176`).
  - `toShowdownName({ name, speciesName, formCategory })`: bảng ngoại lệ ngược trước; dạng `DEFAULT` hoặc `name === speciesName` dùng tên loài; tên có tiền tố loài thì `Loài-HậuTố`; còn lại title-case cả tên (`frontend/src/features/team-builder/showdown.ts:192-200`). Tên loài đặc biệt (`Mr. Mime`, `Farfetch’d`, `Type: Null`) và loài có dấu cách (`Iron Treads`, `Tapu Koko`) xử lý ở `frontend/src/features/team-builder/showdown.ts:59-73`, `185-190`.
  - `formatShowdownTeam(names)`: mỗi tên một khối, cách nhau một dòng trống, kết thúc bằng `\n` (`frontend/src/features/team-builder/showdown.ts:202-204`).
- **Phụ thuộc:** `ApiError` để phân biệt 404. Dùng bởi `ShowdownDialogs.tsx`.
- **Dữ liệu:** `ShowdownLookup` là interface tiêm vào (`frontend/src/features/team-builder/showdown.ts:14-17`), nên unit test thay bằng mock; bản thật gọi `GET /pokemon/{name}` và `GET /pokemon/search` (`frontend/src/features/team-builder/components/ShowdownDialogs.tsx:22-28`).
- **Biên và lỗi:**
  - Hai dòng tên liền nhau không có dòng trống: dòng thứ hai bị coi là chi tiết và bỏ qua (`frontend/src/features/team-builder/showdown.ts:108-111`).
  - Kết quả tìm tiền tố chỉ chứa chuỗi ở giữa tên (ví dụ `mega-thing` cho `thing`) không được nhận (`frontend/src/features/team-builder/showdown.ts:138`).
  - Dạng mỹ phẩm không có trong dữ liệu (ví dụ `Sinistcha-Masterpiece`) rơi về tên loài nhờ bước bỏ đoạn cuối (`frontend/src/features/team-builder/showdown.ts:149-154`).
  - Lỗi khác 404 (503, mạng) được ném ra để dialog báo lỗi thay vì âm thầm coi là không nhận ra (`frontend/src/features/team-builder/showdown.ts:130-131`).
- **Test:** `frontend/src/features/team-builder/showdown.test.ts` (Phần 2, mục IV.3).

**6. `testing` (`frontend/src/features/team-builder/testing.tsx`)**

- **Vai trò:** fixture và tiện ích test dùng chung cho test trang và component của Team Builder.
- **Thành phần chính:**
  - 8 `PokemonRef` mẫu (Charizard 6, Gyarados 130, Dragonite 149, Talonflame 663, Volcarona 637, Tyranitar 248, Empoleon 395, Garchomp 445) và `SPEC_TEAM` là 5 con đầu (`frontend/src/features/team-builder/testing.tsx:17-26`).
  - `API_TYPE_ORDER`: 18 hệ theo ID PokéAPI, khớp quy ước mảng hệ của API (`frontend/src/features/team-builder/testing.tsx:28-47`).
  - `SPEC_ROCK_ROW`: dòng Rock của đội mẫu `[4,2,2,4,4]`, `pressure 8`, `criticalHole true` (`frontend/src/features/team-builder/testing.tsx:49-55`).
  - `analysisFor(members, teamScore, rows)`: dựng `AnalyzeResponse` 18 dòng trung tính rồi ghi đè từng hệ; độ phủ, radar, 2 insight cố định (`frontend/src/features/team-builder/testing.tsx:57-98`).
  - `recommendationsOf(...[pokemon, score])`: dựng `RecommendationResponse` có lý do Rock và cảnh báo Ice cố định (`frontend/src/features/team-builder/testing.tsx:100-113`).
  - `jsonResponse`, `problem`: `Response` thật, lỗi dùng `application/problem+json` (`frontend/src/features/team-builder/testing.tsx:115-124`).
  - `routeFetch(handlers)`: stub `fetch` toàn cục, định tuyến theo `"METHOD /path"` sau `/api/v1`, route lạ trả 404 `ROUTE_NOT_FOUND` (`frontend/src/features/team-builder/testing.tsx:128-138`).
  - `bodiesSentTo(fetchMock, path)`: lấy các body JSON đã gửi tới một path (`frontend/src/features/team-builder/testing.tsx:140-144`).
  - `renderTeamRoute(path)`: `QueryClient` với `retry: false`, `createMemoryRouter` 2 route thật và 1 route `*`; trả `router` để test đọc `router.state.location` (`frontend/src/features/team-builder/testing.tsx:146-162`).
- **Phụ thuộc:** Vitest, Testing Library, React Router, hai trang. Dùng bởi `TeamBuilderPage.test.tsx`, `SharedTeamPage.test.tsx`, `WeaknessHeatmap.test.tsx`, `ShowdownDialogs.test.tsx`.
- **Dữ liệu:** không gọi mạng thật; stub ở tầng `fetch` nên `frontend/src/lib/http.ts`, TanStack Query và router đều chạy thật.
- **Biên và lỗi:** `GARCHOMP` được export nhưng không test nào trong phạm vi import (grep chỉ thấy các hằng `GARCHOMP` khai báo riêng ở file test khác).
- **Test:** là tiện ích test, không có test riêng.

#### II. Component `frontend/src/features/team-builder/components/`

**1. `TeamSlots` (`frontend/src/features/team-builder/components/TeamSlots.tsx`)**

- **Vai trò:** lưới 5 slot người dùng chọn và 1 slot đề xuất; kèm `ReadOnlyTeamSlots` cho trang đội chia sẻ.
- **Thành phần chính:**
  - `TeamSlots` props: `ids`, `refFor`, `sixthId`, `suggestion`, `unavailable?`, `onRemove`, `onRemoveSixth`, `onAddSuggestion`, `onAddClick` (`frontend/src/features/team-builder/components/TeamSlots.tsx:8-18`).
  - 5 slot đầu: có ID thì `TeamMemberCard`, trống thì nút "Thêm Pokémon" có chữ ẩn "vào slot N" cho trình đọc màn hình (`frontend/src/features/team-builder/components/TeamSlots.tsx:52-79`).
  - Slot 6 có 3 trạng thái: có `sixthId` thì thẻ thành viên nhãn "Đề xuất"; đội đủ 5 và có `suggestion` thì khung viền `primary` với tên và nút "Thêm vào đội"; còn lại "Ô trống" kèm "Chọn từ thẻ đề xuất" hoặc "Mở khi đủ 5 thành viên" (`frontend/src/features/team-builder/components/TeamSlots.tsx:80-113`).
  - `ReadOnlyTeamSlots({ members })`: lưới tự chia, mỗi `li` key theo `slot`, xuất hiện lần lượt bằng `staggerDelay` (`frontend/src/features/team-builder/components/TeamSlots.tsx:122-132`).
- **Phụ thuộc:** `TeamMemberCard`, `SharedMemberCard`, `MAX_DRAFT_SIZE`, `formatPokemonName`, `staggerDelay`. Dùng bởi `TeamBuilderPage` và `SharedTeamPage`.
- **Dữ liệu:** không gọi API; tên lấy qua callback `refFor`.
- **Biên và lỗi:** key `id ?? empty-index` khiến thẻ mới gắn lại và chạy `animate-pop-in`; lưới 3 cột trên mobile (3 x 2), 2 cột từ `lg` (`frontend/src/features/team-builder/components/TeamSlots.tsx:51`).
- **Test:** không có test riêng; kiểm qua `frontend/src/pages/TeamBuilderPage.test.tsx:235-247`, `296-306` và `frontend/src/pages/SharedTeamPage.test.tsx:78-93`.

**2. `TeamMemberCard` (`frontend/src/features/team-builder/components/TeamMemberCard.tsx`)**

- **Vai trò:** thẻ một thành viên có nút bỏ (Team Builder) và thẻ chỉ đọc dạng link (đội chia sẻ).
- **Thành phần chính:**
  - `TeamMemberCard({ id, pokemon?, unavailable?, badge?, onRemove })`: tên từ `pokemon` hoặc `Pokémon #id`; dải màu khung cảnh theo hệ; sprite theo `id`; nhãn hệ; nút xóa `aria-label="Bỏ {tên} khỏi đội"`, vùng chạm 44 px trên mobile (`frontend/src/features/team-builder/components/TeamMemberCard.tsx:36-104`).
  - Chưa có `pokemon`: hiện "Đang tải…" hoặc "Chưa tải được" khi `unavailable`, thay nhãn hệ bằng số Pokédex (`frontend/src/features/team-builder/components/TeamMemberCard.tsx:70-89`).
  - `SharedMemberCard({ member })`: `Link` tới `/pokemon/{name}`, số Pokédex, tên, biệt danh trong ngoặc kép, `TypeBadge`, tên khung cảnh (`frontend/src/features/team-builder/components/TeamMemberCard.tsx:110-145`).
- **Phụ thuộc:** `PokemonSprite` (URL ảnh sinh từ ID, ADR 0005), `DexNumber`, `TypeBadge`, `sceneForTypes`, `typeScopeClassName`. Dùng bởi `TeamSlots`.
- **Dữ liệu:** `PokemonRef` (`id`, `name`, `types`) hoặc `TeamMember` (thêm `slot`, `nickname`).
- **Biên và lỗi:** không có hệ thì khung cảnh mặc định của `sceneForTypes` và scope `normal` (`frontend/src/features/team-builder/components/TeamMemberCard.tsx:44-45`); ảnh lỗi do `PokemonSprite` tự fallback.
- **Test:** không có test riêng; kiểm qua "Bỏ Tyranitar khỏi đội" (`frontend/src/pages/TeamBuilderPage.test.tsx:246`), "Chưa tải được" (`frontend/src/pages/TeamBuilderPage.test.tsx:466-467`), biệt danh và tên khung cảnh (`frontend/src/pages/SharedTeamPage.test.tsx:89-91`).

**3. `WeaknessHeatmap` (`frontend/src/features/team-builder/components/WeaknessHeatmap.tsx`)**

- **Vai trò:** vẽ "bản đồ điểm yếu" 18 hệ tấn công x từng thành viên từ `typeMatrix`, có bản bảng (từ `md`) và bản thẻ (dưới `md`).
- **Thành phần chính:**
  - `WeaknessHeatmap({ members, rows, compact? })`: `sorted = sortRowsByPressure(rows)`, `pressured` là hàng có `pressure > 0` hoặc `criticalHole` (`frontend/src/features/team-builder/components/WeaknessHeatmap.tsx:61-63`, `322-332`).
  - Bảng: `tableRows` là `pressured` khi `compact` hoặc khi bật ô "Chỉ hiện N hệ đang gây áp lực", ngược lại đủ 18 hàng (`frontend/src/features/team-builder/components/WeaknessHeatmap.tsx:333`, `351-365`).
  - Thẻ: `cardRows` mặc định chỉ hệ có áp lực, nút "Xem đủ 18 hệ" và "Chỉ xem hệ gây áp lực" khi không `compact` (`frontend/src/features/team-builder/components/WeaknessHeatmap.tsx:334`, `373-381`); có chú giải 6 hệ số (`frontend/src/features/team-builder/components/WeaknessHeatmap.tsx:42`, `304-320`).
  - `HeatmapTable`: `caption` ẩn, cột dính trái, tên thành viên viết dọc, ô x1 là `NeutralMark`, ô khác `MultiplierCell`, cột Yếu, Kháng (ẩn khi `compact`), cột Mức hở có `title="Mức hở N"` (`frontend/src/features/team-builder/components/WeaknessHeatmap.tsx:113-223`).
  - Hàng `criticalHole`: `data-critical`, viền trái `danger`, nhãn "Lỗ hổng" kèm chữ ẩn "nghiêm trọng", hiệu ứng `pop-in` và `pulse-ring` (`frontend/src/features/team-builder/components/WeaknessHeatmap.tsx:88-94`, `171-183`).
  - `HeatmapCards`: mỗi hệ một thẻ, ô từng thành viên có chữ ẩn "{tên} nhận", câu "Yếu: ... Kháng: ..." từ `matchupNote` (`frontend/src/features/team-builder/components/WeaknessHeatmap.tsx:77-86`, `230-302`).
  - `AnalysisHeatmap({ analysis, compact? })`: lỗi thì `ErrorState` với thông điệp theo `code` và nút "Thử lại" gọi `refetch`; chưa có data thì skeleton; có data thì bọc `aria-busy` và mờ 60% khi là placeholder (`frontend/src/features/team-builder/components/WeaknessHeatmap.tsx:398-416`).
  - `WeaknessHeatmapSkeleton`: 8 thanh và chữ ẩn "Đang phân tích đội…" (`frontend/src/features/team-builder/components/WeaknessHeatmap.tsx:418-431`).
- **Phụ thuộc:** `pressureLevel`, `sortRowsByPressure`, `MultiplierCell`, `multiplierClassName`, `NeutralMark`, `TypeBadge`, `ErrorState`, `errorMessageFor`, `formatMultiplier`. Dùng bởi `TeamBuilderPage` (`frontend/src/pages/TeamBuilderPage.tsx:323`) và `SharedTeamPage` với `compact` (`frontend/src/pages/SharedTeamPage.tsx:164`).
- **Dữ liệu:** `AnalyzeResponse.members` (cột) và `typeMatrix[]` (`attackingType`, `multipliers` cùng thứ tự `members`, `weakCount`, `resistCount`, `pressure`, `criticalHole`).
- **Biên và lỗi:** không hệ nào có áp lực thì dòng "Không hệ tấn công nào đang gây áp lực cho đội." (`frontend/src/features/team-builder/components/WeaknessHeatmap.tsx:44`, `158-163`, `233-235`); cả bảng và thẻ đều có trong DOM, ẩn bằng `hidden md:flex` và `md:hidden` nên phần bị ẩn không vào cây accessibility (`frontend/src/features/team-builder/components/WeaknessHeatmap.tsx:344`, `370`); bảng rộng cuộn ngang trong khung (`frontend/src/features/team-builder/components/WeaknessHeatmap.tsx:117`).
- **Test:** `frontend/src/features/team-builder/components/WeaknessHeatmap.test.tsx` (Phần 2, mục IV.5).

**4. `TeamScoreGauge` (`frontend/src/features/team-builder/components/TeamScoreGauge.tsx`)**

- **Vai trò:** hiển thị điểm đội 0-100 kiểu thanh HP và chip chênh lệch so với lần phân tích trước.
- **Thành phần chính:**
  - `ScoreDeltaChip({ delta })`: `delta = 0` không render; dương nền `success` chữ "+N so với lần trước", âm nền `danger` (`frontend/src/features/team-builder/components/TeamScoreGauge.tsx:7-16`).
  - `TeamScoreGauge({ score })`: số làm tròn, "/ 100" hiện trên mobile và chỉ đọc cho trình đọc màn hình từ `md`; thanh rộng `clamp(score, 0, 100)%`, màu theo `scoreBarClassName`, `aria-hidden` (`frontend/src/features/team-builder/components/TeamScoreGauge.tsx:22-49`).
- **Phụ thuộc:** `formatScore`, `scoreBarClassName`. Dùng bởi `TeamBuilderPage` (`frontend/src/pages/TeamBuilderPage.tsx:273`, `253`).
- **Dữ liệu:** `AnalyzeResponse.teamScore`; `delta` từ `useScoreDelta`.
- **Biên và lỗi:** điểm ngoài 0-100 vẫn hiện số thật nhưng thanh bị kẹp; chip có `key={scoreKey}` ở trang nên gắn lại và chạy lại hiệu ứng mỗi khi đội đổi (`frontend/src/pages/TeamBuilderPage.tsx:273`).
- **Test:** không có test riêng; kiểm qua `frontend/src/pages/TeamBuilderPage.test.tsx:107`, `230-231`, `284-285`.

**5. `CoverageAndStats` (`frontend/src/features/team-builder/components/CoverageAndStats.tsx`)**

- **Vai trò:** panel "Tấn công và chỉ số": số hệ đội đánh siêu hiệu quả và radar chỉ số gốc trung bình.
- **Thành phần chính:** `CoverageAndStats({ analysis })` hiện `coveredTypeCount / 18`, danh sách `uncoveredTypes` bằng `TypeBadge` hoặc câu "Đội đánh siêu hiệu quả đủ 18 hệ."; `StatRadar` 1 series "Trung bình đội" thang tối đa 150; bảng `dl` 6 chỉ số theo `STAT_AXES` (`frontend/src/features/team-builder/components/CoverageAndStats.tsx:12-65`).
- **Phụ thuộc:** `StatRadar`, `STAT_AXES`, `TypeBadge`, `formatNumber`, `TYPE_NAMES`. Dùng bởi `TeamBuilderPage` (`frontend/src/pages/TeamBuilderPage.tsx:353`).
- **Dữ liệu:** `offensiveCoverage.coveredTypeCount`, `offensiveCoverage.uncoveredTypes`, `statRadar` (6 trường).
- **Biên và lỗi:** không có trạng thái lỗi riêng; trang lo loading, lỗi và làm mờ khi placeholder (`frontend/src/pages/TeamBuilderPage.tsx:347-359`). Lý do chọn 150 làm trần radar: chưa xác định từ code.
- **Test:** không có test riêng; trong test trang `StatRadar` bị mock (`frontend/src/pages/TeamBuilderPage.test.tsx:35-37`).

**6. `RecommendationList` (`frontend/src/features/team-builder/components/RecommendationList.tsx`)**

- **Vai trò:** xử lý 4 trạng thái của query đề xuất và gán nhãn nút cho từng thẻ.
- **Thành phần chính:** `RecommendationList({ recommendations, teamIds, sixthId, onAdd })`:
  - Lỗi: `ErrorState` theo `code`, nút "Thử lại" gọi `refetch` (`frontend/src/features/team-builder/components/RecommendationList.tsx:29-34`).
  - Chưa có data: 3 skeleton, `aria-busy`, chữ ẩn "Đang tìm đề xuất…" (`frontend/src/features/team-builder/components/RecommendationList.tsx:36-46`).
  - `items` rỗng: `EmptyState` "Chưa có ứng viên phù hợp" (`frontend/src/features/team-builder/components/RecommendationList.tsx:48-55`).
  - Có data: câu "Chọn từ {candidateCount} ứng viên…", `ol` các thẻ; nhãn nút "Đang ở slot 6", "Đã có trong đội" hoặc "Thêm vào đội"; nút tắt khi đang placeholder, đã là slot 6 hoặc đã trong đội (`frontend/src/features/team-builder/components/RecommendationList.tsx:57-90`).
- **Phụ thuộc:** `RecommendationCard`, `RecommendationSkeleton`, `EmptyState`, `ErrorState`, `errorMessageFor`, `formatNumber`, `RECOMMENDATION_LIMIT`. Dùng bởi `TeamBuilderPage` (`frontend/src/pages/TeamBuilderPage.tsx:160-165`).
- **Dữ liệu:** `RecommendationResponse.candidateCount`, `items[]`.
- **Biên và lỗi:** tắt nút khi placeholder để không thêm đề xuất của đội cũ; mobile là dải cuộn ngang `scroll-snap`, `md` 2 cột, `lg` 3 cột, từ 84 rem 1 cột (`frontend/src/features/team-builder/components/RecommendationList.tsx:20-21`).
- **Test:** không có test riêng; kiểm qua `frontend/src/pages/TeamBuilderPage.test.tsx:201-206`, `222-228`, `455-468`.

**7. `RecommendationCard` (`frontend/src/features/team-builder/components/RecommendationCard.tsx`)**

- **Vai trò:** thẻ một đề xuất: hạng, tên, hệ, điểm phù hợp, lý do, cảnh báo và nút thêm.
- **Thành phần chính:** `RecommendationCard({ recommendation, rank, actionLabel, disabled, onAdd })` là `article` có `aria-labelledby` trỏ tới tên (`frontend/src/features/team-builder/components/RecommendationCard.tsx:26-33`, `46-51`); "Đề xuất số N" (`:45`); điểm `formatScore` kèm chữ "phù hợp" (`:58-65`); danh sách lý do `aria-label="Lý do đề xuất {tên}"` (`:68-89`); danh sách cảnh báo chỉ khi có, `aria-label="Lưu ý khi chọn {tên}"` (`:90-114`); nút có chữ ẩn tên Pokémon (`:115-123`). `RecommendationSkeleton` (`:129-136`).
- **Phụ thuộc:** `PokemonSprite`, `TypeBadge`, `formatPokemonName`, `formatScore`. Dùng bởi `RecommendationList`.
- **Dữ liệu:** `id`, `name`, `types`, `score`, `reasons`, `cautions`. `breakdown` và `baseStatTotal` có trong DTO nhưng không được hiển thị.
- **Biên và lỗi:** `key` của lý do là chính chuỗi lý do, nên hai lý do trùng chữ sẽ trùng key (backend tạo lý do khác nhau, chưa xác định từ code việc có thể trùng hay không).
- **Test:** không có test riêng; kiểm qua `frontend/src/pages/TeamBuilderPage.test.tsx:201-206`, `224-227`.

**8. `PlayStylePicker` (`frontend/src/features/team-builder/components/PlayStylePicker.tsx`)**

- **Vai trò:** chọn 1 trong 4 lối chơi cho đề xuất.
- **Thành phần chính:** `PLAY_STYLE_OPTIONS`: Cân bằng (`BALANCE`), Tấn công nhanh (`HYPER_OFFENSE`, tốc độ gốc từ 80), Trâu bò (`BULKY`), Trick Room (`TRICK_ROOM`, tốc độ gốc tối đa 60) (`frontend/src/features/team-builder/components/PlayStylePicker.tsx:9-14`). `PlayStylePicker({ value, onChange })` là `fieldset` có `legend` "Lối chơi", 4 radio thật ẩn bằng `sr-only` bên trong `label`, cùng `name="play-style"` (`frontend/src/features/team-builder/components/PlayStylePicker.tsx:21-46`).
- **Phụ thuộc:** kiểu `PlayStyle`. Dùng bởi `TeamBuilderPage` (`frontend/src/pages/TeamBuilderPage.tsx:149`).
- **Dữ liệu:** không gọi API; giá trị đi vào key và body của `useRecommendations`.
- **Biên và lỗi:** radio thật nên bàn phím dùng `Tab` vào nhóm một lần và phím mũi tên để đổi; vòng focus vẽ trên `label` bằng `has-focus-visible:outline-*` (`frontend/src/features/team-builder/components/PlayStylePicker.tsx:29`).
- **Test:** không có test riêng; kiểm qua `frontend/src/pages/TeamBuilderPage.test.tsx:163-181`.

**9. `TeamInsights` (`frontend/src/features/team-builder/components/TeamInsights.tsx`)**

- **Vai trò:** chia `insights` của backend thành 2 cột "Điểm mạnh" và "Điểm yếu".
- **Thành phần chính:** `GROUPS` gồm `STRENGTH` và `WEAKNESS` kèm câu rỗng (`frontend/src/features/team-builder/components/TeamInsights.tsx:7-10`); `TeamInsights({ insights })` lọc theo `tone`, mỗi nhóm là `section` có `aria-label` (`frontend/src/features/team-builder/components/TeamInsights.tsx:12-45`).
- **Phụ thuộc:** kiểu `TeamInsight`. Dùng bởi `TeamBuilderPage` (`frontend/src/pages/TeamBuilderPage.tsx:306`) và `SharedTeamPage` (`frontend/src/pages/SharedTeamPage.tsx:201`).
- **Dữ liệu:** `insights[].tone`, `insights[].text`; `category` và `types` không được dùng ở UI.
- **Biên và lỗi:** nhóm rỗng hiện "Chưa có điểm mạnh nổi bật." hoặc "Chưa thấy điểm yếu đáng kể."; `key` là `text`.
- **Test:** không có test riêng; kiểm qua `frontend/src/pages/TeamBuilderPage.test.tsx:183-200`.

**10. `SaveTeamDialog` (`frontend/src/features/team-builder/components/SaveTeamDialog.tsx`)**

- **Vai trò:** hộp thoại đặt tên và lưu đội, sau khi lưu hiện link chia sẻ.
- **Thành phần chính:**
  - `SaveTeamDialog({ open, onClose, members, memberNames })`: `<dialog>` gốc; effect gọi `showModal()` hoặc `close()` theo `open`; sự kiện `close` (kể cả `Esc`) gọi `onClose`; chỉ mount nội dung khi `open` nên mỗi lần mở là form và mutation mới (`frontend/src/features/team-builder/components/SaveTeamDialog.tsx:20-48`).
  - `SaveTeamContent`: `useSaveTeam()`, state `name`, `touched` (`:57-63`). Submit: chặn submit gốc, đánh dấu `touched`, có lỗi tên hoặc đang `isPending` thì dừng, ngược lại `mutate({ name: name.trim(), members })` (`:65-70`).
  - Ô tên: `maxLength=60`, validate khi blur hoặc submit, `aria-invalid`, `aria-describedby` trỏ tới dòng gợi ý hoặc lỗi (`:111-128`).
  - Lỗi server: `role="alert"` với `errorMessageFor(code, retryAfterSeconds)` (`:96-97`, `130-137`).
  - Thành công: "Đã lưu đội", `ShareLinkField`, link "Mở trang đội" tới `/team/{code}`, nút "Đóng" (`:72-94`).
- **Phụ thuộc:** `useSaveTeam`, `teamNameError`, `sharePath`, `ShareLinkField`, `errorMessageFor`, `ApiError`. Dùng bởi `TeamBuilderPage` (`frontend/src/pages/TeamBuilderPage.tsx:379-384`).
- **Dữ liệu:** `POST /teams` body `CreateTeamRequest`; đọc `TeamResponse.name`, `members.length`, `shareCode`; đọc `ApiError.code`, `retryAfterSeconds`.
- **Biên và lỗi:** nút submit tắt và có `aria-busy` khi đang lưu, cộng thêm chặn trong `submit`, nên không lưu hai lần (`:68`, `142-149`); `noValidate` để dùng validate riêng bằng tiếng Việt (`:100`).
- **Test:** không có test riêng; kiểm qua `frontend/src/pages/TeamBuilderPage.test.tsx:235-271`, `329-408`.

**11. `ShareLinkField` (`frontend/src/features/team-builder/components/ShareLinkField.tsx`)**

- **Vai trò:** ô chỉ đọc chứa link chia sẻ tuyệt đối và nút sao chép.
- **Thành phần chính:** `shareUrl(code)` = `new URL('/team/{code}', window.location.origin).href` (`frontend/src/features/team-builder/components/ShareLinkField.tsx:13-15`); `copy()` gọi `writeClipboard`, thất bại thì focus và chọn sẵn text, báo nhấn Ctrl+C (`:23-31`); nút đổi nhãn "Đã sao chép"; dòng `role="status"` (`:48-63`).
- **Phụ thuộc:** `writeClipboard` (`frontend/src/lib/clipboard.ts:1-10`), `sharePath`. Dùng bởi `SaveTeamDialog` và `SharedTeamPage` (`frontend/src/pages/SharedTeamPage.tsx:192`).
- **Dữ liệu:** chỉ `shareCode`; origin lấy từ trình duyệt nên link đúng cả ở local và production.
- **Biên và lỗi:** Clipboard API không có hoặc bị từ chối (ví dụ trang không phải HTTPS) thì chuyển sang chế độ chọn text thủ công; ô tự chọn toàn bộ khi focus (`:45`).
- **Test:** không có test riêng; kiểm qua `frontend/src/pages/TeamBuilderPage.test.tsx:329-347` và `frontend/src/pages/SharedTeamPage.test.tsx:116-127`.

**12. `ShowdownDialogs` (`frontend/src/features/team-builder/components/ShowdownDialogs.tsx`)**

- **Vai trò:** hai hộp thoại nhập và xuất đội Showdown.
- **Thành phần chính:**
  - `LOOKUP`: `getPokemon` gọi `fetchPokemonDetail(name)` và rút gọn thành `PokemonRef`; `searchPokemon` gọi `searchAllForms` (`frontend/src/features/team-builder/components/ShowdownDialogs.tsx:22-28`).
  - `DialogShell`: `<dialog>` gốc, `showModal`/`close` theo `open`, chỉ render con khi mở (`:49-69`).
  - `ShowdownImportDialog({ open, onClose, onImport })` và `ImportContent`: state `idle`, `pending`, `error`, `done` (`:77-100`). Submit: parse; không có tên thì báo "Chưa có tên Pokémon nào trong văn bản."; tra song song mọi dòng bằng `Promise.all`; nếu dialog đã đóng (`closedRef`) thì bỏ kết quả; không nhận ra con nào thì báo lỗi và giữ đội; ngược lại gọi `onImport(plan)` và hiện tóm tắt (`:112-141`).
  - `closedRef`: đặt `true` trong cleanup của effect khi `ImportContent` unmount (đóng dialog), đây là bản sửa F3 "hủy nhập Showdown vẫn thay đội" (`:103-110`, `125`, `135`; `PLAN.md:161`).
  - `ImportSummary`: "Đã thêm N Pokémon: ...", ghi chú slot 6, danh sách dòng không nhận ra, số con trùng, số con vượt 6 slot, thông báo đã bỏ chi tiết (`:209-245`).
  - `ShowdownExportDialog({ open, onClose, ids })` và `ExportContent`: `usePokemonDetails(ids)`, sẵn sàng khi đủ chi tiết và không lỗi; text là `formatShowdownTeam(toShowdownName(detail))`; textarea chỉ đọc tự chọn khi focus; nút "Sao chép" tắt khi chưa sẵn sàng; thông báo `aria-live` (`:253-350`).
- **Phụ thuộc:** `showdown.ts`, `fetchPokemonDetail`, `usePokemonDetails` (`frontend/src/features/pokemon-detail/hooks.ts:29-37`), `searchAllForms`, `writeClipboard`, `errorMessageFor`. Dùng bởi `TeamBuilderPage` (`frontend/src/pages/TeamBuilderPage.tsx:385-390`) và `SharedTeamPage` (`frontend/src/pages/SharedTeamPage.tsx:207-211`).
- **Dữ liệu:** nhập gọi `GET /pokemon/{name}` và `GET /pokemon/search?q=..&limit=10&form=...` trực tiếp, không qua cache Query; xuất dùng key `['pokemon', 'detail', '<id>']`, `staleTime: Infinity`, chung cache với `TeamSpeedList` (`frontend/src/features/speed/components/TeamSpeedList.tsx:16`).
- **Biên và lỗi:** một dòng gặp lỗi khác 404 làm cả lượt nhập thất bại với thông điệp theo `code` (`:134-140`); hủy giữa chừng không hủy request đang bay (không truyền `signal`), chỉ bỏ kết quả; xuất lỗi thì "Chưa tải được thông tin đội để xuất." (`:307-313`).
- **Test:** `frontend/src/features/team-builder/components/ShowdownDialogs.test.tsx` (Phần 2, mục IV.4).

#### III. Trang `frontend/src/pages/`

**1. `TeamBuilderPage` (`frontend/src/pages/TeamBuilderPage.tsx`)**

- **Vai trò:** trang `/team-builder`, ghép đội nháp, phân tích, đề xuất, lưu, nhập và xuất Showdown.
- **Thành phần chính:**
  - State: `draft` (`useTeamDraft`), `excludeLegendary`, `playStyle` (`useState`, không lên URL), `knownRefs` (tên đã biết theo ID), 3 cờ mở dialog, `isWideLayout = useMediaQuery('(min-width: 64rem)')` (`frontend/src/pages/TeamBuilderPage.tsx:60-68`).
  - `activeSixthId`: chỉ có hiệu lực khi đội nháp đủ 5 và `sixth` không trùng (`:71-72`). `teamIds` = `ids` cộng `activeSixthId`, `useMemo` để giữ tham chiếu ổn định cho query key (`:73-76`).
  - `useRecommendations(draft.ids, ...)` dùng tối đa 5 ID; `useTeamAnalysis(teamIds)` dùng tối đa 6 (`:63`, `76`).
  - `analysisData` chỉ lấy khi đội có thành viên, tránh hiện dữ liệu cũ do `keepPreviousData` khi đội về rỗng (`:78-79`). `freshAnalysis` loại placeholder cho vùng `aria-live` (`:80`). `scoreKey` là chuỗi ID của `members` trong response (`:81-82`).
  - `suggestion`: đề xuất số 1 khi đội đủ 5 và đề xuất không phải placeholder (`:83-86`).
  - `refFor(id)`: tên lấy từ `members` của phân tích, không có thì từ `knownRefs` (`:88-91`); `remember` lưu ref khi chọn từ ô tìm, đề xuất hoặc Showdown để hiện tên ngay (`:93-101`).
  - `handleRemove`: bỏ thành viên; nếu slot 6 đang có hiệu lực thì đưa con slot 6 vào đội và xóa `sixth` (`:103-109`).
  - `handleAddRecommendation`: đội đủ 5 thì `setSixth`, chưa đủ thì `add` (`:111-115`). `handleImport`: nhớ ref rồi `replace(plan.ids, plan.sixth)` (`:117-120`).
  - `saveMembers = buildTeamMembers(ids, activeSixthId)`, `memberNames` cho dialog lưu (`:122-127`); `nextSlot` cho tiêu đề "Đề xuất slot thứ N" (`:128`, `140`).
  - Bố cục: cột trái (slot, khối đề xuất trên mobile khi có thành viên, điểm), cột giữa (Đánh giá đội, Bản đồ điểm yếu, khối đề xuất trên mobile khi đội trống, Tấn công và chỉ số, Tốc độ cấp 50), khối đề xuất cuối DOM khi rộng (`:212-376`).
- **Thứ tự DOM, bản sửa F8:** khối đề xuất là một biến JSX (`:130-172`) được render ở đúng 1 trong 3 chỗ: dưới slot (`:266`, mobile và có thành viên), sau heatmap (`:341`, mobile và đội trống), cuối lưới (`:376`, từ 1024 px). Trước F8 code dùng `order-1` và `display: contents`, làm thứ tự `Tab` khác thứ tự nhìn (`git show 3fbfb8f -- frontend/src/pages/TeamBuilderPage.tsx`).
- **Phụ thuộc:** toàn bộ component trong mục II, `useTeamDraft`, 3 hook query, `PokemonSearchBox`, `TeamSpeedList`, `PageHero`, `PageBody`, `Panel`, `EmptyState`, `useMediaQuery`.
- **Dữ liệu:** URL `ids`, `six`, `add` và `localStorage` qua `useTeamDraft`; query key `['synergy', 'analyze', teamIds]`, `['synergy', 'recommendations', ids, 3, excludeLegendary, playStyle]`, `['pokemon', 'search', q]` (ô tìm), `['pokemon', 'detail', id]` và `['pokemon', 'speed-tiers']` (Tốc độ, Xuất); mutation `POST /teams`.
- **Biên và lỗi:**
  - Đội trống: không gọi API (`frontend/src/pages/TeamBuilderPage.test.tsx:410-419`), heatmap là `EmptyState` có nút "Dùng đội mẫu" nạp `[6,130,149,663,637]` (`:30`, `325-337`); nút Lưu, Đặt lại, Xuất tắt (`:232`, `179`, `192`).
  - Đội đủ 5: ô tìm biến thành câu hướng dẫn (`:222-226`); ô tìm luôn loại các ID đã chọn qua `excludeIds={teamIds}` (`:232`).
  - Phân tích lỗi: điểm "Chưa tính được điểm đội.", đánh giá "Chưa đánh giá được đội.", tấn công "Chưa có kết quả phân tích.", thẻ thành viên "Chưa tải được" (`:241`, `254-255`, `299-300`, `346-347`).
  - Nút trống trong slot đưa focus về ô tìm `#team-search` (`:245`).
- **Test:** `frontend/src/pages/TeamBuilderPage.test.tsx` (Phần 2, mục IV.6).

**2. `SharedTeamPage` (`frontend/src/pages/SharedTeamPage.tsx`)**

- **Vai trò:** trang `/team/:shareCode` chỉ đọc: tên đội, thành viên, heatmap gọn, đánh giá, mở trong Team Builder, xuất Showdown, link chia sẻ.
- **Thành phần chính:**
  - `ShareCodeBadge` hiện "Mã đội" (`frontend/src/pages/SharedTeamPage.tsx:33-42`); `isNotFound(error)`: 404, `TEAM_NOT_FOUND` hoặc `INVALID_PARAMETER` (`:44-49`).
  - Luồng dữ liệu: `useParams` lấy `shareCode`; `useSharedTeam`; `members` sắp theo `slot`; `analysisIds` là ID tất cả thành viên (tối đa 6); `draftIds` là 5 ID đầu; `useTeamAnalysis(analysisIds)` (`:52-61`).
  - `score`: ưu tiên `synergyScore` đã lưu, nếu `null` thì `teamScore` của phân tích (không lấy placeholder) (`:66-67`). Phụ đề "N thành viên, điểm đội X. Lưu ngày dd/mm/yyyy." (`:69-76`).
  - Hero: tiêu đề là tên đội, nhãn "Đội được chia sẻ, chỉ xem" từ `md`, dải màu hệ chính của từng thành viên, mã đội (`:80-111`).
  - Thân trang 4 trạng thái: không tìm thấy (`GameDialog`, link "Xây đội mới", "Về Pokédex") (`:113-130`); lỗi khác (`ErrorState` có thử lại) (`:131-139`); đang tải (6 skeleton) (`:140-151`); có dữ liệu (`:152-205`).
  - Link "Mở trong Team Builder": `/team-builder?ids=<5 ID đầu>` và thêm `&six=<ID thứ 6>` nếu có (`:178-183`).
- **Phụ thuộc:** `useSharedTeam`, `useTeamAnalysis`, `ReadOnlyTeamSlots`, `AnalysisHeatmap compact`, `TeamInsights`, `ShareLinkField`, `ShowdownExportDialog`, `formatSavedDate`, `formatScore`, `errorMessageFor`.
- **Dữ liệu:** `GET /teams/shared/{code}` key `['teams', 'shared', code]`; `POST /synergy/analyze` với tối đa 6 ID; đọc `TeamResponse` (`shareCode`, `name`, `synergyScore`, `createdAt`, `members[]` có `slot`, `id`, `name`, `types`, `nickname`).
- **Biên và lỗi:** mã sai định dạng thì hiện "Không tìm thấy đội" ngay, không gọi API (`frontend/src/features/team-builder/hooks.ts:49`, `frontend/src/pages/SharedTeamPage.test.tsx:156-165`); trang không đọc, không ghi `useTeamDraft`, nên mở link không ghi đè đội nháp của người xem cho đến khi bấm "Mở trong Team Builder".
- **Test:** `frontend/src/pages/SharedTeamPage.test.tsx` (Phần 2, mục IV.7).

#### IV. Test

**1. `useTeamDraft.test` (`frontend/src/features/team-builder/useTeamDraft.test.tsx`)**

- **Vai trò:** kiểm reducer, parse URL và đồng bộ URL, `localStorage` của `useTeamDraft`.
- **Thành phần chính:**
  - Reducer: thêm, bỏ; bỏ qua trùng, ID 0, 1.5, thêm khi đủ 5 trả đúng object cũ; `replace` sanitize; `sixth` sống qua `remove`, mất khi `clear` (`frontend/src/features/team-builder/useTeamDraft.test.tsx:42-73`).
  - `parseDraftIds`: round trip, loại `abc`, `-4`, `0`, `1e3`, trùng, quá 5 (`:75-85`).
  - Hook: chuẩn hóa `?ids=6,x,130,6` thành `6,130` và ghi `localStorage` (`:88-94`); thêm, bỏ, xóa ghi URL và `localStorage` (`:96-110`); khôi phục từ `localStorage` khi URL không có `ids` (`:112-119`); URL thắng `localStorage` (`:121-127`); `?add=` nối vào bản nháp và tự xóa (`:129-138`); `?add=` khi đủ 5 không đổi (`:140-148`); chỉ lấy `add` đầu tiên (`:150-155`); theo điều hướng mới, giữ bản nháp khi URL trống (`:157-166`); đọc, ghi, xóa `six` (`:168-198`); điều hướng chỉ đổi `six` (`:200-206`); `localStorage` bị chặn vẫn chạy (`:208-221`).
- **Phụ thuộc:** `MemoryRouter`, `renderHook`, `useLocation`, `useNavigate`.
- **Dữ liệu:** đọc `location.search`, `localStorage['pokenexus.teamDraft']`.
- **Biên và lỗi:** xem các case trên.
- **Test:** là file test.

**2. `teamAnalysis.test` (`frontend/src/features/team-builder/teamAnalysis.test.ts`)**

- **Vai trò:** unit test hàm thuần của `teamAnalysis.ts`.
- **Thành phần chính:** 4 mức `pressureLevel` (`:24-31`); sort Rock (critical) trước Water, hòa giữ thứ tự (`:33-48`); ma trận rỗng (`:50-52`); câu tóm tắt có và không có lỗ hổng (`:55-70`); `buildTeamMembers` đánh slot, bỏ `sixth` trùng (`:72-85`); tên 1-60 ký tự sau trim, rỗng, 61 ký tự (`:87-97`); ngày `06/11/2026` và chuỗi rác (`:99-104`).
- **Phụ thuộc:** Vitest.
- **Dữ liệu:** dữ liệu tự dựng bằng `row()` (`:13-22`).
- **Biên và lỗi:** như trên.
- **Test:** là file test.

**3. `showdown.test` (`frontend/src/features/team-builder/showdown.test.ts`)**

- **Vai trò:** unit test parse, chuẩn hóa, tra tên, lập kế hoạch nhập, đặt tên xuất.
- **Thành phần chính:**
  - Văn bản mẫu `\r\n` có header `===`, `Rainmaker (Pelipper) (M) @ Damp Rock`, `Urshifu-Rapid-Strike @ ...`, `Landorus-Therian (F)`, `Indeedee-F @ ...` (dư khoảng trắng), `Farfetch’d`; kỳ vọng 5 entry ở dòng 3, 11, 15, 17, 19 và `ignoredDetails = true` (`frontend/src/features/team-builder/showdown.test.ts:15-49`).
  - Danh sách tên trần thì `ignoredDetails = false`; văn bản trống không có entry (`:51-63`).
  - 11 case chuẩn hóa: `Mr. Mime`, `Farfetch’d`, `Type: Null`, `Flabébé`, `Nidoran♀`, `Tapu Koko`, `Zygarde-10%`, `Indeedee-F`, `Necrozma-Dusk-Mane`, `Tauros-Paldea-Combat`, `Ogerpon-Wellspring` (`:66-82`).
  - Tra tên: đúng tên trước, không gọi search; tiền tố `Landorus` ra `landorus-incarnate`; bỏ hậu tố `Sinistcha-Masterpiece`; bỏ kết quả chỉ chứa ở giữa; `???` ra `null`; 503 được ném lại (`:105-147`).
  - Tên xuất: `Landorus`, `Landorus-Therian`, `Indeedee-F`, `Mr. Mime-Galar`, `Iron Treads`, `Kommo-o`, `Charizard-Mega-X` (`:149-167`).
  - `formatShowdownTeam` parse ngược ra đúng tên (`:169-180`); `planImport` với 9 dòng: 5 ID, `sixth` 6, 1 dòng không nhận ra, 1 trùng, 1 tràn; đội ngắn để trống slot 6 (`:182-211`).
- **Phụ thuộc:** `lookup()` mock `ShowdownLookup` (`:84-95`).
- **Dữ liệu:** không gọi mạng.
- **Biên và lỗi:** chưa có test tra tên đầu cuối cho `Urshifu-Rapid-Strike` (chỉ test parse).
- **Test:** là file test.

**4. `ShowdownDialogs.test` (`frontend/src/features/team-builder/components/ShowdownDialogs.test.tsx`)**

- **Vai trò:** test tích hợp hai dialog với `fetch` giả và `QueryClient` thật.
- **Thành phần chính:** nhập văn bản có biệt danh, dòng chi tiết, `Fakemon`, `Indeedee-F`: `onImport` nhận `ids [445, 10186]`, tóm tắt "Dòng 4: Fakemon không có trong dữ liệu." (`:69-87`); hủy khi đang tra tên thì `onImport` không được gọi (hồi quy F3, dùng `gate` giữ response) (`:89-111`); không nhận ra con nào thì báo lỗi, giữ đội (`:113-127`); bấm nhập khi trống (`:129-137`); xuất `[645, 10186, 445]` ra `Landorus\n\nIndeedee-F\n\nGarchomp\n` và sao chép (`:140-156`).
- **Phụ thuộc:** `jsonResponse`, `problem` từ `testing.tsx`; `userEvent`.
- **Dữ liệu:** `stubApi` trả chi tiết theo tên hoặc ID, search luôn rỗng (`:46-57`).
- **Biên và lỗi:** như trên.
- **Test:** là file test.

**5. `WeaknessHeatmap.test` (`frontend/src/features/team-builder/components/WeaknessHeatmap.test.tsx`)**

- **Vai trò:** kiểm hai bản hiển thị của heatmap và chế độ `compact`.
- **Thành phần chính:** thẻ mobile chỉ hiện Rock, Electric, Water rồi bung đủ 18 và thu lại (`:35-50`); thẻ Rock có "Lỗ hổng nghiêm trọng", "Cao", "Charizard nhận x4" và câu "Yếu: ... Kháng: không ai." (`:52-68`); ô x1 trong bảng có chữ `sr-only` (`:70-84`); bảng 19 hàng (header cộng 18), lọc còn 4 (`:86-92`); `compact` chỉ hàng có áp lực, không cột Yếu, Kháng, không checkbox, không nút (`:94-112`); đội không áp lực (`:114-121`).
- **Phụ thuộc:** `analysisFor`, `SPEC_ROCK_ROW`, `SPEC_TEAM`.
- **Dữ liệu:** dữ liệu mẫu có Rock 8, Electric 5 (critical), Ice 0, Water 1 (`:8-19`).
- **Biên và lỗi:** như trên.
- **Test:** là file test.

**6. `TeamBuilderPage.test` (`frontend/src/pages/TeamBuilderPage.test.tsx`)**

- **Vai trò:** test tích hợp trang Team Builder qua router và `fetch` giả.
- **Thành phần chính:**
  - Đội mẫu: hàng Rock là lỗ hổng, ô `x4 x2 x2 x4 x4 5 0 Cao`, đúng 1 `h1`, body analyze và recommendations đúng (`:82-115`).
  - Nhập Showdown thay đội và URL `ids=248%2C395` (`:117-139`); bật loại huyền thoại gửi `excludeLegendary: true` (`:141-161`); chọn Trick Room gửi `playStyle` (`:163-181`); insights và cảnh báo (`:183-207`).
  - Đội 4 thêm đề xuất số 1 thành slot 5, điểm 40 lên 52, chip "+12" (`:209-233`); đội 5 thêm vào slot 6, lưu đủ 6 thành viên (`:235-271`); analyze gọi lại với 6 ID, recommendations không gọi lại, "+28" (`:273-294`); khôi phục `six` từ URL (`:296-306`); bỏ thành viên đưa slot 6 vào đội (`:308-327`).
  - Sao chép link (`:329-347`); 429 không có và có `Retry-After: 42` (`:349-390`); tên trống không gọi API (`:392-408`); đội trống không gọi API, "Dùng đội mẫu" (`:410-427`); thêm và bỏ từ ô tìm (`:429-453`); lỗi `UNKNOWN_POKEMON` (`:455-468`).
  - Thứ tự đọc (F8): mobile có thành viên, mobile đội trống, desktop đề xuất cuối (`:471-581`).
- **Phụ thuộc:** mock `PokemonSearchBox` và `StatRadar` (`:24-37`); stub `matchMedia` (`:489-499`).
- **Dữ liệu:** `analyzeById(scores)` trả điểm theo chuỗi ID (`:58-70`).
- **Biên và lỗi:** test dùng điểm 41 cho đội mẫu (`:84`), là số mock, khác điểm thật 20 (Phần 5).
- **Test:** là file test.

**7. `SharedTeamPage.test` (`frontend/src/pages/SharedTeamPage.test.tsx`)**

- **Vai trò:** test tích hợp trang đội chia sẻ.
- **Thành phần chính:** response có slot đảo thứ tự và Tyranitar ở slot 6; kỳ vọng tên đội là `h1` duy nhất, phụ đề "6 thành viên, điểm đội 41. Lưu ngày 06/11/2026.", 6 link theo slot, biệt danh "Gyara", heatmap compact 3 hàng, analyze nhận 6 ID, link `/team-builder?ids=6,130,149,663,637&six=248` (`:26-38`, `63-114`); sao chép link (`:116-127`); tiêu đề mặc định khi đang tải (`:129-138`); 404 `TEAM_NOT_FOUND` (`:140-154`); mã `abc` không gọi API (`:156-165`); 500 có nút thử lại (`:167-176`).
- **Phụ thuộc:** `testing.tsx`; mock `PokemonSearchBox`, `StatRadar`.
- **Dữ liệu:** `GET /teams/shared/a1B2c3D4`, `POST /synergy/analyze`.
- **Biên và lỗi:** như trên.
- **Test:** là file test.

#### V. Phụ thuộc ngoài phạm vi cần nắm khi bị hỏi

| File | Điều cần nhớ | Nguồn |
|---|---|---|
| `frontend/src/lib/http.ts` | Base URL từ `VITE_API_BASE_URL`, mặc định `http://localhost:8080/api/v1`; lỗi mạng thành `NETWORK_ERROR`; đọc `code`, `detail`, `Retry-After` | `frontend/src/lib/http.ts:3-7`, `53-77` |
| `frontend/src/lib/errorMessages.ts` | Bảng `code` sang câu tiếng Việt; `RATE_LIMITED` có số giây thì ghép vào câu | `frontend/src/lib/errorMessages.ts:1-25` |
| `frontend/src/lib/queryClient.ts` | Không retry 4xx, retry 1 lần lỗi khác, không refetch khi focus | `frontend/src/lib/queryClient.ts:5-18` |
| `frontend/src/lib/useMediaQuery.ts` | `useSyncExternalStore` trên `matchMedia`, mốc `(min-width: 64rem)`; không có `matchMedia` thì coi là hẹp | `frontend/src/lib/useMediaQuery.ts:4-25` |
| `frontend/src/components/pokemon/PokemonSearchBox.tsx` | Debounce 250 ms, lọc `excludeIds`, combobox có phím mũi tên | `frontend/src/components/pokemon/PokemonSearchBox.tsx:22-32`, `55`, `82-110` |
| `frontend/src/features/pokemon-detail/api.ts` | Tên trùng đường dẫn API (`search`, `compare`, `speed-tiers`, `generations`) ném 404 ở frontend | `frontend/src/features/pokemon-detail/api.ts:4-17` |
| `frontend/src/app/router.tsx` | Hai trang được lazy load | `frontend/src/app/router.tsx:49-56` |

### III. Luồng xử lý đầu cuối

#### I. Luồng 1: dựng đội Charizard, Gyarados, Dragonite, Talonflame, Volcarona và thấy Rock bị đánh dấu

**1. Các bước**

1. Người dùng vào `/team-builder`; route lazy tải `TeamBuilderPage` (`frontend/src/app/router.tsx:49-52`). `useTeamDraft` khởi tạo từ URL, rỗng thì từ `localStorage` (`frontend/src/features/team-builder/useTeamDraft.ts:88-94`).
2. Cách nhanh cho demo: bấm "Dùng đội mẫu", gọi `draft.replace([6,130,149,663,637])` (`frontend/src/pages/TeamBuilderPage.tsx:30`, `320-326`). Cách thủ công: gõ "char" vào ô tìm, sau 250 ms gọi `GET /api/v1/pokemon/search?q=char&limit=8` (key `['pokemon', 'search', 'char']`) (`frontend/src/components/pokemon/PokemonSearchBox.tsx:22`, `50-51`; `frontend/src/features/dex/hooks.ts:17-25`; `frontend/src/features/dex/api.ts:30-34`), backend `PokemonController.search` (`backend/src/main/java/com/pokenexus/pokedex/controller/PokemonController.java:76-86`). Chọn kết quả gọi `handleSelect`: `remember` rồi `draft.add` (`frontend/src/pages/TeamBuilderPage.tsx:98-101`).
3. Reducer cập nhật `ids` (`frontend/src/features/team-builder/useTeamDraft.ts:50-53`). Effect đồng bộ ghi `localStorage['pokenexus.teamDraft'] = "6,130,149,663,637"` và URL `?ids=6%2C130%2C149%2C663%2C637` bằng `replace` (`frontend/src/features/team-builder/useTeamDraft.ts:130-136`, `116-128`).
4. `teamIds` đổi, key `['synergy', 'analyze', [6,130,149,663,637]]` chưa có cache nên TanStack Query gọi `analyzeTeam` (`frontend/src/pages/TeamBuilderPage.tsx:73-77`; `frontend/src/features/team-builder/hooks.ts:16-24`; `frontend/src/features/team-builder/api.ts:31-37`). Cùng lúc `useRecommendations` gọi `POST /synergy/recommendations` (`frontend/src/pages/TeamBuilderPage.tsx:63`). Không có debounce cho hai request này.
5. `postJson` gửi request (`frontend/src/lib/http.ts:44-51`). Backend: `RequestBodyLimitFilter` (16 KB) (`backend/src/main/java/com/pokenexus/common/web/RequestBodyLimitFilter.java:27`, `36-45`), `SynergyController.analyze` với `@Valid` 1-6 ID (`backend/src/main/java/com/pokenexus/synergy/controller/SynergyController.java:31-35`; `backend/src/main/java/com/pokenexus/synergy/dto/AnalyzeRequest.java:8-9`), rồi `SynergyAnalyzer.analyze` (`backend/src/main/java/com/pokenexus/synergy/service/SynergyAnalyzer.java:41-43`).
6. Response về; `members` giữ đúng thứ tự request (`backend/src/main/java/com/pokenexus/synergy/service/SynergyAnalyzer.java:59-62`). `AnalysisHeatmap` render `WeaknessHeatmap` (`frontend/src/pages/TeamBuilderPage.tsx:323`; `frontend/src/features/team-builder/components/WeaknessHeatmap.tsx:398-416`).
7. `sortRowsByPressure` đưa Rock (critical, pressure 8) lên đầu, rồi Electric (critical, pressure 4) (`frontend/src/features/team-builder/teamAnalysis.ts:24-35`). Hàng Rock có nhãn "Lỗ hổng" và chữ ẩn "nghiêm trọng", viền trái đỏ, mức "Cao" vì `8 > 4` (`frontend/src/features/team-builder/components/WeaknessHeatmap.tsx:175-184`, `207-214`; `frontend/src/features/team-builder/teamAnalysis.ts:17-22`).
8. Panel điểm: `TeamScoreGauge` hiện 20, thanh màu `stat-mid` vì `20 >= 20` (`frontend/src/pages/TeamBuilderPage.tsx:278-279`; `frontend/src/features/team-builder/teamAnalysis.ts:41-45`). Vùng `aria-live` đọc "Điểm đội 20, có 2 lỗ hổng nghiêm trọng: Rock, Electric." (`frontend/src/pages/TeamBuilderPage.tsx:288-290`; `frontend/src/features/team-builder/teamAnalysis.ts:47-53`).
9. Tên thành viên trong slot lấy từ `analysisData.members` (`frontend/src/pages/TeamBuilderPage.tsx:88-91`); `TeamInsights`, `CoverageAndStats`, `TeamSpeedList` cũng render từ cùng response hoặc từ `GET /pokemon/{id}`.

**2. Request và response**

```json
{ "pokemonIds": [6, 130, 149, 663, 637] }
```

```json
{
  "members": [
    { "id": 6, "name": "charizard", "types": ["fire", "flying"] },
    { "id": 130, "name": "gyarados", "types": ["water", "flying"] },
    { "id": 149, "name": "dragonite", "types": ["dragon", "flying"] },
    { "id": 663, "name": "talonflame", "types": ["fire", "flying"] },
    { "id": 637, "name": "volcarona", "types": ["bug", "fire"] }
  ],
  "teamScore": 20.0,
  "typeMatrix": [
    { "attackingType": "rock", "multipliers": [4.0, 2.0, 2.0, 4.0, 4.0], "weakCount": 5, "resistCount": 0, "pressure": 8, "criticalHole": true },
    { "attackingType": "electric", "multipliers": [2.0, 4.0, 1.0, 2.0, 1.0], "weakCount": 3, "resistCount": 0, "pressure": 4, "criticalHole": true }
  ]
}
```

- Bản rút gọn: `typeMatrix` thật có 18 dòng theo ID hệ; bỏ `offensiveCoverage`, `statRadar`, `insights` vì giá trị thật chưa xác định từ code.
- Số liệu Rock, Electric (`multipliers`, `pressure`, `criticalHole`) và `teamScore = 20.0` lấy từ `backend/src/test/java/com/pokenexus/synergy/service/SynergyAnalyzerTest.java:36-41`, `50-54`, `64` và `docs/spec.md:89`, `93`. `weakCount`, `resistCount` của Electric suy từ định nghĩa, test không assert.
- Công thức điểm: `100 - 4 x tổng pressure - 8 x số lỗ hổng` (`docs/architecture.md`, Phần 5, mục II).

#### II. Luồng 2: nhận 3 đề xuất, thêm đề xuất số 1, điểm đội tăng

**1. Các bước**

1. Ngay khi đội có thành viên, `useRecommendations(draft.ids, false, 'BALANCE')` chạy với key `['synergy', 'recommendations', [6,130,149,663,637], 3, false, 'BALANCE']` (`frontend/src/pages/TeamBuilderPage.tsx:63`; `frontend/src/features/team-builder/hooks.ts:26-39`). Body chỉ có `pokemonIds` và `limit` (`frontend/src/features/team-builder/api.ts:46-51`).
2. Backend: `SynergyController.recommend` (`backend/src/main/java/com/pokenexus/synergy/controller/SynergyController.java:37-41`), `@Valid` 1-5 ID, `limit` 1-10 (`backend/src/main/java/com/pokenexus/synergy/dto/RecommendationRequest.java:13-14`), rồi `RecommendationEngine.recommend` (`backend/src/main/java/com/pokenexus/synergy/service/RecommendationEngine.java:51-53`, giới hạn 5 ở `:31`).
3. `RecommendationList` hiện câu số ứng viên và 3 `RecommendationCard` (`frontend/src/features/team-builder/components/RecommendationList.tsx:59-90`). Đội đủ 5 nên slot 6 cũng hiện ô "Đề xuất" với tên đề xuất số 1 (`frontend/src/pages/TeamBuilderPage.tsx:83-86`; `frontend/src/features/team-builder/components/TeamSlots.tsx:89-104`).
4. Bấm "Thêm vào đội" ở thẻ số 1 (hoặc ở ô slot 6): `handleAddRecommendation` thấy `draft.isFull` nên gọi `draft.setSixth(id)` (`frontend/src/pages/TeamBuilderPage.tsx:111-115`, `218`).
5. Effect ghi `?six=<id>` lên URL (`frontend/src/features/team-builder/useTeamDraft.ts:122-123`); `localStorage` vẫn chỉ có 5 ID.
6. `activeSixthId` có giá trị, `teamIds` thành 6 ID, key analyze đổi, gọi `POST /synergy/analyze` với 6 ID (`frontend/src/pages/TeamBuilderPage.tsx:71-77`). Backend chấp nhận tới 6 (`backend/src/main/java/com/pokenexus/synergy/service/SynergyAnalyzer.java:29`, `42`).
7. Trong lúc chờ, `keepPreviousData` giữ kết quả 5 thành viên: heatmap, đánh giá, tấn công mờ 60% (`frontend/src/features/team-builder/components/WeaknessHeatmap.tsx:405-408`; `frontend/src/pages/TeamBuilderPage.tsx:305`, `343`); thẻ đề xuất số 1 đổi nhãn "Đang ở slot 6" và bị tắt (`frontend/src/features/team-builder/components/RecommendationList.tsx:70-84`).
8. Response mới về, `scoreKey` đổi từ 5 ID sang 6 ID, `useScoreDelta` tính `round(mới) - 20`, `ScoreDeltaChip` hiện "+N so với lần trước" (`frontend/src/pages/TeamBuilderPage.tsx:81-82`, `247`; `frontend/src/features/team-builder/hooks.ts:60-72`; `frontend/src/features/team-builder/components/TeamScoreGauge.tsx:7-16`).
9. `useRecommendations` không gọi lại vì `draft.ids` không đổi (khẳng định ở `frontend/src/pages/TeamBuilderPage.test.tsx:291-293`). Bộ đếm "6 / 6" (`frontend/src/pages/TeamBuilderPage.tsx:219`).

**2. Request và response**

```json
{ "pokemonIds": [6, 130, 149, 663, 637], "limit": 3 }
```

```json
{
  "playStyle": "BALANCE",
  "candidateCount": 412,
  "items": [
    {
      "id": 0,
      "name": "string",
      "types": ["string"],
      "score": 0.0,
      "breakdown": { "defense": 0.0, "offense": 0.0, "role": 0.0, "stats": 0.0 },
      "baseStatTotal": 0,
      "reasons": ["Kháng hệ Rock (x0,25): đội đang có 5 thành viên yếu, chưa ai kháng"],
      "cautions": []
    }
  ]
}
```

```json
{ "pokemonIds": [6, 130, 149, 663, 637, 0] }
```

- Response đề xuất là cấu trúc minh họa của `docs/api.md`, Phần 5, mục II. Pokémon đứng số 1 và điểm đội sau khi thêm với dữ liệu thật: chưa xác định từ code.
- Lý do số 1 liên quan tới Rock là đáp án bắt buộc, kiểm bằng dữ liệu fixture ở `backend/src/test/java/com/pokenexus/synergy/service/RecommendationEngineTest.java:31-39`. Ví dụ có đáp án của spec: thêm Excadrill thì điểm từ 20 lên 48 (`docs/spec.md:93`; `SynergyAnalyzerTest.java:96-97`).
- Số `0` cuối mảng analyze là ID của đề xuất số 1.
- Nếu đội mới có 4 thành viên, đề xuất được `add` vào slot 5 thay vì `setSixth`, cả analyze và recommendations đều gọi lại (`frontend/src/pages/TeamBuilderPage.test.tsx:209-233`).

#### III. Luồng 3: lưu đội, mở `/team/:shareCode` ở cửa sổ ẩn danh, thấy 6 thành viên

**1. Các bước**

1. Bấm "Lưu đội" (mobile ghi "Lưu và chia sẻ") (`frontend/src/pages/TeamBuilderPage.tsx:174-185`, render ở `:293`); `SaveTeamDialog` gọi `showModal()` (`frontend/src/features/team-builder/components/SaveTeamDialog.tsx:24-29`). Dialog nhận `members = buildTeamMembers(ids, activeSixthId)` gồm 6 phần tử slot 1-6 (`frontend/src/pages/TeamBuilderPage.tsx:122`; `frontend/src/features/team-builder/teamAnalysis.ts:55-61`).
2. Nhập tên, bấm "Lưu đội": `teamNameError` kiểm 1-60 ký tự sau trim; hợp lệ thì `save.mutate({ name: name.trim(), members })` (`frontend/src/features/team-builder/components/SaveTeamDialog.tsx:65-70`). `createTeam` gọi `POST /api/v1/teams` (`frontend/src/features/team-builder/api.ts:55-57`).
3. Backend: giới hạn body 16 KB; `TeamController.create` với `@Valid` (`name` không trống, tối đa 60, được `strip`; `members` 1-6; `slot` 1-6) (`backend/src/main/java/com/pokenexus/team/controller/TeamController.java:37-44`; `backend/src/main/java/com/pokenexus/team/dto/CreateTeamRequest.java:10-16`; `backend/src/main/java/com/pokenexus/team/dto/TeamMemberRequest.java:8-15`).
4. `saveRateLimiter.acquire(remoteAddr)`: 10 lần mỗi phút mỗi IP (`backend/src/main/java/com/pokenexus/team/controller/TeamController.java:41`; `backend/src/main/java/com/pokenexus/team/service/SaveRateLimiter.java:45-59`; `backend/src/main/resources/application.yml:29`). Production đọc IP thật sau proxy nhờ `forward-headers-strategy: framework` (`backend/src/main/resources/application-prod.yml:2`).
5. `TeamService.create`: sắp theo slot, chặn trùng slot, trùng Pokémon, ID không tồn tại, tính `synergyScore` bằng `SynergyAnalyzer`, sinh `shareCode` tối đa 3 lần, lưu (`backend/src/main/java/com/pokenexus/team/service/TeamService.java:62-87`, `101-110`). Trả 201 kèm `Location` (`backend/src/main/java/com/pokenexus/team/controller/TeamController.java:43`).
6. `save.data` có giá trị, dialog chuyển sang "Đã lưu đội", hiện `ShareLinkField` với `{origin}/team/{code}` và link "Mở trang đội" (`frontend/src/features/team-builder/components/SaveTeamDialog.tsx:72-94`; `frontend/src/features/team-builder/components/ShareLinkField.tsx:13-15`). Bấm "Sao chép" ghi vào clipboard (`frontend/src/features/team-builder/components/ShareLinkField.tsx:23-31`).
7. Mở link ở cửa sổ ẩn danh: không có cache Query, không có `localStorage`. Host trả `index.html` cho mọi route (`docs/architecture.md:472`); repo không có file `_redirects` trong `frontend/public`, nên cơ chế rewrite trên host chưa xác định từ code. Router lazy tải `SharedTeamPage` (`frontend/src/app/router.tsx:53-56`).
8. `isValidShareCode` đúng nên `useSharedTeam` gọi `GET /api/v1/teams/shared/{code}` (`frontend/src/pages/SharedTeamPage.tsx:52-54`; `frontend/src/features/team-builder/hooks.ts:45-52`; `frontend/src/features/team-builder/api.ts:59-61`). Backend `TeamController.shared` (`backend/src/main/java/com/pokenexus/team/controller/TeamController.java:46-50`), `TeamService.findByShareCode` (`backend/src/main/java/com/pokenexus/team/service/TeamService.java:89-99`), `TeamMapper` sắp member theo slot (`backend/src/main/java/com/pokenexus/team/mapper/TeamMapper.java:18-29`).
9. Trang sắp lại theo slot, render 6 `SharedMemberCard` (`frontend/src/pages/SharedTeamPage.tsx:55-58`, `154-156`); gọi tiếp `POST /synergy/analyze` với 6 ID để vẽ heatmap gọn và đánh giá (`frontend/src/pages/SharedTeamPage.tsx:59-61`, `163-164`, `196-203`). Phụ đề dùng `synergyScore` đã lưu (`frontend/src/pages/SharedTeamPage.tsx:66-76`).

**2. Request và response**

```json
{
  "name": "Rain Team",
  "members": [
    { "slot": 1, "pokemonId": 6, "nickname": null },
    { "slot": 2, "pokemonId": 130, "nickname": null },
    { "slot": 3, "pokemonId": 149, "nickname": null },
    { "slot": 4, "pokemonId": 663, "nickname": null },
    { "slot": 5, "pokemonId": 637, "nickname": null },
    { "slot": 6, "pokemonId": 248, "nickname": null }
  ]
}
```

```json
{
  "shareCode": "a1B2c3D4",
  "name": "Rain Team",
  "synergyScore": 41.0,
  "createdAt": "2026-11-06T09:30:00Z",
  "members": [
    { "slot": 1, "id": 6, "name": "charizard", "types": ["fire", "flying"], "nickname": null },
    { "slot": 6, "id": 248, "name": "tyranitar", "types": ["rock", "dark"], "nickname": null }
  ]
}
```

- Body lưu khớp test `frontend/src/pages/TeamBuilderPage.test.tsx:262-270` (Tyranitar 248 làm slot 6 là dữ liệu test). Response rút gọn còn 2 thành viên; `shareCode` và `synergyScore` là số minh họa. Cùng body này được trả lại cho `GET /teams/shared/{code}`.

#### IV. Luồng 4: nhập Showdown rồi xuất lại

**1. Nhập**

1. Bấm "Nhập Showdown" (`frontend/src/pages/TeamBuilderPage.tsx:248-254`); `DialogShell` mở `ImportContent` (`frontend/src/features/team-builder/components/ShowdownDialogs.tsx:49-84`).
2. Dán văn bản, bấm "Nhập đội". `parseShowdown` tách khối và lấy tên loài (`frontend/src/features/team-builder/components/ShowdownDialogs.tsx:115`; `frontend/src/features/team-builder/showdown.ts:98-119`).
3. Mỗi dòng gọi `resolveShowdownName` song song (`frontend/src/features/team-builder/components/ShowdownDialogs.tsx:122-124`). Với từng tên:
   - `Rainmaker (Pelipper) (M) @ Damp Rock`: bỏ `(M)`, lấy `Pelipper` trong ngoặc, cắt vật phẩm; slug `pelipper`; `GET /api/v1/pokemon/pelipper`.
   - `Urshifu-Rapid-Strike @ Mystic Water`: slug `urshifu-rapid-strike`; `GET /api/v1/pokemon/urshifu-rapid-strike`. Nếu 404 thì tìm tiền tố, rồi thử `urshifu-rapid`, `urshifu` (`frontend/src/features/team-builder/showdown.ts:147-154`).
   - `Landorus-Therian (F)`: bỏ `(F)`; slug `landorus-therian`; thử đúng tên.
   - `Indeedee-F @ Psychic Seed`: slug `indeedee-f`, bảng ngoại lệ đổi thành `indeedee-female` (`frontend/src/features/team-builder/showdown.ts:43`).
   - Dòng không phải tên (ví dụ `???` hoặc `Fakemon`): regex loại ngay hoặc mọi bước đều 404, ref `null`, vào `unmatched`.
4. Đúng tên đi tới `PokemonController.detail` (`backend/src/main/java/com/pokenexus/pokedex/controller/PokemonController.java:112-118`) và `PokemonQueryService.findDetail` (`backend/src/main/java/com/pokenexus/pokedex/service/PokemonQueryService.java:71-85`). Tìm tiền tố đi tới `PokemonController.search` (`backend/src/main/java/com/pokenexus/pokedex/controller/PokemonController.java:76-86`), xếp khớp đầu tên trước rồi theo `id` (`backend/src/main/java/com/pokenexus/pokedex/repository/PokemonRepository.java:47`).
5. Nếu dialog đã đóng thì dừng (`frontend/src/features/team-builder/components/ShowdownDialogs.tsx:125`). `planImport` bỏ trùng, lấy 6 con đầu: 5 vào `ids`, con thứ 6 vào `sixth`, con thứ 7 trở đi đếm vào `overflow` (`frontend/src/features/team-builder/showdown.ts:158-176`).
6. `onImport(plan)` gọi `handleImport`: nhớ ref để hiện tên ngay, `draft.replace(plan.ids, plan.sixth)` (`frontend/src/pages/TeamBuilderPage.tsx:117-120`). Effect ghi URL `ids`, `six` và `localStorage`; key analyze đổi nên gọi phân tích mới (`frontend/src/pages/TeamBuilderPage.test.tsx:133-138`).
7. Dialog chuyển sang `ImportSummary` liệt kê dòng bỏ qua, số con trùng, tràn và câu "Chiêu thức, vật phẩm, Ability, EV và tính cách đã được bỏ qua." (`frontend/src/features/team-builder/components/ShowdownDialogs.tsx:209-245`).

```text
Rainmaker (Pelipper) (M) @ Damp Rock
Ability: Drizzle
- Hurricane

Urshifu-Rapid-Strike @ Mystic Water

Landorus-Therian (F)

Indeedee-F @ Psychic Seed
```

```http
GET /api/v1/pokemon/indeedee-female
GET /api/v1/pokemon/search?q=landorus&limit=10&form=DEFAULT&form=REGIONAL&form=MEGA&form=GMAX&form=OTHER
```

- Request thứ hai chỉ xảy ra khi đúng tên trả 404 (ví dụ dòng `Landorus`). ID thật của các dạng trong DB: chưa xác định từ code.

**2. Xuất và nhập lại**

1. Bấm "Xuất Showdown" (tắt khi đội trống) (`frontend/src/pages/TeamBuilderPage.tsx:255-262`). `ShowdownExportDialog` nhận `ids = teamIds` (gồm cả slot 6) (`frontend/src/pages/TeamBuilderPage.tsx:390`).
2. `usePokemonDetails(ids)` gọi `GET /api/v1/pokemon/{id}` cho từng ID, key `['pokemon', 'detail', '<id>']`; nếu panel Tốc độ đã tải thì lấy luôn từ cache (`frontend/src/features/team-builder/components/ShowdownDialogs.tsx:279`; `frontend/src/features/pokemon-detail/hooks.ts:5-7`, `29-37`).
3. Đủ chi tiết thì `toShowdownName` đổi `name`, `speciesName`, `formCategory` sang tên Showdown và `formatShowdownTeam` nối các khối (`frontend/src/features/team-builder/components/ShowdownDialogs.tsx:283-286`; `frontend/src/features/team-builder/showdown.ts:192-204`).
4. "Sao chép" ghi clipboard; thất bại thì chọn text và báo nhấn Ctrl+C (`frontend/src/features/team-builder/components/ShowdownDialogs.tsx:288-296`, `262-268`).
5. Nhập lại chính văn bản đó: dạng khác mặc định (`Landorus-Therian`, `Indeedee-F`) khớp đúng tên hoặc qua bảng ngoại lệ; dạng mặc định chỉ có tên loài (`Landorus`) đi qua tìm tiền tố và nhận kết quả khớp đầu tên có `id` nhỏ nhất (`frontend/src/features/team-builder/showdown.test.ts:113-117`). Thứ tự giữ nguyên nên 5 con đầu về `ids`, con thứ 6 về `sixth`.

```text
Landorus

Indeedee-F

Garchomp
```

- Văn bản trên là kết quả xuất của `[645, 10186, 445]` trong `frontend/src/features/team-builder/components/ShowdownDialogs.test.tsx:145-148`. Chưa có test nào chạy trọn vòng xuất rồi tra tên lại (Phần 5).

#### V. Luồng 5: các đường lỗi

| Tình huống | Nơi phát sinh ở backend | Frontend nhận | Thử lại tự động | Hiển thị trên UI |
|---|---|---|---|---|
| 429 khi lưu đội | `SaveRateLimiter.acquire` ném `RateLimitedException` (`backend/src/main/java/com/pokenexus/team/service/SaveRateLimiter.java:56-58`); handler thêm `Retry-After` (`backend/src/main/java/com/pokenexus/common/exception/GlobalExceptionHandler.java:41-43`); CORS cho phép đọc header này (`backend/src/main/java/com/pokenexus/common/config/CorsConfig.java:27`) | `ApiError(429, 'RATE_LIMITED', detail, retryAfterSeconds)` (`frontend/src/lib/http.ts:61-77`) | Không: mutation, code không cấu hình retry (`frontend/src/lib/queryClient.ts:11-18`) | `role="alert"` trong dialog: "Bạn lưu đội quá nhanh. Hãy thử lại sau 42 giây." hoặc câu mặc định nếu thiếu header (`frontend/src/features/team-builder/components/SaveTeamDialog.tsx:96-97`, `130-137`; `frontend/src/lib/errorMessages.ts:10`, `20-23`) |
| 413 body quá lớn | `RequestBodyLimitFilter` đọc tối đa 16 KB + 1 byte, ném `PAYLOAD_TOO_LARGE` khi Spring đọc body (`backend/src/main/java/com/pokenexus/common/web/RequestBodyLimitFilter.java:27`, `40-44`, `104-110`) | `ApiError(413, 'PAYLOAD_TOO_LARGE')` | Không (4xx) | "Dữ liệu gửi đi quá lớn." trong alert của dialog lưu hoặc `ErrorState` của heatmap, đề xuất (`frontend/src/lib/errorMessages.ts:12`). Với UI hiện tại body tối đa 6 ID và tên 60 ký tự nên không chạm 16 KB; chỉ xảy ra khi gọi API bằng công cụ khác |
| 503 `DATA_NOT_READY` | Registry rỗng khi phân tích, đề xuất (`backend/src/main/java/com/pokenexus/synergy/service/PokemonProfileRegistry.java:85-95`); lưu đội khi mọi ID không thấy và DB rỗng (`backend/src/main/java/com/pokenexus/team/service/TeamService.java:74-77`); tra tên Showdown khi DB rỗng (`backend/src/main/java/com/pokenexus/pokedex/service/PokemonQueryService.java:78-84`, `139-143`) | `ApiError(503, 'DATA_NOT_READY')` | Query: 1 lần (`frontend/src/lib/queryClient.ts:5-8`); mutation, nhập Showdown: không | "Dữ liệu Pokémon đang được nạp. Hãy thử lại sau ít phút." trong `ErrorState` có nút "Thử lại" (heatmap, đề xuất), các panel khác hiện câu "Chưa ...", thẻ slot "Chưa tải được"; trong dialog lưu và dialog nhập là alert (`frontend/src/lib/errorMessages.ts:13`; `frontend/src/features/team-builder/components/ShowdownDialogs.tsx:134-140`) |
| Mất mạng, backend tắt | Không tới backend | `fetch` ném lỗi, đổi thành `ApiError(0, 'NETWORK_ERROR')` (`frontend/src/lib/http.ts:55-60`) | Query: 1 lần (status 0 không phải 4xx) | "Không kết nối được máy chủ. Hãy kiểm tra backend đã chạy chưa." ở mọi nơi trên; trang đội chia sẻ hiện `ErrorState` có "Thử lại" vì không phải lỗi không tìm thấy (`frontend/src/pages/SharedTeamPage.tsx:131-139`); xuất Showdown hiện "Chưa tải được thông tin đội để xuất." |

- Request bị hủy do key đổi trả `AbortError`, được ném lại nguyên vẹn, không thành thông báo lỗi (`frontend/src/lib/http.ts:58`).
- Mã khác hay gặp: 400 `UNKNOWN_POKEMON` khi URL chứa ID không tồn tại, hiện "Có Pokémon trong đội không còn tồn tại." (`frontend/src/pages/TeamBuilderPage.test.tsx:455-468`); 404 `TEAM_NOT_FOUND` hoặc 400 `INVALID_PARAMETER` ở trang chia sẻ hiện panel "Không tìm thấy đội" (`frontend/src/pages/SharedTeamPage.tsx:44-49`, `113-130`).
- Đội vẫn lưu được khi phân tích đang lỗi, vì nút Lưu chỉ phụ thuộc `hasMembers` (`frontend/src/pages/TeamBuilderPage.tsx:179`).

### IV. Câu hỏi có thể bị hỏi

| # | Câu hỏi | Trả lời mẫu (2-4 câu, nói được thành lời) | Nguồn |
|---|---|---|---|
| 1 | Team Builder làm được gì mà trang tra cứu thường không làm? | Nó nhận 1-6 Pokémon, trả ma trận 18 hệ x từng thành viên, đánh dấu lỗ hổng nghiêm trọng, chấm điểm đội 0-100 và đề xuất 3 Pokémon cho slot tiếp theo kèm lý do có số liệu. Người dùng thấy ngay điểm tăng khi thêm đề xuất. | `docs/spec.md:65-93`; `frontend/src/pages/TeamBuilderPage.tsx:63-82` |
| 2 | Đội nháp lưu ở đâu, vì sao không dùng Redux hay Zustand? | Trong `useTeamDraft` dùng `useReducer`, đồng bộ lên URL và `localStorage`. Đây là state toàn cục duy nhất nên không cần thêm thư viện; URL cho phép chia sẻ và reload, `localStorage` giữ đội khi quay lại từ menu. | `frontend/src/features/team-builder/useTeamDraft.ts:100-165`; `docs/architecture.md:324`, `340` |
| 3 | URL và `localStorage` mâu thuẫn thì bên nào thắng? | URL thắng. Khởi tạo đọc `ids` từ URL trước, chỉ khi rỗng mới đọc `localStorage`, nên link chia sẻ luôn mở đúng đội. | `frontend/src/features/team-builder/useTeamDraft.ts:88-90`; `frontend/src/features/team-builder/useTeamDraft.test.tsx:121-127` |
| 4 | Vì sao ghi URL bằng `replace: true` và `preventScrollReset: true`? | Mỗi lần thêm, bỏ thành viên không nên tạo một mục lịch sử, nếu không nút Back phải bấm nhiều lần. `preventScrollReset` để `ScrollRestoration` không kéo trang về đầu khi chỉ query string đổi. | `frontend/src/features/team-builder/useTeamDraft.ts:116-128`; `docs/architecture.md:342` |
| 5 | Tham số `?add=` dùng để làm gì? | Các nút "Thêm vào đội" ở trang chi tiết, so sánh, Pokémon hôm nay dẫn tới `/team-builder?add=<id>`. Hook nối ID đó vào đội nháp đang có thay vì thay thế, rồi tự xóa `add` khỏi URL; đội đủ 5 hoặc trùng thì bỏ qua. | `frontend/src/features/team-builder/useTeamDraft.ts:91-93`, `124`; `frontend/src/features/pokemon-detail/components/StatPanel.tsx:80`; `frontend/src/features/team-builder/useTeamDraft.test.tsx:129-148` |
| 6 | Vì sao chỉ cho chọn 5, còn slot 6 tách riêng? | Endpoint đề xuất cần ít nhất 1 chỗ trống nên nhận tối đa 5 ID; slot 6 dành cho đề xuất. Phân tích nhận tới 6 để chấm cả đội đủ, nhờ vậy kịch bản demo thấy điểm tăng khi thêm đề xuất. | `backend/src/main/java/com/pokenexus/synergy/dto/RecommendationRequest.java:13`; `backend/src/main/java/com/pokenexus/synergy/dto/AnalyzeRequest.java:9`; `docs/spec.md:7` |
| 7 | Bỏ một thành viên khi slot 6 đang có đề xuất thì sao? | Trang bỏ thành viên đó, đưa Pokémon slot 6 vào đội 5 người và xóa `six`. Đội không mất thành viên đã chọn, và slot 6 lại trống để nhận đề xuất mới. | `frontend/src/pages/TeamBuilderPage.tsx:103-109`; `frontend/src/pages/TeamBuilderPage.test.tsx:308-327` |
| 8 | Chống trùng Pokémon ở những tầng nào? | Reducer bỏ qua `add` trùng, ô tìm loại các ID đã có, thẻ đề xuất trùng bị tắt, nhập Showdown bỏ trùng. Backend vẫn kiểm lại và trả `DUPLICATE_POKEMON`. | `frontend/src/features/team-builder/useTeamDraft.ts:51`; `frontend/src/pages/TeamBuilderPage.tsx:232`; `frontend/src/features/team-builder/components/RecommendationList.tsx:71`, `84`; `frontend/src/features/team-builder/showdown.ts:164-166`; `backend/src/main/java/com/pokenexus/team/service/TeamService.java:69-70` |
| 9 | Vì sao dùng TanStack Query thay vì `useEffect` + `fetch`? | Nó cho cache theo key, trạng thái loading, error, hủy request bằng `AbortSignal`, retry có điều kiện và `keepPreviousData`. Viết tay những thứ này trong `useEffect` dễ sinh race condition khi người dùng đổi đội liên tục. | `frontend/src/features/team-builder/hooks.ts:16-52`; `frontend/src/lib/queryClient.ts:5-18` |
| 10 | Query key của phân tích là gì, vì sao `staleTime: Infinity`? | Key là `['synergy', 'analyze', ids]`. Kết quả chỉ phụ thuộc danh sách ID và dữ liệu tĩnh, nên không bao giờ cũ; bỏ một con rồi thêm lại thì lấy ngay từ cache, không gọi mạng. | `frontend/src/features/team-builder/hooks.ts:18-21`; `docs/architecture.md:333` |
| 11 | `keepPreviousData` giúp gì cho trải nghiệm? | Khi đội đổi, giao diện giữ kết quả cũ và làm mờ 60% thay vì nháy về skeleton. Trang dùng `isPlaceholderData` để làm mờ, tắt nút thêm đề xuất, và không đọc tóm tắt cũ qua `aria-live`. | `frontend/src/features/team-builder/hooks.ts:22`; `frontend/src/features/team-builder/components/WeaknessHeatmap.tsx:405-408`; `frontend/src/features/team-builder/components/RecommendationList.tsx:57`, `84`; `frontend/src/pages/TeamBuilderPage.tsx:80` |
| 12 | Có debounce khi gọi phân tích không? | Không. Mỗi lần đội đổi là một key mới và gọi ngay; chỉ ô tìm tên có debounce 250 ms. Phân tích tính trong bộ nhớ, mục tiêu dưới 50 ms, nên chấp nhận được; tài liệu kiến trúc còn ghi 300 ms là chỗ lệch. | `frontend/src/features/team-builder/hooks.ts:16-24`; `frontend/src/components/pokemon/PokemonSearchBox.tsx:22`; `docs/architecture.md:180` |
| 13 | Khi nào gọi đề xuất? Vì sao thêm vào slot 6 không gọi lại? | Gọi ngay khi đội có ít nhất 1 thành viên. Key đề xuất dựa trên `draft.ids` (5 người chọn), không gồm slot 6, nên thêm slot 6 chỉ gọi lại phân tích. | `frontend/src/pages/TeamBuilderPage.tsx:63`; `frontend/src/features/team-builder/hooks.ts:33-35`; `frontend/src/pages/TeamBuilderPage.test.tsx:287-293` |
| 14 | Người dùng đổi đội liên tục thì request cũ có bị bỏ không? | `queryFn` truyền `signal` xuống `fetch`; query cũ mất observer có thể bị TanStack hủy. Hủy sinh `AbortError`, `http.ts` ném lại nguyên vẹn nên không hiện lỗi; kết quả cũ cũng không ghi đè vì nằm ở key khác. | `frontend/src/features/team-builder/hooks.ts:19`; `frontend/src/lib/http.ts:58` |
| 15 | Heatmap lấy dữ liệu gì và sắp xếp ra sao? | Cột là `members`, hàng là `typeMatrix`, ô là `multipliers` cùng thứ tự với `members`. Frontend sắp lỗ hổng nghiêm trọng trước, rồi mức hở, rồi số thành viên yếu, hòa thì giữ thứ tự API. | `frontend/src/features/team-builder/components/WeaknessHeatmap.tsx:326-333`; `frontend/src/features/team-builder/teamAnalysis.ts:24-35` |
| 16 | "Lỗ hổng nghiêm trọng" và "mức hở" định nghĩa thế nào? Vì sao Rock bị đánh dấu? | Tổng mức yếu (x2 tính 1, x4 tính 2) từ 2 trở lên và không ai kháng là lỗ hổng; mức hở là tổng mức yếu trừ số thành viên kháng, không âm. Rock đánh 3 con x4 và 2 con x2, tổng 8, không ai kháng. | `docs/architecture.md`, Phần 5, mục II; `frontend/src/features/team-builder/components/WeaknessHeatmap.tsx:385-388`; `SynergyAnalyzerTest.java:36-41` |
| 17 | Điểm đội 20 của đội mẫu ở đâu ra? | Backend tính `100 - 4 x tổng mức hở - 8 x số lỗ hổng`. Đội mẫu có tổng mức hở 16 và 2 lỗ hổng (Rock, Electric), nên 100 - 64 - 16 = 20; frontend chỉ làm tròn và hiển thị. | `docs/architecture.md`, Phần 5, mục II; `SynergyAnalyzerTest.java:64`; `frontend/src/features/team-builder/teamAnalysis.ts:37-39` |
| 18 | Các mức "An toàn, Thấp, Trung bình, Cao" lấy ngưỡng nào? | 0 là An toàn, 1-2 Thấp, 3-4 Trung bình, từ 5 Cao, theo thang của design system. Nhãn luôn có chữ, không chỉ dựa vào màu. | `frontend/src/features/team-builder/teamAnalysis.ts:17-22`; `docs/design-system.md`, Phần 2, mục IV |
| 19 | Vì sao ô x1 để trống? Người dùng trình đọc màn hình có thiệt không? | Để mắt chỉ tập trung vào ô có màu. Ô vẫn chứa chữ "x1" ẩn bằng `sr-only` qua `NeutralMark`, bảng có ghi chú "Ô trống là x1" và `caption` ẩn. | `frontend/src/features/team-builder/components/WeaknessHeatmap.tsx:96-105`, `119-123`; `frontend/src/features/team-builder/components/WeaknessHeatmap.test.tsx:70-84` |
| 20 | Heatmap mobile khác desktop thế nào? Vì sao render cả hai? | Từ `md` là bảng 18 hàng có ô lọc; dưới `md` là thẻ theo hệ, mặc định chỉ hệ có áp lực, có nút "Xem đủ 18 hệ". Cả hai nằm trong DOM, bản không dùng bị `display: none` nên không vào thứ tự Tab hay cây accessibility. | `frontend/src/features/team-builder/components/WeaknessHeatmap.tsx:333-383` |
| 21 | Chip "+12 so với lần trước" tính thế nào? | `useScoreDelta` nhớ điểm và khóa đội lần trước; khi khóa đội trong response đổi thì lấy hiệu hai điểm đã làm tròn. Lần phân tích đầu tiên trả 0 nên không hiện chip; đội về rỗng thì xóa lịch sử. | `frontend/src/features/team-builder/hooks.ts:60-72`; `frontend/src/pages/TeamBuilderPage.tsx:81-82`; `frontend/src/features/team-builder/components/TeamScoreGauge.tsx:7-16` |
| 22 | Vì sao khóa đội của chip lấy từ response thay vì từ draft? | Trong lúc chờ, `keepPreviousData` vẫn trả response cũ; nếu lấy từ draft thì sẽ so điểm cũ với chính nó dưới khóa mới. Lấy từ `members` của response đảm bảo chỉ so khi kết quả mới thật sự về. | `frontend/src/pages/TeamBuilderPage.tsx:79-82`; `frontend/src/features/team-builder/hooks.ts:66-69` |
| 23 | Panel "Tấn công và chỉ số" và "Đánh giá đội" render từ đâu? | Cùng response phân tích: `offensiveCoverage` ra số hệ phủ và các hệ chưa phủ, `statRadar` ra radar và bảng 6 chỉ số, `insights` chia theo `tone` thành Điểm mạnh và Điểm yếu. Không có request riêng. | `frontend/src/features/team-builder/components/CoverageAndStats.tsx:14-61`; `frontend/src/features/team-builder/components/TeamInsights.tsx:12-45` |
| 24 | Chọn lối chơi gửi gì lên server? | Radio chọn `PlayStyle`, giá trị nằm trong query key nên đổi là gọi lại. Body chỉ thêm `playStyle` khi khác `BALANCE` vì backend mặc định `BALANCE`. | `frontend/src/features/team-builder/components/PlayStylePicker.tsx:9-46`; `frontend/src/features/team-builder/api.ts:50`; `backend/src/main/java/com/pokenexus/synergy/dto/RecommendationRequest.java:25`; `frontend/src/pages/TeamBuilderPage.test.tsx:163-181` |
| 25 | Ô "Loại huyền thoại, thần thoại và Paradox" loại những gì? | Gửi `excludeLegendary: true`; backend loại huyền thoại, thần thoại và 20 Pokémon Paradox theo danh sách ID cố định. Ô này và lối chơi không lên URL, reload sẽ về mặc định. | `frontend/src/pages/TeamBuilderPage.tsx:150-158`; `backend/src/main/java/com/pokenexus/synergy/service/RecommendationEngine.java:32-34`; `docs/architecture.md:326` |
| 26 | Thêm đề xuất khi đội có 4 người và khi có 5 người khác nhau thế nào? | 4 người thì `add` vào slot 5, cả phân tích và đề xuất đều gọi lại. 5 người thì `setSixth`, chỉ phân tích gọi lại với 6 ID. | `frontend/src/pages/TeamBuilderPage.tsx:111-115`; `frontend/src/pages/TeamBuilderPage.test.tsx:209-233`, `273-294` |
| 27 | Lỗi F8 là gì và sửa thế nào? | Trên mobile, khối đề xuất được đẩy lên bằng CSS `order`, nên nhìn thì ở dưới slot nhưng `Tab` lại tới cuối trang. Bản sửa dùng `useMediaQuery` để render khối đó đúng chỗ trong DOM: dưới slot, sau heatmap, hoặc cột cuối trên desktop. | `PLAN.md:161`; `frontend/src/pages/TeamBuilderPage.tsx:68`, `240`, `332`, `367`; `frontend/src/pages/TeamBuilderPage.test.tsx:471-581` |
| 28 | Thứ tự `Tab` trên trang là gì? | Mobile có thành viên: ô tìm, slot, Nhập, Xuất, lối chơi, ô loại huyền thoại, thẻ đề xuất, Đặt lại, Lưu và chia sẻ (đúng thứ tự nhìn từ trái sang phải, PR #76), rồi heatmap. Desktop: cột trái, cột giữa, rồi khối đề xuất. Nhóm radio chỉ chiếm một điểm dừng `Tab`, đổi bằng phím mũi tên. | `frontend/src/pages/TeamBuilderPage.tsx:212-376`; `frontend/src/features/team-builder/components/PlayStylePicker.tsx:31-38` |
| 29 | Validate tên đội ở đâu, có khớp backend không? | Frontend trim rồi yêu cầu 1-60 ký tự, ô có `maxLength=60`, báo lỗi khi blur hoặc submit. Backend `@NotBlank @Size(max = 60)` và `strip()`, nên server vẫn là nơi kiểm cuối. | `frontend/src/features/team-builder/teamAnalysis.ts:63-68`; `frontend/src/features/team-builder/components/SaveTeamDialog.tsx:111-128`; `backend/src/main/java/com/pokenexus/team/dto/CreateTeamRequest.java:11`, `14-16` |
| 30 | Bấm Lưu hai lần liên tiếp có tạo hai đội không? | Không từ cùng một dialog: hàm submit dừng khi `isPending`, nút bị tắt và có `aria-busy` trong lúc lưu. Mở lại dialog sau khi lưu xong thì là mutation mới, sẽ tạo đội mới. | `frontend/src/features/team-builder/components/SaveTeamDialog.tsx:38`, `68`, `142-149` |
| 31 | Lưu quá nhanh thì người dùng thấy gì? | Backend trả 429 kèm `Retry-After`; CORS đã expose header này nên frontend đọc được. Dialog hiện "Bạn lưu đội quá nhanh. Hãy thử lại sau 42 giây.", thiếu header thì câu "đợi một phút". | `backend/src/main/java/com/pokenexus/common/config/CorsConfig.java:27`; `frontend/src/lib/http.ts:73-77`; `frontend/src/lib/errorMessages.ts:20-23`; `frontend/src/pages/TeamBuilderPage.test.tsx:349-390` |
| 32 | Link chia sẻ tạo thế nào? Không sao chép được thì sao? | Ghép `window.location.origin` với `/team/{shareCode}`, nên đúng cả local lẫn production. Clipboard API bị chặn thì ô link được focus và chọn sẵn, thông báo nhấn Ctrl+C. | `frontend/src/features/team-builder/components/ShareLinkField.tsx:13-31`; `frontend/src/lib/clipboard.ts:1-10` |
| 33 | Mở trang chia sẻ với mã sai, mã không tồn tại, server lỗi thì sao? | Mã sai định dạng: hiện "Không tìm thấy đội" ngay, không gọi API. 404 `TEAM_NOT_FOUND` hoặc 400 `INVALID_PARAMETER`: cùng panel đó. Lỗi khác: `ErrorState` có nút "Thử lại". | `frontend/src/pages/SharedTeamPage.tsx:44-49`, `113-139`; `frontend/src/features/team-builder/hooks.ts:49` |
| 34 | Người xem mở link đội chia sẻ có mất đội nháp của họ không? | Trang chia sẻ không chạm `useTeamDraft`. Chỉ khi bấm "Mở trong Team Builder", URL `ids` mới thay đội nháp và ghi đè `localStorage` của họ. | `frontend/src/pages/SharedTeamPage.tsx:178-183`; `frontend/src/features/team-builder/useTeamDraft.ts:88-90`, `142` |
| 35 | Nhập Showdown đọc văn bản theo quy tắc nào? | Khối cách nhau bằng dòng trống, dòng `===` bị bỏ; dòng đầu khối là tên, bỏ vật phẩm sau `@`, bỏ `(M)`, `(F)`, nếu có `Biệt danh (Loài)` thì lấy loài. Các dòng khác bị bỏ và có thông báo. | `frontend/src/features/team-builder/showdown.ts:92-119`; `docs/spec.md:180` |
| 36 | `Urshifu-Rapid-Strike`, `Landorus-Therian`, `Indeedee-F` được tra ra sao? | Tên được chuẩn hóa thành slug; `Indeedee-F` qua bảng ngoại lệ thành `indeedee-female`. Thử đúng tên trước, rồi tìm theo tiền tố trên mọi dạng, rồi bỏ dần đoạn cuối. Hai tên đầu thường khớp ngay ở bước đúng tên nếu DB có dạng đó. | `frontend/src/features/team-builder/showdown.ts:42-57`, `121-156`; `frontend/src/features/team-builder/showdown.test.ts:105-111` |
| 37 | Dòng không nhận ra và Pokémon thứ 7 xử lý thế nào? | Dòng không nhận ra được liệt kê theo số dòng; con trùng và con thứ 7 trở đi bị bỏ và báo số lượng. Không nhận ra con nào thì báo lỗi và giữ nguyên đội. | `frontend/src/features/team-builder/showdown.ts:158-176`; `frontend/src/features/team-builder/components/ShowdownDialogs.tsx:127-131`, `211-220` |
| 38 | Hủy dialog khi đang tra tên thì sao? (F3) | Nội dung dialog unmount khi đóng, cleanup đặt `closedRef = true`; khi request về, code thấy cờ này và bỏ kết quả, không gọi `onImport`. Request vẫn chạy hết vì không truyền `signal`, chỉ là kết quả bị bỏ. | `frontend/src/features/team-builder/components/ShowdownDialogs.tsx:103-110`, `125`; `frontend/src/features/team-builder/components/ShowdownDialogs.test.tsx:89-111` |
| 39 | Xuất Showdown sinh tên thế nào, nhập lại có ra đúng đội không? | Dạng mặc định dùng tên loài (`Landorus`), dạng khác ghép hậu tố (`Landorus-Therian`), cộng bảng ngoại lệ (`Indeedee-F`). Nhập lại khớp đúng tên hoặc qua tìm tiền tố lấy dạng có `id` nhỏ nhất; spec yêu cầu ra đúng đội nhưng chưa có test chạy trọn vòng. | `frontend/src/features/team-builder/showdown.ts:192-204`; `docs/spec.md:183`; `frontend/src/features/team-builder/showdown.test.ts:113-117`, `169-180` |
| 40 | Backend tắt giữa lúc demo thì UI ra sao? | `fetch` lỗi thành `NETWORK_ERROR`, query thử lại 1 lần rồi hiện "Không kết nối được máy chủ..." với nút "Thử lại". Đội nháp vẫn còn trên URL và `localStorage`, bật backend lên rồi bấm thử lại là chạy tiếp. | `frontend/src/lib/http.ts:55-60`; `frontend/src/lib/queryClient.ts:5-8`; `frontend/src/features/team-builder/components/WeaknessHeatmap.tsx:399-402` |
| 41 | DB chưa nạp dữ liệu thì sao? | Backend trả 503 `DATA_NOT_READY` cho phân tích, đề xuất và cả lưu đội khi DB rỗng. UI hiện "Dữ liệu Pokémon đang được nạp. Hãy thử lại sau ít phút." thay vì báo sai là ID không tồn tại. | `backend/src/main/java/com/pokenexus/synergy/service/PokemonProfileRegistry.java:91-93`; `backend/src/main/java/com/pokenexus/team/service/TeamService.java:74-77`; `frontend/src/lib/errorMessages.ts:13` |
| 42 | Lỗi 413 có xảy ra khi dùng giao diện không? | Gần như không: body lớn nhất là 6 thành viên và tên 60 ký tự, rất xa 16 KB. Giới hạn này chống người gọi API trực tiếp gửi body khổng lồ; nếu có, UI hiện "Dữ liệu gửi đi quá lớn." | `backend/src/main/java/com/pokenexus/common/web/RequestBodyLimitFilter.java:27`; `frontend/src/lib/errorMessages.ts:12` |
| 43 | Test của Team Builder bao phủ những gì, giả lập backend ra sao? | Có unit test hàm thuần và test tích hợp trang. `routeFetch` thay `fetch` toàn cục theo `"METHOD /path"`, còn `http.ts`, TanStack Query và router chạy thật, nên test kiểm được cả body gửi đi lẫn URL. | `frontend/src/features/team-builder/testing.tsx:128-162`; `frontend/src/pages/TeamBuilderPage.test.tsx:109-114` |
| 44 | Điểm yếu thật của phần này là gì? | Không debounce phân tích; `localStorage` không giữ slot 6; lối chơi và bộ lọc không lên URL; `breakdown` của đề xuất không hiển thị; nhập Showdown không hủy request và không dùng cache. Thứ tự `Tab` của hai nút Lưu, Đặt lại trên mobile từng ngược thứ tự nhìn, đã sửa ở PR #76. | `frontend/src/features/team-builder/hooks.ts:16-24`; `frontend/src/features/team-builder/useTeamDraft.ts:133`; `frontend/src/features/team-builder/components/RecommendationCard.tsx:19-127`; `frontend/src/features/team-builder/components/ShowdownDialogs.tsx:22-28`; `frontend/src/pages/TeamBuilderPage.tsx:293` |
| 45 | Muốn mở rộng (thêm lối chơi, biệt danh, lưu bộ lọc lên URL) thì sửa ở đâu? | Lối chơi mới: thêm enum backend, kiểu `PlayStyle` và một dòng trong `PLAY_STYLE_OPTIONS`. Biệt danh: `buildTeamMembers` đang gửi `nickname: null`, backend đã nhận tối đa 30 ký tự. Bộ lọc lên URL: thêm tham số vào `useTeamDraft` vì hook này đang sở hữu query string của trang. | `frontend/src/features/team-builder/components/PlayStylePicker.tsx:9-14`; `frontend/src/features/team-builder/teamAnalysis.ts:60`; `backend/src/main/java/com/pokenexus/team/dto/TeamMemberRequest.java:11`; `docs/architecture.md:326` |

### V. Lệch giữa code và tài liệu

- **Debounce và thời điểm gọi đề xuất:** `docs/architecture.md:180` ghi "gọi lại `analyze` mỗi khi đội thay đổi (debounce 300 ms) và chỉ gọi `recommendations` khi người dùng mở khu vực đề xuất". Code không debounce `analyze` (`frontend/src/features/team-builder/hooks.ts:16-24`) và gọi `recommendations` ngay khi đội có thành viên (`frontend/src/pages/TeamBuilderPage.tsx:63`; `frontend/src/features/team-builder/hooks.ts:35`). Debounce duy nhất là 250 ms ở ô tìm (`frontend/src/components/pokemon/PokemonSearchBox.tsx:22`).
- **Bảng query key thiếu:** `docs/architecture.md:333` chỉ liệt kê `['synergy', 'analyze', ids]`; code còn `['synergy', 'recommendations', ids, limit, excludeLegendary, playStyle]` và `['teams', 'shared', shareCode]`, cùng `staleTime: Infinity` (`frontend/src/features/team-builder/hooks.ts:33`, `47`).
- **Sơ đồ đề xuất:** `docs/architecture.md:174` ghi `E->>A: analyze(ids)`; code gọi `resolveTeam` và `evaluate`, không gọi `analyze` (`backend/src/main/java/com/pokenexus/synergy/service/RecommendationEngine.java:52-53`).
- **Điểm đội mẫu trong ví dụ và test:** `docs/api.md`, Phần 5, mục I dùng `teamScore: 41.0` (có ghi là minh họa) và test frontend mock 41 (`frontend/src/pages/TeamBuilderPage.test.tsx:84`); điểm thật của đội mẫu là 20 (`docs/spec.md:93`; `SynergyAnalyzerTest.java:64`). Khi demo nên nói 20.
- **Thứ tự Tab của hai nút Lưu, Đặt lại trên mobile:** code từng dùng `max-md:order-1`, trái yêu cầu "thứ tự focus theo thứ tự đọc" ở `docs/design-system.md:595`. Đã sửa ở PR #76 (Issue #75): hai nút được đặt vào DOM theo `useMediaQuery(MD_MEDIA_QUERY)` (`frontend/src/pages/TeamBuilderPage.tsx:69`, `:293`).
- **Bố cục desktop:** `docs/design-system.md:576` mô tả cột giữa gồm heatmap, "Tấn công và chỉ số", "Tốc độ cấp 50" và khối đề xuất ở cột phải "từ `lg`". Code đặt thêm panel "Đánh giá đội" ở đầu cột giữa (`frontend/src/pages/TeamBuilderPage.tsx:299-317`); từ 1024 px đến dưới 84 rem lưới chỉ có 2 cột và khối đề xuất trải hết chiều ngang ở cuối, chỉ từ 84 rem mới là cột phải (`frontend/src/pages/TeamBuilderPage.tsx:133`, `184`).
- **Chip chênh điểm:** `docs/design-system.md:432` chỉ mô tả chip "+N" màu `success`; code còn hiện chênh âm màu `danger` (`frontend/src/features/team-builder/components/TeamScoreGauge.tsx:11-13`).
- **Ô lọc trong bảng heatmap:** `docs/design-system.md:431` mô tả bảng 18 hàng từ `md`, không nhắc ô "Chỉ hiện N hệ đang gây áp lực" có trong code (`frontend/src/features/team-builder/components/WeaknessHeatmap.tsx:351-365`).
- **Liệt kê file:** `docs/folder-structure.md:169` không ghi `teamAnalysis.ts`, `testing.tsx` trong cây `team-builder/`; `docs/folder-structure.md:216` không ghi `TeamInsights` cho `SharedTeamPage` dù trang có dùng (`frontend/src/pages/SharedTeamPage.tsx:13`, `201`).
- **Vòng xuất rồi nhập Showdown:** `docs/spec.md:183` yêu cầu "nhập lại chính văn bản đã xuất ra đúng đội". Test hiện chỉ kiểm parse ngược tên (`frontend/src/features/team-builder/showdown.test.ts:169-180`) và tra tên riêng lẻ; chưa có test chạy trọn vòng xuất, tra tên, `planImport`.
- **Đội nháp và slot 6 khi reload:** `docs/architecture.md:313` ghi `six` "reload vẫn giữ"; đúng khi reload cùng URL, nhưng `localStorage` chỉ lưu `ids` (`frontend/src/features/team-builder/useTeamDraft.ts:133`, `142`), nên vào lại `/team-builder` từ menu sẽ mất slot 6. Tài liệu không nói rõ trường hợp này.

---

## Phần 8. Câu hỏi tổng quát

- Câu hỏi về từng file nằm ở mục IV của Phần 3 đến Phần 7. Phần này gom câu hỏi cấp sản phẩm, quyết định, quy trình, cách dùng AI và hạn chế, là loại câu giám khảo hay hỏi đầu tiên.
- Câu có ghi "(tự điền)" phụ thuộc trải nghiệm của bạn: khung trả lời chỉ là gợi ý, hãy thay bằng chuyện thật.

### I. Sản phẩm và người dùng

| # | Câu hỏi | Trả lời mẫu | Nguồn |
|---|---|---|---|
| 1 | PokeNexus giải quyết vấn đề gì? | Người chơi muốn xây đội phải tra tương khắc, chỉ số ở nhiều nơi và tự nhẩm điểm yếu chung. PokeNexus gom tra cứu, so sánh và xây đội vào một chỗ; Team Builder tự tính đội đang cùng yếu hệ nào và đề xuất Pokémon bù, kèm lý do. | `docs/product.md`, Phần 1 |
| 2 | Người dùng mục tiêu là ai? | Ba nhóm: người chơi mới cần tra cứu nhanh (Omni-Dex, Bảng tương khắc), người chơi VGC cần kiểm tra lỗ hổng đội (Team Builder), người thích số liệu cần so sánh (Bàn Cân). | `docs/product.md`, Phần 2 |
| 3 | Khác gì một trang wiki Pokémon? | Wiki trả lời "Pokémon này thế nào"; PokeNexus trả lời "đội của tôi thiếu gì, nên thêm ai, vì sao". Mọi kết luận đều có lý do bằng lời và đường dẫn chia sẻ được. | `docs/product.md`, Phần 1, mục III |
| 4 | Tính năng nào là cốt lõi? | Synergy Analyzer: heatmap 18 hệ, điểm đội 0-100, lỗ hổng nghiêm trọng, 3 đề xuất khác tổ hợp hệ, đánh giá điểm mạnh điểm yếu. Thứ tự cắt giảm trong roadmap ghi rõ phần này không bao giờ bị cắt. | `docs/roadmap.md`, Phần 4, mục II |
| 5 | Vì sao không có đăng nhập? | Ngoài phạm vi MVP. Lưu đội không cần tài khoản: mỗi đội có mã chia sẻ 8 ký tự ngẫu nhiên, ai có link thì xem được. | `docs/product.md`, Phần 4 |
| 6 | Vì sao phân tích chỉ dựa trên hệ, không dựa trên chiêu thức, Ability? | Chiêu thức, Ability, vật phẩm nằm ngoài phạm vi MVP. Phân tích theo hệ đã chỉ ra phần lớn lỗ hổng phòng thủ; đây là hạn chế đã ghi rõ, ví dụ Levitate không được tính. | `docs/product.md`, Phần 4, mục II; `docs/architecture.md`, Phần 5 |
| 7 | Đo thành công thế nào? | Người thử xây xong đội và nhận gợi ý dưới 3 phút; API phân tích dưới 50 ms (đo được p95 7,2 ms và 8,6 ms); kịch bản demo chạy trọn trên link thật. | `docs/product.md`, Phần 5 |

### II. Quyết định kỹ thuật

| # | Câu hỏi | Trả lời mẫu | Nguồn |
|---|---|---|---|
| 8 | Vì sao không gọi PokéAPI lúc chạy? | Gọi lúc chạy thì chậm, phụ thuộc mạng và dễ vượt giới hạn tần suất; crawl toàn bộ thì cần hàng nghìn request. Bộ CSV công khai được nạp một lần vào MySQL, cố định ở một commit nên dữ liệu không đổi bất ngờ. | ADR 0002 |
| 9 | Vì sao tính Synergy trong bộ nhớ? | Dữ liệu tĩnh và nhỏ; mỗi lần đề xuất khoảng 23.400 phép tính. Làm trên RAM nhanh và dễ unit test hơn câu SQL phức tạp. Đổi lại thời gian khởi động tăng một chút. | ADR 0003 |
| 10 | Vì sao Java 25 và Spring Boot 4.1? | Java 25 là LTS mới nhất; Spring Boot 3.5 đã hết hỗ trợ mã nguồn mở. Nhược điểm: nhiều hướng dẫn trên mạng còn viết cho Boot 3, nên phải đối chiếu tài liệu chính thức. | ADR 0004 |
| 11 | Vì sao monorepo? | Một PR sửa được cả API lẫn giao diện, tài liệu ở một chỗ, CI tách job backend và frontend. | ADR 0001 |
| 12 | Vì sao backend không trả URL ảnh? | Ảnh là chuyện hiển thị: frontend sinh URL từ ID. Sprite nhỏ tự host để lưới vẫn có ảnh khi mất mạng; artwork lớn hotlink từ kho của PokéAPI để repo không nặng thêm khoảng 170 MB; lỗi thì lùi về sprite rồi ảnh dự phòng. | ADR 0005 |
| 13 | Vì sao Railway và Cloudflare Pages? | Gói miễn phí đủ đến ngày demo, có vùng Singapore gần Việt Nam, backend không ngủ đông. Pages tự trả `index.html` cho mọi route nên SPA chạy không cần cấu hình rewrite. | ADR 0007 |
| 14 | Vì sao TanStack Query mà không Redux? | Gần như toàn bộ state là dữ liệu server: cần cache, trạng thái tải, thử lại. Phần còn lại (bộ lọc, đội nháp) nằm trên URL. Chỉ `useTeamDraft` là state toàn cục. | `docs/architecture.md`, Phần 2; `frontend/CLAUDE.md` |
| 15 | Vì sao lưu bộ lọc và đội nháp trên URL? | Gửi link là người khác thấy đúng màn hình; nút Back hoạt động tự nhiên; tải lại trang không mất trạng thái. | `docs/architecture.md`, Phần 6 |
| 16 | Vì sao Flyway? | Schema được quản lý bằng script có phiên bản; DB local, Testcontainers và production đi qua cùng V1-V3. Quy tắc: không sửa migration đã merge, thay đổi thì thêm file mới. | `docs/database.md`, Phần 5 |
| 17 | Vì sao có cả Lombok lẫn record? | Lombok chỉ dùng cho Entity (getter, constructor, equals theo khóa); DTO là `record` bất biến. | `docs/architecture.md`, Phần 2 |
| 18 | Radar vẽ bằng gì? | SVG tự vẽ, không dùng thư viện biểu đồ. `CLAUDE.md` và `README.md` còn ghi Recharts là chỗ tài liệu cũ, đang sửa ở Issue #74. | Review #70; Phần 5 |

### III. Quy trình và quản lý dự án

| # | Câu hỏi | Trả lời mẫu | Nguồn |
|---|---|---|---|
| 19 | Lập kế hoạch thế nào? | Lùi từ deadline 08/11, chia Epic, Feature, Task, mỗi task tối đa 1 ngày, có cột đầu vào, đầu ra, cách kiểm tra; ưu tiên theo MoSCoW; có thứ tự cắt giảm khi trễ. | `docs/roadmap.md` |
| 20 | Quy trình Git? | GitHub Flow: chỉ `main` lâu dài, mọi thay đổi qua PR có CI, Squash and merge, commit theo Conventional Commits, tag theo mốc (`v0.1.0`, `v0.2.0`, sắp `v1.0.0`). | `docs/git-workflow.md` |
| 21 | Ghi quyết định ở đâu? | 8 ADR trong `docs/adr/`, mỗi ADR có bối cảnh, quyết định, phương án đã cân nhắc, hệ quả. | `docs/adr/` |
| 22 | Dự án có trễ không, xử lý thế nào? | Có: deploy dự kiến 30-31/10 bị lùi vì làm thêm tính năng mở rộng, review Checkpoint 3 đã chỉ ra. Từ 02/11 đóng băng tính năng, ưu tiên deploy, chỉ còn sửa lỗi và tài liệu. Đây là bài học về kỷ luật phạm vi. | Issue #70; `PLAN.md` |
| 23 | Review Checkpoint 3 góp ý gì, đã làm gì? | Bốn điểm: chưa deploy, PR quá lớn, `PLAN.md` dài và lệch, Swagger bật ở production. Đã chặn build gọi `localhost` (PR #69), PR nhỏ theo từng Issue (#76), tài liệu và `PLAN.md` sửa ở #74, deploy là việc đầu tiên còn lại. Cập nhật lại câu này theo tiến độ thật. | Issue #70 |
| 24 | Làm một mình, kiểm soát chất lượng thế nào? | CI chạy lint, test, build cho mỗi PR; test hồi quy viết đỏ trước rồi mới sửa; mỗi PR có mục "Cách kiểm thử" ghi lệnh và kết quả thật. | `.github/workflows/ci.yml`; `CONTRIBUTING.md` |

### IV. Dùng AI

| # | Câu hỏi | Trả lời mẫu | Nguồn |
|---|---|---|---|
| 25 | Có dùng AI không, dùng thế nào? (tự điền) | Khung gợi ý: có, dùng Claude Code như một cộng sự lập trình; quy tắc làm việc ghi trong `CLAUDE.md` (đọc tài liệu trước, không đoán tên class, chạy test thật, không tự commit). Bạn quyết định phạm vi, duyệt kết quả, chạy demo. Nêu 1-2 ví dụ thật bạn đã sửa lại hoặc từ chối đề xuất của AI. | `CLAUDE.md` |
| 26 | Code do AI viết, bạn có hiểu không? (tự điền) | Trả lời bằng hành động: giải thích ngay cách tính `teamScore` hoặc xếp hạng đề xuất (Phần 2, mục VII.A và VII.B), mở đúng file và dòng. Tài liệu này được soạn để bạn đọc lại toàn bộ code; review #70 cũng khuyên đúng điều này. | Issue #70 |
| 27 | Làm sao biết code AI viết là đúng? | Thuật toán có unit test bám 5 ví dụ có đáp án viết trước trong spec; integration test chạy MySQL thật; CI bắt buộc xanh trước khi merge; số liệu đội demo kiểm lại bằng API thật. | `docs/spec.md`, Phần 2, mục V.4; Phần 4, mục II.VII.8 |
| 28 | Ảnh khung cảnh có dùng AI không? | Một số ảnh có vùng vá do công cụ AI vẽ để xóa HUD hoặc người thừa; chỉ nhận khi có Content Credentials, ghép vào ảnh gốc 1920 px và ghi rõ trong `frontend/public/scenes/SOURCES.md`. | ADR 0006, ADR 0008 |

### V. Chất lượng, bảo mật, vận hành

| # | Câu hỏi | Trả lời mẫu | Nguồn |
|---|---|---|---|
| 29 | Nếu nhiều người dùng cùng lúc thì sao? | Synergy chỉ đọc cấu trúc trong bộ nhớ, không truy vấn DB; endpoint `/pokemon/...` trả `Cache-Control` 1 giờ, `/types` 1 ngày nên trình duyệt và CDN đỡ được phần lớn request lặp. Giới hạn thật nằm ở gói hosting (RAM, CPU của Railway Trial), chưa đo tải. | Phần 4, mục II.VI; ADR 0007 |
| 30 | Chống spam lưu đội thế nào? | Tối đa 10 lần lưu mỗi phút cho mỗi IP, theo dõi tối đa 10.000 IP; vượt thì 429 `RATE_LIMITED` kèm `Retry-After`. Trên Railway cần kiểm chứng IP lấy từ header proxy không bị giả mạo (B3). | `backend/src/main/resources/application.yml:29`; `backend/src/main/java/com/pokenexus/team/service/SaveRateLimiter.java:19`; `backend/src/main/java/com/pokenexus/common/exception/GlobalExceptionHandler.java:42`; `docs/architecture.md`, Phần 11 |
| 31 | Có chống SQL injection không? | Truy vấn qua JPA có tham số; ô tìm còn lọc ký tự `[a-z0-9-]` trước khi đưa vào `LIKE`. | `backend/src/main/java/com/pokenexus/pokedex/service/PokemonQueryService.java`; review #70 |
| 32 | Gửi body thật lớn thì sao? | `RequestBodyLimitFilter` giới hạn 16 KB cho `POST`, `PUT`, `PATCH`, kể cả khi client không gửi `Content-Length`; vượt thì 413 `PAYLOAD_TOO_LARGE`, có header CORS. | Phần 3, mục II.V |
| 33 | DB chưa có dữ liệu thì API trả gì? | 503 `DATA_NOT_READY` thay vì danh sách rỗng hay lỗi 500; `/health` trả `dataLoaded` và `pokemonCount`. | Phần 3, mục III; Phần 4, mục III.VI |
| 34 | Mất kết nối DB thì sao? | `/health` trả 503 `DOWN`; profile `prod` đặt timeout kết nối 5 giây để hosting phát hiện nhanh. Phân tích đội vẫn chạy nếu hồ sơ Pokémon đã nạp vào bộ nhớ lúc khởi động, vì `SynergyAnalyzer` chỉ đọc `PokemonProfileRegistry` (`backend/src/main/java/com/pokenexus/synergy/service/SynergyAnalyzer.java:60`). | ADR 0007, Phần 4 |
| 35 | Hiệu năng giao diện đo thế nào? | Lighthouse chế độ mobile trên link thật, 3 lần mỗi route, lấy trung vị; ngưỡng LCP 2,5 s, CLS 0,1, TBT 200 ms, Accessibility và Best Practices từ 90. Đã giảm CLS 375 px mạng chậm từ 0,196-0,884 xuống 0,021 (PR #58). Điền số Lighthouse thật sau T404. | `docs/roadmap.md`, Phần 1, mục I; `PLAN.md` |
| 36 | Khả năng tiếp cận (accessibility)? | Tương phản WCAG AA, màu luôn kèm chữ (`x2`, tên hệ), điều khiển được bằng bàn phím, thứ tự `Tab` khớp thứ tự hiển thị (#69, #76), tôn trọng `prefers-reduced-motion`. | `docs/design-system.md`, Phần 8 |

### VI. Hạn chế và hướng phát triển

| # | Câu hỏi | Trả lời mẫu | Nguồn |
|---|---|---|---|
| 37 | Hạn chế lớn nhất hiện tại? | Phân tích chỉ theo hệ (chưa có chiêu thức, Ability); độ phủ tấn công giả định có chiêu cùng hệ; điểm đề xuất chỉ so sánh tương đối trong một lần gọi; chưa đo tải. | Phần 4, mục II.VII |
| 38 | Trang So sánh có gì chưa tối ưu? | Gọi 3 request cho mỗi cặp (2 chi tiết và 1 compare); có thể gộp vào response compare. Đã ghi là blocker mở trong `PLAN.md`. | `PLAN.md`; Phần 6 |
| 39 | Nếu có thêm thời gian sẽ làm gì? | Chiêu thức và Ability trong phân tích, tính sát thương, tài khoản để quản lý nhiều đội, dữ liệu meta VGC; các ý tưởng ghi thành Issue `priority: future`. | `docs/product.md`, Phần 3, mục II; `README.md`, Phần 2 |
| 40 | Dữ liệu PokéAPI cập nhật thì làm gì? | Đổi commit cố định trong `scripts/download-csv.sh`, chạy lại ingestion ở máy dev, xuất dump mới và nhập lại vào production; không phải sửa code nếu cấu trúc CSV không đổi. | ADR 0002; Phần 3 |

---

## Phần 9. Tra cứu nhanh

### I. Phiên bản

| Thành phần | Phiên bản | Nguồn |
|---|---|---|
| Java, Spring Boot | 25, 4.1.2 | `backend/pom.xml:8` |
| MySQL | 8.4 | `docker-compose.yml` |
| React, React Router | 19.3, 8.5 | `frontend/package.json` |
| TanStack Query, Vite, Tailwind CSS | 5.104, 8.3, 4.3 | `frontend/package.json` |
| TypeScript, Vitest | 6.0, 5.0 | `frontend/package.json` |
| Node.js | 24 (`.nvmrc`) | `.nvmrc` |

### II. Giới hạn và ngưỡng trong code

| Giới hạn | Giá trị | Nguồn |
|---|---|---|
| Body `POST`, `PUT`, `PATCH` | 16 KB, vượt thì 413 | `backend/src/main/java/com/pokenexus/common/web/RequestBodyLimitFilter.java:27` |
| Kích thước trang Pokédex | Mặc định 24, tối đa 100; `page` tối đa `Integer.MAX_VALUE / size` | `backend/src/main/java/com/pokenexus/common/web/PageRequestFactory.java:13-31` |
| Ô tìm tên | Tối đa 30 ký tự | `frontend/src/features/dex/api.ts` (`SEARCH_MAX_LENGTH`) |
| `analyze` | 1-6 Pokémon | `backend/src/main/java/com/pokenexus/synergy/dto/AnalyzeRequest.java:9` |
| `recommendations` | 1-5 Pokémon, `limit` 1-10 (mặc định 3), `minBaseStatTotal` 0-1530 | `backend/src/main/java/com/pokenexus/synergy/dto/RecommendationRequest.java:13-16` |
| Lưu đội | Tên 1-60 ký tự, 1-6 thành viên, slot 1-6, biệt danh tối đa 30 ký tự | `backend/src/main/java/com/pokenexus/team/dto/CreateTeamRequest.java:11-12`, `backend/src/main/java/com/pokenexus/team/dto/TeamMemberRequest.java:9-11` |
| Giới hạn lưu đội | 10 lần mỗi phút mỗi IP (cấu hình `app.team.save-limit-per-minute`), theo dõi tối đa 10.000 IP | `backend/src/main/resources/application.yml:29`; `backend/src/main/java/com/pokenexus/team/service/SaveRateLimiter.java:18-19` |
| Mã chia sẻ | 8 ký tự `[0-9A-Za-z]` từ `SecureRandom`, khoảng 2,18 x 10^14 tổ hợp | `backend/src/main/java/com/pokenexus/team/service/ShareCodeGenerator.java:11-20` |
| Điểm đội | Phạt 4 mỗi pressure, 8 mỗi lỗ hổng; lỗ hổng khi `weakness >= 2` và không ai kháng | `backend/src/main/java/com/pokenexus/synergy/model/TeamAnalysis.java:12-14`, `:45-50` |
| Trọng số Cân bằng | Phòng thủ 0,40, độ phủ 0,20, vai trò 0,25, BST 0,15 | `backend/src/main/java/com/pokenexus/synergy/model/PlayStyle.java:5` |
| Lọc tốc độ theo lối chơi | Hyper Offense từ 80, Trick Room tối đa 60 | `backend/src/main/java/com/pokenexus/synergy/model/PlayStyle.java:6-8` |
| Timeout kết nối DB ở `prod` | 5 giây | `backend/src/main/resources/application-prod.yml` |

### III. Số đo đã có

| Số đo | Giá trị | Nguồn |
|---|---|---|
| p95 `analyze`, `recommendations` (100 request, local) | 7,2 ms, 8,6 ms | `PLAN.md`; `scripts/bench-synergy.sh` |
| Backend trong container 512 MB, 0,5 CPU | Khởi động 27,5 s, chiếm 277 MiB | ADR 0007 |
| Dữ liệu, file dump | 0,8 MB, 156 KB | ADR 0007 |
| CLS 375 px mạng chậm | Từ 0,196-0,884 xuống tối đa 0,021 | `PLAN.md` (PR #58) |
| Bundle JS chính | 371 KB (117 KB gzip) | Review #70 |
| Repo | 1.862 file, pack 13,9 MiB; sprite 1,42 MB, ảnh khung cảnh 8,1 MB | Review #70 |
| Lighthouse trên link thật | Chưa đo (T404 sau deploy) | |

### IV. Lệnh hay dùng

```bash
docker compose up -d mysql
cd backend && ./mvnw -B verify
cd frontend && npm run lint && npm run test && npm run build
docker compose --profile app up -d --build
bash scripts/db-dump.sh export
bash scripts/bench-synergy.sh
```

- Trên Windows, gọi Maven bằng `./mvnw.cmd` từ Git Bash hoặc `.\mvnw.cmd` từ PowerShell.

### V. Mốc thời gian

| Ngày | Mốc |
|---|---|
| 18/10 | Bắt đầu dự án |
| 25/10 | Checkpoint 2, tag `v0.1.0` |
| 26/10 | Luồng chính F01-F07 chạy (PR #39) |
| 28/10 | Kịch bản demo chạy trọn ở local, tag `v0.2.0` |
| 01/11 | Checkpoint 3 |
| 02/11 | Bug bash 13 lỗi (PR #69); ban tổ chức yêu cầu pitching |
| 05/11 | Đóng băng tính năng (chỉ `fix`, `docs`, `chore`) |
| 08/11 | Checkpoint 4: pitching, demo trên link thật, tag `v1.0.0` |
