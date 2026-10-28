# PokeNexus - Design System và UI Guidelines

- Phiên bản: 0.8 (cập nhật 2026-10-29; bộ chuyển động theo bản thiết kế ngày 2026-10-24: token `--animate-*`, `Reveal`, `staggerDelay`; trang Địa hình; nền khung cảnh nhiều ảnh theo [ADR 0006](adr/0006-animated-scene-backdrops.md))
- Phạm vi: định hướng thẩm mỹ, token, font, ảnh khung cảnh, component, pattern, bố cục trang và accessibility cho frontend.
- Theme: **light là mặc định và bắt buộc ở MVP**. Token đã định nghĩa sẵn cặp light/dark; dark mode là mức Could, chưa xếp lịch ([roadmap.md](roadmap.md), Phần 2).
- Mọi giá trị màu dùng cho chữ và thành phần giao diện đã được kiểm tra tỷ lệ tương phản theo công thức WCAG 2.x bằng script ngày 2026-10-24.
- Thay đổi so với 0.2: bỏ font Be Vietnam Pro, đổi bảng màu thương hiệu, thêm trang Tổng quan, thêm nền khung cảnh theo vùng đất. Các mục cần đồng bộ sang tài liệu khác liệt kê ở Phần 11.
- Thay đổi so với 0.3: Phần 3 trỏ thẳng tới `src/styles/index.css` và `src/main.tsx`, không chép lại mã nguồn.
- Thay đổi so với 0.7: bỏ giới hạn "một khoảnh khắc chuyển động mỗi trang"; dùng bộ chuyển động của bản thiết kế hi-fi ngày 2026-10-24 (vào trang, hiện khi cuộn tới, đổi dữ liệu) theo yêu cầu chủ dự án ngày 2026-10-29 (T315). Phần 2, mục VII và Phần 7, mục II cập nhật.
- Thay đổi so với 0.6: thêm bố cục trang Địa hình (Phần 7, mục II.2) và quy tắc ghi đè màu nút bằng modifier `!`.
- Thay đổi so với 0.5: mỗi khung cảnh có bộ 1-5 ảnh 1920 px; nền hero chuyển ảnh mỗi 12 giây, phóng chậm và có lớp hạt CSS, tắt khi `prefers-reduced-motion`; nới quy tắc nội dung ảnh; tiêu đề trên ảnh đặt trong tấm nền `scrim` 75% thay cho lớp phủ rộng; cho phép xóa HUD, người, Pokémon thừa bằng công cụ kèm bước kiểm duyệt dấu vết AI (Phần 4, mục I); hero Tổng quan cao bằng màn hình; Team Builder rộng tối đa 100 rem.
- Thay đổi so với 0.4: chữ số Pixelify Sans dễ đọc nhầm (5 và 8 giống S, 2 giống 8, 7 giống ⅂; chụp màn hình ngày 2026-10-28), nên mọi con số chuyển sang Nunito 800 `tabular-nums`, token `text-pixel*` đổi tên `text-num*`; Pixelify Sans chỉ còn cho nhãn "HP". Khung cảnh có bảng 4 màu và nền thân trang nhuộm theo khung cảnh (Phần 2, mục VI).

---

## Phần 1. Định hướng thẩm mỹ

### I. Ý tưởng chủ đạo: "Chiếc Pokédex mở ra thế giới"

- Người dùng cầm một chiếc Pokédex: phần vỏ (header, nút, khung) mang màu đỏ Pokédex và vàng; màn hình bên trong mở ra khung cảnh 3D của vùng đất nơi Pokémon sinh sống.
- Mỗi trang có ba lớp, từ sau ra trước:

| Lớp | Vai trò | Ví dụ |
|---|---|---|
| Khung cảnh (scene) | Tạo cảm xúc, cho biết "đang ở đâu" | Núi lửa sau Charizard, biển khơi sau Gyarados |
| Vỏ Pokédex | Định hướng, điều hướng, hành động | Header đỏ, nút bấm có gờ như nút phần cứng |
| Bảng dữ liệu | Truyền đạt số liệu, luôn đọc được | Card chỉ số, lưới phòng thủ, heatmap trên nền đặc |

### II. Nguyên tắc

| Nguyên tắc | Ý nghĩa | Ví dụ áp dụng |
|---|---|---|
| Dữ liệu trước, trang trí sau | Số liệu và kết luận phải đọc được trong 3 giây | Khung cảnh chỉ nằm sau tiêu đề và lề; chỉ số đặt trên `surface` đặc |
| Ảnh làm nền, chữ không đè lên ảnh trần | Chữ trên ảnh luôn có lớp phủ (scrim) bảo đảm tương phản | Tên Pokémon trên khung cảnh nằm trên dải scrim tối tối thiểu 65% |
| Màu luôn đi kèm chữ | Không truyền đạt thông tin chỉ bằng màu | Nhãn hệ ghi tên hệ; ô hệ số ghi `x2`, `x½` |
| Một nguồn token | Không viết mã màu, font, URL ảnh trực tiếp trong component | Dùng `bg-type-fire`, `font-display`, `sceneUrl('volcano', 1600)` |
| Mỗi trang một điểm nhấn | Chỉ một yếu tố "táo bạo" mỗi trang, phần còn lại tiết chế | Trang So sánh: màn hình đối đầu chia đôi; không thêm hiệu ứng khác |
| Mobile trước | Thiết kế ở 375 px rồi mở rộng | Bộ lọc Omni-Dex là ngăn kéo trên mobile, cột bên trái trên desktop |

### III. Tránh giao diện "đúc khuôn"

| Không làm | Làm thay thế |
|---|---|
| Gradient tím, chàm làm nền trang trí | Ảnh khung cảnh thật từ game; màu phẳng của vỏ Pokédex |
| Lưới card giống hệt nhau, cùng bóng mờ xám | Card nhuộm theo màu hệ chính, đế bóng dưới sprite, bóng đặc lệch xuống (Phần 2, mục VII) |
| Nhãn chữ in hoa giãn chữ trên mọi tiêu đề | Tiêu đề viết hoa chữ cái đầu; không dùng nhãn phụ phía trên tiêu đề nếu không mang thông tin |
| Hiệu ứng tùy hứng, mỗi chỗ một kiểu, chuyển động chặn thao tác | Một bộ chuyển động dùng chung theo bản thiết kế (Phần 2, mục VII): chạy một lần khi vào trang, khi cuộn tới hoặc khi dữ liệu đổi; không chặn bấm; tắt hết khi giảm chuyển động |
| Ảnh minh họa do AI tạo, icon emoji | Ảnh chụp từ game 3D, sprite và artwork chính thức qua PokéAPI (được xóa HUD, người thừa theo Phần 4, mục I), icon SVG nét đơn |
| Câu chữ chung chung ("Khám phá ngay hôm nay!") | Giọng của một Trainer, cụ thể: "Garchomp hở hệ Ice x4. Thêm một Pokémon hệ Steel để che lại." |
| Số thống kê lớn kèm nhãn nhỏ xếp hàng ngang | Số liệu nằm trong câu của hộp thoại hoặc trong màn hình Pokédex |

### IV. Cá nhân hóa

- **Cá tính từng trang:** mỗi trang có khung cảnh, điểm nhấn và giọng văn riêng (Phần 7, mục II).
- **Pokémon đồng hành (Could):** người dùng chọn 1 Pokémon làm "đồng hành" ở trang Tổng quan hoặc trang chi tiết. Sprite đồng hành hiện ở góc header, khung cảnh của nó làm nền trang Tổng quan ở lần truy cập sau.
  - Lưu ID trong `localStorage` (khóa `pn.partnerId`). Không cần đăng nhập, không gọi API mới; dữ liệu lấy từ `GET /api/v1/pokemon/{idOrName}` đã có.
  - Chưa chọn thì dùng khung cảnh mặc định của trang.

---

## Phần 2. Design token

### I. Màu thương hiệu và ngữ nghĩa

| Token | Light | Dark (Could) | Dùng cho | Tương phản (light / dark) |
|---|---|---|---|---|
| `bg` | `#EEF3F9` | `#0D1424` | Nền trang (xanh nhạt như màn hình Pokédex) | |
| `surface` | `#FFFFFF` | `#141C2F` | Card, bảng dữ liệu, dialog | |
| `surface-muted` | `#E3EAF3` | `#1D2840` | Nền phụ, hàng xen kẽ | |
| `border` | `#D3DCE8` | `#2C3A57` | Viền trang trí, đường phân cách | Không yêu cầu |
| `border-strong` | `#5E6C8A` | `#7D8BA8` | Viền ô nhập, checkbox | 5.27 / 4.96 trên `surface` |
| `ink` | `#16213E` | `#EAF0F8` | Chữ chính, viền hộp thoại | 15.89 / 14.81 trên `surface` |
| `ink-muted` | `#4A5672` | `#A7B3CA` | Chữ phụ, nhãn | 7.33 / 8.04 trên `surface` |
| `primary` | `#1F57B8` | `#7FA8F0` | Nút chính, link, series trái của radar | 6.74 / 7.08 trên `surface` |
| `primary-hover` | `#17448F` | `#A5C2F5` | Hover nút chính, gờ dưới nút | |
| `on-primary` | `#FFFFFF` | `#0D1424` | Chữ trên nền `primary` | 6.74 / 7.67 |
| `dex-red` | `#C8102E` | `#C8102E` | Vỏ Pokédex: header, khung trang Tổng quan | Chữ trắng 5.88 |
| `dex-red-hover` | `#A50D26` | `#A50D26` | Hover mục điều hướng trên header | Chữ trắng 7.82 |
| `dex-yellow` | `#FFD23F` | `#FFD23F` | Nút kêu gọi chính ở trang Tổng quan, gạch chân mục điều hướng đang chọn | Chữ `#16213E` 11.01 |
| `accent` | `#C2410C` | `#FB923C` | Series phải của radar | 5.18 / 7.50 trên `surface` |
| `success` | `#15803D` | `#4ADE80` | Điểm đội tăng, lưu thành công | 5.02 / 9.74 |
| `warning` | `#B45309` | `#FBBF24` | Cảnh báo nhẹ | 5.02 / 10.17 |
| `danger` | `#B42318` | `#F87171` | Lỗi, lỗ hổng nghiêm trọng | 6.57 / 6.14 |
| `focus-ring` | `#1F57B8` | `#A5C2F5` | Vòng focus 2 px, cách 2 px; trên ảnh thêm viền trắng 2 px bên ngoài | |

