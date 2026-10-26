import { describe, expect, it } from 'vitest'

import { dailyPokemonId, dayNumber, LANDING_REGIONS, regionForDate, SPECIES_COUNT } from './regions'

describe('landing regions', () => {
  it('lists the 13 land scenes once each', () => {
    const scenes = LANDING_REGIONS.map((region) => region.scene)
    expect(scenes).toHaveLength(13)
    expect(new Set(scenes).size).toBe(13)
    expect(scenes).not.toContain('stadium')
    expect(scenes).not.toContain('lab')
  })

  it('counts whole local days regardless of the time of day', () => {
    expect(dayNumber(new Date(2026, 9, 26, 0, 1))).toBe(dayNumber(new Date(2026, 9, 26, 23, 59)))
    expect(dayNumber(new Date(2026, 9, 27))).toBe(dayNumber(new Date(2026, 9, 26)) + 1)
  })

  it('rotates the region by day', () => {
    const today = regionForDate(new Date(2026, 9, 26))
    const tomorrow = regionForDate(new Date(2026, 9, 27))
    expect(today).toEqual(regionForDate(new Date(2026, 9, 26, 18)))
    expect(tomorrow).not.toEqual(today)
  })

  it('picks the same Pokémon all day and stays within the species range', () => {
    const morning = dailyPokemonId(new Date(2026, 9, 26, 7))
    expect(dailyPokemonId(new Date(2026, 9, 26, 22))).toBe(morning)
    for (let offset = 0; offset < 400; offset += 1) {
      const id = dailyPokemonId(new Date(2026, 0, 1 + offset))
      expect(id).toBeGreaterThanOrEqual(1)
      expect(id).toBeLessThanOrEqual(SPECIES_COUNT)
    }
  })

  it('does not repeat the same Pokémon on consecutive days', () => {
    expect(dailyPokemonId(new Date(2026, 9, 26))).not.toBe(dailyPokemonId(new Date(2026, 9, 27)))
  })
})
