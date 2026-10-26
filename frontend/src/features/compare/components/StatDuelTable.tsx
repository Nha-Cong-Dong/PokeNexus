import { STAT_AXES } from '../../../components/pokemon/statAxes'
import { Panel } from '../../../components/ui/Panel'
import { formatPokemonName } from '../../../lib/formatters'
import type { PokemonDetail } from '../../../types/api'
import { percentOf, statScale, totalScale } from '../scale'

type StatDuelTableProps = {
  left: PokemonDetail
  right: PokemonDetail
}

type DuelRow = {
  key: string
  label: string
  left: number
  right: number
  scale: number
}

const DUEL_TITLE_ID = 'compare-duel-title'

function leadLabel(own: number, other: number): string {
  return own > other ? `+${own - other}` : ''
}

export function StatDuelTable({ left, right }: StatDuelTableProps) {
  const leftName = formatPokemonName(left.name)
  const rightName = formatPokemonName(right.name)
  const scale = statScale(left.stats, right.stats)
  const rows: DuelRow[] = [
    ...STAT_AXES.map((axis) => ({
      key: axis.key,
      label: axis.label,
      left: left.stats[axis.key],
      right: right.stats[axis.key],
      scale,
    })),
    {
      key: 'total',
      label: 'Tổng (BST)',
      left: left.baseStatTotal,
      right: right.baseStatTotal,
      scale: totalScale(left.baseStatTotal, right.baseStatTotal),
    },
  ]

  return (
    <Panel aria-labelledby={DUEL_TITLE_ID} className="min-w-0">
      <h2 id={DUEL_TITLE_ID} className="text-2xl font-extrabold">
        Từng chỉ số
      </h2>
      <p className="mt-1 mb-4 text-sm text-ink-muted">
        Số nhỏ cạnh chỉ số là phần chênh lệch của bên mạnh hơn.
      </p>
      <table className="w-full table-fixed border-collapse">
        <caption className="sr-only">
          Chỉ số của {leftName} và {rightName}, kèm phần chênh lệch
        </caption>
        <thead>
          <tr>
            <th
              scope="col"
              className="w-[40%] pb-2.5 text-left text-sm font-extrabold text-primary"
            >
              {leftName}
            </th>
            <th scope="col" className="w-[20%] pb-2.5">
              <span className="sr-only">Chỉ số</span>
            </th>
            <th
              scope="col"
              className="w-[40%] pb-2.5 text-right text-sm font-extrabold text-accent"
            >
              {rightName}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const leftLead = leadLabel(row.left, row.right)
            const rightLead = leadLabel(row.right, row.left)
            return (
              <tr
                key={row.key}
                className={
                  row.key === 'total' ? 'border-t-2 border-ink' : 'border-t border-surface-muted'
                }
              >
                <td className="py-2.5">
                  <span className="flex items-center gap-2">
                    <span className="flex min-w-14 items-baseline gap-1">
                      <span
                        className={`font-pixel text-lg ${row.left > row.right ? 'font-bold' : 'font-medium'}`}
                      >
                        {row.left}
                      </span>
                      <span className="text-xs font-extrabold text-primary">{leftLead}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="flex h-3 flex-1 justify-end overflow-hidden rounded-full bg-surface-muted"
                    >
                      <span
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${percentOf(row.left, row.scale)}%` }}
                      />
                    </span>
                  </span>
                </td>
                <th
                  scope="row"
                  className="px-2 py-2.5 text-center text-xs leading-4 font-extrabold text-ink-muted sm:text-sm"
                >
                  {row.label}
                </th>
                <td className="py-2.5">
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="flex h-3 flex-1 overflow-hidden rounded-full bg-surface-muted"
                    >
                      <span
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${percentOf(row.right, row.scale)}%` }}
                      />
                    </span>
                    <span className="flex min-w-14 items-baseline justify-end gap-1">
                      <span className="text-xs font-extrabold text-accent">{rightLead}</span>
                      <span
                        className={`font-pixel text-lg ${row.right > row.left ? 'font-bold' : 'font-medium'}`}
                      >
                        {row.right}
                      </span>
                    </span>
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Panel>
  )
}
