import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { TRAINER_STORAGE_KEY } from '../features/trainer/useTrainerProgress'
import { jsonResponse, renderRoute } from '../test/renderRoute'
import type { PokemonSummary, TypeName } from '../types/api'

function summary(id: number, name: string, type: TypeName): PokemonSummary {
  return {
    id,
    name,
    types: [type],
    generation: 1,
    formCategory: 'DEFAULT',
    baseStatTotal: 400,
    speed: 60,
  }
}

const FIRE = [
  summary(4, 'charmander', 'fire'),
  summary(5, 'charmeleon', 'fire'),
  summary(6, 'charizard', 'fire'),
  summary(37, 'vulpix', 'fire'),
  summary(38, 'ninetales', 'fire'),
]

function stubApi(status = 200) {
  const fetchMock = vi.fn<typeof fetch>(async (input) => {
    const url = new URL(String(input))
    if (status !== 200) return jsonResponse({ status, code: 'DATA_NOT_READY' }, status)
    const type = url.searchParams.get('type')
    const content = type === 'fire' ? FIRE : []
    return jsonResponse({
      content,
      page: 0,
      size: 100,
      totalElements: type === 'fire' ? 85 : 0,
      totalPages: 1,
    })
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

beforeEach(() => {
  window.localStorage.clear()
  vi.spyOn(Math, 'random').mockReturnValue(0)
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  window.localStorage.clear()
})

describe('TerrainPage', () => {
  it('describes the volcano and asks the API for Fire Pokémon', async () => {
    const fetchMock = stubApi()
    renderRoute('/terrain/volcano')

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 2, name: 'Núi lửa' })).toBeInTheDocument()
    const picker = screen.getByRole('region', { name: 'Chọn địa hình' })
    expect(within(picker).getAllByRole('link')).toHaveLength(13)
    expect(within(picker).getByRole('link', { name: 'Núi lửa' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    const list = screen.getByRole('region', { name: 'Pokémon thường gặp ở Núi lửa' })
    expect(await within(list).findByRole('link', { name: /Charizard/ })).toBeInTheDocument()
    expect(within(list).getByRole('link', { name: /Xem đủ 85 Pokémon hệ Fire/ })).toHaveAttribute(
      'href',
      '/pokedex?type=fire',
    )
    const url = new URL(String(fetchMock.mock.calls[0]?.[0]))
    expect(url.pathname).toBe('/api/v1/pokemon')
    expect(url.searchParams.get('type')).toBe('fire')
    expect(url.searchParams.get('size')).toBe('100')
  })

  it('reveals the silhouette, awards points and remembers them', async () => {
    stubApi()
    renderRoute('/terrain/volcano')
    const game = screen.getByRole('region', { name: "Who's that Pokémon?" })

    expect(await within(game).findByAltText('Bóng đen của một Pokémon bí ẩn')).toBeInTheDocument()
    const options = within(game).getByRole('group', { name: 'Chọn tên Pokémon' })
    expect(within(options).getAllByRole('button')).toHaveLength(4)

    await userEvent.click(within(options).getByRole('button', { name: 'Charmander' }))

    expect(within(game).getByText('Chính xác!')).toBeInTheDocument()
    expect(within(options).getByRole('button', { name: 'Charmander' })).toHaveClass('bg-success!')
    expect(within(game).getByAltText('Artwork Charmander')).toBeInTheDocument()
    expect(within(game).getByText(/Cộng 5 điểm Trainer/)).toBeInTheDocument()
    expect(JSON.parse(window.localStorage.getItem(TRAINER_STORAGE_KEY)!)).toMatchObject({
      points: 5,
      bestStreak: 1,
    })

    await userEvent.click(within(game).getByRole('button', { name: 'Pokémon tiếp theo' }))
    expect(within(game).getByText(/Lượt/)).toHaveTextContent('Lượt 2')
    expect(within(options).getAllByRole('button')[0]).toHaveFocus()
  })

  it('awards the terrain badge after five correct answers in a row', async () => {
    stubApi()
    renderRoute('/terrain/volcano')
    const game = screen.getByRole('region', { name: "Who's that Pokémon?" })
    await within(game).findByRole('group', { name: 'Chọn tên Pokémon' })

    for (let round = 0; round < 5; round += 1) {
      const options = within(game).getByRole('group', { name: 'Chọn tên Pokémon' })
      const buttons = within(options).getAllByRole('button')
      await userEvent.click(buttons[buttons.length - 1]!)
      if (round < 4) {
        await userEvent.click(within(game).getByRole('button', { name: 'Pokémon tiếp theo' }))
      }
    }

    expect(within(game).getByText(/Bạn nhận huy hiệu Núi lửa!/)).toBeInTheDocument()
    const card = screen.getByRole('region', { name: 'Thẻ Trainer' })
    expect(within(card).getByText(/Huy hiệu địa hình/)).toHaveTextContent('1/13')
  })

  it('redirects an unknown terrain to the default one', async () => {
    stubApi()
    const router = renderRoute('/terrain/abc')

    await waitFor(() => expect(router.state.location.pathname).toBe('/terrain'))
    expect(screen.getByRole('heading', { level: 2, name: 'Đồng cỏ' })).toBeInTheDocument()
  })

  it('shows an error with retry when the API is not ready', async () => {
    stubApi(503)
    renderRoute('/terrain/volcano')
    const game = screen.getByRole('region', { name: "Who's that Pokémon?" })

    expect(await within(game).findByRole('button', { name: 'Thử lại' })).toBeInTheDocument()
  })
})
