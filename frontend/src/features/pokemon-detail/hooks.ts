import { useQueries, useQuery } from '@tanstack/react-query'

import { fetchEvolution, fetchPokemonDetail } from './api'

export function pokemonDetailKey(idOrName: string | number) {
  return ['pokemon', 'detail', String(idOrName).toLowerCase()] as const
}

export function usePokemonDetail(idOrName: string | number | undefined) {
  const key = idOrName === undefined ? '' : String(idOrName).toLowerCase()
  return useQuery({
    queryKey: pokemonDetailKey(key),
    queryFn: ({ signal }) => fetchPokemonDetail(key, signal),
    enabled: key.length > 0,
    staleTime: Infinity,
  })
}

export function useEvolution(idOrName: string | number | undefined) {
  const key = idOrName === undefined ? '' : String(idOrName).toLowerCase()
  return useQuery({
    queryKey: ['pokemon', 'evolution', key],
    queryFn: ({ signal }) => fetchEvolution(key, signal),
    enabled: key.length > 0,
    staleTime: Infinity,
  })
}

export function usePokemonDetails(ids: readonly number[]) {
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: pokemonDetailKey(id),
      queryFn: ({ signal }: { signal: AbortSignal }) => fetchPokemonDetail(String(id), signal),
      staleTime: Infinity,
    })),
  })
}
