import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { jsonResponse } from '../../test/renderRoute'
import type { PokemonRef, PokemonSuggestion } from '../../types/api'
import { PokemonSearchBox } from './PokemonSearchBox'

const CHARMANDER: PokemonRef = { id: 4, name: 'charmander', types: ['fire'] }
const CHARMELEON: PokemonRef = { id: 5, name: 'charmeleon', types: ['fire'] }
const CHARIZARD: PokemonRef = { id: 6, name: 'charizard', types: ['fire', 'flying'] }

afterEach(() => {
  vi.unstubAllGlobals()
})

function stubSearch(results: readonly PokemonRef[]) {
  const fetchMock = vi.fn<typeof fetch>(() => Promise.resolve(jsonResponse(results)))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

function renderSearchBox(props: { excludeIds?: readonly number[] } = {}) {
  const onSelect = vi.fn<(pokemon: PokemonRef) => void>()
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={queryClient}>
      <PokemonSearchBox label="Tìm Pokémon" onSelect={onSelect} {...props} />
    </QueryClientProvider>,
  )
  return { onSelect, input: screen.getByRole('combobox', { name: 'Tìm Pokémon' }) }
}

function wait(ms: number) {
  return act(() => new Promise<void>((resolve) => setTimeout(resolve, ms)))
}