- `dex-red` và `dex-yellow` chỉ dùng cho vỏ (header, nút kêu gọi, khung trang Tổng quan), không dùng để báo trạng thái. Trạng thái lỗi dùng `danger` kèm chữ hoặc icon, để không nhầm với màu vỏ.
- `dex-yellow` không dùng làm màu chữ hay viền trên nền trắng (1.44:1); chỉ dùng làm nền có chữ `ink`.
- Cặp màu radar `primary` (xanh dương) và `accent` (cam) phân biệt được với người mù màu đỏ-lục.
- Màu `dex-red`, `dex-yellow` lấy cảm hứng từ Pokédex trong game nhưng không sao chép logo hay hình Poké Ball ([assets.md](assets.md), Phần 7).

### II. Màu 18 hệ

| Hệ | Nền | Chữ | Tương phản | Hệ | Nền | Chữ | Tương phản |
|---|---|---|---|---|---|---|---|
| normal | `#A8A77A` | dark | 7.16 | flying | `#A98FF3` | dark | 6.68 |
| fire | `#EE8130` | dark | 6.60 | psychic | `#F95587` | dark | 5.64 |
| water | `#6390F0` | dark | 5.73 | bug | `#A6B91A` | dark | 8.09 |
| electric | `#F7D02C` | dark | 11.84 | rock | `#B6A136` | dark | 6.88 |
| grass | `#7AC74C` | dark | 8.53 | ghost | `#735797` | white | 5.93 |
| ice | `#96D9D6` | dark | 11.14 | dragon | `#6F35FC` | white | 5.85 |
| fighting | `#C22E28` | white | 5.65 | dark | `#705746` | white | 6.69 |
| poison | `#A33EA1` | white | 5.58 | steel | `#B7B7CE` | dark | 9.02 |
| ground | `#E2BF65` | dark | 10.03 | fairy | `#D685AD` | dark | 6.60 |

- "dark" là `#111827`, "white" là `#FFFFFF`. Mọi cặp đạt tối thiểu 4.5:1 (WCAG AA cho chữ thường).
- Bảng màu nền là bảng màu hệ phổ biến trong cộng đồng; giữ nguyên ở cả light và dark để người chơi nhận ra ngay.
- Nguồn duy nhất trong code: biến `--color-type-*` ở `src/styles/index.css`; `src/lib/pokemonTypes.ts` chỉ ánh xạ tên hệ sang tên class.
- Nền nhạt nhuộm theo hệ (hàng ở chế độ danh sách của Omni-Dex) tạo bằng utility `type-tint`: `color-mix(in oklab, var(--color-type-<hệ>) 22%, var(--color-surface))`. Lớp nhuộm này chỉ là trang trí; chữ đặt lên phải là `ink` (tương phản tối thiểu 10:1 vì nền gần trắng).

#### 1. Màu hệ đậm (nền card Pokémon)

| Hệ | Nền đậm | Chữ trắng | Hệ | Nền đậm | Chữ trắng |
|---|---|---|---|---|---|
| normal | `#777643` | 4.71 | flying | `#7D52F9` | 4.72 |
| fire | `#BF5202` | 4.75 | psychic | `#E60046` | 4.72 |
| water | `#2468FA` | 4.73 | bug | `#6C7A08` | 4.75 |
| electric | `#8A6F00` | 4.82 | rock | `#84731C` | 4.72 |
| grass | `#43811E` | 4.78 | ghost | `#735797` | 5.93 |
| ice | `#23807B` | 4.72 | dragon | `#6F35FC` | 5.85 |
| fighting | `#C22E28` | 5.65 | dark | `#705746` | 6.69 |
| poison | `#A33EA1` | 5.58 | steel | `#6D6DA9` | 4.76 |
| ground | `#926D10` | 4.75 | fairy | `#CC3781` | 4.74 |

- Card Pokémon ở Omni-Dex dùng nền đậm theo hệ ở slot 1, chữ trắng; 18 cặp đạt tối thiểu 4.5:1 (đo bằng script ngày 2026-10-25).
- Token `--color-type-<hệ>-deep`. Utility `type-card` tô nền bằng màu đậm và tạo bóng đặc `color-mix(in oklab, <màu đậm> 55%, ink)` bên dưới.
- `pokemonTypes.ts` có `typeScopeClassName(type)` gán hai biến `--type-base`, `--type-deep` cho phần tử; `type-card` và `type-tint` đọc hai biến này, nên component không cần biết mã màu.

### III. Thang hệ số sát thương

| Hệ số | Nhãn hiển thị | Nền | Chữ | Tương phản | Ý nghĩa |
|---|---|---|---|---|---|
| 0 | `x0` | `#1E293B` | `#FFFFFF` | 14.63 | Miễn nhiễm |
| 0.25 | `x¼` | `#1D4ED8` | `#FFFFFF` | 6.70 | Kháng mạnh |
| 0.5 | `x½` | `#93C5FD` | `#0F172A` | 9.90 | Kháng |
| 1 | `x1` | `#F1F5F9` | `#475569` | 6.92 | Trung tính |
| 2 | `x2` | `#FDBA74` | `#0F172A` | 10.59 | Yếu |
| 4 | `x4` | `#C2410C` | `#FFFFFF` | 5.18 | Rất yếu |

- Thang phân kỳ xanh dương - cam, không dùng xanh lục - đỏ, để người mù màu đỏ-lục vẫn phân biệt được.
- Ô x4 và x0 thêm chữ đậm (`font-extrabold`) để nổi bật hơn ô x2 và x½.

### IV. Thang mức hở của đội (pressure)

| Mức | Điều kiện | Nền | Chữ | Tương phản |
|---|---|---|---|---|
| An toàn | `pressure = 0` | `#F1F5F9` | `#0F172A` | 16.30 |
| Thấp | 1-2 | `#FED7AA` | `#0F172A` | 13.19 |
| Trung bình | 3-4 | `#FB923C` | `#0F172A` | 7.89 |
| Cao | từ 5 trở lên | `#B91C1C` | `#FFFFFF` | 6.47 |

- Hệ có `criticalHole = true` có thêm nhãn "Lỗ hổng" (nền `danger`, chữ trắng, tương phản 6.57) và viền trái 4 px, không chỉ dựa vào màu nền. Không đặt chữ màu `danger` trực tiếp trên nền pressure vì tương phản dưới 4.5:1.

### V. Typography

#### 1. Ba họ font

| Vai trò | Font | Gói `@fontsource` | Weight | Dùng cho |
|---|---|---|---|---|
| Display | **Dela Gothic One** | `@fontsource/dela-gothic-one` | 400 (duy nhất) | Tiêu đề trang (`<h1>`), tên Pokémon ở trang chi tiết, tiêu đề hero trang Tổng quan, logo chữ PokeNexus |
| Text | **Nunito** (variable) | `@fontsource-variable/nunito` | 400-800 | Nội dung, nút, nhãn, bảng, tiêu đề section và card |
| Pixel | **Pixelify Sans** (variable) | `@fontsource-variable/pixelify-sans` | 700 | Chỉ nhãn trang trí "HP" trên thanh điểm đội; không dùng cho con số |

- Lý do chọn:
  - Dela Gothic One: nét đậm, góc mềm, mang chất poster game Nhật; có đủ dấu tiếng Việt.
  - Nunito: chữ tròn, thân thiện như font giao diện trong game Pokémon 3D, đọc tốt ở 14-16 px; chữ số mặc định cùng độ rộng nên cột số thẳng hàng mà không cần `tabular-nums`.
  - Pixelify Sans: gợi màn hình Game Boy. Từ bản 0.5 không dùng cho con số vì chữ số dễ đọc nhầm; con số (số Pokédex, BST, chỉ số, điểm, chiều cao, cân nặng) dùng Nunito 800 kèm `tabular-nums`.
