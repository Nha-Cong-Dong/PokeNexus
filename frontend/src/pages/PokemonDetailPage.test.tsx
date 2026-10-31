import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { jsonResponse, renderRoute } from '../test/renderRoute'
import type { EvolutionResponse, PokemonDetail, SpeedTier, TypeName } from '../types/api'

const CHARIZARD_DEFENSE: [TypeName, number][] = [
  ['normal', 1],
  ['fire', 0.5],
  ['water', 2],
  ['electric', 2],
  ['grass', 0.25],
  ['ice', 1],
  ['fighting', 0.5],
  ['poison', 1],
  ['ground', 0],
  ['flying', 1],
  ['psychic', 1],
  ['bug', 0.25],
  ['rock', 4],
  ['ghost', 1],
  ['dragon', 1],
  ['dark', 1],
  ['steel', 0.5],
  ['fairy', 0.5],
]

const CHARIZARD: PokemonDetail = {
  id: 6,
  name: 'charizard',
  types: ['fire', 'flying'],
  speciesId: 6,
  speciesName: 'charizard',
  generation: 1,
  formCategory: 'DEFAULT',
  isLegendary: false,
  isMythical: false,
  isFullyEvolved: true,
  stats: { hp: 78, attack: 84, defense: 78, specialAttack: 109, specialDefense: 85, speed: 100 },
  baseStatTotal: 534,
  heightDm: 17,
  weightHg: 905,
  defense: CHARIZARD_DEFENSE.map(([attackingType, multiplier]) => ({ attackingType, multiplier })),
  forms: [
    { id: 6, name: 'charizard', formCategory: 'DEFAULT' },
    { id: 10034, name: 'charizard-mega-x', formCategory: 'MEGA' },
    { id: 10035, name: 'charizard-mega-y', formCategory: 'MEGA' },
  ],
}

const CHARIZARD_EVOLUTION: EvolutionResponse = {
  chainId: 2,
  stages: [
    {
      speciesId: 4,
      pokemonId: 4,
      name: 'charmander',
      types: ['fire'],
      evolvesFromSpeciesId: null,
      trigger: null,
      minLevel: null,
      item: null,
    },
    {
      speciesId: 5,
      pokemonId: 5,
      name: 'charmeleon',
      types: ['fire'],
      evolvesFromSpeciesId: 4,
      trigger: 'level-up',
      minLevel: 16,
      item: null,
    },
    {
      speciesId: 6,
      pokemonId: 6,
      name: 'charizard',
      types: ['fire', 'flying'],
      evolvesFromSpeciesId: 5,
      trigger: 'level-up',
      minLevel: 36,
      item: null,
    },
  ],
}

