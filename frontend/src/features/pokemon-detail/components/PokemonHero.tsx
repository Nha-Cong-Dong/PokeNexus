import type { ReactNode } from 'react'
import { Link } from 'react-router'

import { DexNumber } from '../../../components/pokemon/DexNumber'
import { PokemonSprite } from '../../../components/pokemon/PokemonSprite'
import { TypeBadge } from '../../../components/pokemon/TypeBadge'
import { SceneBackdrop } from '../../../components/scene/SceneBackdrop'
import { SceneLabel } from '../../../components/scene/SceneLabel'
import { formatPokemonName } from '../../../lib/formatters'
import { sceneForTypes } from '../../../lib/scenes'
import type { PokemonDetail } from '../../../types/api'

type PokemonHeroProps = {
  detail: PokemonDetail
  children: ReactNode
}

const POKEMON_NAME_ID = 'pokemon-name'

export function PokemonHero({ detail, children }: PokemonHeroProps) {
  const scene = sceneForTypes(detail.types)
  const displayName = formatPokemonName(detail.name)

  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 h-70 overflow-hidden bg-scrim lg:h-105">
        <SceneBackdrop scene={scene} priority animated />
      </div>
      <div className="relative z-10 mx-auto grid max-w-7xl gap-6 px-3 md:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] xl:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] xl:px-8">
        <section aria-labelledby={POKEMON_NAME_ID} className="relative min-w-0 lg:h-105">
          <div className="relative h-70 lg:absolute lg:inset-0 lg:h-auto">
            <nav aria-label="Đường dẫn" className="absolute top-3 left-0 z-10 max-w-[60%] lg:top-5">
              <ol className="flex items-center gap-1.5 rounded-full bg-scrim/80 px-3 py-1.5 text-xs font-bold text-white">
                <li>
                  <Link
                    to="/pokedex"
                    className="rounded-sm underline-offset-2 hover:underline focus-visible:outline-white"
                  >
                    Pokédex
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="min-w-0 truncate">
                  {displayName}
                </li>
              </ol>
            </nav>
            <SceneLabel scene={scene} />
            <div className="absolute bottom-0 left-1/2 w-56 -translate-x-1/2 lg:bottom-8 lg:left-[66%] lg:w-72 xl:w-80">
              <span
                aria-hidden="true"
                className="absolute inset-x-6 bottom-1 h-6 rounded-[50%] bg-scrim/40"
              />
              <PokemonSprite
                id={detail.id}
                alt={displayName}
                variant="artwork"
                size={320}
                className="relative aspect-square w-full object-contain"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-col items-center gap-2 text-center lg:absolute lg:bottom-7 lg:left-0 lg:z-10 lg:mt-0 lg:max-w-[calc(100%-1rem)] lg:items-start lg:rounded-2xl lg:bg-scrim/85 lg:px-5 lg:pt-4 lg:pb-4.5 lg:text-left lg:text-white">
            <DexNumber
              id={detail.speciesId}
              className="text-lg leading-none text-ink-muted lg:text-dex-yellow"
            />
            <h1
              id={POKEMON_NAME_ID}
              className="font-display text-display font-normal break-words lg:text-[2.5rem]/[2.75rem]"
            >
              {displayName}
            </h1>
            <p className="flex flex-wrap justify-center gap-2 lg:justify-start">
              {detail.types.map((type) => (
                <TypeBadge key={type} type={type} size="md" />
              ))}
            </p>
          </div>
        </section>
        {children}
      </div>
    </div>
  )
}
