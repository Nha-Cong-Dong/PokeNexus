import { describe, expect, it } from 'vitest'

import { formatDexNumber, formatNumber, formatPokemonName } from './formatters'

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
})
