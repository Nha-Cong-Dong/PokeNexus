const ERROR_MESSAGES: Record<string, string> = {
  INVALID_PARAMETER: 'Bộ lọc không hợp lệ. Hãy xóa bộ lọc và thử lại.',
  POKEMON_NOT_FOUND: 'Không tìm thấy Pokémon này.',
  ROUTE_NOT_FOUND: 'Không tìm thấy đường dẫn.',
  DATA_NOT_READY: 'Dữ liệu Pokémon đang được nạp. Hãy thử lại sau ít phút.',
  NETWORK_ERROR: 'Không kết nối được máy chủ. Hãy kiểm tra backend đã chạy chưa.',
  INTERNAL_ERROR: 'Máy chủ gặp lỗi không mong muốn.',
}

const FALLBACK_MESSAGE = 'Đã có lỗi xảy ra.'

export function errorMessageFor(code: string | undefined): string {
  return (code && ERROR_MESSAGES[code]) || FALLBACK_MESSAGE
}
