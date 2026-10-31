import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import type { PlayStyle } from '../../types/api'

import {
  analyzeTeam,
  createTeam,
  DEFAULT_PLAY_STYLE,
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
  playStyle: PlayStyle = DEFAULT_PLAY_STYLE,
  limit = RECOMMENDATION_LIMIT,
) {
  return useQuery({
    queryKey: ['synergy', 'recommendations', ids, limit, excludeLegendary, playStyle],
    queryFn: ({ signal }) => fetchRecommendations(ids, limit, excludeLegendary, playStyle, signal),
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

type ScoreHistory = {
  teamKey: string
  score: number
  delta: number
}

export function useScoreDelta(score: number | undefined, teamKey: string): number {
  const [history, setHistory] = useState<ScoreHistory | null>(null)
  if (score === undefined) {
    if (history !== null) setHistory(null)
    return 0
  }
  if (history === null || history.teamKey !== teamKey) {
    const delta = history === null ? 0 : Math.round(score) - Math.round(history.score)
    setHistory({ teamKey, score, delta })
    return delta
  }
  return history.delta
}
