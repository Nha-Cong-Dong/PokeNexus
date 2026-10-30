import { STAT_AXES } from '../../../components/pokemon/statAxes'
import { Panel } from '../../../components/ui/Panel'
import { formatPokemonName } from '../../../lib/formatters'
import { staggerDelay } from '../../../lib/motion'
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

const LEFT_BAR = 'bg-primary'
const RIGHT_BAR =
  'bg-[repeating-linear-gradient(90deg,var(--color-accent)_0_10px,color-mix(in_oklab,var(--color-accent)_82%,var(--color-white))_10px_14px)]'

function leadLabel(own: number, other: number): string {
  return own > other ? `+${own - other}` : ''
}

function valueWeight(own: number, other: number): string {
  return own > other ? 'font-extrabold' : 'font-semibold'
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
      label: 'Tổng',
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
      <p className="mt-1 mb-3.5 text-base text-ink-muted md:hidden">
        Số nhỏ cạnh tên chỉ số là phần chênh lệch của bên mạnh hơn.
      </p>

      <dl className="flex flex-col gap-3 md:hidden">
        {rows.map((row, rowIndex) => (
          <div
            key={row.key}
            className={row.key === 'total' ? 'border-t-2 border-dashed border-border pt-3' : ''}
          >
            <dt className="grid grid-cols-[1fr_auto_1fr] items-baseline gap-2">
              <span aria-hidden="true" className="text-left text-sm font-extrabold text-primary">
                {leadLabel(row.left, row.right)}
              </span>
              <span className="text-[15px] leading-5 font-extrabold text-ink-muted">
                {row.label}
              </span>
              <span aria-hidden="true" className="text-right text-sm font-extrabold text-accent">
                {leadLabel(row.right, row.left)}
              </span>
            </dt>
            <dd className="mt-1 grid grid-cols-[40px_1fr_1fr_40px] items-center gap-1.5">
              <span className={`tabular-nums text-lg ${valueWeight(row.left, row.right)}`}>
                <span className="sr-only">{leftName} </span>
                {row.left}
              </span>
              <StatBarTrack
                percent={percentOf(row.left, row.scale)}
                tone={LEFT_BAR}
                towards="left"
                delayIndex={rowIndex}
                trackClassName="h-3.5 bg-surface-muted"
              />
              <StatBarTrack
                percent={percentOf(row.right, row.scale)}
                tone={RIGHT_BAR}
                towards="right"
                delayIndex={rowIndex}
                trackClassName="h-3.5 bg-surface-muted"
              />
              <span
                className={`text-right tabular-nums text-lg ${valueWeight(row.right, row.left)}`}
              >
                <span className="sr-only">{rightName} </span>
                {row.right}
              </span>
            </dd>
          </div>
        ))}
      </dl>

      <table className="mt-4 w-full table-fixed border-collapse max-md:hidden">
        <caption className="sr-only">
          Chỉ số của {leftName} và {rightName}, kèm phần chênh lệch
        </caption>
        <thead>
          <tr>
            <th
              scope="col"
              className="w-[42%] pb-2.5 text-left text-[13px] font-extrabold text-primary-hover"
            >
              {leftName}
            </th>
            <th scope="col" className="w-[16%] pb-2.5">
              <span className="sr-only">Chỉ số</span>
            </th>
            <th
              scope="col"
              className="w-[42%] pb-2.5 text-right text-[13px] font-extrabold text-[color-mix(in_oklab,var(--color-accent)_78%,var(--color-ink))]"
            >
              {rightName}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row.key} className="border-t border-surface-muted">
              <td className="py-2.25">
                <span className="flex items-center gap-2.5">
                  <span className="flex min-w-14 items-baseline gap-1">
                    <span
                      className={`tabular-nums text-[15px] ${valueWeight(row.left, row.right)}`}
                    >
                      {row.left}
                    </span>
                    <span className="text-xs font-extrabold text-primary">
                      {leadLabel(row.left, row.right)}
                    </span>
                  </span>
                  <StatBarTrack
                    percent={percentOf(row.left, row.scale)}
                    tone={LEFT_BAR}
                    towards="left"
                    delayIndex={rowIndex}
                    trackClassName="h-3 flex-1 bg-bg"
                  />
                </span>
              </td>
              <th
                scope="row"
                className="px-3 py-2.25 text-center text-[13px] leading-4 font-extrabold text-ink-muted"
              >
                {row.label}
              </th>
              <td className="py-2.25">
                <span className="flex items-center gap-2.5">
                  <StatBarTrack
                    percent={percentOf(row.right, row.scale)}
                    tone={RIGHT_BAR}
                    towards="right"
                    delayIndex={rowIndex}
                    trackClassName="h-3 flex-1 bg-bg"
                  />
                  <span className="flex min-w-14 items-baseline justify-end gap-1">
                    <span className="text-xs font-extrabold text-accent">
                      {leadLabel(row.right, row.left)}
                    </span>
                    <span
                      className={`tabular-nums text-[15px] ${valueWeight(row.right, row.left)}`}
                    >
                      {row.right}
                    </span>
                  </span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  )
}

type StatBarTrackProps = {
  percent: number
  tone: string
  towards: 'left' | 'right'
  delayIndex: number
  trackClassName: string
}

function StatBarTrack({ percent, tone, towards, delayIndex, trackClassName }: StatBarTrackProps) {
  return (
    <span
      aria-hidden="true"
      className={`flex overflow-hidden rounded-full ${towards === 'left' ? 'justify-end' : ''} ${trackClassName}`}
    >
      <span
        className={`h-full animate-grow-x rounded-full ${towards === 'left' ? 'origin-right' : 'origin-left'} ${tone}`}
        style={{ width: `${percent}%`, ...staggerDelay(delayIndex, 60, 300) }}
      />
    </span>
  )
}
