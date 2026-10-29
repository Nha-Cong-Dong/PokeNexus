# ADR 0007 - Hosting production: Railway và Cloudflare Pages

- Trạng thái: Đã chấp nhận
- Ngày: 2026-10-29

## Phần 1. Bối cảnh

- T403 (Issue #49) triển khai production ngày 30-31/10; Checkpoint 4 ngày 08/11 cần link sản phẩm chạy thật. Tiêu chí chọn: [architecture.md](../architecture.md), Phần 11, mục II.
- Số đo ngày 2026-10-29 trên máy dev:
  - Image `backend/Dockerfile` giới hạn 512 MB RAM, 0,5 CPU: khởi động 27,5 s, chiếm 277 MiB, không bị OOM. Không giới hạn: khởi động 9,8 s.
  - Dữ liệu 0,8 MB; file dump 156 KB. MySQL 8.4 local chiếm khoảng 450 MiB.
- Chủ dự án chọn phương án không tốn phí ngày 2026-10-29.
- Thông tin gói dịch vụ tra ngày 2026-10-29, phần lớn từ trang tổng hợp bên thứ ba (danh sách nguồn ở Phần 5); giá và giới hạn có thể đổi, kiểm tra lại trên dashboard khi tạo tài khoản.

## Phần 2. Quyết định

- Backend và MySQL chạy trên Railway, gói Trial ($5 credit dùng trong 30 ngày, không cần thẻ), chung một project ở vùng Southeast Asia (Singapore):
  - Backend build từ `backend/Dockerfile` (Root Directory `backend`), tự deploy khi `main` có commit mới.
  - MySQL dùng template chính thức của Railway; backend nối qua mạng nội bộ bằng biến `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`.
- Frontend chạy trên Cloudflare Pages, build từ GitHub (Root directory `frontend`, `npm run build`, thư mục `dist`), `VITE_API_BASE_URL` trỏ domain của backend trên Railway. Không có `404.html` ở gốc nên Pages tự trả `index.html` cho mọi route (SPA).
- Không dùng Config as Code của Railway (`railway.json`, `railway.toml`): tính năng đã deprecated, service mới không bật được và hết hạn ngày 2026-12-01. Thiết lập làm trên dashboard và ghi ở [architecture.md](../architecture.md), Phần 11, mục III.
- Dữ liệu nhập một lần bằng `scripts/db-dump.sh` qua TCP Proxy (Public Networking) của MySQL, nhập xong thì tắt Public Networking. Dump không chứa đội đã lưu ở máy dev.

## Phần 3. Các phương án đã cân nhắc

| Phương án | Ưu điểm | Nhược điểm |
|---|---|---|
| Railway Trial cho backend và MySQL (chọn) | Không tốn phí; backend và DB cùng vùng Singapore, nối nội bộ; không ngủ đông nên demo không phải chờ khởi động | Credit $5 phải đủ tới 08/11; chưa xác minh giới hạn RAM của gói Trial (gói Free sau Trial chỉ cho 0,5 GB mỗi service); hết 30 ngày thì dịch vụ dừng |
| Railway Hobby ($5/tháng) | Như trên, giới hạn tài nguyên rộng | Tốn phí, cần thẻ |
| Render free cho backend, Aiven free cho MySQL | Không tốn phí lâu dài | Backend ngủ sau 15 phút không có traffic, lần gọi đầu chờ khoảng 1-2 phút; Aiven free không chọn được vùng và tự tắt khi không hoạt động (không công bố sau bao lâu) |
| Koyeb free | Không tốn phí | Chỉ có vùng Frankfurt, Washington; ngủ sau 1 giờ; 0,1 vCPU |
| Fly.io | Có vùng Singapore | Không còn gói miễn phí cho tài khoản mới |
| Cloudflare Pages cho frontend (chọn) | Miễn phí; SPA fallback mặc định; CDN có điểm ở Singapore | Bản preview có domain riêng nên bị CORS của backend chặn |
| Vercel, Netlify cho frontend | Miễn phí; build từ GitHub | Cần file rewrite riêng (`vercel.json`, `_redirects`) |

## Phần 4. Hệ quả

- Chi phí ước tính: backend khoảng 0,3 GB và MySQL khoảng 0,45 GB RAM chạy liên tục, theo đơn giá $10 cho 1 GB RAM mỗi tháng là khoảng $2,5-3 cho 30/10-08/11, chưa tính CPU và băng thông (nhỏ). Xem mục Usage trên dashboard mỗi ngày; credit còn dưới $1 thì nâng Hobby hoặc chuyển sang phương án dự phòng.
- MySQL bị OOM vì giới hạn RAM của gói Trial: giảm `innodb_buffer_pool_size`, hoặc nâng Hobby.
- Trial hết hạn khoảng ngày 2026-11-28; muốn giữ link sau hackathon thì nâng Hobby.
- IP client cho giới hạn lưu đội: theo nhân viên Railway trên diễn đàn, edge proxy ghi đè `X-Forwarded-For` và `X-Real-IP` do client gửi, nên giữ `server.forward-headers-strategy: framework`. Kiểm chứng sau khi deploy: 11 request lưu đội liên tiếp, mỗi request một `X-Forwarded-For` giả khác nhau, request thứ 11 phải trả 429. Không đạt thì đọc IP theo header Railway xác nhận và sửa `TeamController`.
- Profile `prod` đặt `spring.datasource.hikari.connection-timeout: 5000`, để `/health` trả 503 sau 5 giây khi mất DB thay vì 30 giây.
- CORS chỉ cho domain production của Pages; muốn thử bản preview thì thêm domain preview vào `CORS_ALLOWED_ORIGINS`.
- Phương án dự phòng: Render free và Aiven free. Chuyển bằng cách nhập lại cùng file dump (`scripts/db-dump.sh import`) và đổi `VITE_API_BASE_URL` trên Pages; không phải sửa code.

## Phần 5. Nguồn tra cứu (2026-10-29)

- Railway: [Pricing Plans](https://docs.railway.com/pricing/plans), [Regions](https://docs.railway.com/reference/deployment-regions), [MySQL](https://docs.railway.com/databases/mysql), [Config as Code](https://docs.railway.com/config-as-code/reference), [Railway Free Tier 2026](https://www.saaspricepulse.com/tools/railway), [Edge proxy headers](https://station.railway.com/questions/edge-proxy-x-forwarded-for-and-x-real-ip-c5a50049).
- Cloudflare Pages: [Serving Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/), [Build image](https://developers.cloudflare.com/pages/configuration/build-image/).
- Phương án khác: [Render Free Tier 2026](https://agentdeals.dev/vendor/render), [Aiven for MySQL free tier](https://aiven.io/docs/products/mysql/concepts/mysql-free-tier), [Koyeb Scale-to-Zero](https://www.koyeb.com/docs/run-and-scale/scale-to-zero), [Fly.io Free Tier 2026](https://www.saaspricepulse.com/tools/flyio).
