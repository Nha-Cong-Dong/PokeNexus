# PokeNexus - Design System và UI Guidelines

- Phiên bản: 0.2 (cập nhật 2026-10-19)
- Phạm vi: token, component, pattern, bố cục trang và accessibility cho frontend.
- Theme: **light là mặc định và bắt buộc ở MVP**. Token đã định nghĩa sẵn cặp light/dark; dark mode là mức Could ở Tuần 4 ([roadmap.md](roadmap.md), Phần 2).
- Mọi giá trị màu trong tài liệu này đã được kiểm tra tỷ lệ tương phản theo công thức WCAG 2.x bằng script ngày 2026-10-19.

---

## Phần 1. Nguyên tắc

### I. Bốn nguyên tắc

| Nguyên tắc | Ý nghĩa | Ví dụ áp dụng |
|---|---|---|
| Dữ liệu trước, trang trí sau | Số liệu và kết luận phải đọc được trong 3 giây | Lưới phòng thủ dùng ô màu có ghi hệ số, không dùng icon trang trí |
| Màu luôn đi kèm chữ | Không truyền đạt thông tin chỉ bằng màu | Nhãn hệ ghi tên hệ; ô hệ số ghi `x2`, `x½` |
| Một nguồn token | Không viết mã màu trực tiếp trong component | Dùng `bg-type-fire`, không dùng `bg-[#EE8130]` |
| Mobile trước | Thiết kế ở 375 px rồi mở rộng | Bộ lọc Omni-Dex là ngăn kéo trên mobile, cột bên trái trên desktop |

---

## Phần 2. Design token

### I. Màu ngữ nghĩa

| Token | Light | Dark (Could) | Dùng cho | Tương phản (light / dark) |
|---|---|---|---|---|
| `bg` | `#F8FAFC` | `#0B1120` | Nền trang | |
| `surface` | `#FFFFFF` | `#111827` | Card, dialog, header | |
| `surface-muted` | `#F1F5F9` | `#1F2937` | Nền phụ, hàng xen kẽ, ô hệ số x1 | |
| `border` | `#E2E8F0` | `#334155` | Viền trang trí, đường phân cách | Không yêu cầu |
| `border-strong` | `#64748B` | `#94A3B8` | Viền ô nhập, checkbox | Tối thiểu 3:1 |
| `text` | `#0F172A` | `#F1F5F9` | Chữ chính | 17.85 / 16.19 trên `surface` |
| `text-muted` | `#475569` | `#94A3B8` | Chữ phụ, nhãn | 7.58 / 6.92 trên `surface` |
| `primary` | `#4F46E5` | `#818CF8` | Nút chính, link, focus, series trái của radar | 6.29 / 5.95 trên `surface` |
| `primary-hover` | `#4338CA` | `#A5B4FC` | Hover nút chính | |
| `on-primary` | `#FFFFFF` | `#0B1120` | Chữ trên nền `primary` | 6.29 / 6.31 |
| `accent` | `#C2410C` | `#FB923C` | Series phải của radar, điểm nhấn thứ hai | 5.18 trên `surface` (light) |
| `success` | `#15803D` | `#4ADE80` | Điểm đội tăng, lưu thành công | 5.02 / 10.18 |
| `warning` | `#B45309` | `#FBBF24` | Cảnh báo nhẹ | 5.02 / 10.63 |
| `danger` | `#DC2626` | `#F87171` | Lỗi, lỗ hổng nghiêm trọng | 4.83 / 6.41 |
| `focus-ring` | `#6366F1` | `#A5B4FC` | Vòng focus 2 px, cách 2 px | |

- Cặp màu radar `primary` (chàm) và `accent` (cam) phân biệt được với người mù màu đỏ-lục.
- `border-strong` ở light là `#64748B` (4.76:1). Màu `#94A3B8` chỉ đạt 2.56:1 trên nền trắng nên không dùng cho viền ô nhập ở light.

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
- Ô x4 và x0 thêm chữ đậm (`font-semibold`) để nổi bật hơn ô x2 và x½.

### IV. Thang mức hở của đội (pressure)

| Mức | Điều kiện | Nền | Chữ | Tương phản |
|---|---|---|---|---|
| An toàn | `pressure = 0` | `#F1F5F9` | `#0F172A` | 16.30 |
| Thấp | 1-2 | `#FED7AA` | `#0F172A` | 13.19 |
| Trung bình | 3-4 | `#FB923C` | `#0F172A` | 7.89 |
| Cao | từ 5 trở lên | `#B91C1C` | `#FFFFFF` | 6.47 |

