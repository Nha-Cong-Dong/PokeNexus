# PokeNexus - Đặc tả MVP

- Phiên bản: 0.2 (bản nháp, chốt 1.0 ở task T201 ngày 26/10)
- Tài liệu liên quan: [product.md](product.md), [architecture.md](architecture.md), [database.md](database.md), [api.md](api.md).
- Mục **Câu hỏi còn mở** ở cuối phải được trả lời hết trước khi chốt phiên bản 1.0.

---

## Phần 1. Bối cảnh và mục tiêu

### I. Mục tiêu MVP

- Người dùng tra cứu được Pokémon, xem chi tiết, so sánh 2 Pokémon.
- Người dùng xây đội tối đa 5 Pokémon, thấy lỗ hổng phòng thủ, nhận 3 đề xuất cho vị trí thứ 6, lưu và chia sẻ đội.

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

- Mở Omni-Dex, lọc "hệ Dragon, thế hệ 4", mở chi tiết Garchomp.
- So sánh Garchomp với Salamence trên Bàn Cân.
- Xây đội Charizard, Gyarados, Dragonite, Talonflame, Volcarona; xác nhận hệ Rock bị đánh dấu.
- Nhận 3 đề xuất, thêm đề xuất số 1, xác nhận điểm đội tăng.
- Lưu đội, mở đường dẫn chia sẻ ở cửa sổ ẩn danh, xác nhận đúng 6 thành viên.

---

## Phần 5. Rủi ro và câu hỏi còn mở

### I. Rủi ro

| Rủi ro | Phòng ngừa |
|---|---|
| Nạp dữ liệu tốn nhiều thời gian hơn dự kiến | Chỉ nạp các bảng MVP; xuất `mysqldump` sau khi nạp thành công |
| Phạm vi phình to | Mọi ý tưởng mới đưa vào Backlog, chỉ xét sau MVP |
| Hosting miễn phí chậm khi demo | Luôn có bản chạy local bằng Docker |

### II. Câu hỏi còn mở và đề xuất trả lời

| Câu hỏi | Đề xuất (chờ chốt ở T201) | Tài liệu bị ảnh hưởng |
|---|---|---|
| Có hiển thị các dạng đặc biệt (Mega, Gigantamax) trong Omni-Dex không? | DB lưu mọi dạng kèm `form_category`. Omni-Dex mặc định hiện `DEFAULT` và `REGIONAL`, người dùng bật thêm được. Team Builder nhận mọi dạng; ứng viên đề xuất chỉ gồm `DEFAULT` và `REGIONAL` | [database.md](database.md), Phần 1, mục IV; [api.md](api.md) |
| Trọng số chấm điểm đề xuất cố định hay cho người dùng chỉnh? | Cố định trong MVP (60/25/15), là hằng số trong code | [architecture.md](architecture.md), Phần 5 |
| Giới hạn số đội được lưu từ một địa chỉ IP? | 10 lần lưu mỗi phút mỗi IP, bộ đếm trong bộ nhớ, vượt thì trả 429 | [architecture.md](architecture.md), Phần 8; [api.md](api.md) |
