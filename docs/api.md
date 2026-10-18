# PokéNexus - Đặc tả REST API

- Phiên bản: 0.1 (phạm vi MVP)
- Tài liệu tương tác (sau khi có backend): Swagger UI tại `http://localhost:8080/swagger-ui.html`.

---

## Phần 1. Quy ước chung

### I. Danh sách quy ước

| Quy ước | Nội dung |
|---|---|
| Tiền tố | `/api/v1` |
| Định dạng | JSON, tên thuộc tính `camelCase` |
| Phân trang | `page` (bắt đầu từ 0), `size` (mặc định 24, tối đa 100) |
| Sắp xếp | `sort=<thuộc tính>,<asc\|desc>`, ví dụ `sort=baseStatTotal,desc` |
| Lỗi | Chuẩn `ProblemDetail` (RFC 9457), `Content-Type: application/problem+json` |

### II. Mã trạng thái

| Mã | Khi nào |
|---|---|
| 200 OK | Đọc hoặc tính toán thành công |
| 201 Created | Tạo đội thành công, kèm header `Location` |
| 400 Bad Request | Đầu vào không hợp lệ (sai kiểu, vượt giới hạn, trùng lặp) |
| 404 Not Found | Không tìm thấy Pokémon, đội |
| 500 Internal Server Error | Lỗi không lường trước |

---

## Phần 2. Danh sách endpoint MVP

### I. Bách khoa

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/v1/health` | Kiểm tra dịch vụ |
| GET | `/api/v1/pokemon` | Omni-Dex: lọc, sắp xếp, phân trang |
| GET | `/api/v1/pokemon/{idOrName}` | Chi tiết Pokémon kèm lưới phòng thủ |
| GET | `/api/v1/pokemon/search?q=` | Gợi ý tên khi gõ (tối đa 10 kết quả) |
| GET | `/api/v1/pokemon/compare?left=&right=` | Bàn Cân Sức Mạnh |
| GET | `/api/v1/types` | Danh sách 18 hệ |
| GET | `/api/v1/types/matrix` | Ma trận tương khắc 18 x 18 |

#### 1. Tham số lọc của `GET /api/v1/pokemon`

| Tham số | Kiểu | Ví dụ | Ý nghĩa |
|---|---|---|---|
| `type` | chuỗi, lặp tối đa 2 lần | `type=dragon&type=ground` | Pokémon có (các) hệ này |
| `gen` | số 1-9 | `gen=4` | Thế hệ |
| `minBst`, `maxBst` | số | `minBst=500` | Khoảng tổng chỉ số |
| `minSpeed` | số | `minSpeed=100` | Tốc độ tối thiểu |
| `page`, `size`, `sort` | | | Xem Phần 1 |

### II. Synergy

| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/v1/synergy/analyze` | Phân tích đội 1-5 Pokémon |
| POST | `/api/v1/synergy/recommendations` | Đề xuất Pokémon cho vị trí tiếp theo |

- Dùng POST vì đầu vào là danh sách có cấu trúc và có thể bổ sung tùy chọn sau này.

### III. Đội hình

| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/v1/teams` | Lưu đội, trả về `shareCode` |
| GET | `/api/v1/teams/shared/{shareCode}` | Xem đội qua mã chia sẻ |

---

## Phần 3. Ví dụ request và response

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

- Dòng `rock` là số liệu thật của đội ví dụ; các giá trị `teamScore`, `coveredTypeCount`, `statRadar` chỉ minh họa cấu trúc.

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

#### 2. Response (cấu trúc)

```json
[
  {
    "pokemonId": 0,
    "name": "string",
    "spriteUrl": "string",
    "types": ["string"],
    "score": 0.0,
    "reasons": ["Che chắn hệ ROCK (đội đang hở mức 8)"]
  }
]
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

{
  "shareCode": "a1B2c3D4",
  "name": "Rain Team",
  "members": [
    { "slot": 1, "pokemonId": 6, "nickname": null },
    { "slot": 2, "pokemonId": 130, "nickname": "Gyara" }
  ]
}
```

### IV. Lỗi

#### 1. Ví dụ đầu vào vượt giới hạn

```json
{
  "type": "about:blank",
  "title": "Bad Request",
  "status": 400,
  "detail": "pokemonIds: size must be between 1 and 5",
  "instance": "/api/v1/synergy/analyze"
}
```
