import type { Stats } from '../../types/api'

export type StatKey = keyof Stats

export interface StatAxis {
  key: StatKey
  label: string
  lines: readonly string[]
}

export const STAT_AXES: readonly StatAxis[] = [
  { key: 'hp', label: 'HP', lines: ['HP'] },
  { key: 'attack', label: 'Tấn công', lines: ['Tấn công'] },
  { key: 'defense', label: 'Phòng thủ', lines: ['Phòng thủ'] },
  { key: 'specialAttack', label: 'Tấn công đặc biệt', lines: ['Tấn công', 'đặc biệt'] },
  { key: 'specialDefense', label: 'Phòng thủ đặc biệt', lines: ['Phòng thủ', 'đặc biệt'] },
  { key: 'speed', label: 'Tốc độ', lines: ['Tốc độ'] },
]

export const STAT_MAX = 255

export function describeStats(stats: Stats): string {
  return STAT_AXES.map((axis) => `${axis.label} ${stats[axis.key]}`).join(', ')
}
