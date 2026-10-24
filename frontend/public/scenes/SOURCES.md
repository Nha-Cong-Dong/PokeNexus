# PokeNexus - Nguồn ảnh khung cảnh

- Cập nhật: 2026-10-25
- Quy định ảnh (nội dung, kích thước, dung lượng): [docs/design-system.md](../../../docs/design-system.md), Phần 4.
- Bản quyền hình ảnh thuộc Nintendo, Game Freak, The Pokémon Company. Dự án dùng phi thương mại, giống sprite và artwork ([ADR 0005](../../../docs/adr/0005-hybrid-image-assets.md)).

---

## Phần 1. Danh sách ảnh

### I. Ảnh đang dùng

| Scene       | File                                        | Game                      | Vị trí trong game      | Nguồn                                                                                                                                  | Xử lý                                 |
| ----------- | ------------------------------------------- | ------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `grassland` | `grassland-1600.webp`, `grassland-800.webp` | Pokémon Scarlet và Violet | Poco Path, Paldea      | [Bulbagarden Archives: NM SV Poco Path.jpg](https://archives.bulbagarden.net/wiki/File:NM_SV_Poco_Path.jpg) (gốc 1918 x 1079)          | Cắt 16:9, thu nhỏ, WebP chất lượng 80 |
| `stadium`   | `stadium-1600.webp`, `stadium-800.webp`     | Pokémon Sword và Shield   | Hulbury Stadium, Galar | [Bulbagarden Archives: Hulbury Stadium SwSh.png](https://archives.bulbagarden.net/wiki/File:Hulbury_Stadium_SwSh.png) (gốc 1280 x 720) | Phóng to lên 1600, WebP chất lượng 80 |

- Scene chưa có trong bảng hiển thị gradient dự phòng khai báo ở `src/lib/scenes.ts`.
- Thêm ảnh: ghi một dòng vào bảng này, sửa `photo: true` cho scene đó trong `src/lib/scenes.ts`.
