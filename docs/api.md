# PokeNexus - Đặc tả REST API

- Phiên bản: 0.4 (phạm vi MVP, cập nhật 2026-10-27; khớp code backend sau khi làm T303-T308)
- Tài liệu tương tác (sau khi có backend): Swagger UI tại `http://localhost:8080/swagger-ui.html`. Khi Swagger và tài liệu này lệch nhau, sửa cho khớp trong cùng PR.
- Thay đổi so với 0.1: thêm schema DTO (Phần 3), danh mục lỗi có `code` (Phần 4), mã 429 và 503; bỏ `spriteUrl` khỏi response ([ADR 0005](adr/0005-hybrid-image-assets.md)); response đề xuất đổi từ mảng sang object.
- Thay đổi so với 0.3: `analyze` nhận 1-6 Pokémon để chấm điểm cả đội đủ 6; `recommendations` vẫn nhận 1-5; `synergyScore` của đội đã lưu tính trên mọi thành viên ([spec.md](spec.md) 1.3).

---

## Phần 1. Quy ước chung

### I. Danh sách quy ước

| Quy ước | Nội dung |
|---|---|
| Tiền tố | `/api/v1`. Thay đổi phá vỡ tương thích thì tăng lên `/api/v2` |
| Định dạng | JSON UTF-8, tên thuộc tính `camelCase` |
| Tên hệ | Chữ thường theo PokéAPI: `normal`, `fire`, `water`... Mảng 18 hệ luôn xếp theo ID hệ (1-18) |
| Tên Pokémon | Định danh PokéAPI, chữ thường, gạch nối (`charizard`, `rotom-wash`). Frontend tự định dạng để hiển thị |
| `idOrName` | Chuỗi toàn chữ số thì hiểu là ID; còn lại là tên, khớp `^[a-z0-9-]{1,60}$` |
| Hệ số sát thương | Số thực: `0`, `0.25`, `0.5`, `1`, `2`, `4` |
| Phân trang | `page` (bắt đầu từ 0), `size` (mặc định 24, tối thiểu 1, tối đa 100) |
| Sắp xếp | `sort=<thuộc tính>,<asc\|desc>`. Whitelist: `id`, `name`, `baseStatTotal`, `speed`. Mặc định `id,asc` |
| Lỗi | `ProblemDetail` (RFC 9457), `Content-Type: application/problem+json`, có thêm `code` (Phần 4) |
| Thời gian | ISO 8601 có múi giờ, ví dụ `2026-11-06T09:30:00Z` |
| Ảnh | API không trả URL ảnh; frontend sinh từ `id` ([assets.md](assets.md), Phần 5) |

### II. Mã trạng thái

| Mã | Khi nào |
|---|---|
| 200 OK | Đọc hoặc tính toán thành công |
| 201 Created | Tạo đội thành công, kèm header `Location` |
| 400 Bad Request | Đầu vào không hợp lệ (sai kiểu, vượt giới hạn, trùng lặp, ID không tồn tại trong body) |
| 404 Not Found | Không tìm thấy tài nguyên trên đường dẫn (Pokémon, đội, route) |
| 429 Too Many Requests | Vượt giới hạn lưu đội, kèm header `Retry-After` (giây) |
| 500 Internal Server Error | Lỗi không lường trước |
| 503 Service Unavailable | Dữ liệu chưa được nạp (`dataLoaded = false`) |

---

## Phần 2. Danh sách endpoint

### I. Tổng hợp

| Method | Endpoint | Mô tả | Tính năng |
|---|---|---|---|
| GET | `/api/v1/health` | Kiểm tra dịch vụ | |
| GET | `/api/v1/pokemon` | Omni-Dex: lọc, sắp xếp, phân trang | F01 |
| GET | `/api/v1/pokemon/{idOrName}` | Chi tiết Pokémon kèm lưới phòng thủ | F02 |
| GET | `/api/v1/pokemon/search` | Gợi ý tên khi gõ | F01, F04, F05 |
| GET | `/api/v1/pokemon/compare` | Bàn Cân Sức Mạnh | F04 |
| GET | `/api/v1/types` | Danh sách 18 hệ | F03 |
| GET | `/api/v1/types/matrix` | Ma trận tương khắc 18 x 18 | F03 |
| POST | `/api/v1/synergy/analyze` | Phân tích đội 1-6 Pokémon | F05 |
| POST | `/api/v1/synergy/recommendations` | Đề xuất Pokémon cho vị trí tiếp theo | F05 |
| POST | `/api/v1/teams` | Lưu đội, trả về `shareCode` | F06 |
| GET | `/api/v1/teams/shared/{shareCode}` | Xem đội qua mã chia sẻ | F06 |
| GET | `/api/v1/pokemon/{idOrName}/evolution` | Chuỗi tiến hóa của loài | F02 |

