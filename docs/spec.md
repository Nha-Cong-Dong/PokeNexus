# PokeNexus - Đặc tả MVP

- Phiên bản: 1.5 (yêu cầu chốt ở task T201 ngày 2026-10-21; cập nhật 2026-10-30)
- Tài liệu liên quan: [product.md](product.md), [architecture.md](architecture.md), [database.md](database.md), [api.md](api.md).
- Thay đổi so với 1.0: thêm Phần 6 (truy vết và kiểm chứng, chuyển từ `SPEC.md` ở gốc repo); không đổi yêu cầu và tiêu chí chấp nhận.
- Thay đổi so với 1.1: thêm F07 Trang Tổng quan (Phần 2, mục VII) theo bản thiết kế giao diện ngày 2026-10-24; Omni-Dex chuyển từ `/` sang `/pokedex`. Lý do: người dùng mới cần một trang giới thiệu dẫn tới 4 công cụ, thay vì vào thẳng lưới dữ liệu. Thay đổi yêu cầu từ đây phải tăng phiên bản và ghi lý do.
- Thay đổi so với 1.2: phân tích đội nhận 1-6 Pokémon, đề xuất vẫn nhận 1-5 (Phần 2, mục V.1); ví dụ 4 đổi thành 7 Pokémon, thêm ví dụ 5 (mục V.4). Lý do: bước "thêm đề xuất số 1, xác nhận điểm đội tăng" của kịch bản demo (Phần 4) cần chấm điểm đội đủ 6; với giới hạn 5, điểm không đổi khi thêm đề xuất vào slot 6.
- Thay đổi so với 1.3: Thử tài Trainer có 5 bộ câu hỏi và phần thưởng (Phần 2, mục VII); thêm F08 Trang Địa hình (Phần 2, mục VIII). Lý do: chủ dự án yêu cầu ngày 2026-10-28 thêm nội dung khám phá và trò chơi nhỏ cho người mới; cả hai mức Could, không đổi API và kịch bản demo.
- Thay đổi so với 1.4: thêm F09 Bảng tốc độ cấp 50 (US-09) và F10 Nhập, xuất đội Showdown (US-10) (Phần 2, mục IX, X). Lý do: chủ dự án chọn ngày 2026-10-30 hai tính năng mở rộng có sẵn trong roadmap cho người chơi VGC; F09 thêm endpoint `GET /pokemon/speed-tiers`, F10 không đổi API; kịch bản demo không đổi. Khối Bốn vùng đất của F07 thành Năm vùng đất, thêm thẻ dẫn tới trang Địa hình (F08) theo yêu cầu chủ dự án cùng ngày.

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
- Cây tiến hóa dạng dọc (T401): đủ mọi nhánh (Eevee 8 nhánh), mỗi loài ghi giai đoạn và điều kiện tiến hóa có trong dữ liệu (cấp độ, loại kích hoạt); bấm một loài mở trang chi tiết của loài đó.
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

- Phân tích: danh sách 1-6 ID Pokémon, không trùng nhau (5 thành viên người dùng chọn và Pokémon ở slot 6).
- Đề xuất: danh sách 1-5 ID, vì đội phải còn ít nhất 1 vị trí trống.

#### 2. Đầu ra phân tích

- Ma trận hệ số: 18 hệ tấn công x từng thành viên.
- Với mỗi hệ tấn công: số thành viên yếu, số thành viên kháng hoặc miễn nhiễm, mức hở (pressure), cờ lỗ hổng nghiêm trọng.
- Điểm phòng thủ của đội (0-100), radar chỉ số trung bình, số hệ mà đội đánh siêu hiệu quả được (theo hệ của Pokémon).
- Đánh giá đội: danh sách điểm mạnh và điểm yếu bằng lời, mỗi mục thuộc một nhóm (phòng thủ, tấn công, tốc độ, cân bằng), ví dụ "Lỗ hổng nghiêm trọng hệ Rock: 5 thành viên yếu, không ai kháng", "Chưa có thành viên nhanh (tốc độ gốc từ 100)".

