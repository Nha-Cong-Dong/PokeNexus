# PokeNexus - Wireframe

- Phiên bản: 1.0 (task T103, cập nhật 2026-10-23)
- Wireframe low-fi cho 6 trang MVP, mỗi trang có bản 375 px (mobile) và 1440 px (desktop). Bố cục đầu vào: [design-system.md](../design-system.md), Phần 6.

---

## Phần 1. Danh sách

### I. File ảnh

| Trang | Route | Mobile | Desktop |
|---|---|---|---|
| Omni-Dex | `/` | [dex-mobile.png](dex-mobile.png) | [dex-desktop.png](dex-desktop.png) |
| Chi tiết Pokémon | `/pokemon/:idOrName` | [pokemon-detail-mobile.png](pokemon-detail-mobile.png) | [pokemon-detail-desktop.png](pokemon-detail-desktop.png) |
| Bảng tương khắc | `/types` | [type-chart-mobile.png](type-chart-mobile.png) | [type-chart-desktop.png](type-chart-desktop.png) |
| Bàn Cân Sức Mạnh | `/compare` | [compare-mobile.png](compare-mobile.png) | [compare-desktop.png](compare-desktop.png) |
| Team Builder | `/team-builder` | [team-builder-mobile.png](team-builder-mobile.png) | [team-builder-desktop.png](team-builder-desktop.png) |
| Đội chia sẻ | `/team/:shareCode` | [shared-team-mobile.png](shared-team-mobile.png) | [shared-team-desktop.png](shared-team-desktop.png) |

- Wireframe chỉ chốt bố cục và thứ tự thông tin; màu, font, khoảng cách lấy từ [design-system.md](../design-system.md).
- Số liệu trong ảnh (Charizard, Garchomp, điểm đội) chỉ để minh họa vị trí; ma trận tương khắc để trống có chủ ý.

---

## Phần 2. Sửa và tạo lại ảnh

### I. Các bước

- Sửa `src/wireframes.html`; xem trực tiếp bằng trình duyệt với `?page=<trang>` và `&device=mobile`.
- Chạy `bash docs/wireframes/src/capture.sh` trong Git Bash: chụp 12 ảnh bằng Microsoft Edge headless; bản mobile được dựng ở 375 px rồi cắt bằng `src/crop.ps1`.
- Chiều cao ảnh từng trang khai báo cuối `src/capture.sh`.
