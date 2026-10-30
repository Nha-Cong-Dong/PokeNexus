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

export interface Stats {
  hp: number
  attack: number
  defense: number
  specialAttack: number
  specialDefense: number
  speed: number
}

export interface DefenseEntry {
  attackingType: TypeName
  multiplier: number
}

export interface PokemonForm {
  id: number
  name: string
  formCategory: FormCategory
}

export interface PokemonDetail extends PokemonRef {
  speciesId: number
  speciesName: string
  generation: number
  formCategory: FormCategory
  isLegendary: boolean
  isMythical: boolean
  isFullyEvolved: boolean
  stats: Stats
  baseStatTotal: number
  heightDm: number
  weightHg: number
  defense: DefenseEntry[]
  forms: PokemonForm[]
}

export type Winner = 'LEFT' | 'RIGHT' | 'TIE'

export interface CompareResponse {
  left: PokemonDetail
  right: PokemonDetail
  verdict: {
    typeAdvantage: { leftBestMultiplier: number; rightBestMultiplier: number; winner: Winner }
    statTotal: { difference: number; winner: Winner }
    speed: { difference: number; winner: Winner }
    summary: string[]
  }
}

export interface TypeInfo {
  id: number
  name: TypeName
}

export interface TypeMatrix {
  types: TypeName[]
  multipliers: number[][]
}

export interface EvolutionStage {
  speciesId: number
  pokemonId: number
  name: string
  types: TypeName[]
  evolvesFromSpeciesId: number | null
  trigger: string | null
  minLevel: number | null
  item: string | null
}

export interface EvolutionResponse {
  chainId: number
  stages: EvolutionStage[]
}

export interface SpeedTier {
  speed: number
  pokemon: PokemonRef[]
}

export interface TypeMatrixRow {
  attackingType: TypeName
  multipliers: number[]
  weakCount: number
  resistCount: number
  pressure: number
  criticalHole: boolean
}

export interface AnalyzeRequest {
  pokemonIds: number[]
}

export interface AnalyzeResponse {
  members: PokemonRef[]
  teamScore: number
  typeMatrix: TypeMatrixRow[]
  offensiveCoverage: { coveredTypeCount: number; uncoveredTypes: TypeName[] }
  statRadar: Stats
}

export interface RecommendationRequest {
  pokemonIds: number[]
  limit?: number
  excludeLegendary?: boolean
  minBaseStatTotal?: number | null
}

export interface Recommendation extends PokemonRef {
  score: number
  breakdown: { defense: number; offense: number; stats: number }
  baseStatTotal: number
  reasons: string[]
}

export interface RecommendationResponse {
  candidateCount: number
  items: Recommendation[]
}

export interface TeamMemberRequest {
  slot: number
  pokemonId: number
  nickname: string | null
}

export interface CreateTeamRequest {
  name: string
  members: TeamMemberRequest[]
}

export interface TeamMember extends PokemonRef {
  slot: number
  nickname: string | null
}

export interface TeamResponse {
  shareCode: string
  name: string
  synergyScore: number | null
  createdAt: string
  members: TeamMember[]
}

export interface ProblemDetail {
  status: number
  title?: string
  detail?: string
  code?: string
}