#### 3. Đầu ra đề xuất

- 3 Pokémon cho vị trí tiếp theo, đã tiến hóa hoàn toàn, không trùng với đội, không trùng tổ hợp hệ với nhau.
- Mỗi đề xuất có điểm phù hợp (0-100), 1-4 lý do bằng lời có số liệu (hệ kháng và số thành viên đang yếu, chỉ số bù cho đội, hệ phủ thêm, BST) và cảnh báo nếu ứng viên làm chồng điểm yếu hoặc trùng hệ.
- Tùy chọn: loại trừ Pokémon huyền thoại, BST tối thiểu, lối chơi (Cân bằng, Tấn công nhanh, Trâu bò, Trick Room); lối chơi đổi trọng số và lọc ứng viên theo tốc độ gốc.

#### 4. Ví dụ có đáp án (dùng làm test)

| Đầu vào | Kỳ vọng |
|---|---|
| Charizard, Gyarados, Dragonite, Talonflame, Volcarona | Hệ Rock: 5/5 thành viên yếu (Charizard, Talonflame, Volcarona chịu 4x), 0 thành viên kháng, được đánh dấu lỗ hổng nghiêm trọng |
| Cùng đội trên, yêu cầu đề xuất | Đề xuất số 1 có lý do liên quan tới hệ Rock |
| Charizard | Hệ số: Rock 4, Ground 0, Water 2, Electric 2 |
| 7 Pokémon | Lỗi 400 |
| Đội ở ví dụ 1 thêm Excadrill (Ground/Steel) | Điểm đội tăng từ 20 lên 48; hệ Rock có 1 thành viên kháng, không còn là lỗ hổng nghiêm trọng |

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
| Năm vùng đất | 5 thẻ dẫn tới `/pokedex`, `/types`, `/compare`, `/team-builder`, `/terrain`, mỗi thẻ có tên, mô tả một câu, nút "Khám phá" |
| Vòng tương khắc | Chọn 1 trong 18 hệ tấn công; hiện danh sách hệ nhận x2, x½, x0 lấy từ `GET /types/matrix`; link tới `/types` |
| Pokémon hôm nay | Cùng một ngày luôn ra cùng một Pokémon; hiện artwork, số, hệ, BST, một câu về điểm yếu x2 trở lên; nút "Xem chi tiết" tới trang chi tiết |
| Xây đội trong 3 bước | 3 bước có minh họa tĩnh; nút "Xây đội ngay" |
| Số loài qua 9 thế hệ | Biểu đồ cột 9 thế hệ, số liệu là số dạng `DEFAULT` của từng thế hệ từ `GET /pokemon`; bấm một cột mở `/pokedex?gen=<n>` |
| Thử tài Trainer | 5 bộ, mỗi bộ 6 câu, 3 lựa chọn: hệ số sát thương, điểm yếu và miễn nhiễm, chỉ số gốc, hệ của Pokémon, vùng đất ra mắt. Đáp án tính từ ma trận tương khắc hoặc `GET /pokemon/{id}`, không ghi cứng; chọn đáp án thì hiện đúng hoặc sai kèm giải thích; đếm số câu đúng; làm lại được. Phần thưởng: 10 điểm Trainer mỗi câu đúng, thêm 5 điểm từ câu đúng thứ 3 liên tiếp; hết bộ nhận Master Ball (6/6), Ultra Ball (5/6), Great Ball (4/6) hoặc Poké Ball (1-3); đúng từ 5/6 nhận huy hiệu của bộ; 6 danh hiệu theo điểm (Tân binh 0, Trainer 100, Trainer ưu tú 300, Thủ lĩnh Gym 600, Tứ Thiên Vương 1000, Nhà vô địch 1500); tiến độ lưu `localStorage` của trình duyệt |
| Kêu gọi cuối trang | Tiêu đề, một câu, 2 nút như hero |

