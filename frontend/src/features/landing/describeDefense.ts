import { formatPokemonName } from '../../lib/formatters'
import { typeLabel } from '../../lib/pokemonTypes'
import type { DefenseEntry, PokemonDetail } from '../../types/api'

function listTypes(entries: readonly DefenseEntry[]): string {
  const labels = entries.map((entry) => typeLabel(entry.attackingType))
  if (labels.length <= 1) return labels.join('')
  return `${labels.slice(0, -1).join(', ')} và ${labels[labels.length - 1]}`
}

export function describeDefense(pokemon: Pick<PokemonDetail, 'name' | 'defense'>): string {
  const name = formatPokemonName(pokemon.name)
  const quadruple = pokemon.defense.filter((entry) => entry.multiplier >= 4)
  const double = pokemon.defense.filter((entry) => entry.multiplier > 1 && entry.multiplier < 4)
  const resistCount = pokemon.defense.filter(
    (entry) => entry.multiplier > 0 && entry.multiplier < 1,
  ).length
  const immune = pokemon.defense.filter((entry) => entry.multiplier === 0)

  const weakClauses: string[] = []
  if (quadruple.length > 0) weakClauses.push(`x4 trước ${listTypes(quadruple)}`)
  if (double.length > 0) weakClauses.push(`x2 trước ${listTypes(double)}`)
  const weakPart =
    weakClauses.length > 0
      ? `${name} yếu ${weakClauses.join(', ')}`
      : `${name} không có điểm yếu nào`
  const resistPart = resistCount > 0 ? `kháng ${resistCount} hệ` : 'không kháng hệ nào'
  const immunePart = immune.length > 0 ? ` và miễn nhiễm ${listTypes(immune)}` : ''
  return `${weakPart}, nhưng ${resistPart}${immunePart}.`
}
