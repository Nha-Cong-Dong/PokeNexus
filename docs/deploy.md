# PokeNexus - Hướng dẫn triển khai production

- Phiên bản: 1.2 (cập nhật 2026-11-06; Phần 8 mục III: vòng `CF-Connecting-IP` bị edge Cloudflare chặn bằng `403` cũng là đạt, ghi kết quả 06/11)
- Bản 1.1 (2026-11-05; Phần 8: script nghiệm thu `scripts/acceptance-check.mjs`; Phần 9 mục II: keep-alive bằng GitHub Actions đã bật; Phần 8 mục III: kiểm chứng giới hạn lưu đội bằng body có ID Pokémon không tồn tại để không ghi DB, thêm vòng `CF-Connecting-IP`, ghi kết quả 04/11)
- Bản 1.0 (2026-11-02)
- Nền tảng: backend trên Render (gói Free), MySQL trên Aiven (gói Free), frontend trên Cloudflare Pages. Lý do chọn và rủi ro: [ADR 0009](adr/0009-hosting-render-aiven.md). Thiết kế triển khai: [architecture.md](architecture.md), Phần 11.
- Tài liệu này là hướng dẫn thao tác từng bước để một người tự làm từ đầu đến khi có link chạy thật. Giao diện các trang web có thể đổi tên nút đôi chút; nếu không thấy đúng tên, tìm mục có ý nghĩa tương đương.
- Ký hiệu `<AIVEN_HOST>`, `<BACKEND_URL>`... là giá trị bạn tự thay. Lệnh `bash` chạy trong Git Bash, đứng ở thư mục gốc repo.

---

## Phần 1. Tổng quan

### I. Sẽ dựng những gì

```mermaid
flowchart LR
    U["Trình duyệt, điện thoại"] -->|"HTTPS"| FE["Cloudflare Pages<br/>frontend/dist"]
    U -->|"HTTPS /api/v1"| BE["Render Web Service (Free)<br/>Docker từ backend/Dockerfile"]
    BE -->|"JDBC qua TLS"| DB[("Aiven for MySQL (Free)")]
    DEV["Máy dev: scripts/db-dump.sh"] -.->|"nhập dữ liệu một lần"| DB
    GH["GitHub main"] -.->|"tự build"| FE
    GH -.->|"tự build"| BE
```

- Production không đọc CSV: dữ liệu được nạp sẵn ở MySQL local, xuất bằng `scripts/db-dump.sh export`, rồi nhập một lần vào Aiven.
- Backend không tự tạo dữ liệu (profile `prod` tắt ingestion), nên **phải nhập dữ liệu trước khi backend chạy lần đầu**.
- URL backend được nhúng vào frontend lúc build, nên **phải có backend trước khi build frontend**. URL frontend lại cần cho CORS của backend, nên bước cuối là quay lại sửa CORS.

### II. Thứ tự và thời gian

| Bước | Việc | Thời gian ước tính |
|---|---|---|
| 1 | Chuẩn bị máy (Phần 2) | 10 phút |
| 2 | Tạo MySQL trên Aiven (Phần 3) | 10-15 phút |
| 3 | Nhập dữ liệu vào Aiven (Phần 4) | 5 phút |
| 4 | Tạo backend trên Render (Phần 5) | 20-30 phút, build lần đầu 5-15 phút |
| 5 | Tạo frontend trên Cloudflare Pages (Phần 6) | 15-20 phút |
| 6 | Nối CORS (Phần 7) | 5-10 phút |
| 7 | Kiểm tra toàn bộ (Phần 8) | 20-30 phút |
| 8 | Giữ backend không ngủ (Phần 9) | 10 phút |

### III. Bảng ghi chép

- Mở một file ghi chú **ngoài repo** (ví dụ Notepad, không lưu trong thư mục `pokenexus`) và điền dần các giá trị sau.

| Tên | Lấy ở đâu | Dạng giá trị |
|---|---|---|
| `AIVEN_HOST` | Aiven, trang Overview của service | Tên miền kết thúc bằng `aivencloud.com` |
| `AIVEN_PORT` | Như trên | Một số, thường 5 chữ số (không phải 3306) |
| `AIVEN_USER` | Như trên | Thường là `avnadmin` |
| `AIVEN_PASSWORD` | Như trên (bấm biểu tượng hiện hoặc sao chép) | Bí mật |
| `AIVEN_DB` | Như trên | Thường là `defaultdb` |
| `AIVEN_REGION` | Như trên, mục cloud hoặc region | Chuỗi tên nhà cung cấp và vùng |
| `BACKEND_URL` | Render, đầu trang service | `https://<tên service>.onrender.com` |
| `PAGES_URL` | Cloudflare, trang project | `https://<tên project>.pages.dev` |

