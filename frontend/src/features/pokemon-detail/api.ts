import { ApiError, getJson } from '../../lib/http'
import type { EvolutionResponse, PokemonDetail } from '../../types/api'

const RESERVED_POKEMON_PATHS: ReadonlySet<string> = new Set([
  'search',
  'compare',
  'speed-tiers',
  'generations',
])

function pokemonPath(idOrName: string | number): string {
  const key = String(idOrName)
  if (RESERVED_POKEMON_PATHS.has(key.toLowerCase())) {
    throw new ApiError(404, 'POKEMON_NOT_FOUND')
  }
  return `/pokemon/${encodeURIComponent(key)}`
}

export async function fetchPokemonDetail(
  idOrName: string | number,
  signal?: AbortSignal,
): Promise<PokemonDetail> {
  return getJson<PokemonDetail>(pokemonPath(idOrName), undefined, signal)
}

export async function fetchEvolution(
  idOrName: string | number,
  signal?: AbortSignal,
): Promise<EvolutionResponse> {
  return getJson<EvolutionResponse>(`${pokemonPath(idOrName)}/evolution`, undefined, signal)
}
