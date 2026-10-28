# PokeNexus

**Ultimate Encyclopedia & VGC Meta Hub** - bách khoa toàn thư Pokémon kiêm công cụ xây dựng và phân tích đội hình cho thể thức đấu đôi VGC.

https://github.com/Nha-Cong-Dong/PokeNexus

---

## Phần 1. Giới thiệu

### I. Vấn đề

- Dữ liệu Pokémon nằm rải rác: một trang tra chỉ số, một trang xem tương khắc hệ, một công cụ khác để kiểm tra đội hình.
- Bảng tương khắc 18 x 18 hệ khó nhớ, người chơi mới không biết vì sao đội hình của mình thua.
- Người chơi VGC mất nhiều thời gian kiểm tra thủ công điểm yếu chung của cả đội.

### II. Giải pháp

- Một nơi duy nhất để tra cứu, so sánh, xây đội và phân tích.
- **Synergy Analyzer** chỉ ra lỗ hổng phòng thủ của đội và đề xuất Pokémon lấp lỗ hổng, kèm lý do cụ thể.

### III. Người dùng mục tiêu

| Nhóm                | Nhu cầu chính                                  |
| ------------------- | ---------------------------------------------- |
| Người chơi mới      | Tra cứu nhanh, hiểu hệ nào khắc hệ nào         |
| Người chơi VGC      | Kiểm tra lỗ hổng đội hình, tìm Pokémon bổ sung |
| Người thích số liệu | So sánh chỉ số, xem thống kê                   |

---

## Phần 2. Tính năng

### I. Phạm vi MVP

| Tính năng                        | Mô tả                                                                                 |
| -------------------------------- | ------------------------------------------------------------------------------------- |
| Omni-Dex                         | Tra cứu Pokémon, lọc theo Hệ, Thế hệ, Chỉ số; phân trang; trạng thái lọc lưu trên URL |
| Chi tiết Pokémon                 | Chỉ số gốc, hệ, bảng phòng thủ 18 hệ, các dạng (form)                                 |
| Bảng tương khắc                  | Ma trận 18 x 18 tương tác, hỗ trợ tra hệ kép                                          |
| Bàn Cân Sức Mạnh                 | So sánh 2 Pokémon bằng biểu đồ Radar và kết luận tự động                              |
| Team Builder và Synergy Analyzer | Chọn tối đa 5 Pokémon, xem ma trận điểm yếu, nhận 3 đề xuất cho vị trí thứ 6          |
| Lưu và chia sẻ đội hình          | Lưu đội không cần đăng nhập, chia sẻ bằng đường dẫn                                   |
| Trang Tổng quan                  | Giới thiệu, lối vào 4 công cụ, vòng tương khắc, Pokémon hôm nay, câu đố hệ số         |

- Tiến độ từng tính năng: Phần 7.

### II. Mở rộng (sau MVP)

- Cây tiến hóa tương tác.
- Bảng tốc độ (Speed Tier) ở cấp 50, có tùy chọn Tailwind, Trick Room.
- Nhập và xuất đội hình theo định dạng văn bản của Pokémon Showdown.
- Tính chỉ số thực theo EV, IV, Nature.

### III. Hướng phát triển

- Đăng nhập, danh sách yêu thích, thư viện đội công khai.
- Chiêu thức và độ phủ tấn công theo chiêu thực tế, tính sát thương.
- World Explorer: vùng đất, Gym Leader.

---

## Phần 3. Công nghệ

| Tầng     | Công nghệ                                                                                                               |
| -------- | ----------------------------------------------------------------------------------------------------------------------- |
| Frontend | React, TypeScript, Vite, Tailwind CSS, TanStack Query, React Router, Recharts                                           |
| Backend  | Java 25 (LTS), Spring Boot 4.1, Spring Web MVC, Spring Data JPA (Hibernate), Bean Validation, Flyway, springdoc-openapi |
| Database | MySQL 8.4 (LTS)                                                                                                         |
| Dữ liệu  | PokéAPI (nạp một lần từ bộ CSV công khai, không gọi API lúc chạy)                                                       |
| Hạ tầng  | Docker Compose, GitHub Actions                                                                                          |

- Lý do lựa chọn các công nghệ chính được ghi trong [docs/adr](docs/adr).

---

## Phần 4. Kiến trúc tổng quan

```text
Trình duyệt (React + TypeScript)
        |  REST / JSON
        v
Spring Boot API  (Controller -> Service -> Repository)
        |                 |
        |                 +-- Cache trong bộ nhớ: bảng tương khắc, hồ sơ phòng thủ Pokémon
        v
     MySQL 8.4  <-- Flyway migration + dữ liệu nạp từ CSV của PokéAPI
```

- Chi tiết: [docs/architecture.md](docs/architecture.md), [docs/database.md](docs/database.md), [docs/api.md](docs/api.md).

---

