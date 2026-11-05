# PokeNexus - Kế hoạch đang thực hiện

- Cập nhật: 2026-11-05
- Chỉ ghi trạng thái hiện tại. Kế hoạch gốc (task, ngày, tiêu chí): [docs/roadmap.md](docs/roadmap.md); không sửa kế hoạch gốc ở đây. Nhật ký theo ngày, blocker đã xử lý, trạng thái W1-W3: [docs/worklog.md](docs/worklog.md).
- Cập nhật khi bắt đầu và kết thúc mỗi phiên; dòng nhật ký ghi vào `docs/worklog.md`. Chủ nhật đồng bộ trạng thái sang GitHub Milestone. Đây là nơi duy nhất ghi trạng thái; README và `CLAUDE.md` không ghi.

---

## Phần 1. Hiện tại

### I. Tóm tắt

| Mục | Giá trị |
|---|---|
| Tuần | Tuần 3 (02/11 - 08/11), milestone `W4 - Demo và phát triển`; đóng băng tính năng từ 05/11, chỉ làm `fix`, `docs`, `chore` |
| Mốc | Checkpoint 4 ngày 08/11: bản hoàn chỉnh chạy trên link thật, demo, pitching 15 phút, tag `v1.0.0` |
| Link thật | Frontend `https://pokenexus.pages.dev` (Cloudflare Pages); backend `https://pokenexus-api-s6g6.onrender.com` (Render Free); MySQL Aiven Free. Deploy 04/11, chưa nhận các PR merge ngày 05/11 |
| Test trên `main` (CI, commit `3f3e0f9`) | Frontend 352; backend 142 unit, 57 IT |
| W1-W3 | Xong (T101-T317, T401, T408-T412; T105, T402 cắt giảm). Ngày và tiêu chí: [docs/roadmap.md](docs/roadmap.md), Phần 3; kết quả kiểm tra: [docs/worklog.md](docs/worklog.md) |

### II. Task và Issue còn mở của W4

| Mã | Ngày | Task | Trạng thái | Ghi chú |
|---|---|---|---|---|
| T403 (#49) | 30-31/10 | Triển khai production | Đang làm | Deploy 04/11 trên Render, Aiven, Cloudflare Pages; còn deploy lại từ `main` (blocker 1) |
| T404 (#51) | 03/11 | Bug bash, đo hiệu năng | Đang làm | 6 lỗi chủ dự án báo đã sửa (PR #85-#88, #92), B3 sửa ở PR #91; còn Lighthouse trên link thật |
| T405 (#52) | 04/11 | README: link demo, ảnh chụp, sơ đồ, CHANGELOG | Xong | PR #99: bảng link (dùng thử, API, video, báo cáo, nghiệm thu), CHANGELOG `[Unreleased]`; 7 ảnh chụp `docs/images/` ở README Phần 2 mục IV, chụp từ `main` chạy local (cùng mã với bản sẽ deploy) |
| T406 (#72) | 04-06/11 | Slide và kịch bản pitch 15 phút | Xong | PR #101: `docs/pitching/slides.html`, `PokeNexus-Pitch.pptx` (27 slide), kịch bản Phần 10 của file luyện tập (khoảng 15 phút); bấm giờ thật ở T407 |
| T407 (#53) | 07-08/11 | Tổng duyệt 2 lần, tag `v1.0.0` | Chưa làm | Làm sau khi link thật chạy bản mới |
| T413 (#73) | 05/11 | Báo cáo tổng kết `.docx` | Xong | PR #96 |
| T414 (#71) | 02-03/11 | Tài liệu luyện tập hỏi đáp | Xong | PR #77; cập nhật theo code sau 02/11 ở PR #101 (bản 0.2) |
| #74 | 05/11 | Sửa tài liệu lệch code, rút gọn `PLAN.md` | Xong | PR #98 |
| #97 | 05/11 | Video demo cho buổi pitching | Xong | PR #100: `docs/pitching/PokeNexus-Demo.mp4` 04:40, quay từ bản `main` chạy local |

- Giá trị cột Trạng thái: Chưa làm, Đang làm, Bị chặn, Xong, Cắt giảm.

---

## Phần 2. Blocker đang mở

| # | Vấn đề | Ảnh hưởng | Việc cần làm |
|---|---|---|---|
| 1 | Cloudflare Pages và Render chưa tự build lại từ `main`: bundle Pages vẫn `index-oap3lK_N.js` của 04/11, API chưa có thay đổi của #86, #87, #91 | Link thật thiếu các bản sửa ngày 05/11 và bản sửa B3; `acceptance-check` trên production 25/33 | Chủ dự án deploy lại từ dashboard Pages và Render, rồi chạy `node scripts/acceptance-check.mjs --rate-limit` (đạt khi 36/36: 33 mục thường và 3 vòng B3) |
| 2 | Lighthouse mobile trên link thật (bản 04/11, đo 05/11): 0/9 route đạt, chỉ vì LCP 3,6-7,1 s (ngưỡng 2,5 s); A11y, Best Practices, CLS, TBT đạt | T404 chưa đạt cột Kiểm tra | Chủ dự án chọn: chấp nhận và ghi lệch ngưỡng, hoặc sửa nhỏ ảnh hero rồi đo lại sau blocker 1 (số đo ở `docs/worklog.md`, 05/11) |

- Mở từ trước, không chặn demo: Node trên máy là 25, `.nvmrc` là 24 (CI dùng 24); trang So sánh gọi 3 request mỗi cặp (2 chi tiết và `compare`).

---

## Phần 3. Ba việc kế tiếp

1. Deploy lại Pages và Render từ `main`, chạy `node scripts/acceptance-check.mjs --rate-limit` tới 36/36 (đóng blocker 1, kiểm chứng B3 trên link thật).
2. Đo Lighthouse mobile trên link thật ở 9 route (T404), ghi số vào `docs/worklog.md`.
3. Tổng duyệt 2 lần trên link thật (bấm giờ 15 phút theo slide và video), rồi tag `v1.0.0` (T407).
