import type { UseQueryResult } from '@tanstack/react-query'
import { useId, useMemo, useState } from 'react'

import { MultiplierCell } from '../../../components/pokemon/MultiplierCell'
import { multiplierClassName } from '../../../components/pokemon/multiplierStyles'
import { NeutralMark } from '../../../components/pokemon/NeutralMark'
import { TypeBadge } from '../../../components/pokemon/TypeBadge'
import { ErrorState } from '../../../components/ui/ErrorState'
import { errorMessageFor } from '../../../lib/errorMessages'
import { formatMultiplier, formatPokemonName } from '../../../lib/formatters'
import { ApiError } from '../../../lib/http'
import { staggerDelay } from '../../../lib/motion'
import { typeLabel, typeScopeClassName } from '../../../lib/pokemonTypes'
import type { AnalyzeResponse, PokemonRef, TypeMatrixRow, TypeName } from '../../../types/api'
import { pressureLevel, sortRowsByPressure } from '../teamAnalysis'

type WeaknessHeatmapProps = {
  members: readonly PokemonRef[]
  rows: readonly TypeMatrixRow[]
  compact?: boolean
}

type MemberHead = {
  id: number
  name: string
  type: TypeName
}

const HEAD_CLASS =
  'bg-surface px-1.5 pt-2.5 pb-2 align-bottom text-xs font-extrabold text-ink-muted'

const GRID_COLUMNS = [
  'grid-cols-1',
  'grid-cols-1',
  'grid-cols-2',
  'grid-cols-3',
  'grid-cols-4',
  'grid-cols-5',
  'grid-cols-6',
]

const LEGEND = [4, 2, 0.5, 0.25, 0, 1]

const NO_PRESSURE = 'Không hệ tấn công nào đang gây áp lực cho đội.'

const WARNING_ICON = (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="size-4 flex-none"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3l9.5 17h-19z M12 10v4.5 M12 17.2v.3" />
  </svg>
)

function isPressured(row: TypeMatrixRow): boolean {
  return row.pressure > 0 || row.criticalHole
}

function gridColumns(count: number): string {
  return GRID_COLUMNS[Math.min(Math.max(count, 1), GRID_COLUMNS.length - 1)] ?? 'grid-cols-6'
}

function typeDotClassName(type: TypeName): string {
  return `${typeScopeClassName(type)} bg-(--type-base)`
}

function listNames(items: readonly string[]): string {
  return items.length > 0 ? items.join(', ') : 'không ai'
}

function matchupNote(row: TypeMatrixRow, heads: readonly MemberHead[]): string {
  const weak: string[] = []
  const resist: string[] = []
  row.multipliers.forEach((multiplier, index) => {
    const label = `${heads[index]?.name ?? ''} ${formatMultiplier(multiplier)}`
    if (multiplier > 1) weak.push(label)
    else if (multiplier < 1) resist.push(label)
  })
  return `Yếu: ${listNames(weak)}. Kháng: ${listNames(resist)}.`
}

function HoleLabel({ className }: { className?: string }) {
  return (
    <span className={className}>
      Lỗ hổng <span className="sr-only">nghiêm trọng</span>
    </span>
  )
}

function TableCell({ multiplier }: { multiplier: number }) {
  if (multiplier === 1) {
    return (
      <span className="inline-flex h-8 min-w-10 items-center justify-center">
        <NeutralMark />
      </span>
    )
  }
  return <MultiplierCell multiplier={multiplier} className="h-8" />
}

type HeatmapTableProps = {
  heads: readonly MemberHead[]
  rows: readonly TypeMatrixRow[]
  compact: boolean
}

