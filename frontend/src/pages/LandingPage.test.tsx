import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { TYPE_NAMES } from '../lib/pokemonTypes'
import { jsonResponse, renderRoute } from '../test/renderRoute'
import type { PokemonDetail, TypeMatrix, TypeName } from '../types/api'

const GENERATION_COUNTS = [151, 100, 135, 107, 156, 72, 88, 96, 120]

function matrix(): TypeMatrix {
  const types = [...TYPE_NAMES]
  const multipliers = types.map(() => types.map(() => 1))
  const set = (attacking: TypeName, defending: TypeName, value: number) => {
    multipliers[types.indexOf(attacking)]![types.indexOf(defending)] = value
  }
  for (const target of ['grass', 'ice', 'bug', 'steel'] as const) set('fire', target, 2)
  for (const target of ['fire', 'water', 'rock', 'dragon'] as const) set('fire', target, 0.5)
  set('electric', 'water', 2)
  set('electric', 'flying', 2)
  return { types, multipliers }
}

function detail(id: number): PokemonDetail {
  return {
    id,
    name: `pokemon-${id}`,
    types: ['fire', 'flying'],
    speciesId: id,
    speciesName: `pokemon-${id}`,
    generation: 1,
    formCategory: 'DEFAULT',
    isLegendary: false,
    isMythical: false,
    isFullyEvolved: true,
    stats: { hp: 78, attack: 84, defense: 78, specialAttack: 109, specialDefense: 85, speed: 100 },
    baseStatTotal: 534,
    heightDm: 17,
    weightHg: 905,
    defense: TYPE_NAMES.map((type) => ({
      attackingType: type,
      multiplier: type === 'rock' ? 4 : type === 'ground' ? 0 : 1,
    })),
    forms: [],
  }
}

function stubApi() {
  const fetchMock = vi.fn<typeof fetch>(async (input) => {
    const url = new URL(String(input))
    if (url.pathname.endsWith('/types/matrix')) return jsonResponse(matrix())
    const detailMatch = /\/pokemon\/(\d+)$/.exec(url.pathname)
    if (detailMatch) return jsonResponse(detail(Number(detailMatch[1])))
    if (url.pathname.endsWith('/pokemon')) {
      const generation = Number(url.searchParams.get('gen'))
      const count = GENERATION_COUNTS[generation - 1] ?? 0
      return jsonResponse({
        content: [],
        page: 0,
        size: 1,
        totalElements: count,
        totalPages: count,
      })
    }
    return jsonResponse({ status: 404, code: 'ROUTE_NOT_FOUND' }, 404)
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

beforeEach(() => {
  stubApi()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('LandingPage', () => {
  it('shows the hero with the professor dialog and links to the tools', async () => {
    renderRoute('/')

    expect(screen.getByRole('heading', { level: 1, name: 'PokeNexus' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    const hero = screen.getByRole('region', { name: 'PokeNexus' })
    expect(within(hero).getByRole('link', { name: 'Mở Pokédex' })).toHaveAttribute(
      'href',
      '/pokedex',
    )
    expect(within(hero).getByRole('link', { name: 'Xây đội ngay' })).toHaveAttribute(
      'href',
      '/team-builder',
    )
    expect(await within(hero).findByText('1,7 m')).toBeInTheDocument()
  })

  it('switches the featured Pokémon when another region is chosen', async () => {
    const fetchMock = stubApi()
    renderRoute('/')
    const picker = screen.getByRole('group', { name: 'Chọn vùng đất' })
    expect(within(picker).getAllByRole('button')).toHaveLength(13)

    await userEvent.click(within(picker).getByRole('button', { name: /Núi lửa/ }))

    expect(within(picker).getByRole('button', { name: /Núi lửa/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await waitFor(() =>
      expect(fetchMock.mock.calls.some(([input]) => String(input).endsWith('/pokemon/6'))).toBe(
        true,
      ),
    )
  })

  it('links the four regions to their tools', () => {
    renderRoute('/')
    const regions = screen.getByRole('region', { name: 'Bốn vùng đất' })
    const hrefs = within(regions)
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'))
    expect(hrefs).toEqual(['/pokedex', '/types', '/compare', '/team-builder'])
  })

  it('lists what Fire hits super effectively on the type wheel', async () => {
    renderRoute('/')
    const wheel = screen.getByRole('region', { name: 'Vòng tương khắc' })

    const superEffective = await within(wheel).findByText('x2', { selector: 'dt' })
    const row = superEffective.parentElement as HTMLElement
    expect(
      within(row)
        .getAllByText(/Grass|Ice|Bug|Steel/)
        .map((node) => node.textContent),
    ).toEqual(['Grass', 'Ice', 'Bug', 'Steel'])

    await userEvent.click(within(wheel).getByRole('button', { name: 'Electric' }))
    const electricRow = (await within(wheel).findByText('x2', { selector: 'dt' }))
      .parentElement as HTMLElement
    expect(within(electricRow).getByText('Water')).toBeInTheDocument()
    expect(within(electricRow).getByText('Flying')).toBeInTheDocument()
  })

  it('charts species per generation and links each column to the filtered Pokédex', async () => {
    renderRoute('/')
    const chart = screen.getByRole('region', { name: '1.025 loài qua 9 thế hệ' })

    const kanto = await within(chart).findByRole('link', { name: /Thế hệ 1, Kanto: 151 loài/ })
    expect(kanto).toHaveAttribute('href', '/pokedex?gen=1')
    expect(within(chart).getAllByRole('link')).toHaveLength(9)
  })

  it('checks a quiz answer, explains it and counts the score', async () => {
    renderRoute('/')
    const quiz = screen.getByRole('region', { name: 'Thử tài Trainer' })
    const correctOption = await within(quiz).findByRole('button', { name: 'x4' })
    const next = within(quiz).getByRole('button', { name: 'Câu tiếp' })
    expect(next).toBeDisabled()

    await userEvent.click(correctOption)

    expect(within(quiz).getByText('Chính xác!')).toBeInTheDocument()
    expect(correctOption).toHaveClass('bg-success!')
    expect(
      within(quiz).getByText(/Electric gây x2 lên Water và x2 lên Flying, nhân lại thành x4\./),
    ).toBeInTheDocument()
    expect(within(quiz).getByText(/câu đã trả lời/)).toHaveTextContent(
      'Đúng 1 trên 1 câu đã trả lời',
    )
    expect(within(quiz).getByRole('button', { name: 'x1' })).toBeDisabled()

    await userEvent.click(next)
    expect(within(quiz).getByText('Câu')).toHaveTextContent('Câu 2/6')
  })

  it('shows per-block errors with the API reason when data is not ready', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>(async () => jsonResponse({ status: 503, code: 'DATA_NOT_READY' }, 503)),
    )
    renderRoute('/')

    const hero = screen.getByRole('region', { name: 'PokeNexus' })
    expect(await within(hero).findByText('Chưa tải được')).toBeInTheDocument()
    expect(within(hero).getByRole('button', { name: 'Thử lại' })).toBeInTheDocument()

    const chart = screen.getByRole('region', { name: '1.025 loài qua 9 thế hệ' })
    expect(
      await within(chart).findByText('Dữ liệu Pokémon đang được nạp. Hãy thử lại sau ít phút.'),
    ).toBeInTheDocument()
    expect(within(hero).getByRole('link', { name: 'Mở Pokédex' })).toBeInTheDocument()
  })
})
