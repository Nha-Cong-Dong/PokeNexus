# PokéNexus - Tài liệu Sản phẩm

- Phiên bản: 0.1 (Tuần 1)
- Mục đích: thống nhất **làm gì, cho ai, vì sao** trước khi đặc tả chi tiết ở [spec.md](spec.md).

---

## Phần 1. Tầm nhìn

### I. Câu giới thiệu

- "PokéNexus là bách khoa Pokémon kiêm cố vấn chiến thuật: xây đội, thấy ngay lỗ hổng, nhận gợi ý lấp lỗ hổng kèm lý do."

### II. Vấn đề và giải pháp

| Vấn đề | Giải pháp của PokéNexus |
|---|---|
| Dữ liệu rời rạc trên nhiều trang | Một ứng dụng duy nhất cho tra cứu, so sánh, xây đội |
| Bảng tương khắc 18 x 18 khó nhớ | Bảng tương tác và lưới phòng thủ tô màu cho từng Pokémon |
| Khó biết điểm yếu chung của đội | Synergy Analyzer tính ma trận điểm yếu của cả đội |
| Không biết nên thêm Pokémon nào | Đề xuất 3 ứng viên cho vị trí thứ 6, mỗi ứng viên có lý do |

### III. Giá trị khác biệt

- **Giải thích được:** mọi kết luận (bên nào lợi thế, vì sao nên chọn Pokémon X) đều đi kèm lý do bằng lời.
- **Nhanh:** phân tích đội hình trả kết quả gần như tức thì vì dữ liệu tĩnh được xử lý sẵn trong bộ nhớ.
- **Chia sẻ được:** bộ lọc và đội hình đều có đường dẫn riêng.

---

## Phần 2. Người dùng

### I. Persona

| Persona | Mô tả | Nhu cầu | Tính năng phục vụ |
|---|---|---|---|
| An - Người chơi mới | Chơi các game chính truyện | Tra cứu nhanh, hiểu tương khắc | Omni-Dex, Chi tiết, Bảng tương khắc |
| Bình - Người chơi VGC | Đấu đôi trực tuyến | Kiểm tra lỗ hổng, tìm Pokémon bổ sung | Team Builder, Synergy Analyzer |
| Chi - Người thích số liệu | Thích so sánh, thống kê | So sánh chỉ số trực quan | Bàn Cân Sức Mạnh |

---

## Phần 3. User Story

### I. Danh sách cho MVP

| Mã | User Story | Tiêu chí chấp nhận |
|---|---|---|
| US-01 | Là An, tôi muốn lọc Pokémon theo hệ, thế hệ và chỉ số để tìm nhanh | Lọc kết hợp nhiều điều kiện; có phân trang và sắp xếp; URL giữ trạng thái lọc |
| US-02 | Là An, tôi muốn xem chi tiết một Pokémon | Có chỉ số gốc, tổng chỉ số, hệ, lưới phòng thủ 18 hệ |
| US-03 | Là An, tôi muốn tra hệ số tương khắc giữa các hệ | Bảng 18 x 18; chọn 2 hệ phòng thủ để xem hệ số hệ kép |
| US-04 | Là Chi, tôi muốn so sánh 2 Pokémon trên cùng biểu đồ | Radar chồng lớp; kết luận tự động về hệ, chỉ số, tốc độ |
| US-05 | Là Bình, tôi muốn chọn tối đa 5 Pokémon và thấy lỗ hổng phòng thủ | Heatmap 18 hệ; hệ nguy hiểm được đánh dấu; điểm tổng 0-100 |
| US-06 | Là Bình, tôi muốn nhận 3 gợi ý cho vị trí thứ 6 | 3 gợi ý khác tổ hợp hệ; mỗi gợi ý có ít nhất 1 lý do |
| US-07 | Là Bình, tôi muốn lưu và chia sẻ đội hình | Lưu không cần đăng nhập; có đường dẫn chia sẻ; người khác mở xem được |

### II. Sau MVP

| Mã | User Story |
|---|---|
| US-08 | Là An, tôi muốn xem cây tiến hóa với điều kiện tiến hóa ở từng nhánh |
| US-09 | Là Bình, tôi muốn biết Pokémon của mình nhanh hơn những ai ở cấp 50 |
| US-10 | Là Bình, tôi muốn nhập và xuất đội theo định dạng Pokémon Showdown |

---

## Phần 4. Phạm vi

### I. Trong phạm vi MVP

- Omni-Dex, Chi tiết Pokémon, Bảng tương khắc, Bàn Cân Sức Mạnh, Team Builder + Synergy Analyzer, Lưu và chia sẻ đội.

### II. Ngoài phạm vi MVP

- Đăng nhập và tài khoản người dùng.
- Chiêu thức, Ability, vật phẩm trong phân tích đội hình.
- Tính sát thương, mô phỏng trận đấu.
- Dữ liệu Gym Leader và vùng đất.

---

## Phần 5. Chỉ số thành công

### I. Tiêu chí

- Người dùng thử xây được một đội hoàn chỉnh và nhận gợi ý trong dưới 3 phút.
- API phân tích đội phản hồi dưới 50 ms (đo ở môi trường local).
- Kịch bản demo chạy trọn vẹn không lỗi trên bản triển khai thật.
