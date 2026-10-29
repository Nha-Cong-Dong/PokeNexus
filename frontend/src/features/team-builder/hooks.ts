import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'

import {
  analyzeTeam,
  createTeam,
  fetchRecommendations,
  fetchSharedTeam,
  isValidShareCode,
  RECOMMENDATION_LIMIT,
} from './api'

export function useTeamAnalysis(ids: readonly number[]) {
  return useQuery({
    queryKey: ['synergy', 'analyze', ids],
    queryFn: ({ signal }) => analyzeTeam(ids, signal),
    enabled: ids.length > 0,
    staleTime: Infinity,
    placeholderData: keepPreviousData,
  })
}

export function useRecommendations(
  ids: readonly number[],
  excludeLegendary = false,
  limit = RECOMMENDATION_LIMIT,
) {
  return useQuery({
    queryKey: ['synergy', 'recommendations', ids, limit, excludeLegendary],
    queryFn: ({ signal }) => fetchRecommendations(ids, limit, excludeLegendary, signal),
    enabled: ids.length > 0,
    staleTime: Infinity,
    placeholderData: keepPreviousData,
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
  })
}
