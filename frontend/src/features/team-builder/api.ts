import { getJson, postJson } from '../../lib/http'
import type {
  AnalyzeRequest,
  AnalyzeResponse,
  CreateTeamRequest,
  FormCategory,
  PokemonRef,
  RecommendationRequest,
  RecommendationResponse,
  TeamResponse,
} from '../../types/api'

export const RECOMMENDATION_LIMIT = 3
export const MAX_TEAM_SIZE = 6
export const TEAM_NAME_MAX_LENGTH = 60

const SHARE_CODE_PATTERN = /^[A-Za-z0-9]{8}$/
const ALL_FORMS: FormCategory[] = ['DEFAULT', 'REGIONAL', 'MEGA', 'GMAX', 'OTHER']
const NAME_LOOKUP_LIMIT = 10

export function isValidShareCode(code: string): boolean {
  return SHARE_CODE_PATTERN.test(code)
}

export function sharePath(shareCode: string): string {
  return `/team/${shareCode}`
}

export function analyzeTeam(
  pokemonIds: readonly number[],
  signal?: AbortSignal,
): Promise<AnalyzeResponse> {
  const body: AnalyzeRequest = { pokemonIds: [...pokemonIds] }
  return postJson<AnalyzeResponse>('/synergy/analyze', body, signal)
}

export function fetchRecommendations(
  pokemonIds: readonly number[],
  limit: number,
  excludeLegendary: boolean,
  signal?: AbortSignal,
): Promise<RecommendationResponse> {
  const body: RecommendationRequest = {
    pokemonIds: [...pokemonIds],
    limit,
    ...(excludeLegendary ? { excludeLegendary } : {}),
  }
  return postJson<RecommendationResponse>('/synergy/recommendations', body, signal)
}

export function createTeam(request: CreateTeamRequest): Promise<TeamResponse> {
  return postJson<TeamResponse>('/teams', request)
}

export function fetchSharedTeam(shareCode: string, signal?: AbortSignal): Promise<TeamResponse> {
  return getJson<TeamResponse>(`/teams/shared/${encodeURIComponent(shareCode)}`, undefined, signal)
}

export function searchAllForms(query: string, signal?: AbortSignal): Promise<PokemonRef[]> {
  return getJson<PokemonRef[]>(
    '/pokemon/search',
    { q: query, limit: NAME_LOOKUP_LIMIT, form: ALL_FORMS },
    signal,
  )
}
