import { describe, expect, it } from 'vitest'

import { TYPE_NAMES } from '../../lib/pokemonTypes'
import type { DefenseEntry, TypeName } from '../../types/api'
import { describeDefense } from './describeDefense'

function defense(overrides: Partial<Record<TypeName, number>>): DefenseEntry[] {
  return TYPE_NAMES.map((type) => ({ attackingType: type, multiplier: overrides[type] ?? 1 }))
}

describe('describeDefense', () => {
  it('summarises weaknesses, resistances and immunities of Lucario', () => {
    const lucario = defense({
      fire: 2,
      fighting: 2,
      ground: 2,
      normal: 0.5,
      grass: 0.5,
      ice: 0.5,
      bug: 0.25,
      rock: 0.25,
      dragon: 0.5,
      dark: 0.25,
      steel: 0.5,
      poison: 0,
    })
    expect(describeDefense({ name: 'lucario', defense: lucario })).toBe(
      'Lucario yếu x2 trước Fire, Fighting và Ground, nhưng kháng 8 hệ và miễn nhiễm Poison.',
    )
  })

  it('names x4 weaknesses before x2 ones', () => {
    const charizard = defense({ rock: 4, water: 2, electric: 2, ground: 0, fire: 0.5 })
    expect(describeDefense({ name: 'charizard', defense: charizard })).toBe(
      'Charizard yếu x4 trước Rock, x2 trước Water và Electric, nhưng kháng 1 hệ và miễn nhiễm Ground.',
    )
  })

  it('handles a Pokémon without weaknesses or resistances', () => {
    expect(describeDefense({ name: 'mr-mime', defense: defense({}) })).toBe(
      'Mr Mime không có điểm yếu nào, nhưng không kháng hệ nào.',
    )
  })
})
