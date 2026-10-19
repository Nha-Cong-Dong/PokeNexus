# PokeNexus Frontend

- Trạng thái: **chưa khởi tạo mã nguồn.** Dự án được tạo ở Tuần 2 ([docs/roadmap.md](../docs/roadmap.md)).

---

## Phần 1. Công nghệ

### I. Thư viện

| Thư viện | Mục đích |
|---|---|
| React + TypeScript | Giao diện |
| Vite | Build và dev server |
| Tailwind CSS | Styling |
| React Router | Định tuyến, đồng bộ bộ lọc lên URL |
| TanStack Query | Gọi API, cache, trạng thái tải và lỗi |
| Recharts | Biểu đồ Radar, cột |
| Vitest + React Testing Library | Kiểm thử component |
| ESLint + Prettier | Kiểm tra và định dạng mã |

---

## Phần 2. Khởi tạo và lệnh dự kiến

### I. Khởi tạo (chạy từ thư mục gốc của repo)

```bash
nvm use
npm create vite@latest frontend -- --template react-ts
```

- Lệnh tạo dự án có thể hỏi có ghi đè thư mục `frontend/` đang có file `README.md` không; giữ lại nội dung README này sau khi tạo.

### II. Lệnh

```bash
npm install
npm run dev
npm run lint
npm run test
npm run build
```

- Biến môi trường: `VITE_API_BASE_URL` (xem `.env.example` ở thư mục gốc). Biến dành cho trình duyệt trong Vite phải có tiền tố `VITE_`.

---

## Phần 3. Cấu trúc dự kiến

### I. Thư mục

- Xem [docs/architecture.md](../docs/architecture.md), Phần 3, mục II.
