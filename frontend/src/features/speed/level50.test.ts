import { describe, expect, it } from 'vitest'

import type { SpeedTier } from '../../types/api'
import { level50Speed, level50Spread, nearestTiers, rankSpeed } from './level50'

const ref = (id: number, name: string) => ({ id, name, types: [] })

const TIERS: SpeedTier[] = [
  { speed: 200, pokemon: [ref(894, 'regieleki')] },
  { speed: 102, pokemon: [ref(445, 'garchomp')] },
  { speed: 100, pokemon: [ref(6, 'charizard'), ref(373, 'salamence')] },
  { speed: 30, pokemon: [ref(143, 'snorlax')] },
]

describe('level50Speed', () => {
  it('matches the known Garchomp spread at level 50', () => {
    expect(level50Spread(102)).toEqual({ min: 96, neutral: 122, max: 169 })
  })

  it('handles the fastest and slowest base speeds', () => {
    expect(level50Speed(200, 'max')).toBe(277)
    expect(level50Speed(5, 'min')).toBe(9)
  })
})

describe('rankSpeed', () => {
  it('counts slower and tied Pokémon without the Pokémon itself', () => {
    expect(rankSpeed(TIERS, 100, 6)).toEqual({
      slower: 1,
      tied: 1,
      faster: 2,
      total: 4,
      percentSlower: 25,
    })
  })

  it('keeps every Pokémon when the Pokémon is not in the tiers', () => {
    expect(rankSpeed(TIERS, 150, 10001)).toEqual({
      slower: 4,
      tied: 0,
      faster: 1,
      total: 5,
      percentSlower: 80,
    })
  })

  it('never rounds up to 100 percent while someone is as fast', () => {
    const tiers: SpeedTier[] = [
      { speed: 50, pokemon: [ref(1, 'a'), ref(2, 'b')] },
      ...Array.from({ length: 300 }, (_, i) => ({ speed: 10, pokemon: [ref(100 + i, `p${i}`)] })),
    ]
    expect(rankSpeed(tiers, 50, 1).percentSlower).toBe(99)
  })

  it('returns zero percent for empty tiers', () => {
    expect(rankSpeed([], 80).percentSlower).toBe(0)
  })
})

describe('nearestTiers', () => {
  it('finds the closest faster and slower tiers', () => {
    expect(nearestTiers(TIERS, 100)).toEqual({ faster: TIERS[1], slower: TIERS[3] })
  })

  it('has no faster tier at the top and no slower tier at the bottom', () => {
    expect(nearestTiers(TIERS, 200).faster).toBeUndefined()
    expect(nearestTiers(TIERS, 30).slower).toBeUndefined()
  })
})