- Đã kiểm tra ngày 2026-10-24 (Fontsource API, npm registry, đọc bảng glyph bằng fontTools):
  - Ba gói đều ở bản 5.3.0, giấy phép SIL OFL 1.1.
  - Dela Gothic One (subset `latin`, `latin-ext`, `vietnamese`) có đủ 134 ký tự tiếng Việt có dấu đã thử.
  - Nunito có subset `vietnamese`.
  - Pixelify Sans **không có subset `vietnamese`**; có đủ `#`, chữ số, `x`, `½`, `¼`, `%`, `+`, `-`. Chữ số của Pixelify Sans **không cùng độ rộng**.

#### 2. Thang cỡ chữ

| Token | Cỡ / line-height | Font | Weight | Dùng cho |
|---|---|---|---|---|
| `text-display-xl` | 36 / 40 px (mobile), 56 / 60 px (từ `lg`) | Display | 400 | Tiêu đề hero trang Tổng quan |
| `text-display` | 28 / 34 px (mobile), 40 / 44 px (từ `lg`) | Display | 400 | `<h1>` mỗi trang, tên Pokémon ở trang chi tiết |
| `text-xl` | 20 / 28 px | Text | 800 | Tiêu đề section |
| `text-lg` | 18 / 26 px | Text | 800 | Tiêu đề card, tên Pokémon trong card |
| `text-base` | 16 / 24 px | Text | 400, 600 | Nội dung chính |
| `text-sm` | 14 / 20 px | Text | 500, 700 | Chữ phụ, ô bảng, nhãn form, nút `sm` |
| `text-xs` | 12 / 16 px | Text | 700 | Nhãn hệ cỡ nhỏ, chú thích |
| `text-num-lg` | 32 / 32 px | Text, `tabular-nums` | 800 | Điểm đội, BST ở trang chi tiết, điểm phù hợp, số hệ phủ |
| `text-num` | 16 / 16 px | Text, `tabular-nums` | 800 | BST trên card, giá trị cạnh `StatBar` |

#### 3. Quy tắc

- Dela Gothic One chỉ có weight 400: không gắn `font-bold` cho chữ display (trình duyệt sẽ làm đậm giả, vỡ nét). Không dùng cho chữ dưới 24 px hoặc đoạn văn.
- Pixelify Sans không dùng cho con số, chữ tiếng Việt, tên Pokémon, câu văn. Mọi con số dùng font Text kèm `tabular-nums` để cột số thẳng hàng.
- Ô hệ số (`MultiplierCell`) dùng font Text 700 để `½`, `¼` hiển thị đồng nhất với nhãn khác trong bảng.
- Tiêu đề viết theo kiểu câu (sentence case); không viết hoa toàn bộ. Nhãn hệ viết hoa chữ cái đầu (`Fire`).
- Đoạn văn dài tối đa 70 ký tự mỗi dòng (`max-w-prose`).
- Chỉ import subset cần dùng để build không kéo theo subset tiếng Nhật của Dela Gothic One (Phần 3, mục II).
- Dự phòng khi font chưa tải: Display và Text dùng `ui-rounded, ui-sans-serif, system-ui, sans-serif`; Pixel dùng `ui-monospace, monospace`.

### VI. Khung cảnh (scene)

#### 1. Danh sách khung cảnh

| Mã scene | Tên hiển thị | Dùng cho | Trời / chân trời / mặt đất / nhấn |
|---|---|---|---|
| `grassland` | Đồng cỏ | Hệ Normal; trang Omni-Dex | `#9FD3F5` / `#D8EFC6` / `#7FBF5A` / `#F2C94C` |
| `forest` | Rừng rậm | Hệ Grass, Bug | `#A8D5C2` / `#5E9C6A` / `#2F6B3A` / `#A6B91A` |
| `sea` | Biển khơi | Hệ Water | `#8ACFF2` / `#D6F0FB` / `#1F6FB2` / `#6390F0` |
| `volcano` | Núi lửa | Hệ Fire | `#F7B267` / `#F25C3B` / `#5A2219` / `#EE8130` |
| `power-plant` | Nhà máy điện | Hệ Electric, Steel | `#C9D3DE` / `#F3E28A` / `#4F5967` / `#F7D02C` |
| `snowfield` | Núi tuyết | Hệ Ice | `#CFE8F7` / `#F4FBFF` / `#A9C9DE` / `#96D9D6` |
| `mountain` | Vách núi đá | Hệ Fighting, Rock | `#B9CFE0` / `#E2D6C2` / `#8A7357` / `#B6A136` |
| `desert` | Sa mạc | Hệ Ground | `#F7D9A8` / `#FBE7C0` / `#C8964F` / `#E2BF65` |
| `swamp` | Đầm lầy | Hệ Poison | `#A3AD8F` / `#7A6B8C` / `#3F354E` / `#A33EA1` |
| `sky` | Tầng mây | Hệ Flying, Dragon | `#5F9FF0` / `#CFE3FB` / `#F3F8FE` / `#A98FF3` |
| `ruins` | Tàn tích cổ | Hệ Psychic | `#E7C9D9` / `#F3E1C7` / `#8D7A86` / `#F95587` |
| `haunted` | Rừng đêm | Hệ Ghost, Dark | `#2C2747` / `#4B3F72` / `#16131F` / `#735797` |
| `flower-garden` | Vườn hoa | Hệ Fairy | `#F7CFE0` / `#FDE8F0` / `#7FB86A` / `#D685AD` |
| `stadium` | Đấu trường | Trang So sánh (khi chưa chọn đủ 2 Pokémon), Team Builder, Đội chia sẻ | `#4A6FA5` / `#9FB7D9` / `#2E4A2E` / `#FFD23F` |
| `lab` | Phòng nghiên cứu | Trang Tương khắc, trang 404 | `#E8EEF4` / `#FFFFFF` / `#B8C4D0` / `#1F57B8` |

- Gradient dự phòng (`sceneGradient`) vẽ phong cảnh giản lược: trời ở 0%, chân trời ở 56%, mặt đất từ 62% (khớp chân trời 55-65% của ảnh, Phần 4), đáy đậm hơn mặt đất 30%; thêm quầng sáng màu nhấn ở góc trên phải. Hiển thị khi scene chưa có ảnh, ảnh đang tải hoặc tải lỗi. Đây là màu trang trí, không đặt chữ trực tiếp lên.
- `sceneSwatch` là bản hai nửa (trời trên, mặt đất dưới) cho chấm tròn ở bộ chọn vùng đất trang Tổng quan.
- Nền thân trang (utility `scene-tint` trong `src/styles/index.css`): ngay dưới khung cảnh, nền trộn 18% màu nhấn vào `bg` rồi nhạt dần về `bg` trong 32 rem, để mỗi trang có sắc riêng. `PageBody` bật khi nhận `scene`; trang chi tiết nhuộm theo khung cảnh của Pokémon. Màu nhấn truyền qua biến `--scene-accent` (`sceneTintStyle`), trộn bằng `color-mix` nên tự theo dark mode.
- Vùng nhuộm chỉ làm nền; chữ và bảng vẫn nằm trong panel `surface`.

#### 2. Quy tắc chọn khung cảnh cho Pokémon

- Lấy hệ ở slot 1 của dạng Pokémon, tra bảng trên.
- Ngoại lệ: slot 1 là Normal và có slot 2 thì lấy theo slot 2 (Pidgey Normal/Flying dùng `sky`).
- Hàm thuần `sceneForTypes(types: string[]): SceneId` đặt ở `src/lib/scenes.ts`, có unit test cho 18 hệ và ngoại lệ Normal.
- Không dùng trường `habitat_id` của PokéAPI: chỉ 386/1025 loài (Thế hệ 1-3) có giá trị (đếm từ `pokemon_species.csv` ngày 2026-10-24), và dùng nó phải đổi schema, ingestion, API.
- Bảng ghi đè theo ID cho Pokémon tiêu biểu (`SCENE_OVERRIDES`, ví dụ Lapras dùng `sea` thay vì theo hệ) là mức Could, tối đa 30 mục.

### VII. Hình khối, đổ bóng, chuyển động