describe('PokemonSearchBox', () => {
  it('never sends a query longer than the 30 characters the API accepts', async () => {
    const fetchMock = stubSearch([])
    const { input } = renderSearchBox()

    await userEvent.click(input)
    await userEvent.paste('Chompy (Garchomp) @ Choice Scarf')
    await wait(400)

    expect(input).toHaveValue('Chompy (Garchomp) @ Choice Sca')
    const queries = fetchMock.mock.calls.map(
      ([request]) => new URL(String(request)).searchParams.get('q') ?? '',
    )
    expect(queries.every((query) => query.length <= 30)).toBe(true)
  })

  it('does not select a suggestion from an older query while typing continues', async () => {
    const gastly: PokemonRef = { id: 92, name: 'gastly', types: ['ghost', 'poison'] }
    const garchomp: PokemonRef = { id: 445, name: 'garchomp', types: ['dragon', 'ground'] }
    const fetchMock = vi.fn<typeof fetch>((input) =>
      Promise.resolve(
        jsonResponse(new URL(String(input)).searchParams.get('q') === 'ga' ? [gastly] : [garchomp]),
      ),
    )
    vi.stubGlobal('fetch', fetchMock)
    const { onSelect, input } = renderSearchBox()

    await userEvent.type(input, 'ga')
    expect(await screen.findByRole('option', { name: /Gastly/ })).toBeInTheDocument()
    await userEvent.type(input, 'rchomp{Enter}')

    expect(onSelect).not.toHaveBeenCalled()

    expect(await screen.findByRole('option', { name: /Garchomp/ })).toBeInTheDocument()
    await userEvent.keyboard('{Enter}')
    expect(onSelect).toHaveBeenCalledWith(garchomp)
  })

  it('lists matches with sprite, number and types, then selects the active option on Enter', async () => {
    const fetchMock = stubSearch([CHARMANDER, CHARMELEON, CHARIZARD])
    const { onSelect, input } = renderSearchBox()

    await userEvent.type(input, 'char')

    const options = await screen.findAllByRole('option')
    expect(options).toHaveLength(3)
    expect(options[2]).toHaveTextContent('Charizard')
    expect(options[2]).toHaveTextContent('#0006')
    expect(options[2]).toHaveTextContent('Fire')
    expect(options[2]).toHaveTextContent('Flying')
    expect(options[2]?.querySelector('img')).toHaveAttribute('src', '/sprites/pokemon/6.png')
    expect(input).toHaveAttribute('aria-expanded', 'true')
    expect(input).toHaveAttribute('aria-activedescendant', options[0]?.id)

    await userEvent.keyboard('{ArrowDown}{ArrowDown}')
    expect(input).toHaveAttribute('aria-activedescendant', options[2]?.id)
    expect(options[2]).toHaveAttribute('aria-selected', 'true')

    await userEvent.keyboard('{Enter}')

    expect(onSelect).toHaveBeenCalledWith(CHARIZARD)
    expect(input).toHaveValue('')
    expect(input).toHaveAttribute('aria-expanded', 'false')
    const url = new URL(String(fetchMock.mock.calls.at(-1)?.[0]))
    expect(url.pathname).toBe('/api/v1/pokemon/search')
    expect(url.searchParams.get('q')).toBe('char')
  })

  it('asks for every form and tags Mega, Gmax and other forms beside the number', async () => {
    const results: PokemonSuggestion[] = [
      { id: 6, name: 'charizard', types: ['fire', 'flying'], formCategory: 'DEFAULT' },
      { id: 10034, name: 'charizard-mega-x', types: ['fire', 'dragon'], formCategory: 'MEGA' },
      { id: 10196, name: 'charizard-gmax', types: ['fire', 'flying'], formCategory: 'GMAX' },
      { id: 10091, name: 'rattata-alola', types: ['dark', 'normal'], formCategory: 'REGIONAL' },
    ]
    const fetchMock = stubSearch(results)
    const { onSelect, input } = renderSearchBox()

    await userEvent.type(input, 'chariz')

    const options = await screen.findAllByRole('option')
    expect(options).toHaveLength(4)
    expect(options[0]?.querySelector('[data-testid="search-form-tag"]')).toBeNull()
    expect(options[1]).toHaveTextContent('Mega')
    expect(options[2]).toHaveTextContent('Gmax')
    expect(options[3]).toHaveTextContent('Vùng miền')
    const url = new URL(String(fetchMock.mock.calls.at(-1)?.[0]))
    expect(url.searchParams.getAll('form')).toEqual([
      'DEFAULT',
      'REGIONAL',
      'MEGA',
      'GMAX',
      'OTHER',
    ])

    await userEvent.click(options[1] as HTMLElement)
    expect(onSelect).toHaveBeenCalledWith(results[1])
  })

  it('wraps around with ArrowUp, closes with Escape and selects with a click', async () => {
    stubSearch([CHARMANDER, CHARIZARD])
    const { onSelect, input } = renderSearchBox()

    await userEvent.type(input, 'ch')
    const options = await screen.findAllByRole('option')

    await userEvent.keyboard('{ArrowUp}')
    expect(input).toHaveAttribute('aria-activedescendant', options[1]?.id)

    await userEvent.keyboard('{Escape}')
    expect(input).toHaveAttribute('aria-expanded', 'false')
    expect(input).toHaveValue('ch')

    await userEvent.keyboard('{ArrowDown}')
    await userEvent.click(screen.getByRole('option', { name: /Charmander/ }))
    expect(onSelect).toHaveBeenCalledWith(CHARMANDER)
  })

  it('does not call the API for fewer than 2 characters', async () => {
    const fetchMock = stubSearch([CHARMANDER])
    const { input } = renderSearchBox()

    await userEvent.type(input, 'c')
    await wait(400)

    expect(fetchMock).not.toHaveBeenCalled()
    expect(input).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('option')).toBeNull()
  })

  it('hides excluded Pokémon and says when nothing is left', async () => {
    stubSearch([CHARIZARD])
    const { onSelect, input } = renderSearchBox({ excludeIds: [6] })

    await userEvent.type(input, 'charizard')

    expect(await screen.findByText(/Không tìm thấy/)).toBeInTheDocument()
    expect(screen.queryByRole('option')).toBeNull()
    expect(input).toHaveAttribute('aria-expanded', 'false')
    await userEvent.keyboard('{Enter}')
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('shows a Vietnamese message when the search fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>(() =>
        Promise.resolve(jsonResponse({ status: 503, code: 'DATA_NOT_READY' }, 503)),
      ),
    )
    const { input } = renderSearchBox()

    await userEvent.type(input, 'pika')

    expect(await screen.findByText(/Dữ liệu Pokémon đang được nạp/)).toBeInTheDocument()
  })
})
