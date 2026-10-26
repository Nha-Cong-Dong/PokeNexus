import { useQuery } from '@tanstack/react-query'

import { fetchTypeMatrix } from './api'

export function useTypeMatrix() {
  return useQuery({
    queryKey: ['types', 'matrix'],
    queryFn: ({ signal }) => fetchTypeMatrix(signal),
    staleTime: Infinity,
  })
}
