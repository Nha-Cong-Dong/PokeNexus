import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { vi } from 'vitest'

import { SharedTeamPage } from '../../pages/SharedTeamPage'
import { TeamBuilderPage } from '../../pages/TeamBuilderPage'
import type {
  AnalyzeResponse,
  PokemonRef,
  Recommendation,
  RecommendationResponse,
  TypeMatrixRow,
  TypeName,
} from '../../types/api'

export const CHARIZARD: PokemonRef = { id: 6, name: 'charizard', types: ['fire', 'flying'] }
export const GYARADOS: PokemonRef = { id: 130, name: 'gyarados', types: ['water', 'flying'] }
export const DRAGONITE: PokemonRef = { id: 149, name: 'dragonite', types: ['dragon', 'flying'] }
export const TALONFLAME: PokemonRef = { id: 663, name: 'talonflame', types: ['fire', 'flying'] }
export const VOLCARONA: PokemonRef = { id: 637, name: 'volcarona', types: ['bug', 'fire'] }
export const TYRANITAR: PokemonRef = { id: 248, name: 'tyranitar', types: ['rock', 'dark'] }
export const EMPOLEON: PokemonRef = { id: 395, name: 'empoleon', types: ['water', 'steel'] }
export const GARCHOMP: PokemonRef = { id: 445, name: 'garchomp', types: ['dragon', 'ground'] }

export const SPEC_TEAM = [CHARIZARD, GYARADOS, DRAGONITE, TALONFLAME, VOLCARONA]

const API_TYPE_ORDER: TypeName[] = [
  'normal',
  'fighting',
  'flying',
  'poison',
  'ground',
  'rock',
  'bug',
  'ghost',
  'steel',
  'fire',
  'water',
  'grass',
  'electric',
  'psychic',
  'ice',
  'dragon',
  'dark',
  'fairy',
]

export const SPEC_ROCK_ROW: Partial<TypeMatrixRow> = {
  multipliers: [4, 2, 2, 4, 4],
  weakCount: 5,
  resistCount: 0,
  pressure: 8,
  criticalHole: true,
}

export function analysisFor(
  members: readonly PokemonRef[],
  teamScore: number,
  rows: Partial<Record<TypeName, Partial<TypeMatrixRow>>> = {},
): AnalyzeResponse {
  return {
    members: [...members],
    teamScore,
    typeMatrix: API_TYPE_ORDER.map((attackingType) => ({
      attackingType,
      multipliers: members.map(() => 1),
      weakCount: 0,
      resistCount: 0,
      pressure: 0,
      criticalHole: false,
      ...rows[attackingType],
    })),
    offensiveCoverage: { coveredTypeCount: 12, uncoveredTypes: ['normal', 'water', 'fairy'] },
    statRadar: {
      hp: 72,
      attack: 81,
      defense: 60,
      specialAttack: 78,
      specialDefense: 66,
      speed: 75,
    },
    insights: [
      {
        tone: 'STRENGTH',
        category: 'SPEED',
        text: '3 thành viên nhanh (tốc độ gốc từ 100)',
        types: [],
      },
      {
        tone: 'WEAKNESS',
        category: 'DEFENSE',
        text: 'Lỗ hổng nghiêm trọng hệ Rock: 5 thành viên yếu, không ai kháng',
        types: ['rock'],
      },
    ],
  }
}

export function recommendationsOf(...items: [PokemonRef, number][]): RecommendationResponse {
  return {
    playStyle: 'BALANCE',
    candidateCount: 412,
    items: items.map(([pokemon, score]): Recommendation => ({
      ...pokemon,
      score,
      breakdown: { defense: 0.9, offense: 0.5, role: 0.6, stats: 0.8 },
      baseStatTotal: 600,
      reasons: ['Kháng hệ Rock (x0,5): đội đang có 5 thành viên yếu, chưa ai kháng'],
      cautions: ['Thêm điểm yếu hệ Ice: đội đã có 2 thành viên yếu'],
    })),
  }
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': status >= 400 ? 'application/problem+json' : 'application/json' },
  })
}

export function problem(status: number, code: string): Response {
  return jsonResponse({ status, title: 'Error', detail: 'developer detail', code }, status)
}

type Handler = (body: unknown) => Response | Promise<Response>

export function routeFetch(handlers: Record<string, Handler>) {
  const fetchMock = vi.fn<typeof fetch>(async (input, init) => {
    const url = new URL(String(input))
    const path = url.pathname.split('/api/v1')[1] ?? url.pathname
    const handler = handlers[`${init?.method ?? 'GET'} ${path}`]
    if (!handler) return problem(404, 'ROUTE_NOT_FOUND')
    return handler(init?.body ? JSON.parse(String(init.body)) : undefined)
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

export function bodiesSentTo(fetchMock: ReturnType<typeof routeFetch>, path: string): unknown[] {
  return fetchMock.mock.calls
    .filter(([input]) => new URL(String(input)).pathname.endsWith(path))
    .map(([, init]) => (init?.body ? JSON.parse(String(init.body)) : undefined))
}

export function renderTeamRoute(path: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const router = createMemoryRouter(
    [
      { path: '/team-builder', element: <TeamBuilderPage /> },
      { path: '/team/:shareCode', element: <SharedTeamPage /> },
      { path: '*', element: <p>Trang khác</p> },
    ],
    { initialEntries: [path] },
  )
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  return router
}
