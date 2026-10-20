# Tài liệu dự án PokeNexus

## Phần 1. Mục lục

### I. Danh sách tài liệu

| Tài liệu | Nội dung | Cập nhật khi |
|---|---|---|
| [product.md](product.md) | Tầm nhìn, persona, user story, phạm vi | Thay đổi phạm vi sản phẩm |
| [spec.md](spec.md) | Đặc tả MVP, tiêu chí chấp nhận, kịch bản kiểm chứng | Chốt hoặc thay đổi yêu cầu |
| [roadmap.md](roadmap.md) | Lộ trình 4 tuần: Epic, task theo ngày, MoSCoW, buffer, rủi ro | Cuối mỗi tuần |
| [architecture.md](architecture.md) | Kiến trúc C4, luồng xử lý, thuật toán, bảo mật, triển khai, chiến lược test | Thay đổi kiến trúc |
| [database.md](database.md) | ERD, từ điển dữ liệu, index, migration, ingestion | Thêm hoặc sửa migration |
| [api.md](api.md) | Quy ước, đặc tả từng endpoint, schema DTO, danh mục lỗi | Thêm hoặc sửa endpoint |
| [folder-structure.md](folder-structure.md) | Cây thư mục repo, package và class backend, cấu trúc frontend, quy tắc đặt tên | Thêm package hoặc thư mục cấp 1-2 |
| [design-system.md](design-system.md) | Design token, Tailwind, component, pattern, bố cục trang, accessibility | Thay đổi giao diện chung |
| [assets.md](assets.md) | Danh mục assets, sprite, font, ảnh, dung lượng, giấy phép | Thêm loại asset mới |
| [git-workflow.md](git-workflow.md) | Mô hình nhánh, commit, PR, xung đột, tag, hoàn tác | Thay đổi quy trình |
| [github-setup.md](github-setup.md) | Thiết lập repo, nhãn, milestone, bảo vệ nhánh | Thay đổi cấu hình GitHub |
| [adr/](adr) | Các quyết định kiến trúc (ADR) | Có quyết định quan trọng mới |
| `wireframes/` | Wireframe các trang chính | Thay đổi bố cục giao diện |

### II. Quy ước ADR

- Đặt tên `NNNN-ten-quyet-dinh.md`, đánh số tăng dần, không xóa ADR cũ.
- Quyết định bị thay thế thì đổi trạng thái thành "Đã thay thế bởi ADR NNNN".
