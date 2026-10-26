import { describe, expect, it } from 'vitest'

import type { TypeMatrixRow } from '../../types/api'
import {
  analysisSummary,
  buildTeamMembers,
  formatSavedDate,
  pressureLevel,
  sortRowsByPressure,
  teamNameError,
} from './teamAnalysis'

function row(overrides: Partial<TypeMatrixRow> & Pick<TypeMatrixRow, 'attackingType'>) {
  return {
    multipliers: [1],
    weakCount: 0,
    resistCount: 0,
    pressure: 0,
    criticalHole: false,
    ...overrides,
  }
}

describe('pressureLevel', () => {
  it('maps pressure to the four levels of the design system', () => {
    expect(pressureLevel(0).label).toBe('An toàn')
    expect(pressureLevel(2).label).toBe('Thấp')
    expect(pressureLevel(3).label).toBe('Trung bình')
    expect(pressureLevel(8)).toEqual({ label: 'Cao', className: 'bg-pressure-high text-white' })
  })
})

describe('sortRowsByPressure', () => {
  it('puts critical holes first, then higher pressure, keeping API order on ties', () => {
    const rows = [
      row({ attackingType: 'normal' }),
      row({ attackingType: 'water', pressure: 3, weakCount: 3 }),
      row({ attackingType: 'rock', pressure: 8, weakCount: 5, criticalHole: true }),
      row({ attackingType: 'fire' }),
    ]

    expect(sortRowsByPressure(rows).map((item) => item.attackingType)).toEqual([
      'rock',
      'water',
      'normal',
      'fire',
    ])
  })

  it('returns an empty list for an empty matrix', () => {
    expect(sortRowsByPressure([])).toEqual([])
  })
})

describe('analysisSummary', () => {
  it('names every critical hole', () => {
    expect(
      analysisSummary({
        teamScore: 41,
        typeMatrix: [row({ attackingType: 'rock', criticalHole: true })],
      }),
    ).toBe('Điểm đội 41, có 1 lỗ hổng nghiêm trọng: Rock.')
  })

  it('says when the team has no critical hole', () => {
    expect(analysisSummary({ teamScore: 92, typeMatrix: [row({ attackingType: 'rock' })] })).toBe(
      'Điểm đội 92, không có lỗ hổng nghiêm trọng.',
    )
  })
})

describe('buildTeamMembers', () => {
  it('numbers slots from 1 and appends the sixth member', () => {
    expect(buildTeamMembers([6, 130], 248)).toEqual([
      { slot: 1, pokemonId: 6, nickname: null },
      { slot: 2, pokemonId: 130, nickname: null },
      { slot: 3, pokemonId: 248, nickname: null },
    ])
  })

  it('skips a sixth member that is already in the team', () => {
    expect(buildTeamMembers([6], 6)).toEqual([{ slot: 1, pokemonId: 6, nickname: null }])
    expect(buildTeamMembers([], null)).toEqual([])
  })
})

describe('teamNameError', () => {
  it('accepts 1 to 60 characters after trimming', () => {
    expect(teamNameError(' Rain Team ')).toBeNull()
    expect(teamNameError('a'.repeat(60))).toBeNull()
  })

  it('rejects blank and too long names', () => {
    expect(teamNameError('   ')).toBe('Hãy đặt tên cho đội.')
    expect(teamNameError('a'.repeat(61))).toBe('Tên đội tối đa 60 ký tự.')
  })
})

describe('formatSavedDate', () => {
  it('formats an ISO timestamp as a Vietnamese date and rejects garbage', () => {
    expect(formatSavedDate('2026-11-06T09:30:00Z')).toBe('06/11/2026')
    expect(formatSavedDate('not a date')).toBeNull()
  })
})
