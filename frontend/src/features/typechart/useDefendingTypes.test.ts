import { describe, expect, it } from 'vitest'

import { parseDefendingTypes, withDefendingTypes } from './useDefendingTypes'

describe('parseDefendingTypes', () => {
  it('reads up to two defending types from repeated def parameters', () => {
    expect(parseDefendingTypes(new URLSearchParams('def=fire&def=flying'))).toEqual([
      'fire',
      'flying',
    ])
  })

  it('ignores unknown names, duplicates and anything past the second type', () => {
    const params = new URLSearchParams('def=banana&def=FIRE&def=fire&def=&def=flying&def=water')

    expect(parseDefendingTypes(params)).toEqual(['fire', 'flying'])
  })

  it('returns an empty selection when the parameter is missing', () => {
    expect(parseDefendingTypes(new URLSearchParams('foo=bar'))).toEqual([])
  })
})

describe('withDefendingTypes', () => {
  it('replaces the def parameters and keeps unrelated ones', () => {
    const next = withDefendingTypes(new URLSearchParams('def=banana&foo=bar'), ['water', 'ground'])

    expect(next.toString()).toBe('foo=bar&def=water&def=ground')
  })
})
