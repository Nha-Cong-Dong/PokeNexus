import { describe, expect, it } from 'vitest'

import {
  formatDexNumber,
  formatHeight,
  formatMultiplier,
  formatNumber,
  formatPokemonName,
  formatWeight,
} from './formatters'

describe('formatters', () => {
  it('formats PokéAPI identifiers as display names', () => {
    expect(formatPokemonName('charizard')).toBe('Charizard')
    expect(formatPokemonName('charizard-mega-x')).toBe('Charizard Mega X')
    expect(formatPokemonName('')).toBe('')
  })

  it('pads Pokédex numbers to four digits without truncating larger ids', () => {
    expect(formatDexNumber(6)).toBe('#0006')
    expect(formatDexNumber(10034)).toBe('#10034')
  })

  it('uses Vietnamese thousand separators', () => {
    expect(formatNumber(1083)).toBe('1.083')
  })

  it('converts decimetres and hectograms to metres and kilograms', () => {
    expect(formatHeight(17)).toBe('1,7 m')
    expect(formatWeight(905)).toBe('90,5 kg')
    expect(formatHeight(20)).toBe('2 m')
  })

  it('labels damage multipliers with fractions', () => {
    expect(formatMultiplier(4)).toBe('x4')
    expect(formatMultiplier(0.5)).toBe('x½')
    expect(formatMultiplier(0.25)).toBe('x¼')
    expect(formatMultiplier(0)).toBe('x0')
    expect(formatMultiplier(1.5)).toBe('x1,5')
  })
})