- Hệ có `criticalHole = true` có thêm nhãn "Lỗ hổng" (nền `danger`, chữ trắng, tương phản 4.83) và viền trái 4 px, không chỉ dựa vào màu nền. Không đặt chữ màu `danger` trực tiếp trên nền pressure vì tương phản dưới 4.5:1.

### V. Typography

| Token | Cỡ / line-height | Weight | Dùng cho |
|---|---|---|---|
| `text-xs` | 12 / 16 px | 500 | Nhãn hệ cỡ nhỏ, chú thích |
| `text-sm` | 14 / 20 px | 400, 500 | Chữ phụ, ô bảng, nhãn form |
| `text-base` | 16 / 24 px | 400 | Nội dung chính |
| `text-lg` | 18 / 28 px | 600 | Tiêu đề card |
| `text-xl` | 20 / 28 px | 600 | Tiêu đề section |
| `text-2xl` | 24 / 32 px | 700 | Tiêu đề trang (mobile) |
| `text-3xl` | 30 / 36 px | 700 | Tiêu đề trang (desktop), tên Pokémon ở trang chi tiết |

- Font: **Be Vietnam Pro** (hỗ trợ đầy đủ dấu tiếng Việt), weight 400, 500, 600, 700, tự host qua `@fontsource/be-vietnam-pro` ([assets.md](assets.md)). Dự phòng: `ui-sans-serif, system-ui, sans-serif`.
- Số liệu (chỉ số, BST, điểm, hệ số) dùng `tabular-nums` để các cột số thẳng hàng.
- Không dùng chữ in hoa toàn bộ cho câu dài; nhãn hệ viết hoa chữ cái đầu (`Fire`).

### VI. Khoảng cách, bo góc, đổ bóng, chuyển động

| Nhóm | Token |
|---|---|
| Khoảng cách | Thang 4 px mặc định của Tailwind. Dùng chủ yếu: 1 (4), 2 (8), 3 (12), 4 (16), 6 (24), 8 (32), 12 (48) |
| Lề trang | 16 px ở mobile, 24 px từ `md`, 32 px từ `xl` |
| Bo góc | `rounded-md` 6 px (nút, ô nhập), `rounded-lg` 8 px (card), `rounded-xl` 12 px (dialog), `rounded-full` (nhãn hệ) |
| Đổ bóng | `shadow-sm` cho card; `shadow-lg` cho dialog, dropdown. Dark mode thay bóng bằng viền `border` |
| Lớp (z-index) | Header 40, dropdown 45, dialog 50, toast 60 |
| Chuyển động | 150 ms `ease-out` cho hover, focus; 200 ms cho dialog, ngăn kéo. Tắt khi `prefers-reduced-motion: reduce` |

### VII. Breakpoint và lưới

| Breakpoint | Từ | Cột lưới Omni-Dex | Ghi chú |
|---|---|---|---|
| mặc định | 0 | 2 | Kiểm tra ở 375 px |
| `sm` | 640 px | 3 | |
| `md` | 768 px | 4 | Bộ lọc vẫn là ngăn kéo |
| `lg` | 1024 px | 4 + cột lọc 256 px | Bộ lọc thành cột bên trái |
| `xl` | 1280 px | 6 + cột lọc | Kiểm tra ở 1440 px |

- Nội dung tối đa 1280 px (`max-w-7xl`), canh giữa.
- Kích thước trang 24 chia hết cho 2, 3, 4 và 6, nên hàng cuối luôn đầy ở mọi breakpoint.

---

## Phần 3. Cài đặt token với Tailwind CSS 4

### I. File `src/styles/index.css`

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

:root {
  --pn-bg: #F8FAFC;
  --pn-surface: #FFFFFF;
  --pn-surface-muted: #F1F5F9;
  --pn-border: #E2E8F0;
  --pn-border-strong: #64748B;
  --pn-text: #0F172A;
  --pn-text-muted: #475569;
  --pn-primary: #4F46E5;
  --pn-primary-hover: #4338CA;
  --pn-on-primary: #FFFFFF;
  --pn-accent: #C2410C;
  --pn-success: #15803D;
  --pn-warning: #B45309;
  --pn-danger: #DC2626;
  --pn-focus-ring: #6366F1;
}

