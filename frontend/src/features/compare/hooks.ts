import { useQuery } from '@tanstack/react-query'

import { ApiError } from '../../lib/http'
import { fetchCompare } from './api'

export interface ComparePair {
  left: string
  right: string
}

function retryUnlessClientError(failureCount: number, error: Error): boolean {
  if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false
  return failureCount < 1
}

export function useCompare(pair: ComparePair | undefined) {
  return useQuery({
    queryKey: ['compare', pair?.left ?? '', pair?.right ?? ''],
    queryFn: ({ signal }) => fetchCompare(pair?.left ?? '', pair?.right ?? '', signal),
    enabled: pair !== undefined,
    staleTime: Infinity,
    retry: retryUnlessClientError,
  })
}