const SPEED_TIERS: SpeedTier[] = [
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

function stubApi(detail: () => Response, evolution: () => Response | Promise<Response>) {
  const fetchMock = vi.fn<typeof fetch>(async (input) => {
    const url = String(input)
    if (url.endsWith('/speed-tiers')) return jsonResponse(SPEED_TIERS)
    return url.endsWith('/evolution') ? evolution() : detail()
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

function requestedPaths(fetchMock: ReturnType<typeof stubApi>): string[] {
  return fetchMock.mock.calls.map(([input]) => new URL(String(input)).pathname)
}

function defenseCell(type: string) {
  const grid = screen.getByRole('list', { name: 'Hệ số nhận từ 18 hệ' })
  return within(grid).getByText(type).closest('li')
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('PokemonDetailPage', () => {
  it('shows Charizard with stats, facts and an 18-type defense grid', async () => {
    const fetchMock = stubApi(
      () => jsonResponse(CHARIZARD),
      () => jsonResponse(CHARIZARD_EVOLUTION),
    )

    renderRoute('/pokemon/charizard')

    expect(screen.getByRole('heading', { level: 1, name: 'Chi tiết Pokémon' })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { level: 1, name: 'Charizard' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(requestedPaths(fetchMock)[0]).toBe('/api/v1/pokemon/charizard')

    const hero = screen.getByRole('region', { name: 'Charizard' })
    expect(hero).toHaveTextContent('#0006')
    expect(within(hero).getByText('Fire')).toBeInTheDocument()
    expect(within(hero).getByText('Flying')).toBeInTheDocument()
    expect(within(hero).getByRole('img', { name: 'Charizard' })).toHaveAttribute(
      'src',
      expect.stringContaining('official-artwork/6.png'),
    )

    const stats = screen.getByRole('region', { name: 'Chỉ số cơ bản' })
    expect(stats).toHaveTextContent('Tổng534')
    expect(within(stats).getByText('Tấn công đặc biệt').nextElementSibling).toHaveTextContent('109')
    expect(
      within(stats)
        .getAllByRole('term')
        .map((term) => term.textContent),
    ).toEqual([
      'HP',
      'Tấn công',
      'Phòng thủ',
      'Tấn công đặc biệt',
      'Phòng thủ đặc biệt',
      'Tốc độ',
      'Tối thiểu',
      'Không đầu tư',
      'Tối đa',
      'Chiều cao',
      'Cân nặng',
      'Thế hệ',
      'Phân loại',
    ])
    expect(stats).toHaveTextContent('1,7 m')
    expect(stats).toHaveTextContent('90,5 kg')
    expect(stats).toHaveTextContent('Thông thường')
    expect(within(stats).getByRole('link', { name: 'So sánh' })).toHaveAttribute(
      'href',
      '/compare?left=6',
    )
    expect(within(stats).getByRole('link', { name: 'Thêm vào đội' })).toHaveAttribute(
      'href',
      '/team-builder?add=6',
    )

    const defense = screen.getByRole('region', { name: 'Phòng thủ' })
    expect(defense).toHaveTextContent(
      'Charizard yếu trước 3 hệ, nặng nhất là Rock x4. Kháng 6 hệ và miễn nhiễm Ground.',
    )
    expect(
      within(defense)
        .getAllByRole('heading', { level: 3 })
        .map((h) => h.textContent),
    ).toEqual([
      'Yếu3 hệ',
      'Kháng6 hệ',
      'Miễn nhiễm1 hệ',
      'Trung tính x18 hệ',
      'Hệ số nhận từ 18 hệ',
    ])
    expect(
      within(screen.getByRole('list', { name: 'Hệ số nhận từ 18 hệ' })).getAllByRole('listitem'),
    ).toHaveLength(18)
    expect(defenseCell('Rock')).toHaveTextContent('Rockx4')
    expect(defenseCell('Ground')).toHaveTextContent('Groundx0')
    expect(defenseCell('Grass')).toHaveTextContent('Grassx¼')
    expect(defenseCell('Normal')).toHaveTextContent('Normalx1')
  })

  it('shows the level 50 speed spread and the nearest speed tiers', async () => {
    stubApi(
      () => jsonResponse(CHARIZARD),
      () => jsonResponse(CHARIZARD_EVOLUTION),
    )

    renderRoute('/pokemon/charizard')

    const speed = await screen.findByRole('region', { name: 'Tốc độ ở cấp 50' })
    expect(within(speed).getByText('Tối thiểu').nextElementSibling).toHaveTextContent('94')
    expect(within(speed).getByText('Không đầu tư').nextElementSibling).toHaveTextContent('120')
    expect(within(speed).getByText('Tối đa').nextElementSibling).toHaveTextContent('167')
    expect(await within(speed).findByText(/Nhanh hơn 33% Pokémon/)).toBeInTheDocument()
    expect(within(speed).getByRole('link', { name: 'Garchomp' })).toHaveAttribute(
      'href',
      '/pokemon/garchomp',
    )
    expect(within(speed).getByRole('link', { name: 'Snorlax' })).toHaveAttribute(
      'href',
      '/pokemon/snorlax',
    )
  })

  it('lists the evolution chain and the other forms as links', async () => {
    stubApi(
      () => jsonResponse(CHARIZARD),
      () => jsonResponse(CHARIZARD_EVOLUTION),
    )

    renderRoute('/pokemon/6')

    const evolution = await screen.findByRole('region', { name: 'Tiến hóa' })
    const stages = within(evolution).getAllByRole('link')
    expect(stages.map((link) => link.getAttribute('href'))).toEqual([
      '/pokemon/4',
      '/pokemon/5',
      '/pokemon/6',
    ])
    expect(stages[1]).toHaveTextContent('Lv 16')
    expect(stages[2]).toHaveTextContent('Lv 36')
    expect(stages[2]).toHaveAttribute('aria-current', 'page')

    const forms = screen.getByRole('region', { name: 'Các dạng' })
    expect(within(forms).getByRole('link', { name: /Charizard Mega X/ })).toHaveAttribute(
      'href',
      '/pokemon/charizard-mega-x',
    )
    expect(within(forms).getByRole('link', { name: /Đang xem/ })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('keeps room for the evolution tree while it loads so the forms do not jump', async () => {
    let release: (response: Response) => void = () => undefined
    stubApi(
      () => jsonResponse(CHARIZARD),
      () =>
        new Promise<Response>((resolve) => {
          release = resolve
        }),
    )

    renderRoute('/pokemon/6')

    expect(await screen.findByText('Đang tải chuỗi tiến hóa')).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Tiến hóa' })).not.toBeInTheDocument()

    await act(async () => release(jsonResponse(CHARIZARD_EVOLUTION)))

    expect(await screen.findByRole('region', { name: 'Tiến hóa' })).toBeInTheDocument()
    expect(screen.queryByText('Đang tải chuỗi tiến hóa')).not.toBeInTheDocument()
  })

  it('reads stats, evolution, forms and defense in that order', async () => {
    stubApi(
      () => jsonResponse(CHARIZARD),
      () => jsonResponse(CHARIZARD_EVOLUTION),
    )

    renderRoute('/pokemon/6')

    const evolution = await screen.findByRole('region', { name: 'Tiến hóa' })
    const order = [
      screen.getByRole('region', { name: 'Charizard' }),
      screen.getByRole('region', { name: 'Chỉ số cơ bản' }),
      evolution,
      screen.getByRole('region', { name: 'Các dạng' }),
      screen.getByRole('region', { name: 'Phòng thủ' }),
    ]
    order.reduce((previous, region) => {
      expect(
        previous.compareDocumentPosition(region) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy()
      return region
    })
  })

  it('hides the evolution section when that endpoint fails', async () => {
    const fetchMock = stubApi(
      () => jsonResponse(CHARIZARD),
      () => jsonResponse({ status: 404, code: 'ROUTE_NOT_FOUND' }, 404),
    )

    renderRoute('/pokemon/charizard')

    await screen.findByRole('heading', { level: 1, name: 'Charizard' })
    await vi.waitFor(() =>
      expect(requestedPaths(fetchMock)).toContain('/api/v1/pokemon/6/evolution'),
    )
    expect(screen.queryByRole('heading', { name: 'Tiến hóa' })).not.toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Các dạng' })).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows a not found panel with a way back to the Pokédex for an unknown name', async () => {
    stubApi(
      () =>
        jsonResponse(
          { status: 404, detail: 'Pokemon abc-xyz not found', code: 'POKEMON_NOT_FOUND' },
          404,
        ),
      () => jsonResponse({ status: 404, code: 'POKEMON_NOT_FOUND' }, 404),
    )
    const memoryRouter = renderRoute('/pokemon/abc-xyz')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Không tìm thấy Pokémon' }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByText('“abc-xyz”')).toBeInTheDocument()
    expect(screen.queryByText(/Pokemon abc-xyz not found/)).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('link', { name: 'Về Pokédex' }))
    expect(memoryRouter.state.location.pathname).toBe('/pokedex')
  })

  it('shows a Vietnamese error with a retry button when the server fails', async () => {
    stubApi(
      () => jsonResponse({ status: 500, detail: 'boom', code: 'INTERNAL_ERROR' }, 500),
      () => jsonResponse(CHARIZARD_EVOLUTION),
    )

    renderRoute('/pokemon/charizard')

    const alert = await screen.findByRole('alert', {}, { timeout: 3000 })
    expect(alert).toHaveTextContent('Máy chủ gặp lỗi không mong muốn.')
    expect(alert).not.toHaveTextContent('boom')
    expect(within(alert).getByRole('button', { name: 'Thử lại' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Chi tiết Pokémon' })).toBeInTheDocument()
  })
})