.dark {
  --pn-bg: #0B1120;
  --pn-surface: #111827;
  --pn-surface-muted: #1F2937;
  --pn-border: #334155;
  --pn-border-strong: #94A3B8;
  --pn-text: #F1F5F9;
  --pn-text-muted: #94A3B8;
  --pn-primary: #818CF8;
  --pn-primary-hover: #A5B4FC;
  --pn-on-primary: #0B1120;
  --pn-accent: #FB923C;
  --pn-success: #4ADE80;
  --pn-warning: #FBBF24;
  --pn-danger: #F87171;
  --pn-focus-ring: #A5B4FC;
}

@theme inline {
  --color-bg: var(--pn-bg);
  --color-surface: var(--pn-surface);
  --color-surface-muted: var(--pn-surface-muted);
  --color-border: var(--pn-border);
  --color-border-strong: var(--pn-border-strong);
  --color-text: var(--pn-text);
  --color-text-muted: var(--pn-text-muted);
  --color-primary: var(--pn-primary);
  --color-primary-hover: var(--pn-primary-hover);
  --color-on-primary: var(--pn-on-primary);
  --color-accent: var(--pn-accent);
  --color-success: var(--pn-success);
  --color-warning: var(--pn-warning);
  --color-danger: var(--pn-danger);
  --color-focus-ring: var(--pn-focus-ring);
}

@theme {
  --font-sans: "Be Vietnam Pro", ui-sans-serif, system-ui, sans-serif;

  --color-type-normal: #A8A77A;
  --color-type-fire: #EE8130;
  --color-type-water: #6390F0;
  --color-type-electric: #F7D02C;
  --color-type-grass: #7AC74C;
  --color-type-ice: #96D9D6;
  --color-type-fighting: #C22E28;
  --color-type-poison: #A33EA1;
  --color-type-ground: #E2BF65;
  --color-type-flying: #A98FF3;
  --color-type-psychic: #F95587;
  --color-type-bug: #A6B91A;
  --color-type-rock: #B6A136;
  --color-type-ghost: #735797;
  --color-type-dragon: #6F35FC;
  --color-type-dark: #705746;
  --color-type-steel: #B7B7CE;
  --color-type-fairy: #D685AD;

  --color-mult-0: #1E293B;
  --color-mult-025: #1D4ED8;
  --color-mult-05: #93C5FD;
  --color-mult-1: #F1F5F9;
  --color-mult-2: #FDBA74;
  --color-mult-4: #C2410C;

  --color-pressure-safe: #F1F5F9;
  --color-pressure-low: #FED7AA;
  --color-pressure-mid: #FB923C;
  --color-pressure-high: #B91C1C;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
}
```

- `@theme` sinh class tiện ích từ biến: `--color-type-fire` thành `bg-type-fire`, `text-type-fire`, `border-type-fire`.
- `@theme inline` dùng cho token ngữ nghĩa vì giá trị của chúng là `var(...)` đổi theo class `.dark`.
- `@custom-variant dark` cho phép bật dark mode bằng class `.dark` trên thẻ `<html>`, thay vì chỉ theo cài đặt hệ điều hành.
- Cú pháp viết theo Tailwind 4.x; khi khởi tạo (T203) cần đối chiếu lại tài liệu chính thức của bản cài đặt.

---

## Phần 4. Component

### I. Component nền (`components/ui`)

| Component | Biến thể | Trạng thái | Ghi chú accessibility |
|---|---|---|---|
| `Button` | `primary`, `secondary` (viền), `ghost`, `danger`; cỡ `sm` (32 px), `md` (40 px) | hover, focus, disabled, loading | `loading` giữ nguyên độ rộng, đặt `aria-busy`; nút chỉ có icon phải có `aria-label` |
| `Card` | `default`, `interactive` (có hover, toàn card là link) | hover, focus | Card dạng link dùng thẻ `<a>`, không gắn `onClick` lên `<div>` |
| `Dialog` | `default`, `confirm` | open, closing | Bẫy focus, `Esc` để đóng, trả focus về nút mở |
| `Skeleton` | `text`, `rect`, `circle` | | `aria-hidden`; vùng cha đặt `aria-busy="true"` |
| `EmptyState` | | | Tiêu đề, mô tả, tối đa 1 hành động |
| `ErrorState` | `inline`, `page` | | Thông điệp từ `errorMessages.ts`, nút "Thử lại" |
| `Toast` | `success`, `error` | | `role="status"`, tự ẩn sau 4 giây, có nút đóng |
| `Pagination` | | trang hiện tại, disabled | `nav` có `aria-label="Phân trang"`, trang hiện tại có `aria-current="page"` |

### II. Component Pokémon (`components/pokemon`)

| Component | Props chính | Hiển thị | Quy tắc |
|---|---|---|---|
| `TypeBadge` | `type`, `size: sm \| md` | Viên thuốc màu hệ, chữ tên hệ | Màu chữ theo bảng Phần 2, mục II; luôn có chữ |
| `StatBar` | `label`, `value`, `max = 255` | Nhãn, số, thanh ngang | Số luôn hiển thị; thanh chỉ là minh họa. Màu thanh: dưới 60 cam, 60-89 vàng, 90-119 xanh lục, từ 120 xanh dương |
| `MultiplierCell` | `multiplier` | Ô vuông 40 px có nhãn `x2` | Màu theo Phần 2, mục III; `title` mô tả đầy đủ, ví dụ "Rock gây x4" |
| `PokemonSprite` | `id`, `name`, `variant: sprite \| artwork`, `size` | Ảnh Pokémon | Đặt sẵn `width`, `height`; `loading="lazy"`; `alt` là tên Pokémon; fallback theo [assets.md](assets.md), Phần 5 |
| `PokemonCard` | `pokemon: PokemonSummary` | Sprite, số Pokédex `#0006`, tên, nhãn hệ, BST | Toàn card là link tới trang chi tiết |
| `PokemonSearchBox` | `onSelect`, `excludeIds` | Ô nhập và danh sách gợi ý | Mẫu ARIA combobox; debounce 250 ms; từ 2 ký tự; điều khiển bằng mũi tên, `Enter`, `Esc` |

