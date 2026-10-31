# PokeNexus - Cấu trúc thư mục

- Phiên bản: 0.4 (cập nhật 2026-10-29; Phần 4: `db-dump.sh` xuất, nhập dữ liệu cho production, script chỉ có bản Bash trừ `download-csv`. Bản 0.3: thêm `features/trainer/`, `features/terrain/`, `TerrainPage`)
- Đây là cấu trúc **đích** khi xong MVP. Thư mục, file nào chưa tồn tại thì được tạo ở task ghi trong cột "Tạo ở" (mã task theo [roadmap.md](roadmap.md)).
- Thêm hoặc đổi tên package, thư mục cấp 1-2 thì cập nhật tài liệu này trong cùng PR.

---

## Phần 1. Toàn repo

### I. Cây thư mục

```text
pokenexus/
├── .github/
│   ├── ISSUE_TEMPLATE/            bug_report.yml, feature_request.yml, config.yml
│   ├── workflows/ci.yml           CI backend và frontend
│   ├── dependabot.yml
│   └── pull_request_template.md
├── backend/                       Spring Boot API (Phần 2)
├── frontend/                      React SPA (Phần 3)
├── data/
│   ├── README.md                  Hướng dẫn tải CSV
│   ├── csv/                       CSV PokéAPI (không commit)
│   └── dumps/                     File mysqldump (không commit)
├── docs/
│   ├── README.md                  Mục lục và bản đồ tài liệu
│   ├── adr/                       NNNN-ten-quyet-dinh.md
│   ├── images/                    Ảnh chụp màn hình, sơ đồ dùng trong README
│   ├── wireframes/                Wireframe các trang
│   └── *.md                       Tài liệu sản phẩm, kỹ thuật, quy trình
├── scripts/                       Script tiện ích (Phần 4)
├── .claude/
│   ├── settings.json              Quyền lệnh dùng chung cho Claude Code
│   └── commands/                  Slash command: task.md, adr.md, done.md
├── docker-compose.yml             MySQL, Adminer
├── .env.example
├── .editorconfig, .gitattributes, .gitignore, .nvmrc
├── CHANGELOG.md, CONTRIBUTING.md, LICENSE, README.md
├── CLAUDE.md                      Quy tắc cho Claude Code (thêm backend/CLAUDE.md, frontend/CLAUDE.md)
├── PLAN.md                        Tiến độ hiện tại
└── CLAUDE.local.md                Cấu hình cá nhân (không commit)
```

### II. Nguyên tắc

| Nguyên tắc | Nội dung |
|---|---|
| Một nơi cho một loại nội dung | Mã ở `backend/`, `frontend/`; tài liệu ở `docs/`; dữ liệu nguồn ở `data/`; script ở `scripts/` |
| Không commit thứ tái tạo được | `target/`, `node_modules/`, `dist/`, CSV, dump (đã có trong `.gitignore`) |
| Ngoại lệ có chủ đích | Sprite trong `frontend/public/sprites/` được commit để demo offline và triển khai đơn giản ([ADR 0005](adr/0005-hybrid-image-assets.md)) |

---

## Phần 2. Backend

### I. Cây thư mục

```text
backend/
├── .mvn/wrapper/                  maven-wrapper.properties, maven-wrapper.jar
├── mvnw, mvnw.cmd
├── pom.xml
├── Dockerfile                     Multi-stage: JDK 25 build, JRE 25 runtime
├── .dockerignore
└── src/
    ├── main/
    │   ├── java/com/pokenexus/
    │   │   ├── PokeNexusApplication.java
    │   │   ├── common/
    │   │   ├── ingestion/
    │   │   ├── pokedex/
    │   │   ├── typechart/
    │   │   ├── synergy/
    │   │   └── team/
    │   └── resources/
    │       ├── application.yml
    │       ├── application-dev.yml
    │       ├── application-prod.yml
    │       └── db/migration/      V1__create_reference_tables.sql ...
    └── test/
        ├── java/com/pokenexus/    Cùng cấu trúc package với main
        └── resources/
            ├── application-test.yml
            └── csv/               CSV mẫu khoảng 20 Pokémon cho test tích hợp
```

### II. Package và class

