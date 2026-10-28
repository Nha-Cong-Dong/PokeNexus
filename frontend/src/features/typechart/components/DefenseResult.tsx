import { MultiplierCell } from '../../../components/pokemon/MultiplierCell'
import { TypeBadge } from '../../../components/pokemon/TypeBadge'
import { staggerDelay } from '../../../lib/motion'
import { typeLabel } from '../../../lib/pokemonTypes'
import type { TypeMatrix, TypeName } from '../../../types/api'
import { defendingEntries, defenseSummary, groupByMultiplier } from '../defense'
import { MAX_DEFENDING_TYPES } from '../useDefendingTypes'

type DefenseResultProps = {
  matrix: TypeMatrix | undefined
  defending: TypeName[]
}

export function DefenseResult({ matrix, defending }: DefenseResultProps) {
  const entries = matrix && defending.length > 0 ? defendingEntries(matrix, defending) : []
  const groups = groupByMultiplier(entries)
  const neutralCount = entries.filter((entry) => entry.multiplier === 1).length
  const subject = defending.map(typeLabel).join(' + ')

  const summary = !matrix
    ? 'Đang tải bảng tương khắc…'
    : defending.length === 0
      ? 'Chưa chọn hệ nào. Bấm một hệ để xem 18 hệ tấn công gây bao nhiêu sát thương lên nó.'
      : defenseSummary(subject, entries)

  return (
    <div
      aria-busy={!matrix}
      className="flex min-w-0 flex-[1_1_26rem] flex-col gap-3.5 rounded-2xl bg-bg p-4 md:px-5.5 md:py-5"
    >
      {defending.length > 0 && (
        <p className="flex flex-wrap items-center gap-2">
          {defending.map((type) => (
            <TypeBadge key={type} type={type} size="md" />
          ))}
          {defending.length < MAX_DEFENDING_TYPES && (
            <span className="text-sm font-bold text-ink-muted">
              Chọn thêm 1 hệ nếu Pokémon có hệ kép.
            </span>
          )}
        </p>
      )}
      <p aria-live="polite" className="max-w-prose font-bold">
        {summary}
      </p>
      {groups.length > 0 && (
        <ul
          key={defending.join('-')}
          aria-label="Hệ số nhận từ 18 hệ tấn công"
          className="flex flex-col gap-2.5"
        >
          {groups.map((group, index) => (
            <li
              key={group.multiplier}
              className="flex animate-slide-in-left items-start gap-3"
              style={staggerDelay(index, 60)}
            >
              <MultiplierCell multiplier={group.multiplier} className="h-8 w-11 flex-none" />
              <ul className="flex flex-wrap gap-1.5 pt-1">
                {group.types.map((type) => (
                  <li key={type}>
                    <TypeBadge type={type} />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
      {neutralCount > 0 && (
        <p className="text-ink-muted">Trung tính x1 với {neutralCount} hệ còn lại.</p>
      )}
    </div>
  )
}
