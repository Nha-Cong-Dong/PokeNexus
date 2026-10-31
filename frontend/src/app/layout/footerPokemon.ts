import { GENERATIONS } from '../../features/landing/generations'

export type FooterPokemon = {
  id: number
  name: string
}

export const FOOTER_POKEMON_COUNT = 4

const FAN_FAVOURITES: readonly FooterPokemon[] = [
  { id: 25, name: 'pikachu' },
  { id: 39, name: 'jigglypuff' },
  { id: 54, name: 'psyduck' },
  { id: 94, name: 'gengar' },
  { id: 133, name: 'eevee' },
  { id: 143, name: 'snorlax' },
  { id: 175, name: 'togepi' },
  { id: 448, name: 'lucario' },
  { id: 700, name: 'sylveon' },
]

export const FOOTER_POKEMON: readonly FooterPokemon[] = [
  ...FAN_FAVOURITES,
  ...GENERATIONS.flatMap((generation) => generation.starters),
]

export function pickFooterPokemon(random: () => number = Math.random): FooterPokemon[] {
  const pool = [...FOOTER_POKEMON]
  const picked: FooterPokemon[] = []
  while (picked.length < FOOTER_POKEMON_COUNT && pool.length > 0) {
    const index = Math.min(Math.floor(random() * pool.length), pool.length - 1)
    picked.push(...pool.splice(index, 1))
  }
  return picked
}
