import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import type { Stats } from '../../types/api'
import { StatRadar } from './StatRadar'

const GARCHOMP: Stats = {
  hp: 108,
  attack: 130,
  defense: 95,
  specialAttack: 80,
  specialDefense: 85,
  speed: 102,
}

const SALAMENCE: Stats = {
  hp: 95,
  attack: 135,
  defense: 80,
  specialAttack: 110,
  specialDefense: 80,
  speed: 100,
}

const ZERO: Stats = {
  hp: 0,
  attack: 0,
  defense: 0,
  specialAttack: 0,
  specialDefense: 0,
  speed: 0,
}

function pointsOf(polygon: Element | undefined): string[] {
  return (polygon?.getAttribute('points') ?? '').split(' ')
}

describe('StatRadar', () => {
  it('overlays one polygon per series with token colors, axis labels and an aria-label with the values', () => {
    const { container } = render(
      <StatRadar
        title="Chỉ số của Garchomp và Salamence"
        series={[
          { label: 'Garchomp', stats: GARCHOMP, tone: 'primary' },
          { label: 'Salamence', stats: SALAMENCE, tone: 'accent' },
        ]}
      />,
    )

    const chart = screen.getByRole('img', {
      name: 'Chỉ số của Garchomp và Salamence. Garchomp: HP 108, Tấn công 130, Phòng thủ 95, Tấn công đặc biệt 80, Phòng thủ đặc biệt 85, Tốc độ 102. Salamence: HP 95, Tấn công 135, Phòng thủ 80, Tấn công đặc biệt 110, Phòng thủ đặc biệt 80, Tốc độ 100.',
    })
    const polygons = container.querySelectorAll('polygon')
    expect(polygons).toHaveLength(2)
    expect(polygons[0]).toHaveClass('stroke-primary', 'fill-primary/25')
    expect(polygons[1]).toHaveClass('stroke-accent', 'fill-accent/25')
    expect(pointsOf(polygons[0])).toHaveLength(6)
    expect(chart).toHaveTextContent('HP')
    expect(chart).toHaveTextContent('Tấn côngđặc biệt')
    expect(chart).toHaveTextContent('Tốc độ')
    expect(screen.getByRole('list')).toHaveTextContent('GarchompSalamence')
  })

  it('uses lighter fills and moves the legend above the chart on mobile when asked', () => {
    const { container } = render(
      <StatRadar
        title="So sánh"
        fill="light"
        legendAboveOnMobile
        series={[
          { label: 'Garchomp', stats: GARCHOMP, tone: 'primary' },
          { label: 'Salamence', stats: SALAMENCE, tone: 'accent' },
        ]}
      />,
    )

    const [left, right] = Array.from(container.querySelectorAll('polygon'))
    expect(left).toHaveClass('stroke-primary', 'fill-primary/16')
    expect(right).toHaveClass('stroke-accent', 'fill-accent/12')
    expect(screen.getByRole('list')).toHaveClass('max-md:order-first')
  })

  it('keeps the default fills and the legend below the chart', () => {
    const { container } = render(
      <StatRadar
        title="Đội"
        series={[{ label: 'Trung bình đội', stats: GARCHOMP, tone: 'primary' }]}
      />,
    )

    expect(container.querySelector('polygon')).toHaveClass('fill-primary/25')
    expect(screen.getByRole('list')).not.toHaveClass('max-md:order-first')
  })

  it('clamps values to the scale and keeps zero stats at the center', () => {
    const { container } = render(
      <StatRadar
        title="Biên"
        max={100}
        series={[
          { label: 'Quá lớn', stats: { ...ZERO, hp: 400 }, tone: 'primary' },
          { label: 'Bằng 0', stats: ZERO, tone: 'accent' },
        ]}
      />,
    )

    const [over, zero] = Array.from(container.querySelectorAll('polygon'))
    expect(pointsOf(over)[0]).toBe('210,66')
    expect(new Set(pointsOf(zero))).toEqual(new Set(['210,186']))
  })
})
