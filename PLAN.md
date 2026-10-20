# PokeNexus - Kế hoạch đang thực hiện

- Cập nhật: 2026-10-20
- File này theo dõi tiến độ hằng ngày. Kế hoạch gốc (task, ngày, tiêu chí) ở [docs/roadmap.md](docs/roadmap.md); không sửa kế hoạch gốc ở đây.
- Cập nhật khi bắt đầu và kết thúc mỗi phiên làm việc. Chủ nhật đồng bộ trạng thái sang README Phần 7 và GitHub Milestone.

---

## Phần 1. Hiện tại

### I. Tóm tắt

| Mục | Giá trị |
|---|---|
| Tuần | W1 - Ý tưởng và khởi tạo (19/10 - 25/10) |
| Task hôm nay | T102 - Khảo sát bộ CSV PokéAPI |
| Task kế tiếp | T103 - Wireframe 6 trang (21-22/10) |
| Mốc gần nhất | Tag `v0.1.0` ngày 01/11 |

### II. Trạng thái task tuần W1

| Mã | Ngày | Task | Trạng thái | Ghi chú |
|---|---|---|---|---|
| T101 | 19/10 | Bộ tài liệu kế hoạch v0.2 | Xong | Commit `2b97191` trên nhánh `docs/planning-and-ai-guides`, chờ PR |
| T102 | 20/10 | Khảo sát bộ CSV PokéAPI | Đang làm | |
| T103 | 21-22/10 | Wireframe 6 trang | Chưa làm | |
| T104 | 23/10 | Nhãn, milestone, board, Issue W2-W3 | Chưa làm | |
| T105 | 24/10 | Trình bày ý tưởng | Chưa làm | |
| T106 | 25/10 | Buffer, tổng kết tuần | Chưa làm | |

- Giá trị cột Trạng thái: Chưa làm, Đang làm, Bị chặn, Xong, Cắt giảm.

---

## Phần 2. Checklist task đang làm

### I. T102 - Khảo sát bộ CSV PokéAPI

- [ ] Tải 12 file CSV vào `data/csv/` theo [data/README.md](data/README.md), Phần 2.
- [ ] Xác nhận dòng tiêu đề từng file khớp cột ghi trong `data/README.md`, Phần 1.
- [ ] Đếm số dòng từng file.
- [ ] `types.csv`: đếm được 18 hệ có ID 1-18.
- [ ] `type_efficacy.csv`: đúng 324 dòng với hai hệ trong 1-18.
- [ ] Đếm số loài (`pokemon_species.csv`) và số dạng (`pokemon.csv`).
- [ ] Liệt kê hậu tố tên dạng (`-mega`, `-gmax`, `-alola`...) để chốt quy tắc `form_category` ([docs/database.md](docs/database.md), Phần 1, mục IV).
- [ ] Ghi số Pokémon thiếu sprite (đối chiếu [docs/assets.md](docs/assets.md)).
- [ ] Ghi kết quả khảo sát (nơi lưu: chưa chốt, xem Phần 3).

---

## Phần 3. Blocker và việc cần quyết định

### I. Danh sách

| Vấn đề | Ảnh hưởng | Đề xuất | Trạng thái |
|---|---|---|---|
| Kết quả T101 chưa commit | Thay đổi mới dễ trộn vào PR tài liệu v0.2 | Tách 2 commit trên nhánh `docs/planning-and-ai-guides` | Đã xử lý |
| Chưa chốt nơi lưu kết quả T102 | T201 và T205 cần dùng số liệu này | Thêm mục "Kết quả khảo sát" vào `data/README.md` | Mở |
| `data/csv/` chưa có dữ liệu | Chặn T102 | Chạy lệnh tải trong `data/README.md`, Phần 2 | Mở |

---

## Phần 4. Nhật ký

### I. Theo ngày

| Ngày | Việc đã làm | Kết quả kiểm tra |
|---|---|---|
| 2026-10-19 | T101: tài liệu kế hoạch v0.2, ADR 0005, `folder-structure.md`, `design-system.md`, `assets.md`, `git-workflow.md` | Không có link nội bộ gãy (kiểm tra 2026-10-20) |
| 2026-10-20 | Thêm `CLAUDE.md`, `CLAUDE.local.md`, `AGENTS.md`, `MAP.md`, `SPEC.md`, `PLAN.md`, `backend/CLAUDE.md`, `frontend/CLAUDE.md`, `.claude/settings.json`, `.claude/commands/` | Xem PR tương ứng |
