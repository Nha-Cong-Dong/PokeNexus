import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { jsonResponse, problem } from '../../team-builder/testing'
import type { PokemonDetail, SpeedTier, TypeName } from '../../../types/api'
import { TeamSpeedList } from './TeamSpeedList'

function detailOf(id: number, name: string, types: TypeName[], speed: number): PokemonDetail {
  return {
    id,
    name,
    types,
    speciesId: id,
    speciesName: name,
    generation: 1,
    formCategory: 'DEFAULT',
    isLegendary: false,
    isMythical: false,
    isFullyEvolved: true,
    stats: { hp: 80, attack: 80, defense: 80, specialAttack: 80, specialDefense: 80, speed },
    baseStatTotal: 400 + speed,
    heightDm: 10,
    weightHg: 100,
    defense: [],
    forms: [],
  }
}

const DETAILS: Record<string, PokemonDetail> = {
  '6': detailOf(6, 'charizard', ['fire', 'flying'], 100),
  '445': detailOf(445, 'garchomp', ['dragon', 'ground'], 102),
  '143': detailOf(143, 'snorlax', ['normal'], 30),
}

const TIERS: SpeedTier[] = [
  { speed: 102, pokemon: [{ id: 445, name: 'garchomp', types: ['dragon', 'ground'] }] },
  {
    speed: 100,
    pokemon: [
      { id: 6, name: 'charizard', types: ['fire', 'flying'] },
      { id: 373, name: 'salamence', types: ['dragon', 'flying'] },
    ],
  },
  { speed: 30, pokemon: [{ id: 143, name: 'snorlax', types: ['normal'] }] },
]

function stubApi(tiers: () => Response = () => jsonResponse(TIERS)) {
  vi.stubGlobal(
    'fetch',
    vi.fn<typeof fetch>(async (input) => {
      const path = new URL(String(input)).pathname.replace('/api/v1/pokemon/', '')
      if (path === 'speed-tiers') return tiers()
      const detail = DETAILS[path]
      return detail ? jsonResponse(detail) : problem(404, 'POKEMON_NOT_FOUND')
    }),
  )
}

function renderList(ids: number[]) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <TeamSpeedList ids={ids} />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('TeamSpeedList', () => {
  it('orders the team from fastest to slowest with level 50 values', async () => {
    stubApi()

    renderList([6, 445, 143])

    const list = await screen.findByRole('list', { name: 'Thứ tự tốc độ của đội' })
    const rows = within(list).getAllByRole('listitem')
    expect(rows.map((row) => within(row).getByRole('heading').textContent)).toEqual([
      'Garchomp',
      'Charizard',
      'Snorlax',
    ])
    const [garchomp, charizard, snorlax] = rows as [HTMLElement, HTMLElement, HTMLElement]
    expect(within(garchomp).getByText('Tối đa').nextElementSibling).toHaveTextContent('169')
    expect(within(garchomp).getByText('Tối thiểu').nextElementSibling).toHaveTextContent('96')
    expect(await within(garchomp).findByText('Nhanh hơn 100% Pokémon')).toBeInTheDocument()
    expect(within(charizard).getByText('Nhanh hơn 33% Pokémon')).toBeInTheDocument()
    expect(within(snorlax).getByText('Nhanh hơn 0% Pokémon')).toBeInTheDocument()
  })

  it('keeps the level 50 values when the speed tiers fail to load', async () => {
    stubApi(() => problem(503, 'DATA_NOT_READY'))

    renderList([445])

    const list = await screen.findByRole('list', { name: 'Thứ tự tốc độ của đội' })
    expect(within(list).getByText('Tối đa').nextElementSibling).toHaveTextContent('169')
    expect(await screen.findByText('Chưa tải được bảng tốc độ để so sánh.')).toBeInTheDocument()
    expect(within(list).queryByText(/Nhanh hơn/)).not.toBeInTheDocument()
  })

  it('reports a member whose detail cannot be loaded', async () => {
    stubApi()

    renderList([445, 9999])

    expect(await screen.findByText('Chưa tải được chỉ số tốc độ của đội.')).toBeInTheDocument()
  })
})