### III. Component tính năng

| Component | Trang | Quy tắc chính |
|---|---|---|
| `DexFilters` | Omni-Dex | Chọn tối đa 2 hệ (chọn hệ thứ 3 thì vô hiệu hóa các hệ còn lại); mọi thay đổi ghi lên URL; nút "Xóa bộ lọc" |
| `DefenseGrid` | Chi tiết | 18 `MultiplierCell` nhóm theo mức: Yếu, Kháng, Miễn nhiễm, Trung tính |
| `TypeMatrixTable` | Tương khắc | `<table>`, hàng là hệ tấn công, cột là hệ phòng thủ; hàng và cột tiêu đề cố định khi cuộn |
| `CompareRadar` | So sánh | 6 trục; series trái `primary`, series phải `accent`; có chú thích tên hai Pokémon |
| `VerdictPanel` | So sánh | 3 dòng kết luận, mỗi dòng nêu bên thắng và con số |
| `TeamSlots` | Team Builder | 5 slot chọn và 1 slot đề xuất; slot trống có nút "Thêm Pokémon" |
| `WeaknessHeatmap` | Team Builder | `<table>` 18 hàng; cột: hệ, từng thành viên, số yếu, số kháng, mức hở; hàng `criticalHole` có nhãn "Lỗ hổng" |
| `TeamScoreGauge` | Team Builder | Số điểm 0-100 cỡ `text-3xl` kèm thanh ngang; thay đổi so với lần trước hiển thị `+12` màu `success` |
| `RecommendationCard` | Team Builder | Sprite, tên, nhãn hệ, điểm phù hợp, danh sách lý do, nút "Thêm vào đội" |
| `SaveTeamDialog` | Team Builder | Ô tên đội (1-60 ký tự); lưu xong hiện link chia sẻ và nút "Sao chép" |

---

## Phần 5. Pattern

### I. Trạng thái dữ liệu

| Trạng thái | Cách hiển thị | Không làm |
|---|---|---|
| Đang tải lần đầu | `Skeleton` cùng bố cục với nội dung thật (ví dụ 24 card xám) | Spinner giữa trang trắng |
| Đang tải lại (đổi bộ lọc) | Giữ dữ liệu cũ, giảm độ mờ còn 60%, thanh tiến trình mảnh dưới header | Xóa trắng lưới |
| Rỗng | `EmptyState`: "Không có Pokémon nào khớp bộ lọc" và nút "Xóa bộ lọc" | Để vùng trống không giải thích |
| Lỗi mạng hoặc 5xx | `ErrorState` kèm nút "Thử lại" | Hiển thị `detail` kỹ thuật |
| 404 | `NotFoundPage` có link về Omni-Dex | Trang trắng |
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

---

## Phần 6. Bố cục trang

### I. Khung chung

```text
+--------------------------------------------------------------+
| [Logo] PokeNexus   Pokédex  Tương khắc  So sánh  Xây đội    |  Header 56 px, cố định
+--------------------------------------------------------------+
|                    Nội dung (max-w-7xl)                      |
+--------------------------------------------------------------+
| Nguồn dữ liệu PokéAPI · Miễn trừ bản quyền · GitHub         |  Footer
+--------------------------------------------------------------+
```