### IV. Quy tắc an toàn

- Không dán mật khẩu Aiven vào chat, Issue, PR, commit hay file trong repo.
- `data/dumps/` đã nằm trong `.gitignore`; không `git add -f` file dump.
- Lỡ để lộ mật khẩu: Aiven, service, tab Users, đặt lại mật khẩu của user; rồi sửa `DB_PASSWORD` trên Render (Phần 5, mục III.4).

---

## Phần 2. Bước 1: Chuẩn bị máy

### I. Lấy code mới nhất

```bash
cd /d/Khanh/java/HackathonNCD/pokenexus
git switch main
git pull --ff-only
```

- Đạt khi: lệnh không báo lỗi, `git status` báo `working tree clean`.

### II. Chạy MySQL local

- Mở Docker Desktop, chờ dòng "Engine running".

```bash
docker compose up -d mysql
docker compose ps
```

- Đạt khi: dòng `pokenexus-mysql` có trạng thái `healthy`. Container này vừa là nguồn dữ liệu để xuất, vừa cung cấp sẵn chương trình `mysql` để kết nối tới Aiven, nên máy không cần cài MySQL client.

### III. Kiểm tra DB local đủ dữ liệu

```bash
docker exec pokenexus-mysql sh -c 'MYSQL_PWD="$MYSQL_PASSWORD" mysql -u"$MYSQL_USER" "$MYSQL_DATABASE" -N -e "SELECT COUNT(*) FROM pokemon"'
```

- Đạt khi: in ra `1351`.
- Nếu ra `0` hoặc báo bảng không tồn tại: chạy backend local một lần để nạp CSV theo `README.md`, Phần 5, mục II, rồi kiểm tra lại.

---

## Phần 3. Bước 2: Tạo MySQL trên Aiven

### I. Tạo tài khoản

1. Mở `https://console.aiven.io/signup`.
2. Chọn đăng ký bằng GitHub hoặc Google (nhanh nhất), hoặc bằng email rồi bấm link xác nhận trong hộp thư.
3. Nếu Aiven hỏi tên tổ chức (organization) hoặc dự án (project), đặt `pokenexus`. Nếu hỏi mục đích sử dụng, chọn bất kỳ.
4. Gói Free không cần thẻ. Nếu một màn hình đòi thẻ, bạn đang ở gói trả phí hoặc bản dùng thử: quay lại và chọn đúng gói Free.

### II. Tạo service MySQL

1. Trong project, mở mục **Services**, bấm **Create service**.
2. Chọn **MySQL**.
3. Ở phần chọn gói (service tier, plan), chọn **Free**. Gói Free không cho chọn nhà cung cấp cloud và vùng; Aiven tự gán.
4. Phiên bản MySQL: để mặc định.
5. Service name: `pokenexus-db`.
6. Bấm **Create service** (hoặc **Create free service**).
7. Chờ trạng thái chuyển sang **Running** (khoảng 2-10 phút). Trong lúc chờ có thể làm tiếp Phần 5, mục I (tạo tài khoản Render).

### III. Lấy thông tin kết nối

1. Mở service `pokenexus-db`, tab **Overview**.
2. Ở khối **Connection information**, ghi vào bảng ghi chép: Host, Port, User, Password, Database name.
3. Ghi vùng mà Aiven gán (hiển thị ở Overview, mục cloud hoặc region). Vùng này quyết định vùng của Render ở Phần 5, mục III.3.
4. Không cần sửa mục **Allowed IP addresses**: mặc định cho phép kết nối từ mọi địa chỉ, có mã hóa TLS, đúng cái Render cần. Nếu ô này khác `0.0.0.0/0`, ghi lại giá trị và báo trước khi đổi.

### IV. Thử kết nối từ máy

- Nhập thông tin vào biến của cửa sổ Git Bash. Mật khẩu gõ ở chế độ ẩn, không vào lịch sử lệnh:

```bash
read -rp "Aiven host: " AIVEN_HOST
read -rp "Aiven port: " AIVEN_PORT
read -rp "Aiven user: " AIVEN_USER
read -rp "Aiven database: " AIVEN_DB
read -rsp "Aiven password: " AIVEN_PASSWORD; echo
```

- Các biến chỉ tồn tại trong cửa sổ Git Bash này. Đóng cửa sổ thì chạy lại 5 dòng trên.
- Thử kết nối bằng chương trình `mysql` có sẵn trong container local:

```bash
docker exec -e MYSQL_PWD="$AIVEN_PASSWORD" pokenexus-mysql \
  mysql -h"$AIVEN_HOST" -P"$AIVEN_PORT" -u"$AIVEN_USER" "$AIVEN_DB" \
  -e "SELECT VERSION(); SHOW SESSION STATUS LIKE 'Ssl_cipher';"
```