function HeatmapTable({ heads, rows, compact }: HeatmapTableProps) {
  const extraColumns = compact ? 2 : 4

  return (
    <div className="overflow-x-auto rounded-[14px] border border-border">
      <table className="w-full border-separate border-spacing-0 text-sm">
        <caption className="sr-only">
          {compact
            ? 'Hệ số sát thương của các hệ tấn công đang gây áp lực lên từng thành viên và mức hở của đội'
            : 'Hệ số sát thương của từng hệ tấn công lên mỗi thành viên, số thành viên yếu, số thành viên kháng và mức hở của đội'}
        </caption>
        <thead>
          <tr>
            <th scope="col" className={`sticky left-0 z-10 min-w-32 pl-3 text-left ${HEAD_CLASS}`}>
              Hệ tấn công
            </th>
            {heads.map((head) => (
              <th key={head.id} scope="col" className={`${HEAD_CLASS} px-0.5`}>
                <span className="flex flex-col items-center gap-1.5">
                  <span className="rotate-180 text-left text-[0.8125rem] leading-4 whitespace-nowrap text-ink [writing-mode:vertical-rl]">
                    {head.name}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`size-2.5 rounded-full shadow-[0_0_0_2px_var(--color-surface),0_0_0_3px_var(--color-ink)] ${typeDotClassName(head.type)}`}
                  />
                </span>
              </th>
            ))}
            {!compact && (
              <>
                <th scope="col" className={HEAD_CLASS}>
                  Yếu
                </th>
                <th scope="col" className={HEAD_CLASS}>
                  Kháng
                </th>
              </>
            )}
            <th scope="col" className={`pr-3 text-left ${HEAD_CLASS}`}>
              Mức hở
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={heads.length + extraColumns} className="px-3 py-4 text-ink-muted">
                {NO_PRESSURE}
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => {
              const level = pressureLevel(row.pressure)
              const attacker = typeLabel(row.attackingType)
              return (
                <tr
                  key={row.attackingType}
                  data-critical={row.criticalHole || undefined}
                  className="group animate-slide-in-left"
                  style={staggerDelay(rowIndex, 30)}
                >
                  <th
                    scope="row"
                    className={`sticky left-0 z-10 border-l-4 bg-surface py-0.5 pr-2 pl-2 text-left font-normal group-hover:bg-bg ${row.criticalHole ? 'border-l-danger' : 'border-l-transparent'}`}
                  >
                    <span className="flex items-center gap-1.5">
                      <TypeBadge type={row.attackingType} />
                      {row.criticalHole && (
                        <HoleLabel className="inline-flex h-5.5 items-center rounded-md bg-danger px-2 text-[0.6875rem] font-extrabold whitespace-nowrap text-white [animation:var(--animate-pop-in),var(--animate-pulse-ring)]" />
                      )}
                    </span>
                  </th>
                  {row.multipliers.map((multiplier, index) => (
                    <td
                      key={heads[index]?.id ?? index}
                      title={`${attacker} gây ${formatMultiplier(multiplier)} lên ${heads[index]?.name ?? ''}`}
                      className="px-0.5 py-0.5 text-center group-hover:bg-bg"
                    >
                      <TableCell multiplier={multiplier} />
                    </td>
                  ))}
                  {!compact && (
                    <>
                      <td
                        className={`px-1.5 py-0.5 text-center group-hover:bg-bg ${row.weakCount > 0 ? 'font-extrabold' : 'text-ink-muted'}`}
                      >
                        {row.weakCount}
                      </td>
                      <td className="px-1.5 py-0.5 text-center font-semibold text-ink-muted group-hover:bg-bg">
                        {row.resistCount}
                      </td>
                    </>
                  )}
                  <td className="py-0.5 pr-3 pl-1.5 group-hover:bg-bg">
                    <span
                      title={`Mức hở ${row.pressure}`}
                      className={`inline-flex h-6.5 items-center rounded-full px-2.5 text-xs font-extrabold whitespace-nowrap ${level.className}`}
                    >
                      {level.label}
                    </span>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

type HeatmapCardsProps = {
  heads: readonly MemberHead[]
  rows: readonly TypeMatrixRow[]
}

function HeatmapCards({ heads, rows }: HeatmapCardsProps) {
  const columns = gridColumns(heads.length)

  if (rows.length === 0) {
    return <p className="rounded-2xl border-2 border-border p-4 text-ink-muted">{NO_PRESSURE}</p>
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div
        aria-hidden="true"
        className={`grid gap-1 border-b-2 border-surface-muted px-3.5 pb-1.5 ${columns}`}
      >
        {heads.map((head) => (
          <span key={head.id} className="flex min-w-0 flex-col items-center gap-0.5">
            <span
              className={`size-2.5 rounded-full shadow-[0_0_0_1.5px_var(--color-ink)] ${typeDotClassName(head.type)}`}
            />
            <span className="max-w-full truncate text-xs font-extrabold tracking-tight">
              {head.name}
            </span>
          </span>
        ))}
      </div>
      <ul aria-label="Áp lực theo hệ tấn công" className="flex flex-col gap-2.5">
        {rows.map((row, rowIndex) => {
          const level = pressureLevel(row.pressure)
          const attacker = typeLabel(row.attackingType)
          return (
            <li
              key={row.attackingType}
              data-critical={row.criticalHole || undefined}
              className={`animate-slide-in-left rounded-2xl border-2 border-border bg-surface py-3 pr-3 pl-2.5 ${row.criticalHole ? 'border-l-[5px] border-l-danger' : ''}`}
              style={staggerDelay(rowIndex, 40)}
            >
              <div className="mb-2 flex items-center gap-2">
                <TypeBadge type={row.attackingType} size="md" />
                {row.criticalHole && (
                  <span className="inline-flex items-center gap-1 text-sm font-extrabold text-danger">
                    {WARNING_ICON}
                    <HoleLabel />
                  </span>
                )}
                <span
                  className={`ml-auto rounded-lg px-2.5 py-0.5 text-sm font-extrabold ${level.className}`}
                >
                  {level.label}
                </span>
              </div>
              <ul
                aria-label={`Hệ ${attacker} đánh vào từng thành viên`}
                className={`grid gap-1 ${columns}`}
              >
                {row.multipliers.map((multiplier, index) => (
                  <li
                    key={heads[index]?.id ?? index}
                    className={`flex h-8.5 items-center justify-center rounded-lg text-[0.9375rem] ${multiplier === 0 || multiplier === 4 ? 'font-extrabold' : 'font-bold'} ${multiplierClassName(multiplier)}`}
                  >
                    <span className="sr-only">{heads[index]?.name} nhận </span>
                    {multiplier === 1 ? <NeutralMark /> : formatMultiplier(multiplier)}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[0.9375rem] leading-[1.375rem] text-ink-muted">
                {matchupNote(row, heads)}
              </p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function MultiplierLegend() {
  return (
    <p className="flex flex-wrap gap-x-3 gap-y-1.5 text-sm font-bold text-ink-muted">
      {LEGEND.map((multiplier) => (
        <span key={multiplier} className="inline-flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className={`flex h-4 w-5.5 items-center justify-center rounded ${multiplierClassName(multiplier)}`}
          >
            {multiplier === 1 && <span className="size-1 rounded-full bg-border-strong" />}
          </span>
          {formatMultiplier(multiplier)}
        </span>
      ))}
    </p>
  )
}

export function WeaknessHeatmap({ members, rows, compact = false }: WeaknessHeatmapProps) {
  const [onlyPressure, setOnlyPressure] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const toggleId = useId()
  const sorted = useMemo(() => sortRowsByPressure(rows), [rows])
  const pressured = sorted.filter(isPressured)
  const heads = members.map((member) => ({
    id: member.id,
    name: formatPokemonName(member.name),
    type: member.types[0] ?? 'normal',
  }))
  const tableRows = compact || onlyPressure ? pressured : sorted
  const cardRows = !compact && showAll ? sorted : pressured
  const compactIntro = `Chỉ hiện ${pressured.length} hệ có mức hở. Mở trong Team Builder để xem đủ 18 hệ.`
  const cardsIntro = compact
    ? `${compactIntro} Ô trống là x1.`
    : showAll
      ? 'Đủ 18 hệ, xếp từ áp lực cao xuống thấp. Mỗi ô là một thành viên, ô trống là x1.'
      : `${pressured.length} hệ đang gây áp lực lên đội. Mỗi ô là một thành viên, ô trống là x1.`

  return (
    <div className="flex flex-col gap-3">
      <div className="hidden flex-col gap-3 md:flex">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <p className="text-sm text-ink-muted">
            {compact
              ? `${compactIntro} Ô trống là x1.`
              : 'Hàng xếp theo mức hở, lỗ hổng nghiêm trọng đứng đầu. Ô trống là x1.'}
          </p>
          {!compact && (
            <label
              htmlFor={toggleId}
              className="inline-flex min-h-10 cursor-pointer items-center gap-2 text-sm font-bold"
            >
              <input
                id={toggleId}
                type="checkbox"
                checked={onlyPressure}
                onChange={(event) => setOnlyPressure(event.target.checked)}
                className="size-5 accent-primary"
              />
              Chỉ hiện {pressured.length} hệ đang gây áp lực
            </label>
          )}
        </div>
        <HeatmapTable heads={heads} rows={tableRows} compact={compact} />
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        <p className="text-ink-muted">{cardsIntro}</p>
        <HeatmapCards heads={heads} rows={cardRows} />
        {!compact && sorted.length > pressured.length && (
          <button
            type="button"
            onClick={() => setShowAll((value) => !value)}
            className="min-h-12 w-full cursor-pointer rounded-xl border-2 border-border-strong bg-surface font-extrabold hover:bg-surface-muted"
          >
            {showAll ? 'Chỉ xem hệ gây áp lực' : `Xem đủ ${sorted.length} hệ`}
          </button>
        )}
        <MultiplierLegend />
      </div>

      <p className="text-sm text-ink-muted">
        Lỗ hổng nghiêm trọng: tổng mức yếu từ 2 trở lên (x2 tính 1, x4 tính 2) và không thành viên
        nào kháng hoặc miễn nhiễm. Mức hở bằng tổng mức yếu trừ số thành viên kháng.
      </p>
    </div>
  )
}

type AnalysisHeatmapProps = {
  analysis: UseQueryResult<AnalyzeResponse>
  compact?: boolean
}

export function AnalysisHeatmap({ analysis, compact = false }: AnalysisHeatmapProps) {
  if (analysis.isError) {
    const code = analysis.error instanceof ApiError ? analysis.error.code : undefined
    return <ErrorState message={errorMessageFor(code)} onRetry={() => void analysis.refetch()} />
  }
  if (!analysis.data) return <WeaknessHeatmapSkeleton />
  return (
    <div
      aria-busy={analysis.isPlaceholderData}
      className={`transition-opacity duration-150 ${analysis.isPlaceholderData ? 'opacity-60' : ''}`}
    >
      <WeaknessHeatmap
        members={analysis.data.members}
        rows={analysis.data.typeMatrix}
        compact={compact}
      />
    </div>
  )
}

export function WeaknessHeatmapSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-2">
      <span className="sr-only">Đang phân tích đội…</span>
      {Array.from({ length: 8 }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="h-9 animate-pulse rounded-lg bg-surface-muted"
        />
      ))}
    </div>
  )
}
