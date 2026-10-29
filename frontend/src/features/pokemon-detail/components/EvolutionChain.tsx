import { Link } from 'react-router'

import { DexNumber } from '../../../components/pokemon/DexNumber'
import { PokemonSprite } from '../../../components/pokemon/PokemonSprite'
import { Panel } from '../../../components/ui/Panel'
import { formatPokemonName } from '../../../lib/formatters'
import { staggerDelay } from '../../../lib/motion'
import { typeScopeClassName } from '../../../lib/pokemonTypes'
import type { PokemonDetail } from '../../../types/api'
import { evolutionLevels, evolutionStepLabel } from '../evolution'
import { useEvolution } from '../hooks'

type EvolutionChainProps = {
  detail: PokemonDetail
}

const TITLE_ID = 'evolution-title'

export function EvolutionChain({ detail }: EvolutionChainProps) {
  const { data } = useEvolution(detail.id)
  if (!data) return null

  const levels = evolutionLevels(data.stages)

  return (
    <Panel aria-labelledby={TITLE_ID} className="min-w-0 flex-[1_1_32rem]">
      <h2 id={TITLE_ID} className="mb-4 text-2xl font-extrabold">
        Tiến hóa
      </h2>
      {data.stages.length <= 1 ? (
        <p className="text-ink-muted">{formatPokemonName(detail.name)} không tiến hóa.</p>
      ) : (
        <ol className="flex flex-col items-start gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
          {levels.map((level, index) => (
            <li
              key={level[0]?.speciesId ?? index}
              className="flex animate-slide-in-right flex-col items-start gap-2.5 sm:flex-row sm:items-center"
              style={staggerDelay(index, 120, 200)}
            >
              {index > 0 && (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-5 size-5 flex-none rotate-90 text-ink-muted sm:ml-0 sm:rotate-0"
                >
                  <path d="M5 12h13M13 6l6 6-6 6" />
                </svg>
              )}
              <ul
                className={
                  level.length > 2
                    ? 'grid gap-2 sm:grid-cols-2 xl:grid-cols-3'
                    : 'flex flex-col gap-2'
                }
              >
                {level.map((stage) => {
                  const displayName = formatPokemonName(stage.name)
                  const step = evolutionStepLabel(stage)
                  const isCurrentSpecies = stage.speciesId === detail.speciesId
                  return (
                    <li key={stage.speciesId}>
                      <Link
                        to={`/pokemon/${stage.pokemonId}`}
                        aria-current={stage.pokemonId === detail.id ? 'page' : undefined}
                        className={`flex items-center gap-2.5 rounded-2xl border-2 bg-surface py-1.5 pr-3.5 pl-1.5 text-ink transition-colors duration-150 ease-out ${isCurrentSpecies ? 'border-ink shadow-block' : 'border-border hover:border-border-strong'} ${typeScopeClassName(stage.types[0] ?? 'normal')}`}
                      >
                        <span className="type-tint flex size-12 flex-none items-center justify-center rounded-full">
                          <PokemonSprite id={stage.pokemonId} alt={displayName} size={48} />
                        </span>
                        <span className="flex flex-col">
                          <DexNumber id={stage.speciesId} className="text-sm text-ink-muted" />
                          <span className="font-extrabold">{displayName}</span>
                          {step && <span className="text-xs font-bold text-ink-muted">{step}</span>}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  )
}
