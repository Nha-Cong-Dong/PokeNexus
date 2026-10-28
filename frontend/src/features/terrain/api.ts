import { getJson } from '../../lib/http'
import type { PageResponse, PokemonSummary, TypeName } from '../../types/api'

export const TERRAIN_POOL_SIZE = 100

export function fetchTypePool(
  type: TypeName,
  signal?: AbortSignal,
): Promise<PageResponse<PokemonSummary>> {
  return getJson<PageResponse<PokemonSummary>>(
    '/pokemon',
    { type, size: TERRAIN_POOL_SIZE, sort: 'id,asc' },
    signal,
  )
}
