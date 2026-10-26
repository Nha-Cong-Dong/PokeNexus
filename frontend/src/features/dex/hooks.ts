import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { fetchPokemonList, SEARCH_MIN_LENGTH, searchPokemon } from './api'
import type { DexFilter } from './useDexSearchParams'

const LIST_STALE_TIME_MS = 5 * 60 * 1000

export function usePokemonList(filter: DexFilter) {
  return useQuery({
    queryKey: ['pokemon', 'list', filter],
    queryFn: ({ signal }) => fetchPokemonList(filter, signal),
    staleTime: LIST_STALE_TIME_MS,
    placeholderData: keepPreviousData,
  })
}

export function usePokemonSearch(query: string) {
  const trimmed = query.trim().toLowerCase()
  return useQuery({
    queryKey: ['pokemon', 'search', trimmed],
    queryFn: ({ signal }) => searchPokemon(trimmed, signal),
    enabled: trimmed.length >= SEARCH_MIN_LENGTH,
    staleTime: LIST_STALE_TIME_MS,
  })
}