| Nhóm | Token |
|---|---|
| Khoảng cách | Thang 4 px mặc định của Tailwind. Dùng chủ yếu: 1 (4), 2 (8), 3 (12), 4 (16), 6 (24), 8 (32), 12 (48), 20 (80) |
| Lề trang | 16 px ở mobile, 24 px từ `md`, 32 px từ `xl` |
| Bo góc | Phân cấp theo độ lớn: `rounded-full` (nhãn hệ), `rounded-[10px]` (nút, ô nhập), `rounded-2xl` 16 px (card), `rounded-3xl` 24 px (panel lớn đặt trên khung cảnh), `rounded-xl` 12 px (hộp thoại game) |
| Đổ bóng | Bóng đặc lệch xuống thay cho bóng mờ: `--shadow-block: 0 4px 0 rgb(22 33 62 / 0.16)` cho card, `--shadow-block-lg: 0 6px 0 rgb(22 33 62 / 0.22)` cho panel; dialog, dropdown dùng `shadow-xl` |
| Nút bấm | Gờ dưới 3 px màu `primary-hover`; khi nhấn dịch xuống 2 px và mất gờ, như nút phần cứng |
| Hộp thoại game | Viền `ink` 3 px, viền trong `border` 2 px cách 3 px (`outline` + `outline-offset: -8px`), nền `surface` |
| Lớp (z-index) | Khung cảnh 0, nội dung 10, header 40, dropdown 45, dialog 50, toast 60 |
| Chuyển động do người dùng | 150 ms `ease-out` cho hover, focus; 200 ms cho dialog, ngăn kéo |
| Chuyển động tự chạy | Theo bản thiết kế hi-fi ngày 2026-10-24 (Phần 7, mục II). Chạy một lần khi vào trang (vào lần lượt, tối đa 640 ms chờ), khi khối được cuộn tới (`Reveal`) hoặc khi dữ liệu đổi (đổi `key` để chạy lại). Được lặp: nền khung cảnh hero (Phần 4, mục III), artwork lơ lửng 3,2 giây, đảo nổi ở trang Tổng quan, dải hệ chạy ngang (dừng khi hover). Không parallax theo cuộn |
| Bộ chuyển động | Easing `--ease-emphasized` (0.2, 0.8, 0.2, 1), `--ease-spring`, `--ease-overshoot`; lớp `animate-*` sinh từ token `--animate-*` trong `src/styles/index.css` (card-in, fade-up, slide-in-left/right, pop-in, cell-in, grow-x/y, drop-in, float, fly-in-left/right, vs-pop, radar-in, pulse-ring, title-in, boot, iris, rise, marquee, bob); `Reveal` (`components/motion/`) cho khối hiện khi cuộn tới; `staggerDelay` (`lib/motion.ts`) cho danh sách; `chip-pop` cho chip bật khi `aria-pressed="true"`; `shine-sweep` cho vệt sáng khi hover. Chỉ dùng `transform`, `opacity`, `clip-path`, `filter` |
| Giảm chuyển động | Khi `prefers-reduced-motion: reduce`: mọi animation còn 0,01 ms, chạy một lần và dừng ở trạng thái cuối (quy tắc trong `@layer base`); `Reveal` hiện ngay không chờ cuộn; dải hệ không chạy ngang mà xuống dòng |

### VIII. Breakpoint và lưới

| Breakpoint | Từ | Cột lưới Omni-Dex | Ghi chú |
|---|---|---|---|
| mặc định | 0 | 2 | Kiểm tra ở 375 px |
| `sm` | 640 px | Tự chia, thẻ rộng tối thiểu 196 px (3 cột ở 768 px) | Bộ lọc vẫn là ngăn kéo |
| `lg` | 1024 px | Tự chia (3 cột) + cột lọc 256 px | Bộ lọc thành cột bên trái |
| `xl` | 1280 px | Tự chia (4 cột ở 1440 px) + cột lọc | Kiểm tra ở 1440 px |

- Lưới từ `sm` dùng `repeat(auto-fill, minmax(196px, 1fr))` theo bản thiết kế, để thẻ không hẹp hơn 196 px khi có cột lọc.
- Nội dung tối đa 1280 px (`max-w-7xl`), canh giữa. Khung cảnh tràn hết chiều ngang màn hình, không bị giới hạn bởi `max-w-7xl`.
- Kích thước trang 24 chia hết cho 2, 3 và 4, nên hàng cuối luôn đầy ở các số cột trên.

---

## Phần 3. Cài đặt token với Tailwind CSS 4

### I. File `src/styles/index.css`

- Nguồn duy nhất của token là [frontend/src/styles/index.css](../frontend/src/styles/index.css); giá trị và mục đích từng token ghi ở Phần 2. Tài liệu không chép lại mã CSS để tránh lệch với code.
- `@theme` sinh class tiện ích từ biến: `--color-type-fire` thành `bg-type-fire`; `--font-display` thành `font-display`; `--text-num` thành `text-num`; `--shadow-block` thành `shadow-block`.
- `@theme inline` dùng cho token ngữ nghĩa vì giá trị của chúng là `var(...)` đổi theo class `.dark`.
- `@custom-variant dark` cho phép bật dark mode bằng class `.dark` trên thẻ `<html>`, thay vì chỉ theo cài đặt hệ điều hành.
- Cỡ display lớn hơn ở `lg` khai báo trong component bằng `lg:text-[3.5rem]/[3.75rem]` và `lg:text-[2.5rem]/[2.75rem]`, hoặc thêm token riêng nếu dùng từ 3 nơi trở lên.
- `--color-scrim` là màu `ink` cố định (không đổi theo `.dark`), luôn dùng kèm độ mờ: `bg-scrim/80` (chip `SceneLabel`), `from-scrim/85 via-scrim/70` (gradient của `PageHero`), `bg-scrim/25` (nhãn hệ trên card), `backdrop:bg-scrim/55` (nền sau ngăn kéo bộ lọc).
- Keyframe `hop` và `sheet-in` khai báo trong `@theme`, sinh class `animate-hop`, `animate-sheet-in`.
- Màu dự phòng của 15 scene không khai báo trong file này; chúng nằm trong `src/lib/scenes.ts` cùng bảng ánh xạ để một nơi quản lý mọi thứ về scene.
- Cú pháp viết theo Tailwind 4.x; khi cập nhật cần đối chiếu lại tài liệu chính thức của bản đang cài.

### II. Import font trong `src/main.tsx`

- [frontend/src/main.tsx](../frontend/src/main.tsx) import 3 subset `latin`, `latin-ext`, `vietnamese` của Dela Gothic One (`@fontsource/dela-gothic-one/<subset>-400.css`) và file `wght.css` bản variable của Nunito, Pixelify Sans.
- Dela Gothic One không import `400.css` vì file này kéo thêm hàng trăm file subset tiếng Nhật vào thư mục build.
- Nunito và Pixelify Sans dùng bản variable: một file mỗi subset cho mọi weight, nhẹ hơn import từng weight.
- Tên file CSS theo cấu trúc gói Fontsource 5.x; nâng cấp gói thì kiểm tra lại tên file trong `node_modules`.

---

## Phần 4. Ảnh khung cảnh

### I. Nguồn ảnh

- Ảnh chụp từ các game Pokémon 3D (ví dụ Pokémon Scarlet/Violet, Pokémon Legends: Arceus, Pokémon Sword/Shield).
- Yêu cầu nội dung mỗi ảnh (áp dụng cho ảnh cuối cùng, sau khi xử lý):
  - Ảnh gốc là ảnh chụp từ game 3D, sprite hoặc artwork chính thức. Không dùng ảnh tạo hoàn toàn bằng AI, ảnh anime hoặc fan art.
  - Không có giao diện game (HUD, hộp thoại, minimap), không có chữ chèn thêm, không có watermark.
  - Không có Pokémon hoặc nhân vật ở dải giữa khung hình (khoảng 30-70% chiều ngang), vì artwork sẽ đứng lên vị trí này. Nhân vật hoặc Pokémon nhỏ ở ngoài dải giữa được chấp nhận.
  - Ảnh gốc có HUD, người hoặc Pokémon thừa thì cắt khung để bỏ đi; không cắt được thì được xóa bằng công cụ, kể cả công cụ dùng AI (mục 1), và bắt buộc qua bước kiểm duyệt (mục 2).
  - Đường chân trời nằm ở khoảng 55-65% chiều cao ảnh, để artwork có "mặt đất" để đứng.
  - Ảnh nguồn rộng từ 1920 px; không phóng to ảnh nhỏ hơn.
- Bản quyền hình ảnh thuộc Nintendo, Game Freak, The Pokémon Company, giống sprite và artwork ([ADR 0005](adr/0005-hybrid-image-assets.md)). Dùng phi thương mại, ghi nguồn từng ảnh trong `frontend/public/scenes/SOURCES.md` (tên game, vị trí trong game, người chụp hoặc URL nguồn).
- Nguồn đã dùng: Bulbagarden Archives (ảnh chụp game, ảnh bìa Nintendo Music, ảnh Wild Zone của Legends: Z-A). Tìm qua API MediaWiki của trang, tải chậm (3 giây mỗi request, trang trả 403 khi tải dồn), xem từng ảnh trước khi chọn. Ảnh trên trang chính thức của game quá nhỏ (tối đa 1367 px); nguồn đã loại ghi ở `SOURCES.md`, mục II.
- Trạng thái ngày 2026-10-28: 15/15 scene có ảnh, 25 ảnh, 50 file, 5,8 MB. Số ảnh mỗi scene: `sea`, `lab` 3; `grassland`, `forest`, `power-plant`, `ruins`, `haunted`, `flower-garden` 2; còn lại 1. Mục tiêu 4-5 ảnh mỗi scene chưa đạt vì thiếu ảnh 1920 px đạt chuẩn; bổ sung bằng ảnh đã xóa HUD, nhân vật theo mục 1, 2.
- Ngoại lệ tạm thời: scene chưa có ảnh 1920 px đạt chuẩn được giữ ảnh 1280 x 720 đang dùng, phóng lên 1920 và ghi "Ngoại lệ" trong `SOURCES.md` (`volcano`, `swamp`, `stadium`); thay ngay khi có ảnh đạt chuẩn. Ảnh có viền đen trên dưới được cắt viền trước khi cắt 16:9.
- Mỗi scene có số ảnh `photos` trong `src/lib/scenes.ts`; `photos: 0` thì `SceneBackdrop` chỉ vẽ gradient, không gửi request ảnh.

#### 1. Xóa HUD, người hoặc Pokémon thừa

