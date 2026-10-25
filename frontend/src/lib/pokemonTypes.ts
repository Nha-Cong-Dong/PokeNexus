import type { TypeName } from '../types/api'

export const TYPE_NAMES: readonly TypeName[] = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
]

const TYPE_CLASSES: Record<TypeName, string> = {
  normal: 'bg-type-normal text-ink',
  fighting: 'bg-type-fighting text-on-primary',
  flying: 'bg-type-flying text-ink',
  poison: 'bg-type-poison text-on-primary',
  ground: 'bg-type-ground text-ink',
  rock: 'bg-type-rock text-ink',
  bug: 'bg-type-bug text-ink',
  ghost: 'bg-type-ghost text-on-primary',
  steel: 'bg-type-steel text-ink',
  fire: 'bg-type-fire text-ink',
  water: 'bg-type-water text-ink',
  grass: 'bg-type-grass text-ink',
  electric: 'bg-type-electric text-ink',
  psychic: 'bg-type-psychic text-ink',
  ice: 'bg-type-ice text-ink',
  dragon: 'bg-type-dragon text-on-primary',
  dark: 'bg-type-dark text-on-primary',
  fairy: 'bg-type-fairy text-ink',
}

const TYPE_SCOPES: Record<TypeName, string> = {
  normal: '[--type-base:var(--color-type-normal)] [--type-deep:var(--color-type-normal-deep)]',
  fighting:
    '[--type-base:var(--color-type-fighting)] [--type-deep:var(--color-type-fighting-deep)]',
  flying: '[--type-base:var(--color-type-flying)] [--type-deep:var(--color-type-flying-deep)]',
  poison: '[--type-base:var(--color-type-poison)] [--type-deep:var(--color-type-poison-deep)]',
  ground: '[--type-base:var(--color-type-ground)] [--type-deep:var(--color-type-ground-deep)]',
  rock: '[--type-base:var(--color-type-rock)] [--type-deep:var(--color-type-rock-deep)]',
  bug: '[--type-base:var(--color-type-bug)] [--type-deep:var(--color-type-bug-deep)]',
  ghost: '[--type-base:var(--color-type-ghost)] [--type-deep:var(--color-type-ghost-deep)]',
  steel: '[--type-base:var(--color-type-steel)] [--type-deep:var(--color-type-steel-deep)]',
  fire: '[--type-base:var(--color-type-fire)] [--type-deep:var(--color-type-fire-deep)]',
  water: '[--type-base:var(--color-type-water)] [--type-deep:var(--color-type-water-deep)]',
  grass: '[--type-base:var(--color-type-grass)] [--type-deep:var(--color-type-grass-deep)]',
  electric:
    '[--type-base:var(--color-type-electric)] [--type-deep:var(--color-type-electric-deep)]',
  psychic: '[--type-base:var(--color-type-psychic)] [--type-deep:var(--color-type-psychic-deep)]',
  ice: '[--type-base:var(--color-type-ice)] [--type-deep:var(--color-type-ice-deep)]',
  dragon: '[--type-base:var(--color-type-dragon)] [--type-deep:var(--color-type-dragon-deep)]',
  dark: '[--type-base:var(--color-type-dark)] [--type-deep:var(--color-type-dark-deep)]',
  fairy: '[--type-base:var(--color-type-fairy)] [--type-deep:var(--color-type-fairy-deep)]',
}

export function isTypeName(value: string): value is TypeName {
  return (TYPE_NAMES as readonly string[]).includes(value)
}

export function typeClassName(type: TypeName): string {
  return TYPE_CLASSES[type]
}

export function typeScopeClassName(type: TypeName): string {
  return TYPE_SCOPES[type]
}

export function typeLabel(type: TypeName): string {
  return type.charAt(0).toUpperCase() + type.slice(1)
}
