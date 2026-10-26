# PokeNexus - Lộ trình 4 tuần

- Phiên bản: 0.3 (cập nhật 2026-10-26)
- Thay đổi so với 0.2: thêm trang Tổng quan (T311, T312) và chuyển Omni-Dex sang `/pokedex` theo [spec.md](spec.md) 1.2; thêm thứ tự cắt cho trang Tổng quan ở Phần 4.
- Thời gian: 2026-10-18 đến 2026-11-15, một người phát triển (Full-stack).
- Mỗi tuần tương ứng một **Milestone** trên GitHub, mỗi task là một Issue ([github-setup.md](github-setup.md)).
- Quy trình nhánh, PR, tag: [git-workflow.md](git-workflow.md).

---

## Phần 1. Tổng quan

### I. Goal và tiêu chí hoàn thành

- **Goal:** ngày 2026-11-15 có bản PokeNexus chạy thật trên Internet, demo trọn vẹn kịch bản ở [spec.md](spec.md), Phần 4.
- **Tiêu chí hoàn thành:**
  - 6 tính năng MVP (F01-F06) đạt toàn bộ tiêu chí chấp nhận trong [spec.md](spec.md).
  - `POST /api/v1/synergy/analyze` và `/recommendations` phản hồi dưới 50 ms (p95, đo local, 100 request liên tiếp).
  - CI xanh trên `main`; package `synergy` có unit test cho 4 ví dụ có đáp án ở spec, mục V.4.
  - Có link sản phẩm công khai và bản local chạy bằng Docker; tag `v1.0.0`.

### II. Bốn mốc

| Tuần | Thời gian | Milestone | Mục tiêu | Tag |
|---|---|---|---|---|
| 1 | 18/10 - 25/10 | `W1 - Ý tưởng và khởi tạo` | Tài liệu kế hoạch, khảo sát dữ liệu, wireframe, thiết lập GitHub | |
| 2 | 26/10 - 01/11 | `W2 - Đặc tả và khung dự án` | Chốt spec 1.0; khung backend, frontend, DB; nạp dữ liệu; API đầu tiên | `v0.1.0` |
| 3 | 02/11 - 08/11 | `W3 - MVP` | Hoàn thành F01-F06 | `v0.2.0` |
| 4 | 09/11 - 15/11 | `W4 - Hoàn thiện và demo` | Tính năng mở rộng, triển khai, tài liệu, demo | `v1.0.0` |

### III. Biểu đồ Gantt

```mermaid
gantt
    title PokeNexus 18/10 - 15/11/2026
    dateFormat YYYY-MM-DD
    axisFormat %d/%m
    section W1 Khởi tạo
    Tài liệu kế hoạch            :done, t101, 2026-10-19, 1d
    Khảo sát CSV                 :crit, t102, 2026-10-20, 1d
    Wireframe                    :t103, 2026-10-21, 2d
    Thiết lập GitHub, Issue      :t104, 2026-10-23, 1d
    Trình bày ý tưởng            :t105, 2026-10-24, 1d
    Buffer W1                    :t106, 2026-10-25, 1d
    section W2 Khung dự án
    Spec 1.0, khung backend      :crit, t201, 2026-10-26, 1d
    Khung frontend, token UI     :t203, 2026-10-27, 1d
    Flyway migration             :crit, t204, 2026-10-28, 1d
    Ingestion CSV                :crit, t205, 2026-10-29, 1d
    API Omni-Dex, sprite         :crit, t206, 2026-10-30, 1d
    CI đầy đủ, test tích hợp     :t208, 2026-10-31, 1d
    Buffer, v0.1.0               :t209, 2026-11-01, 1d
    section W3 MVP
    Omni-Dex UI                  :t301, 2026-11-02, 1d
    Chi tiết, Bảng tương khắc    :t303, 2026-11-03, 1d
    Synergy backend              :crit, t305, 2026-11-04, 1d
    Team Builder UI              :crit, t306, 2026-11-05, 1d
    So sánh, Lưu và chia sẻ      :crit, t307, 2026-11-06, 1d
    Trạng thái UI, responsive    :t309, 2026-11-07, 1d
    Tổng quan: hero, vùng đất    :t311, 2026-11-07, 1d
    Tổng quan: biểu đồ, câu đố   :t312, 2026-11-08, 1d
    Buffer, E2E, v0.2.0          :t310, 2026-11-08, 1d
    section W4 Hoàn thiện
    Mở rộng (Should)             :t401, 2026-11-09, 1d
    Mở rộng (Could)              :t402, 2026-11-10, 1d
    Đóng băng, triển khai        :crit, t403, 2026-11-11, 1d
    Bug bash, hiệu năng          :t404, 2026-11-12, 1d
    Tài liệu, ảnh chụp           :t405, 2026-11-13, 1d
    Slide, video demo            :t406, 2026-11-14, 1d
    Tổng duyệt, v1.0.0           :crit, t407, 2026-11-15, 1d
```

