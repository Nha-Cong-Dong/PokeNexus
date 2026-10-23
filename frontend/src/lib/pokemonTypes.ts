import type { TypeName } from '../types/api'

export const TYPE_NAMES: readonly TypeName[] = [
  'normal',
  'fighting',
  'flying',
  'poison',
  'ground',
  'rock',
  'bug',
  'ghost',
  'steel',
  'fire',
  'water',
  'grass',
  'electric',
  'psychic',
  'ice',
  'dragon',
  'dark',
  'fairy',
]

const TYPE_CLASSES: Record<TypeName, string> = {
  normal: 'bg-type-normal text-text',
  fighting: 'bg-type-fighting text-on-primary',
  flying: 'bg-type-flying text-text',
  poison: 'bg-type-poison text-on-primary',
  ground: 'bg-type-ground text-text',
  rock: 'bg-type-rock text-text',
  bug: 'bg-type-bug text-text',
  ghost: 'bg-type-ghost text-on-primary',
  steel: 'bg-type-steel text-text',
  fire: 'bg-type-fire text-text',
  water: 'bg-type-water text-text',
  grass: 'bg-type-grass text-text',
  electric: 'bg-type-electric text-text',
  psychic: 'bg-type-psychic text-text',
  ice: 'bg-type-ice text-text',
  dragon: 'bg-type-dragon text-on-primary',
  dark: 'bg-type-dark text-on-primary',
  fairy: 'bg-type-fairy text-text',
}

export function isTypeName(value: string): value is TypeName {
  return (TYPE_NAMES as readonly string[]).includes(value)
}

export function typeClassName(type: TypeName): string {
  return TYPE_CLASSES[type]
}
