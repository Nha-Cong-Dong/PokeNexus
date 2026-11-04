import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'

import type { PokemonSummary } from '../../../types/api'
import { PokemonList } from './PokemonList'

const POKEMON: PokemonSummary[] = [
  {
    id: 1,
    name: 'bulbasaur',
    types: ['grass', 'poison'],
    generation: 1,
    formCategory: 'DEFAULT',
    baseStatTotal: 318,
    speed: 45,
  },
  {
    id: 4,
    name: 'charmander',
    types: ['fire'],
    generation: 1,
    formCategory: 'DEFAULT',
    baseStatTotal: 309,
    speed: 65,
  },
]

function renderList() {
  render(
    <MemoryRouter>
      <PokemonList pokemon={POKEMON} />
    </MemoryRouter>,
  )
}

describe('PokemonList', () => {
  it('places the type badges on the same grid row as the name for single and dual types', () => {
    renderList()

    const rows = screen.getAllByRole('link')
    expect(rows).toHaveLength(2)
    for (const row of rows) {
      const heading = within(row).getByTestId('dex-row-heading')
      const types = within(row).getByTestId('dex-row-types')
      expect(heading).toHaveClass('col-start-2', 'row-start-1')
      expect(types).toHaveClass('col-start-3', 'row-start-1', 'justify-end')
      expect(row.className).toContain('grid-cols-[auto_minmax(0,1fr)_auto]')
    }
    const [dualType, singleType] = rows
    expect(within(dualType as HTMLElement).getAllByText(/Grass|Poison/)).toHaveLength(2)
    expect(within(singleType as HTMLElement).getByText('Fire')).toBeInTheDocument()
  })

  it('shows the base stat total on the second row', () => {
    renderList()

    const bst = screen.getByText('318').parentElement
    expect(bst).toHaveClass('col-start-2', 'row-start-2')
  })
})