- Chuyển động trang trí (chữ hiện dần, dải hệ chạy ngang, đảo nổi) không bắt buộc ở MVP. Trang vẫn dùng được khi API lỗi: các khối dùng dữ liệu API hiển thị trạng thái lỗi riêng, phần còn lại vẫn hiện.
- Ngoài phạm vi: Pokémon đồng hành (chọn một Pokémon đi theo ở header), mức Could.

### VIII. F08 - Trang Địa hình

#### 1. Mô tả

- Trang `/terrain/:terrainId?` giới thiệu 13 địa hình (các khung cảnh tự nhiên ở `src/lib/scenes.ts`, bỏ `stadium` và `lab`), Pokémon thường gặp ở mỗi địa hình và minigame "Who's that Pokémon?". Thêm ngày 2026-10-28, mức Could.
- Hệ của một địa hình là các hệ có khung cảnh đó trong bảng hệ sang khung cảnh (`TYPE_SCENES`), nên 13 địa hình phủ đủ 18 hệ, mỗi hệ đúng một địa hình.

#### 2. Tiêu chí chấp nhận

| Khối | Tiêu chí |
|---|---|
| Chọn địa hình | 13 link có tên và dải màu khung cảnh; địa hình đang chọn có `aria-current="page"`; ID lạ chuyển về `/terrain` (Đồng cỏ) |
| Mô tả | Tên, đoạn mô tả, nhãn hệ thường gặp, số Pokémon mỗi hệ (`totalElements` của `GET /pokemon?type=`) |
| Who's that Pokémon? | Artwork tô đen của một Pokémon mang hệ của địa hình, 4 tên khác nhau; chọn thì hiện artwork màu, đúng hoặc sai, link tới trang chi tiết; 5 điểm mỗi câu đúng, thêm 5 điểm từ câu đúng thứ 3 liên tiếp; chuỗi 5 câu đúng nhận huy hiệu của địa hình; không lặp Pokémon vừa hỏi |
| Pokémon thường gặp | 12 Pokémon đầu theo ID của các hệ, link "Xem đủ N Pokémon hệ X trong Pokédex" tới `/pokedex?type=x` |
| Thẻ Trainer | Danh hiệu, điểm, Ball, 13 huy hiệu địa hình; dùng chung tiến độ với Thử tài Trainer |

- Dữ liệu từ `GET /pokemon?type=<hệ>&size=100&sort=id,asc`, mỗi hệ một request, gộp và bỏ trùng; không thêm endpoint. Trò chơi chọn trong tối đa 100 Pokémon đầu theo ID của mỗi hệ.
- Khi API lỗi, khối trò chơi và khối danh sách hiện `ErrorState` có nút thử lại; phần chọn địa hình và mô tả vẫn dùng được.

### IX. F09 - Bảng tốc độ cấp 50

#### 1. Mô tả

- Cho người chơi VGC biết Pokémon của mình nhanh hơn bao nhiêu Pokémon khác ở cấp 50 (US-09). Thêm ngày 2026-10-30, mức Should (E9).
- Tốc độ cấp 50 tính ở frontend theo công thức chỉ số của game: `floor((floor((2 x gốc + IV + floor(EV / 4)) x 50 / 100) + 5) x tính cách)`, tính cách là 0,9, 1,0 hoặc 1,1 (nhân số nguyên rồi chia 10 để tránh sai số dấu phẩy động).

#### 2. Tiêu chí chấp nhận

