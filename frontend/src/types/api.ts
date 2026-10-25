export type TypeName =
  | 'normal'
  | 'fighting'
  | 'flying'
  | 'poison'
  | 'ground'
  | 'rock'
  | 'bug'
  | 'ghost'
  | 'steel'
  | 'fire'
  | 'water'
  | 'grass'
  | 'electric'
  | 'psychic'
  | 'ice'
  | 'dragon'
  | 'dark'
  | 'fairy'

export type FormCategory = 'DEFAULT' | 'REGIONAL' | 'MEGA' | 'GMAX' | 'OTHER'

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface PokemonRef {
  id: number
  name: string
  types: TypeName[]
}

export interface PokemonSummary extends PokemonRef {
  generation: number
  formCategory: FormCategory
  baseStatTotal: number
  speed: number
}

export interface ProblemDetail {
  status: number
  title?: string
  detail?: string
  code?: string
}