- `/pokemon/search` và `/pokemon/compare` là đường dẫn cố định nên được Spring ưu tiên hơn mẫu `/pokemon/{idOrName}`; không có Pokémon nào tên `search` hay `compare`.
- Synergy dùng POST vì đầu vào là danh sách có cấu trúc và có thể bổ sung tùy chọn sau này.

### II. `GET /api/v1/health`

- Response 200: `{ "status": "UP", "dataLoaded": true, "pokemonCount": 1302 }` (số liệu minh họa).
- `pokemonCount` là số dòng bảng `pokemon`; bảng chưa tồn tại hoặc rỗng thì trả `0`. `dataLoaded = pokemonCount > 0` và mọi cache trong bộ nhớ (`TypeChartService`, `PokemonProfileRegistry`) đã nạp; cache chưa nạp mà DB đã có dữ liệu thì health thử nạp lại.

### III. `GET /api/v1/pokemon`

#### 1. Tham số

| Tham số | Kiểu | Ràng buộc | Ví dụ | Ý nghĩa |
|---|---|---|---|---|
| `type` | chuỗi, lặp tối đa 2 lần | Tên hệ hợp lệ, không trùng | `type=dragon&type=ground` | Pokémon có **tất cả** các hệ đã chọn |
| `gen` | số | 1-9 | `gen=4` | Thế hệ của loài |
| `minBst`, `maxBst` | số | 0-1530, `minBst <= maxBst` | `minBst=500` | Khoảng tổng chỉ số |
| `minSpeed` | số | 0-255 | `minSpeed=100` | Tốc độ tối thiểu |
| `form` | chuỗi, lặp | `DEFAULT`, `REGIONAL`, `MEGA`, `GMAX`, `OTHER` | `form=MEGA` | Mặc định `DEFAULT` và `REGIONAL` |
| `page`, `size`, `sort` | | Phần 1 | `sort=speed,desc` | |

#### 2. Response 200

- `PageResponse<PokemonSummary>` (Phần 3).

#### 3. Lỗi

- 400 `INVALID_PARAMETER`: hệ không tồn tại, `gen` ngoài 1-9, `size > 100`, `sort` ngoài whitelist, `minBst > maxBst`.

### IV. `GET /api/v1/pokemon/{idOrName}`

- Response 200: `PokemonDetail`.
- 400 `INVALID_PARAMETER`: `idOrName` sai định dạng. 404 `POKEMON_NOT_FOUND`: không tồn tại.

### V. `GET /api/v1/pokemon/search`

| Tham số | Ràng buộc | Ý nghĩa |
|---|---|---|
| `q` | 2-30 ký tự, sau khi trim | Khớp tên bắt đầu bằng `q` trước, sau đó tên chứa `q`; không phân biệt hoa thường |
| `limit` | 1-10, mặc định 10 | Số kết quả tối đa |
| `form` | Như `GET /pokemon` | Mặc định `DEFAULT` và `REGIONAL` |

- Response 200: mảng `PokemonRef`, có thể rỗng.
- Chuẩn hóa `q`: chữ thường, khoảng trắng bên trong đổi thành `-`; `q` chứa ký tự ngoài `[a-z0-9-]` trả mảng rỗng, không báo lỗi. Trong mỗi nhóm (khớp đầu tên, chứa `q`) xếp theo `id` tăng dần.

### VI. `GET /api/v1/pokemon/compare`

| Tham số | Ràng buộc |
|---|---|
| `left`, `right` | Bắt buộc, dạng `idOrName`, hai giá trị khác nhau |

- Response 200: `CompareResponse`.
- 400 `INVALID_PARAMETER`: thiếu tham số hoặc `left = right`. 404 `POKEMON_NOT_FOUND`.

### VII. `GET /api/v1/types` và `GET /api/v1/types/matrix`

- `/types`: mảng `{ "id": 10, "name": "fire" }`, 18 phần tử.
- `/types/matrix`: `TypeMatrix`. Hai endpoint có `Cache-Control: public, max-age=86400`.

### VIII. `POST /api/v1/synergy/analyze`

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| `pokemonIds` | mảng số | 1-6 phần tử, không trùng, mỗi ID tồn tại |

- Response 200: `AnalyzeResponse`.
- 400 `VALIDATION_FAILED` (rỗng, quá 6), `DUPLICATE_POKEMON`, `UNKNOWN_POKEMON`.

