import { describe, expect, it } from 'vitest'

import { GENERATIONS } from '../../features/landing/generations'
import { FOOTER_POKEMON, FOOTER_POKEMON_COUNT, pickFooterPokemon } from './footerPokemon'

describe('FOOTER_POKEMON', () => {
  it('contains the starters of all 9 generations and Pikachu, without duplicates', () => {
    const ids = FOOTER_POKEMON.map((pokemon) => pokemon.id)
    const starterIds = GENERATIONS.flatMap((generation) => generation.starters).map(
      (starter) => starter.id,
    )

    expect(ids).toEqual(expect.arrayContaining([...starterIds, 25]))
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('pickFooterPokemon', () => {
  it('returns four different Pokémon from the pool even when random repeats a value', () => {
    const picked = pickFooterPokemon(() => 0)

    expect(picked).toHaveLength(FOOTER_POKEMON_COUNT)
    expect(new Set(picked.map((pokemon) => pokemon.id)).size).toBe(FOOTER_POKEMON_COUNT)
    picked.forEach((pokemon) => expect(FOOTER_POKEMON).toContainEqual(pokemon))
  })

  it('lets the random source decide which Pokémon appear', () => {
    const low = pickFooterPokemon(() => 0).map((pokemon) => pokemon.id)
    const high = pickFooterPokemon(() => 0.999).map((pokemon) => pokemon.id)

    expect(high).not.toEqual(low)
  })
})
