import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'

import { ApiError } from '../../lib/http'
import {
  analyzeTeam,
  createTeam,
  fetchRecommendations,
  fetchSharedTeam,
  isValidShareCode,
  RECOMMENDATION_LIMIT,
} from './api'

function retryUnlessClientError(failureCount: number, error: Error): boolean {
  if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false
  return failureCount < 1
}

export function useTeamAnalysis(ids: readonly number[]) {
  return useQuery({
    queryKey: ['synergy', 'analyze', ids],
    queryFn: ({ signal }) => analyzeTeam(ids, signal),
    enabled: ids.length > 0,
    staleTime: Infinity,
    placeholderData: keepPreviousData,
    retry: retryUnlessClientError,
  })
}

export function useRecommendations(ids: readonly number[], limit = RECOMMENDATION_LIMIT) {
  return useQuery({
    queryKey: ['synergy', 'recommendations', ids, limit],
    queryFn: ({ signal }) => fetchRecommendations(ids, limit, signal),
    enabled: ids.length > 0,
    staleTime: Infinity,
    placeholderData: keepPreviousData,
    retry: retryUnlessClientError,
  })
}

export function useSaveTeam() {
  return useMutation({ mutationFn: createTeam })
}

export function useSharedTeam(shareCode: string) {
  return useQuery({
    queryKey: ['teams', 'shared', shareCode],
    queryFn: ({ signal }) => fetchSharedTeam(shareCode, signal),
    enabled: isValidShareCode(shareCode),
    staleTime: Infinity,
    retry: retryUnlessClientError,
  })
}