- Mobile: menu điều hướng gom vào nút "Menu" mở ngăn kéo từ phải.

### II. Từng trang

| Trang | Mobile (375 px) | Desktop (1440 px) |
|---|---|---|
| Omni-Dex | Nút "Bộ lọc (2)" mở ngăn kéo; ô sắp xếp; lưới 2 cột; phân trang | Cột lọc trái 256 px; lưới 6 cột; tổng số kết quả trên lưới |
| Chi tiết | Artwork, tên, nhãn hệ; chỉ số; lưới phòng thủ 3 cột; các dạng | Hai cột: trái artwork và thông tin, phải chỉ số và lưới phòng thủ 6 cột |
| Tương khắc | Chọn 1-2 hệ phòng thủ, kết quả dạng danh sách; ma trận cuộn ngang trong khung | Ma trận 18 x 18 đầy đủ, bộ chọn hệ kép phía trên |
| So sánh | Hai ô tìm kiếm xếp dọc; radar; kết luận | Hai ô tìm kiếm hai bên, radar ở giữa, kết luận bên dưới |
| Team Builder | Slot dạng lưới 3 x 2; điểm đội; heatmap cuộn ngang, cột hệ cố định; đề xuất xếp dọc | Trái: slot và điểm; giữa: heatmap; phải: 3 thẻ đề xuất |
| Đội chia sẻ | Tên đội, 6 slot chỉ đọc, heatmap, nút "Mở trong Team Builder" | Như mobile, rộng hơn |

- Wireframe chi tiết lưu ở `docs/wireframes/` (task T103). Bố cục ở bảng trên là yêu cầu đầu vào của wireframe.
- Bảng rộng (heatmap, ma trận) chỉ cuộn ngang bên trong khung của bảng, trang không bao giờ cuộn ngang.

---

## Phần 7. Accessibility

### I. Danh sách yêu cầu

| Yêu cầu | Tiêu chí kiểm tra |
|---|---|
| Tương phản | Chữ tối thiểu 4.5:1; thành phần giao diện (viền ô nhập, vòng focus) tối thiểu 3:1 |
| Không chỉ dùng màu | Mọi ô màu có nhãn chữ hoặc số |
| Bàn phím | Dùng hết chức năng bằng `Tab`, `Enter`, `Space`, `Esc`, phím mũi tên; thứ tự focus theo thứ tự đọc |
| Focus rõ ràng | Vòng `focus-ring` 2 px ở mọi phần tử tương tác; không xóa `outline` mà không thay thế |
| Ngữ nghĩa | `<html lang="vi">`; bảng dữ liệu dùng `<table>`, `<th scope>`; một `<h1>` mỗi trang |
| Ảnh | `alt` là tên Pokémon; ảnh trang trí dùng `alt=""` |
| Vùng chạm | Phần tử tương tác tối thiểu 40 x 40 px trên mobile |
| Chuyển động | Tôn trọng `prefers-reduced-motion` |
| Thông báo động | Kết quả phân tích cập nhật thì đọc tóm tắt qua vùng `aria-live="polite"`, ví dụ "Điểm đội 62, có 1 lỗ hổng" |

- Kiểm tra ở T309 bằng Lighthouse (mục Accessibility, mục tiêu tối thiểu 90) và kiểm thử thủ công bằng bàn phím.

---

## Phần 8. Dark mode (Could)

### I. Các bước khi triển khai

- Token đã có ở Phần 3; chỉ cần thêm nút chuyển theme ở header, lưu lựa chọn vào `localStorage`, mặc định theo `prefers-color-scheme`.
- Áp class `.dark` lên `<html>` trước khi React render (script nhỏ trong `index.html`) để tránh nháy màu.
- Kiểm tra lại: nhãn hệ, ô hệ số, heatmap giữ nguyên màu nền nên không cần đổi; radar dùng `accent` bản dark.

---

## Phần 9. Checklist cho PR giao diện

- Không có mã màu, cỡ chữ viết trực tiếp ngoài token.
- Đã xử lý đủ trạng thái tải, rỗng, lỗi.
- Đã kiểm tra ở 375 px và 1440 px, trang không cuộn ngang.
- Đi hết luồng bằng bàn phím, focus luôn nhìn thấy được.
- Ảnh chụp màn hình mobile và desktop có trong PR.
