import type { SceneId } from '../../lib/scenes'

export interface LandingRegion {
  scene: SceneId
  pokemonId: number
}

export const LANDING_REGIONS: readonly LandingRegion[] = [
  { scene: 'grassland', pokemonId: 128 },
  { scene: 'forest', pokemonId: 3 },
  { scene: 'sea', pokemonId: 131 },
  { scene: 'volcano', pokemonId: 6 },
  { scene: 'power-plant', pokemonId: 145 },
  { scene: 'snowfield', pokemonId: 144 },
  { scene: 'mountain', pokemonId: 248 },
  { scene: 'desert', pokemonId: 450 },
  { scene: 'swamp', pokemonId: 454 },
  { scene: 'sky', pokemonId: 373 },
  { scene: 'ruins', pokemonId: 65 },
  { scene: 'haunted', pokemonId: 94 },
  { scene: 'flower-garden', pokemonId: 700 },
]

const MS_PER_DAY = 86_400_000

export function dayNumber(date: Date): number {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MS_PER_DAY)
}

export function regionForDate(date: Date): LandingRegion {
  const index = dayNumber(date) % LANDING_REGIONS.length
  return LANDING_REGIONS[index] ?? LANDING_REGIONS[0]!
}

export const SPECIES_COUNT = 1025

export function dailyPokemonId(date: Date): number {
  return ((Math.imul(dayNumber(date), 2654435761) >>> 0) % SPECIES_COUNT) + 1
}