### IV. Đường găng (critical path)

- T102 Khảo sát CSV -> T204 Migration -> T205 Ingestion -> T305 Synergy backend -> T306 Team Builder UI -> T307 Lưu và chia sẻ -> T403 Triển khai -> T407 Demo.
- Task trên đường găng trễ thì dùng buffer gần nhất ngay, không dời sang tuần sau.

### V. Phân bổ thời gian

| Loại công việc | Số ngày | Tỷ lệ |
|---|---|---|
| Xây dựng tính năng và hạ tầng | 20 | 71% |
| Buffer, kiểm thử, sửa lỗi, tài liệu, demo (25/10, 01/11, 07/11, 08/11, 12/11 - 15/11) | 8 | 29% |

---

## Phần 2. Phân rã Epic và Feature

### I. Danh sách Epic

| Mã | Epic | Feature | MoSCoW |
|---|---|---|---|
| E0 | Nền tảng và quy trình | Tài liệu kế hoạch, GitHub, CI | Must |
| E1 | Dữ liệu | Migration, ingestion CSV, sprite tự host | Must |
| E2 | Bách khoa | F01 Omni-Dex, F02 Chi tiết, tìm kiếm tên | Must |
| E3 | Tương khắc | F03 Bảng tương khắc | Must |
| E4 | So sánh | F04 Bàn Cân Sức Mạnh | Should (cắt được kết luận tự động) |
| E5 | Synergy | F05 Phân tích, đề xuất, Team Builder UI | Must |
| E6 | Đội hình | F06 Lưu và chia sẻ | Must |
| E7 | Giao diện nền | Design token, layout, trạng thái tải/rỗng/lỗi, responsive; F07 Trang Tổng quan | Must (F07: Should) |
| E8 | Phát hành | Triển khai, README, slide, video | Must |
| E9 | Mở rộng | Xem bảng mục II | Should / Could |

### II. MoSCoW cho phần mở rộng

| Mức | Tính năng | Lý do |
|---|---|---|
| Should | Cây tiến hóa (US-08) | Dữ liệu `evolution_links` đã nạp ở W2, chỉ cần API và UI |
| Should | Bảng tốc độ cấp 50 (US-09) | Tính từ chỉ số gốc, không cần dữ liệu mới |
| Could | Dark mode | Token đã thiết kế theo cặp light/dark ([design-system.md](design-system.md)) |
| Could | Nhập/xuất Showdown (US-10) | Hữu ích cho người chơi VGC, phụ thuộc parser văn bản |
| Could | Tính chỉ số thực theo EV, IV, Nature | Công thức rõ ràng, nhưng cần UI nhập liệu nhiều |
| Won't | Đăng nhập, chiêu thức, Ability, tính sát thương, World Explorer | Ngoài phạm vi 4 tuần ([product.md](product.md), Phần 4) |

---

## Phần 3. Chi tiết task theo tuần

- Mỗi task tối đa 1 ngày công. Cột "Kiểm tra" là điều kiện để đóng Issue, bổ sung cho Definition of Done ở [CONTRIBUTING.md](../CONTRIBUTING.md).

### I. Tuần 1 - Ý tưởng và khởi tạo (19/10 - 25/10)

| Mã | Ngày | Task | Epic | MoSCoW | Đầu vào | Đầu ra | Kiểm tra |
|---|---|---|---|---|---|---|---|
| T101 | 19/10 | Bộ tài liệu kế hoạch v0.2 | E0 | Must | Tài liệu v0.1 | 8 chủ đề tài liệu trong `docs/` | Link nội bộ không gãy; không mâu thuẫn giữa các file |
| T102 | 20/10 | Khảo sát bộ CSV PokéAPI | E1 | Must | `data/README.md` | Ghi chú số dòng từng file, danh sách hậu tố form, số Pokémon thiếu sprite | Đếm được: 18 hệ, 324 dòng `type_efficacy`, số loài, số dạng |
| T103 | 21-22/10 | Wireframe 6 trang (mobile và desktop) | E7 | Must | [design-system.md](design-system.md), Phần 6 | File trong `docs/wireframes/` | Mỗi trang có bản 375 px và 1440 px |
| T104 | 23/10 | Tạo nhãn, milestone, Project board, Issue W2-W3 | E0 | Must | [github-setup.md](github-setup.md), Phần 3 tài liệu này | Issue cho mọi task W2, W3 | Mỗi Issue có nhãn, milestone, tiêu chí kiểm tra |
| T105 | 24/10 | Trình bày ý tưởng | E8 | Must | `product.md` | Slide ý tưởng | Trình bày trong thời gian quy định |
| T106 | 25/10 | Buffer, tổng kết tuần | E0 | | | Cập nhật bảng trạng thái ở Phần 5 | |

