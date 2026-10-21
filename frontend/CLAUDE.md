# PokeNexus Frontend - Hướng dẫn cho Claude

- Nạp khi làm việc trong `frontend/`. Bổ sung cho `CLAUDE.md` ở gốc, không lặp lại quy tắc chung.
- Trạng thái: đã khởi tạo khung ở T203. Phiên bản thư viện và lý do giữ TypeScript 6.0: [README.md](README.md), Phần 1.
- Route khai báo trong `src/app/router.tsx` (mảng `routes`); test route dùng `createMemoryRouter(routes)`. `RouterProvider` cho trình duyệt import từ `react-router/dom`.

---

## Phần 1. Lệnh

### I. Phát triển và kiểm tra

```bash
npm run dev
npm run lint
npm run test
npm run build
npx vitest run src/components/pokemon/TypeBadge.test.tsx
```

- Node.js theo `.nvmrc` ở thư mục gốc (24).
- Trước khi báo hoàn thành, chạy đủ `lint`, `test`, `build` và báo kết quả thật.
- Cài hoặc nâng cấp package (`npm install <pkg>`) phải hỏi trước; package ngoài bảng ở [docs/architecture.md](../docs/architecture.md), Phần 2 cần ghi lý do trong PR.

---

## Phần 2. Cấu trúc

### I. Thư mục

- Cây thư mục và ánh xạ trang, tính năng: [docs/folder-structure.md](../docs/folder-structure.md), Phần 3.
- `features/<ten-kebab>/` chứa `api.ts`, `hooks.ts`, `components/` riêng của tính năng. Component dùng ở từ 2 tính năng trở lên chuyển lên `src/components/`.
- File test đặt cạnh file được test: `TypeBadge.tsx`, `TypeBadge.test.tsx`.

### II. Đặt tên

| Loại | Quy tắc | Ví dụ |
|---|---|---|
| Component, trang | `PascalCase.tsx` | `PokemonCard.tsx` |
| Hook | `useCamelCase.ts` | `useTeamDraft.ts` |
| Tiện ích, API | `camelCase.ts` | `formatters.ts` |
| Kiểu | `PascalCase`, không tiền tố `I` | `PokemonSummary` |

---

## Phần 3. Quy tắc bắt buộc

### I. Dữ liệu và trạng thái

- Không gọi `fetch` trong component. Gọi API qua `src/lib/http.ts`, bọc bằng hook TanStack Query trong `features/<ten>/hooks.ts`.
- Query key và `staleTime` theo [docs/architecture.md](../docs/architecture.md), Phần 6, mục II.
- Bộ lọc, cặp so sánh, đội nháp lưu trên URL. Không thêm thư viện state toàn cục; `useTeamDraft` là state toàn cục duy nhất.
- Kiểu trong `src/types/api.ts` khớp [docs/api.md](../docs/api.md), Phần 3. Đổi API thì sửa cả hai.
- Biến môi trường dùng tiền tố `VITE_` (`VITE_API_BASE_URL`).

### II. Giao diện

- Màu, khoảng cách, font chỉ lấy từ token trong `src/styles/index.css` ([docs/design-system.md](../docs/design-system.md), Phần 2-3). Không viết mã màu trực tiếp như `bg-[#EE8130]`.
- Màu 18 hệ chỉ có một nguồn: `src/lib/pokemonTypes.ts` ánh xạ sang class token.
- Màu luôn đi kèm chữ: nhãn hệ ghi tên hệ, ô hệ số ghi `x2`, `x½`.
- URL ảnh chỉ sinh qua `src/lib/assets.ts`; ảnh dùng `PokemonSprite` có fallback ([docs/assets.md](../docs/assets.md), Phần 5).
- Mọi trang có đủ trạng thái tải, rỗng, lỗi theo [docs/design-system.md](../docs/design-system.md), Phần 5.
- Kiểm tra ở 375 px và 1440 px; điều khiển được bằng bàn phím, focus hiển thị rõ ([docs/design-system.md](../docs/design-system.md), Phần 7).

### III. Lỗi và bảo mật

- Thông điệp lỗi tiếng Việt lấy từ `src/lib/errorMessages.ts` theo `code`; không hiển thị `detail` của `ProblemDetail`.
- Không dùng `dangerouslySetInnerHTML`.
- Không để lại `console.log` khi hoàn thành.

### IV. Ngôn ngữ hiển thị

- Giao diện tiếng Việt; tên Pokémon và tên hệ giữ tiếng Anh. Định dạng số, đơn vị: [docs/design-system.md](../docs/design-system.md), Phần 5, mục III.