| Khối | Tiêu chí |
|---|---|
| Ba mức tốc độ | Tối thiểu (IV 0, 0 EV, tính cách giảm Tốc độ), Không đầu tư (IV 31, 0 EV, trung tính), Tối đa (IV 31, 252 EV, tính cách tăng Tốc độ). Garchomp (gốc 102): 96, 122, 169; Charizard (gốc 100): 94, 120, 167 |
| Tỷ lệ | "Nhanh hơn N% Pokémon": số dạng `DEFAULT`, `REGIONAL` có tốc độ gốc thấp hơn chia cho tổng số dạng (bỏ chính Pokémon đó), làm tròn xuống. Cùng mức đầu tư thì thứ tự chỉ phụ thuộc tốc độ gốc |
| Trang Chi tiết | Khối "Tốc độ ở cấp 50" trong panel chỉ số: 3 mức, tỷ lệ, số Pokémon cùng tốc độ gốc, mốc "Vừa thua" và "Vừa vượt" (tối đa 3 tên có link mỗi mốc) |
| Team Builder | Panel "Tốc độ cấp 50": thành viên (kể cả slot 6) xếp từ nhanh đến chậm, mỗi dòng có 3 mức và tỷ lệ |
| Lỗi | `speed-tiers` lỗi thì vẫn hiện 3 mức (tính tại chỗ) kèm câu "Chưa tải được bảng tốc độ để so sánh."; chi tiết thành viên lỗi thì panel hiện "Chưa tải được chỉ số tốc độ của đội." |

- Dữ liệu: `GET /pokemon/speed-tiers` ([api.md](api.md), Phần 2, mục XIII) và `GET /pokemon/{idOrName}` cho tốc độ gốc của từng thành viên.

### X. F10 - Nhập, xuất đội Showdown

#### 1. Mô tả

- Nhập đội từ văn bản xuất của Pokémon Showdown vào Team Builder và xuất đội ra văn bản Showdown (US-10). Thêm ngày 2026-10-30, mức Could (E9).
- Chỉ dùng tên Pokémon; chiêu thức, vật phẩm, Ability, EV nằm ngoài phạm vi ([product.md](product.md), Phần 4, mục II) nên bị bỏ qua khi nhập và không có khi xuất.

#### 2. Tiêu chí chấp nhận

| Khối | Tiêu chí |
|---|---|
| Đọc văn bản | Các khối cách nhau bằng dòng trống; dòng bắt đầu bằng `===` bị bỏ; dòng đầu mỗi khối có dạng `Biệt danh (Loài) (M/F) @ Vật phẩm`, lấy tên loài; các dòng còn lại bị bỏ qua và có thông báo |
| Tra tên | Chuẩn hóa: chữ thường, bỏ dấu, bỏ `.`, `'`, `’`, `:`, `%`, ký tự khác thành `-`; áp bảng ngoại lệ (ví dụ `Indeedee-F` thành `indeedee-female`, `Necrozma-Dusk-Mane` thành `necrozma-dusk`). Thử đúng tên, rồi tên đầu tiên bắt đầu bằng chuỗi đó (mọi dạng), rồi bỏ dần đoạn cuối và thử đúng tên |
| Nhập | 5 Pokémon đầu vào đội, con thứ 6 vào slot 6; bỏ con trùng và con thứ 7 trở đi; liệt kê dòng không nhận ra. Không nhận ra con nào thì giữ nguyên đội và báo lỗi |
| Xuất | Mỗi Pokémon một khối chỉ có tên kiểu Showdown: dạng mặc định dùng tên loài (`landorus-incarnate` thành `Landorus`), dạng khác dùng tên loài cộng hậu tố (`Landorus-Therian`), cộng bảng ngoại lệ; nút "Sao chép"; nhập lại chính văn bản đã xuất ra đúng đội |
| Vị trí | Team Builder: nút "Nhập Showdown", "Xuất Showdown" dưới các slot; Đội chia sẻ: nút "Xuất Showdown" |