- T105: cắt giảm ngày 2026-10-26 vì dự án không có buổi trình bày hay pitching ý tưởng nào. Không ảnh hưởng tiêu chí W1 ở mục V; slide trình bày chỉ còn ở T406.

### II. Tuần 2 - Đặc tả và khung dự án (26/10 - 01/11)

| Mã | Ngày | Task | Epic | MoSCoW | Đầu vào | Đầu ra | Kiểm tra |
|---|---|---|---|---|---|---|---|
| T201 | 26/10 | Chốt spec 1.0 | E0 | Must | Kết quả T102, câu hỏi mở ở `spec.md` | `spec.md` v1.0 | Không còn câu hỏi mở |
| T202 | 26/10 | Khởi tạo backend | E0 | Must | `backend/README.md`, [folder-structure.md](folder-structure.md) | Spring Boot 4.1, `GET /api/v1/health`, `GlobalExceptionHandler`, CORS, Swagger | `./mvnw verify` xanh; Swagger UI mở được; gọi `/health` trả 200 |
| T203 | 27/10 | Khởi tạo frontend | E7 | Must | `frontend/README.md`, [design-system.md](design-system.md) | Vite + React + TS, Tailwind v4 với token, Router, TanStack Query, `AppLayout`, ESLint, Vitest | `npm run lint`, `test`, `build` xanh; trang trống hiển thị header và điều hướng |
| T204 | 28/10 | Flyway migration V1-V3 | E1 | Must | [database.md](database.md), Phần 4 | 3 file migration | Backend khởi động trên DB trống, `flyway_schema_history` có 3 dòng |
| T205 | 29/10 | Ingestion CSV vào MySQL | E1 | Must | Kết quả T102, `data/csv/` | `IngestionRunner` nạp các bảng tĩnh | 18 hệ, 324 dòng tương khắc; Charizard đủ 6 chỉ số; chạy lần 2 không nạp trùng |
| T206 | 30/10 | `GET /api/v1/pokemon` | E2 | Must | [api.md](api.md), Phần 2, mục III | Specification lọc, `PageResponse`, Swagger | `?type=dragon&gen=4` có Garchomp; `size=101` trả 400 |
| T207 | 30/10 | Script tải sprite | E1 | Must | [assets.md](assets.md), Phần 4 | `frontend/public/sprites/pokemon/*.png` | Tổng dung lượng dưới 15 MB; danh sách id thiếu sprite được ghi lại |
| T208 | 31/10 | CI đầy đủ, Dependabot Maven và npm, test tích hợp DB | E0 | Must | `.github/workflows/ci.yml` | CI chạy test backend có MySQL (Testcontainers), frontend lint/test/build | PR mẫu xanh cả 2 job |
| T209 | 01/11 | Buffer, review, tag `v0.1.0` | E0 | | | CHANGELOG mục 0.1.0 | Tiêu chí W2 ở mục V đạt |

- T202: Spring Boot 4 tách nhỏ starter; khi khởi tạo cần kiểm tra trên Spring Initializr tên starter Flyway, module `flyway-mysql` và bản springdoc-openapi tương thích Boot 4.

### III. Tuần 3 - MVP (02/11 - 08/11)

