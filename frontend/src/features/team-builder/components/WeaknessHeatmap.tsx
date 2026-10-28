import type { UseQueryResult } from '@tanstack/react-query'
import { useId, useMemo, useState } from 'react'

import { MultiplierCell } from '../../../components/pokemon/MultiplierCell'
import { TypeBadge } from '../../../components/pokemon/TypeBadge'
import { ErrorState } from '../../../components/ui/ErrorState'
import { errorMessageFor } from '../../../lib/errorMessages'
import { formatMultiplier, formatPokemonName } from '../../../lib/formatters'
import { ApiError } from '../../../lib/http'
import { staggerDelay } from '../../../lib/motion'
import { typeLabel } from '../../../lib/pokemonTypes'
import type { AnalyzeResponse, PokemonRef, TypeMatrixRow } from '../../../types/api'
import { pressureLevel, sortRowsByPressure } from '../teamAnalysis'

type WeaknessHeatmapProps = {
  members: readonly PokemonRef[]
  rows: readonly TypeMatrixRow[]
}

const HEAD_CLASS =
  'bg-surface px-1.5 pt-2.5 pb-2 align-bottom text-xs font-extrabold text-ink-muted'

export function WeaknessHeatmap({ members, rows }: WeaknessHeatmapProps) {
  const [onlyPressure, setOnlyPressure] = useState(false)
  const toggleId = useId()
  const sorted = useMemo(() => sortRowsByPressure(rows), [rows])
  const pressured = sorted.filter((row) => row.pressure > 0 || row.criticalHole)
  const visible = onlyPressure ? pressured : sorted
  const names = members.map((member) => formatPokemonName(member.name))

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <p className="text-sm text-ink-muted">
          Hàng xếp theo mức hở, lỗ hổng nghiêm trọng đứng đầu.
        </p>
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
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full border-separate border-spacing-0 text-sm">
          <caption className="sr-only">
            Hệ số sát thương của từng hệ tấn công lên mỗi thành viên, số thành viên yếu, số thành
            viên kháng và mức hở của đội
          </caption>
          <thead>
            <tr>
              <th
                scope="col"
                className={`sticky left-0 z-10 min-w-32 pl-3 text-left ${HEAD_CLASS}`}
              >
                Hệ tấn công
              </th>
              {members.map((member, index) => (
                <th key={member.id} scope="col" className={HEAD_CLASS}>
                  <span className="mx-auto block rotate-180 text-left text-sm whitespace-nowrap text-ink [writing-mode:vertical-rl]">
                    {names[index]}
                  </span>
                </th>
              ))}
              <th scope="col" className={HEAD_CLASS}>
                Yếu
              </th>
              <th scope="col" className={HEAD_CLASS}>
                Kháng
              </th>
              <th scope="col" className={`pr-3 text-left ${HEAD_CLASS}`}>
                Mức hở
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={members.length + 4} className="px-3 py-4 text-ink-muted">
                  Không hệ tấn công nào đang gây áp lực cho đội.
                </td>
              </tr>
            ) : (
              visible.map((row, rowIndex) => {
                const level = pressureLevel(row.pressure)
                const attacker = typeLabel(row.attackingType)
                return (
                  <tr
                    key={row.attackingType}
                    data-critical={row.criticalHole || undefined}
                    className="animate-slide-in-left"
                    style={staggerDelay(rowIndex, 30)}
                  >
                    <th
                      scope="row"
                      className={`sticky left-0 z-10 border-t border-l-4 border-t-border bg-surface py-1 pr-2 pl-2 text-left font-normal ${row.criticalHole ? 'border-l-danger' : 'border-l-transparent'}`}
                    >
                      <span className="flex flex-wrap items-center gap-1.5">
                        <TypeBadge type={row.attackingType} />
                        {row.criticalHole && (
                          <span className="inline-flex min-h-6 items-center rounded-md bg-danger px-2 py-0.5 text-xs font-extrabold text-white [animation:var(--animate-pop-in),var(--animate-pulse-ring)]">
                            Lỗ hổng nghiêm trọng
                          </span>
                        )}
                      </span>
                    </th>
                    {row.multipliers.map((multiplier, index) => (
                      <td
                        key={members[index]?.id ?? index}
                        title={`${attacker} gây ${formatMultiplier(multiplier)} lên ${names[index] ?? ''}`}
                        className="border-t border-border px-0.5 py-1 text-center"
                      >
                        <MultiplierCell multiplier={multiplier} className="h-8" />
                      </td>
                    ))}
                    <td
                      className={`border-t border-border px-1.5 py-1 text-center ${row.weakCount > 0 ? 'font-extrabold' : 'text-ink-muted'}`}
                    >
                      {row.weakCount}
                    </td>
                    <td
                      className={`border-t border-border px-1.5 py-1 text-center ${row.resistCount > 0 ? 'font-extrabold' : 'text-ink-muted'}`}
                    >
                      {row.resistCount}
                    </td>
                    <td className="border-t border-border py-1 pr-3 pl-1.5">
                      <span
                        className={`inline-flex h-6 items-center rounded-full px-2.5 text-xs font-extrabold whitespace-nowrap ${level.className}`}
                      >
                        {level.label}
                        {row.pressure > 0 && ` (${row.pressure})`}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
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
}

export function AnalysisHeatmap({ analysis }: AnalysisHeatmapProps) {
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
      <WeaknessHeatmap members={analysis.data.members} rows={analysis.data.typeMatrix} />
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
