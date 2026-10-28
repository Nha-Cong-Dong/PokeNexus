import { Link } from 'react-router'

import { formatPokemonName } from '../../lib/formatters'
import { typeLabel, typeScopeClassName } from '../../lib/pokemonTypes'
import type { PokemonSummary } from '../../types/api'
import { DexNumber } from './DexNumber'
import { PokemonSprite } from './PokemonSprite'
import { TypeGlyph } from './TypeGlyph'

type PokemonCardProps = {
  pokemon: PokemonSummary
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const displayName = formatPokemonName(pokemon.name)
  const primaryType = pokemon.types[0] ?? 'normal'

  return (
    <Link
      to={`/pokemon/${pokemon.name}`}
      className={`group type-card relative flex min-h-30.5 flex-col overflow-hidden rounded-[18px] px-3 pt-3 pb-2.5 text-white transition-transform duration-200 ease-out hover:-translate-y-1 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink sm:min-h-33.5 sm:rounded-[20px] sm:px-4 sm:pt-3.5 sm:pb-3 ${typeScopeClassName(primaryType)}`}
    >
      <TypeGlyph
        type={primaryType}
        className="pointer-events-none absolute -top-6 -right-7 size-28 opacity-15 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-[28deg] sm:-top-7.5 sm:-right-9 sm:size-37.5"
      />
      <span className="relative flex items-baseline justify-between gap-2">
        <span className="min-w-0 text-[15px] leading-5 font-extrabold break-words sm:text-[17px] sm:leading-[22px]">
          {displayName}
        </span>
        <DexNumber id={pokemon.id} className="flex-none text-xs leading-none sm:text-sm" />
      </span>
      <span className="relative mt-2 flex flex-col items-start gap-1 sm:mt-2.5">
        {pokemon.types.map((type) => (
          <span
            key={type}
            className="inline-flex h-5.5 items-center rounded-full bg-scrim/25 px-2.5 text-xs font-extrabold"
          >
            {typeLabel(type)}
          </span>
        ))}
      </span>
      <span className="relative mt-auto flex items-baseline gap-1.5 pt-3 text-xs font-bold">
        BST <span className="tabular-nums text-num font-extrabold">{pokemon.baseStatTotal}</span>
      </span>
      <span className="absolute right-2 bottom-2 size-16 sm:right-2.5 sm:bottom-2.5 sm:size-20">
        <span
          aria-hidden="true"
          className="absolute inset-x-2.5 -bottom-1 h-2.5 rounded-[50%] bg-scrim/30"
        />
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 bottom-1 -rotate-6 rounded-[46%_54%_50%_50%/52%_46%_54%_48%] bg-white shadow-blob transition-transform duration-300 ease-out group-hover:-translate-y-2 group-hover:scale-110 group-hover:rotate-[5deg]"
        />
        <span className="absolute -inset-2 bottom-0 flex items-center justify-center group-hover:animate-hop">
          <PokemonSprite id={pokemon.id} alt={displayName} className="size-20 sm:size-24" />
        </span>
      </span>
    </Link>
  )
}
