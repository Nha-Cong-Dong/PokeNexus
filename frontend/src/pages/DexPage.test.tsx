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

function filterPanel() {
  return within(screen.getByRole('complementary', { name: 'Bộ lọc' }))
}

describe('DexPage', () => {
  it('shows Pokémon cards from the API with sprite, number, types and BST', async () => {
    stubFetch(jsonResponse(pageOf([GARCHOMP, VULPIX_ALOLA])))

    renderRoute('/pokedex')

    const card = await screen.findByRole('link', { name: /Garchomp/ })
    expect(within(card).getByRole('img', { name: 'Garchomp' })).toHaveAttribute(
      'src',
      '/sprites/pokemon/445.png',
    )
    expect(card).toHaveTextContent('#0445')
    expect(card).toHaveTextContent('Dragon')
    expect(card).toHaveTextContent('Ground')
    expect(card).toHaveTextContent('BST 600')
    expect(card).toHaveAttribute('href', '/pokemon/garchomp')
    expect(screen.getByRole('link', { name: /Vulpix Alola/ })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Hiển thị 1–2 trong 2 Pokémon' }),
    ).toBeInTheDocument()
  })

  it('sends filters from the URL to the API and reflects them in the controls', async () => {
    const fetchMock = stubFetch(jsonResponse(pageOf([GARCHOMP])))

    renderRoute('/pokedex?type=dragon&gen=4&minBst=500&minSpeed=100&sort=speed,desc&page=2')

    await screen.findByRole('link', { name: /Garchomp/ })
    const url = requestedUrl(fetchMock)
    expect(url.pathname).toBe('/api/v1/pokemon')
    expect(url.searchParams.getAll('type')).toEqual(['dragon'])
    expect(url.searchParams.get('gen')).toBe('4')
    expect(url.searchParams.get('minBst')).toBe('500')
    expect(url.searchParams.get('maxBst')).toBeNull()
    expect(url.searchParams.get('minSpeed')).toBe('100')
    expect(url.searchParams.get('sort')).toBe('speed,desc')
    expect(url.searchParams.get('page')).toBe('1')

    const panel = filterPanel()
    expect(panel.getByRole('button', { name: 'Dragon' })).toHaveAttribute('aria-pressed', 'true')
    expect(panel.getByRole('button', { name: 'Thế hệ 4' })).toHaveAttribute('aria-pressed', 'true')
    expect(panel.getByLabelText('Từ')).toHaveValue(500)
    expect(panel.getByLabelText('Tốc độ tối thiểu')).toHaveValue(100)
    expect(screen.getByLabelText('Sắp xếp')).toHaveValue('speed,desc')
    expect(
      screen.getByRole('heading', { level: 2, name: '1 Pokémon khớp bộ lọc' }),
    ).toBeInTheDocument()
  })

  it('updates the URL and resets to the first page when a type chip is pressed', async () => {
    const fetchMock = stubFetch(
      jsonResponse(pageOf([GARCHOMP], 3)),
      jsonResponse(pageOf([GARCHOMP])),
    )
    const memoryRouter = renderRoute('/pokedex?page=2')
    await screen.findByRole('link', { name: /Garchomp/ })

    await userEvent.click(filterPanel().getByRole('button', { name: 'Dragon' }))

    expect(memoryRouter.state.location.search).toBe('?type=dragon')
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
    expect(requestedUrl(fetchMock, 1).searchParams.get('page')).toBe('0')
  })

  it('disables the remaining type chips once two types are selected', async () => {
    stubFetch(jsonResponse(pageOf([GARCHOMP])))
    const memoryRouter = renderRoute('/pokedex?type=dragon&type=ground')
    await screen.findByRole('link', { name: /Garchomp/ })

    const panel = filterPanel()
    expect(panel.getByRole('button', { name: 'Fire' })).toBeDisabled()
    await userEvent.click(panel.getByRole('button', { name: 'Ground' }))

    expect(memoryRouter.state.location.search).toBe('?type=dragon')
  })

  it('applies the BST range when the field loses focus and rejects an inverted range', async () => {
    stubFetch(jsonResponse(pageOf([GARCHOMP])))
    const memoryRouter = renderRoute('/pokedex')
    await screen.findByRole('link', { name: /Garchomp/ })
    const panel = filterPanel()

    await userEvent.type(panel.getByLabelText('Từ'), '600')
    await userEvent.tab()
    expect(memoryRouter.state.location.search).toBe('?minBst=600')

    await userEvent.type(panel.getByLabelText('Đến'), '500{Enter}')
    expect(await panel.findByText('Giá trị "Từ" phải nhỏ hơn hoặc bằng "Đến".')).toBeInTheDocument()
    expect(panel.getByLabelText('Đến')).toHaveAttribute('aria-invalid', 'true')
    expect(memoryRouter.state.location.search).toBe('?minBst=600')
  })

  it('switches to the list view without refetching', async () => {
    const fetchMock = stubFetch(jsonResponse(pageOf([GARCHOMP])))
    const memoryRouter = renderRoute('/pokedex')
    await screen.findByRole('link', { name: /Garchomp/ })

    await userEvent.click(screen.getByRole('button', { name: 'Danh sách' }))

    expect(memoryRouter.state.location.search).toBe('?view=list')
    expect(screen.getByRole('button', { name: 'Danh sách' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('link', { name: /Garchomp/ })).toHaveTextContent(/^#0445Garchomp/)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('opens the filter sheet and closes it from the results button', async () => {
    stubFetch(jsonResponse(pageOf([GARCHOMP, VULPIX_ALOLA])))
    renderRoute('/pokedex')
    await screen.findByRole('link', { name: /Garchomp/ })

    await userEvent.click(screen.getByRole('button', { name: 'Bộ lọc' }))

    const sheet = screen.getByRole('dialog', { name: 'Bộ lọc' })
    expect(sheet).toHaveAttribute('open')
    expect(within(sheet).getByRole('button', { name: 'Fire' })).toBeInTheDocument()

    await userEvent.click(within(sheet).getByRole('button', { name: 'Xem 2 kết quả' }))

    expect(sheet).not.toHaveAttribute('open')
  })

  it('explains an empty result and clears the filters from the dialog', async () => {
    stubFetch(jsonResponse(pageOf([])))
    const memoryRouter = renderRoute('/pokedex?type=fairy&gen=1&view=list')

    const title = await screen.findByRole('heading', { name: 'Không có Pokémon nào khớp bộ lọc' })
    const dialog = within(title.parentElement!)
    expect(
      dialog.getByText('Chưa có Pokémon nào hệ Fairy, thuộc Thế hệ 1. Thử bỏ bớt một điều kiện.'),
    ).toBeInTheDocument()

    await userEvent.click(dialog.getByRole('button', { name: 'Xóa bộ lọc' }))

    expect(memoryRouter.state.location.search).toBe('?view=list')
  })

  it('opens the detail page of the Pokémon picked in the search box', async () => {
    const fetchMock = stubFetch(
      jsonResponse(pageOf([GARCHOMP, VULPIX_ALOLA])),
      jsonResponse([{ id: 445, name: 'garchomp', types: ['dragon', 'ground'] }]),
    )
    const memoryRouter = renderRoute('/pokedex?type=dragon')
    await screen.findByRole('link', { name: /Garchomp/ })
    expect(screen.getAllByRole('combobox', { name: 'Tìm Pokémon theo tên' })).toHaveLength(2)

    await userEvent.type(
      filterPanel().getByRole('combobox', { name: 'Tìm Pokémon theo tên' }),
      'garch',
    )
    await screen.findByRole('option', { name: /Garchomp/ })
    expect(requestedUrl(fetchMock, 1).pathname).toBe('/api/v1/pokemon/search')
    expect(requestedUrl(fetchMock, 1).searchParams.get('q')).toBe('garch')

    await userEvent.keyboard('{Enter}')

    expect(memoryRouter.state.location.pathname).toBe('/pokemon/garchomp')
  })

  it('shows a Vietnamese message from the error code instead of the API detail', async () => {
    stubFetch(jsonResponse({ status: 503, detail: 'not loaded', code: 'DATA_NOT_READY' }, 503))

    renderRoute('/pokedex')

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Dữ liệu Pokémon đang được nạp')
    expect(alert).not.toHaveTextContent('not loaded')
    expect(within(alert).getByRole('button', { name: 'Thử lại' })).toBeInTheDocument()
  })
})
