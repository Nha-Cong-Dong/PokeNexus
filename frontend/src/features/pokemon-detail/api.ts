import { getJson } from '../../lib/http'
import type { EvolutionResponse, PokemonDetail } from '../../types/api'

export function fetchPokemonDetail(
  idOrName: string | number,
  signal?: AbortSignal,
): Promise<PokemonDetail> {
  return getJson<PokemonDetail>(
    `/pokemon/${encodeURIComponent(String(idOrName))}`,
    undefined,
    signal,
  )
}

export function fetchEvolution(
  idOrName: string | number,
  signal?: AbortSignal,
): Promise<EvolutionResponse> {
  return getJson<EvolutionResponse>(
    `/pokemon/${encodeURIComponent(String(idOrName))}/evolution`,
    undefined,
    signal,
  )
}