## Phần 5. Cài đặt và chạy

### I. Yêu cầu

| Công cụ                  | Phiên bản                  |
| ------------------------ | -------------------------- |
| JDK                      | 25                         |
| Node.js                  | 24 LTS (xem file `.nvmrc`) |
| Docker và Docker Compose | Bản ổn định mới nhất       |
| Git                      | 2.40 trở lên               |

### II. Khởi động cơ sở dữ liệu

```bash
git clone https://github.com/Nha-Cong-Dong/PokeNexus.git
cd PokeNexus
cp .env.example .env
docker compose up -d mysql
docker compose ps
```

- Sửa `DB_PASSWORD` và `DB_ROOT_PASSWORD` trong `.env` trước khi chạy. File `.env` không được commit.
- Công cụ quản trị DB trên trình duyệt (Adminer): `docker compose --profile tools up -d`, sau đó mở `http://localhost:8081`.

### III. Chuẩn bị dữ liệu

- Tải bộ CSV của PokéAPI vào `data/csv/` theo hướng dẫn tại [data/README.md](data/README.md).

### IV. Backend và Frontend

- Backend: chạy trong `backend/` theo [backend/README.md](backend/README.md), Phần 2. Lần khởi động đầu tự nạp CSV vào MySQL; Swagger UI ở `http://localhost:8080/swagger-ui.html`.
- Frontend: chạy trong `frontend/` theo [frontend/README.md](frontend/README.md), Phần 2; dev server ở `http://localhost:5173`.
- Chạy backend bằng Docker, không cần cài JDK: `docker compose --profile app up -d --build` dựng image từ `backend/Dockerfile` và chạy cùng MySQL ở `http://localhost:8080`. Container đọc CSV trong `data/csv/` và tự nạp khi DB còn trống. Dừng bằng `docker compose --profile app down`.

---

## Phần 6. Cấu trúc thư mục

```text
pokenexus/
├── backend/                Spring Boot API
├── frontend/               React + TypeScript (Vite)
├── data/                   Dữ liệu nguồn (CSV PokéAPI, không commit file CSV)
├── docs/                   Tài liệu sản phẩm, đặc tả, kiến trúc, ADR
├── scripts/                Script tải dữ liệu, sprite, sao lưu DB
├── .github/                Issue template, PR template, CI, Dependabot
├── docker-compose.yml      MySQL và công cụ phát triển
├── .env.example            Mẫu biến môi trường
├── CONTRIBUTING.md         Quy trình làm việc, quy ước commit và nhánh
├── CHANGELOG.md            Lịch sử thay đổi
├── PLAN.md                 Tiến độ tuần hiện tại
└── CLAUDE.md               Hướng dẫn cho Claude Code (kèm .claude/)
```

- Chi tiết đến cấp package và file: [docs/folder-structure.md](docs/folder-structure.md).

---

## Phần 7. Lộ trình

| Mốc    | Nội dung                                                 | Trạng thái                        |
| ------ | -------------------------------------------------------- | --------------------------------- |
| Tuần 1 | Nghiên cứu, ý tưởng, khởi tạo repo và tài liệu           | Hoàn thành (T105 cắt giảm)        |
| Tuần 2 | Chốt đặc tả, dựng khung backend, frontend, cơ sở dữ liệu | Hoàn thành, tag `v0.1.0`          |
| Tuần 3 | Xây dựng MVP                                             | Đang thực hiện (8 trang đã chạy)  |
| Tuần 4 | Hoàn thiện, triển khai, demo                             | Kế hoạch                          |

- Chi tiết: [docs/roadmap.md](docs/roadmap.md).

---

## Phần 8. Tài liệu

- Mục lục toàn bộ tài liệu (sản phẩm, đặc tả, kiến trúc, database, API, giao diện, quy trình, ADR) và bảng "muốn làm gì thì xem ở đâu": [docs/README.md](docs/README.md).

---

## Phần 9. Thông tin khác

### I. Đóng góp

- Quy trình làm việc, quy ước nhánh và commit: [CONTRIBUTING.md](CONTRIBUTING.md).

### II. Giấy phép

- Mã nguồn và tài liệu phát hành theo giấy phép [MIT](LICENSE).

### III. Miễn trừ và nguồn dữ liệu

- Pokémon cùng tên gọi, nhân vật, hình ảnh liên quan là thương hiệu của Nintendo, Game Freak và The Pokémon Company.
- PokeNexus là dự án phi thương mại của người hâm mộ, không liên kết hay được bảo trợ bởi các công ty trên.
- Dữ liệu và hình ảnh lấy từ [PokéAPI](https://pokeapi.co), tuân theo giấy phép của PokéAPI.

### IV. Tác giả

- Nguyễn Quốc Khánh - Full-stack
  - GitHub: https://github.com/NgQKhanh2906
  - Email: nguyenqkhanhlc2006@gmail.com
