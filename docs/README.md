# PokeNexus - Mục lục và bản đồ tài liệu

- Phiên bản: 0.2 (cập nhật 2026-10-26)
- Trả lời nhanh "tài liệu nào nói về gì" và "muốn làm việc X thì đọc file nào, sửa ở đâu". Không chép nội dung chi tiết; chi tiết nằm ở file được trỏ tới.
- Tiến độ hiện tại: [PLAN.md](../PLAN.md). Cây thư mục và tên class: [folder-structure.md](folder-structure.md).

---

## Phần 1. Mục lục

### I. Danh sách tài liệu

| Tài liệu | Nội dung | Cập nhật khi |
|---|---|---|
| [product.md](product.md) | Tầm nhìn, persona, user story, phạm vi | Thay đổi phạm vi sản phẩm |
| [spec.md](spec.md) | Đặc tả MVP, tiêu chí chấp nhận, kịch bản kiểm chứng, truy vết tính năng và test | Chốt hoặc thay đổi yêu cầu; đổi tên endpoint, trang, class test |
| [roadmap.md](roadmap.md) | Lộ trình 4 tuần: Epic, task theo ngày, MoSCoW, buffer, rủi ro | Cuối mỗi tuần |
| [architecture.md](architecture.md) | Kiến trúc C4, luồng xử lý, thuật toán, bảo mật, triển khai, chiến lược test | Thay đổi kiến trúc |
| [database.md](database.md) | ERD, từ điển dữ liệu, index, migration, ingestion | Thêm hoặc sửa migration |
| [api.md](api.md) | Quy ước, đặc tả từng endpoint, schema DTO, danh mục lỗi | Thêm hoặc sửa endpoint |
| [folder-structure.md](folder-structure.md) | Cây thư mục repo, package và class backend, cấu trúc frontend, quy tắc đặt tên | Thêm package hoặc thư mục cấp 1-2 |
| [design-system.md](design-system.md) | Design token, Tailwind, component, pattern, bố cục trang, accessibility | Thay đổi giao diện chung |
| [assets.md](assets.md) | Danh mục assets, sprite, font, ảnh, dung lượng, giấy phép | Thêm loại asset mới |
| [git-workflow.md](git-workflow.md) | Mô hình nhánh, commit, PR, xung đột, tag, hoàn tác | Thay đổi quy trình |
| [github-setup.md](github-setup.md) | Thiết lập repo, nhãn, milestone, bảo vệ nhánh, Project board | Thay đổi cấu hình GitHub |
| [adr/](adr) | Các quyết định kiến trúc (ADR) | Có quyết định quan trọng mới |
| [wireframes/](wireframes/README.md) | Wireframe 6 trang, bản 375 px và 1440 px | Thay đổi bố cục giao diện |

### II. Quy ước ADR

- Đặt tên `NNNN-ten-quyet-dinh.md`, đánh số tăng dần, không xóa ADR cũ.
- Quyết định bị thay thế thì đổi trạng thái thành "Đã thay thế bởi ADR NNNN".

---

## Phần 2. Muốn làm gì thì xem ở đâu

### I. Backend và dữ liệu

| Việc cần làm | Đọc trước | Sửa hoặc tạo ở | Tài liệu phải cập nhật |
|---|---|---|---|
| Thêm hoặc sửa endpoint | [api.md](api.md), Phần 1-3 | `backend/.../<feature>/controller`, `dto`, `service` | `docs/api.md` |
| Thêm mã lỗi | [api.md](api.md), Phần 4 | `common/exception/ErrorCode`, `GlobalExceptionHandler` | `docs/api.md`; `frontend/src/lib/errorMessages.ts` |
| Thay đổi schema | [database.md](database.md), Phần 2-5 | `backend/src/main/resources/db/migration/V<n+1>__...sql` | `docs/database.md` |
| Nạp dữ liệu CSV | [data/README.md](../data/README.md), [database.md](database.md), Phần 5 | `backend/.../ingestion/` | `data/README.md` nếu thêm file CSV |
| Sửa thuật toán Synergy | [architecture.md](architecture.md), Phần 5 | `backend/.../synergy/service/` | `docs/architecture.md`, Phần 5 |
| Thêm thuộc tính cấu hình | [architecture.md](architecture.md), Phần 10 | `application*.yml`, `common/config/AppProperties` | `docs/architecture.md`, Phần 10; `.env.example` |
| Thêm package hoặc class mới | [folder-structure.md](folder-structure.md), Phần 2 | `backend/src/main/java/com/pokenexus/` | `docs/folder-structure.md` |

### II. Frontend

| Việc cần làm | Đọc trước | Sửa hoặc tạo ở | Tài liệu phải cập nhật |
|---|---|---|---|
| Thêm trang hoặc route | [architecture.md](architecture.md), Phần 6; [design-system.md](design-system.md), Phần 7 | `frontend/src/pages/`, `frontend/src/app/router.tsx` | `docs/architecture.md`, Phần 6 |
| Thêm component | [design-system.md](design-system.md), Phần 5 | `frontend/src/features/<ten>/components/` hoặc `frontend/src/components/` | `docs/design-system.md` nếu là component dùng chung |
| Thêm màu, token | [design-system.md](design-system.md), Phần 2-3 | `frontend/src/styles/index.css` | `docs/design-system.md` |
| Gọi API mới | [api.md](api.md), Phần 3 | `frontend/src/features/<ten>/api.ts`, `hooks.ts`, `frontend/src/types/api.ts` | |
| Hiển thị ảnh Pokémon | [assets.md](assets.md), Phần 5 | `frontend/src/lib/assets.ts`, `PokemonSprite` | `docs/assets.md` |

### III. Quy trình và phát hành

| Việc cần làm | Đọc trước | Sửa hoặc tạo ở |
|---|---|---|
| Bắt đầu một task | [PLAN.md](../PLAN.md), [roadmap.md](roadmap.md), Phần 3 | Nhánh mới theo [git-workflow.md](git-workflow.md), Phần 1 |
| Tìm endpoint, trang, test của một tính năng | [spec.md](spec.md), Phần 6 | |
| Ghi quyết định kiến trúc | Phần 1, mục II | `docs/adr/NNNN-ten-quyet-dinh.md` |
| Sửa CI | `.github/workflows/ci.yml` | `.github/workflows/` |
| Gắn tag phát hành | [git-workflow.md](git-workflow.md), Phần 6 | `CHANGELOG.md` |
| Thêm sprite, font, ảnh | [assets.md](assets.md) | `frontend/public/`, `frontend/src/assets/` |
| Triển khai production | [architecture.md](architecture.md), Phần 11 | `backend/Dockerfile`, cấu hình hosting |
