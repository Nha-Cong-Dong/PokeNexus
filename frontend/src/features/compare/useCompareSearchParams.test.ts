import { describe, expect, it } from 'vitest'

import { otherSide, parsePokemonKey } from './useCompareSearchParams'

describe('parsePokemonKey', () => {
  it('normalizes names and ids from the URL', () => {
    expect(parsePokemonKey(' Garchomp ')).toBe('garchomp')
    expect(parsePokemonKey('445')).toBe('445')
    expect(parsePokemonKey('rotom-wash')).toBe('rotom-wash')
  })

  it('rejects empty, missing and malformed values', () => {
    expect(parsePokemonKey(null)).toBeUndefined()
    expect(parsePokemonKey('')).toBeUndefined()
    expect(parsePokemonKey('mr. mime')).toBeUndefined()
    expect(parsePokemonKey('a'.repeat(61))).toBeUndefined()
  })
})

describe('otherSide', () => {
  it('returns the opposite side', () => {
    expect(otherSide('left')).toBe('right')
    expect(otherSide('right')).toBe('left')
  })
})