- Đạt khi: in ra phiên bản bắt đầu bằng `8.`, và dòng `Ssl_cipher` có giá trị (kết nối đã mã hóa).

| Thông báo lỗi | Nguyên nhân | Cách xử lý |
|---|---|---|
| `Access denied for user` | Sai user hoặc mật khẩu | Sao chép lại từ Overview, chạy lại các lệnh `read` |
| `Can't connect to MySQL server` hoặc `Unknown MySQL server host` | Sai host, port, hoặc service chưa Running | Kiểm tra trạng thái service; port lấy từ Overview, không phải 3306 |
| `Unknown database` | Sai tên database | Dùng đúng tên ở Overview (thường `defaultdb`) |
| `Error response from daemon: No such container` | Container local chưa chạy | Làm lại Phần 2, mục II |

---

## Phần 4. Bước 3: Nhập dữ liệu vào Aiven

### I. Xuất dữ liệu từ MySQL local

```bash
bash scripts/db-dump.sh export
```

- Đạt khi: in dòng `Exported static data and an empty teams schema to .../data/dumps/pokenexus.sql (...)`, dung lượng khoảng 150-200 KB.
- File dump gồm toàn bộ dữ liệu Pokémon, bảng lịch sử Flyway và bảng đội **rỗng** (không mang đội đã lưu ở máy lên production).

### II. Nhập vào Aiven

```bash
TARGET_DB_URL="mysql://${AIVEN_USER}:${AIVEN_PASSWORD}@${AIVEN_HOST}:${AIVEN_PORT}/${AIVEN_DB}" \
  bash scripts/db-dump.sh import
```

- Đạt khi: 2 dòng cuối là `pokemon rows: 1351` và `flyway migrations: 3`.

| Thông báo lỗi | Nguyên nhân | Cách xử lý |
|---|---|---|
| `TARGET_DB_URL must look like mysql://user:password@host:port/database` | Biến trống (cửa sổ Git Bash mới) hoặc mật khẩu có ký tự `@` | Chạy lại các lệnh `read` ở Phần 3, mục IV; nếu mật khẩu có `@`, đặt lại mật khẩu trên Aiven |
| `Target database ... already has N tables` | Database đã có bảng (đã nhập một lần) | Chỉ khi muốn nhập lại từ đầu: thêm `FORCE=1` vào đầu lệnh. Nhập lại sẽ **xóa mọi đội đã lưu** trên production |
| `Unable to create or change a table without a primary key` | Aiven bắt mọi bảng có khóa chính | Không mong đợi (mọi bảng V1-V3 đều có khóa chính); chụp lỗi và báo lại |
| Lỗi có chữ `SUPER` hoặc `GTID` | Câu lệnh cần quyền quản trị | Không mong đợi (script đã tắt GTID); chụp lỗi và báo lại |

### III. Kiểm tra lại

```bash
docker exec -e MYSQL_PWD="$AIVEN_PASSWORD" pokenexus-mysql \
  mysql -h"$AIVEN_HOST" -P"$AIVEN_PORT" -u"$AIVEN_USER" "$AIVEN_DB" \
  -e "SHOW TABLES; SELECT COUNT(*) AS teams FROM teams;"
```

- Đạt khi: có 11 bảng (`evolution_chains`, `evolution_links`, `flyway_schema_history`, `generations`, `pokemon`, `regions`, `species`, `team_members`, `teams`, `type_efficacy`, `types`) và `teams` bằng 0.

---

## Phần 5. Bước 4: Backend trên Render

### I. Tạo tài khoản

1. Mở `https://dashboard.render.com/register`.
2. Chọn **GitHub**, đăng nhập GitHub, cho phép Render đọc thông tin tài khoản.
3. Gói Free không cần thẻ. Nếu Render hỏi tên workspace, đặt `pokenexus`.

### II. Kết nối repo

1. Bấm **New** (hoặc **+ New**), chọn **Web Service**.
2. Ở mục nguồn (Source Code), chọn **GitHub**, bấm **Connect GitHub** hoặc **Configure account**.
3. Cửa sổ GitHub hiện ra: chọn organization `Nha-Cong-Dong`, chọn **Only select repositories**, chọn `PokeNexus`, bấm **Install** (hoặc **Save**).
4. Quay lại Render, chọn repo `Nha-Cong-Dong/PokeNexus` trong danh sách.

