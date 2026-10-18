# Dữ liệu nguồn

- Dữ liệu Pokémon lấy từ bộ CSV công khai trong repo [PokeAPI/pokeapi](https://github.com/PokeAPI/pokeapi), thư mục `data/v2/csv`.
- File CSV **không được commit** (đã khai báo trong `.gitignore`). Mỗi máy tự tải theo hướng dẫn dưới đây.
- Lý do chọn cách này: [docs/adr/0002-offline-data-from-csv.md](../docs/adr/0002-offline-data-from-csv.md).

---

## Phần 1. Danh sách file cần cho MVP

### I. Bảng file

| File | Nạp vào bảng | Cột chính |
|---|---|---|
| `types.csv` | `types` | `id`, `identifier`, `generation_id` |
| `type_efficacy.csv` | `type_efficacy` | `damage_type_id`, `target_type_id`, `damage_factor` |
| `regions.csv` | `regions` | `id`, `identifier` |
| `generations.csv` | `generations` | `id`, `main_region_id`, `identifier` |
| `evolution_chains.csv` | `evolution_chains` | `id` (bỏ qua `baby_trigger_item_id`) |
| `pokemon_species.csv` | `species` | `id`, `identifier`, `generation_id`, `evolves_from_species_id`, `evolution_chain_id`, `is_legendary`, `is_mythical` |
| `pokemon.csv` | `pokemon` | `id`, `identifier`, `species_id`, `height`, `weight`, `is_default` |
| `pokemon_types.csv` | `pokemon` (hệ chính, hệ phụ) | `pokemon_id`, `type_id`, `slot` |
| `pokemon_stats.csv` | `pokemon` (6 chỉ số) | `pokemon_id`, `stat_id`, `base_stat` |
| `stats.csv` | Tra cứu `stat_id` | `id`, `identifier` |
| `pokemon_evolution.csv` | `evolution_links` | `evolved_species_id`, `evolution_trigger_id`, `minimum_level`, `trigger_item_id` |
| `evolution_triggers.csv` | Tra cứu tên trigger | `id`, `identifier` |

- Tên cột ghi theo cấu trúc hiện tại của nguồn; hãy mở dòng tiêu đề của từng file để xác nhận trước khi viết chương trình nạp.

### II. Lưu ý khi nạp

- `types.csv` có thêm các hệ đặc biệt ngoài 18 hệ chuẩn (ID lớn hơn 18); chỉ nạp ID từ 1 đến 18.
- `pokemon_stats.csv` lưu mỗi chỉ số một dòng; cần gom 6 dòng của một Pokémon thành một bản ghi.
- `pokemon_types.csv`: `slot = 1` là hệ chính, `slot = 2` là hệ phụ.
- `is_fully_evolved` của một loài là TRUE khi ID loài đó không xuất hiện ở cột `evolves_from_species_id` của loài nào khác.
- `damage_factor` lưu dạng phần trăm: 0, 50, 100, 200.
- `pokemon_evolution.csv` không có cột loài gốc: loài tiến hóa **từ** lấy ở cột `evolves_from_species_id` của `pokemon_species.csv`, loài tiến hóa **thành** là `evolved_species_id`.
- `pokemon_evolution.csv` có thể có nhiều dòng cho cùng một loài (khác phiên bản game hoặc khác điều kiện); ưu tiên dòng có `is_default = 1`.

---

## Phần 2. Cách tải

### I. macOS, Linux, Git Bash

```bash
BASE_URL="https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv"
FILES="types type_efficacy regions generations evolution_chains pokemon_species pokemon pokemon_types pokemon_stats stats pokemon_evolution evolution_triggers"
mkdir -p data/csv
for name in $FILES; do
  curl -fsSL "$BASE_URL/$name.csv" -o "data/csv/$name.csv"
done
ls -lh data/csv
```

### II. Windows PowerShell

```powershell
$BaseUrl = "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv"
$Files = @("types","type_efficacy","regions","generations","evolution_chains","pokemon_species","pokemon","pokemon_types","pokemon_stats","stats","pokemon_evolution","evolution_triggers")
New-Item -ItemType Directory -Force -Path data/csv | Out-Null
foreach ($Name in $Files) {
  Invoke-WebRequest -Uri "$BaseUrl/$Name.csv" -OutFile "data/csv/$Name.csv"
}
Get-ChildItem data/csv
```

- Chạy lệnh từ thư mục gốc của repo.
- Nếu nhánh mặc định của repo PokéAPI thay đổi tên, sửa `master` trong `BASE_URL` cho đúng.

---

## Phần 3. Giấy phép và ghi nguồn

### I. Yêu cầu

- Kiểm tra file `LICENSE` trong repo PokéAPI trước khi phát hành và ghi nguồn PokéAPI trong README của dự án.
- Tên và hình ảnh Pokémon thuộc bản quyền của Nintendo, Game Freak và The Pokémon Company; dự án chỉ dùng cho mục đích phi thương mại.
