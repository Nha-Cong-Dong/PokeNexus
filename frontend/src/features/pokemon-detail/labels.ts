import type { FormCategory, PokemonDetail, Stats } from '../../types/api'

export const STAT_ROWS: readonly { key: keyof Stats; label: string }[] = [
  { key: 'hp', label: 'HP' },
  { key: 'attack', label: 'Tấn công' },
  { key: 'defense', label: 'Phòng thủ' },
  { key: 'specialAttack', label: 'Tấn công đặc biệt' },
  { key: 'specialDefense', label: 'Phòng thủ đặc biệt' },
  { key: 'speed', label: 'Tốc độ' },
]

export const FORM_LABELS: Record<FormCategory, string> = {
  DEFAULT: 'Mặc định',
  REGIONAL: 'Vùng miền',
  MEGA: 'Mega',
  GMAX: 'Gigantamax',
  OTHER: 'Dạng khác',
}

export function rarityLabel(pokemon: Pick<PokemonDetail, 'isLegendary' | 'isMythical'>): string {
  if (pokemon.isMythical) return 'Thần thoại'
  if (pokemon.isLegendary) return 'Huyền thoại'
  return 'Thông thường'
}