- Không thêm endpoint: dùng `GET /pokemon/{idOrName}` và `GET /pokemon/search` với mọi giá trị `form`.

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
| Trọng số chấm điểm đề xuất cố định hay cho người dùng chỉnh? | Cố định trong MVP (60/25/15), là hằng số trong code. Cập nhật 2026-10-31 theo yêu cầu chủ dự án: thêm thành phần vai trò chỉ số và 4 lối chơi, mỗi lối chơi một bộ trọng số cố định (Cân bằng 40/20/25/15); người dùng chọn lối chơi, không chỉnh từng trọng số | [architecture.md](architecture.md), Phần 5, mục III |
| Giới hạn số đội được lưu từ một địa chỉ IP? | 10 lần lưu mỗi phút mỗi IP, bộ đếm trong bộ nhớ, vượt thì trả 429 | [architecture.md](architecture.md), Phần 8; [api.md](api.md) |
| Phân tích đội có chấm điểm cả slot 6 không? (bổ sung 2026-10-27) | Có: `analyze` nhận 1-6, `recommendations` vẫn nhận 1-5; điểm đội đã lưu tính trên mọi thành viên. Phương án khác (sửa bước demo, giữ giới hạn 5) bị loại vì làm mất bước "điểm đội tăng" | [api.md](api.md), Phần 2; [architecture.md](architecture.md), Phần 5 |

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
| F07 Trang Tổng quan | | Phần 2, mục VII | `GET /pokemon/{idOrName}`, `GET /pokemon`, `GET /types/matrix` | `/`, `LandingPage` | | T311, T312, T313 | Should |
| F08 Trang Địa hình | | Phần 2, mục VIII | `GET /pokemon` | `/terrain/:terrainId?`, `TerrainPage` | | T314 | Could |
| F09 Bảng tốc độ cấp 50 | US-09 | Phần 2, mục IX | `GET /pokemon/speed-tiers`, `GET /pokemon/{idOrName}` | `/pokemon/:idOrName`, `/team-builder` | `pokedex` | T408 | Should |
| F10 Nhập, xuất đội Showdown | US-10 | Phần 2, mục X | `GET /pokemon/{idOrName}`, `GET /pokemon/search` | `/team-builder`, `/team/:shareCode` | | T409 | Could |

- Mọi endpoint có tiền tố `/api/v1` ([api.md](api.md), Phần 2). Route: [architecture.md](architecture.md), Phần 6. Class của từng package: [folder-structure.md](folder-structure.md), Phần 2, mục II.

### II. Test có đáp án bắt buộc

| Nguồn đáp án | Loại test | Class test | Task |
|---|---|---|---|
| Phần 2, mục V.4, ví dụ 1, 4 và 5 | Unit | `SynergyAnalyzerTest` | T305 |
| Phần 2, mục V.4, ví dụ 2 | Unit | `RecommendationEngineTest` | T305 |
| Phần 2, mục V.4, ví dụ 3 | Unit | `TypeChartServiceTest` | T303, T304 |
| [roadmap.md](roadmap.md) T205, cột Kiểm tra | Tích hợp | `IngestionRunnerIT` | T205 |
| [roadmap.md](roadmap.md) T206, cột Kiểm tra | Tích hợp | `PokemonControllerIT` | T206 |
| [roadmap.md](roadmap.md) T307, cột Kiểm tra | Tích hợp | `TeamControllerIT` | T307 |
| Phần 2, mục IX (Garchomp 96, 122, 169) | Unit | `level50.test.ts`, `TeamSpeedList.test.tsx` (frontend) | T408 |
| [roadmap.md](roadmap.md) T408, cột Kiểm tra | Unit, tích hợp | `SpeedTierServiceTest`, `PokemonControllerIT` | T408 |
| Phần 2, mục X | Unit | `showdown.test.ts`, `ShowdownDialogs.test.tsx` (frontend) | T409 |

- Tên class theo quy ước `<Class>Test`, `<Class>IT` ở [folder-structure.md](folder-structure.md), Phần 2, mục III; class của task chưa làm chốt tên khi viết test. Tầng kiểm thử: [architecture.md](architecture.md), Phần 12.

### III. Cách đo yêu cầu phi chức năng

| Yêu cầu (Phần 3) | Cách đo | Task |
|---|---|---|
| Synergy p95 dưới 50 ms | `scripts/bench-synergy.sh` | T305, T404 |
| Omni-Dex trang đầu dưới 1 giây (local) | DevTools Network | T301 |
| Dùng được ở 375 px và 1440 px | Kiểm tra thủ công 6 trang | T309 |
| Không gọi PokéAPI lúc chạy | Chạy demo khi tắt mạng (trừ artwork) | T403 |

- Kịch bản end-to-end ở Phần 4 chạy trước mỗi tag `v0.2.0`, `v1.0.0`.
