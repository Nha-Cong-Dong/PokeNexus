import { describe, expect, it } from 'vitest'

import { parseDexFilter, toSearchParams } from './useDexSearchParams'

describe('parseDexFilter', () => {
  it('reads types, generation, forms, sort and a one-based page from the URL', () => {
    const filter = parseDexFilter(
      new URLSearchParams('type=dragon&type=ground&gen=4&form=MEGA&sort=speed,desc&page=3'),
    )

    expect(filter).toEqual({
      types: ['dragon', 'ground'],
      gen: 4,
      forms: ['MEGA'],
      sort: 'speed,desc',
      page: 2,
    })
  })

  it('ignores unknown, repeated and out-of-range values', () => {
    const filter = parseDexFilter(
      new URLSearchParams(
        'type=stellar&type=fire&type=fire&type=water&type=grass&gen=10&form=mega&sort=weight&page=-1',
      ),
    )

    expect(filter).toEqual({
      types: ['fire', 'water'],
      gen: undefined,
      forms: [],
      sort: 'id,asc',
      page: 0,
    })
  })
})

describe('toSearchParams', () => {
  it('omits default values so the home URL stays clean', () => {
    expect(toSearchParams(parseDexFilter(new URLSearchParams())).toString()).toBe('')
  })

  it('round-trips a filter through the URL', () => {
    const query = 'type=fire&type=flying&gen=1&form=DEFAULT&form=GMAX&sort=name%2Casc&page=2'

    expect(toSearchParams(parseDexFilter(new URLSearchParams(query))).toString()).toBe(query)
  })
})