| Package | Sub-package | Class chính | Tạo ở |
|---|---|---|---|
| `common` | `config` | `AppProperties`, `CorsConfig`, `OpenApiConfig` | T202 |
| | `exception` | `GlobalExceptionHandler`, `ErrorCode`, `ApiException`, `NotFoundException`, `RateLimitedException` (thêm header `Retry-After`) | T202, T307 |
| | `domain` | `PokemonType` (enum 18 hệ), `StatType`, `FormCategory`, `PokemonTypeConverter` (JPA, ID hệ <-> `PokemonType`) | T202, T204 |
| | `web` | `HealthController`, `HealthService`, `HealthResponse`, `PageResponse`, `PageRequestFactory` (kiểm tra `page`, `size`, `sort` theo whitelist), `StaticDataCache` (interface của các cache nạp lúc khởi động) | T202, T206, T305 |
| `ingestion` | | `IngestionRunner`, `CsvReader`, `FormCategoryResolver`; cấu hình đọc từ `AppProperties.Ingestion` | T205 |
| | `loader` | `TypeLoader`, `GenerationLoader`, `SpeciesLoader`, `PokemonLoader`, `EvolutionLoader` | T205 |
| `typechart` | `controller` | `TypeController` | T304 |
| | `service` | `TypeChartService` (cache 18 x 18, tính hệ số hệ kép) | T303, T304 |
| | `repository` | `TypeEfficacyRepository` | T204 |
| | `entity` | `Type`, `TypeEfficacy`, `TypeEfficacyId` | T204 |
| | `dto` | `TypeResponse`, `TypeMatrixResponse`, `DefenseEntry` | T304 |
| `pokedex` | `controller` | `PokemonController` | T206 |
| | `service` | `PokemonQueryService`, `CompareService`, `EvolutionService`, `SpeedTierService` | T206, T308, T408 |
| | `repository` | `PokemonRepository`, `SpeciesRepository`, `PokemonSpecifications`, `EvolutionLinkRepository` | T204, T206 |
| | `entity` | `Pokemon`, `Species`, `Generation`, `Region`, `EvolutionChain`, `EvolutionLink` | T204 |
| | `dto` | `PokemonFilter`, `PokemonRef`, `PokemonSummary`, `PokemonDetail`, `Stats`, `PokemonCatalogEntry`, `CompareResponse`, `EvolutionResponse`, `EvolutionStage`, `SpeedTier` | T206, T303, T408 |
| | `mapper` | `PokemonMapper` | T206 |
| `synergy` | `controller` | `SynergyController` | T305 |
| | `service` | `PokemonProfileRegistry`, `SynergyAnalyzer`, `RecommendationEngine`, `ReasonBuilder`, `RoleScorer` (vai trò chỉ số theo lối chơi), `TeamInsightBuilder` (điểm mạnh, điểm yếu) | T305, #59 |
| | `model` | `PokemonProfile`, `DefenseScale`, `TeamAnalysis`, `PlayStyle` (trọng số và lọc tốc độ theo lối chơi), `TeamStatProfile` (chỉ số tổng hợp của đội) | T305, #59 |
| | `dto` | `AnalyzeRequest`, `AnalyzeResponse`, `RecommendationRequest`, `RecommendationResponse` | T305 |
| `team` | `controller` | `TeamController` | T307 |
| | `service` | `TeamService`, `ShareCodeGenerator`, `SaveRateLimiter` | T307 |
| | `repository` | `TeamRepository` | T307 |
| | `entity` | `Team`, `TeamMember`, `TeamMemberId` | T307 |
| | `mapper` | `TeamMapper` | T307 |
| | `dto` | `CreateTeamRequest`, `TeamMemberRequest`, `TeamResponse` (thành viên là `TeamResponse.Member` để không trùng tên entity `TeamMember`) | T307 |

### III. Quy tắc đặt tên backend

| Loại | Quy tắc | Ví dụ |
|---|---|---|
| Controller | `<Tài nguyên>Controller` | `PokemonController` |
| Service | Danh từ chỉ vai trò, không thêm hậu tố `Impl` khi chỉ có một cài đặt | `SynergyAnalyzer`, `TeamService` |
| DTO request | `<Hành động><Tài nguyên>Request` | `CreateTeamRequest` |
| DTO response | `<Tài nguyên>Response` hoặc tên miền | `TeamResponse`, `PokemonDetail` |
| Test | `<Class>Test` cho unit, `<Class>IT` cho tích hợp | `SynergyAnalyzerTest`, `PokemonControllerIT` |
| Migration | `V<số>__<mo_ta_snake_case>.sql` | `V3__create_team_tables.sql` |

---

## Phần 3. Frontend

### I. Cây thư mục

