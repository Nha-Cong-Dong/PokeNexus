import { describe, expect, it, vi } from 'vitest'

import { ApiError } from '../../lib/http'
import type { PokemonRef } from '../../types/api'
import {
  formatShowdownTeam,
  normalizeShowdownName,
  parseShowdown,
  planImport,
  resolveShowdownName,
  toShowdownName,
  type ShowdownLookup,
} from './showdown'

const PASTE = [
  '=== [gen9vgc2025regh] Rain ===',
  '',
  'Rainmaker (Pelipper) (M) @ Damp Rock',
  'Ability: Drizzle',
  'Level: 50',
  'EVs: 252 HP / 4 Def / 252 SpD',
  'Calm Nature',
  '- Hurricane',
  '- Tailwind',
  '',
  'Urshifu-Rapid-Strike @ Mystic Water',
  'Ability: Unseen Fist',
  '- Surging Strikes',
  '',
  'Landorus-Therian (F)',
  '',
  'Indeedee-F @ Psychic Seed  ',
  '',
  'Farfetch’d',
].join('\r\n')

describe('parseShowdown', () => {
  it('reads the species from the first line of each block', () => {
    const parsed = parseShowdown(PASTE)

    expect(parsed.entries).toEqual([
      { line: 3, species: 'Pelipper' },
      { line: 11, species: 'Urshifu-Rapid-Strike' },
      { line: 15, species: 'Landorus-Therian' },
      { line: 17, species: 'Indeedee-F' },
      { line: 19, species: 'Farfetch’d' },
    ])
    expect(parsed.ignoredDetails).toBe(true)
  })

  it('accepts a list of bare names without ignored details', () => {
    expect(parseShowdown('Garchomp\n\nFlutter Mane\n')).toEqual({
      entries: [
        { line: 1, species: 'Garchomp' },
        { line: 3, species: 'Flutter Mane' },
      ],
      ignoredDetails: false,
    })
  })

  it('returns no entries for blank text', () => {
    expect(parseShowdown('  \n\n ')).toEqual({ entries: [], ignoredDetails: false })
  })
})

describe('normalizeShowdownName', () => {
  it.each([
    ['Mr. Mime', 'mr-mime'],
    ['Farfetch’d', 'farfetchd'],
    ['Type: Null', 'type-null'],
    ['Flabébé', 'flabebe'],
    ['Nidoran♀', 'nidoran-f'],
    ['Tapu Koko', 'tapu-koko'],
    ['Zygarde-10%', 'zygarde-10'],
    ['Indeedee-F', 'indeedee-female'],
    ['Necrozma-Dusk-Mane', 'necrozma-dusk'],
    ['Tauros-Paldea-Combat', 'tauros-paldea-combat-breed'],
    ['Ogerpon-Wellspring', 'ogerpon-wellspring-mask'],
  ])('maps %s to %s', (input, expected) => {
    expect(normalizeShowdownName(input)).toBe(expected)
  })
})

function lookup(known: Record<string, PokemonRef>, searchable: PokemonRef[] = []): ShowdownLookup {
  return {
    getPokemon: vi.fn(async (name: string) => {
      const found = known[name]
      if (!found) throw new ApiError(404, 'POKEMON_NOT_FOUND')
      return found
    }),
    searchPokemon: vi.fn(async (query: string) =>
      searchable.filter((pokemon) => pokemon.name.includes(query)),
    ),
  }
}

const LANDORUS = { id: 645, name: 'landorus-incarnate', types: ['ground', 'flying'] } as PokemonRef
const LANDORUS_T = {
  id: 10021,
  name: 'landorus-therian',
  types: ['ground', 'flying'],
} as PokemonRef
const SINISTCHA = { id: 1013, name: 'sinistcha', types: ['grass', 'ghost'] } as PokemonRef