| Mã | Ngày | Task | Epic | MoSCoW | Đầu vào | Đầu ra | Kiểm tra |
|---|---|---|---|---|---|---|---|
| T301 | 02/11 | Omni-Dex UI | E2 | Must | T206, wireframe | `DexPage`: lưới thẻ, bộ lọc, phân trang, đồng bộ URL | Reload giữ nguyên bộ lọc; trạng thái rỗng có nút xóa lọc |
| T302 | 02/11 | `GET /pokemon/search` và `PokemonSearchBox` | E2 | Must | [api.md](api.md) | Ô tìm kiếm combobox | Gõ "char" ra Charmander, Charmeleon, Charizard; điều khiển được bằng bàn phím |
| T303 | 03/11 | Chi tiết Pokémon (API và UI) | E2 | Must | [api.md](api.md) | `PokemonDetailPage`, lưới phòng thủ 18 hệ | Charizard: Rock x4, Ground x0; `/pokemon/abc-xyz` hiển thị trang 404 |
| T304 | 03/11 | Bảng tương khắc (API và UI) | E3 | Must | `TypeChartService` | `TypeChartPage` 18 x 18, chọn hệ kép | Fire/Flying nhận Rock x4; ma trận đủ 324 ô |
| T305 | 04/11 | Synergy backend | E5 | Must | [architecture.md](architecture.md), Phần 5 | `PokemonProfileRegistry`, `SynergyAnalyzer`, `RecommendationEngine`, 2 endpoint | 4 test có đáp án ở spec V.4 xanh; p95 dưới 50 ms |
| T306 | 05/11 | Team Builder UI | E5 | Must | T305 | `TeamBuilderPage`: chọn slot, heatmap, điểm đội, radar, thẻ đề xuất | Đội ví dụ hiện cảnh báo hệ Rock; thêm đề xuất số 1 thì điểm tăng |
| T307 | 06/11 | Lưu và chia sẻ (API và UI) | E6 | Must | [api.md](api.md), Phần 2, mục X-XI | `POST /teams`, `GET /teams/shared/{code}`, `SharedTeamPage` | Mở link ở cửa sổ ẩn danh thấy đúng đội; lưu quá giới hạn trả 429 |
| T308 | 06/11 | Bàn Cân Sức Mạnh (API và UI) | E4 | Should | [api.md](api.md) | `ComparePage`: radar chồng lớp, 3 ý kết luận | Garchomp và Salamence: kết luận "Garchomp nhanh hơn" (102 so với 100) |
| T309 | 07/11 | Trạng thái tải, rỗng, lỗi; responsive; accessibility | E7 | Must | [design-system.md](design-system.md), Phần 5, 7 | Skeleton, `EmptyState`, `ErrorState` trên mọi trang | Kiểm 6 trang ở 375 px và 1440 px; tab qua toàn trang có focus rõ |
| T310 | 08/11 | Buffer, chạy kịch bản E2E, tag `v0.2.0` | E0 | | Spec Phần 4 | CHANGELOG mục 0.2.0 | Kịch bản demo chạy trọn vẹn 2 lần liên tiếp |
| T311 | 07/11 | Trang Tổng quan phần 1: hero, dải hệ, Bốn vùng đất, Vòng tương khắc, Pokémon hôm nay; chuyển Omni-Dex sang `/pokedex` | E7 | Should | [spec.md](spec.md), Phần 2, mục VII; [design-system.md](design-system.md), Phần 7, mục II.1; T304 | `LandingPage`, `features/landing/`, route `/` và `/pokedex` | 4 thẻ dẫn đúng route; chọn Fire ở vòng tương khắc hiện x2 Grass, Ice, Bug, Steel; reload cùng ngày ra cùng Pokémon hôm nay |
| T312 | 08/11 | Trang Tổng quan phần 2: Xây đội trong 3 bước, biểu đồ số loài 9 thế hệ, Thử tài Trainer, kêu gọi cuối trang | E7 | Could | T311, T206 | Các khối còn lại của `LandingPage` | Cột thế hệ 1 ghi 151, bấm cột mở `/pokedex?gen=1`; trả lời đủ 5 câu thì hiện điểm và làm lại được |

- T311, T312: thêm ngày 2026-10-26 theo bản thiết kế giao diện ngày 2026-10-24. Ngày trong bảng là ngày dự kiến theo lộ trình; làm sớm thì ghi ngày thực tế ở `PLAN.md`.

### IV. Tuần 4 - Hoàn thiện và demo (09/11 - 15/11)

