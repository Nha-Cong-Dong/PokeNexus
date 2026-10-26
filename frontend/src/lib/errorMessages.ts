const ERROR_MESSAGES: Record<string, string> = {
  INVALID_PARAMETER: 'Bộ lọc không hợp lệ. Hãy xóa bộ lọc và thử lại.',
  VALIDATION_FAILED: 'Dữ liệu gửi đi chưa hợp lệ. Hãy kiểm tra lại các ô đã nhập.',
  MALFORMED_JSON: 'Dữ liệu gửi đi bị lỗi định dạng.',
  DUPLICATE_POKEMON: 'Một Pokémon chỉ được chọn một lần trong đội.',
  DUPLICATE_SLOT: 'Hai thành viên đang dùng chung một vị trí.',
  UNKNOWN_POKEMON: 'Có Pokémon trong đội không còn tồn tại.',
  POKEMON_NOT_FOUND: 'Không tìm thấy Pokémon này.',
  TEAM_NOT_FOUND: 'Không tìm thấy đội với mã chia sẻ này.',
  RATE_LIMITED: 'Bạn lưu đội quá nhanh. Hãy đợi một phút rồi thử lại.',
  ROUTE_NOT_FOUND: 'Không tìm thấy đường dẫn.',
  DATA_NOT_READY: 'Dữ liệu Pokémon đang được nạp. Hãy thử lại sau ít phút.',
  NETWORK_ERROR: 'Không kết nối được máy chủ. Hãy kiểm tra backend đã chạy chưa.',
  INTERNAL_ERROR: 'Máy chủ gặp lỗi không mong muốn.',
}

const FALLBACK_MESSAGE = 'Đã có lỗi xảy ra.'

export function errorMessageFor(code: string | undefined): string {
  return (code && ERROR_MESSAGES[code]) || FALLBACK_MESSAGE
}
