import { describe, expect, it } from 'vitest'

import { STAGGER_MAX_MS, staggerDelay } from './motion'

describe('staggerDelay', () => {
  it('delays each item by a fixed step after a base delay', () => {
    expect(staggerDelay(0)).toEqual({ animationDelay: '0ms' })
    expect(staggerDelay(3, 30)).toEqual({ animationDelay: '90ms' })
    expect(staggerDelay(2, 90, 450)).toEqual({ animationDelay: '630ms' })
  })

  it('caps long lists so the last items do not wait too long', () => {
    expect(staggerDelay(100, 40)).toEqual({ animationDelay: `${STAGGER_MAX_MS}ms` })
    expect(staggerDelay(100, 40, 300)).toEqual({ animationDelay: `${300 + STAGGER_MAX_MS}ms` })
  })
})
