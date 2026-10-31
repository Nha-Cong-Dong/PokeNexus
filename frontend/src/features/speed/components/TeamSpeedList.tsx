import { PokemonSprite } from '../../../components/pokemon/PokemonSprite'
import { formatPokemonName } from '../../../lib/formatters'
import type { PokemonDetail, SpeedTier } from '../../../types/api'
import { usePokemonDetails } from '../../pokemon-detail/hooks'
import { useSpeedTiers } from '../hooks'
import { level50Spread, rankSpeed } from '../level50'
import { SpeedPercentBar } from './SpeedPercentBar'

const LIST_LABEL = 'Thứ tự tốc độ của đội'

type TeamSpeedListProps = {
  ids: readonly number[]
}

export function TeamSpeedList({ ids }: TeamSpeedListProps) {
  const details = usePokemonDetails(ids)
  const tiers = useSpeedTiers()

  if (details.some((query) => query.isError)) {
    return <p className="text-ink-muted">Chưa tải được chỉ số tốc độ của đội.</p>
  }

  const loaded = details.flatMap((query) => (query.data ? [query.data] : []))
  if (loaded.length < ids.length) {
    return (
      <div
        key="speed-loading"
        aria-hidden="true"
        className="h-40 animate-pulse rounded-xl bg-surface-muted"
      />
    )
  }

  const ordered = [...loaded].sort((a, b) => b.stats.speed - a.stats.speed)

  return (
    <div key="speed-list" className="flex flex-col gap-3">
      <ol aria-label={LIST_LABEL} className="flex flex-col gap-2.5">
        {ordered.map((detail) => (
          <SpeedRow key={detail.id} detail={detail} tiers={tiers.data} ranking={tiers.isPending} />
        ))}
      </ol>
      {tiers.isError && (
        <p className="text-sm text-ink-muted">Chưa tải được bảng tốc độ để so sánh.</p>
      )}
      <p className="text-xs text-ink-muted">
        Xếp từ nhanh đến chậm theo tốc độ gốc. Tối thiểu: IV 0, tính cách giảm Tốc độ. Không đầu tư:
        IV 31, 0 EV. Tối đa: IV 31, 252 EV, tính cách tăng Tốc độ. Tỷ lệ so với 1.083 dạng thường và
        dạng vùng ở cùng mức đầu tư.
      </p>
    </div>
  )
}

type SpeedRowProps = {
  detail: PokemonDetail
  tiers?: readonly SpeedTier[]
  ranking: boolean
}

function SpeedRow({ detail, tiers, ranking }: SpeedRowProps) {
  const base = detail.stats.speed
  const spread = level50Spread(base)
  const rank = tiers ? rankSpeed(tiers, base, detail.id) : null
  const name = formatPokemonName(detail.name)
  const cells = [
    { label: 'Tối thiểu', value: spread.min },
    { label: 'Không đầu tư', value: spread.neutral },
    { label: 'Tối đa', value: spread.max },
  ]

  return (
    <li className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2 rounded-2xl border-2 border-border px-3 py-2.5 sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,18rem)]">
      <PokemonSprite id={detail.id} alt="" size={48} className="size-12 flex-none" />
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-2">
          <h3 className="truncate font-extrabold">{name}</h3>
          <span className="text-sm font-bold text-ink-muted">Gốc {base}</span>
        </div>
        {rank ? (
          <>
            <p className="text-sm font-bold">{`Nhanh hơn ${rank.percentSlower}% Pokémon`}</p>
            <SpeedPercentBar percent={rank.percentSlower} />
          </>
        ) : (
          ranking && (
            <span aria-hidden="true" className="flex flex-col gap-1">
              <span className="h-5 w-36 animate-pulse rounded-md bg-surface-muted" />
              <span className="h-2.5 animate-pulse rounded-full bg-surface-muted" />
            </span>
          )
        )}
      </div>
      <dl className="col-span-2 grid grid-cols-3 gap-1.5 sm:col-span-1">
        {cells.map((cell) => (
          <div
            key={cell.label}
            className="flex flex-col justify-between rounded-xl bg-surface-muted px-1.5 py-1.5 text-center"
          >
            <dt className="text-xs font-bold text-ink-muted sm:whitespace-nowrap">{cell.label}</dt>
            <dd className="tabular-nums text-lg font-extrabold">{cell.value}</dd>
          </div>
        ))}
      </dl>
    </li>
  )
}
