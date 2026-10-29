import { describe, expect, it } from 'vitest'

import type { TypeMatrix } from '../../types/api'
import { axisRole, focusGroups, isCellLit, isFocused, toggleFocus } from './matrixFocus'
import { TYPE_MATRIX_FIXTURE } from './typeMatrixFixture'

describe('matrix focus helpers', () => {
  it('summarises what Fire hits when it attacks', () => {
    expect(focusGroups(TYPE_MATRIX_FIXTURE, { axis: 'attack', type: 'fire' })).toEqual([
      { multiplier: 2, title: 'Gây x2 lên', types: ['grass', 'ice', 'bug', 'steel'] },
      {
        multiplier: 0.5,
        title: 'Bị giảm còn x½ khi đánh',
        types: ['fire', 'water', 'rock', 'dragon'],
      },
      { multiplier: 0, title: 'Không tác dụng lên', types: [] },
    ])
  })

  it('summarises what Ground takes when it defends', () => {
    expect(focusGroups(TYPE_MATRIX_FIXTURE, { axis: 'defense', type: 'ground' })).toEqual([
      { multiplier: 2, title: 'Yếu trước', types: ['water', 'grass', 'ice'] },
      { multiplier: 0.5, title: 'Kháng', types: ['poison', 'rock'] },
      { multiplier: 0, title: 'Miễn nhiễm', types: ['electric'] },
    ])
  })

  it('returns empty groups for an empty matrix', () => {
    const empty: TypeMatrix = { types: [], multipliers: [] }

    expect(
      focusGroups(empty, { axis: 'attack', type: 'fire' }).map((group) => group.types),
    ).toEqual([[], [], []])
  })

  it('toggles the same header off and switches to another header', () => {
    const fireRow = { axis: 'attack', type: 'fire' } as const

    expect(toggleFocus(null, fireRow)).toEqual(fireRow)
    expect(toggleFocus(fireRow, { axis: 'attack', type: 'fire' })).toBeNull()
    expect(toggleFocus(fireRow, { axis: 'defense', type: 'fire' })).toEqual({
      axis: 'defense',
      type: 'fire',
    })
  })

  it('lights only the focused row or column', () => {
    const fireRow = { axis: 'attack', type: 'fire' } as const
    const grassColumn = { axis: 'defense', type: 'grass' } as const

    expect(isCellLit(null, 'water', 'rock')).toBe(true)
    expect(isCellLit(fireRow, 'fire', 'rock')).toBe(true)
    expect(isCellLit(fireRow, 'water', 'fire')).toBe(false)
    expect(isCellLit(grassColumn, 'water', 'grass')).toBe(true)
    expect(isCellLit(grassColumn, 'grass', 'water')).toBe(false)
    expect(isFocused(fireRow, 'attack', 'fire')).toBe(true)
    expect(isFocused(fireRow, 'defense', 'fire')).toBe(false)
    expect(axisRole('attack')).toBe('tấn công')
    expect(axisRole('defense')).toBe('phòng thủ')
  })
})
