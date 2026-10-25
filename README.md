# PokeNexus

**Ultimate Encyclopedia & VGC Meta Hub** - bách khoa toàn thư Pokémon kiêm công cụ xây dựng và phân tích đội hình cho thể thức đấu đôi VGC.

https://github.com/Nha-Cong-Dong/PokeNexus

> Trạng thái: **Tuần 1 - Khởi tạo dự án.** Repo hiện chứa tài liệu và cấu hình; mã nguồn backend và frontend được khởi tạo ở Tuần 2.

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

| Tính năng                        | Mô tả                                                                                 | Trạng thái |
| -------------------------------- | ------------------------------------------------------------------------------------- | ---------- |
| Omni-Dex                         | Tra cứu Pokémon, lọc theo Hệ, Thế hệ, Chỉ số; phân trang; trạng thái lọc lưu trên URL | Kế hoạch   |
| Chi tiết Pokémon                 | Chỉ số gốc, hệ, bảng phòng thủ 18 hệ, các dạng (form)                                 | Kế hoạch   |
| Bảng tương khắc                  | Ma trận 18 x 18 tương tác, hỗ trợ tra hệ kép                                          | Kế hoạch   |
| Bàn Cân Sức Mạnh                 | So sánh 2 Pokémon bằng biểu đồ Radar và kết luận tự động                              | Kế hoạch   |
| Team Builder và Synergy Analyzer | Chọn tối đa 5 Pokémon, xem ma trận điểm yếu, nhận 3 đề xuất cho vị trí thứ 6          | Kế hoạch   |
| Lưu và chia sẻ đội hình          | Lưu đội không cần đăng nhập, chia sẻ bằng đường dẫn                                   | Kế hoạch   |

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

- Hướng dẫn chạy sẽ được bổ sung khi khởi tạo mã nguồn ở Tuần 2. Xem [backend/README.md](backend/README.md) và [frontend/README.md](frontend/README.md).

---

## Phần 6. Cấu trúc thư mục

```text
pokenexus/
├── backend/                Spring Boot API
├── frontend/               React + TypeScript (Vite)
├── data/                   Dữ liệu nguồn (CSV PokéAPI, không commit file CSV)
├── docs/                   Tài liệu sản phẩm, đặc tả, kiến trúc, ADR
├── scripts/                Script tải dữ liệu, sprite, sao lưu DB (tạo ở Tuần 2)
├── .github/                Issue template, PR template, CI, Dependabot
├── docker-compose.yml      MySQL và công cụ phát triển
├── .env.example            Mẫu biến môi trường
├── CONTRIBUTING.md         Quy trình làm việc, quy ước commit và nhánh
├── CHANGELOG.md            Lịch sử thay đổi
├── MAP.md                  Bản đồ: muốn làm gì thì đọc, sửa ở đâu
├── SPEC.md                 Bảng truy vết tính năng, endpoint, trang, task, test
├── PLAN.md                 Tiến độ tuần hiện tại
└── CLAUDE.md, AGENTS.md    Hướng dẫn cho AI agent (kèm .claude/)
```

- Chi tiết đến cấp package và file: [docs/folder-structure.md](docs/folder-structure.md).

---

## Phần 7. Lộ trình

| Mốc    | Nội dung                                                 | Trạng thái                        |
| ------ | -------------------------------------------------------- | --------------------------------- |
| Tuần 1 | Nghiên cứu, ý tưởng, khởi tạo repo và tài liệu           | Xong một phần (còn Project board) |
| Tuần 2 | Chốt đặc tả, dựng khung backend, frontend, cơ sở dữ liệu | Hoàn thành, tag `v0.1.0`          |
| Tuần 3 | Xây dựng MVP                                             | Đang thực hiện (Omni-Dex đã xong) |
| Tuần 4 | Hoàn thiện, triển khai, demo                             | Kế hoạch                          |

- Chi tiết: [docs/roadmap.md](docs/roadmap.md).

---

## Phần 8. Tài liệu

| Tài liệu                                     | Nội dung                                      |
| -------------------------------------------- | --------------------------------------------- |
| [docs/product.md](docs/product.md)           | Tầm nhìn, người dùng, user story              |
| [docs/spec.md](docs/spec.md)                 | Đặc tả MVP, tiêu chí chấp nhận                |
| [docs/roadmap.md](docs/roadmap.md)           | Lộ trình 4 tuần, task theo ngày               |
| [docs/architecture.md](docs/architecture.md) | Kiến trúc, luồng xử lý, thuật toán, triển khai |
| [docs/database.md](docs/database.md)         | ERD, từ điển dữ liệu, migration               |
| [docs/api.md](docs/api.md)                   | Đặc tả REST API, schema DTO, mã lỗi           |
| [docs/folder-structure.md](docs/folder-structure.md) | Cấu trúc thư mục, quy tắc đặt tên     |
| [docs/design-system.md](docs/design-system.md) | Design System, UI Guidelines                |
| [docs/assets.md](docs/assets.md)             | Kế hoạch quản lý assets                       |
| [docs/git-workflow.md](docs/git-workflow.md) | Quy trình nhánh, commit, PR, phát hành        |
| [docs/github-setup.md](docs/github-setup.md) | Thiết lập repo, nhãn, milestone, bảo vệ nhánh |
| [docs/adr](docs/adr)                         | Các quyết định kiến trúc                      |

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
