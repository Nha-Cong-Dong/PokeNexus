import { StatRadar } from '../../../components/pokemon/StatRadar'
import { Panel } from '../../../components/ui/Panel'
import { formatPokemonName } from '../../../lib/formatters'
import type { PokemonDetail } from '../../../types/api'
import { statScale } from '../scale'

type CompareRadarProps = {
  left: PokemonDetail
  right: PokemonDetail
  className?: string
}

const RADAR_TITLE_ID = 'compare-radar-title'

export function CompareRadar({ left, right, className = '' }: CompareRadarProps) {
  const leftName = formatPokemonName(left.name)
  const rightName = formatPokemonName(right.name)
  const scale = statScale(left.stats, right.stats)

  return (
    <Panel aria-labelledby={RADAR_TITLE_ID} className={`flex min-w-0 flex-col gap-3 ${className}`}>
      <div>
        <h2 id={RADAR_TITLE_ID} className="text-2xl font-extrabold">
          Hình dạng chỉ số
        </h2>
        <p className="mt-1 text-sm text-ink-muted">Thang đo tối đa {scale} cho mỗi chỉ số.</p>
      </div>
      <StatRadar
        title={`Biểu đồ radar 6 chỉ số của ${leftName} và ${rightName}`}
        max={scale}
        fill="light"
        legendAboveOnMobile
        series={[
          { label: leftName, stats: left.stats, tone: 'primary' },
          { label: rightName, stats: right.stats, tone: 'accent' },
        ]}
      />
    </Panel>
  )
}