### IX. `POST /api/v1/synergy/recommendations`

| Trường | Kiểu | Ràng buộc | Mặc định |
|---|---|---|---|
| `pokemonIds` | mảng số | 1-5 phần tử (đội phải còn ít nhất 1 vị trí trống), không trùng, mỗi ID tồn tại | |
| `limit` | số | 1-10 | 3 |
| `excludeLegendary` | boolean | | `false` |
| `minBaseStatTotal` | số hoặc `null` | 0-1530 | `null` |

- Response 200: `RecommendationResponse`. `items` có thể ít hơn `limit` nếu tập ứng viên nhỏ.

### X. `POST /api/v1/teams`

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| `name` | chuỗi | 1-60 ký tự sau khi trim |
| `members` | mảng | 1-6 phần tử |
| `members[].slot` | số | 1-6, không trùng trong đội |
| `members[].pokemonId` | số | Tồn tại, không trùng trong đội |
| `members[].nickname` | chuỗi hoặc `null` | Tối đa 30 ký tự; chuỗi rỗng lưu thành `null` |

- Response 201: `TeamResponse`, header `Location: /api/v1/teams/shared/{shareCode}`.
- `name` và `nickname` được trim; `nickname` rỗng hoặc toàn khoảng trắng lưu thành `null`. Giới hạn lưu chỉ đếm request đã qua Bean Validation. Sinh trùng `shareCode` 3 lần liên tiếp thì trả 500.
- 400 `VALIDATION_FAILED`, `DUPLICATE_POKEMON`, `DUPLICATE_SLOT`, `UNKNOWN_POKEMON`. 429 `RATE_LIMITED`.

### XI. `GET /api/v1/teams/shared/{shareCode}`

- `shareCode` khớp `^[A-Za-z0-9]{8}$`, phân biệt hoa thường.
- Response 200: `TeamResponse`. 400 `INVALID_PARAMETER`: sai định dạng. 404 `TEAM_NOT_FOUND`.

### XII. `GET /api/v1/pokemon/{idOrName}/evolution`

- Chuỗi tiến hóa của loài chứa Pokémon đó (US-08, làm sớm ngày 2026-10-26 cho trang chi tiết). Response 200: `EvolutionResponse` (Phần 3, mục II). 404 `POKEMON_NOT_FOUND`.
- `stages` là danh sách phẳng xếp theo `speciesId`; mỗi phần tử lấy `pokemonId`, `name`, `types` của dạng mặc định; loài không có dạng mặc định bị bỏ qua. Frontend dựng cây từ `evolvesFromSpeciesId`.

### XIII. Dự kiến sau MVP

| Method | Endpoint | Tính năng |
|---|---|---|
| GET | `/api/v1/pokemon/speed-tiers` | Bảng tốc độ cấp 50 (US-09) |

---

## Phần 3. Schema DTO

### I. Kiểu dùng chung

```typescript
type TypeName = "normal" | "fighting" | "flying" | "poison" | "ground" | "rock"
  | "bug" | "ghost" | "steel" | "fire" | "water" | "grass" | "electric"
  | "psychic" | "ice" | "dragon" | "dark" | "fairy";

type FormCategory = "DEFAULT" | "REGIONAL" | "MEGA" | "GMAX" | "OTHER";

interface Stats {
  hp: number; attack: number; defense: number;
  specialAttack: number; specialDefense: number; speed: number;
}

interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

interface PokemonRef {
  id: number;
  name: string;
  types: TypeName[];
}
```

- Schema viết bằng TypeScript để dùng lại trực tiếp ở `frontend/src/types/api.ts`. Phía backend là các `record` cùng tên trường.
- Dùng `PageResponse` riêng thay vì serialize thẳng `Page` của Spring Data, vì cấu trúc JSON của `Page` không được Spring bảo đảm ổn định.

### II. Bách khoa

