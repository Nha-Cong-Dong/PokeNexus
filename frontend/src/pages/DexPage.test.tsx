import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { jsonResponse, pageOf, renderRoute, stubFetch } from '../test/renderRoute'
import type { PokemonSummary } from '../types/api'

const GARCHOMP: PokemonSummary = {
  id: 445,
  name: 'garchomp',
  types: ['dragon', 'ground'],
  generation: 4,
  formCategory: 'DEFAULT',
  baseStatTotal: 600,
  speed: 102,
}

const VULPIX_ALOLA: PokemonSummary = {
  id: 10103,
  name: 'vulpix-alola',
  types: ['ice'],
  generation: 1,
  formCategory: 'REGIONAL',
  baseStatTotal: 299,
  speed: 65,
}

afterEach(() => {
  vi.unstubAllGlobals()
})

function requestedUrl(fetchMock: ReturnType<typeof stubFetch>, call = 0): URL {
  return new URL(String(fetchMock.mock.calls[call]?.[0]))
}

describe('DexPage', () => {
  it('shows Pokémon cards from the API with sprite, name, types and stats', async () => {
    stubFetch(jsonResponse(pageOf([GARCHOMP, VULPIX_ALOLA])))

    renderRoute('/')

    const card = await screen.findByRole('link', { name: /Garchomp/ })
    expect(within(card).getByRole('img', { name: 'Garchomp' })).toHaveAttribute(
      'src',
      '/sprites/pokemon/445.png',
    )
    expect(card).toHaveTextContent('#0445')
    expect(card).toHaveTextContent('dragon')
    expect(card).toHaveTextContent('BST 600 · Tốc độ 102')
    expect(card).toHaveAttribute('href', '/pokemon/garchomp')
    expect(screen.getByRole('link', { name: /Vulpix Alola/ })).toBeInTheDocument()
    expect(screen.getByText('2 kết quả')).toBeInTheDocument()
  })

  it('sends filters from the URL to the API and keeps them in the form', async () => {
    const fetchMock = stubFetch(jsonResponse(pageOf([GARCHOMP])))

    renderRoute('/?type=dragon&gen=4&sort=speed,desc&page=2')

    await screen.findByRole('link', { name: /Garchomp/ })
    const url = requestedUrl(fetchMock)
    expect(url.pathname).toBe('/api/v1/pokemon')
    expect(url.searchParams.getAll('type')).toEqual(['dragon'])
    expect(url.searchParams.get('gen')).toBe('4')
    expect(url.searchParams.get('sort')).toBe('speed,desc')
    expect(url.searchParams.get('page')).toBe('1')
    expect(screen.getByLabelText('Hệ thứ nhất')).toHaveValue('dragon')
    expect(screen.getByLabelText('Thế hệ')).toHaveValue('4')
  })

  it('updates the URL and resets to the first page when a filter changes', async () => {
    const fetchMock = stubFetch(
      jsonResponse(pageOf([GARCHOMP], 3)),
      jsonResponse(pageOf([GARCHOMP])),
    )
    const memoryRouter = renderRoute('/?page=2')
    await screen.findByRole('link', { name: /Garchomp/ })

    await userEvent.selectOptions(screen.getByLabelText('Hệ thứ nhất'), 'dragon')

    expect(memoryRouter.state.location.search).toBe('?type=dragon')
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
    expect(requestedUrl(fetchMock, 1).searchParams.get('page')).toBe('0')
  })

  it('shows an empty state with a clear button when nothing matches', async () => {
    stubFetch(jsonResponse(pageOf([])))
    const memoryRouter = renderRoute('/?type=fairy&gen=1')

    expect(await screen.findByText('Không có Pokémon khớp bộ lọc.')).toBeInTheDocument()
    const clearButtons = screen.getAllByRole('button', { name: 'Xóa bộ lọc' })
    await userEvent.click(clearButtons[clearButtons.length - 1]!)

    expect(memoryRouter.state.location.search).toBe('')
  })

  it('shows a Vietnamese message from the error code instead of the API detail', async () => {
    stubFetch(jsonResponse({ status: 503, detail: 'not loaded', code: 'DATA_NOT_READY' }, 503))

    renderRoute('/')

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Dữ liệu Pokémon đang được nạp')
    expect(alert).not.toHaveTextContent('not loaded')
    expect(within(alert).getByRole('button', { name: 'Thử lại' })).toBeInTheDocument()
  })
})
