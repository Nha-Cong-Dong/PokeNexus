import { useQuery } from '@tanstack/react-query'

import { fetchCompare } from './api'

export interface ComparePair {
  left: string
  right: string
}

export function useCompare(pair: ComparePair | undefined) {
  return useQuery({
    queryKey: ['compare', pair?.left ?? '', pair?.right ?? ''],
    queryFn: ({ signal }) => fetchCompare(pair?.left ?? '', pair?.right ?? '', signal),
    enabled: pair !== undefined,
    staleTime: Infinity,
  })
}
