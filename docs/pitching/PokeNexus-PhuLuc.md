# PokeNexus - Phụ lục học thêm cho phần hỏi đáp

- Phiên bản: 1.0 (tạo 2026-11-07, Issue #117)
- Nguồn: nội dung slide "Kết quả so với tiêu chí" và 8 slide phụ lục A1-A8 của bản slide 27 trang (`slides.html` trước PR bỏ phụ lục, `PokeNexus-Pitch.pptx` vẫn giữ bản này). Bản slide hiện tại chỉ còn 18 slide; các số liệu dưới đây để học, không chiếu.
- Học kỹ hơn từng phần: [PokeNexus-LuyenTap.md](PokeNexus-LuyenTap.md). Kịch bản nói: [PokeNexus-KichBan.md](PokeNexus-KichBan.md).

---

## Phần 1. Kết quả so với tiêu chí Checkpoint 4

### I. Bảng đối chiếu (trạng thái ngày 06/11/2026)

- Tiêu chí lấy từ [docs/roadmap.md](../roadmap.md), Phần 1.

| Tiêu chí | Kết quả | Đánh giá |
|---|---|---|
| Đủ F01-F08, tính năng mở rộng đạt cột Kiểm tra | F01-F10 xong | Đạt |
| Không còn Issue `type: bug` đang mở | 7/7 đã đóng | Đạt |
| CI xanh trên `main`; 5 ví dụ có đáp án có test | 2 job xanh; 5/5 | Đạt |
| p95 `analyze`, `recommendations` dưới 50 ms | 7,2 ms và 8,6 ms | Đạt |
| 375 và 1440 px: không cuộn ngang, 1 thẻ `h1` | 12 route x 2 cỡ | Đạt |
| Link thật trên điện thoại, máy tính; bản local Docker | Có cả hai | Đạt |
| Kịch bản demo 2 lần liên tiếp trên link thật | Nghiệm thu 36/36; giao diện ở tổng duyệt | Một phần |
| Lighthouse mobile trên link thật | Accessibility 100; LCP đạt 1/9 route | Một phần |
| Tag `v1.0.0` | Gắn sau tổng duyệt (T407) | Chưa đến hạn |

### II. Khi bị hỏi "còn gì chưa đạt"

- LCP trên link thật chỉ đạt ở 1/9 route (2,1-5,5 s, ngưỡng 2,5 s). Nguyên nhân: ảnh hero chỉ được trình duyệt phát hiện sau khi bundle JavaScript chạy. Cách sửa: preload ảnh hero, `fetchpriority=high`, bỏ hiệu ứng hiện dần. Chưa làm vì đóng băng tính năng từ 05/11.
- Accessibility 100 ở cả 9 route; CLS tối đa 0,094; TBT tối đa 118 ms đều đạt.

---

## Phần 2. Schema cơ sở dữ liệu (A1)

### I. Ba nhóm bảng

| Nhóm | Bảng | Cột chính |
|---|---|---|
| Tham chiếu (chỉ đọc) | `types` | `id`, `name` |
| | `type_efficacy` | `attacking_type_id`, `defending_type_id`, `damage_factor` |
| | `regions` | `id`, `name` |
| | `generations` | `id`, `name`, `region_id` |
| Bách khoa (chỉ đọc) | `species` | `id`, `name`, `generation_id`, `evolution_chain_id`, `is_legendary`, `is_mythical`, `is_fully_evolved` |
| | `pokemon` | `id`, `species_id`, `name`, `form_category`, `primary_type_id`, `secondary_type_id`, `hp` ... `speed`, `base_stat_total` (GENERATED STORED) |
| | `evolution_chains` | `id` |
| | `evolution_links` | `chain_id`, `from_species_id`, `to_species_id`, `trigger_name`, `min_level` |
| Người dùng (đọc, ghi) | `teams` | `id`, `name`, `share_code` (`utf8mb4_bin`), `synergy_score`, `created_at`, `updated_at` |
| | `team_members` | PK (`team_id`, `slot`), `slot` 1-6, UNIQUE (`team_id`, `pokemon_id`) |

### II. Ý chính

- Tách `species` và `pokemon`: Vulpix là Fire, Vulpix Alola là Ice (cùng loài, khác dạng).
- Hệ và 6 chỉ số là cột trên `pokemon`: lọc, sắp xếp bằng một truy vấn, không JOIN.
- 10 bảng, 3 migration Flyway V1-V3; Hibernate `ddl-auto: validate`.
- `form_category`: DEFAULT 1.025, REGIONAL 58, MEGA 97, GMAX 34, OTHER 137 (tổng 1.351 dạng).

---

## Phần 3. 14 endpoint REST (A2)

### I. Danh sách endpoint (tiền tố `/api/v1`)

| Method | Đường dẫn | Mô tả | Tính năng |
|---|---|---|---|
| GET | `/health` | Kiểm tra dịch vụ | |
| GET | `/pokemon` | Lọc, sắp xếp, phân trang | F01 |
| GET | `/pokemon/{idOrName}` | Chi tiết, lưới phòng thủ | F02 |
| GET | `/pokemon/search` | Gợi ý tên khi gõ | F01, F04, F05 |
| GET | `/pokemon/compare` | Bàn Cân Sức Mạnh | F04 |
| GET | `/pokemon/{idOrName}/evolution` | Chuỗi tiến hóa | F02 |
| GET | `/pokemon/speed-tiers` | Mốc tốc độ gốc | F09 |
| GET | `/pokemon/generations` | Hồ sơ 9 thế hệ | F07 |
| GET | `/types` | Danh sách 18 hệ | F03 |
| GET | `/types/matrix` | Ma trận 18 x 18 | F03 |
| POST | `/synergy/analyze` | Phân tích đội 1-6 Pokémon | F05 |
| POST | `/synergy/recommendations` | Đề xuất, đội 1-5 Pokémon | F05 |
| POST | `/teams` | Lưu đội, trả `shareCode` | F06 |
| GET | `/teams/shared/{shareCode}` | Xem đội qua mã | F06 |

### II. Mã lỗi

| `code` | HTTP |
|---|---|
| `VALIDATION_FAILED` | 400 |
| `INVALID_PARAMETER` | 400 |
| `DUPLICATE_POKEMON` | 400 |
| `UNKNOWN_POKEMON` | 400 |
| `POKEMON_NOT_FOUND` | 404 |
| `TEAM_NOT_FOUND` | 404 |
| `PAYLOAD_TOO_LARGE` | 413 |
| `RATE_LIMITED` | 429 |
| `DATA_NOT_READY` | 503 |

### III. Ý chính

- JSON dạng camelCase.
- Lỗi trả về dạng ProblemDetail (RFC 9457) có thêm trường `code`; frontend dịch `code` sang tiếng Việt.
- Synergy dùng POST vì đầu vào là danh sách có cấu trúc kèm tùy chọn.

---

## Phần 4. Trọng số PlayStyle (A3)

### I. Bảng trọng số

| Lối chơi | Phòng thủ | Độ phủ | Vai trò | Sức mạnh | Lọc | Điểm vai trò (`RoleScorer`) |
|---|---|---|---|---|---|---|
| Cân bằng | 40% | 20% | 25% | 15% | Không lọc tốc độ | 0,4 x bù lệch vật lý/đặc biệt + 0,3 x bù lệch phòng thủ + 0,3 x nhu cầu tốc độ |
| Tấn công nhanh | 25% | 25% | 35% | 15% | Tốc độ gốc từ 80 | 0,55 x tốc độ (chuẩn 130) + 0,45 x chỉ số tấn công cao hơn (chuẩn 140) |
| Trâu bò | 50% | 10% | 25% | 15% | Không lọc tốc độ | 0,6 x độ trâu ((HP + Phòng thủ + Phòng thủ đặc biệt) / 3, chuẩn 115) + 0,4 x bù lệch phòng thủ |
| Trick Room | 30% | 15% | 40% | 15% | Tốc độ gốc tối đa 60 | 0,45 x độ chậm (1 - tốc độ / 80) + 0,35 x chỉ số tấn công + 0,2 x độ trâu |

### II. Top 3 cho đội demo (API ngày 05/11)

| Cấu hình | Số ứng viên | Top 3 |
|---|---|---|
| Cân bằng, không loại huyền thoại | 596 | Iron Treads 84,6; Great Tusk 83,5; Sandy Shocks 82,2 |
| Cân bằng, loại huyền thoại | 484 | Excadrill 85,1; Rhyperior 78,9; Magnezone 77,5 |
| Trick Room, loại huyền thoại | 165 | Stakataka 80,7; Steelix 77,9; Rhyperior 74,5 |

### III. Ý chính

- Trọng số là hằng số trong enum `PlayStyle`; người dùng chọn lối chơi, không chỉnh từng trọng số.
- Hòa điểm thì xếp BST cao hơn trước, rồi ID nhỏ hơn, để kết quả luôn xác định.
- Ô "loại huyền thoại" còn loại 20 Pokémon Paradox, vì CSV không đánh dấu Paradox là huyền thoại. Không bật ô này thì top 3 toàn Paradox.

---

## Phần 5. Xử lý lỗi và bảo mật (A4)

### I. Rủi ro và biện pháp

| Rủi ro | Biện pháp |
|---|---|
| Body sai, ID trùng hoặc lạ | Bean Validation; 400 `VALIDATION_FAILED`, `DUPLICATE_POKEMON`, `UNKNOWN_POKEMON` |
| Body lớn làm cạn bộ nhớ | `RequestBodyLimitFilter`: tối đa 16 KB, vượt thì 413 |
| Spam lưu đội | `SaveRateLimiter`: 10 lần mỗi phút mỗi IP, theo dõi tối đa 10.000 IP, vượt thì 429 kèm `Retry-After` |
| Giả IP (lỗi B3) | `ClientIpResolver` đọc `CF-Connecting-IP` do Cloudflare ghi đè, không tin `X-Forwarded-For` (PR #91) |
| Gọi API từ origin lạ | CORS chỉ cho domain Pages; origin lạ nhận 403 |
| Đoán mã chia sẻ | 8 ký tự base62 từ `SecureRandom` (khoảng 2,18 x 10^14 tổ hợp); id nội bộ không lộ |
| SQL injection, sắp xếp tùy ý | JPA, Specification, tham số bind; ô tìm chỉ nhận `[a-z0-9-]`; whitelist cột sắp xếp |
| Lộ bí mật | Bí mật chỉ ở biến môi trường; lịch sử git không có secret (Issue #70) |

### II. Lỗi B3

- Proxy của Render chỉ nối IP vào cuối `X-Forwarded-For`, giá trị đầu do client tự đặt. Kiểm chứng 04/11: 11 request giả header đều qua giới hạn.
- Sửa ở PR #91: lấy IP từ `CF-Connecting-IP`.
- Chạy lại trên production ngày 06/11: giả `X-Forwarded-For` hay `Forwarded` thì lần 11 vẫn bị 429; tự gắn `CF-Connecting-IP` thì edge Cloudflare trả 403 trước khi tới backend.

---

## Phần 6. Hiệu năng (A5)

### I. Số đo

| Chỉ số | Kết quả | Mục tiêu |
|---|---|---|
| p95 `analyze` (đội 5; đội 6) | 7,2 ms; 6,9 ms | Dưới 50 ms |
| p95 `recommendations` | 8,6 ms | Dưới 50 ms |
| Pokédex trang đầu (local) | 124-406 ms | Dưới 1 s |
| Chunk JS chính sau gzip | 118,7 KB | Dưới 300 KB |
| Khởi động backend có dữ liệu | 5,4 s local; 27,5 s ở 0,5 CPU | Dưới 15 s |
| Nạp CSV đầy đủ | 3,1 s | |
| CLS trên production | Tối đa 0,05 (12 route x 2 cỡ) | Tối đa 0,1 |

### II. Ý chính

- Đo bằng `scripts/bench-synergy.sh`: 20 lần khởi động, 100 lần đo, backend và MySQL trong Docker, 1.351 Pokémon.
- Độ phức tạp: phân tích O(18 x n), n tối đa 6; đề xuất O(N x 18 + N log N), N khoảng 1.300.
- PR #58: dừng animation ngoài màn hình, main thread trang Tổng quan lúc đứng yên giảm từ 57% xuống 1-8%.
- Chưa đo tải nhiều người dùng đồng thời.

---

## Phần 7. Accessibility (A6)

- Lighthouse Accessibility 100 ở 8 route x 2 cấu hình (mobile, desktop), đo ở local 28/10; trên link thật 06/11 cũng 100 ở 9/9 route.
- Màu luôn đi kèm chữ: nhãn hệ ghi tên hệ, ô hệ số ghi x2, x½.
- Thang hệ số xanh dương - cam, không dùng xanh lục - đỏ, cho người mù màu đỏ-lục.
- 18 cặp màu hệ đạt tương phản tối thiểu 4.5:1 (WCAG AA).
- Vùng chạm tối thiểu 40 px trên mobile; `Esc` đóng menu.
- Thứ tự `Tab` khớp thứ tự hiển thị ở Team Builder và Pokédex (PR #69, #76).
- `prefers-reduced-motion`: hiện ngay trạng thái cuối, không chuyển ảnh.
- Production 04/11: 12 route x 2 cỡ không cuộn ngang, đúng 1 thẻ `h1`.

---

## Phần 8. Các quyết định kiến trúc chính (A7)

| ADR | Quyết định | Ngày | Trạng thái |
|---|---|---|---|
| 0001 | Monorepo: backend, frontend, tài liệu chung một repo, một CI 2 job | 18/10 | Chấp nhận |
| 0002 | Nạp dữ liệu từ CSV PokéAPI, không gọi API lúc chạy | 18/10 | Chấp nhận |
| 0003 | Tính Synergy trong bộ nhớ | 18/10 | Chấp nhận |
| 0004 | Java 25 và Spring Boot 4.1 | 18/10 | Chấp nhận |
| 0005 | Ảnh Hybrid: sprite tự host, artwork hotlink | 19/10 | Chấp nhận |
| 0006 | Nền khung cảnh nhiều ảnh và chuyển động nền | 28/10 | Sửa một phần bởi 0008 |
| 0007 | Hosting Railway và Cloudflare Pages | 29/10 | Thay một phần bởi 0009 |
| 0008 | Nhận vùng vá do AI vẽ có Content Credentials | 30/10 | Chấp nhận |
| 0009 | Hosting Render và Aiven thay Railway | 02/11 | Chấp nhận |

- Mỗi ADR ghi bối cảnh, quyết định, các phương án đã cân nhắc và hệ quả. File gốc: [docs/adr/](../adr/).
- Ví dụ ADR 0004: chọn Boot 4.1 vì Boot 3.5 đã hết hỗ trợ mã nguồn mở; đánh đổi là nhiều hướng dẫn trên mạng vẫn viết cho Boot 3.
- Hosting: Railway dừng nhận đăng ký mới, ngày 02/11 chuyển sang Render (backend) và Aiven (MySQL), giữ Cloudflare Pages (frontend), không sửa code.

---

## Phần 9. Sáu lỗi sửa ngày 05/11 (A8)

| Issue | Lỗi | PR |
|---|---|---|
| #80 | Danh sách Pokédex trên mobile: nhãn hệ lúc dưới tên, lúc bên phải | #85 |
| #81 | Ẩn 16 dạng trùng hệ, chỉ số, ảnh (Zygarde Power Construct, Totem) | #86 |
| #82 | Ô tìm kiếm không ra dạng Mega, Gmax và dạng khác | #87 |
| #83 | Thẻ thành viên đội: bảng chi tiết khi rê chuột hoặc giữ 1,5 giây | #88 |
| #84 | Trang Tổng quan: hero bị cắt ở màn hình scale 150%, quá dài trên điện thoại | #92 |
| #89 | B3: giả header `X-Forwarded-For` vượt được giới hạn lưu đội trên Render | #91 |

- Tìm ra khi kiểm tra trên production ngày 04/11; 6 PR merge rạng sáng 05/11.
- #84: ở 375 px trang Tổng quan ngắn từ 11.327 px còn 6.853 px.
- #89: bài thử 11 request chạy lại trên production ngày 06/11, đạt.
- Cả 7 Issue nhãn `type: bug` của dự án đã đóng (thêm #75, thứ tự `Tab`, PR #76).