- Nếu GitHub báo cần chủ organization duyệt: nhờ chủ organization bấm duyệt ở GitHub, Settings của organization, mục GitHub Apps; hoặc dùng cách dự phòng: chọn tab **Public Git Repository**, dán `https://github.com/Nha-Cong-Dong/PokeNexus`. Với cách dự phòng, Render không tự deploy khi có commit mới; mỗi lần cần cập nhật thì bấm **Manual Deploy**, **Deploy latest commit**.

### III. Điền cấu hình

#### 1. Thông tin chung

| Ô | Giá trị | Ghi chú |
|---|---|---|
| Name | `pokenexus-api` | Thành một phần của URL; nếu trùng, Render thêm hậu tố |
| Language (Runtime) | `Docker` | Render build bằng `backend/Dockerfile` |
| Branch | `main` | |
| Region | Xem mục 3 | Không đổi được sau khi tạo |
| Root Directory | `backend` | Docker build context là thư mục này |
| Dockerfile Path | `./Dockerfile` | Tính từ Root Directory; nếu ô mặc định là `Dockerfile` thì giữ nguyên |
| Instance Type | **Free** | 512 MB RAM, ngủ sau 15 phút không có request |

#### 2. Vì sao không cần sửa code

- Dockerfile build jar bằng `./mvnw -DskipTests package` (không cần Docker trong lúc build) và chạy bằng user không phải root.
- Backend đọc cổng từ biến `BACKEND_PORT` (`backend/src/main/resources/application.yml`, `server.port`), đọc DB từ `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, đọc domain được phép gọi API từ `CORS_ALLOWED_ORIGINS`. Tất cả đặt bằng biến môi trường ở mục 4.

#### 3. Chọn vùng (Region)

- Mỗi request tra cứu chạy vài truy vấn DB, nên đặt backend **cùng vùng hoặc gần vùng của Aiven** quan trọng hơn gần người dùng.

| Vùng Aiven gán (Phần 3, mục III.3) | Region trên Render |
|---|---|
| Đông Nam Á, Đông Á, Ấn Độ, Úc | Singapore |
| Châu Âu | Frankfurt |
| Miền đông Mỹ, Canada | Virginia (US East) hoặc Ohio |
| Miền tây Mỹ | Oregon (US West) |

- Nếu Aiven gán vùng ngoài châu Á, ghi lại và báo: có phương án dự phòng chuyển DB sang Singapore ([ADR 0009](adr/0009-hosting-render-aiven.md), Phần 3).

#### 4. Biến môi trường

- Ở mục **Environment Variables**, bấm **Add from .env** (nếu có) và dán khối dưới, thay các giá trị trong `< >`; hoặc thêm từng dòng bằng **Add Environment Variable**.

```properties
SPRING_PROFILES_ACTIVE=prod
BACKEND_PORT=10000
DB_HOST=<AIVEN_HOST>
DB_PORT=<AIVEN_PORT>
DB_NAME=<AIVEN_DB>
DB_USERNAME=<AIVEN_USER>
DB_PASSWORD=<AIVEN_PASSWORD>
CORS_ALLOWED_ORIGINS=https://pokenexus.pages.dev
```

| Biến | Vì sao |
|---|---|
| `SPRING_PROFILES_ACTIVE=prod` | Tắt ingestion CSV, timeout kết nối DB 5 giây, đọc IP người dùng từ header của proxy (`application-prod.yml`) |
| `BACKEND_PORT=10000` | Render mặc định chuyển traffic vào cổng 10000 (biến `PORT` do Render đặt); backend nghe đúng cổng này |
| `DB_*` | Kết nối Aiven. JDBC tự dùng TLS khi server hỗ trợ (chế độ mặc định `PREFERRED` của MySQL Connector/J) |
| `CORS_ALLOWED_ORIGINS` | Giá trị tạm; sửa thành URL Pages thật ở Phần 7. Nhiều domain thì ngăn cách bằng dấu phẩy |

#### 5. Mục Advanced

| Ô | Giá trị | Ghi chú |
|---|---|---|
| Health Check Path | `/api/v1/health` | Trả 200 khi kết nối được DB; Render chỉ chuyển traffic sang bản mới khi endpoint này đạt |
| Auto-Deploy | `On Commit` (Yes) | Tự build khi `main` có commit mới |
| Build Filters, Included Paths | `backend/**` | Đường dẫn tính từ gốc repo; commit chỉ sửa tài liệu hoặc frontend sẽ không build lại backend |
| Docker Command, Pre-Deploy Command | Để trống | Dockerfile đã có `ENTRYPOINT` |

### IV. Tạo service và theo dõi

1. Bấm **Create Web Service** (hoặc **Deploy Web Service**).
2. Mở tab **Logs** (hoặc **Events**, bấm vào lần deploy đang chạy). Các mốc bình thường theo thứ tự:
   - `RUN chmod +x mvnw && ./mvnw -B -q dependency:go-offline`: tải thư viện Maven, lâu nhất (vài phút).
   - `RUN ./mvnw -B -q -DskipTests package`: build jar.
   - Ảnh Docker được đẩy lên, container khởi động, log Spring Boot có dòng `Started PokeNexusApplication in ... seconds`. Với CPU của gói Free, khởi động có thể mất 1-3 phút.
   - Render báo service **Live** (thường kèm dòng `Your service is live`).
3. Ghi `BACKEND_URL` hiển thị ở đầu trang service (dạng `https://pokenexus-api.onrender.com`).

### V. Kiểm tra backend

```bash
BACKEND_URL=https://pokenexus-api.onrender.com
curl -s "$BACKEND_URL/api/v1/health"; echo
curl -s "$BACKEND_URL/api/v1/pokemon/garchomp" | head -c 300; echo
curl -s -X POST "$BACKEND_URL/api/v1/synergy/analyze" -H "Content-Type: application/json" \
  -d '{"pokemonIds":[6,130,149,663,637]}' | head -c 120; echo
```

- Thay dòng đầu bằng `BACKEND_URL` thật của bạn.
- Đạt khi:
  - `health` trả `{"status":"UP","dataLoaded":true,"pokemonCount":1351}`.
  - Lệnh thứ hai trả JSON có `"name":"garchomp"`.
  - Lệnh thứ ba trả JSON có `"teamScore":20.0`.
- Lần gọi đầu sau khi service ngủ có thể mất 1-2 phút; nếu `curl` hết thời gian chờ, gọi lại.

### VI. Lỗi thường gặp

| Dấu hiệu | Nguyên nhân | Cách xử lý |
|---|---|---|
| Log `No open ports detected` hoặc deploy hết giờ chờ | Thiếu `BACKEND_PORT=10000` | Thêm biến ở tab **Environment**, lưu và deploy lại |
| Log `Communications link failure` | Sai `DB_HOST`, `DB_PORT`, hoặc service Aiven đang tắt | Kiểm tra biến; vào Aiven xem trạng thái, nếu **Powered off** thì bấm **Power on** |
| Log `Access denied for user` | Sai `DB_USERNAME`, `DB_PASSWORD` | Sửa biến, lưu và deploy lại |
| Log có `Validate failed` của Flyway hoặc `Schema-validation: missing table` | Chưa nhập dữ liệu, sai `DB_NAME`, hoặc dump sinh từ phiên bản code khác | Kiểm tra lại Phần 4; nhập lại bằng `FORCE=1` từ dump mới xuất trên `main` |
| `health` trả `"dataLoaded":false` | Nhập dữ liệu vào database khác `DB_NAME` | Đối chiếu `DB_NAME` với database đã nhập |
| Log `Ran out of memory` hoặc `Exited with status 137` | Vượt 512 MB | Chụp log và báo lại (cần giảm `-XX:MaxRAMPercentage` trong `backend/Dockerfile`) |
| Build lỗi ở bước `dependency:go-offline` | Mạng của máy build chập chờn | **Manual Deploy**, chọn **Clear build cache & deploy** |

---

## Phần 6. Bước 5: Frontend trên Cloudflare Pages

### I. Tạo tài khoản

1. Mở `https://dash.cloudflare.com/sign-up`, đăng ký bằng email, bấm link xác nhận trong hộp thư.
2. Không cần mua domain; Pages cấp sẵn domain dạng `<tên project>.pages.dev`.

### II. Tạo project Pages

1. Ở menu trái, mở **Workers & Pages** (có thể nằm trong nhóm **Compute**).
2. Bấm **Create** (hoặc **Create application**).
3. Chọn **Pages**: tab **Pages**, hoặc dòng gợi ý dạng "Looking to deploy Pages? Get started". Chọn **Import an existing Git repository** (hoặc **Connect to Git**).
4. Chọn **GitHub**, bấm **Connect GitHub**, ở cửa sổ GitHub cho phép ứng dụng Cloudflare truy cập organization `Nha-Cong-Dong`, chỉ repo `PokeNexus` (giống Phần 5, mục II).
5. Chọn repo `PokeNexus`, bấm **Begin setup**.

- **Không** chọn tạo Worker. Cách Worker cần file cấu hình `wrangler` mà repo chưa có. Nếu dashboard không còn đường tạo Pages, dừng lại và báo để thêm cấu hình.

### III. Cấu hình build

| Ô | Giá trị | Ghi chú |
|---|---|---|
| Project name | `pokenexus` | Thành domain `pokenexus.pages.dev`; nếu trùng, Cloudflare đổi tên hoặc thêm hậu tố |
| Production branch | `main` | |
| Framework preset | `None` | Lệnh build ghi tay ở dưới |
| Build command | `npm run build` | |
| Build output directory | `dist` | Tính từ Root directory |
| Root directory (mục Advanced, Path) | `frontend` | |

- Ở **Environment variables** (mục Advanced hoặc ngay dưới), thêm 2 biến:

| Biến | Giá trị | Vì sao |
|---|---|---|
| `NODE_VERSION` | `24` | `.nvmrc` nằm ở gốc repo, ngoài Root directory nên Pages không đọc được |
| `VITE_API_BASE_URL` | `<BACKEND_URL>/api/v1` | Ví dụ `https://pokenexus-api.onrender.com/api/v1`; được nhúng vào JavaScript lúc build |

- `VITE_API_BASE_URL` bắt buộc bắt đầu bằng `https://`. Nếu thiếu hoặc sai, build trên Pages **cố ý thất bại** kèm thông báo (`frontend/vite.config.ts`), để không phát hành bản gọi `localhost`.

### IV. Build lần đầu

1. Bấm **Save and Deploy**.
2. Theo dõi log: cài package, `vite build`, rồi dòng báo thành công (dạng `Success: ... deployed`).
3. Ghi `PAGES_URL` hiển thị ở trang project (dạng `https://pokenexus.pages.dev`).

| Dấu hiệu trong log build | Cách xử lý |
|---|---|
| Thông báo nhắc `VITE_API_BASE_URL` | Sửa biến ở Settings, Environment variables, rồi **Retry deployment** |
| `npm` báo Node quá cũ hoặc `EBADENGINE` | Kiểm tra `NODE_VERSION=24` |
| `Could not read package.json` | Root directory chưa đặt `frontend` |

### V. Thiết lập sau lần build đầu

1. **Settings**, **Builds** (hoặc **Builds & deployments**), **Build watch paths**: Include paths `frontend/*`. Commit chỉ sửa backend hoặc tài liệu sẽ không build lại frontend.
2. Cùng trang, **Branch control**: đặt deploy cho nhánh preview thành **None**. Bản preview có domain riêng nên bị CORS của backend chặn, và biến môi trường của môi trường Preview đang trống nên build preview sẽ thất bại.

### VI. Kiểm tra frontend

- Mở `PAGES_URL`: trang Tổng quan hiện khung cảnh và menu.
- Mở thẳng `PAGES_URL/team-builder` rồi bấm `F5`: trang vẫn hiện, không ra lỗi 404. Pages tự trả `index.html` cho mọi đường dẫn vì repo không có file `404.html` ở gốc.
- Nếu dữ liệu chưa hiện và `F12`, Console báo `blocked by CORS policy`: bình thường khi URL Pages khác `https://pokenexus.pages.dev`; làm Phần 7.

---

## Phần 7. Bước 6: Nối CORS

1. Render, service `pokenexus-api`, tab **Environment**.
2. Sửa `CORS_ALLOWED_ORIGINS` thành đúng `PAGES_URL`: có `https://`, **không** có dấu `/` ở cuối, không có đường dẫn phía sau.
3. Bấm **Save Changes**, chọn lưu kèm deploy (**Save, rebuild, and deploy** hoặc **Save and deploy**). Chờ service **Live**.
4. Kiểm tra bằng lệnh (thay 2 URL):

```bash
BACKEND_URL=https://pokenexus-api.onrender.com
PAGES_URL=https://pokenexus.pages.dev
curl -si -X OPTIONS "$BACKEND_URL/api/v1/synergy/analyze" \
  -H "Origin: $PAGES_URL" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type" | grep -i "^access-control-allow-origin"
```

- Đạt khi: in đúng một dòng `access-control-allow-origin: <PAGES_URL>`.
- Mở `PAGES_URL`, bấm `F12`, tab Console: không còn lỗi CORS; trang Tổng quan có "Pokémon hôm nay".

---

## Phần 8. Bước 7: Kiểm tra toàn bộ

- Kiểm tra tự động: một lệnh kiểm phần lớn mục dưới đây (cần Node 22+ và Chrome; mất khoảng 3 phút, thêm khoảng 4 phút với `--rate-limit`):

```bash
node scripts/acceptance-check.mjs --rate-limit
node scripts/acceptance-check.mjs --base http://localhost:4173 --api http://localhost:8080/api/v1
```

- Lệnh đầu chạy trên link thật (mặc định `https://pokenexus.pages.dev` và backend Render); lệnh sau chạy trên bản local (`npm run build` rồi `npm run preview`, `CORS_ALLOWED_ORIGINS` phải có origin của preview). Không dùng `--rate-limit` ở local vì không có edge Cloudflare.
- Đạt khi dòng cuối là `N/N checks passed` và mã thoát 0. Mỗi dòng `FAIL` ghi rõ mục và giá trị đo được.
- Vẫn tự làm mục II (điện thoại thật) vì script chỉ giả lập.

### I. Kịch bản demo trên máy tính

- Theo [spec.md](spec.md), Phần 4. Kết quả mong đợi đo trên dữ liệu thật ngày 2026-11-02:

| Bước | Thao tác | Kết quả mong đợi |
|---|---|---|
| 1 | Trang Tổng quan, bấm "Mở Pokédex" | Lưới Pokémon hiện |
| 2 | Lọc hệ Dragon, thế hệ 4, mở Garchomp | Trang chi tiết có chỉ số, lưới phòng thủ |
| 3 | So sánh Garchomp với Salamence | Radar 2 lớp và câu kết luận |
| 4 | Team Builder: Charizard, Gyarados, Dragonite, Talonflame, Volcarona | Điểm đội 20; hệ Rock đánh dấu lỗ hổng nghiêm trọng |
| 5 | Bật "Loại huyền thoại, thần thoại và Paradox", thêm đề xuất số 1 | Số 1 là Excadrill; điểm đội lên 48 |
| 6 | Lưu đội, mở link chia sẻ trong cửa sổ ẩn danh | Đúng 6 thành viên |

### II. Kịch bản demo trên điện thoại thật

- Dùng 4G (tắt Wi-Fi) để giống điều kiện người xem. Lặp lại 6 bước trên.
- Đạt khi: không cuộn ngang, chữ đọc được, các nút bấm được.

### III. Kiểm chứng giới hạn lưu đội (lỗi B3)

- Mục đích: xác nhận người dùng không vượt được giới hạn 10 lần lưu mỗi phút bằng cách tự gửi header IP giả.
- Body dùng ID Pokémon không tồn tại: request vẫn bị tính vào giới hạn (giới hạn kiểm trước khi kiểm ID) nhưng trả 400 `UNKNOWN_POKEMON` và không tạo đội nào trong DB production.

```bash
BACKEND_URL=https://pokenexus-api-s6g6.onrender.com
BODY='{"name":"rate-limit-probe","members":[{"slot":1,"pokemonId":999999}]}'
for header in "X-Forwarded-For" "CF-Connecting-IP" "Forwarded"; do
  for i in $(seq 1 11); do
    value="203.0.113.$i"; [ "$header" = "Forwarded" ] && value="for=203.0.113.$i"
    curl -s -o /dev/null -w "$header lan $i: %{http_code}
" -X POST "$BACKEND_URL/api/v1/teams"       -H "Content-Type: application/json" -H "$header: $value" -d "$BODY"
  done
  sleep 65
done
```

| Kết quả mỗi vòng | Ý nghĩa |
|---|---|
| Lần 1-10 trả `400`, lần 11 trả `429` | **Đạt**: header giả không quyết định IP |
| Cả 11 lần trả `403`, body là trang lỗi Cloudflare 1000 (chỉ vòng `CF-Connecting-IP`) | **Đạt**: edge Cloudflare của Render từ chối request tự gắn header này trước khi tới backend |
| Cả 11 lần trả `400` | **Không đạt**: header giả vượt được giới hạn. Kiểm tra header IP mà edge của Render đang gửi, đặt biến `CLIENT_IP_HEADER` trên Render cho đúng rồi chạy lại |
| Lần 1 đã trả `429` | Chưa hết cửa sổ 1 phút từ lần thử trước; chờ thêm rồi chạy lại |

- Kết quả 04/11 (trước Issue #89): vòng `X-Forwarded-For` không đạt (11/11 lần `400`), còn cùng body không có header giả thì lần 11 trả `429`. Từ Issue #89, profile `prod` lấy IP từ `CF-Connecting-IP`.
- Kết quả 06/11 (sau PR #91, bản mới nhất của `main`): `node scripts/acceptance-check.mjs --rate-limit` đạt 36/36. Vòng `X-Forwarded-For` và `Forwarded` ra 10 lần `400` rồi `429`; vòng `CF-Connecting-IP` ra 11 lần `403` từ edge Cloudflare (PR #106 sửa script để nhận kết quả này).

### IV. Dọn đội thử

- Chỉ cần khi đã chạy bài kiểm chứng bằng body có ID Pokémon thật (bản cũ của mục III).

- 2 vòng trên tạo tối đa 20 đội tên `rate-limit-test` trong DB production. Xóa (thành viên đội tự xóa theo khóa ngoại `ON DELETE CASCADE`):

```bash
docker exec -e MYSQL_PWD="$AIVEN_PASSWORD" pokenexus-mysql \
  mysql -h"$AIVEN_HOST" -P"$AIVEN_PORT" -u"$AIVEN_USER" "$AIVEN_DB" \
  -e "DELETE FROM teams WHERE name = 'rate-limit-test'; SELECT COUNT(*) AS teams FROM teams;"
```

- Đạt khi: `teams` chỉ còn các đội bạn đã lưu khi chạy kịch bản demo.

### V. Báo kết quả

- Gửi lại (không kèm mật khẩu): `BACKEND_URL`, `PAGES_URL`, vùng Aiven và vùng Render, kết quả `health`, kết quả 2 vòng kiểm chứng B3, các bước demo không đạt (nếu có).
- Sau đó còn: đo Lighthouse trên link thật (T404), cập nhật README có link demo và ảnh chụp (T405).

---

## Phần 9. Bước 8: Giữ backend không ngủ (khuyến nghị)

### I. Vì sao cần

- Render Free tắt service sau 15 phút không có request; lần gọi kế tiếp chờ khởi động 1-3 phút. Aiven Free có thể tắt service không có hoạt động (có email báo trước).
- Gọi `/api/v1/health` mỗi 10 phút giữ backend thức, và vì endpoint này truy vấn DB nên cũng giữ Aiven hoạt động.
- Ngân sách: Render Free có 750 giờ mỗi tháng cho cả workspace; một service chạy liên tục hết 720-744 giờ. Không tạo thêm service Free khác trong cùng workspace.

### II. Cách A: GitHub Actions (đã bật từ Issue #90)

- File `.github/workflows/keep-alive.yml` gọi `/api/v1/health` mỗi 10 phút (`cron: '*/10 * * * *'`) và cho phép chạy tay (`workflow_dispatch`).
- URL mặc định ghi trong file là backend production `https://pokenexus-api-s6g6.onrender.com/api/v1/health` (URL công khai, đã nằm trong bundle frontend). Đổi backend thì tạo repository variable `BACKEND_HEALTH_URL` (**Settings**, **Secrets and variables**, **Actions**, tab **Variables**), không cần sửa file.
- Kiểm tra: tab **Actions**, workflow **Keep backend awake**, **Run workflow**; job xanh là đạt.
- GitHub có thể chạy lịch trễ vài phút; chu kỳ 10 phút để còn dư so với ngưỡng ngủ 15 phút của Render.

