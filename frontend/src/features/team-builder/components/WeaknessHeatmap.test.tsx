import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { analysisFor, SPEC_ROCK_ROW, SPEC_TEAM } from '../testing'
import { WeaknessHeatmap } from './WeaknessHeatmap'

const ANALYSIS = analysisFor(SPEC_TEAM, 41, {
  rock: SPEC_ROCK_ROW,
  electric: {
    multipliers: [2, 4, 2, 2, 1],
    weakCount: 4,
    resistCount: 0,
    pressure: 5,
    criticalHole: true,
  },
  ice: { multipliers: [0.5, 1, 4, 0.5, 0.5], weakCount: 1, resistCount: 3, pressure: 0 },
  water: { multipliers: [2, 0.5, 0.5, 2, 2], weakCount: 3, resistCount: 2, pressure: 1 },
})

function renderHeatmap(compact = false) {
  render(
    <WeaknessHeatmap members={ANALYSIS.members} rows={ANALYSIS.typeMatrix} compact={compact} />,
  )
}

function cardTypes(): string[] {
  const list = screen.getByRole('list', { name: 'Áp lực theo hệ tấn công' })
  return within(list)
    .getAllByRole('list')
    .map((cells) => cells.getAttribute('aria-label') ?? '')
}

describe('WeaknessHeatmap', () => {
  it('shows only pressured types as mobile cards until all 18 are requested', async () => {
    renderHeatmap()

    expect(cardTypes()).toEqual([
      'Hệ Rock đánh vào từng thành viên',
      'Hệ Electric đánh vào từng thành viên',
      'Hệ Water đánh vào từng thành viên',
    ])
    expect(screen.getByText(/^3 hệ đang gây áp lực lên đội/)).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Xem đủ 18 hệ' }))

    expect(cardTypes()).toHaveLength(18)
    await userEvent.click(screen.getByRole('button', { name: 'Chỉ xem hệ gây áp lực' }))
    expect(cardTypes()).toHaveLength(3)
  })

  it('describes each card with the level, member cells and who is weak or resists', () => {
    renderHeatmap()

    const list = screen.getByRole('list', { name: 'Áp lực theo hệ tấn công' })
    const rock = within(list).getAllByRole('listitem')[0]!
    expect(rock).toHaveTextContent('Lỗ hổng nghiêm trọng')
    expect(within(rock).getByText('Cao')).toBeInTheDocument()
    const cells = within(rock).getByRole('list', { name: 'Hệ Rock đánh vào từng thành viên' })
    expect(within(cells).getAllByRole('listitem')[0]).toHaveTextContent('Charizard nhận x4')
    expect(rock).toHaveTextContent(
      'Yếu: Charizard x4, Gyarados x2, Dragonite x2, Talonflame x4, Volcarona x4. Kháng: không ai.',
    )
    const electric = within(list).getByRole('list', {
      name: 'Hệ Electric đánh vào từng thành viên',
    })
    expect(within(electric).getAllByRole('listitem')[4]).toHaveTextContent('Volcarona nhận x1')
  })

  it('leaves x1 cells of the table empty while screen readers still hear x1', () => {
    renderHeatmap()

    const normal = screen.getByRole('row', { name: /^Normal/ })
    const cells = within(normal).getAllByRole('cell').slice(0, SPEC_TEAM.length)
    expect(cells.map((cell) => cell.textContent)).toEqual(['x1', 'x1', 'x1', 'x1', 'x1'])
    for (const cell of cells) {
      expect(within(cell).getByText('x1')).toHaveClass('sr-only')
    }
    expect(screen.getByText(/Ô trống là x1\.$/)).toBeInTheDocument()
    expect(within(screen.getByRole('row', { name: /^Rock/ })).getByText('Cao')).toHaveAttribute(
      'title',
      'Mức hở 8',
    )
  })

  it('keeps all 18 table rows and can filter them to the pressured types', async () => {
    renderHeatmap()

    expect(screen.getAllByRole('row')).toHaveLength(19)
    await userEvent.click(screen.getByRole('checkbox', { name: 'Chỉ hiện 3 hệ đang gây áp lực' }))
    expect(screen.getAllByRole('row')).toHaveLength(4)
  })

  it('shows a compact table of the pressured types without counts or toggles', () => {
    renderHeatmap(true)

    expect(screen.getAllByRole('row').map((row) => row.querySelector('th')?.textContent)).toEqual([
      'Hệ tấn công',
      'RockLỗ hổng nghiêm trọng',
      'ElectricLỗ hổng nghiêm trọng',
      'Water',
    ])
    expect(screen.queryByRole('columnheader', { name: 'Yếu' })).not.toBeInTheDocument()
    expect(screen.queryByRole('columnheader', { name: 'Kháng' })).not.toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Mức hở' })).toBeInTheDocument()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Xem đủ/ })).not.toBeInTheDocument()
    expect(
      screen.getAllByText(/Chỉ hiện 3 hệ có mức hở\. Mở trong Team Builder để xem đủ 18 hệ\./),
    ).toHaveLength(2)
    expect(cardTypes()).toHaveLength(3)
  })

  it('says so when no attacking type puts pressure on the team', () => {
    const calm = analysisFor(SPEC_TEAM, 90)
    render(<WeaknessHeatmap members={calm.members} rows={calm.typeMatrix} compact />)

    expect(
      screen.getAllByText('Không hệ tấn công nào đang gây áp lực cho đội.').length,
    ).toBeGreaterThan(0)
  })
})
