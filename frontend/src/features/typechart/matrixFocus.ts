import { singleMultiplier } from '../../lib/typeEffectiveness'
import type { TypeMatrix, TypeName } from '../../types/api'
import { matrixTypes } from './defense'

export type MatrixAxis = 'attack' | 'defense'

export interface MatrixFocus {
  axis: MatrixAxis
  type: TypeName
}

export interface FocusGroup {
  multiplier: number
  title: string
  types: TypeName[]
}

const FOCUS_MULTIPLIERS = [2, 0.5, 0] as const

const FOCUS_TITLES: Record<MatrixAxis, Record<(typeof FOCUS_MULTIPLIERS)[number], string>> = {
  attack: { 2: 'Gây x2 lên', 0.5: 'Bị giảm còn x½ khi đánh', 0: 'Không tác dụng lên' },
  defense: { 2: 'Yếu trước', 0.5: 'Kháng', 0: 'Miễn nhiễm' },
}

const AXIS_ROLES: Record<MatrixAxis, string> = {
  attack: 'tấn công',
  defense: 'phòng thủ',
}

export function axisRole(axis: MatrixAxis): string {
  return AXIS_ROLES[axis]
}

export function toggleFocus(current: MatrixFocus | null, next: MatrixFocus): MatrixFocus | null {
  return current?.axis === next.axis && current.type === next.type ? null : next
}

export function isFocused(focus: MatrixFocus | null, axis: MatrixAxis, type: TypeName): boolean {
  return focus?.axis === axis && focus.type === type
}

export function isCellLit(
  focus: MatrixFocus | null,
  attacking: TypeName,
  defending: TypeName,
): boolean {
  if (!focus) return true
  return focus.type === (focus.axis === 'attack' ? attacking : defending)
}

function bucketOf(multiplier: number): number | null {
  if (multiplier === 0) return 0
  if (multiplier > 1) return 2
  if (multiplier < 1) return 0.5
  return null
}

export function focusGroups(matrix: TypeMatrix, focus: MatrixFocus): FocusGroup[] {
  const others = matrixTypes(matrix)
  const multiplierWith = (other: TypeName) =>
    focus.axis === 'attack'
      ? singleMultiplier(matrix, focus.type, other)
      : singleMultiplier(matrix, other, focus.type)

  return FOCUS_MULTIPLIERS.map((multiplier) => ({
    multiplier,
    title: FOCUS_TITLES[focus.axis][multiplier],
    types: others.filter((other) => bucketOf(multiplierWith(other)) === multiplier),
  }))
}
