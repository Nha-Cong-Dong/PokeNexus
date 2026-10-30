import { typeLabel } from '../../lib/pokemonTypes'
import type { AnalyzeResponse, TeamMemberRequest, TypeMatrixRow } from '../../types/api'
import { TEAM_NAME_MAX_LENGTH } from './api'

export interface PressureLevel {
  label: string
  className: string
}

const PRESSURE_LEVELS = {
  safe: { label: 'An toàn', className: 'bg-pressure-safe text-ink' },
  low: { label: 'Thấp', className: 'bg-pressure-low text-ink' },
  mid: { label: 'Trung bình', className: 'bg-pressure-mid text-ink' },
  high: { label: 'Cao', className: 'bg-pressure-high text-white' },
} satisfies Record<string, PressureLevel>

export function pressureLevel(pressure: number): PressureLevel {
  if (pressure <= 0) return PRESSURE_LEVELS.safe
  if (pressure <= 2) return PRESSURE_LEVELS.low
  if (pressure <= 4) return PRESSURE_LEVELS.mid
  return PRESSURE_LEVELS.high
}

export function sortRowsByPressure(rows: readonly TypeMatrixRow[]): TypeMatrixRow[] {
  return rows
    .map((row, index) => ({ row, index }))
    .sort(
      (a, b) =>
        Number(b.row.criticalHole) - Number(a.row.criticalHole) ||
        b.row.pressure - a.row.pressure ||
        b.row.weakCount - a.row.weakCount ||
        a.index - b.index,
    )
    .map(({ row }) => row)
}

export function formatScore(score: number): string {
  return String(Math.round(score))
}

export function scoreBarClassName(score: number): string {
  if (score >= 50) return 'bg-stat-good'
  if (score >= 20) return 'bg-stat-mid'
  return 'bg-danger'
}

export function analysisSummary(analysis: Pick<AnalyzeResponse, 'teamScore' | 'typeMatrix'>) {
  const holes = analysis.typeMatrix.filter((row) => row.criticalHole)
  const score = `Điểm đội ${formatScore(analysis.teamScore)}`
  if (holes.length === 0) return `${score}, không có lỗ hổng nghiêm trọng.`
  const names = holes.map((row) => typeLabel(row.attackingType)).join(', ')
  return `${score}, có ${holes.length} lỗ hổng nghiêm trọng: ${names}.`
}

export function buildTeamMembers(
  ids: readonly number[],
  sixthId: number | null,
): TeamMemberRequest[] {
  const all = sixthId !== null && !ids.includes(sixthId) ? [...ids, sixthId] : [...ids]
  return all.map((pokemonId, index) => ({ slot: index + 1, pokemonId, nickname: null }))
}

export function teamNameError(name: string): string | null {
  const length = name.trim().length
  if (length === 0) return 'Hãy đặt tên cho đội.'
  if (length > TEAM_NAME_MAX_LENGTH) return `Tên đội tối đa ${TEAM_NAME_MAX_LENGTH} ký tự.`
  return null
}

const dateFormat = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

export function formatSavedDate(iso: string): string | null {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? null : dateFormat.format(date)
}
