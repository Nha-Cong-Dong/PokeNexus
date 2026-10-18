# PokéNexus - Lộ trình 4 tuần

- Mỗi tuần tương ứng một **Milestone** trên GitHub (cách tạo ở [github-setup.md](github-setup.md)).
- Mỗi đầu việc là một Issue gắn vào milestone tương ứng.

---

## Phần 1. Tổng quan

### I. Bốn mốc

| Tuần | Milestone | Mục tiêu | Tag |
|---|---|---|---|
| 1 | `W1 - Ý tưởng và khởi tạo` | Nghiên cứu, chốt ý tưởng, khởi tạo repo và tài liệu | |
| 2 | `W2 - Đặc tả và khung dự án` | Chốt đặc tả, dựng khung backend, frontend, database, CI | `v0.1.0` |
| 3 | `W3 - MVP` | Hoàn thành toàn bộ tính năng MVP | `v0.2.0` |
| 4 | `W4 - Hoàn thiện và demo` | Hoàn thiện, tính năng mở rộng, triển khai, demo | `v1.0.0` |

---

## Phần 2. Chi tiết từng tuần

### I. Tuần 1 - Ý tưởng và khởi tạo

#### 1. Đầu việc

- Khởi tạo repo với tài liệu và cấu hình cơ bản.
- Viết [product.md](product.md): tầm nhìn, persona, user story.
- Vẽ wireframe cho Omni-Dex, Chi tiết, Team Builder, lưu vào `docs/wireframes/`.
- Tải bộ CSV PokéAPI, khảo sát cấu trúc các file cần dùng.
- Trình bày ý tưởng.

#### 2. Tiêu chí hoàn thành

- Repo công khai có README, tài liệu sản phẩm, lộ trình; các milestone và nhãn đã được tạo.

### II. Tuần 2 - Đặc tả và khung dự án

#### 1. Đầu việc

- Chốt [spec.md](spec.md) phiên bản 1.0, trả lời hết câu hỏi còn mở.
- Khởi tạo backend Spring Boot (Maven Wrapper, Java 25) với endpoint `GET /api/v1/health`.
- Khởi tạo frontend Vite + React + TypeScript + Tailwind, layout và router cơ bản.
- Viết Flyway migration cho nhóm bảng tĩnh và chương trình nạp dữ liệu CSV.
- Endpoint đầu tiên `GET /api/v1/pokemon` có lọc, phân trang, có trong Swagger.
- Bật đầy đủ CI cho backend và frontend; thêm Dependabot cho Maven và npm.

#### 2. Tiêu chí hoàn thành

- `docker compose up -d mysql`, chạy backend thì dữ liệu được nạp; gọi `GET /api/v1/pokemon?type=dragon` trả đúng kết quả.
- CI xanh. Gắn tag `v0.1.0`.

### III. Tuần 3 - MVP

#### 1. Đầu việc theo ngày

| Ngày | Đầu việc |
|---|---|
| 1 | Omni-Dex: API lọc, lưới thẻ, bộ lọc đồng bộ URL |
| 2 | Chi tiết Pokémon và Bảng tương khắc |
| 3 | Synergy Analyzer phía backend: cache bộ nhớ, phân tích, đề xuất, unit test |
| 4 | Giao diện Team Builder: chọn Pokémon, heatmap, radar, thẻ đề xuất |
| 5 | Bàn Cân Sức Mạnh và Lưu, chia sẻ đội |
| 6 | Trạng thái tải, rỗng, lỗi; responsive |
| 7 | Dự phòng, review toàn bộ |

#### 2. Tiêu chí hoàn thành

- Kịch bản kiểm chứng end-to-end trong [spec.md](spec.md), Phần 4 chạy trọn vẹn. Gắn tag `v0.2.0`.

#### 3. Phương án cắt nếu trễ

- Bàn Cân bỏ kết luận tự động; trang chi tiết chỉ giữ chỉ số và lưới phòng thủ.
- Không cắt Synergy Analyzer và Lưu, chia sẻ đội.

### IV. Tuần 4 - Hoàn thiện và demo

#### 1. Đầu việc

- Chọn 2-3 tính năng mở rộng: Cây tiến hóa, Bảng tốc độ, Nhập/xuất Showdown, Tính chỉ số.
- Đóng băng tính năng từ ngày 3; chỉ sửa lỗi và hoàn thiện giao diện.
- Triển khai: frontend, backend (Docker image), database; kiểm tra trên điện thoại.
- Hoàn thiện README (ảnh chụp, link demo), sơ đồ kiến trúc, CHANGELOG.
- Chuẩn bị slide, video demo, tập trình bày.

#### 2. Tiêu chí hoàn thành

- Có đường dẫn sản phẩm chạy thật; bản local chạy được bằng Docker. Gắn tag `v1.0.0`.

---

## Phần 3. Quản lý rủi ro

### I. Bảng rủi ro

| Rủi ro | Khả năng | Ảnh hưởng | Phòng ngừa |
|---|---|---|---|
| Nạp dữ liệu kéo dài | Cao | Cao | Dùng CSV, chỉ nạp cột cần dùng, lưu bản `mysqldump` |
| Phạm vi phình to | Cao | Cao | Ý tưởng mới vào Backlog, xét ở buổi tổng kết cuối tuần |
| Lỗi CORS, cấu hình môi trường | Trung bình | Trung bình | Cấu hình CORS ngay khi dựng khung ở Tuần 2 |
| Hosting miễn phí chậm hoặc ngủ đông | Trung bình | Cao | Mở link trước khi demo; luôn có bản local dự phòng |
