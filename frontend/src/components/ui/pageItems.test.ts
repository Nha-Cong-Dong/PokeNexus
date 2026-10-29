import { describe, expect, it } from 'vitest'

import { pageItems } from './pageItems'

describe('pageItems', () => {
  it('lists every page when there are at most 7', () => {
    expect(pageItems(0, 3)).toEqual([0, 1, 2])
    expect(pageItems(6, 7)).toEqual([0, 1, 2, 3, 4, 5, 6])
  })

  it('keeps the first, last and neighbouring pages with gaps in between', () => {
    expect(pageItems(0, 46)).toEqual([0, 1, 2, 'gap', 45])
    expect(pageItems(10, 46)).toEqual([0, 'gap', 9, 10, 11, 'gap', 45])
    expect(pageItems(45, 46)).toEqual([0, 'gap', 43, 44, 45])
  })

  it('does not add a gap between adjacent pages', () => {
    expect(pageItems(2, 46)).toEqual([0, 1, 2, 3, 'gap', 45])
  })

  it('returns nothing when there are no pages', () => {
    expect(pageItems(0, 0)).toEqual([])
  })
})