```typescript
interface PokemonSummary extends PokemonRef {
  generation: number;
  formCategory: FormCategory;
  baseStatTotal: number;
  speed: number;
}

interface DefenseEntry {
  attackingType: TypeName;
  multiplier: number;
}

interface PokemonDetail extends PokemonRef {
  speciesId: number;
  speciesName: string;
  generation: number;
  formCategory: FormCategory;
  isLegendary: boolean;
  isMythical: boolean;
  isFullyEvolved: boolean;
  stats: Stats;
  baseStatTotal: number;
  heightDm: number;
  weightHg: number;
  defense: DefenseEntry[];
  forms: { id: number; name: string; formCategory: FormCategory }[];
}

interface CompareResponse {
  left: PokemonDetail;
  right: PokemonDetail;
  verdict: {
    typeAdvantage: { leftBestMultiplier: number; rightBestMultiplier: number; winner: "LEFT" | "RIGHT" | "TIE" };
    statTotal: { difference: number; winner: "LEFT" | "RIGHT" | "TIE" };
    speed: { difference: number; winner: "LEFT" | "RIGHT" | "TIE" };
    summary: string[];
  };
}

interface TypeMatrix {
  types: TypeName[];
  multipliers: number[][];
}

interface EvolutionStage {
  speciesId: number;
  pokemonId: number;
  name: string;
  types: TypeName[];
  evolvesFromSpeciesId: number | null;
  trigger: string | null;
  minLevel: number | null;
  item: string | null;
}

interface EvolutionResponse {
  chainId: number;
  stages: EvolutionStage[];
}
```

- `defense` có đúng 18 phần tử. `forms` liệt kê mọi dạng cùng loài, kể cả dạng đang xem.
- `typeAdvantage`: hệ số cao nhất mà đòn cùng hệ (theo hệ của Pokémon) của mỗi bên gây lên bên kia.
- `difference` luôn `>= 0` (giá trị tuyệt đối); bên hơn xem ở `winner`. `summary` gồm 3 câu tiếng Việt về hệ, tổng chỉ số, tốc độ, ví dụ "Garchomp nhanh hơn (102 so với 100)."
- `TypeMatrix.multipliers[i][j]`: hệ tấn công `types[i]` đánh hệ phòng thủ `types[j]`.

### III. Synergy

```typescript
interface TypeMatrixRow {
  attackingType: TypeName;
  multipliers: number[];
  weakCount: number;
  resistCount: number;
  pressure: number;
  criticalHole: boolean;
}

interface AnalyzeResponse {
  members: PokemonRef[];
  teamScore: number;
  typeMatrix: TypeMatrixRow[];
  offensiveCoverage: { coveredTypeCount: number; uncoveredTypes: TypeName[] };
  statRadar: Stats;
}

interface Recommendation extends PokemonRef {
  score: number;
  breakdown: { defense: number; offense: number; stats: number };
  baseStatTotal: number;
  reasons: string[];
}

interface RecommendationResponse {
  candidateCount: number;
  items: Recommendation[];
}
```

- `typeMatrix` có 18 dòng; `multipliers` cùng thứ tự với `members` (thứ tự ID trong request).
- `resistCount` gồm cả thành viên miễn nhiễm. `teamScore`, `score`, `statRadar` làm tròn 1 chữ số thập phân. `breakdown` là các giá trị đã chuẩn hóa 0-1 (làm tròn 3 chữ số), trước khi nhân trọng số.
- `candidateCount` đếm ứng viên sau bộ lọc (`excludeLegendary`, `minBaseStatTotal`), trước khi loại trùng tổ hợp hệ. Lý do mặc định khi không có lý do phòng thủ, tấn công: "Tổng chỉ số BST {n}".

### IV. Đội hình

```typescript
interface TeamMember extends PokemonRef {
  slot: number;
  nickname: string | null;
}

interface TeamResponse {
  shareCode: string;
  name: string;
  synergyScore: number | null;
  createdAt: string;
  members: TeamMember[];
}
```

- Response đội trả kèm `name`, `types` của từng thành viên để `SharedTeamPage` hiển thị mà không cần gọi thêm API.
- `synergyScore` là `teamScore` của mọi thành viên (1-6) tại thời điểm lưu; đội 1 thành viên vẫn có điểm.

---

## Phần 4. Danh mục lỗi

### I. Mã lỗi

| `code` | HTTP | Khi nào |
|---|---|---|
| `VALIDATION_FAILED` | 400 | Body vi phạm ràng buộc Bean Validation; có thêm mảng `errors` |
| `INVALID_PARAMETER` | 400 | Query hoặc path sai kiểu, sai định dạng, ngoài whitelist |
| `MALFORMED_JSON` | 400 | Body không phải JSON hợp lệ |
| `DUPLICATE_POKEMON` | 400 | ID Pokémon trùng trong một yêu cầu |
| `DUPLICATE_SLOT` | 400 | Slot trùng trong một đội |
| `UNKNOWN_POKEMON` | 400 | ID Pokémon trong body không tồn tại |
| `POKEMON_NOT_FOUND` | 404 | Pokémon trên đường dẫn không tồn tại |
| `TEAM_NOT_FOUND` | 404 | Mã chia sẻ không tồn tại |
| `ROUTE_NOT_FOUND` | 404 | Đường dẫn API không tồn tại |
| `RATE_LIMITED` | 429 | Vượt giới hạn lưu đội |
| `DATA_NOT_READY` | 503 | Dữ liệu tĩnh chưa nạp; áp dụng cho mọi endpoint đọc dữ liệu Pokémon, hệ, synergy |
| `INTERNAL_ERROR` | 500 | Lỗi không lường trước |

