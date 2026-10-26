import { QueryClient } from '@tanstack/react-query'

import { ApiError } from './http'

export function retryUnlessClientError(failureCount: number, error: Error): boolean {
  if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false
  return failureCount < 1
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: retryUnlessClientError,
        refetchOnWindowFocus: false,
      },
    },
  })
}