describe('resolveShowdownName', () => {
  it('uses the exact name first', async () => {
    const api = lookup({ 'landorus-therian': LANDORUS_T })

    await expect(resolveShowdownName('Landorus-Therian', api)).resolves.toEqual(LANDORUS_T)
    expect(api.searchPokemon).not.toHaveBeenCalled()
  })

  it('falls back to the first name that starts with the species', async () => {
    const api = lookup({}, [LANDORUS, LANDORUS_T])

    await expect(resolveShowdownName('Landorus', api)).resolves.toEqual(LANDORUS)
  })

  it('drops a cosmetic form suffix that the data does not have', async () => {
    const api = lookup({ sinistcha: SINISTCHA })

    await expect(resolveShowdownName('Sinistcha-Masterpiece', api)).resolves.toEqual(SINISTCHA)
  })

  it('ignores search results that only contain the name in the middle', async () => {
    const api = lookup({}, [{ id: 1, name: 'mega-thing', types: ['normal'] } as PokemonRef])

    await expect(resolveShowdownName('Thing', api)).resolves.toBeNull()
  })

  it('returns null for text that is not a Pokémon name', async () => {
    const api = lookup({})

    await expect(resolveShowdownName('???', api)).resolves.toBeNull()
  })

  it('rethrows errors other than not found', async () => {
    const api: ShowdownLookup = {
      getPokemon: async () => {
        throw new ApiError(503, 'DATA_NOT_READY')
      },
      searchPokemon: async () => [],
    }

    await expect(resolveShowdownName('Garchomp', api)).rejects.toBeInstanceOf(ApiError)
  })
})

describe('toShowdownName', () => {
  it.each([
    [{ name: 'landorus-incarnate', speciesName: 'landorus', formCategory: 'DEFAULT' }, 'Landorus'],
    [
      { name: 'landorus-therian', speciesName: 'landorus', formCategory: 'OTHER' },
      'Landorus-Therian',
    ],
    [{ name: 'indeedee-female', speciesName: 'indeedee', formCategory: 'OTHER' }, 'Indeedee-F'],
    [{ name: 'mr-mime-galar', speciesName: 'mr-mime', formCategory: 'REGIONAL' }, 'Mr. Mime-Galar'],
    [{ name: 'iron-treads', speciesName: 'iron-treads', formCategory: 'DEFAULT' }, 'Iron Treads'],
    [{ name: 'kommo-o', speciesName: 'kommo-o', formCategory: 'DEFAULT' }, 'Kommo-o'],
    [
      { name: 'charizard-mega-x', speciesName: 'charizard', formCategory: 'MEGA' },
      'Charizard-Mega-X',
    ],
  ] as const)('names %o as %s', (pokemon, expected) => {
    expect(toShowdownName(pokemon)).toBe(expected)
  })
})

describe('formatShowdownTeam', () => {
  it('writes one block per Pokémon that Showdown can import back', () => {
    const text = formatShowdownTeam(['Garchomp', 'Indeedee-F', 'Landorus-Therian'])

    expect(text).toBe('Garchomp\n\nIndeedee-F\n\nLandorus-Therian\n')
    expect(parseShowdown(text).entries.map((entry) => entry.species)).toEqual([
      'Garchomp',
      'Indeedee-F',
      'Landorus-Therian',
    ])
  })
})

describe('planImport', () => {
  const ref = (id: number, name: string) => ({ id, name, types: ['normal'] }) as PokemonRef
  const entries = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((line) => ({ line, species: `P${line}` }))

  it('fills 5 slots, puts the 6th Pokémon in slot 6 and reports the rest', () => {
    const plan = planImport(entries, [
      ref(1, 'a'),
      ref(2, 'b'),
      null,
      ref(2, 'b'),
      ref(3, 'c'),
      ref(4, 'd'),
      ref(5, 'e'),
      ref(6, 'f'),
      ref(7, 'g'),
    ])

    expect(plan.ids).toEqual([1, 2, 3, 4, 5])
    expect(plan.sixth).toBe(6)
    expect(plan.members.map((member) => member.id)).toEqual([1, 2, 3, 4, 5, 6])
    expect(plan.unmatched).toEqual([{ line: 3, species: 'P3' }])
    expect(plan.duplicates).toBe(1)
    expect(plan.overflow).toBe(1)
  })

  it('leaves slot 6 empty for a short team', () => {
    const plan = planImport(entries.slice(0, 2), [ref(1, 'a'), ref(2, 'b')])

    expect(plan).toMatchObject({ ids: [1, 2], sixth: null, duplicates: 0, overflow: 0 })
  })
})
