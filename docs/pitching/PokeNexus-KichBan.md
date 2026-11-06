# PokeNexus - Kịch bản thuyết trình

- Phiên bản: 1.0 (tạo 2026-11-07, Issue #117; thay Phần 10 của [PokeNexus-LuyenTap.md](PokeNexus-LuyenTap.md))
- Dùng cho buổi pitching Checkpoint 4 ngày 08/11/2026 với [slides.html](slides.html), 18 slide. Lời nói ở đây trùng ghi chú của từng slide (phím `N` khi chiếu).
- Số liệu để học thêm cho phần hỏi đáp: [PokeNexus-PhuLuc.md](PokeNexus-PhuLuc.md); giải thích từng file code: [PokeNexus-LuyenTap.md](PokeNexus-LuyenTap.md).

---

## Phần 1. Cách dùng

### I. Điều khiển slide

| Phím | Tác dụng |
|---|---|
| Mũi tên phải, `Space`, `Enter` | Slide sau |
| Mũi tên trái, `Backspace` | Slide trước |
| `F` | Toàn màn hình |
| `N` | Bật, tắt ghi chú lời nói ở cạnh dưới |
| `Home`, `End` | Slide đầu, slide cuối |

- Mở file bằng Chrome hoặc Edge, không cần mạng. Thêm `#số` vào cuối địa chỉ để mở thẳng một slide, ví dụ `slides.html#6`.
- Hiệu ứng mỗi slide chạy khoảng 1,5 giây; nói câu đầu trong lúc nội dung hiện ra, không cần chờ.

### II. Thời lượng

- Tổng lời nói: 1.817 từ theo khoảng trắng, 1.981 từ khi đọc thành tiếng (số đọc theo âm tiết, ví dụ "1.351" là 7 từ).
- Ở tốc độ 140 từ mỗi phút: khoảng 14:09; 150 từ mỗi phút: 13:12; 130 từ mỗi phút: 15:14. Yêu cầu: khoảng 15 phút, lệch không quá 1 phút.
- Demo trực tiếp (slide 6) không tính vào thời lượng: dừng đồng hồ khi bắt đầu demo, bấm lại khi sang slide 7.
- Lời nói ngắn hơn 15 phút khoảng 50 giây: nói thong thả, dừng một nhịp sau mỗi con số quan trọng. Nếu tổng duyệt ra dưới 14:00, nói chậm lại ở ba slide thuật toán (10-12), nơi giám khảo cần thời gian đọc công thức.

### III. Bảng thời gian

| Slide | Tiêu đề | Bắt đầu | Thời lượng | Số từ (đọc) |
|---|---|---|---|---|
| 1 | PokeNexus | 00:00 | 00:28 | 65 |
| 2 | Người chơi VGC đang phải tự nhẩm | 00:28 | 00:53 | 124 |
| 3 | PokeNexus trong một câu | 01:21 | 00:42 | 97 |
| 4 | Ba người dùng, mười user story | 02:03 | 00:53 | 124 |
| 5 | 10 tính năng trên 8 trang | 02:56 | 00:43 | 101 |
| 6 | Demo trực tiếp | 03:39 | 00:21 | 49 |
| 7 | Omni-Dex và trang Chi tiết | 04:00 | 00:52 | 122 |
| 8 | Bảng tương khắc và Bàn Cân Sức Mạnh | 04:52 | 00:46 | 108 |
| 9 | Team Builder: bản đồ điểm yếu | 05:39 | 00:51 | 118 |
| 10 | Synergy: điểm đội tính thế nào | 06:29 | 01:09 | 160 |
| 11 | Đề xuất slot 6 theo lối chơi | 07:38 | 01:03 | 146 |
| 12 | Đội demo: 20 lên 48 nhờ Excadrill | 08:40 | 00:49 | 114 |
| 13 | Dữ liệu offline từ CSV PokéAPI | 09:29 | 00:50 | 116 |
| 14 | Kiến trúc và hosting | 10:19 | 00:56 | 131 |
| 15 | Chất lượng và kiểm thử | 11:15 | 00:48 | 112 |
| 16 | Quy trình 3 tuần | 12:03 | 00:54 | 126 |
| 17 | Hạn chế và hướng phát triển | 12:57 | 00:55 | 128 |
| 18 | Cảm ơn ban giám khảo | 13:52 | 00:17 | 40 |
| | **Tổng** | | **14:09** | **1.981** |

---

## Phần 2. Lời nói từng slide

### I. Slide 1 - PokeNexus (00:00 - 00:28)

- **Mục tiêu:** Chào, giới thiệu bản thân và sản phẩm trong một câu, báo trước nội dung.
- **Trên slide có:**
  - Tên sản phẩm, câu mô tả: bách khoa Pokémon và công cụ phân tích đội hình VGC.
  - Một người làm, 18/10 - 08/11/2026.
  - Đội demo 5 Pokémon và ô "Slot 6?".
- **Nói:**

> Em chào ban giám khảo. Em là Nguyễn Quốc Khánh, một mình làm dự án PokeNexus trong ba tuần, từ ngày 18 tháng 10 đến hôm nay.
>
> PokeNexus là bách khoa Pokémon kiêm công cụ phân tích đội hình VGC. Trong mười lăm phút, em trình bày vấn đề, sản phẩm, thuật toán, kiến trúc, kết quả, và demo trực tiếp trên link thật.

### II. Slide 2 - Người chơi VGC đang phải tự nhẩm (00:28 - 01:21)

- **Mục tiêu:** Cho giám khảo thấy nỗi đau thật của người chơi VGC trước khi nói tới giải pháp.
- **Trên slide có:**
  - 324 hệ số tương khắc (18 x 18).
  - Bốn vấn đề: dữ liệu rời rạc, bảng 18 x 18 khó nhớ, không thấy điểm yếu chung, không biết nên thêm ai (1.025 loài).
- **Nói:**

> Người chơi Pokémon, nhất là người chơi đấu đôi VGC, đang phải tra dữ liệu ở nhiều nơi: một trang xem chỉ số, một trang xem tương khắc, một công cụ khác để kiểm tra đội.
>
> Bảng tương khắc có 18 hệ đánh vào 18 hệ, tức 324 hệ số; gặp hệ kép còn phải nhân hai hệ số trong đầu. Ghép sáu Pokémon thành đội, người chơi phải tự nhẩm cả đội cùng yếu hệ nào, vừa lâu vừa dễ sai.
>
> Câu hỏi khó nhất: đội đang hở thì nên thêm Pokémon nào? Có 1.025 loài, không ai thử tay hết được. Đó là bốn vấn đề em chọn giải quyết.

### III. Slide 3 - PokeNexus trong một câu (01:21 - 02:03)

- **Mục tiêu:** Chốt câu giới thiệu và ba giá trị khác biệt.
- **Trên slide có:**
  - Câu giới thiệu: xây đội, thấy ngay lỗ hổng, nhận gợi ý lấp lỗ hổng kèm lý do.
  - Giải thích được, Nhanh (dữ liệu trong bộ nhớ), Chia sẻ được (URL, mã 8 ký tự).
- **Nói:**

> Câu giới thiệu của sản phẩm là: PokeNexus là bách khoa Pokémon kiêm cố vấn chiến thuật: xây đội, thấy ngay lỗ hổng, nhận gợi ý lấp lỗ hổng kèm lý do.
>
> Sản phẩm có ba giá trị khác biệt. Một, giải thích được: mọi kết luận đều có lý do bằng lời và số liệu. Hai, nhanh: phân tích đội chạy trên dữ liệu đã nạp sẵn trong bộ nhớ. Ba, chia sẻ được: bộ lọc và đội nháp nằm trên URL, đội đã lưu có mã chia sẻ tám ký tự, không cần đăng nhập.

### IV. Slide 4 - Ba người dùng, mười user story (02:03 - 02:56)

- **Mục tiêu:** Cho thấy sản phẩm thiết kế từ người dùng và có tiêu chí đo được.
- **Trên slide có:**
  - Ba nhóm: người chơi mới, người chơi VGC (ưu tiên), người thích số liệu.
  - 10 user story: US-01 đến US-07 là MVP, đạt cả 7; US-08 đến US-10 mở rộng, đã làm.
  - Ví dụ tiêu chí US-06: 3 gợi ý khác tổ hợp hệ, mỗi gợi ý ít nhất 1 lý do.
- **Nói:**

> Em thiết kế cho ba nhóm người dùng. Nhóm một là người chơi mới, cần tra cứu nhanh và hiểu tương khắc. Nhóm hai là người chơi VGC, cần kiểm tra lỗ hổng của đội và tìm Pokémon bổ sung; đây là nhóm em ưu tiên nhất. Nhóm ba thích số liệu, muốn so sánh chỉ số trực quan.
>
> Từ ba người này em viết bảy user story cho MVP, mỗi story có tiêu chí chấp nhận đo được, ví dụ US-06: ba gợi ý khác tổ hợp hệ, mỗi gợi ý có ít nhất một lý do. Cả bảy đều đạt. Sau MVP em làm thêm ba story: cây tiến hóa, tốc độ cấp 50, và nhập xuất đội Showdown.

### V. Slide 5 - 10 tính năng trên 8 trang (02:56 - 03:39)

- **Mục tiêu:** Điểm qua toàn bộ tính năng, chuyển sang demo.
- **Trên slide có:**
  - Tra cứu: Tổng quan, Pokédex, Chi tiết, Bảng tương khắc, Bàn Cân (F01-F04, F07).
  - Đội hình: Team Builder và Synergy, Lưu và chia sẻ (F05, F06).
  - Mở rộng: Địa hình, Tốc độ cấp 50, Showdown (F08-F10).
  - 8 trang, 14 endpoint REST dưới /api/v1.
- **Nói:**

> Tổng cộng có mười tính năng trên tám trang. Nhóm tra cứu gồm trang Tổng quan, Pokédex có bộ lọc kết hợp, trang Chi tiết, Bảng tương khắc, và Bàn Cân Sức Mạnh để so sánh hai Pokémon.
>
> Trọng tâm là Team Builder với Synergy Analyzer, kèm lưu và chia sẻ đội. Phần mở rộng em làm sau khi MVP chạy: trang Địa hình có minigame, Bảng tốc độ cấp 50, và nhập xuất Showdown.
>
> Backend có 14 endpoint REST dưới đường dẫn api v1. Bây giờ em demo trực tiếp để ban giám khảo thấy luồng chính.

### VI. Slide 6 - Demo trực tiếp (03:39 - 04:00)

- **Mục tiêu:** Dừng đồng hồ, demo trực tiếp 6 bước trên link thật; mời giám khảo quét QR.
- **Trên slide có:**
  - Kịch bản 6 bước trong đặc tả, Phần 4.
  - Mã QR tới pokenexus.pages.dev để giám khảo dùng thử.
  - Dự phòng: bản local bằng Docker.
- **Nói:**

> Kịch bản demo có sáu bước, đúng như đặc tả: từ trang Tổng quan, lọc Pokédex, so sánh, xây đội năm Pokémon, nhận đề xuất, rồi lưu và mở link chia sẻ ở cửa sổ ẩn danh. Em chuyển sang trình duyệt; nếu mạng chậm, em dùng bản local.

### VII. Slide 7 - Omni-Dex và trang Chi tiết (04:00 - 04:52)

- **Mục tiêu:** Giải thích lại phần tra cứu vừa demo.
- **Trên slide có:**
  - Pokédex: 1.083 dạng mặc định, lọc kết hợp, bộ lọc trên URL; Dragon thế hệ 4 ra 6 kết quả.
  - Chi tiết: lưới phòng thủ 18 hệ, cây tiến hóa (Eevee 8 nhánh), tốc độ cấp 50 của Garchomp 96 / 122 / 169.
- **Nói:**

> Em quay lại slide để giải thích những gì vừa xem. Pokédex mặc định hiện 1.083 dạng thường và vùng miền. Bộ lọc kết hợp hệ, thế hệ, tổng chỉ số và tốc độ tối thiểu; mọi tham số nằm trên URL, nên tải lại hay gửi link vẫn giữ bộ lọc. Lọc Dragon thế hệ 4 ra sáu kết quả có Garchomp.
>
> Trang Chi tiết có sáu chỉ số gốc, lưới phòng thủ 18 hệ, cây tiến hóa đủ nhánh, và tốc độ cấp 50: Garchomp đạt 96, 122 hoặc 169 tùy mức đầu tư, nhanh hơn 88% Pokémon.

### VIII. Slide 8 - Bảng tương khắc và Bàn Cân Sức Mạnh (04:52 - 05:39)

- **Mục tiêu:** Giải thích bảng tương khắc và Bàn Cân Sức Mạnh.
- **Trên slide có:**
  - Ma trận 18 x 18, ô x1 để trống; Fire + Flying chịu Rock x4, miễn nhiễm Ground.
  - Bàn Cân: radar chồng lớp, ba kết luận tự động; Garchomp và Salamence cùng 600, Garchomp nhanh hơn (102 so với 100).
- **Nói:**

> Bảng tương khắc là ma trận 18 nhân 18, hàng là hệ tấn công, cột là hệ phòng thủ. Ô x1 để trống, nên người xem chỉ cần nhìn các ô có màu. Chọn hai hệ phòng thủ thì thấy ngay hệ số hệ kép: Fire cộng Flying chịu Rock x4 và miễn nhiễm Ground.
>
> Bàn Cân Sức Mạnh chồng hai radar sáu chỉ số và tự viết ba kết luận: lợi thế hệ, lợi thế tổng chỉ số, bên nào nhanh hơn. Garchomp và Salamence cùng tổng chỉ số 600, nhưng Garchomp nhanh hơn, 102 so với 100.

### IX. Slide 9 - Team Builder: bản đồ điểm yếu (05:39 - 06:29)

- **Mục tiêu:** Phần giá trị nhất: bản đồ điểm yếu của đội.
- **Trên slide có:**
  - Bản đồ 18 hệ x 5 thành viên của đội demo.
  - Rock: 5 người yếu, không ai kháng, pressure 8, lỗ hổng; Electric pressure 4, lỗ hổng.
  - Điểm đội 20/100.
- **Nói:**

> Đây là phần giá trị nhất. Người dùng chọn tối đa năm Pokémon, slot thứ sáu dành cho đề xuất. Bản đồ điểm yếu có 18 hàng là 18 hệ tấn công, mỗi cột là một thành viên, mỗi ô ghi hệ số sát thương.
>
> Với đội demo gồm Charizard, Gyarados, Dragonite, Talonflame và Volcarona, hàng Rock đỏ rực: cả năm thành viên đều yếu, ba con chịu x4, không ai kháng. Hệ thống gắn nhãn lỗ hổng nghiêm trọng. Electric cũng là lỗ hổng, vì Gyarados chịu x4 mà không ai kháng.
>
> Bên cạnh bản đồ là đánh giá đội bằng lời, độ phủ tấn công và bảng tốc độ cấp 50.

### X. Slide 10 - Synergy: điểm đội tính thế nào (06:29 - 07:38)

- **Mục tiêu:** Chứng minh điểm đội tính được bằng tay, khớp API.
- **Trên slide có:**
  - Bước 1: hệ số thành điểm (x0 +3, x¼ +2, x½ +1, x2 -1, x4 -2).
  - Bước 2: weakness, resistCount, pressure, criticalHole cho từng hệ.
  - Bước 3: teamScore = 100 - 4 x tổng pressure - 8 x số lỗ hổng, kẹp 0-100.
  - Đội demo: 100 - 64 - 16 = 20.
- **Nói:**

> Điểm đội tính qua ba bước. Một, mỗi hệ số đổi thành điểm phòng thủ: miễn nhiễm cộng ba, x0,25 cộng hai, x0,5 cộng một, x2 trừ một, x4 trừ hai.
>
> Hai, với mỗi hệ tấn công: weakness là tổng mức yếu, resistCount là số người kháng, pressure bằng weakness trừ resistCount, không âm. Lỗ hổng nghiêm trọng là khi weakness từ hai trở lên mà không ai kháng.
>
> Ba, điểm đội bằng 100 trừ bốn nhân tổng pressure, trừ tám nhân số lỗ hổng, kẹp trong khoảng 0 đến 100.
>
> Đội demo có Rock pressure 8, Electric 4, bốn hệ khác mỗi hệ 1, tổng 16, và hai lỗ hổng: 100 trừ 64 trừ 16 bằng 20, đúng số API trả về. Thuật toán chỉ duyệt 18 hệ nhân tối đa sáu người, không truy vấn cơ sở dữ liệu.

### XI. Slide 11 - Đề xuất slot 6 theo lối chơi (07:38 - 08:40)

- **Mục tiêu:** Giải thích cách đề xuất slot 6 và trọng số theo lối chơi.
- **Trên slide có:**
  - Ứng viên: dạng thường hoặc vùng miền, đã tiến hóa hoàn toàn, chưa có trong đội.
  - Bốn thành phần: Phòng thủ, Độ phủ, Vai trò, Sức mạnh.
  - Trọng số Cân bằng 40/20/25/15; Trâu bò 50% phòng thủ; Tấn công nhanh và Trick Room lọc tốc độ.
  - 596 ứng viên mặc định, 484 khi loại huyền thoại, 165 khi thêm Trick Room.
- **Nói:**

> Từ chỗ hở đó, Recommendation Engine chấm mọi ứng viên trong bộ nhớ: dạng thường hoặc vùng miền, đã tiến hóa hoàn toàn, chưa có trong đội.
>
> Mỗi ứng viên có bốn thành phần. Phòng thủ: kháng đúng hệ đội đang hở thì được thưởng theo pressure, yếu thêm hệ thì bị phạt. Độ phủ: số hệ đội chưa đánh được mà ứng viên đánh được. Vai trò: chỉ số có bù chỗ thiếu của đội không. Sức mạnh: tổng chỉ số.
>
> Bốn giá trị được chuẩn hóa min-max rồi nhân trọng số của lối chơi: Cân bằng là 40, 20, 25, 15; Trâu bò dồn 50% vào phòng thủ; Tấn công nhanh và Trick Room còn lọc theo tốc độ gốc. Cuối cùng lấy ba ứng viên điểm cao nhất, khác tổ hợp hệ, kèm lý do.

### XII. Slide 12 - Đội demo: 20 lên 48 nhờ Excadrill (08:40 - 09:29)

- **Mục tiêu:** Áp thuật toán vào đội demo: 20 lên 48 nhờ Excadrill.
- **Trên slide có:**
  - Excadrill (Ground, Steel), 85,1 điểm: kháng Rock x0,25, miễn nhiễm Electric, cảnh báo yếu Water.
  - Sau khi thêm: Rock pressure 7, Electric 3, hết lỗ hổng; tổng pressure 13; điểm 48.
  - Ví dụ 5 của đặc tả, có unit test.
- **Nói:**

> Áp vào đội demo, bật ô loại huyền thoại, còn 484 ứng viên, đề xuất số một là Excadrill, hệ Ground và Steel, 85,1 điểm. Excadrill kháng Rock x0,25 và miễn nhiễm Electric, đúng hai lỗ hổng của đội. Hệ thống cũng cảnh báo: thêm Excadrill thì đội yếu Water nhiều hơn.
>
> Thêm Excadrill vào slot sáu: Rock còn pressure 7, Electric còn 3, hết lỗ hổng nghiêm trọng. Tổng pressure 13, điểm đội bằng 100 trừ 52, bằng 48. Đây là ví dụ số năm trong đặc tả, có unit test giữ đáp án.

### XIII. Slide 13 - Dữ liệu offline từ CSV PokéAPI (09:29 - 10:19)

- **Mục tiêu:** Giải thích nguồn dữ liệu và vì sao chạy offline.
- **Trên slide có:**
  - CSV PokéAPI cố định commit, IngestionRunner, MySQL 8.4, bộ nhớ.
  - 18 hệ, 324 hệ số, 1.025 loài, 1.351 dạng, 484 liên kết tiến hóa; nạp trong 3,1 s.
  - Ba phương án lấy dữ liệu, chọn nạp CSV một lần.
- **Nói:**

> Ứng dụng không gọi API của PokéAPI lúc chạy. Em dùng bộ CSV công khai của PokéAPI, cố định ở một commit để số liệu và test giống nhau trên mọi máy. Ingestion ghi vào MySQL bằng JDBC batch trong một transaction, nạp đủ trong 3,1 giây: 18 hệ, 324 hệ số, 1.025 loài, 1.351 dạng.
>
> Em tách loài và dạng: Vulpix thường là hệ Fire, Vulpix Alola là hệ Ice. ADR 0002 ghi lý do: so với gọi API lúc chạy, cách này nhanh, không bị giới hạn tần suất, và demo được khi mạng yếu.

### XIV. Slide 14 - Kiến trúc và hosting (10:19 - 11:15)

- **Mục tiêu:** Trình bày kiến trúc ba lớp và nơi deploy.
- **Trên slide có:**
  - Frontend: React SPA trên Cloudflare Pages.
  - Backend: Spring Boot 4.1, Java 25, Docker trên Render.
  - Database: MySQL 8.4 trên Aiven, qua TLS.
  - Package theo tính năng; Synergy chạy trong bộ nhớ.
- **Nói:**

> Kiến trúc có ba lớp. Frontend React, TypeScript, Vite chạy trên Cloudflare Pages, mỗi trang là một chunk tải lười. Backend Java 25, Spring Boot 4.1 chạy Docker trên Render. MySQL 8.4 trên Aiven, kết nối TLS.
>
> Backend chia package theo tính năng: pokedex, typechart, synergy, team, cùng ingestion và common. Luồng một chiều Controller, Service, Repository, DTO là record.
>
> Điểm quan trọng: khi khởi động, backend nạp bảng tương khắc và hồ sơ của 1.351 dạng vào bộ nhớ, nên Synergy không truy vấn cơ sở dữ liệu. Kế hoạch ban đầu là Railway, nhưng Railway ngừng nhận đăng ký mới, nên ngày 2 tháng 11 em chuyển sang Render và Aiven mà không phải sửa code.

### XV. Slide 15 - Chất lượng và kiểm thử (11:15 - 12:03)

- **Mục tiêu:** Chứng minh chất lượng bằng số test và kiểm chứng.
- **Trên slide có:**
  - 142 unit test backend, 57 integration test (Testcontainers MySQL), 352 test frontend, 2 job CI.
  - 5/5 ví dụ có đáp án của đặc tả có unit test.
  - Script nghiệm thu trên link thật; p95 phân tích đội 7,2 ms.
- **Nói:**

> Backend có 142 unit test và 57 integration test chạy MySQL thật bằng Testcontainers; frontend có 352 test. CI chạy hai job trên mỗi Pull Request, và main đang xanh.
>
> Năm ví dụ có đáp án trong đặc tả đều có unit test, đáp án tính tay chứ không lấy từ code. Kịch bản demo chạy hai lần liên tiếp bằng script Chrome ở local và đủ sáu bước qua API production; em có thêm một script nghiệm thu chạy trên link thật. p95 của phân tích đội là 7,2 mili giây, mục tiêu dưới 50.

### XVI. Slide 16 - Quy trình 3 tuần (12:03 - 12:57)

- **Mục tiêu:** Cho thấy làm một mình vẫn có quy trình.
- **Trên slide có:**
  - Timeline 18/10 - 08/11 với các checkpoint.
  - 41 Issue, 50 Pull Request đã merge, 61 commit, 9 ADR.
  - 62% xây dựng, 38% kiểm thử, sửa lỗi, tài liệu.
  - Dùng Claude Code như cộng sự lập trình.
- **Nói:**

> Dù làm một mình, em vẫn theo quy trình của một nhóm nhỏ. Lộ trình lùi từ hạn 8 tháng 11, chia Epic, Feature, Task, mỗi task tối đa một ngày, có đầu vào, đầu ra, cách kiểm tra; 62% thời gian để xây dựng, 38% để kiểm thử, sửa lỗi, tài liệu.
>
> Mọi thay đổi đi qua Issue và Pull Request có CI: 41 Issue, 50 Pull Request đã merge, chín ADR cho các quyết định lớn. Từ ngày 5 tháng 11 em đóng băng tính năng.
>
> Em dùng Claude Code như cộng sự lập trình; em quyết định phạm vi, duyệt kết quả và kiểm lại số liệu bằng API thật.

### XVII. Slide 17 - Hạn chế và hướng phát triển (12:57 - 13:52)

- **Mục tiêu:** Thẳng thắn về hạn chế, bài học và hướng tiếp theo.
- **Trên slide có:**
  - Hạn chế: chỉ theo hệ, điểm đề xuất tương đối, mặc định nghiêng về Paradox, hệ số phạt cố định, cold start.
  - Hướng phát triển: ngắn hạn, trung hạn, dài hạn.
  - Bài học: deploy sớm một bản tối thiểu rồi mới mở rộng.
- **Nói:**

> Hạn chế lớn nhất là phân tích mới chỉ theo hệ, chưa có chiêu thức, Ability, vật phẩm; Pokémon có Levitate vẫn bị tính là yếu Ground. Điểm đề xuất là tương đối, và hệ số phạt 4 và 8 chưa hiệu chỉnh bằng dữ liệu trận đấu. Hosting miễn phí có cold start khoảng hai phút rưỡi đến ba phút; em đã thêm lịch gọi health mỗi mười phút.
>
> Bài học: em làm tính năng mở rộng trước khi deploy, nên lỗi chỉ có trên production lộ ra muộn. Lần sau em sẽ deploy sớm một bản tối thiểu. Hướng tiếp theo là chiêu thức và Ability trong phân tích, E2E tự động trong CI, và dữ liệu meta VGC để hiệu chỉnh trọng số.

### XVIII. Slide 18 - Cảm ơn ban giám khảo (13:52 - 14:09)

- **Mục tiêu:** Cảm ơn, để lại link, mời đặt câu hỏi.
- **Trên slide có:**
  - Link sản phẩm, mã nguồn, API.
  - Lời mời đặt câu hỏi.
- **Nói:**

> Sản phẩm đang chạy ở pokenexus chấm pages chấm dev, mã nguồn ở GitHub Nha-Cong-Dong, PokeNexus. Em cảm ơn ban giám khảo đã lắng nghe. Em sẵn sàng trả lời câu hỏi, kể cả câu hỏi chi tiết về code.

---

## Phần 3. Lời dẫn khi demo (slide 6, không tính giờ)

### I. Chuẩn bị

- 15-30 phút trước giờ: mở `https://pokenexus-api-s6g6.onrender.com/api/v1/health`, chờ tới khi trả `"status":"UP"` (cold start có thể mất vài phút).
- Mở sẵn: tab trang Tổng quan `https://pokenexus.pages.dev`, một cửa sổ ẩn danh để mở link chia sẻ.
- Dự phòng: mạng chậm hoặc mất mạng thì chạy bản local `docker compose --profile app up -d --build`, chuẩn bị sẵn trước giờ.
- Khi ở slide 6, mời giám khảo quét mã QR để tự dùng thử trên điện thoại trong lúc xem demo.

### II. Sáu bước

| Bước | Màn hình | Lời dẫn |
|---|---|---|
| 1 | Trang Tổng quan | Đây là trang Tổng quan, hero là vỏ Pokédex với khung cảnh vùng đất. Em bấm "Mở Pokédex". |
| 2 | Pokédex, Chi tiết | Em chọn hệ Dragon và thế hệ 4: ra 6 kết quả, URL đổi theo bộ lọc. Em mở Garchomp: 6 chỉ số, lưới phòng thủ 18 hệ, tốc độ cấp 50. |
| 3 | Bàn Cân | Em bấm "So sánh" và chọn Salamence: hai radar chồng lớp, kết luận "Garchomp nhanh hơn (102 so với 100)". |
| 4 | Xây đội | Em thêm Charizard, Gyarados, Dragonite, Talonflame, Volcarona. Hàng Rock gắn nhãn "Lỗ hổng", điểm đội 20. |
| 5 | Đề xuất | Em bật ô "Loại huyền thoại, thần thoại và Paradox": đề xuất số 1 là Excadrill, 85 điểm phù hợp. Em bấm "Thêm vào đội": điểm đội lên 48, Rock hết lỗ hổng. |
| 6 | Lưu và chia sẻ | Em bấm "Lưu đội", sao chép link, mở ở cửa sổ ẩn danh: đúng 6 thành viên, cùng điểm 48. |

- Bước 5: giao diện làm tròn điểm phù hợp thành 85; API trả 85,1, là số trên slide 12.
- Nếu một bước lỗi: nói ngắn gọn "em chuyển sang bản local", không dừng lại sửa trước giám khảo.

---

## Phần 4. Chuẩn bị cho phần hỏi đáp

### I. Các con số phải nói đúng

| Con số | Ý nghĩa | Slide |
|---|---|---|
| 324 | Hệ số tương khắc 18 x 18 | 2 |
| 1.025 loài, 1.351 dạng, 1.083 dạng mặc định | Dữ liệu PokéAPI | 7, 13 |
| 20 lên 48 | Điểm đội demo trước và sau khi thêm Excadrill | 9, 10, 12 |
| 85,1 | Điểm phù hợp của Excadrill | 12 |
| 596, 484, 165 | Số ứng viên: mặc định, loại huyền thoại, thêm Trick Room | 11 |
| 142, 57, 352 | Unit test backend, integration test, test frontend | 15 |
| 7,2 ms | p95 phân tích đội, mục tiêu dưới 50 ms | 15 |
| 41, 50, 9 | Issue, Pull Request đã merge, ADR | 16 |

### II. Câu hỏi hay gặp

- Bảng hỏi đáp tổng quát có trả lời mẫu: [PokeNexus-LuyenTap.md](PokeNexus-LuyenTap.md), Phần 8.
- Schema, API, trọng số PlayStyle, bảo mật, hiệu năng, accessibility, các quyết định kiến trúc, lỗi sau triển khai, kết quả so với tiêu chí: [PokeNexus-PhuLuc.md](PokeNexus-PhuLuc.md).
- Hỏi về phần chưa đạt: LCP trên link thật chỉ đạt 1/9 route vì ảnh hero tải sau JavaScript; đã biết cách sửa, chưa làm vì đóng băng tính năng (PhuLuc, Phần 1).
- Không biết câu trả lời: nói thật là chưa đo hoặc chưa làm, nêu cách sẽ kiểm tra; không đoán số.

---

## Phần 5. Tập luyện

### I. Cách tập

- Lần 1: đọc to Phần 2 với đồng hồ bấm giờ, ghi thời gian thật từng slide cạnh cột "Bắt đầu" ở Phần 1, mục III. Slide nào lệch quá 15 giây thì sửa câu, không nói nhanh hơn.
- Lần 2: chiếu `slides.html` toàn màn hình, nói không nhìn giấy, chỉ dùng phím `N` khi quên ý; có demo thật ở slide 6.
- Tổng duyệt 2 lần trên link thật (T407), mỗi lần đúng 15 phút, lệch không quá 1 phút.

### II. Checklist sáng 08/11

- [ ] Gọi `/api/v1/health` để đánh thức backend, chờ `UP`.
- [ ] Mở `slides.html` trên máy chiếu, bấm `F`, kiểm tra slide 6 quét được mã QR bằng điện thoại.
- [ ] Mở sẵn tab trang Tổng quan và cửa sổ ẩn danh.
- [ ] Bản local đã chạy sẵn để dự phòng.
- [ ] Sạc laptop, mạng dự phòng (hotspot).
