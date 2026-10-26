import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { TYPE_NAMES } from '../lib/pokemonTypes'
import { jsonResponse, renderRoute } from '../test/renderRoute'
import type { CompareResponse, PokemonDetail, PokemonRef, Stats, TypeName } from '../types/api'

function detail(
  id: number,
  name: string,
  types: TypeName[],
  stats: Stats,
  weak: Partial<Record<TypeName, number>>,
): PokemonDetail {
  return {
    id,
    name,
    types,
    speciesId: id,
    speciesName: name,
    generation: 3,
    formCategory: 'DEFAULT',
    isLegendary: false,
    isMythical: false,
    isFullyEvolved: true,
    stats,
    baseStatTotal: Object.values(stats).reduce((sum, value) => sum + value, 0),
    heightDm: 19,
    weightHg: 950,
    defense: TYPE_NAMES.map((type) => ({ attackingType: type, multiplier: weak[type] ?? 1 })),
    forms: [{ id, name, formCategory: 'DEFAULT' }],
  }
}

const GARCHOMP = detail(
  445,
  'garchomp',
  ['dragon', 'ground'],
  { hp: 108, attack: 130, defense: 95, specialAttack: 80, specialDefense: 85, speed: 102 },
  { dragon: 2, ice: 4, fairy: 2, electric: 0 },
)

const SALAMENCE = detail(
  373,
  'salamence',
  ['dragon', 'flying'],
  { hp: 95, attack: 135, defense: 80, specialAttack: 110, specialDefense: 80, speed: 100 },
  { dragon: 2, ice: 4, fairy: 2, ground: 0 },
)

const SUMMARY = [
  'Garchomp nhanh hơn 2 điểm Tốc độ (102 so với 100), đủ để ra đòn trước Salamence.',
  'Hai bên cùng tổng chỉ số 600, không ai lép vế.',
  'Đòn Dragon của mỗi bên đều gây x2 lên đối thủ.',
]

const GARCHOMP_VS_SALAMENCE: CompareResponse = {
  left: GARCHOMP,
  right: SALAMENCE,
  verdict: {
    typeAdvantage: { leftBestMultiplier: 2, rightBestMultiplier: 2, winner: 'TIE' },
    statTotal: { difference: 0, winner: 'TIE' },
    speed: { difference: 2, winner: 'LEFT' },
    summary: SUMMARY,
  },
}

const DETAILS: Record<string, PokemonDetail> = {
  garchomp: GARCHOMP,
  '445': GARCHOMP,
  salamence: SALAMENCE,
  '373': SALAMENCE,
}

const toRef = ({ id, name, types }: PokemonDetail): PokemonRef => ({ id, name, types })

type Routes = {
  compare?: () => Response
  search?: (query: string) => PokemonRef[]
}

