import { multiplierClassName } from '../../../components/pokemon/multiplierStyles'
import { Panel } from '../../../components/ui/Panel'
import { formatMultiplier } from '../../../lib/formatters'
import { TYPE_NAMES, typeClassName, typeLabel } from '../../../lib/pokemonTypes'
import type { DefenseEntry } from '../../../types/api'
import { defenseSummary, type MultiplierEntry } from '../../typechart/defense'

type DefenseGridProps = {
  name: string
  defense: DefenseEntry[]
}

const TITLE_ID = 'defense-title'
const GRID_TITLE_ID = 'defense-grid-title'

const GROUPS = [
  {
    title: 'Yếu',
    matches: (multiplier: number) => multiplier > 1,
    strongestFirst: (a: MultiplierEntry, b: MultiplierEntry) => b.multiplier - a.multiplier,
    className: 'bg-mult-2/25',
  },
  {
    title: 'Kháng',
    matches: (multiplier: number) => multiplier > 0 && multiplier < 1,
    strongestFirst: (a: MultiplierEntry, b: MultiplierEntry) => a.multiplier - b.multiplier,
    className: 'bg-mult-05/25',
  },
  {
    title: 'Miễn nhiễm',
    matches: (multiplier: number) => multiplier === 0,
    strongestFirst: () => 0,
    className: 'bg-bg',
  },
]

function toEntries(defense: readonly DefenseEntry[]): MultiplierEntry[] {
  return TYPE_NAMES.map((type) => ({
    type,
    multiplier: defense.find((entry) => entry.attackingType === type)?.multiplier ?? 1,
  }))
}

export function DefenseGrid({ name, defense }: DefenseGridProps) {
  const entries = toEntries(defense)
  const groups = GROUPS.map((group) => ({
    ...group,
    items: entries.filter((entry) => group.matches(entry.multiplier)).sort(group.strongestFirst),
  })).filter((group) => group.items.length > 0)

  return (
    <Panel aria-labelledby={TITLE_ID} className="min-w-0">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 id={TITLE_ID} className="text-2xl font-extrabold">
          Phòng thủ
        </h2>
        <p className="max-w-prose text-lg text-ink-muted">{defenseSummary(name, entries)}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-[repeat(auto-fit,minmax(15rem,1fr))]">
        {groups.map((group) => (
          <div key={group.title} className={`rounded-2xl px-4 pt-4 pb-4.5 ${group.className}`}>
            <h3 className="mb-3 flex items-center justify-between text-lg font-extrabold">
              {group.title}
              <span className="text-sm font-bold text-ink-muted">{group.items.length} hệ</span>
            </h3>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item.type}
                  className="flex h-10 overflow-hidden rounded-[10px] border-2 border-ink bg-surface text-sm font-extrabold"
                >
                  <span className={`flex items-center px-3 ${typeClassName(item.type)}`}>
                    {typeLabel(item.type)}
                  </span>
                  <span
                    className={`flex min-w-10 items-center justify-center px-1.5 ${multiplierClassName(item.multiplier)}`}
                  >
                    {formatMultiplier(item.multiplier)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h3 id={GRID_TITLE_ID} className="mt-6 mb-3 text-lg font-extrabold">
        Hệ số nhận từ 18 hệ
      </h3>
      <ul aria-labelledby={GRID_TITLE_ID} className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {entries.map((entry) => (
          <li
            key={entry.type}
            className="flex flex-col overflow-hidden rounded-[10px] border-2 border-border text-center font-extrabold"
          >
            <span className={`py-1 text-xs ${typeClassName(entry.type)}`}>
              {typeLabel(entry.type)}
            </span>
            <span className={`py-1.5 text-sm ${multiplierClassName(entry.multiplier)}`}>
              {formatMultiplier(entry.multiplier)}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  )
}
