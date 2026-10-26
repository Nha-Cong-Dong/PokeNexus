---
description: Lập kế hoạch thực hiện một task trong roadmap (ví dụ /task T205)
argument-hint: "<mã task, ví dụ T205>"
disable-model-invocation: true
---

Lập kế hoạch cho task $ARGUMENTS của dự án PokeNexus. Chưa sửa code ở bước này.

1. Đọc `PLAN.md`, dòng $ARGUMENTS trong `docs/roadmap.md` (Phần 3) và dòng tính năng liên quan trong `docs/spec.md`, Phần 6.
2. Kiểm tra task phụ thuộc (cột Đầu vào) đã xong chưa. Chưa xong thì dừng và báo.
3. Đọc các tài liệu mà `docs/README.md`, Phần 2 chỉ tới cho loại việc này, cùng `backend/CLAUDE.md` hoặc `frontend/CLAUDE.md` nếu liên quan.
4. Trình bày theo cấu trúc:
   - Goal: một câu.
   - Tiêu chí hoàn thành: lấy từ cột Kiểm tra của roadmap và tiêu chí trong `docs/spec.md`, đo được.
   - Phạm vi: làm gì, không làm gì.
   - Tên nhánh theo `docs/git-workflow.md`, Phần 1, mục IV.
   - Các bước theo layer, mỗi bước ghi file sẽ tạo hoặc sửa và lệnh kiểm tra.
   - Test sẽ viết: ít nhất 1 case thường và 1 case biên.
   - Tài liệu phải cập nhật cùng lúc.
   - Rủi ro và câu hỏi còn mở (tối đa 3 câu, mỗi câu có phương án đề xuất).
5. Chờ người dùng xác nhận trước khi sửa file. Sau khi xác nhận, đổi trạng thái task trong `PLAN.md` thành "Đang làm".
