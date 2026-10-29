import { formatPokemonName } from '../../lib/formatters'
import type { PokemonSummary } from '../../types/api'

export const OPTION_COUNT = 4
export const WHOS_THAT_POINTS = 5
export const TERRAIN_BADGE_STREAK = 5

export interface WhosThatRound {
  answer: PokemonSummary
  options: PokemonSummary[]
}

function pickIndex(length: number, random: () => number): number {
  return Math.min(length - 1, Math.floor(random() * length))
}

function distinctByName(pool: readonly PokemonSummary[]): PokemonSummary[] {
  const seen = new Set<string>()
  return pool.filter((pokemon) => {
    const name = formatPokemonName(pokemon.name)
    if (seen.has(name)) return false
    seen.add(name)
    return true
  })
}

export function createRound(
  pool: readonly PokemonSummary[],
  random: () => number,
  previousAnswerId?: number,
): WhosThatRound | undefined {
  const candidates = distinctByName(pool)
  if (candidates.length < OPTION_COUNT) return undefined
  const answerPool =
    candidates.length > OPTION_COUNT
      ? candidates.filter((pokemon) => pokemon.id !== previousAnswerId)
      : candidates
  const answer = answerPool[pickIndex(answerPool.length, random)]!
  const rest = candidates.filter((pokemon) => pokemon.id !== answer.id)
  const options = [answer]
  while (options.length < OPTION_COUNT) {
    options.push(rest.splice(pickIndex(rest.length, random), 1)[0]!)
  }
  for (let index = options.length - 1; index > 0; index -= 1) {
    const swap = pickIndex(index + 1, random)
    ;[options[index], options[swap]] = [options[swap]!, options[index]!]
  }
  return { answer, options }
}
