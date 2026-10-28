import { useQueries } from '@tanstack/react-query'

import { ApiError } from '../../lib/http'
import type { PokemonSummary, TypeName } from '../../types/api'
import { fetchTypePool } from './api'

export interface TypeTotal {
  type: TypeName
  total: number
}

export interface TerrainPool {
  pokemon: PokemonSummary[] | undefined
  totals: TypeTotal[]
  isPending: boolean
  isError: boolean
  errorCode: string | undefined
  retry: () => void
}

export function mergePools(pages: readonly (readonly PokemonSummary[])[]): PokemonSummary[] {
  const byId = new Map<number, PokemonSummary>()
  for (const page of pages) for (const pokemon of page) byId.set(pokemon.id, pokemon)
  return [...byId.values()].sort((left, right) => left.id - right.id)
}

export function useTerrainPool(types: readonly TypeName[]): TerrainPool {
  return useQueries({
    queries: types.map((type) => ({
      queryKey: ['pokemon', 'type-pool', type],
      queryFn: ({ signal }: { signal: AbortSignal }) => fetchTypePool(type, signal),
      staleTime: Infinity,
    })),
    combine: (results) => {
      const done = results.every((result) => result.isSuccess)
      return {
        pokemon: done ? mergePools(results.map((result) => result.data?.content ?? [])) : undefined,
        totals: done
          ? types.map((type, index) => ({
              type,
              total: results[index]?.data?.totalElements ?? 0,
            }))
          : [],
        isPending: results.some((result) => result.isPending),
        isError: results.some((result) => result.isError),
        errorCode: results
          .map((result) => result.error)
          .find((error): error is ApiError => error instanceof ApiError)?.code,
        retry: () => {
          for (const result of results) if (result.isError) void result.refetch()
        },
      }
    },
  })
}
