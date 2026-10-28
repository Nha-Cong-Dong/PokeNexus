import { PokemonCard } from '../../../components/pokemon/PokemonCard'
import { staggerDelay } from '../../../lib/motion'
import type { PokemonSummary } from '../../../types/api'

type PokemonGridProps = {
  pokemon: PokemonSummary[]
}

const GRID_CLASS =
  'grid grid-cols-2 gap-2.5 sm:grid-cols-[repeat(auto-fill,minmax(196px,1fr))] sm:gap-3.5'
const SKELETON_COUNT = 12

export function PokemonGrid({ pokemon }: PokemonGridProps) {
  return (
    <ul className={GRID_CLASS}>
      {pokemon.map((item, index) => (
        <li
          key={item.id}
          className="flex animate-card-in [&>a]:flex-1"
          style={staggerDelay(index, 30)}
        >
          <PokemonCard pokemon={item} />
        </li>
      ))}
    </ul>
  )
}

export function PokemonGridSkeleton() {
  return (
    <ul className={GRID_CLASS} aria-busy="true" aria-label="Đang tải Pokémon">
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <li
          key={index}
          className="h-30.5 animate-pulse rounded-[18px] bg-surface-muted sm:h-33.5 sm:rounded-[20px]"
        />
      ))}
    </ul>
  )
}