- Chỉ được xóa: HUD, minimap, chữ chèn, người hoặc Pokémon thừa. Không thêm vật thể mới, không đổi bố cục, bầu trời, mùa, ánh sáng.
- Vùng phải vẽ lại nhỏ so với toàn ảnh. Ảnh mà phần lớn nội dung phải vẽ lại (ví dụ nhân vật chiếm giữa khung) thì loại, không sửa.
- Công cụ được dùng: công cụ vá thường (Clone Stamp, Healing, GIMP Heal) hoặc công cụ sửa ảnh bằng AI, kể cả plugin MCP `nano-banana` (Gemini 2.5 Flash Image) trong Claude Code. Giữ file gốc chưa sửa ở thư mục làm việc (không commit) để đối chiếu.
- Ghi vào cột "Xử lý" của `frontend/public/scenes/SOURCES.md`: đã xóa gì, bằng công cụ nào (ví dụ "Xóa minimap và nhân vật bằng GIMP Heal"). Ảnh sửa bằng công cụ có watermark ẩn ghi thêm tên watermark (ví dụ "Sửa bằng Gemini 2.5 Flash Image, có SynthID").

#### 2. Kiểm duyệt dấu vết AI (bắt buộc với mọi ảnh đã sửa)

- Kiểm tra trên file vừa sửa, trước khi chuyển sang WebP (bước chuyển đổi làm mất metadata).

| Kiểm tra | Cách làm | Dấu hiệu phải loại |
|---|---|---|
| Watermark nhìn thấy | Xem ảnh ở 100%, soát 4 góc và các mép | Logo, chữ, biểu tượng của công cụ AI (chữ "AI", "Generated", biểu tượng ngôi sao...) |
| Metadata nguồn gốc | `node scripts/check-image-provenance.mjs <file>`; kết quả `LOẠI` thì thoát mã 1 | Manifest C2PA (Content Credentials); IPTC `DigitalSourceType` là `trainedAlgorithmicMedia` hoặc `compositeWithTrainedAlgorithmicMedia`; tên công cụ AI trong EXIF, XMP, PNG text; tham số prompt |
| Dấu vết vẽ lại | So với ảnh gốc ở 100% tại vùng đã xóa | Vân lặp, vật thể méo, chữ vô nghĩa, đường chân trời gãy |

- Có bất kỳ dấu hiệu nào trong bảng: loại ảnh đã sửa, giữ ảnh đang dùng của scene đó; không thêm ảnh đã sửa vào bộ ảnh. Không xóa metadata hoặc che watermark để vượt qua bước này.
- Watermark ẩn trong điểm ảnh (ví dụ SynthID, mà Google ghi là có trong mọi ảnh do Gemini API sinh ra) được chấp nhận từ ngày 2026-10-28, với điều kiện ghi rõ trong cột "Xử lý" của `SOURCES.md`. Script và mắt thường không phát hiện được loại watermark này, nên nguồn thông tin là tài liệu của công cụ đã dùng.
- Nhiều công cụ AI tự gắn Content Credentials vào file xuất ra, nên ảnh sửa bằng các công cụ đó sẽ bị loại ở bước này. Công cụ vá không dùng AI tạo sinh (Clone Stamp, Healing, GIMP Heal) không gắn dấu này.

### II. Định dạng, thư mục, dung lượng

| Mục | Quy định |
|---|---|
| Thư mục | `frontend/public/scenes/` |
| Tên file | `{scene}-{n}-1920.webp` và `{scene}-{n}-960.webp`, `n` từ 1, ví dụ `volcano-2-1920.webp` |
| Kích thước | 1920 x 1080 và 960 x 540, tỷ lệ 16:9 |
| Định dạng | WebP, chất lượng 75-80 |
| Dung lượng mỗi file | Tối đa 260 KB (1920) và 80 KB (960) |
| Tổng ngân sách | 15 scene x tối đa 5 ảnh x 2 cỡ, tối đa 25 MB ([ADR 0006](adr/0006-animated-scene-backdrops.md)) |
| Sinh URL | `sceneUrl(scene, photo, width)` và `sceneSrcSet(scene, photo)` trong `src/lib/assets.ts`, cạnh hàm sinh URL sprite |

- Ảnh tự host và commit vào repo để demo chạy offline ([ADR 0002](adr/0002-offline-data-from-csv.md)). Nếu tổng vượt 25 MB thì giảm chất lượng trước, sau đó mới bớt ảnh; không bớt scene.
- Backend không biết gì về scene: không thêm cột, không thêm trường API.

### III. Hiển thị

- Component `SceneBackdrop` render `<img>` với `srcset` hai cỡ, `sizes="100vw"`, `alt=""` (ảnh trang trí), `object-fit: cover`, `object-position: center 60%`. Ảnh đầu tiên chọn ngẫu nhiên trong bộ ảnh của scene.
- Prop `animated` (chỉ bật ở hero: `PageHero`, `LandingHero`, `PokemonHero`): sau mỗi 12 giây tải trước ảnh kế tiếp rồi chuyển mờ 1,2 giây; ảnh phóng chậm 2-10% trong 24 giây (`animate-scene-drift`, `animate-scene-enter`); thêm `SceneAmbience` với 18 hạt (9 hạt dưới `md`) theo `ambience` của scene. Tab bị ẩn thì không chuyển ảnh. Ảnh lỗi bị bỏ khỏi vòng.
- `prefers-reduced-motion: reduce` (hook `useReducedMotion`): một ảnh tĩnh, không phóng chậm, không lớp hạt.
- Ảnh scene ở trang Tổng quan và trang chi tiết đặt `fetchpriority="high"`; trang khác dùng `loading="lazy"` nếu nằm dưới màn hình đầu.
- Khi đang tải hoặc lỗi: hiển thị gradient màu dự phòng (Phần 2, mục VI); không hiển thị icon ảnh vỡ.
- Chữ trên ảnh luôn đặt trên lớp phủ màu `--color-scrim` với độ mờ tối thiểu 65%. Từ bản 0.6, tiêu đề `PageHero` và khối tên ứng dụng ở `LandingHero` nằm trong tấm nền bo góc `bg-scrim/75` vừa khít chữ (chữ trắng trên scrim 75% đè lên điểm ảnh trắng đạt khoảng 7:1), phần còn lại của ảnh chỉ có dải tối 45-50% ở mép dưới. Đo bằng script: chữ trắng trên scrim 65% đè lên điểm ảnh trắng tuyệt đối vẫn đạt 5.02:1. Không giảm độ đậm scrim dưới 65% ở vùng có chữ.
- Bảng dữ liệu không bao giờ đặt trực tiếp lên ảnh; luôn nằm trong panel `surface` đặc (không dùng nền mờ kiểu kính).

---

## Phần 5. Component

### I. Component nền (`components/ui`)

| Component | Biến thể | Trạng thái | Ghi chú accessibility |
|---|---|---|---|
| `Button` | `primary`, `secondary` (nền trắng, viền `ink` 2 px), `ghost`, `danger`, `cta` (nền `dex-yellow`, chữ `ink`, chỉ dùng ở trang Tổng quan); cỡ `sm` (40 px trên mobile, 36 px từ breakpoint `md`), `md` (44 px) | hover, focus, pressed, disabled, loading | `loading` giữ nguyên độ rộng, đặt `aria-busy`; nút chỉ có icon phải có `aria-label`. Hiện thực bằng hàm `buttonClassName(variant, size)` trong `buttonStyles.ts` để dùng chung cho `<button>` và `<Link>`; đã có `primary`, `secondary`, `ghost`, `cta`, còn `danger` và `loading` làm khi cần |
| `Panel` | | | Khung nội dung đặt trên khung cảnh: nền `surface`, viền `ink` 2 px, bo 24 px, `shadow-block-lg`; là `<section>`, cần `aria-label` hoặc `aria-labelledby` |
| `Card` | `default`, `interactive` (có hover, toàn card là link) | hover, focus | Card dạng link dùng thẻ `<a>`, không gắn `onClick` lên `<div>` |
| `GameDialog` | `default`, `speaker` (có tên người nói ở góc trên trái) | | Hộp thoại kiểu game (Phần 2, mục VII). Dùng cho: lời chào trang Tổng quan, `VerdictPanel`, `EmptyState`, `ErrorState`. Không dùng cho nội dung khác |
| `Dialog` | `default`, `confirm` | open, closing | Bẫy focus, `Esc` để đóng, trả focus về nút mở |
| `Skeleton` | `text`, `rect`, `circle` | | `aria-hidden`; vùng cha đặt `aria-busy="true"` |
| `EmptyState` | | | Bọc trong `GameDialog`; tiêu đề, mô tả, tối đa 1 hành động |
| `ErrorState` | `inline`, `page` | | Bọc trong `GameDialog`; thông điệp từ `errorMessages.ts`, nút "Thử lại" |
| `Toast` | `success`, `error` | | `role="status"`, tự ẩn sau 4 giây, có nút đóng |
| `Pagination` | | trang hiện tại, disabled | `nav` có `aria-label="Phân trang"`, trang hiện tại có `aria-current="page"` |

### II. Component khung cảnh và bố cục (`components/scene`)

