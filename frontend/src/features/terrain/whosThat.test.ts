import { describe, expect, it } from 'vitest'

import { TYPE_NAMES } from '../../lib/pokemonTypes'
import { typesForScene } from '../../lib/scenes'
import type { PokemonSummary } from '../../types/api'
import { mergePools } from './hooks'
import { isTerrainId, TERRAIN_BADGES, TERRAIN_IDS, terrainTypes } from './terrains'
import { createRound, OPTION_COUNT } from './whosThat'

function summary(id: number, name: string): PokemonSummary {
  return {
    id,
    name,
    types: ['fire'],
    generation: 1,
    formCategory: 'DEFAULT',
    baseStatTotal: 300,
    speed: 50,
  }
}

const POOL = [
  summary(4, 'charmander'),
  summary(5, 'charmeleon'),
  summary(6, 'charizard'),
  summary(37, 'vulpix'),
  summary(38, 'ninetales'),
  summary(58, 'growlithe'),
]

function sequence(...values: number[]): () => number {
  let index = 0
  return () => values[index++ % values.length]!
}

describe('terrains', () => {
  it('covers every one of the 18 types exactly once across 13 terrains', () => {
    expect(TERRAIN_IDS).toHaveLength(13)
    const covered = TERRAIN_IDS.flatMap((terrain) => terrainTypes(terrain))
    expect([...covered].sort()).toEqual([...TYPE_NAMES].sort())
    expect(terrainTypes('forest')).toEqual(['grass', 'bug'])
    expect(terrainTypes('sky')).toEqual(['flying', 'dragon'])
    expect(typesForScene('stadium')).toEqual([])
    expect(TERRAIN_BADGES[3]).toEqual({ id: 'terrain:volcano', label: 'Núi lửa' })
  })

  it('accepts only known terrain ids', () => {
    expect(isTerrainId('volcano')).toBe(true)
    expect(isTerrainId('stadium')).toBe(false)
    expect(isTerrainId('abc')).toBe(false)
    expect(isTerrainId(undefined)).toBe(false)
  })

  it('merges type pools without duplicates in id order', () => {
    const merged = mergePools([
      [summary(6, 'charizard'), summary(4, 'charmander')],
      [summary(6, 'charizard'), summary(5, 'charmeleon')],
    ])
    expect(merged.map((pokemon) => pokemon.id)).toEqual([4, 5, 6])
    expect(mergePools([])).toEqual([])
  })
})

describe('whos that pokemon', () => {
  it('builds four distinct options that include the answer', () => {
    for (const seed of [0, 0.2, 0.5, 0.99]) {
      const round = createRound(POOL, sequence(seed, 0.3, 0.7, 0.1))!
      expect(round.options).toHaveLength(OPTION_COUNT)
      expect(new Set(round.options.map((option) => option.id)).size).toBe(OPTION_COUNT)
      expect(round.options).toContainEqual(round.answer)
    }
  })

  it('places the answer last when the random source always returns zero', () => {
    const round = createRound(POOL, () => 0)!
    expect(round.answer.name).toBe('charmander')
    expect(round.options.map((option) => option.name)).toEqual([
      'charmeleon',
      'charizard',
      'vulpix',
      'charmander',
    ])
  })

  it('does not repeat the previous answer when the pool is large enough', () => {
    const round = createRound(POOL, () => 0, 4)!
    expect(round.answer.id).not.toBe(4)
  })

  it('needs at least four Pokémon with different display names', () => {
    expect(createRound(POOL.slice(0, 3), () => 0)).toBeUndefined()
    expect(createRound([], () => 0)).toBeUndefined()
    const duplicates = [...POOL.slice(0, 3), summary(10006, 'charizard')]
    expect(createRound(duplicates, () => 0)).toBeUndefined()
  })
})
