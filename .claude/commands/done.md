---
description: Kiểm tra Definition of Done trước khi mở hoặc merge PR
argument-hint: "[mã task, ví dụ T205]"
disable-model-invocation: true
---

Kiểm tra Definition of Done cho thay đổi hiện tại (task: $ARGUMENTS).

1. Chạy `git status` và `git diff` để xác định phạm vi thay đổi.
2. Chạy kiểm tra theo phần bị thay đổi và báo kết quả thật, không báo "đã chạy" khi chưa chạy:
   - `backend/`: `./mvnw -B verify` (PowerShell: `.\mvnw.cmd -B verify`).
   - `frontend/`: `npm run lint`, `npm run test`, `npm run build`.
   - Chỉ tài liệu: kiểm tra mọi link tương đối trong file `.md` đã sửa đều tồn tại.
3. Đối chiếu từng mục và ghi Đạt, Không đạt, Không áp dụng:
   - Checklist `CONTRIBUTING.md`, Phần 4.
   - Cột Kiểm tra của task trong `docs/roadmap.md`.
   - Checklist tự review `docs/git-workflow.md`, Phần 4, mục II.
   - Đổi API, schema, thư mục thì `docs/api.md`, `docs/database.md`, `docs/folder-structure.md` đã cập nhật.
   - Không có `.env`, CSV, dump, bí mật, `System.out.println`, `console.log` trong diff.
4. Cập nhật `PLAN.md`: trạng thái task, dòng nhật ký kèm kết quả kiểm tra.
5. Đề xuất tiêu đề PR theo Conventional Commits với scope hợp lệ trong `CLAUDE.md`, Phần 5. Không tự commit hay push.