| Component | Props chính | Hiển thị | Quy tắc |
|---|---|---|---|
| `SceneBackdrop` | `scene`, `priority?: boolean`, `animated?: boolean` | Ảnh scene tràn ngang, gradient dự phòng; `animated` thêm chuyển ảnh và `SceneAmbience` | Theo Phần 4, mục III |
| `PageHero` | `scene`, `title`, `subtitle?`, `wide?` | Dải khung cảnh cao 192 px (mobile) và 320 px (từ `md`), tiêu đề `text-display` trong tấm nền scrim 75%, `SceneLabel` từ `md`; `wide` dùng khung 100 rem cùng `PageBody wide` | Mỗi trang dùng đúng một `PageHero`; tiêu đề là `<h1>` duy nhất của trang |
| `PageBody` | `scene?`, `className?` | Vùng nội dung `max-w-7xl` kéo lên đè mép dưới khung cảnh 24 px (mobile) và 48 px (từ `md`); có `scene` thì nền nhuộm `scene-tint` (Phần 2, mục VI) | Đặt ngay sau `PageHero`, truyền cùng `scene` với `PageHero` |
| `SceneLabel` | `scene` | Chip nhỏ "Khung cảnh: Núi lửa" ở góc ảnh | Cho người dùng biết vì sao nền đổi; không phải link |

### III. Component Pokémon (`components/pokemon`)

