import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { renderRoute, stubFetch } from '../test/renderRoute'

const renderAt = renderRoute

beforeEach(() => {
  stubFetch()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('app routes', () => {
  it('renders the layout with header navigation and footer on the Pokédex page', () => {
    renderAt('/pokedex')

    const nav = screen.getByRole('navigation', { name: 'Điều hướng chính' })
    const links = within(nav).getAllByRole('link')
    expect(links.map((link) => link.textContent)).toEqual([
      'Pokédex',
      'Tương khắc',
      'So sánh',
      'Xây đội',
    ])
    expect(within(nav).getByRole('link', { name: 'Pokédex' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('heading', { level: 1, name: 'Pokédex' })).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toHaveTextContent('PokéAPI')
  })

  it.each([
    ['/types', 'Bảng tương khắc'],
    ['/compare', 'Bàn Cân Sức Mạnh'],
    ['/team-builder', 'Xây đội'],
    ['/pokemon/charizard', 'Chi tiết Pokémon'],
    ['/team/Ab3dEf7h', 'Đội được chia sẻ'],
  ])('renders %s with heading "%s"', (path, heading) => {
    renderAt(path)

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument()
  })

  it('passes the route parameter to the detail page', async () => {
    const fetchMock = stubFetch()
    renderAt('/pokemon/rotom-wash')

    await waitFor(() =>
      expect(
        fetchMock.mock.calls.some(([input]) =>
          String(input).endsWith('/api/v1/pokemon/rotom-wash'),
        ),
      ).toBe(true),
    )
  })

  it('shows the not found page with a link home for unknown routes', async () => {
    const memoryRouter = renderAt('/abc-xyz/does-not-exist')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Không tìm thấy trang' }),
    ).toBeInTheDocument()

    await userEvent.click(screen.getByRole('link', { name: 'Về Pokédex' }))
    expect(memoryRouter.state.location.pathname).toBe('/pokedex')
  })
})
