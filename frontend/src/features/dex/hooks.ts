import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { fetchPokemonList } from './api'
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
