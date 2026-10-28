import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StatBar } from './StatBar'

function renderBar(value: number, max?: number) {
  render(
    <dl>
      <StatBar label="Tốc độ" value={value} max={max} />
    </dl>,
  )
  return screen.getByTestId('stat-bar-fill')
}

describe('StatBar', () => {
  it('shows the label and the number with a bar scaled to 255', () => {
    const fill = renderBar(102)

    expect(screen.getByRole('term')).toHaveTextContent('Tốc độ')
    expect(screen.getAllByRole('definition')[0]).toHaveTextContent('102')
    expect(fill.style.width).toBe('40%')
    expect(fill.parentElement).toHaveAttribute('aria-hidden', 'true')
  })

  it.each([
    [59, 'bg-stat-low'],
    [60, 'bg-stat-mid'],
    [89, 'bg-stat-mid'],
    [90, 'bg-stat-good'],
    [119, 'bg-stat-good'],
    [120, 'bg-stat-high'],
  ])('colours %i with %s', (value, className) => {
    expect(renderBar(value)).toHaveClass(className)
  })

  it('renders the value with tabular text digits instead of the pixel font', () => {
    renderBar(534)
    const value = screen.getAllByRole('definition')[0]

    expect(value).toHaveClass('tabular-nums', 'text-num')
    expect(value).not.toHaveClass('font-pixel')
  })

  it('clamps values above the scale to a full bar', () => {
    expect(renderBar(300).style.width).toBe('100%')
  })

  it('draws no divider when the value is zero', () => {
    const fill = renderBar(0)

    expect(fill.style.width).toBe('0%')
    expect(fill).not.toHaveClass('border-r-2')
  })
})
