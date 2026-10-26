import { StatRadar } from '../../../components/pokemon/StatRadar'
import { STAT_AXES } from '../../../components/pokemon/statAxes'
import { TypeBadge } from '../../../components/pokemon/TypeBadge'
import { formatNumber } from '../../../lib/formatters'
import { TYPE_NAMES } from '../../../lib/pokemonTypes'
import type { AnalyzeResponse } from '../../../types/api'

type CoverageAndStatsProps = {
  analysis: AnalyzeResponse
}

const RADAR_MAX = 150

export function CoverageAndStats({ analysis }: CoverageAndStatsProps) {
  const { coveredTypeCount, uncoveredTypes } = analysis.offensiveCoverage

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-extrabold">Độ phủ tấn công</h3>
        <p className="flex items-baseline gap-1.5">
          <span className="font-pixel text-pixel-lg font-bold">{coveredTypeCount}</span>
          <span className="text-sm font-bold text-ink-muted">/ {TYPE_NAMES.length} hệ</span>
        </p>
        <p className="text-sm text-ink-muted">
          Số hệ phòng thủ mà đội đánh siêu hiệu quả bằng hệ của các thành viên.
        </p>
        {uncoveredTypes.length === 0 ? (
          <p className="text-sm font-bold">Đội đánh siêu hiệu quả đủ 18 hệ.</p>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-bold">Chưa phủ {uncoveredTypes.length} hệ:</p>
            <ul className="flex flex-wrap gap-1.5">
              {uncoveredTypes.map((type) => (
                <li key={type}>
                  <TypeBadge type={type} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-extrabold">Chỉ số trung bình</h3>
        <div className="mx-auto w-full max-w-90">
          <StatRadar
            title="Chỉ số gốc trung bình của đội"
            series={[{ label: 'Trung bình đội', stats: analysis.statRadar, tone: 'primary' }]}
            max={RADAR_MAX}
          />
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-3">
          {STAT_AXES.map((axis) => (
            <div key={axis.key} className="flex items-baseline justify-between gap-2">
              <dt className="text-ink-muted">{axis.label}</dt>
              <dd className="font-pixel text-pixel font-semibold">
                {formatNumber(analysis.statRadar[axis.key])}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
