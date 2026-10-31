import { act, render, screen, within } from '@testing-library/react'
import { createMemoryRouter, Outlet, RouterProvider } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { formatPokemonName } from '../../lib/formatters'
import { Footer } from './Footer'
import { pickFooterPokemon } from './footerPokemon'

function renderFooter(path = '/') {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: (
          <>
            <Outlet />
            <Footer />
          </>
        ),
        children: [
          { index: true, element: <p>Trang chủ</p> },
          { path: 'pokedex', element: <p>Trang Pokédex</p> },
        ],
      },
    ],
    { initialEntries: [path] },
  )
  render(<RouterProvider router={router} />)
  return router
}

function footer() {
  return screen.getByRole('contentinfo')
}

describe('Footer', () => {
  it('links to the owner on Facebook, email and GitHub', () => {
    renderFooter()

    const contact = within(footer()).getByRole('list', { name: 'Liên hệ' })
    const facebook = within(contact).getByRole('link', { name: /Facebook/ })
    expect(facebook).toHaveAttribute('href', 'https://www.facebook.com/nguyen.khanh.76624')
    expect(facebook).toHaveAttribute('target', '_blank')
    expect(facebook).toHaveAttribute('rel', 'noreferrer')
    expect(
      within(contact).getByRole('link', { name: /nguyenqkhanhlc2006@gmail.com/ }),
    ).toHaveAttribute('href', 'mailto:nguyenqkhanhlc2006@gmail.com')
    expect(within(contact).getByRole('link', { name: /GitHub/ })).toHaveAttribute(
      'href',
      'https://github.com/NgQKhanh2906',
    )
  })

  it('lists the five sections of the app', () => {
    renderFooter()

    const nav = within(footer()).getByRole('navigation', { name: 'Điều hướng chân trang' })
    expect(
      within(nav)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href')),
    ).toEqual(['/pokedex', '/types', '/compare', '/team-builder', '/terrain'])
  })

  it('credits PokéAPI and the Pokémon trademark owners', () => {
    renderFooter()

    expect(within(footer()).getByRole('link', { name: 'PokéAPI' })).toHaveAttribute(
      'href',
      'https://pokeapi.co',
    )
    expect(footer()).toHaveTextContent(
      'Pokémon và các tên liên quan thuộc Nintendo, Game Freak và The Pokémon Company.',
    )
    expect(footer()).toHaveTextContent('PokeNexus là dự án phi thương mại.')
    expect(within(footer()).getByRole('link', { name: 'Mã nguồn' })).toHaveAttribute(
      'href',
      'https://github.com/Nha-Cong-Dong/PokeNexus',
    )
  })

  it('shows four random Pokémon that open their detail page', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const expected = pickFooterPokemon(() => 0)

    renderFooter()

    const parade = within(footer()).getByRole('list', { name: 'Pokémon ghé thăm' })
    const links = within(parade).getAllByRole('link')
    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      expected.map((pokemon) => `/pokemon/${pokemon.name}`),
    )
    expect(links[0]).toHaveAccessibleName(`Xem ${formatPokemonName(expected[0]?.name ?? '')}`)
  })

  it('keeps the same Pokémon while moving between pages', async () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0)
    const router = renderFooter()
    const parade = () => within(footer()).getByRole('list', { name: 'Pokémon ghé thăm' })
    const before = within(parade())
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'))

    random.mockReturnValue(0.999)
    await act(() => router.navigate('/pokedex'))

    expect(screen.getByText('Trang Pokédex')).toBeInTheDocument()
    expect(
      within(parade())
        .getAllByRole('link')
        .map((link) => link.getAttribute('href')),
    ).toEqual(before)
  })
})
