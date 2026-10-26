import type { FormCategory, PokemonDetail } from '../../types/api'

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
