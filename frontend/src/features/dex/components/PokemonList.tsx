import { Link } from 'react-router'

import { DexNumber } from '../../../components/pokemon/DexNumber'
import { PokemonSprite } from '../../../components/pokemon/PokemonSprite'
import { TypeBadge } from '../../../components/pokemon/TypeBadge'
import { formatPokemonName } from '../../../lib/formatters'
import { typeScopeClassName } from '../../../lib/pokemonTypes'
import type { PokemonSummary } from '../../../types/api'

type PokemonListProps = {
  pokemon: PokemonSummary[]
}

export function PokemonList({ pokemon }: PokemonListProps) {
  return (
    <ul className="flex flex-col gap-1.5">
      {pokemon.map((item) => {
        const displayName = formatPokemonName(item.name)
        return (
          <li key={item.id}>
            <Link
              to={`/pokemon/${item.name}`}
              className={`type-tint flex min-h-13.5 flex-wrap items-center gap-x-3.5 gap-y-2 rounded-[14px] py-1.5 pr-4 pl-2 text-ink transition-[transform,box-shadow] duration-150 ease-out hover:translate-x-1 hover:shadow-block ${typeScopeClassName(item.types[0] ?? 'normal')}`}
            >
              <span className="relative flex size-10.5 flex-none items-center justify-center rounded-[46%_54%_50%_50%/52%_46%_54%_48%] bg-(--type-deep)">
                <PokemonSprite id={item.id} alt={displayName} className="absolute size-12" />
              </span>
              <DexNumber id={item.id} className="w-13 text-[15px] leading-4 text-ink-muted" />
              <span className="flex-[1_1_140px] font-extrabold">{displayName}</span>
              <span className="flex gap-1">
                {item.types.map((type) => (
                  <TypeBadge key={type} type={type} />
                ))}
              </span>
              <span className="flex min-w-19 items-baseline justify-end gap-1.5 text-xs font-bold text-ink-muted">
                BST{' '}
                <span className="text-[15px] font-extrabold text-ink">{item.baseStatTotal}</span>
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
