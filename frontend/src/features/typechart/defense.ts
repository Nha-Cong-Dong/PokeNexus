import { formatMultiplier } from '../../lib/formatters'
import { TYPE_NAMES, typeLabel } from '../../lib/pokemonTypes'
import { multiplierAgainst } from '../../lib/typeEffectiveness'
import type { TypeMatrix, TypeName } from '../../types/api'

export interface MultiplierEntry {
  type: TypeName
  multiplier: number
}

export interface MultiplierGroup {
  multiplier: number
  types: TypeName[]
}

export function matrixTypes(matrix: TypeMatrix): TypeName[] {
  return TYPE_NAMES.filter((type) => matrix.types.includes(type))
}

export function defendingEntries(
  matrix: TypeMatrix,
  defending: readonly TypeName[],
): MultiplierEntry[] {
  return matrixTypes(matrix).map((type) => ({
    type,
    multiplier: multiplierAgainst(matrix, type, defending),
  }))
}

export function groupByMultiplier(entries: readonly MultiplierEntry[]): MultiplierGroup[] {
  const groups = new Map<number, TypeName[]>()
  for (const { type, multiplier } of entries) {
    if (multiplier === 1) continue
    groups.set(multiplier, [...(groups.get(multiplier) ?? []), type])
  }
  return [...groups.entries()]
    .sort(([a], [b]) => b - a)
    .map(([multiplier, types]) => ({ multiplier, types }))
}

function typeNames(entries: readonly MultiplierEntry[]): string {
  return entries.map((entry) => typeLabel(entry.type)).join(', ')
}

export function defenseSummary(subject: string, entries: readonly MultiplierEntry[]): string {
  const weak = entries.filter((entry) => entry.multiplier > 1)
  const strongest = Math.max(0, ...weak.map((entry) => entry.multiplier))
  const worst = weak.filter((entry) => entry.multiplier === strongest)
  const resist = entries.filter((entry) => entry.multiplier > 0 && entry.multiplier < 1)
  const immune = entries.filter((entry) => entry.multiplier === 0)

  const weakSentence =
    weak.length === 0
      ? `${subject} không yếu trước hệ nào.`
      : worst.length === weak.length
        ? `${subject} yếu trước ${typeNames(worst)} ${formatMultiplier(strongest)}.`
        : `${subject} yếu trước ${weak.length} hệ, nặng nhất là ${typeNames(worst)} ${formatMultiplier(strongest)}.`

  const immuneText = immune.length > 0 ? `miễn nhiễm ${typeNames(immune)}` : ''
  const resistSentence =
    resist.length > 0
      ? `Kháng ${resist.length} hệ${immuneText ? ` và ${immuneText}` : ''}.`
      : immuneText
        ? `Không kháng hệ nào nhưng ${immuneText}.`
        : 'Không kháng hệ nào.'

  return `${weakSentence} ${resistSentence}`
}
