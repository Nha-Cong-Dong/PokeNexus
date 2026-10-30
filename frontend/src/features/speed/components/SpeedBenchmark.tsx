import { Link } from 'react-router'

import { formatPokemonName } from '../../../lib/formatters'
import type { SpeedTier } from '../../../types/api'
import { useSpeedTiers } from '../hooks'
import { level50Spread, nearestTiers, rankSpeed } from '../level50'
import { SpeedPercentBar } from './SpeedPercentBar'

const TITLE_ID = 'speed50-title'
const NEIGHBOUR_LIMIT = 3

type SpeedBenchmarkProps = {
  pokemonId: number
  base: number
}

export function SpeedBenchmark({ pokemonId, base }: SpeedBenchmarkProps) {
  const tiers = useSpeedTiers()
  const spread = level50Spread(base)
  const cells = [
    { label: 'Tối thiểu', value: spread.min },
    { label: 'Không đầu tư', value: spread.neutral },
    { label: 'Tối đa', value: spread.max },
  ]

  return (
    <section
      aria-labelledby={TITLE_ID}
      className="flex flex-col gap-3 rounded-2xl border-2 border-border p-4"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 id={TITLE_ID} className="text-lg font-extrabold">
          Tốc độ ở cấp 50
        </h3>
        <span className="text-sm font-bold text-ink-muted">Tốc độ gốc {base}</span>
      </div>
      <dl className="grid grid-cols-3 gap-2">
        {cells.map((cell) => (
          <div
            key={cell.label}
            className="flex flex-col justify-between rounded-xl bg-surface-muted px-1.5 py-2 text-center"
          >
            <dt className="text-xs font-bold text-ink-muted sm:text-sm">{cell.label}</dt>
            <dd className="tabular-nums text-xl font-extrabold">{cell.value}</dd>
          </div>
        ))}
      </dl>
      {tiers.data ? (
        <SpeedStanding tiers={tiers.data} pokemonId={pokemonId} base={base} />
      ) : tiers.isError ? (
        <p className="text-sm text-ink-muted">Chưa tải được bảng tốc độ để so sánh.</p>
      ) : (
        <div aria-hidden="true" className="h-16 animate-pulse rounded-xl bg-surface-muted" />
      )}
      <p className="text-xs text-ink-muted">
        Tối thiểu: IV 0, tính cách giảm Tốc độ. Không đầu tư: IV 31, 0 EV. Tối đa: IV 31, 252 EV,
        tính cách tăng Tốc độ.
      </p>
    </section>
  )
}

function SpeedStanding({
  tiers,
  pokemonId,
  base,
}: {
  tiers: readonly SpeedTier[]
  pokemonId: number
  base: number
}) {
  const rank = rankSpeed(tiers, base, pokemonId)
  const { faster, slower } = nearestTiers(tiers, base)

  return (
    <div className="flex flex-col gap-2">
      <p className="font-bold">{`Nhanh hơn ${rank.percentSlower}% Pokémon ở cùng mức đầu tư`}</p>
      <SpeedPercentBar percent={rank.percentSlower} />
      {rank.tied > 0 && (
        <p className="text-sm text-ink-muted">{`Bằng tốc độ gốc với ${rank.tied} Pokémon khác.`}</p>
      )}
      <ul className="flex flex-col gap-1 text-sm">
        {faster && <NeighbourTier label="Vừa thua" tier={faster} />}
        {slower && <NeighbourTier label="Vừa vượt" tier={slower} />}
      </ul>
    </div>
  )
}

function NeighbourTier({ label, tier }: { label: string; tier: SpeedTier }) {
  const shown = tier.pokemon.slice(0, NEIGHBOUR_LIMIT)
  const rest = tier.pokemon.length - shown.length

  return (
    <li>
      <span className="font-bold">
        {label} (gốc {tier.speed}):
      </span>{' '}
      {shown.map((pokemon, index) => (
        <span key={pokemon.id}>
          {index > 0 && ', '}
          <Link
            to={`/pokemon/${pokemon.name}`}
            className="font-bold text-primary underline-offset-2 hover:underline"
          >
            {formatPokemonName(pokemon.name)}
          </Link>
        </span>
      ))}
      {rest > 0 && ` và ${rest} Pokémon khác`}
    </li>
  )
}
