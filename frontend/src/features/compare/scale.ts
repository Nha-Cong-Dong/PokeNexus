import { STAT_AXES, STAT_MAX } from '../../components/pokemon/statAxes'
import type { Stats } from '../../types/api'

const MIN_STAT_SCALE = 150
const STAT_SCALE_STEP = 50
const MIN_TOTAL_SCALE = 720

export function statScale(...stats: Stats[]): number {
  const highest = Math.max(0, ...stats.flatMap((item) => STAT_AXES.map((axis) => item[axis.key])))
  const rounded = Math.ceil(highest / STAT_SCALE_STEP) * STAT_SCALE_STEP
  return Math.min(STAT_MAX, Math.max(MIN_STAT_SCALE, rounded))
}

export function totalScale(...totals: number[]): number {
  return Math.max(MIN_TOTAL_SCALE, ...totals)
}

export function percentOf(value: number, scale: number): number {
  if (scale <= 0) return 0
  return Math.min(100, Math.max(0, (value / scale) * 100))
}
