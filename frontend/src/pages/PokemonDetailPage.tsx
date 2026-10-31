import { useParams } from 'react-router'

import { DefenseGrid } from '../features/pokemon-detail/components/DefenseGrid'
import {
  DetailError,
  DetailSkeleton,
  PokemonNotFound,
} from '../features/pokemon-detail/components/DetailStates'
import { EvolutionChain } from '../features/pokemon-detail/components/EvolutionChain'
import { FormSwitcher } from '../features/pokemon-detail/components/FormSwitcher'
import { PokemonHero } from '../features/pokemon-detail/components/PokemonHero'
import { StatPanel } from '../features/pokemon-detail/components/StatPanel'
import { usePokemonDetail } from '../features/pokemon-detail/hooks'
import { formatPokemonName } from '../lib/formatters'
import { sceneForTypes, sceneTintStyle } from '../lib/scenes'
import { ApiError } from '../lib/http'
import type { PokemonDetail } from '../types/api'

const NOT_FOUND_CODES = new Set(['POKEMON_NOT_FOUND', 'INVALID_PARAMETER'])

function isNotFound(error: Error): boolean {
  return error instanceof ApiError && (error.status === 404 || NOT_FOUND_CODES.has(error.code))
}

export function PokemonDetailPage() {
  const { idOrName = '' } = useParams()
  const { data, error, isPending, refetch } = usePokemonDetail(idOrName)

  if (error) {
    if (isNotFound(error)) return <PokemonNotFound idOrName={idOrName} />
    return (
      <DetailError
        code={error instanceof ApiError ? error.code : undefined}
        onRetry={() => void refetch()}
      />
    )
  }
  if (isPending) return <DetailSkeleton />
  return <PokemonDetailView detail={data} />
}

function PokemonDetailView({ detail }: { detail: PokemonDetail }) {
  return (
    <div
      className="scene-tint [--hero-overlap:17.5rem] lg:[--hero-overlap:34rem]"
      style={sceneTintStyle(sceneForTypes(detail.types))}
    >
      <PokemonHero
        detail={detail}
        below={
          <>
            <EvolutionChain detail={detail} />
            {detail.forms.length > 1 && <FormSwitcher forms={detail.forms} currentId={detail.id} />}
          </>
        }
      >
        <StatPanel detail={detail} />
      </PokemonHero>
      <div className="mx-auto mt-6 max-w-7xl px-3 md:px-6 lg:mt-8 xl:px-8">
        <DefenseGrid name={formatPokemonName(detail.name)} defense={detail.defense} />
      </div>
    </div>
  )
}
