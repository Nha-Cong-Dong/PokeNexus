# ADR 0009 - Hosting production: Render và Aiven thay Railway

- Trạng thái: Đã chấp nhận
- Ngày: 2026-11-02
- Thay thế một phần [ADR 0007](0007-hosting-railway-cloudflare-pages.md): phần backend và MySQL trên Railway. Frontend vẫn chạy trên Cloudflare Pages như ADR 0007.

## Phần 1. Bối cảnh

- Railway tạm dừng nhận đăng ký mới từ ngày 2026-10-22 sau sự cố bảo mật ngày 2026-10-21; cập nhật ngày 2026-10-28 chưa có ngày mở lại. Dự án chưa có tài khoản Railway nên không triển khai được theo ADR 0007.
- Chủ dự án yêu cầu ngày 2026-11-02: ưu tiên cao nhất là miễn phí.
- Tiêu chí chọn giữ nguyên [architecture.md](../architecture.md), Phần 11, mục II. Số đo dùng lại từ ADR 0007: backend chiếm 277 MiB khi giới hạn 512 MB, khởi động 27,5 s với 0,5 CPU; dữ liệu 0,8 MB, file dump khoảng 156 KB.
- Thông tin gói dịch vụ tra ngày 2026-11-02, phần lớn từ trang tổng hợp bên thứ ba và tài liệu của nhà cung cấp (Phần 5); giá và giới hạn có thể đổi.

## Phần 2. Quyết định

- Backend chạy trên Render, Web Service gói Free, build từ `backend/Dockerfile` (Root Directory `backend`), vùng đặt gần vùng của Aiven.
- MySQL chạy trên Aiven for MySQL gói Free (1 CPU, 1 GB RAM, 1 GB đĩa, không cần thẻ, không giới hạn thời gian). Dữ liệu nhập một lần bằng `scripts/db-dump.sh import` qua kết nối TLS.
- Frontend giữ Cloudflare Pages, `VITE_API_BASE_URL` trỏ domain `onrender.com` của backend.
- Không đổi code: cổng đặt bằng `BACKEND_PORT=10000` (cổng mặc định Render chuyển traffic vào), DB qua các biến `DB_*` sẵn có.
- Khuyến nghị gọi `/api/v1/health` mỗi 10 phút (GitHub Actions hoặc cron-job.org) để backend không ngủ và DB có hoạt động.
- Các bước thao tác: [deploy.md](../deploy.md).

## Phần 3. Các phương án đã cân nhắc

| Phương án | Ưu điểm | Nhược điểm |
|---|---|---|
| Render Free và Aiven Free (chọn) | Không tốn phí, không cần thẻ; MySQL thật nên dump và Flyway dùng nguyên trạng; Render có vùng Singapore | Render ngủ sau 15 phút, khởi động lại 1-3 phút; CPU dưới 1 nhân; Aiven không cho chọn vùng nên có thể xa backend; Aiven có thể tắt service không hoạt động |
| Render Free và TiDB Cloud Starter (dự phòng cho DB) | Không tốn phí, không cần thẻ; TiDB có vùng Singapore | Chỉ tương thích MySQL: CHECK mặc định không được thực thi, khóa ngoại và Flyway trên TiDB chưa kiểm; integration test chạy MySQL nên không phủ |
| Oracle Cloud Always Free, một VM chạy `docker compose --profile app` | Không ngủ; MySQL 8.4 giống hệt local; tài nguyên rộng | Cần thẻ để xác minh; đăng ký có thể bị từ chối hoặc hết tài nguyên ở vùng Singapore; phải tự lo firewall, HTTPS, domain |
| Koyeb, Northflank | Có gói miễn phí cho container | Cần thẻ (Koyeb từ 2026-02, Northflank để xác minh); Koyeb chỉ có Frankfurt, Washington |
| Zeabur | Không cần thẻ | Credit $5 mỗi tháng không đủ chạy JVM và MySQL liên tục |
| Chờ Railway mở lại đăng ký | Giữ nguyên ADR 0007 | Không có ngày mở lại; Checkpoint 4 là 2026-11-08 |

## Phần 4. Hệ quả

- Cold start: lần gọi đầu sau 15 phút không có request chờ 1-3 phút. Làm nóng trước demo và trước khi đo Lighthouse; nên bật lịch gọi `/api/v1/health` mỗi 10 phút. Một service chạy liên tục dùng 720-744 trong 750 giờ Free mỗi tháng của workspace.
- Độ trễ: mỗi request tra cứu chạy vài truy vấn DB, nên Render đặt cùng hoặc gần vùng Aiven gán. Nếu Aiven gán vùng ngoài châu Á, cân nhắc chuyển DB sang TiDB Singapore sau khi kiểm tương thích (V1-V3, Flyway validate, nhập dump).
- IP client cho giới hạn lưu đội: chưa biết proxy của Render có xóa `X-Forwarded-For`, `Forwarded` do client gửi hay không. Bước kiểm chứng 11 request ([deploy.md](../deploy.md), Phần 8, mục III) quyết định có phải sửa `TeamController` trước demo (lỗi B3) hay không.
- Kết nối DB dùng chế độ TLS mặc định `PREFERRED` của MySQL Connector/J: có mã hóa nhưng không xác minh chứng chỉ. Chấp nhận vì dữ liệu công khai; muốn chặt hơn thì thêm `sslMode=VERIFY_CA` và CA của Aiven.
- Giới hạn Aiven Free: 76 kết nối, đủ cho pool mặc định 10 của HikariCP.
- Hết hạn: Aiven Free và Render Free không có hạn dùng; link giữ được sau hackathon nếu lịch gọi health tiếp tục chạy hoặc chấp nhận cold start.
- Rollback: dữ liệu nằm trọn trong file dump; đổi nhà cung cấp chỉ cần nhập lại dump và đổi `VITE_API_BASE_URL` trên Pages, không sửa code.

## Phần 5. Nguồn tra cứu (2026-11-02)

- Railway: [Preliminary Report: Oct 21st Security Incident](https://blog.railway.com/p/preliminary-report-october-security-incident), [Railway Status](https://status.railway.com/), [The Hacker News](https://thehackernews.com/2026/10/railway-says-intruder-may-have-accessed.html).
- Render: [Render Free Tier 2026](https://agentdeals.dev/vendor/render), [Render Pricing 2026](https://www.srvrlss.io/provider/render/), [Render pricing explained](https://livemy.app/blog/render-pricing), [Monorepo Support](https://render.com/docs/monorepo-support), [Web services tutorial](https://render.com/tutorials/web-service-vs-static-site/web-services).
- Aiven: [Aiven for MySQL free tier](https://aiven.io/docs/products/mysql/concepts/mysql-free-tier), [Free plan](https://aiven.io/docs/platform/concepts/free-plan), [Get started with Aiven for MySQL](https://aiven.io/docs/products/mysql/get-started.html).
- TiDB: [TiDB Pricing](https://www.pingcap.com/pricing/), [Select a Plan](https://docs.pingcap.com/tidbcloud/select-cluster-tier/).
- Cloudflare Pages: [Pages vs Workers 2026](https://dev.to/rickcogley/cloudflare-pages-vs-workers-in-2026-migration-guide-ka7), [Migrating from Workers](https://developers.cloudflare.com/pages/migrations/migrating-from-workers/).
- Phương án khác: [Free Cloud Hosting 2026](https://snapdeploy.dev/blog/free-cloud-deployment-platforms-2026-comparison), [Koyeb Free Tier](https://www.freetiers.com/directory/koyeb).
