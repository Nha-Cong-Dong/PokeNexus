# PokeNexus - Đặc tả MVP

- Phiên bản: 1.2 (yêu cầu chốt ở task T201 ngày 2026-10-21; cập nhật 2026-10-26)
- Tài liệu liên quan: [product.md](product.md), [architecture.md](architecture.md), [database.md](database.md), [api.md](api.md).
- Thay đổi so với 1.0: thêm Phần 6 (truy vết và kiểm chứng, chuyển từ `SPEC.md` ở gốc repo); không đổi yêu cầu và tiêu chí chấp nhận.
- Thay đổi so với 1.1: thêm F07 Trang Tổng quan (Phần 2, mục VII) theo bản thiết kế giao diện ngày 2026-10-24; Omni-Dex chuyển từ `/` sang `/pokedex`. Lý do: người dùng mới cần một trang giới thiệu dẫn tới 4 công cụ, thay vì vào thẳng lưới dữ liệu. Thay đổi yêu cầu từ đây phải tăng phiên bản và ghi lý do.

---

## Phần 1. Bối cảnh và mục tiêu

### I. Mục tiêu MVP

- Người dùng tra cứu được Pokémon, xem chi tiết, so sánh 2 Pokémon.
- Người dùng xây đội tối đa 5 Pokémon, thấy lỗ hổng phòng thủ, nhận 3 đề xuất cho vị trí thứ 6, lưu và chia sẻ đội.
- Người dùng mới mở trang Tổng quan, hiểu sản phẩm làm được gì và đi tới đúng công cụ trong một lần bấm.

### II. Ngoài phạm vi

- Xem [product.md](product.md), Phần 4, mục II.

---

## Phần 2. Yêu cầu chức năng

### I. F01 - Omni-Dex

#### 1. Mô tả

- Lưới thẻ Pokémon (sprite, số Pokédex, tên, nhãn hệ, tổng chỉ số), có bộ lọc và sắp xếp.

#### 2. Tiêu chí chấp nhận

- Lọc theo: hệ (tối đa 2), thế hệ, khoảng tổng chỉ số (BST), tốc độ tối thiểu; các điều kiện kết hợp với nhau.
- Sắp xếp theo số Pokédex, tên, BST, tốc độ; mặc định theo số Pokédex tăng dần.
- Phân trang 24 phần tử mỗi trang; tham số lọc phản ánh trên URL.
- Không có kết quả: hiển thị trạng thái rỗng kèm nút xóa bộ lọc.

### II. F02 - Chi tiết Pokémon

#### 1. Tiêu chí chấp nhận

- Hiển thị: tên, sprite, hệ, 6 chỉ số gốc dạng thanh, BST, chiều cao, cân nặng.
- Lưới phòng thủ 18 hệ, mỗi ô ghi hệ số (0, 0.25, 0.5, 1, 2, 4) và tô màu theo mức.
- Truy cập bằng ID hoặc tên; không tồn tại thì trả 404 và hiển thị trang "không tìm thấy".

### III. F03 - Bảng tương khắc

#### 1. Tiêu chí chấp nhận

- Ma trận 18 x 18 (hàng: hệ tấn công, cột: hệ phòng thủ).
- Chọn 1-2 hệ phòng thủ để xem hệ số nhận từ 18 hệ tấn công.

### IV. F04 - Bàn Cân Sức Mạnh

#### 1. Tiêu chí chấp nhận

- Chọn 2 Pokémon; biểu đồ Radar 6 chỉ số chồng lớp.
- Kết luận tự động gồm 3 ý: lợi thế hệ (đòn cùng hệ tốt nhất mỗi bên), lợi thế tổng chỉ số, bên nào nhanh hơn.

### V. F05 - Team Builder và Synergy Analyzer

#### 1. Đầu vào

- Danh sách 1-5 ID Pokémon, không trùng nhau.

#### 2. Đầu ra phân tích

