import { getJson } from '../../lib/http'
import type { FormCategory, PageResponse, PokemonSuggestion, PokemonSummary } from '../../types/api'
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

export const SEARCH_MIN_LENGTH = 2
export const SEARCH_MAX_LENGTH = 30
export const SEARCH_LIMIT = 8

export const SEARCH_FORMS: FormCategory[] = ['DEFAULT', 'REGIONAL', 'MEGA', 'GMAX', 'OTHER']

export function searchPokemon(query: string, signal?: AbortSignal): Promise<PokemonSuggestion[]> {
  return getJson<PokemonSuggestion[]>(
    '/pokemon/search',
    { q: query.trim(), limit: SEARCH_LIMIT, form: SEARCH_FORMS },
    signal,
  )
}
