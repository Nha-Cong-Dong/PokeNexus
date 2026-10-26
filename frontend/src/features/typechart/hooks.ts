import { useQuery } from '@tanstack/react-query'

import { fetchTypeMatrix, fetchTypes } from './api'

export function useTypes() {
  return useQuery({
    queryKey: ['types'],
    queryFn: ({ signal }) => fetchTypes(signal),
    staleTime: Infinity,
  })
}

export function useTypeMatrix() {
  return useQuery({
    queryKey: ['types', 'matrix'],
    queryFn: ({ signal }) => fetchTypeMatrix(signal),
    staleTime: Infinity,
  })
}
