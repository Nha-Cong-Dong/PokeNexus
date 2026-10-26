# Thiết lập repo trên GitHub

- Hướng dẫn tạo repo, đẩy mã lần đầu, cấu hình nhãn, milestone, bảo vệ nhánh và bảng công việc.
- Các lệnh dùng [GitHub CLI](https://cli.github.com) (`gh`). Mọi bước đều làm được bằng giao diện web nếu không dùng `gh`.

---

## Phần 1. Tạo repo và đẩy mã lần đầu

### I. Chuẩn bị

```bash
gh auth login
cd pokenexus
git init -b main
git add .
git commit -m "chore: initialize repository with docs and config"
```

- Trước khi commit, chạy `git status` để chắc chắn `.env` và các file trong `data/csv/` không nằm trong danh sách.

### II. Tạo repo và đẩy lên

```bash
gh repo create Nha-Cong-Dong/PokeNexus --public --source=. --remote=origin --push \
  --description "Pokémon encyclopedia and VGC team builder with synergy analysis. Spring Boot + React + MySQL."
gh repo edit --add-topic pokemon,pokeapi,vgc,spring-boot,java,react,typescript,mysql,hackathon
gh repo edit --enable-wiki=false --delete-branch-on-merge
```

- Repo chính thức: https://github.com/Nha-Cong-Dong/PokeNexus. Nếu đổi tên hoặc chuyển repo, cập nhật đường dẫn trong `README.md` và `.github/ISSUE_TEMPLATE/config.yml`.

---

## Phần 2. Nhãn (Labels)

### I. Bộ nhãn và lệnh tạo

- 14 nhãn chia 4 nhóm: `type:` (loại việc), `area:` (phần của hệ thống), `priority:` (MVP, mở rộng, tương lai), `status: blocked`. Tên, màu, ý nghĩa nằm trong lệnh dưới đây.

```bash
gh label create "type: feature" --color 1D76DB --description "Tính năng mới" --force
gh label create "type: bug" --color D73A4A --description "Lỗi" --force
gh label create "type: docs" --color 0075CA --description "Tài liệu" --force
gh label create "type: chore" --color C5DEF5 --description "Cấu hình, công cụ, phụ thuộc" --force
gh label create "type: test" --color BFD4F2 --description "Kiểm thử" --force
gh label create "area: backend" --color 5319E7 --description "Spring Boot" --force
gh label create "area: frontend" --color FBCA04 --description "React" --force
gh label create "area: database" --color 0E8A16 --description "Schema, migration" --force
gh label create "area: ingestion" --color 006B75 --description "Nạp dữ liệu PokéAPI" --force
gh label create "area: ci" --color BFDADC --description "GitHub Actions" --force
gh label create "priority: mvp" --color B60205 --description "Bắt buộc cho MVP" --force
gh label create "priority: extended" --color FF9F1C --description "Mở rộng sau MVP" --force
gh label create "priority: future" --color EDEDED --description "Hướng phát triển" --force
gh label create "status: blocked" --color 000000 --description "Đang bị chặn" --force
```

- `--force` cập nhật nhãn nếu đã tồn tại, nên chạy lại nhiều lần vẫn an toàn.
- Có thể xóa các nhãn mặc định của GitHub không dùng tới (`gh label delete <tên>`).

---

## Phần 3. Milestone

### I. Lệnh tạo

```bash
gh api repos/{owner}/{repo}/milestones -f title="W1 - Ý tưởng và khởi tạo" -f due_on="2026-10-25T23:59:59Z"
gh api repos/{owner}/{repo}/milestones -f title="W2 - Đặc tả và khung dự án" -f due_on="2026-11-01T23:59:59Z"
gh api repos/{owner}/{repo}/milestones -f title="W3 - MVP" -f due_on="2026-11-08T23:59:59Z"
gh api repos/{owner}/{repo}/milestones -f title="W4 - Hoàn thiện và demo" -f due_on="2026-11-15T23:59:59Z"
```

- Mỗi milestone kết thúc vào Chủ nhật của tuần tương ứng, tuần 1 bắt đầu ngày 2026-10-18. `{owner}` và `{repo}` được `gh` tự điền khi chạy trong thư mục repo.
- Nội dung từng milestone xem ở [roadmap.md](roadmap.md).

---

## Phần 4. Bảo vệ nhánh `main`

### I. Ruleset

- Vào **Settings > Rules > Rulesets > New branch ruleset**.
- Target: nhánh mặc định (`main`). Enforcement: Active.
- Bật **Require a pull request before merging** (số người duyệt: 0, vì làm một mình).
- Bật **Require status checks to pass**, chọn các check `Backend (Java 25)` và `Frontend (Node 24)` sau khi CI đã chạy ít nhất một lần.
- Bật **Block force pushes**.

### II. Cài đặt merge

- **Settings > General > Pull Requests:** chỉ bật **Allow squash merging**; bật **Automatically delete head branches**.

---

## Phần 5. Bảo mật và phụ thuộc

### I. Các mục cần bật

- **Settings > Code security** (tên mục có thể là *Advanced Security* tùy giao diện): bật Dependabot alerts, Dependabot security updates, Secret scanning và Push protection nếu có.
- Dependabot version updates cấu hình trong `.github/dependabot.yml` cho GitHub Actions (`/`), Maven (`/backend`) và npm (`/frontend`), chạy thứ Hai hằng tuần. Với Maven và npm, bản minor và patch gộp thành một PR mỗi ecosystem; bản major tách PR riêng (cách xử lý: [git-workflow.md](git-workflow.md), Phần 8).

---

## Phần 6. Bảng công việc (GitHub Projects)

### I. Thiết lập

- Tạo Project dạng **Board** từ tab **Projects** của repo, đặt tên `PokeNexus`.
- Các cột: `Backlog`, `To Do`, `In Progress`, `In Review`, `Done`.
- Thêm trường `Milestone` và `Labels` vào chế độ xem; lọc theo milestone tuần hiện tại.
- Giới hạn cột `In Progress` tối đa 2 thẻ.
- Đã tạo ngày 2026-10-25: [PokeNexus](https://github.com/orgs/Nha-Cong-Dong/projects/1) (riêng tư, liên kết repo). View `Board` lọc milestone tuần đang làm; view `Tất cả` dạng bảng hiện Status, Milestone, Labels, PR liên kết.
- Ba thiết lập chỉ làm được trên giao diện web, không có trong API: giới hạn cột (Board > menu cột `In Progress` > Set limit), workflow **Auto-add to project** cho Issue mới của repo, và đổi bộ lọc milestone của view `Board` khi sang tuần mới.
- Mỗi task trong [roadmap.md](roadmap.md), Phần 3 là một Issue (Issue #9-#26 tạo ở T104).
