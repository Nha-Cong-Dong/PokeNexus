import { MultiplierCell } from '../../../components/pokemon/MultiplierCell'
import { TypeBadge } from '../../../components/pokemon/TypeBadge'
import { staggerDelay } from '../../../lib/motion'
import { typeClassName, typeLabel } from '../../../lib/pokemonTypes'
import type { TypeMatrix, TypeName } from '../../../types/api'
import { defendingEntries, defenseSummary, groupByMultiplier } from '../defense'
import { MAX_DEFENDING_TYPES } from '../useDefendingTypes'

const RESULT_BADGE =
  'inline-flex h-7 items-center rounded-full px-2.5 text-sm font-extrabold md:text-[13px]'

function pickHint(count: number): string {
  if (count === 0) return 'Chọn hệ ở bên trái'
  if (count < MAX_DEFENDING_TYPES) return 'Chọn thêm 1 hệ nếu Pokémon có hệ kép'
  return ''
}

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
      ? 'Chưa chọn hệ nào.'
      : defenseSummary(subject, entries)

  const hint = pickHint(defending.length)

  return (
    <div
      aria-busy={!matrix}
      className="flex min-w-0 flex-[1_1_26rem] flex-col gap-3 rounded-2xl bg-bg p-3.5 md:gap-3.5 md:px-5.5 md:pt-5 md:pb-5.5"
    >
      <p className="hidden flex-wrap items-center gap-2 lg:flex">
        {defending.map((type) => (
          <TypeBadge key={type} type={type} size="md" />
        ))}
        {hint && <span className="text-sm font-bold text-ink-muted">{hint}</span>}
      </p>
      <p aria-live="polite" className="max-w-prose font-bold max-md:text-lg">
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
              <ul className="flex flex-wrap gap-1.5 pt-0.5">
                {group.types.map((type) => (
                  <li key={type} className={`${RESULT_BADGE} ${typeClassName(type)}`}>
                    {typeLabel(type)}
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