```text
frontend/
├── index.html
├── package.json, package-lock.json
├── vite.config.ts
├── tsconfig.json, tsconfig.app.json, tsconfig.node.json
├── eslint.config.js
├── .prettierrc, .prettierignore
├── public/
│   ├── favicon.svg
│   ├── og-image.png               Ảnh xem trước khi chia sẻ link
│   ├── scenes/                    {scene}-{n}-1920.webp, {scene}-{n}-960.webp, SOURCES.md (T301, ADR 0006)
│   └── sprites/
│       ├── placeholder.svg
│       └── pokemon/{id}.png       Sprite 96 x 96 tải bằng script (T207)
└── src/
    ├── main.tsx
    ├── app/
    │   ├── App.tsx
    │   ├── router.tsx
    │   ├── providers.tsx          QueryClientProvider
    │   └── layout/                AppLayout.tsx, Header.tsx, Footer.tsx, navItems.ts
    ├── pages/                     LandingPage, DexPage, PokemonDetailPage, TypeChartPage, ComparePage,
    │                              TeamBuilderPage, SharedTeamPage, TerrainPage, NotFoundPage (.tsx)
    ├── features/
    │   ├── landing/               api.ts, hooks.ts, regions.ts (vùng đất, Pokémon hôm nay), quiz.ts,
    │   │                          generations.ts, describeDefense.ts, components/ (T311, T312)
    │   ├── dex/                   api.ts, hooks.ts, useDexSearchParams.ts, emptyMessage.ts, components/
    │   ├── pokemon-detail/        api.ts, hooks.ts, components/
    │   ├── typechart/             api.ts, hooks.ts, components/
    │   ├── compare/               api.ts, hooks.ts, components/
    │   ├── team-builder/          api.ts, hooks.ts, useTeamDraft.ts, showdown.ts (T409), components/ (có PlayStylePicker, TeamInsights)
    │   ├── speed/                 level50.ts (tốc độ cấp 50, tỷ lệ, mốc lân cận), api.ts, hooks.ts, components/ (T408)
    │   ├── terrain/               terrains.ts, api.ts, hooks.ts, whosThat.ts, components/ (T314)
    │   └── trainer/               progress.ts, useTrainerProgress.ts, components/ (BallIcon, TrainerCard; T313)
    ├── components/
    │   ├── ui/                    buttonStyles.ts, Panel, GameDialog, Card, Dialog, Skeleton, EmptyState,
    │   │                          ErrorState, Toast, Pagination, pageItems.ts
    │   ├── motion/                Reveal (hiện khi cuộn tới, IntersectionObserver; T315), usePauseOffscreen (dừng animation của khối ngoài màn hình)
    │   ├── scene/                 SceneBackdrop (chuyển ảnh), SceneAmbience (lớp hạt), useReducedMotion, PageHero (kèm PageBody nhuộm theo scene, `iris` khi đổi scene), SceneLabel
    │   └── pokemon/               TypeBadge, TypeGlyph, DexNumber, StatBar, MultiplierCell, NeutralMark, PokemonSprite,
    │                              PokemonCard, PokemonSearchBox, StatRadar, statAxes.ts, multiplierStyles.ts
    ├── lib/
    │   ├── http.ts                fetch wrapper, chuyển ProblemDetail thành ApiError (kèm Retry-After)
    │   ├── clipboard.ts           writeClipboard (link chia sẻ, văn bản Showdown)
    │   ├── queryClient.ts         Không thử lại khi lỗi 4xx, thử lại 1 lần với lỗi khác
    │   ├── typeEffectiveness.ts   Tra hệ số từ TypeMatrix, hệ số hệ kép, nhóm x2/x½/x0 của một hệ tấn công
    │   ├── assets.ts              getSpriteUrl, getArtworkUrl, sceneUrl, sceneSrcSet, sceneThumbUrl
    │   ├── motion.ts              staggerDelay (độ trễ vào lần lượt, tối đa 640 ms; T315)
    │   ├── scenes.ts              15 scene (tên, bảng 4 màu, số ảnh, kiểu hạt), sceneForTypes, nextPhoto, sceneGradient, sceneSwatch, sceneTintStyle
    │   ├── pokemonTypes.ts        Danh sách 18 hệ, ánh xạ hệ sang class token
    │   ├── errorMessages.ts       Ánh xạ code lỗi sang thông điệp tiếng Việt
    │   └── formatters.ts          Tên, chiều cao, cân nặng, hệ số
    ├── styles/
    │   └── index.css              @import "tailwindcss", @theme token, font
    ├── assets/
    │   └── logo.svg
    ├── test/
    │   ├── setup.ts               Nạp matcher jest-dom, polyfill showModal/close cho <dialog> của jsdom, dọn DOM
    │   └── renderRoute.tsx        Render route với QueryClient và MemoryRouter; giả lập fetch
    └── types/
        └── api.ts                 Kiểu DTO khớp docs/api.md Phần 3
```

- File test đặt cạnh file được test: `TypeBadge.tsx` và `TypeBadge.test.tsx`.
- `features/<tên>/components/` chứa component chỉ dùng trong tính năng đó. Component dùng ở từ 2 tính năng trở lên thì chuyển lên `components/`. Ngoại lệ: `features/trainer/` là tính năng tiến độ Trainer (dữ liệu, hook và component đi cùng nhau), được Thử tài Trainer và trang Địa hình dùng chung.

