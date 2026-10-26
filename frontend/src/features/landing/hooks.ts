import { useQueries } from '@tanstack/react-query'

import { ApiError } from '../../lib/http'

import { fetchGenerationSpeciesCount } from './api'
import { GENERATIONS } from './generations'

export interface GenerationCounts {
  counts: number[] | undefined
  isPending: boolean
  isError: boolean
  errorCode: string | undefined
  retry: () => void
}

export function useGenerationCounts(): GenerationCounts {
  return useQueries({
    queries: GENERATIONS.map(({ generation }) => ({
      queryKey: ['pokemon', 'generation-count', generation],
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        fetchGenerationSpeciesCount(generation, signal),
      staleTime: Infinity,
    })),
    combine: (results) => {
      const done = results.every((result) => result.isSuccess)
      return {
        counts: done ? results.map((result) => result.data ?? 0) : undefined,
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
