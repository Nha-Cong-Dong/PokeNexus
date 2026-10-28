import { Link } from 'react-router'

import { StatBar } from '../../../components/pokemon/StatBar'
import { buttonClassName } from '../../../components/ui/buttonStyles'
import { Panel } from '../../../components/ui/Panel'
import { formatHeight, formatWeight } from '../../../lib/formatters'
import type { PokemonDetail } from '../../../types/api'
import { STAT_AXES } from '../../../components/pokemon/statAxes'
import { FORM_LABELS, rarityLabel } from '../labels'

type StatPanelProps = {
  detail: PokemonDetail
}

const TITLE_ID = 'stats-title'

export function StatPanel({ detail }: StatPanelProps) {
  const facts = [
    { label: 'Chiều cao', value: formatHeight(detail.heightDm) },
    { label: 'Cân nặng', value: formatWeight(detail.weightHg) },
    { label: 'Thế hệ', value: String(detail.generation) },
    { label: 'Phân loại', value: rarityLabel(detail) },
    ...(detail.formCategory === 'DEFAULT'
      ? []
      : [{ label: 'Dạng', value: FORM_LABELS[detail.formCategory] }]),
  ]

  return (
    <Panel
      aria-labelledby={TITLE_ID}
      className="flex min-w-0 flex-col gap-5 lg:mt-10 lg:self-start"
    >
      <div className="flex items-end justify-between gap-3">
        <h2 id={TITLE_ID} className="text-2xl font-extrabold">
          Chỉ số cơ bản
        </h2>
        <p className="flex items-baseline gap-2.5">
          <span className="text-sm font-bold text-ink-muted">Tổng</span>
          <span className="tabular-nums text-num-lg font-extrabold">{detail.baseStatTotal}</span>
        </p>
      </div>

      <dl className="flex flex-col gap-3">
        {STAT_AXES.map((row) => (
          <StatBar key={row.key} label={row.label} value={detail.stats[row.key]} />
        ))}
      </dl>

      <dl className="grid grid-cols-2 gap-x-5 gap-y-3.5 border-t-2 border-surface-muted pt-4.5">
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt className="text-sm font-bold text-ink-muted">{fact.label}</dt>
            <dd className="mt-0.5 text-lg font-extrabold">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap gap-2.5">
        <Link
          to={`/compare?left=${detail.id}`}
          className={`flex-1 ${buttonClassName('secondary')}`}
        >
          So sánh
        </Link>
        <Link
          to={`/team-builder?add=${detail.id}`}
          className={`flex-[1.3] ${buttonClassName('primary')}`}
        >
          Thêm vào đội
        </Link>
      </div>
    </Panel>
  )
}