- Ma trận hệ số: 18 hệ tấn công x từng thành viên.
- Với mỗi hệ tấn công: số thành viên yếu, số thành viên kháng hoặc miễn nhiễm, mức hở (pressure), cờ lỗ hổng nghiêm trọng.
- Điểm phòng thủ của đội (0-100), radar chỉ số trung bình, số hệ mà đội đánh siêu hiệu quả được (theo hệ của Pokémon).

#### 3. Đầu ra đề xuất

- 3 Pokémon cho vị trí tiếp theo, đã tiến hóa hoàn toàn, không trùng với đội, không trùng tổ hợp hệ với nhau.
- Mỗi đề xuất có điểm phù hợp (0-100) và ít nhất 1 lý do bằng lời.
- Tùy chọn: loại trừ Pokémon huyền thoại, BST tối thiểu.

#### 4. Ví dụ có đáp án (dùng làm test)

| Đầu vào | Kỳ vọng |
|---|---|
| Charizard, Gyarados, Dragonite, Talonflame, Volcarona | Hệ Rock: 5/5 thành viên yếu (Charizard, Talonflame, Volcarona chịu 4x), 0 thành viên kháng, được đánh dấu lỗ hổng nghiêm trọng |
| Cùng đội trên, yêu cầu đề xuất | Đề xuất số 1 có lý do liên quan tới hệ Rock |
| Charizard | Hệ số: Rock 4, Ground 0, Water 2, Electric 2 |
| 6 Pokémon | Lỗi 400 |

#### 5. Thuật toán

- Mô tả chi tiết ở [architecture.md](architecture.md), Phần 5.

### VI. F06 - Lưu và chia sẻ đội

#### 1. Tiêu chí chấp nhận

- Lưu đội (tên, 1-6 thành viên) không cần đăng nhập; trả về `shareCode` 8 ký tự.
- Mở `/team/{shareCode}` xem được đội ở trình duyệt khác.
- Mã không tồn tại: 404.

### VII. F07 - Trang Tổng quan

#### 1. Mô tả

- Trang mở đầu ở route `/`, dựng theo bản thiết kế "Tổng quan" ([design-system.md](design-system.md), Phần 7, mục II.1). Omni-Dex chuyển sang `/pokedex`.

#### 2. Tiêu chí chấp nhận

| Khối | Tiêu chí |
|---|---|
| Hero | Tên sản phẩm, câu mô tả, 3 nhãn (thế hệ 1-9, chạy offline, dữ liệu PokéAPI); hộp thoại "Giáo sư" có nút "Mở Pokédex" tới `/pokedex` và "Xây đội ngay" tới `/team-builder`; Pokémon nổi bật có artwork, số Pokédex, hệ, chiều cao, cân nặng; chọn được 1 trong 13 khung cảnh vùng đất |
| Dải hệ | 18 nhãn hệ có chữ |
| Bốn vùng đất | 4 thẻ dẫn tới `/pokedex`, `/types`, `/compare`, `/team-builder`, mỗi thẻ có tên, mô tả một câu, nút "Khám phá" |
| Vòng tương khắc | Chọn 1 trong 18 hệ tấn công; hiện danh sách hệ nhận x2, x½, x0 lấy từ `GET /types/matrix`; link tới `/types` |
| Pokémon hôm nay | Cùng một ngày luôn ra cùng một Pokémon; hiện artwork, số, hệ, BST, một câu về điểm yếu x2 trở lên; nút "Xem chi tiết" tới trang chi tiết |
| Xây đội trong 3 bước | 3 bước có minh họa tĩnh; nút "Xây đội ngay" |
| Số loài qua 9 thế hệ | Biểu đồ cột 9 thế hệ, số liệu là số dạng `DEFAULT` của từng thế hệ từ `GET /pokemon`; bấm một cột mở `/pokedex?gen=<n>` |
| Thử tài Trainer | 5 câu hỏi hệ số sát thương, đáp án tính từ ma trận tương khắc; chọn đáp án thì hiện đúng hoặc sai kèm giải thích; đếm số câu đúng; làm lại được |
| Kêu gọi cuối trang | Tiêu đề, một câu, 2 nút như hero |

