# PokeNexus - Kế hoạch đang thực hiện

- Cập nhật: 2026-11-06
- Chỉ ghi trạng thái hiện tại. Kế hoạch gốc (task, ngày, tiêu chí): [docs/roadmap.md](docs/roadmap.md); không sửa kế hoạch gốc ở đây. Nhật ký theo ngày, blocker đã xử lý, trạng thái W1-W3: [docs/worklog.md](docs/worklog.md).
- Cập nhật khi bắt đầu và kết thúc mỗi phiên; dòng nhật ký ghi vào `docs/worklog.md`. Chủ nhật đồng bộ trạng thái sang GitHub Milestone. Đây là nơi duy nhất ghi trạng thái; README và `CLAUDE.md` không ghi.

---

## Phần 1. Hiện tại

### I. Tóm tắt

| Mục | Giá trị |
|---|---|
| Tuần | Tuần 3 (02/11 - 08/11), milestone `W4 - Demo và phát triển`; đóng băng tính năng từ 05/11, chỉ làm `fix`, `docs`, `chore` |
| Mốc | Checkpoint 4 ngày 08/11: bản hoàn chỉnh chạy trên link thật, demo, pitching 15 phút, tag `v1.0.0` |
| Link thật | Frontend `https://pokenexus.pages.dev` (Cloudflare Pages); backend `https://pokenexus-api-s6g6.onrender.com` (Render Free); MySQL Aiven Free. Deploy 04/11; chủ dự án deploy lại từ `main`, xác nhận 06/11; nghiệm thu 36/36 |
| Test trên `main` (CI, commit `3f3e0f9`) | Frontend 352; backend 142 unit, 57 IT |
| W1-W3 | Xong (T101-T317, T401, T408-T412; T105, T402 cắt giảm). Ngày và tiêu chí: [docs/roadmap.md](docs/roadmap.md), Phần 3; kết quả kiểm tra: [docs/worklog.md](docs/worklog.md) |

### II. Task và Issue còn mở của W4

| Mã | Ngày | Task | Trạng thái | Ghi chú |
|---|---|---|---|---|
| T403 (#49) | 30-31/10 | Triển khai production | Xong | Deploy 04/11, deploy lại từ `main` (xác nhận 06/11); `acceptance-check --rate-limit` 36/36 (PR #106 sửa vòng `CF-Connecting-IP`) |
| T404 (#51) | 03/11 | Bug bash, đo hiệu năng | Xong | Lighthouse mobile trên link thật 06/11: Accessibility 100 ở 9/9, CLS, TBT, Best Practices đạt; LCP đạt 1/9 route (2,1-5,5 s). Chủ dự án chốt không sửa code thêm, LCP ghi lệch ngưỡng ([worklog](docs/worklog.md), 06/11) |
| T405 (#52) | 04/11 | README: link demo, ảnh chụp, sơ đồ, CHANGELOG | Xong | PR #99: bảng link (dùng thử, API, báo cáo, nghiệm thu), CHANGELOG `[Unreleased]`; 7 ảnh chụp `docs/images/` ở README Phần 2 mục IV, chụp từ `main` chạy local (cùng mã với bản sẽ deploy) |
| T406 (#72) | 04-06/11 | Slide và kịch bản pitch 15 phút | Xong | PR #101: `docs/pitching/slides.html`, `PokeNexus-Pitch.pptx` (27 slide, giữ làm dự phòng), kịch bản Phần 10 của file luyện tập; 06/11 cập nhật slide 17, 18 theo số đo production (ước lượng 15:06); 07/11 thiết kế lại `slides.html` với chuyển cảnh, hiệu ứng, nền đa dạng (#111), thêm mã QR (#115), rút còn 18 slide, kịch bản sang `PokeNexus-KichBan.md`, phụ lục sang `PokeNexus-PhuLuc.md` (#117); bấm giờ thật ở T407 |
| T407 (#53) | 07-08/11 | Tổng duyệt 2 lần, tag `v1.0.0` | Chưa làm | Link thật đã chạy bản mới (06/11); chờ chủ dự án tổng duyệt |
| T413 (#73) | 05/11 | Báo cáo tổng kết `.docx` | Xong | PR #96 |
| T414 (#71) | 02-03/11 | Tài liệu luyện tập hỏi đáp | Xong | PR #77; cập nhật theo code sau 02/11 ở PR #101 (bản 0.2); số đo production 06/11 (bản 0.3) |
| #74 | 05/11 | Sửa tài liệu lệch code, rút gọn `PLAN.md` | Xong | PR #98 |
| #97 | 05/11 | Video demo cho buổi pitching | Cắt giảm | PR #100 làm video 04:40; ngày 07/11 chủ dự án chọn demo trực tiếp, xóa video ở #109 |

- Giá trị cột Trạng thái: Chưa làm, Đang làm, Bị chặn, Xong, Cắt giảm.

---

## Phần 2. Blocker đang mở

- Không còn blocker. Hai blocker cũ đóng ngày 06/11: production đã chạy bản mới nhất của `main` (nghiệm thu 36/36); LCP trên link thật lệch ngưỡng 2,5 s ở 8/9 route, chủ dự án chấp nhận và không sửa code trước pitching.
- Mở từ trước, không chặn demo: Node trên máy là 25, `.nvmrc` là 24 (CI dùng 24); trang So sánh gọi 3 request mỗi cặp (2 chi tiết và `compare`).

---

## Phần 3. Ba việc kế tiếp

1. Chủ dự án tổng duyệt 2 lần trên link thật: slide 1-18 theo [kịch bản](docs/pitching/PokeNexus-KichBan.md) (ước lượng 14:09, đạt khi lệch không quá 1 phút) và demo trực tiếp theo [spec.md](docs/spec.md), Phần 4. Ghi thời gian thật từng lần.
2. Sau tổng duyệt: chuyển CHANGELOG `[Unreleased]` sang `[1.0.0]`, gắn tag `v1.0.0`, tạo GitHub Release, đóng #53 và milestone `W4 - Demo và phát triển` (T407).
3. Sáng 08/11, 15-30 phút trước giờ pitching: gọi `https://pokenexus-api-s6g6.onrender.com/api/v1/health` để đánh thức Render (cold start 36 s ngày 06/11); chuẩn bị dự phòng: bản local chạy sẵn, file `.pptx` trên máy.
