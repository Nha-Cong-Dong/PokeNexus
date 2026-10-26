import { useQuery } from '@tanstack/react-query'

import { ApiError } from '../../lib/http'
import { fetchEvolution, fetchPokemonDetail } from './api'

function retryUnlessClientError(failureCount: number, error: Error): boolean {
  if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false
  return failureCount < 1
}

export function usePokemonDetail(idOrName: string | number | undefined) {
  const key = idOrName === undefined ? '' : String(idOrName).toLowerCase()
  return useQuery({
    queryKey: ['pokemon', key],
    queryFn: ({ signal }) => fetchPokemonDetail(key, signal),
    enabled: key.length > 0,
    staleTime: Infinity,
    retry: retryUnlessClientError,
  })
}

export function useEvolution(idOrName: string | number | undefined) {
  const key = idOrName === undefined ? '' : String(idOrName).toLowerCase()
  return useQuery({
    queryKey: ['pokemon', key, 'evolution'],
    queryFn: ({ signal }) => fetchEvolution(key, signal),
    enabled: key.length > 0,
    staleTime: Infinity,
    retry: retryUnlessClientError,
  })
}
