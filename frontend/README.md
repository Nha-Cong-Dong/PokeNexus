# PokeNexus Frontend

- Trạng thái: **đã khởi tạo khung (T203, 2026-10-21).** Có `AppLayout` (header, điều hướng, footer), 7 route với trang giữ chỗ, token giao diện Tailwind 4, TanStack Query. Chưa gọi API (bắt đầu từ T301).

---

## Phần 1. Công nghệ

### I. Thư viện

| Thư viện | Phiên bản khởi tạo | Mục đích |
|---|---|---|
| React + TypeScript | React 19.3, TypeScript 6.0 | Giao diện |
| Vite | 8.3 | Build và dev server |
| Tailwind CSS (`@tailwindcss/vite`) | 4.3 | Styling, token qua `@theme` |
| React Router | 8.5 | Định tuyến, đồng bộ bộ lọc lên URL |
| TanStack Query | 5.104 | Gọi API, cache, trạng thái tải và lỗi |
| `@fontsource/be-vietnam-pro` | 5.3 | Font đóng gói, chạy offline |
| Recharts | Chưa cài | Biểu đồ Radar, cột; cài ở T306 khi có biểu đồ đầu tiên |
| Vitest + React Testing Library + jsdom | Vitest 5.0, RTL 16.3 | Kiểm thử component |
| ESLint + typescript-eslint + Prettier | ESLint 10, Prettier 3.9 | Kiểm tra và định dạng mã |

- TypeScript giữ ở 6.0 (bản template Vite pin `~6.0.3`) vì typescript-eslint 8.72 chỉ hỗ trợ TypeScript dưới 6.1.
- Template Vite hiện dùng `oxlint`; dự án thay bằng ESLint theo tài liệu. ESLint chặn `console.log` và `dangerouslySetInnerHTML`.

---

## Phần 2. Lệnh

### I. Phát triển và kiểm tra

```bash
npm install
npm run dev
npm run lint
npm run test
npm run build
npm run format
```

- Node.js theo `.nvmrc` (24). Chạy bằng Node 25 vẫn build được nhưng npm báo `EBADENGINE` cho một số gói của jsdom.
- Biến môi trường đọc từ `.env` ở **thư mục gốc repo** (`envDir: '..'` trong `vite.config.ts`). Biến cho trình duyệt phải có tiền tố `VITE_`, ví dụ `VITE_API_BASE_URL`.
- Dev server chạy ở cổng 5173 (`strictPort`), khớp `CORS_ALLOWED_ORIGINS` mặc định của backend.

---

## Phần 3. Cấu trúc

### I. Thư mục

- Xem [docs/folder-structure.md](../docs/folder-structure.md), Phần 3. Token giao diện và component: [docs/design-system.md](../docs/design-system.md).
- Hiện có `src/app/` (App, router, providers, layout), `src/pages/` (7 trang giữ chỗ), `src/lib/queryClient.ts`, `src/styles/index.css`, `src/test/setup.ts`.