### II. Ánh xạ trang và tính năng

| Trang | Feature folder | Component chính | Tạo ở |
|---|---|---|---|
| `LandingPage` | `landing` | `LandingHero`, `TypeTicker`, `FeatureRegions`, `TypeWheel`, `DailyPokemon`, `TeamSteps`, `GenerationChart`, `TrainerQuiz`, `ClosingCta`, `SectionDecor` (Aura, Blob, Cloud, Spark, Wave; T316) | T311, T312 |
| `DexPage` | `dex` | `DexFilters`, `StatRangeFields`, `DexToolbar`, `ViewToggle`, `FilterSheet`, `PokemonGrid`, `PokemonList`, `Pagination` | T301 |
| `PokemonDetailPage` | `pokemon-detail`, `speed` | `PokemonHero`, `StatPanel` (chứa `SpeedBenchmark`), `DefenseGrid`, `FormSwitcher`, `EvolutionChain`, `DetailStates`; `evolution.ts`, `labels.ts` | T303, T408 |
| `TypeChartPage` | `typechart` | `TypeMatrixTable`, `DualTypePicker`, `DefenseResult`, `MatrixLegend`, `MatrixFocusPanel`; `defense.ts`, `matrixFocus.ts`, `useDefendingTypes.ts` | T304, T316 |
| `ComparePage` | `compare` | `ComparePicker`, `CompareSlot`, `VersusBanner`, `CompareRadar`, `StatDuelTable`, `StabPanel`, `VerdictPanel`; `useCompareSearchParams.ts`, `scale.ts` | T308, T316 |
| `TeamBuilderPage` | `team-builder` | `TeamSlots`, `TeamMemberCard`, `WeaknessHeatmap`, `TeamScoreGauge`, `CoverageAndStats`, `RecommendationList`, `RecommendationCard`, `SaveTeamDialog`, `ShareLinkField`, `ShowdownImportDialog`, `ShowdownExportDialog` (trong `ShowdownDialogs.tsx`), `TeamSpeedList` (feature `speed`); `useTeamDraft.ts`, `teamAnalysis.ts`, `showdown.ts` | T306, T307, T408, T409 |
| `SharedTeamPage` | `team-builder` | `ReadOnlyTeamSlots`, `SharedMemberCard` (trong `TeamMemberCard.tsx`), `AnalysisHeatmap` (`compact`), `ShareLinkField`, `ShowdownExportDialog` | T307, T316, T409 |
| `TerrainPage` | `terrain`, `trainer` | `TerrainPicker`, `TerrainPokemon`, `WhosThatPokemon`, `TrainerCard`; `terrains.ts`, `whosThat.ts` | T314 |

### III. Quy tắc đặt tên frontend

| Loại | Quy tắc | Ví dụ |
|---|---|---|
| Component, trang | `PascalCase.tsx` | `PokemonCard.tsx` |
| Hook | `useCamelCase.ts` | `useTeamDraft.ts` |
| Tiện ích, API | `camelCase.ts` | `formatters.ts`, `api.ts` |
| Thư mục tính năng | `kebab-case` | `team-builder` |
| Kiểu, interface | `PascalCase`, không tiền tố `I` | `PokemonSummary` |

---

## Phần 4. Script

### I. Danh sách

| Script | Mục đích | Tạo ở |
|---|---|---|
| `scripts/download-csv.sh`, `.ps1` | Tải bộ CSV vào `data/csv/` (chuyển từ lệnh trong `data/README.md`) | T205 |
| `scripts/download-sprites.sh` | Tải sprite vào `frontend/public/sprites/pokemon/` ([assets.md](assets.md), Phần 4) | T207 |
| `scripts/db-dump.sh` | `export`: xuất dữ liệu tĩnh và schema rỗng của bảng đội từ container MySQL local vào `data/dumps/`; `import`: nhập vào DB đích theo `TARGET_DB_URL` ([architecture.md](architecture.md), Phần 11, mục III) | T403 |
| `scripts/bench-synergy.sh` | Gọi 100 lần endpoint synergy, in p50, p95 | T305 |
| `scripts/check-image-provenance.mjs` | Tìm dấu vết AI (C2PA, IPTC `DigitalSourceType`, tên công cụ AI) trong metadata ảnh đã sửa ([design-system.md](design-system.md), Phần 4, mục I, 2) | ADR 0006 |

- Script Bash chạy được trên macOS, Linux và Git Bash (Windows). Chỉ `download-csv` có thêm bản PowerShell vì nằm trong mục "Chạy nhanh" của README.
- Script chạy từ thư mục gốc repo, không dùng đường dẫn tuyệt đối.