| Mã | Ngày | Task | Epic | MoSCoW | Đầu vào | Đầu ra | Kiểm tra |
|---|---|---|---|---|---|---|---|
| T401 | 09/11 | Cây tiến hóa hoặc Bảng tốc độ | E9 | Should | `evolution_links`, chỉ số gốc | API và UI cho 1 tính năng | Eevee hiện đủ 8 nhánh (nếu làm Cây tiến hóa) |
| T402 | 10/11 | Tính năng Should còn lại hoặc 1 tính năng Could | E9 | Could | Bảng Phần 2, mục II | API và UI | Theo tiêu chí của tính năng chọn |
| T403 | 11/11 | Đóng băng tính năng, triển khai production | E8 | Must | [architecture.md](architecture.md), Phần 11 | Frontend, backend, DB chạy trên hosting | Kịch bản demo chạy trên link thật; mở được trên điện thoại |
| T404 | 12/11 | Bug bash, đo hiệu năng | E8 | Must | Danh sách lỗi | Lỗi mức cao đã sửa | p95 analyze dưới 50 ms; không còn Issue `type: bug` mức cao |
| T405 | 13/11 | README (ảnh chụp, link demo), sơ đồ, CHANGELOG | E8 | Must | [assets.md](assets.md), Phần 1 | README hoàn chỉnh | Người mới làm theo README chạy được bản local |
| T406 | 14/11 | Slide, video demo | E8 | Must | Kịch bản demo | Slide, video dưới 3 phút | Video quay trên bản production |
| T407 | 15/11 | Tổng duyệt, tag `v1.0.0` | E8 | Must | | GitHub Release `v1.0.0` | Tổng duyệt 2 lần, mỗi lần đúng thời gian quy định |

### V. Tiêu chí hoàn thành từng tuần

| Tuần | Tiêu chí |
|---|---|
| W1 | Repo công khai có README và bộ tài liệu v0.2; nhãn, milestone, Issue W2-W3 đã tạo; wireframe 6 trang |
| W2 | `docker compose up -d mysql`, chạy backend thì dữ liệu được nạp; `GET /api/v1/pokemon?type=dragon` trả đúng; CI xanh; tag `v0.1.0` |
| W3 | Kịch bản E2E ở spec Phần 4 chạy trọn vẹn trên local; tag `v0.2.0` |
| W4 | Có link sản phẩm chạy thật; bản local chạy bằng Docker; tag `v1.0.0` |

---

## Phần 4. Buffer và phương án cắt giảm

### I. Quy tắc dùng buffer

- Task trễ dưới nửa ngày: làm bù trong buffer cuối tuần.
- Task trễ quá 1 ngày: áp dụng phương án cắt ở mục II, ghi lý do vào Issue.
- Từ 11/11 chỉ nhận PR loại `fix`, `docs`, `chore`; không thêm tính năng.

### II. Thứ tự cắt khi trễ

| Thứ tự | Cắt | Không ảnh hưởng |
|---|---|---|
| 1 | Toàn bộ E9 (tính năng mở rộng) | MVP |
| 2 | Trang Tổng quan phần 2 (T312) | Hero và 4 lối vào công cụ vẫn còn |
| 3 | Kết luận tự động của Bàn Cân, chỉ giữ radar | F04 vẫn dùng được |
| 4 | Chọn hệ kép ở Bảng tương khắc, chỉ giữ ma trận | Lưới phòng thủ ở trang chi tiết vẫn tính hệ kép |
| 5 | Radar chỉ số trung bình ở Team Builder | Heatmap và đề xuất |
| Không cắt | Synergy Analyzer, đề xuất, Lưu và chia sẻ đội | Đây là giá trị khác biệt của sản phẩm |

---

## Phần 5. Theo dõi tiến độ và rủi ro

### I. Nghi thức hằng tuần

- Chủ nhật: đóng milestone, cập nhật bảng trạng thái ở README Phần 7, gắn tag nếu đạt tiêu chí, chuyển Issue chưa xong sang milestone kế tiếp kèm lý do.
- Ý tưởng mới phát sinh: tạo Issue nhãn `priority: future`, chỉ xét ở buổi tổng kết.

### II. Bảng rủi ro

| Rủi ro | Khả năng | Ảnh hưởng | Phòng ngừa |
|---|---|---|---|
| Nạp dữ liệu kéo dài | Cao | Cao | Khảo sát CSV trước (T102); chỉ nạp cột cần dùng; lưu bản `mysqldump` |
| Spring Boot 4 khác hướng dẫn trên mạng (Boot 3) | Trung bình | Trung bình | Đối chiếu tài liệu chính thức bản 4.1 ([ADR 0004](adr/0004-java-25-spring-boot-4.md)) |
| Phạm vi phình to | Cao | Cao | Ý tưởng mới vào Backlog; MoSCoW ở Phần 2 |
| Lỗi CORS, cấu hình môi trường | Trung bình | Trung bình | Cấu hình CORS ngay ở T202; biến môi trường theo [architecture.md](architecture.md), Phần 10 |
| Hosting miễn phí chậm hoặc ngủ đông | Trung bình | Cao | Triển khai sớm từ 11/11; mở link trước demo; luôn có bản local dự phòng |
| Mất mạng khi demo | Thấp | Cao | Sprite tự host, font đóng gói; artwork có fallback ([assets.md](assets.md)) |
