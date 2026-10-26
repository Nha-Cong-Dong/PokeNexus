import { describe, expect, it } from 'vitest'

import type { EvolutionStage } from '../../types/api'
import { evolutionLevels, evolutionStepLabel } from './evolution'

function stage(
  speciesId: number,
  name: string,
  evolvesFromSpeciesId: number | null,
  extra: Partial<EvolutionStage> = {},
): EvolutionStage {
  return {
    speciesId,
    pokemonId: speciesId,
    name,
    types: ['normal'],
    evolvesFromSpeciesId,
    trigger: evolvesFromSpeciesId === null ? null : 'level-up',
    minLevel: null,
    item: null,
    ...extra,
  }
}

describe('evolutionLevels', () => {
  it('orders a linear chain from the base species', () => {
    const levels = evolutionLevels([
      stage(6, 'charizard', 5),
      stage(4, 'charmander', null),
      stage(5, 'charmeleon', 4),
    ])

    expect(levels.map((level) => level.map((item) => item.name))).toEqual([
      ['charmander'],
      ['charmeleon'],
      ['charizard'],
    ])
  })

  it('puts branching evolutions on the same level', () => {
    const levels = evolutionLevels([
      stage(133, 'eevee', null),
      stage(134, 'vaporeon', 133, { trigger: 'use-item' }),
      stage(135, 'jolteon', 133, { trigger: 'use-item' }),
    ])

    expect(levels).toHaveLength(2)
    expect(levels[1]?.map((item) => item.name)).toEqual(['vaporeon', 'jolteon'])
  })

  it('stops on a parent outside the chain or a cycle instead of looping', () => {
    expect(evolutionLevels([stage(2, 'ivysaur', 1)])).toHaveLength(1)
    const cyclic = evolutionLevels([stage(1, 'a', 2), stage(2, 'b', 1)])
    expect(cyclic.flat()).toHaveLength(2)
  })

  it('returns no levels for an empty chain', () => {
    expect(evolutionLevels([])).toEqual([])
  })
})

describe('evolutionStepLabel', () => {
  it('describes how a stage is reached', () => {
    expect(evolutionStepLabel(stage(5, 'charmeleon', 4, { minLevel: 16 }))).toBe('Lv 16')
    expect(evolutionStepLabel(stage(68, 'machamp', 67, { trigger: 'trade' }))).toBe('Trao đổi')
    expect(evolutionStepLabel(stage(134, 'vaporeon', 133, { item: 'water-stone' }))).toBe(
      'Dùng Water Stone',
    )
    expect(evolutionStepLabel(stage(999, 'x', 998, { trigger: 'spin' }))).toBe('Điều kiện đặc biệt')
  })

  it('has no label for the base species', () => {
    expect(evolutionStepLabel(stage(4, 'charmander', null))).toBeNull()
  })
})
