import { Link } from 'react-router'

import { DexNumber } from '../../../components/pokemon/DexNumber'
import { PokemonSprite } from '../../../components/pokemon/PokemonSprite'
import { TypeBadge } from '../../../components/pokemon/TypeBadge'
import { formatPokemonName } from '../../../lib/formatters'
import { staggerDelay } from '../../../lib/motion'
import { typeScopeClassName } from '../../../lib/pokemonTypes'
import type { PokemonSummary } from '../../../types/api'

type PokemonListProps = {
  pokemon: PokemonSummary[]
}

export function PokemonList({ pokemon }: PokemonListProps) {
  return (
    <ul className="flex flex-col gap-1.5">
      {pokemon.map((item, index) => {
        const displayName = formatPokemonName(item.name)
        return (
          <li key={item.id} className="animate-slide-in-left" style={staggerDelay(index, 25)}>
            <Link
              to={`/pokemon/${item.name}`}
              className={`type-tint grid min-h-13.5 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-0.5 rounded-[14px] py-1.5 pr-4 pl-2 text-ink transition-[transform,box-shadow] duration-150 ease-out hover:translate-x-1 hover:shadow-block sm:flex sm:flex-wrap sm:gap-x-3.5 sm:gap-y-2 ${typeScopeClassName(item.types[0] ?? 'normal')}`}
            >
              <span className="relative row-span-2 flex size-10.5 flex-none items-center justify-center rounded-[46%_54%_50%_50%/52%_46%_54%_48%] bg-(--type-deep) sm:row-span-1">
                <PokemonSprite id={item.id} alt={displayName} className="absolute size-12" />
              </span>
              <span
                data-testid="dex-row-heading"
                className="col-start-2 row-start-1 flex min-w-0 items-baseline gap-2 sm:contents"
              >
                <DexNumber
                  id={item.id}
                  className="flex-none text-[15px] leading-4 text-ink-muted sm:w-13"
                />
                <span className="min-w-0 font-extrabold break-words sm:flex-[1_1_140px]">
                  {displayName}
                </span>
              </span>
              <span
                data-testid="dex-row-types"
                className="col-start-3 row-start-1 flex justify-end gap-1"
              >
                {item.types.map((type) => (
                  <TypeBadge key={type} type={type} />
                ))}
              </span>
              <span className="col-start-2 row-start-2 flex items-baseline gap-1.5 text-xs font-bold text-ink-muted sm:min-w-19 sm:justify-end">
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