- Chuyển động trang trí (chữ hiện dần, dải hệ chạy ngang, đảo nổi) không bắt buộc ở MVP. Trang vẫn dùng được khi API lỗi: các khối dùng dữ liệu API hiển thị trạng thái lỗi riêng, phần còn lại vẫn hiện.
- Ngoài phạm vi: Pokémon đồng hành (chọn một Pokémon đi theo ở header), mức Could.

---

## Phần 3. Yêu cầu phi chức năng

### I. Danh sách

| Nhóm | Yêu cầu |
|---|---|
| Hiệu năng | Phân tích và đề xuất đội dưới 50 ms; trang Omni-Dex tải trang đầu dưới 1 giây ở local |
| Độc lập mạng | Không gọi PokéAPI lúc chạy; dữ liệu nằm trong MySQL |
| Giao diện | Dùng được ở chiều rộng 375 px và 1440 px; nhãn hệ có chữ, không chỉ dùng màu |
| Chất lượng | Thuật toán có unit test; CI chạy test ở mỗi Pull Request |
| Bảo mật | Không commit bí mật; validate mọi đầu vào API |

---

## Phần 4. Kiểm chứng end-to-end

### I. Kịch bản demo

- Mở trang Tổng quan, bấm "Mở Pokédex".
- Ở Omni-Dex, lọc "hệ Dragon, thế hệ 4", mở chi tiết Garchomp.
- So sánh Garchomp với Salamence trên Bàn Cân.
- Xây đội Charizard, Gyarados, Dragonite, Talonflame, Volcarona; xác nhận hệ Rock bị đánh dấu.
- Nhận 3 đề xuất, thêm đề xuất số 1, xác nhận điểm đội tăng.
- Lưu đội, mở đường dẫn chia sẻ ở cửa sổ ẩn danh, xác nhận đúng 6 thành viên.

---

## Phần 5. Rủi ro và quyết định đã chốt

### I. Rủi ro

| Rủi ro | Phòng ngừa |
|---|---|
| Nạp dữ liệu tốn nhiều thời gian hơn dự kiến | Chỉ nạp các bảng MVP; xuất `mysqldump` sau khi nạp thành công |
| Phạm vi phình to | Mọi ý tưởng mới đưa vào Backlog, chỉ xét sau MVP |
| Hosting miễn phí chậm khi demo | Luôn có bản chạy local bằng Docker |

### II. Quyết định đã chốt (T201, 2026-10-21)

| Câu hỏi | Quyết định | Tài liệu bị ảnh hưởng |
|---|---|---|
| Có hiển thị các dạng đặc biệt (Mega, Gigantamax) trong Omni-Dex không? | DB lưu mọi dạng kèm `form_category`. Omni-Dex mặc định hiện `DEFAULT` và `REGIONAL`, người dùng bật thêm được. Team Builder nhận mọi dạng; ứng viên đề xuất chỉ gồm `DEFAULT` và `REGIONAL` | [database.md](database.md), Phần 1, mục IV; [api.md](api.md) |
| Trọng số chấm điểm đề xuất cố định hay cho người dùng chỉnh? | Cố định trong MVP (60/25/15), là hằng số trong code | [architecture.md](architecture.md), Phần 5 |
| Giới hạn số đội được lưu từ một địa chỉ IP? | 10 lần lưu mỗi phút mỗi IP, bộ đếm trong bộ nhớ, vượt thì trả 429 | [architecture.md](architecture.md), Phần 8; [api.md](api.md) |

- Không còn câu hỏi mở. Hai quy tắc dữ liệu rút ra từ khảo sát T102 (dạng totem, cap xếp `OTHER`; chọn một dòng tiến hóa cho mỗi loài) ghi ở [database.md](database.md), Phần 1 mục IV và Phần 5 mục II; số liệu khảo sát ở [data/README.md](../data/README.md), Phần 4.

---

## Phần 6. Truy vết và kiểm chứng

