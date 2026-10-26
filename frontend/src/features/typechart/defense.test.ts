import { describe, expect, it } from 'vitest'

import type { TypeMatrix } from '../../types/api'
import {
  defendingEntries,
  defenseSummary,
  groupByMultiplier,
  matrixTypes,
  type MultiplierEntry,
} from './defense'
import { TYPE_MATRIX_FIXTURE } from './typeMatrixFixture'

describe('defense helpers', () => {
  it('lists matrix types in the display order of the app', () => {
    const types = matrixTypes(TYPE_MATRIX_FIXTURE)

    expect(types).toHaveLength(18)
    expect(types.slice(0, 4)).toEqual(['normal', 'fire', 'water', 'electric'])
  })

  it('groups the 18 attacking types against Fire/Flying from x4 down to x0', () => {
    const entries = defendingEntries(TYPE_MATRIX_FIXTURE, ['fire', 'flying'])

    expect(groupByMultiplier(entries)).toEqual([
      { multiplier: 4, types: ['rock'] },
      { multiplier: 2, types: ['water', 'electric'] },
      { multiplier: 0.5, types: ['fire', 'fighting', 'steel', 'fairy'] },
      { multiplier: 0.25, types: ['grass', 'bug'] },
      { multiplier: 0, types: ['ground'] },
    ])
    expect(entries.filter((entry) => entry.multiplier === 1)).toHaveLength(8)
  })

  it('treats an empty selection as neutral to everything', () => {
    const entries = defendingEntries(TYPE_MATRIX_FIXTURE, [])

    expect(groupByMultiplier(entries)).toEqual([])
    expect(defenseSummary('Hệ này', entries)).toBe(
      'Hệ này không yếu trước hệ nào. Không kháng hệ nào.',
    )
  })

  it('returns no entries for an empty matrix', () => {
    const empty: TypeMatrix = { types: [], multipliers: [] }

    expect(defendingEntries(empty, ['fire'])).toEqual([])
  })

  it('summarises weaknesses, resistances and immunities in one sentence', () => {
    const entries = defendingEntries(TYPE_MATRIX_FIXTURE, ['fire', 'flying'])

    expect(defenseSummary('Charizard', entries)).toBe(
      'Charizard yếu trước 3 hệ, nặng nhất là Rock x4. Kháng 6 hệ và miễn nhiễm Ground.',
    )
  })

  it('names every weakness when they share the same multiplier', () => {
    const entries: MultiplierEntry[] = [
      { type: 'fighting', multiplier: 2 },
      { type: 'ghost', multiplier: 0 },
      { type: 'fire', multiplier: 1 },
    ]

    expect(defenseSummary('Normal', entries)).toBe(
      'Normal yếu trước Fighting x2. Không kháng hệ nào nhưng miễn nhiễm Ghost.',
    )
  })
})
