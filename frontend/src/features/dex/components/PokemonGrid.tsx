import { PokemonCard } from '../../../components/pokemon/PokemonCard'
import type { PokemonSummary } from '../../../types/api'

type PokemonGridProps = {
  pokemon: PokemonSummary[]
}

const GRID_CLASS = 'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
const SKELETON_COUNT = 12

export function PokemonGrid({ pokemon }: PokemonGridProps) {
  return (
    <ul className={GRID_CLASS}>
      {pokemon.map((item) => (
        <li key={item.id}>
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
        <li key={index} className="h-48 animate-pulse rounded-lg bg-surface-muted" />
      ))}
    </ul>
  )
}
