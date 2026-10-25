import { describe, expect, it } from 'vitest'

import {
  countActiveFilters,
  parseDexFilter,
  parseDexView,
  toSearchParams,
} from './useDexSearchParams'

describe('parseDexFilter', () => {
  it('reads types, generation, stat ranges, forms, sort and a one-based page from the URL', () => {
    const filter = parseDexFilter(
      new URLSearchParams(
        'type=dragon&type=ground&gen=4&minBst=500&maxBst=700&minSpeed=100&form=MEGA&sort=speed,desc&page=3',
      ),
    )

    expect(filter).toEqual({
      types: ['dragon', 'ground'],
      gen: 4,
      minBst: 500,
      maxBst: 700,
      minSpeed: 100,
      forms: ['MEGA'],
      sort: 'speed,desc',
      page: 2,
    })
  })

  it('ignores unknown, repeated and out-of-range values', () => {
    const filter = parseDexFilter(
      new URLSearchParams(
        'type=stellar&type=fire&type=fire&type=water&type=grass&gen=10&minBst=-5&maxBst=2000&minSpeed=256&form=mega&sort=weight&page=-1',
      ),
    )

    expect(filter).toEqual({
      types: ['fire', 'water'],
      gen: undefined,
      minBst: undefined,
      maxBst: undefined,
      minSpeed: undefined,
      forms: [],
      sort: 'id,asc',
      page: 0,
    })
  })

  it('drops a BST range whose minimum is above its maximum', () => {
    const filter = parseDexFilter(new URLSearchParams('minBst=600&maxBst=500'))

    expect(filter.minBst).toBeUndefined()
    expect(filter.maxBst).toBeUndefined()
  })

  it('accepts zero as a stat bound', () => {
    expect(parseDexFilter(new URLSearchParams('minBst=0&minSpeed=0'))).toMatchObject({
      minBst: 0,
      minSpeed: 0,
    })
  })
})

describe('parseDexView', () => {
  it('defaults to cards and only accepts list as the alternative', () => {
    expect(parseDexView(new URLSearchParams())).toBe('cards')
    expect(parseDexView(new URLSearchParams('view=list'))).toBe('list')
    expect(parseDexView(new URLSearchParams('view=table'))).toBe('cards')
  })
})

describe('toSearchParams', () => {
  it('omits default values so the home URL stays clean', () => {
    expect(toSearchParams(parseDexFilter(new URLSearchParams())).toString()).toBe('')
  })

  it('round-trips a filter and the view through the URL', () => {
    const query =
      'type=fire&type=flying&gen=1&minBst=400&maxBst=600&minSpeed=90&form=DEFAULT&form=GMAX&sort=name%2Casc&page=2&view=list'
    const params = new URLSearchParams(query)

    expect(toSearchParams(parseDexFilter(params), parseDexView(params)).toString()).toBe(query)
  })
})

describe('countActiveFilters', () => {
  it('counts each type, the generation, the BST range, speed and forms once', () => {
    const filter = parseDexFilter(
      new URLSearchParams(
        'type=fire&type=flying&gen=1&minBst=400&maxBst=600&minSpeed=90&form=MEGA&form=GMAX&sort=name,asc',
      ),
    )

    expect(countActiveFilters(filter)).toBe(6)
    expect(countActiveFilters(parseDexFilter(new URLSearchParams('sort=name,asc')))).toBe(0)
  })
})