- Nối mỗi tính năng với user story, endpoint, trang, package, task và test; không chép tiêu chí (tiêu chí ở Phần 2-4).
- Đổi tên endpoint, trang hoặc class test thì sửa bảng ở đây; không cần tăng phiên bản tài liệu.

### I. Ma trận tính năng

| Tính năng | User Story | Tiêu chí | Endpoint | Route, trang | Package backend | Task | MoSCoW |
|---|---|---|---|---|---|---|---|
| F01 Omni-Dex | US-01 | Phần 2, mục I | `GET /pokemon`, `GET /pokemon/search` | `/pokedex`, `DexPage` | `pokedex` | T206, T301, T302 | Must |
| F02 Chi tiết Pokémon | US-02 | Phần 2, mục II | `GET /pokemon/{idOrName}` | `/pokemon/:idOrName`, `PokemonDetailPage` | `pokedex`, `typechart` | T303 | Must |
| F03 Bảng tương khắc | US-03 | Phần 2, mục III | `GET /types`, `GET /types/matrix` | `/types`, `TypeChartPage` | `typechart` | T304 | Must |
| F04 Bàn Cân Sức Mạnh | US-04 | Phần 2, mục IV | `GET /pokemon/compare` | `/compare`, `ComparePage` | `pokedex` | T308 | Should |
| F05 Team Builder, Synergy | US-05, US-06 | Phần 2, mục V | `POST /synergy/analyze`, `POST /synergy/recommendations` | `/team-builder`, `TeamBuilderPage` | `synergy` | T305, T306 | Must |
| F06 Lưu và chia sẻ đội | US-07 | Phần 2, mục VI | `POST /teams`, `GET /teams/shared/{shareCode}` | `/team/:shareCode`, `SharedTeamPage` | `team` | T307 | Must |
| F07 Trang Tổng quan | | Phần 2, mục VII | `GET /pokemon/{idOrName}`, `GET /pokemon`, `GET /types/matrix` | `/`, `LandingPage` | | T311, T312 | Should |

- Mọi endpoint có tiền tố `/api/v1` ([api.md](api.md), Phần 2). Route: [architecture.md](architecture.md), Phần 6. Class của từng package: [folder-structure.md](folder-structure.md), Phần 2, mục II.

### II. Test có đáp án bắt buộc

| Nguồn đáp án | Loại test | Class test | Task |
|---|---|---|---|
| Phần 2, mục V.4, ví dụ 1 và 4 | Unit | `SynergyAnalyzerTest` | T305 |
| Phần 2, mục V.4, ví dụ 2 | Unit | `RecommendationEngineTest` | T305 |
| Phần 2, mục V.4, ví dụ 3 | Unit | `TypeChartServiceTest` | T303, T304 |
| [roadmap.md](roadmap.md) T205, cột Kiểm tra | Tích hợp | `IngestionRunnerIT` | T205 |
| [roadmap.md](roadmap.md) T206, cột Kiểm tra | Tích hợp | `PokemonControllerIT` | T206 |
| [roadmap.md](roadmap.md) T307, cột Kiểm tra | Tích hợp | `TeamControllerIT` | T307 |

- Tên class theo quy ước `<Class>Test`, `<Class>IT` ở [folder-structure.md](folder-structure.md), Phần 2, mục III; class của task chưa làm chốt tên khi viết test. Tầng kiểm thử: [architecture.md](architecture.md), Phần 12.

### III. Cách đo yêu cầu phi chức năng

| Yêu cầu (Phần 3) | Cách đo | Task |
|---|---|---|
| Synergy p95 dưới 50 ms | `scripts/bench-synergy.sh` | T305, T404 |
| Omni-Dex trang đầu dưới 1 giây (local) | DevTools Network | T301 |
| Dùng được ở 375 px và 1440 px | Kiểm tra thủ công 6 trang | T309 |
| Không gọi PokéAPI lúc chạy | Chạy demo khi tắt mạng (trừ artwork) | T403 |

- Kịch bản end-to-end ở Phần 4 chạy trước mỗi tag `v0.2.0`, `v1.0.0`.
