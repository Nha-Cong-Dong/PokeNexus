import { getJson } from '../../lib/http'
import type { PageResponse, PokemonSummary } from '../../types/api'
import type { DexFilter } from './useDexSearchParams'

export const DEX_PAGE_SIZE = 24

export function fetchPokemonList(
  filter: DexFilter,
  signal?: AbortSignal,
): Promise<PageResponse<PokemonSummary>> {
  return getJson<PageResponse<PokemonSummary>>(
    '/pokemon',
    {
      type: filter.types,
      gen: filter.gen,
      minBst: filter.minBst,
      maxBst: filter.maxBst,
      minSpeed: filter.minSpeed,
      form: filter.forms,
      sort: filter.sort,
      page: filter.page,
      size: DEX_PAGE_SIZE,
    },
    signal,
  )
}
