import { describe, expect, it } from 'vitest'

import type { Stats } from '../../types/api'
import { percentOf, statScale, totalScale } from './scale'

const BASE: Stats = {
  hp: 108,
  attack: 130,
  defense: 95,
  specialAttack: 80,
  specialDefense: 85,
  speed: 102,
}

describe('statScale', () => {
  it('rounds the highest stat up to a step of 50 with a floor of 150', () => {
    expect(statScale(BASE)).toBe(150)
    expect(statScale(BASE, { ...BASE, attack: 160 })).toBe(200)
  })

  it('never goes above 255', () => {
    expect(statScale({ ...BASE, hp: 255 })).toBe(255)
  })
})

describe('totalScale and percentOf', () => {
  it('keeps totals on a 720 scale unless a total is larger', () => {
    expect(totalScale(600, 600)).toBe(720)
    expect(totalScale(780, 500)).toBe(780)
  })

  it('clamps the percentage between 0 and 100', () => {
    expect(percentOf(75, 150)).toBe(50)
    expect(percentOf(300, 150)).toBe(100)
    expect(percentOf(10, 0)).toBe(0)
  })
})