- Lỗi khung Spring không có mã riêng (ví dụ 405 sai method, 415 sai `Content-Type`) giữ mã HTTP gốc và dùng `code` `INVALID_PARAMETER`; lỗi 404 khác dùng `ROUTE_NOT_FOUND`; lỗi 5xx dùng `INTERNAL_ERROR`.
- `detail` là thông điệp tiếng Anh cho nhà phát triển. Frontend hiển thị thông điệp tiếng Việt dựa trên `code`, không hiển thị trực tiếp `detail`.

### II. Ví dụ

```json
{
  "type": "about:blank",
  "title": "Bad Request",
  "status": 400,
  "detail": "Request validation failed",
  "instance": "/api/v1/synergy/analyze",
  "code": "VALIDATION_FAILED",
  "errors": [
    { "field": "pokemonIds", "message": "size must be between 1 and 6" }
  ]
}
```

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 42
Content-Type: application/problem+json

{
  "type": "about:blank",
  "title": "Too Many Requests",
  "status": 429,
  "detail": "Save limit exceeded, retry later",
  "instance": "/api/v1/teams",
  "code": "RATE_LIMITED"
}
```

---

## Phần 5. Ví dụ request và response

### I. Phân tích đội

#### 1. Request

```http
POST /api/v1/synergy/analyze
Content-Type: application/json

{
  "pokemonIds": [6, 130, 149, 663, 637]
}
```

#### 2. Response (rút gọn, số liệu minh họa)

```json
{
  "members": [
    { "id": 6, "name": "charizard", "types": ["fire", "flying"] },
    { "id": 130, "name": "gyarados", "types": ["water", "flying"] }
  ],
  "teamScore": 41.0,
  "typeMatrix": [
    {
      "attackingType": "rock",
      "multipliers": [4.0, 2.0, 2.0, 4.0, 4.0],
      "weakCount": 5,
      "resistCount": 0,
      "pressure": 8,
      "criticalHole": true
    }
  ],
  "offensiveCoverage": {
    "coveredTypeCount": 12,
    "uncoveredTypes": ["normal", "water", "fairy"]
  },
  "statRadar": {
    "hp": 72, "attack": 81, "defense": 60,
    "specialAttack": 78, "specialDefense": 66, "speed": 75
  }
}
```

- Dòng `rock` là số liệu thật của đội ví dụ; `members` rút gọn còn 2; `teamScore`, `offensiveCoverage`, `statRadar` chỉ minh họa cấu trúc.

### II. Đề xuất

#### 1. Request

```http
POST /api/v1/synergy/recommendations
Content-Type: application/json

{
  "pokemonIds": [6, 130, 149, 663, 637],
  "limit": 3,
  "excludeLegendary": true,
  "minBaseStatTotal": 450
}
```

#### 2. Response (cấu trúc, số liệu minh họa)

```json
{
  "candidateCount": 412,
  "items": [
    {
      "id": 0,
      "name": "string",
      "types": ["string"],
      "score": 0.0,
      "breakdown": { "defense": 0.0, "offense": 0.0, "stats": 0.0 },
      "baseStatTotal": 0,
      "reasons": ["Chống chịu hệ Rock (đội đang hở mức 8)"]
    }
  ]
}
```

### III. Lưu đội

#### 1. Request

```http
POST /api/v1/teams
Content-Type: application/json

{
  "name": "Rain Team",
  "members": [
    { "slot": 1, "pokemonId": 6, "nickname": null },
    { "slot": 2, "pokemonId": 130, "nickname": "Gyara" }
  ]
}
```

#### 2. Response

```http
HTTP/1.1 201 Created
Location: /api/v1/teams/shared/a1B2c3D4
Content-Type: application/json

{
  "shareCode": "a1B2c3D4",
  "name": "Rain Team",
  "synergyScore": 62.0,
  "createdAt": "2026-11-06T09:30:00Z",
  "members": [
    { "slot": 1, "id": 6, "name": "charizard", "types": ["fire", "flying"], "nickname": null },
    { "slot": 2, "id": 130, "name": "gyarados", "types": ["water", "flying"], "nickname": "Gyara" }
  ]
}
```

- `synergyScore` là số minh họa.
