import { Link } from 'react-router'

import { PokemonCard } from '../../../components/pokemon/PokemonCard'
import { formatNumber } from '../../../lib/formatters'
import { staggerDelay } from '../../../lib/motion'
import { typeLabel } from '../../../lib/pokemonTypes'
import type { PokemonSummary } from '../../../types/api'
import type { TypeTotal } from '../hooks'

export const SHOWCASE_SIZE = 12

type TerrainPokemonProps = {
  pool: readonly PokemonSummary[]
  totals: readonly TypeTotal[]
}

export function TerrainPokemon({ pool, totals }: TerrainPokemonProps) {
  return (
    <div className="flex flex-col gap-5">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {pool.slice(0, SHOWCASE_SIZE).map((pokemon, index) => (
          <li
            key={pokemon.id}
            className="flex animate-card-in [&>a]:flex-1"
            style={staggerDelay(index, 40)}
          >
            <PokemonCard pokemon={pokemon} />
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {totals.map(({ type, total }) => (
          <Link
            key={type}
            to={`/pokedex?type=${type}`}
            className="font-extrabold text-primary underline underline-offset-4"
          >
            Xem đủ <span className="tabular-nums">{formatNumber(total)}</span> Pokémon hệ{' '}
            {typeLabel(type)} trong Pokédex
          </Link>
        ))}
      </div>
    </div>
  )
}
