import { Link } from 'react-router'

import { formatDexNumber, formatPokemonName } from '../../lib/formatters'
import type { PokemonSummary } from '../../types/api'
import { PokemonSprite } from './PokemonSprite'
import { TypeBadge } from './TypeBadge'

type PokemonCardProps = {
  pokemon: PokemonSummary
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const displayName = formatPokemonName(pokemon.name)
  return (
    <Link
      to={`/pokemon/${pokemon.name}`}
      className="flex flex-col items-center gap-1 rounded-lg border border-border bg-surface p-3 text-center hover:border-border-strong"
    >
      <PokemonSprite id={pokemon.id} alt={displayName} />
      <span className="text-xs text-text-muted">{formatDexNumber(pokemon.id)}</span>
      <span className="font-semibold">{displayName}</span>
      <span className="flex flex-wrap justify-center gap-1">
        {pokemon.types.map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </span>
      <span className="text-xs text-text-muted">
        BST {pokemon.baseStatTotal} · Tốc độ {pokemon.speed}
      </span>
    </Link>
  )
}