### III. Cách B: cron-job.org (không sửa repo)

1. Đăng ký tại `https://cron-job.org`, xác nhận email.
2. **Create cronjob**: URL `<BACKEND_URL>/api/v1/health`, lịch **Every 10 minutes**, lưu.
3. Mục lịch sử của cronjob hiện mã `200` là đạt.

### IV. Trước giờ demo

- Dù đã bật cách A hoặc B, 10 phút trước khi trình bày hãy mở `<BACKEND_URL>/api/v1/health` và trang `PAGES_URL` một lần, xác nhận `UP`.

---

## Phần 10. Vận hành và khôi phục

### I. Cập nhật phiên bản

- Merge vào `main`: Render tự build khi commit có thay đổi trong `backend/`; Pages tự build khi có thay đổi trong `frontend/`.
- Đổi `BACKEND_URL`: sửa `VITE_API_BASE_URL` trên Pages rồi **Retry deployment** (URL được nhúng lúc build).

### II. Quay về bản trước

| Thành phần | Cách làm |
|---|---|
| Backend | Render, service, tab **Events** (hoặc **Deploys**), chọn lần deploy tốt trước đó, **Rollback** |
| Frontend | Pages, project, **Deployments**, menu của bản tốt trước đó, **Rollback to this deployment** |
| Dữ liệu Pokémon | Xuất dump mới từ `main` rồi nhập lại bằng `FORCE=1` (Phần 4); xóa mọi đội đã lưu |

### III. Sự cố thường gặp khi đang chạy

| Dấu hiệu | Cách xử lý |
|---|---|
| Trang tải lâu ở lần đầu | Backend đang thức dậy; chờ 1-3 phút, kiểm tra Phần 9 |
| `health` trả 503 `DOWN` | Aiven bị tắt hoặc đổi mật khẩu: vào Aiven bấm **Power on** hoặc cập nhật `DB_PASSWORD`; sau đó Render, **Manual Deploy**, **Restart service** nếu backend chưa tự nối lại |
| Render báo tạm ngưng service Free | Đã hết 750 giờ trong tháng; tắt service Free khác trong workspace hoặc chờ sang tháng |
| Lỗi CORS sau khi đổi tên project Pages | Cập nhật `CORS_ALLOWED_ORIGINS` (Phần 7) |