function stubApi({ compare, search }: Routes = {}) {
  const fetchMock = vi.fn<typeof fetch>((input) => {
    const url = new URL(String(input))
    const path = url.pathname.replace('/api/v1', '')
    if (path === '/pokemon/compare') {
      return Promise.resolve(compare ? compare() : jsonResponse(GARCHOMP_VS_SALAMENCE))
    }
    if (path === '/pokemon/search') {
      return Promise.resolve(jsonResponse(search ? search(url.searchParams.get('q') ?? '') : []))
    }
    const key = decodeURIComponent(path.replace('/pokemon/', ''))
    const found = DETAILS[key]
    return Promise.resolve(
      found
        ? jsonResponse(found)
        : jsonResponse({ status: 404, code: 'POKEMON_NOT_FOUND', detail: 'nope' }, 404),
    )
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

function requestedPaths(fetchMock: ReturnType<typeof stubApi>): string[] {
  return fetchMock.mock.calls.map((call) => {
    const url = new URL(String(call[0]))
    return `${url.pathname}${url.search}`
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('ComparePage', () => {
  it('starts empty with one heading and offers an example pair', async () => {
    const fetchMock = stubApi()
    const memoryRouter = renderRoute('/compare')

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: 'Bàn Cân Sức Mạnh' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bàn cân đang trống' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Pokémon bên trái' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Pokémon bên phải' })).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()

    await userEvent.click(screen.getByRole('link', { name: 'Thử Garchomp và Salamence' }))

    expect(memoryRouter.state.location.search).toBe('?left=garchomp&right=salamence')
  })

  it('compares Garchomp with Salamence: banner, radar, stat table and the API verdict', async () => {
    const fetchMock = stubApi()
    renderRoute('/compare?left=Garchomp&right=salamence')

    const verdict = await screen.findByRole('region', { name: 'Kết luận' })
    SUMMARY.forEach((sentence) => expect(within(verdict).getByText(sentence)).toBeInTheDocument())
    expect(within(verdict).getByText('Garchomp thắng')).toBeInTheDocument()
    expect(within(verdict).getAllByText('Ngang nhau')).toHaveLength(2)
    expect(verdict).toHaveTextContent('Đòn cùng hệ tốt nhất: Garchomp x2, Salamence x2.')
    expect(verdict).toHaveTextContent('Garchomp:Dragonx2Groundx0')

    expect(requestedPaths(fetchMock)).toContain(
      '/api/v1/pokemon/compare?left=garchomp&right=salamence',
    )
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('region', { name: 'Garchomp đối đầu Salamence' })).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: /Garchomp: HP 108, .*Tốc độ 102\. Salamence: HP 95/ }),
    ).toBeInTheDocument()

    const speedRow = screen.getByRole('row', { name: /Tốc độ/ })
    expect(speedRow).toHaveTextContent('102+2')
    expect(speedRow).toHaveTextContent('100')
    expect(screen.getByRole('row', { name: /Tổng \(BST\)/ })).toHaveTextContent('600')
  })

  it('asks for the second Pokémon, hides the chosen one from the other search and fills the URL', async () => {
    const fetchMock = stubApi({
      search: (query) => (query.startsWith('sal') ? [toRef(SALAMENCE)] : [toRef(GARCHOMP)]),
    })
    const memoryRouter = renderRoute('/compare?left=garchomp')

    expect(
      await screen.findByRole('heading', { name: 'Chọn thêm một Pokémon' }),
    ).toBeInTheDocument()
    expect(
      await screen.findByText('Garchomp đã lên bàn cân. Tìm đối thủ cho bên phải.'),
    ).toBeInTheDocument()

    const rightSearch = screen.getByRole('combobox', { name: 'Pokémon bên phải' })
    await userEvent.type(rightSearch, 'garch')
    expect(await screen.findByText(/Không tìm thấy Pokémon nào khớp/)).toBeInTheDocument()

    await userEvent.clear(rightSearch)
    await userEvent.type(rightSearch, 'sala')
    await screen.findByRole('option', { name: /Salamence/ })
    await userEvent.keyboard('{Enter}')

    expect(memoryRouter.state.location.search).toBe('?left=garchomp&right=salamence')
    expect(await screen.findByRole('region', { name: 'Kết luận' })).toBeInTheDocument()
    expect(requestedPaths(fetchMock).filter((path) => path.includes('/compare'))).toHaveLength(1)
  })

  it('refuses the same Pokémon on both sides without calling the compare endpoint', async () => {
    const fetchMock = stubApi()
    renderRoute('/compare?left=garchomp&right=445')

    expect(
      await screen.findByRole('heading', { name: 'Hai bên đang là cùng một Pokémon' }),
    ).toBeInTheDocument()
    expect(requestedPaths(fetchMock).some((path) => path.includes('/compare'))).toBe(false)
  })

  it('swaps both sides through the URL', async () => {
    stubApi()
    const memoryRouter = renderRoute('/compare?left=garchomp&right=salamence')
    await screen.findByRole('region', { name: 'Kết luận' })

    await userEvent.click(screen.getByRole('button', { name: 'Đổi bên hai Pokémon' }))

    expect(memoryRouter.state.location.search).toBe('?left=salamence&right=garchomp')
  })

  it('explains an unknown Pokémon and clears that side', async () => {
    stubApi({
      compare: () => jsonResponse({ status: 404, code: 'POKEMON_NOT_FOUND' }, 404),
    })
    const memoryRouter = renderRoute('/compare?left=garchomp&right=missingno')

    expect(
      await screen.findByRole('heading', { name: 'Không tìm thấy Pokémon' }),
    ).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Bỏ chọn bên phải' }))

    expect(memoryRouter.state.location.search).toBe('?left=garchomp')
  })

  it('shows a Vietnamese error with retry when the compare request fails', async () => {
    stubApi({
      compare: () =>
        jsonResponse({ status: 503, code: 'DATA_NOT_READY', detail: 'not loaded' }, 503),
    })
    renderRoute('/compare?left=garchomp&right=salamence')

    const alert = await screen.findByRole('alert', {}, { timeout: 3000 })
    expect(alert).toHaveTextContent('Dữ liệu Pokémon đang được nạp')
    expect(alert).not.toHaveTextContent('not loaded')
    expect(within(alert).getByRole('button', { name: 'Thử lại' })).toBeInTheDocument()
  })
})
