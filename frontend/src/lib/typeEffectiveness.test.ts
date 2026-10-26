import { describe, expect, it } from 'vitest'

import type { TypeMatrix, TypeName } from '../types/api'
import { attackProfile, multiplierAgainst, singleMultiplier } from './typeEffectiveness'

const TYPES: TypeName[] = ['fire', 'water', 'grass', 'ground', 'flying', 'rock']

const MATRIX: TypeMatrix = {
  types: TYPES,
  multipliers: [
    [0.5, 0.5, 2, 1, 1, 0.5],
    [2, 0.5, 0.5, 2, 1, 2],
    [0.5, 2, 0.5, 2, 0.5, 2],
    [2, 1, 0.5, 1, 0, 2],
    [1, 1, 2, 1, 1, 0.5],
    [2, 1, 1, 0.5, 2, 1],
  ],
}

describe('typeEffectiveness', () => {
  it('reads a single attacking against defending multiplier', () => {
    expect(singleMultiplier(MATRIX, 'water', 'fire')).toBe(2)
    expect(singleMultiplier(MATRIX, 'ground', 'flying')).toBe(0)
  })

  it('treats unknown types as neutral', () => {
    expect(singleMultiplier(MATRIX, 'fire', 'dragon')).toBe(1)
  })

  it('multiplies factors for dual types', () => {
    expect(multiplierAgainst(MATRIX, 'rock', ['fire', 'flying'])).toBe(4)
    expect(multiplierAgainst(MATRIX, 'ground', ['fire', 'flying'])).toBe(0)
    expect(multiplierAgainst(MATRIX, 'water', [])).toBe(1)
  })

  it('groups defending types by effect of one attacking type', () => {
    expect(attackProfile(MATRIX, 'ground')).toEqual({
      superEffective: ['fire', 'rock'],
      notVeryEffective: ['grass'],
      noEffect: ['flying'],
    })
  })
})
