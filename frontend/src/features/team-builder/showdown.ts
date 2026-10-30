import { ApiError } from '../../lib/http'
import type { FormCategory, PokemonRef } from '../../types/api'

export interface ShowdownEntry {
  line: number
  species: string
}

export interface ParsedShowdown {
  entries: ShowdownEntry[]
  ignoredDetails: boolean
}

export interface ShowdownLookup {
  getPokemon: (name: string) => Promise<PokemonRef>
  searchPokemon: (query: string) => Promise<PokemonRef[]>
}

export interface ShowdownForm {
  name: string
  speciesName: string
  formCategory: FormCategory
}

export interface ImportPlan {
  members: PokemonRef[]
  ids: number[]
  sixth: number | null
  unmatched: ShowdownEntry[]
  duplicates: number
  overflow: number
}

export const SHOWDOWN_TEAM_SIZE = 6

const GENDER_SUFFIX = /\s*\((?:M|F)\)\s*$/
const NICKNAMED = /\(([^()]+)\)\s*$/
const POKEMON_NAME = /^[a-z0-9-]{1,60}$/
const SEARCH_MIN_LENGTH = 2
const SEARCH_MAX_LENGTH = 30

const NAME_PAIRS: readonly (readonly [string, string])[] = [
  ['indeedee-female', 'Indeedee-F'],
  ['meowstic-female', 'Meowstic-F'],
  ['basculegion-female', 'Basculegion-F'],
  ['oinkologne-female', 'Oinkologne-F'],
  ['necrozma-dusk', 'Necrozma-Dusk-Mane'],
  ['necrozma-dawn', 'Necrozma-Dawn-Wings'],
  ['tauros-paldea-combat-breed', 'Tauros-Paldea-Combat'],
  ['tauros-paldea-blaze-breed', 'Tauros-Paldea-Blaze'],
  ['tauros-paldea-aqua-breed', 'Tauros-Paldea-Aqua'],
  ['ogerpon-wellspring-mask', 'Ogerpon-Wellspring'],
  ['ogerpon-hearthflame-mask', 'Ogerpon-Hearthflame'],
  ['ogerpon-cornerstone-mask', 'Ogerpon-Cornerstone'],
  ['darmanitan-galar-standard', 'Darmanitan-Galar'],
  ['zygarde-10', 'Zygarde-10%'],
]

const SPECIES_DISPLAY: Record<string, string> = {
  'mr-mime': 'Mr. Mime',
  'mime-jr': 'Mime Jr.',
  'mr-rime': 'Mr. Rime',
  farfetchd: 'Farfetch’d',
  sirfetchd: 'Sirfetch’d',
  'type-null': 'Type: Null',
  flabebe: 'Flabébé',
  'jangmo-o': 'Jangmo-o',
  'hakamo-o': 'Hakamo-o',
  'kommo-o': 'Kommo-o',
}

const SPACED_SPECIES =
  /^(?:tapu|iron|great|scream|brute|flutter|slither|sandy|roaring|walking|gouging|raging)-/

function slugify(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/♀/g, '-f')
    .replace(/♂/g, '-m')
    .replace(/['’.:%]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const SHOWDOWN_TO_POKEAPI = new Map(
  NAME_PAIRS.map(([pokeApi, showdown]) => [slugify(showdown), pokeApi]),
)
const POKEAPI_TO_SHOWDOWN = new Map(NAME_PAIRS)

function speciesOf(head: string): string {
  const withoutGender = head.replace(GENDER_SUFFIX, '').trim()
  const nicknamed = NICKNAMED.exec(withoutGender)
  return (nicknamed?.[1] ?? withoutGender).trim()
}

export function parseShowdown(text: string): ParsedShowdown {
  const entries: ShowdownEntry[] = []
  let ignoredDetails = false
  let inBlock = false
  text.split(/\r?\n/).forEach((raw, index) => {
    const line = raw.trim()
    if (line === '' || line.startsWith('===')) {
      inBlock = false
      return
    }
    if (inBlock) {
      ignoredDetails = true
      return
    }
    inBlock = true
    const itemAt = line.indexOf('@')
    if (itemAt !== -1) ignoredDetails = true
    const head = itemAt === -1 ? line : line.slice(0, itemAt)
    entries.push({ line: index + 1, species: speciesOf(head) })
  })
  return { entries, ignoredDetails }
}

export function normalizeShowdownName(species: string): string {
  const slug = slugify(species)
  return SHOWDOWN_TO_POKEAPI.get(slug) ?? slug
}

async function findExact(name: string, api: ShowdownLookup): Promise<PokemonRef | null> {
  try {
    return await api.getPokemon(name)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}

async function findByPrefix(name: string, api: ShowdownLookup): Promise<PokemonRef | null> {
  if (name.length < SEARCH_MIN_LENGTH || name.length > SEARCH_MAX_LENGTH) return null
  const results = await api.searchPokemon(name)
  return results.find((pokemon) => pokemon.name.startsWith(name)) ?? null
}

export async function resolveShowdownName(
  species: string,
  api: ShowdownLookup,
): Promise<PokemonRef | null> {
  const name = normalizeShowdownName(species)
  if (!POKEMON_NAME.test(name)) return null
  const found = (await findExact(name, api)) ?? (await findByPrefix(name, api))
  if (found) return found
  let candidate = name
  while (candidate.includes('-')) {
    candidate = candidate.slice(0, candidate.lastIndexOf('-'))
    const shorter = await findExact(candidate, api)
    if (shorter) return shorter
  }
  return null
}

export function planImport(
  entries: readonly ShowdownEntry[],
  refs: readonly (PokemonRef | null)[],
): ImportPlan {
  const unmatched = entries.filter((_, index) => !refs[index])
  const matched = refs.filter((ref): ref is PokemonRef => ref !== null)
  const unique = matched.filter(
    (ref, index) => matched.findIndex((other) => other.id === ref.id) === index,
  )
  const members = unique.slice(0, SHOWDOWN_TEAM_SIZE)
  return {
    members,
    ids: members.slice(0, SHOWDOWN_TEAM_SIZE - 1).map((member) => member.id),
    sixth: members[SHOWDOWN_TEAM_SIZE - 1]?.id ?? null,
    unmatched,
    duplicates: matched.length - unique.length,
    overflow: unique.length - members.length,
  }
}

function titleCase(slug: string, separator = '-'): string {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(separator)
}

function speciesDisplay(speciesName: string): string {
  return (
    SPECIES_DISPLAY[speciesName] ??
    (SPACED_SPECIES.test(speciesName) ? titleCase(speciesName, ' ') : titleCase(speciesName))
  )
}

export function toShowdownName({ name, speciesName, formCategory }: ShowdownForm): string {
  const known = POKEAPI_TO_SHOWDOWN.get(name)
  if (known) return known
  const base = speciesDisplay(speciesName)
  if (formCategory === 'DEFAULT' || name === speciesName) return base
  return name.startsWith(`${speciesName}-`)
    ? `${base}-${titleCase(name.slice(speciesName.length + 1))}`
    : titleCase(name)
}

export function formatShowdownTeam(names: readonly string[]): string {
  return names.map((name) => `${name}\n`).join('\n')
}