| Component | Props chính | Hiển thị | Quy tắc |
|---|---|---|---|
| `TypeBadge` | `type`, `size: sm \| md` | Viên thuốc màu hệ, chữ tên hệ | Màu chữ theo Phần 2, mục II; luôn có chữ |
| `DexNumber` | `id` | `#0006` bằng font Text 800, `tabular-nums` | Luôn 4 chữ số |
| `StatBar` | `label`, `value`, `max = 255` | Nhãn, số (`text-num`), thanh ngang kiểu thanh HP có viền `ink` 2 px | Số luôn hiển thị; thanh chỉ là minh họa. Màu thanh: dưới 60 cam (`stat-low` #FB923C), 60-89 vàng (`stat-mid` #FACC15), 90-119 xanh lục (`stat-good` #22C55E), từ 120 xanh dương (`stat-high` #3B82F6); token khai báo ở `src/styles/index.css` |
| `MultiplierCell` | `multiplier` | Ô vuông 40 px có nhãn `x2` | Màu theo Phần 2, mục III; `title` mô tả đầy đủ, ví dụ "Rock gây x4" |
| `PokemonSprite` | `id`, `name`, `variant: sprite \| artwork`, `size` | Ảnh Pokémon đứng trên đế bóng elip | Đặt sẵn `width`, `height`; `loading="lazy"`; `alt` là tên Pokémon; fallback theo [assets.md](assets.md), Phần 5 |
| `PokemonCard` | `pokemon: PokemonSummary` | Nền màu hệ đậm của slot 1, chữ trắng (Phần 2, mục II, 1); `TypeGlyph` mờ ở góc trên phải; tên, `DexNumber`, nhãn hệ, BST `text-num`; sprite đứng trên đế trắng bo hữu cơ | Toàn card là link; hover: card nhấc 4 px, đế nghiêng, sprite nhảy 1 lần (4 px, 200 ms) |
| `TypeGlyph` | `type`, `className?` | Icon SVG nét đơn cho 18 hệ, `aria-hidden` | Chỉ trang trí; không thay cho tên hệ |
| `PokemonSearchBox` | `onSelect`, `excludeIds` | Ô nhập và danh sách gợi ý có sprite nhỏ | Mẫu ARIA combobox; debounce 250 ms; từ 2 ký tự; điều khiển bằng mũi tên, `Enter`, `Esc` |
| `PartnerBadge` (Could) | | Sprite Pokémon đồng hành 32 px ở header | Link tới trang chi tiết; `aria-label="Pokémon đồng hành: <tên>"` |

### IV. Component tính năng

| Component | Trang | Quy tắc chính |
|---|---|---|
| `LandingHero` | Tổng quan | Khung cảnh toàn màn hình đầu, artwork một Pokémon, `GameDialog` chứa lời chào và 2 nút (Phần 7, mục II) |
| `FeatureRegions` | Tổng quan | 4 ô tính năng, mỗi ô một khung cảnh riêng, kích thước không đều (1 ô lớn, 3 ô nhỏ trên desktop) |
| `DailyPokemon` | Tổng quan | Một Pokémon chọn theo ngày (ID tính từ ngày hiện tại, cố định trong ngày), gọi `GET /api/v1/pokemon/{idOrName}` |
| `DexFilters` | Omni-Dex | Chip 18 hệ `aria-pressed`, tối đa 2 (đủ 2 thì vô hiệu hóa các chip còn lại); chip thế hệ 1-9 chọn một (bấm lại để bỏ, vì API `gen` nhận một giá trị); `StatRangeFields`; chip Dạng. Mọi thay đổi ghi lên URL. Dùng chung cho cột lọc (`layout="sidebar"`, 2 cột chip) và ngăn kéo (`layout="sheet"`, 3 cột) |
| `StatRangeFields` | Omni-Dex | Ô "Từ", "Đến" (BST 0-1530) và "Tốc độ tối thiểu" (0-255); áp dụng khi rời ô hoặc bấm `Enter`; sai định dạng hoặc "Từ" lớn hơn "Đến" thì báo lỗi dưới ô (`aria-describedby`) và không đổi URL; thanh khoảng BST minh họa thang 180-720 |
| `DexToolbar` | Omni-Dex | Nút "Bộ lọc (n)" nền `dex-yellow` (dưới `lg`) và ô "Sắp xếp". Dưới `lg` là thẻ trắng đè lên khung cảnh; từ `lg` nằm trong hàng tiêu đề kết quả |
| `ViewToggle` | Omni-Dex | Nhóm 2 nút icon "Thẻ màu", "Danh sách" (`aria-pressed`, `aria-label`); lưu `view=list` trên URL, đổi kiểu không gọi lại API |
| `FilterSheet` | Omni-Dex | `<dialog>` mở bằng `showModal()` từ mép dưới: bẫy focus, `Esc` hoặc bấm nền để đóng, trả focus về nút mở; chân có "Xóa bộ lọc" và "Xem N kết quả" |
| `PokemonList` | Omni-Dex | Chế độ danh sách: mỗi hàng nền `type-tint`, sprite trên đế màu hệ đậm, số Pokédex, tên, `TypeBadge`, BST |
| `DefenseGrid` | Chi tiết | 18 `MultiplierCell` nhóm theo mức: Yếu, Kháng, Miễn nhiễm, Trung tính |
| `TypeMatrixTable` | Tương khắc | `<table>`, hàng là hệ tấn công, cột là hệ phòng thủ; hàng và cột tiêu đề cố định khi cuộn |
| `VersusBanner` | So sánh | Khung cảnh của hai Pokémon ghép chéo theo đường xiên, artwork hai bên, chữ "VS" font Display ở giữa |
| `CompareRadar` | So sánh | Lớp bọc của `StatRadar` (`components/pokemon`, SVG, dùng chung với Team Builder): 6 trục; series trái `primary`, series phải `accent`; có chú thích tên hai Pokémon |
| `VerdictPanel` | So sánh | Bọc trong `GameDialog`; 3 dòng kết luận, mỗi dòng nêu bên thắng và con số |
| `TeamSlots` | Team Builder | 5 slot chọn và 1 slot đề xuất; slot có thành viên hiển thị dải màu khung cảnh của Pokémon đó; slot trống có nút "Thêm Pokémon" |
| `WeaknessHeatmap` | Team Builder | `<table>` 18 hàng; cột: hệ, từng thành viên, số yếu, số kháng, mức hở; hàng `criticalHole` có nhãn "Lỗ hổng" |
| `TeamScoreGauge` | Team Builder | Số điểm 0-100 `text-num-lg` kèm thanh ngang kiểu thanh HP; thay đổi so với lần trước hiển thị `+12` màu `success` |
| `RecommendationCard` | Team Builder | Sprite, tên, nhãn hệ, điểm phù hợp, danh sách lý do, nút "Thêm vào đội" |
| `SaveTeamDialog` | Team Builder | Ô tên đội (1-60 ký tự); lưu xong hiện link chia sẻ và nút "Sao chép" |

---

## Phần 6. Pattern

### I. Trạng thái dữ liệu

| Trạng thái | Cách hiển thị | Không làm |
|---|---|---|
| Đang tải lần đầu | `Skeleton` cùng bố cục với nội dung thật (ví dụ 24 card xám); khung cảnh hiện gradient dự phòng | Spinner giữa trang trắng |
| Đang tải lại (đổi bộ lọc) | Giữ dữ liệu cũ, giảm độ mờ còn 60%, thanh tiến trình mảnh dưới header | Xóa trắng lưới |
| Rỗng | `EmptyState`: "Không có Pokémon nào khớp bộ lọc" và nút "Xóa bộ lọc" | Để vùng trống không giải thích |
| Lỗi mạng hoặc 5xx | `ErrorState` kèm nút "Thử lại" | Hiển thị `detail` kỹ thuật |
| 404 | `NotFoundPage` khung cảnh `lab`, có link về Pokédex | Trang trắng |
| 429 | Toast: "Bạn lưu quá nhanh, thử lại sau N giây" (N lấy từ `Retry-After`) | |

### II. Form và hành động

- Validate khi rời ô nhập và khi bấm gửi; thông báo lỗi ngay dưới ô, liên kết bằng `aria-describedby`.
- Nút gửi chuyển sang `loading` trong lúc chờ; chặn gửi trùng.
- Sao chép link: dùng Clipboard API; không hỗ trợ thì chọn sẵn nội dung ô link để người dùng tự sao chép.

### III. Ngôn ngữ và định dạng

| Nội dung | Quy tắc | Ví dụ |
|---|---|---|
| Giao diện | Tiếng Việt | "Thêm vào đội", "Xóa bộ lọc" |
| Tên Pokémon, tên hệ | Tiếng Anh như trong game, viết hoa chữ cái đầu mỗi từ | `Rotom Wash`, `Fire` |
| Số Pokédex | `#` và 4 chữ số | `#0006` |
| Chiều cao, cân nặng | Đổi từ dm, hg sang m, kg; dấu thập phân kiểu Việt Nam | `1,7 m`, `90,5 kg` |
| Hệ số | Tiền tố `x`, dùng phân số cho 0.25 và 0.5 | `x4`, `x½`, `x¼`, `x0` |

### IV. Giọng văn

- Nói như một Trainer có kinh nghiệm nói với bạn: ngắn, cụ thể, có số liệu.
- Nút nói đúng việc sẽ xảy ra và giữ nguyên tên trong cả luồng: nút "Lưu đội" thì toast là "Đã lưu đội".
- Thông báo lỗi nói chuyện gì xảy ra và làm gì tiếp, không xin lỗi, không mơ hồ.

| Tình huống | Viết | Không viết |
|---|---|---|
| Lời chào trang Tổng quan | "Chào Trainer! Pokédex này ghi lại 1025 loài Pokémon. Bạn muốn tra cứu một Pokémon hay xây đội cho trận tới?" | "Chào mừng đến với nền tảng Pokémon hàng đầu!" |
| Rỗng ở Omni-Dex | "Chưa có Pokémon nào hệ Ice thuộc Thế hệ 1 có BST trên 600. Thử nới khoảng BST." | "Không tìm thấy kết quả." |
| Kết luận so sánh | "Garchomp nhanh hơn 6 điểm Tốc độ, đủ để ra đòn trước Salamence." | "Garchomp có lợi thế." |

---

## Phần 7. Bố cục trang

### I. Khung chung

```text
+--------------------------------------------------------------+
| PokeNexus   Pokédex  Tương khắc  So sánh  Xây đội   [Đồng hành] |  Header 60 px, nền dex-red, cố định
+--------------------------------------------------------------+
| ~~~~~~~~~~~~~ PageHero: khung cảnh tràn ngang ~~~~~~~~~~~~~ |
| ~~~~~~~~ Tiêu đề trang (Display) trên scrim ~~~~~~~~~~~~~~ |
+--------------------------------------------------------------+
|        Nội dung (max-w-7xl), panel surface đè lên mép        |
|        dưới khung cảnh 48 px                                 |
+--------------------------------------------------------------+
| Nguồn dữ liệu PokéAPI · Miễn trừ bản quyền · GitHub         |  Footer, nền ink, chữ trắng
+--------------------------------------------------------------+
```

- Header: logo chữ PokeNexus font Display, chữ trắng trên `dex-red`. Mục đang chọn có gạch chân `dex-yellow` 3 px và `aria-current="page"`.
- Mobile: menu điều hướng gom vào nút "Menu" mở ngăn kéo từ phải.
- Panel nội dung đè lên mép dưới khung cảnh 48 px để khung cảnh và dữ liệu liền mạch, không thành hai khối tách rời.

### II. Từng trang

| Trang | Route | Khung cảnh | Điểm nhấn duy nhất | Chuyển động tự chạy |
|---|---|---|---|---|
| Tổng quan | `/` | Khung cảnh của Pokémon đồng hành; chưa có thì xoay theo ngày trong 13 khung cảnh vùng đất | Hero toàn màn hình: artwork đứng trên khung cảnh, `GameDialog` ở dưới | Màn hình Pokédex mở kiểu CRT (`boot`), khối tiêu đề và hộp thoại trồi lên (`rise`), chữ "PokeNexus" hiện rõ dần (`title-in`), Pokémon nổi bật bật ra rồi lơ lửng; đổi vùng đất thì ảnh lộ theo vòng tròn (`iris`); dải hệ chạy ngang; các khối dưới hiện khi cuộn tới, đảo nổi nhấp nhô, cột thế hệ mọc lên |
| Omni-Dex | `/pokedex` | `grassland` | Lưới card nhuộm màu theo hệ | Card vào lần lượt (`card-in`, 30 ms mỗi card); hover có vệt sáng quét; chip lọc bật khi chọn |
| Chi tiết | `/pokemon/:idOrName` | Theo hệ của Pokémon (Phần 2, mục VI) | Artwork cỡ lớn đứng trên khung cảnh vùng đất của nó, kèm `SceneLabel` | Artwork rơi xuống đế, nảy nhẹ rồi lơ lửng; nhãn hệ bật ra; thanh chỉ số chạy dài lần lượt (300 ms + 90 ms mỗi thanh); ô phòng thủ và chuỗi tiến hóa vào lần lượt |
| Tương khắc | `/types` | `lab` | Ma trận 18 x 18 với hàng, cột tiêu đề là nhãn hệ màu | Ô ma trận hiện theo đường chéo (18 ms mỗi bậc); kết quả hệ kép trượt vào mỗi lần đổi hệ; chip bật khi chọn |
| So sánh | `/compare` | `stadium`; khi đủ 2 Pokémon thì `VersusBanner` | Màn hình đối đầu chia đôi theo đường xiên | Hai nửa trượt vào; artwork bay vào từ hai bên rồi lơ lửng; huy hiệu VS bật ra; bảng tên rơi xuống; radar phóng từ tâm; thanh chỉ số chạy từ giữa ra; 3 ý kết luận hiện lần lượt; đổi cặp thì chạy lại |
| Team Builder | `/team-builder` | `stadium` | Điểm đội `text-num-lg` trên thanh kiểu HP | Slot bật lên khi thêm thành viên; hàng heatmap trượt vào; nhãn "Lỗ hổng nghiêm trọng" bật ra và nhấp nháy viền 3 lần; thanh điểm chạy dài và đổi độ dài mượt; thẻ đề xuất trượt từ phải |
| Đội chia sẻ | `/team/:shareCode` | `stadium` | Tên đội font Display trên khung cảnh | Slot vào lần lượt; heatmap như Team Builder |
| Địa hình | `/terrain/:terrainId?` | Theo địa hình đang chọn | Trò chơi "Who's that Pokémon?" với bóng đen artwork | Đổi địa hình thì ảnh hero lộ theo vòng tròn (`iris`); card Pokémon vào lần lượt; 4 lựa chọn bật ra mỗi lượt; vòng bóng đen lơ lửng |

#### 1. Trang Tổng quan

```text
Desktop (1440 px)
+--------------------------------------------------------------+
| Header                                                       |
+--------------------------------------------------------------+
|                                                              |
|  HERO: vỏ Pokédex đỏ ôm khung cảnh vùng đất                  |
|  PokeNexus (display-xl), mô tả, 3 nhãn   [ARTWORK + số, hệ,  |
|  [Giáo sư] Chào Trainer! ...              chiều cao, cân nặng]|
|  [Mở Pokédex] [Xây đội ngay]                                  |
|  Chọn vùng đất: 13 chip khung cảnh                            |
+--------------------------------------------------------------+
|  Dải 18 nhãn hệ (TypeTicker)                                  |
+--------------------------------------------------------------+
|  Bốn vùng đất (FeatureRegions): 4 thẻ đảo Pokédex,            |
|  Tương khắc, So sánh, Xây đội; nút "Khám phá"                 |
+--------------------------------------------------------------+
|  Vòng tương khắc (TypeWheel, nền ink): bảng x2, x½, x0 bên    |
|  trái; vòng 18 hệ bên phải, hệ đang chọn ở giữa               |
+--------------------------------------------------------------+
|  Pokémon hôm nay (DailyPokemon): khung cảnh, artwork | số,    |
|  tên, hệ, BST, câu nhận xét, "Xem chi tiết"                   |
+--------------------------------------------------------------+
|  Xây đội trong 3 bước (TeamSteps): 3 thẻ có minh họa          |
+--------------------------------------------------------------+
|  1025 loài qua 9 thế hệ (GenerationChart): 9 cột màu          |
+--------------------------------------------------------------+
|  Thử tài Trainer (TrainerQuiz): 5 câu, 3 đáp án mỗi câu       |
+--------------------------------------------------------------+
|  Kêu gọi cuối trang (ClosingCta) trên nền dex-red             |
+--------------------------------------------------------------+
|  Footer                                                      |
+--------------------------------------------------------------+
```

- Nguồn thiết kế: bản thiết kế hi-fi "PokeNexus" (artboard "Tổng quan" và "Điện thoại · Tổng quan", 2026-10-24) trên [claude.ai](https://claude.ai/code/artifact/31b3214f-f6f7-4bc9-b7c5-8c89cca4d24a) (riêng tư của tác giả). Tiêu chí chấp nhận từng khối: [spec.md](spec.md), Phần 2, mục VII.
- Mobile (375 px): các khối xếp dọc; artwork nằm trên hộp thoại; 4 thẻ vùng đất một cột; vòng tương khắc nằm dưới bảng hệ số; biểu đồ thế hệ cuộn ngang trong khung.
- Nút chính "Mở Pokédex" dùng biến thể `cta`; nút phụ "Xây đội ngay" dùng `secondary`.
- Artwork ở hero lấy từ đường dẫn artwork của PokéAPI; mất mạng thì dùng sprite phóng to theo [assets.md](assets.md), Phần 5.
- API dùng: `GET /api/v1/pokemon/{idOrName}` (Pokémon nổi bật, Pokémon hôm nay), `GET /api/v1/types/matrix` (vòng tương khắc, câu đố), `GET /api/v1/pokemon?gen=<n>&form=DEFAULT&size=1` (`totalElements` cho biểu đồ thế hệ).
- Chuyển động trong bản thiết kế (chữ hiện dần, dải hệ chạy ngang, đảo nổi, đường nối trên vòng tương khắc) không bắt buộc ở MVP.

#### 2. Các trang dữ liệu

| Trang | Mobile (375 px) | Desktop (1440 px) |
|---|---|---|
| Omni-Dex | `PageHero` thấp; thẻ công cụ (nút "Bộ lọc (2)" mở ngăn kéo, ô sắp xếp) đè lên khung cảnh; số kết quả và nút đổi kiểu hiển thị; lưới 2 cột; phân trang "Trước, 1 / 46, Sau" | Cột lọc trái 256 px; panel kết quả: số kết quả, nút đổi kiểu, sắp xếp; lưới tự chia (4 cột ở 1440 px); phân trang có số trang |
| Chi tiết | Khung cảnh cao 280 px có artwork; panel: tên, nhãn hệ, chỉ số, lưới phòng thủ 3 cột, các dạng | Khung cảnh cao 420 px, artwork bên trái; panel bên phải chứa chỉ số; lưới phòng thủ 6 cột bên dưới |
| Tương khắc | Chọn 1-2 hệ phòng thủ, kết quả dạng danh sách; ma trận cuộn ngang trong khung | Ma trận 18 x 18 đầy đủ, bộ chọn hệ kép phía trên |
| So sánh | Hai ô tìm kiếm xếp dọc; `VersusBanner` chia ngang trên, dưới; radar; kết luận | `VersusBanner` chia chéo trái, phải; radar ở giữa, kết luận bên dưới |
| Team Builder | Slot dạng lưới 3 x 2; điểm đội; heatmap cuộn ngang, cột hệ cố định; ô "Loại huyền thoại, thần thoại và Paradox" rồi đề xuất xếp dọc | Trái: slot và điểm; giữa: heatmap; phải: ô loại huyền thoại và 3 thẻ đề xuất |
| Đội chia sẻ | Tên đội, 6 slot chỉ đọc, heatmap, nút "Mở trong Team Builder" | Như mobile, rộng hơn |
| Địa hình | `PageHero` theo địa hình đang chọn; 13 link địa hình lưới 2 cột; mô tả; trò chơi (bóng đen trên, 4 nút xếp dọc); lưới Pokémon 2 cột; Thẻ Trainer | Link địa hình 7 cột; mô tả và trò chơi chia 2:3; lưới Pokémon 6 cột; Thẻ Trainer |

- Wireframe ở `docs/wireframes/` chốt bố cục và thứ tự thông tin của 6 trang dữ liệu; trang Tổng quan và lớp khung cảnh cần bổ sung wireframe (Phần 11).
- Bảng rộng (heatmap, ma trận) chỉ cuộn ngang bên trong khung của bảng, trang không bao giờ cuộn ngang.
- Đổi màu một nút đã có biến thể (ví dụ nút đáp án đúng, sai trên nền `secondary`) phải dùng modifier `!` của Tailwind 4 (`bg-success!`). Không có `!`, lớp `bg-surface` của biến thể được sinh sau và thắng, chữ trắng nằm trên nền trắng (lỗi phát hiện ngày 2026-10-28 ở Thử tài Trainer).

---

## Phần 8. Accessibility

### I. Danh sách yêu cầu

| Yêu cầu | Tiêu chí kiểm tra |
|---|---|
| Tương phản | Chữ tối thiểu 4.5:1; thành phần giao diện (viền ô nhập, vòng focus) tối thiểu 3:1 |
| Chữ trên ảnh | Luôn có scrim tối thiểu 65% ở vùng chứa chữ (Phần 4, mục III) |
| Không chỉ dùng màu | Mọi ô màu có nhãn chữ hoặc số; mục điều hướng đang chọn có gạch chân và `aria-current` |
| Bàn phím | Dùng hết chức năng bằng `Tab`, `Enter`, `Space`, `Esc`, phím mũi tên; thứ tự focus theo thứ tự đọc |
| Focus rõ ràng | Vòng `focus-ring` 2 px ở mọi phần tử tương tác; trên ảnh và trên header `dex-red` thêm viền trắng 2 px bên ngoài; không xóa `outline` mà không thay thế |
| Ngữ nghĩa | `<html lang="vi">`; bảng dữ liệu dùng `<table>`, `<th scope>`; một `<h1>` mỗi trang (nằm trong `PageHero` hoặc `LandingHero`) |
| Ảnh | `alt` là tên Pokémon; ảnh khung cảnh và đế bóng dùng `alt=""` |
| Vùng chạm | Phần tử tương tác tối thiểu 40 x 40 px trên mobile |
| Chuyển động | Tôn trọng `prefers-reduced-motion`; chữ hiện dần ở hộp thoại có thể bỏ qua bằng một lần bấm hoặc `Enter` |
| Thông báo động | Kết quả phân tích cập nhật thì đọc tóm tắt qua vùng `aria-live="polite"`, ví dụ "Điểm đội 62, có 1 lỗ hổng". Chữ hiện dần ở hộp thoại không đặt trong `aria-live`; trình đọc màn hình nhận toàn bộ câu ngay |

- Kiểm tra ở T309 bằng Lighthouse (mục Accessibility, mục tiêu tối thiểu 90) và kiểm thử thủ công bằng bàn phím.

---

## Phần 9. Dark mode (Could)

### I. Các bước khi triển khai

- Token dark đã có trong `src/styles/index.css` (giá trị ở Phần 2); chỉ cần thêm nút chuyển theme ở header, lưu lựa chọn vào `localStorage`, mặc định theo `prefers-color-scheme`.
- Áp class `.dark` lên `<html>` trước khi React render (script nhỏ trong `index.html`) để tránh nháy màu.
- Kiểm tra lại: nhãn hệ, ô hệ số, heatmap, `dex-red`, `dex-yellow` giữ nguyên màu nên không cần đổi; radar dùng `accent` bản dark; ảnh khung cảnh giảm sáng bằng `filter: brightness(0.8)`.

---

## Phần 10. Checklist cho PR giao diện

- Không có mã màu, cỡ chữ, họ font, URL ảnh viết trực tiếp ngoài token và `src/lib/assets.ts`.
- Font Display không dưới 24 px và không bị gắn `font-bold`; con số dùng font Text `tabular-nums`, không dùng font Pixel.
- Chữ trên ảnh khung cảnh có scrim; bảng dữ liệu nằm trên panel `surface` đặc.
- Ảnh khung cảnh đã sửa có ghi công cụ trong `SOURCES.md` và đã qua kiểm duyệt dấu vết AI (Phần 4, mục I, 2).
- Trang có đúng một điểm nhấn và tối đa một chuyển động tự chạy; đã thử với `prefers-reduced-motion: reduce`.
- Đã xử lý đủ trạng thái tải, rỗng, lỗi; khung cảnh tải lỗi vẫn hiện gradient dự phòng.
- Đã kiểm tra ở 375 px và 1440 px, trang không cuộn ngang.
- Đi hết luồng bằng bàn phím, focus luôn nhìn thấy được, kể cả trên ảnh và header.
- Ảnh chụp màn hình mobile và desktop có trong PR.

---

## Phần 11. Thay đổi chờ đồng bộ

- Bản 0.3 của tài liệu này đi trước các tài liệu dưới đây. Khi các mục được cập nhật thì xóa dòng tương ứng; xóa cả Phần 11 khi bảng rỗng.

| Tài liệu | Nội dung cần cập nhật |
|---|---|
| [roadmap.md](roadmap.md) | Pokémon đồng hành (Could, ngoài phạm vi [spec.md](spec.md) 1.2). Ảnh khung cảnh đã bổ sung ngày 2026-10-28 (14/15), không cần task riêng |
| `docs/adr/` | ADR mới về ảnh khung cảnh tự host và cách chọn khung cảnh theo hệ, bổ sung cho [ADR 0005](adr/0005-hybrid-image-assets.md) |

- Đã đồng bộ ngày 2026-10-26: trang Tổng quan vào [spec.md](spec.md) 1.2 và [roadmap.md](roadmap.md) 0.3 (T311, T312); route `/` và `/pokedex` ở [architecture.md](architecture.md), Phần 6; `LandingPage` ở [folder-structure.md](folder-structure.md); [wireframes/README.md](wireframes/README.md).
