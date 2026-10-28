import { describe, expect, it } from 'vitest'

import { TYPE_NAMES } from '../../lib/pokemonTypes'
import type { PokemonDetail, TypeMatrix, TypeName } from '../../types/api'
import { TYPE_MATRIX_FIXTURE } from '../typechart/typeMatrixFixture'
import {
  detailIdsFor,
  evaluateQuestion,
  QUIZ_BADGES,
  QUIZ_SETS,
  type QuizData,
  type QuizQuestion,
} from './quiz'

function matrixWith(overrides: [TypeName, TypeName, number][]): TypeMatrix {
  const types = [...TYPE_NAMES]
  const multipliers = types.map(() => types.map(() => 1))
  for (const [attacking, defending, value] of overrides) {
    multipliers[types.indexOf(attacking)]![types.indexOf(defending)] = value
  }
  return { types, multipliers }
}

function detail(
  id: number,
  overrides: Partial<Pick<PokemonDetail, 'types' | 'generation' | 'baseStatTotal'>> & {
    speed?: number
  } = {},
): PokemonDetail {
  return {
    id,
    name: `pokemon-${id}`,
    types: overrides.types ?? ['normal'],
    speciesId: id,
    speciesName: `pokemon-${id}`,
    generation: overrides.generation ?? 1,
    formCategory: 'DEFAULT',
    isLegendary: false,
    isMythical: false,
    isFullyEvolved: true,
    stats: {
      hp: 50,
      attack: 50,
      defense: 50,
      specialAttack: 50,
      specialDefense: 50,
      speed: overrides.speed ?? 50,
    },
    baseStatTotal: overrides.baseStatTotal ?? 300,
    heightDm: 10,
    weightHg: 100,
    defense: [],
    forms: [],
  }
}

const REAL: QuizData = { matrix: TYPE_MATRIX_FIXTURE, details: new Map() }

function setById(id: string) {
  return QUIZ_SETS.find((set) => set.id === id)!
}

function question(setId: string, index: number): QuizQuestion {
  return setById(setId).questions[index]!
}

describe('trainer quiz', () => {
  it('has five sets of six questions with three options each and one badge per set', () => {
    expect(QUIZ_SETS.map((set) => set.id)).toEqual([
      'damage',
      'weakness',
      'stats',
      'typing',
      'region',
    ])
    for (const set of QUIZ_SETS) {
      expect(set.questions).toHaveLength(6)
      for (const item of set.questions) expect(item.options).toHaveLength(3)
    }
    expect(QUIZ_BADGES.map((badge) => badge.id)).toEqual([
      'quiz:damage',
      'quiz:weakness',
      'quiz:stats',
      'quiz:typing',
      'quiz:region',
    ])
  })

  it('has exactly one correct option for every type question on the real type chart', () => {
    const typeQuestions = QUIZ_SETS.flatMap((set) => set.questions).filter(
      (item) => detailIdsFor(item).length === 0,
    )
    expect(typeQuestions).toHaveLength(12)
    const answers = typeQuestions.map((item) => {
      const evaluated = evaluateQuestion(item, REAL)!
      expect(evaluated.correctIndex).toBeGreaterThanOrEqual(0)
      return evaluated.options[evaluated.correctIndex]
    })
    expect(answers).toEqual([
      'x4',
      'x4',
      'Flying',
      'x0',
      'x0',
      'x¼',
      'Fighting',
      'Ground',
      'Electric',
      'Dark',
      'Grass',
      'Fairy',
    ])
  })

  it('explains a dual-type multiplier step by step', () => {
    expect(evaluateQuestion(question('damage', 0), REAL)!.explanation).toBe(
      'Electric gây x2 lên Water và x2 lên Flying, nhân lại thành x4.',
    )
    expect(evaluateQuestion(question('damage', 3), REAL)!.explanation).toBe(
      'Ghost miễn nhiễm Fighting, nên Gengar nhận x0.',
    )
    expect(evaluateQuestion(question('weakness', 0), REAL)!.explanation).toBe(
      'Water gây x2, Fighting gây x4, Ground gây x2 lên Tyranitar.',
    )
  })

  it('reports no correct option when the matrix disagrees with every choice', () => {
    const neutral: QuizData = { matrix: matrixWith([]), details: new Map() }
    expect(evaluateQuestion(question('damage', 0), neutral)!.correctIndex).toBe(0)
    expect(evaluateQuestion(question('damage', 2), neutral)!.correctIndex).toBe(-1)
  })

  it('waits for the matrix or the Pokémon details before evaluating', () => {
    const empty: QuizData = { matrix: undefined, details: new Map() }
    expect(evaluateQuestion(question('damage', 0), empty)).toBeUndefined()
    expect(evaluateQuestion(question('stats', 0), REAL)).toBeUndefined()
    expect(detailIdsFor(question('stats', 0))).toEqual([135, 26, 101])
    expect(detailIdsFor(question('typing', 0))).toEqual([130])
  })

  it('picks the highest stat from the API details and refuses ties', () => {
    const speeds: QuizData = {
      matrix: undefined,
      details: new Map([
        [135, detail(135, { speed: 130 })],
        [26, detail(26, { speed: 110 })],
        [101, detail(101, { speed: 150 })],
      ]),
    }
    const evaluated = evaluateQuestion(question('stats', 0), speeds)!
    expect(evaluated.options[evaluated.correctIndex]).toBe('Electrode')
    expect(evaluated.explanation).toBe(
      'Jolteon có Tốc độ 130, Raichu có Tốc độ 110, Electrode có Tốc độ 150.',
    )

    const tie: QuizData = {
      matrix: undefined,
      details: new Map([
        [135, detail(135, { speed: 150 })],
        [26, detail(26, { speed: 110 })],
        [101, detail(101, { speed: 150 })],
      ]),
    }
    expect(evaluateQuestion(question('stats', 0), tie)!.correctIndex).toBe(-1)
  })

  it('checks typing in any order and names the debut region', () => {
    const gyarados: QuizData = {
      matrix: undefined,
      details: new Map([[130, detail(130, { types: ['flying', 'water'] })]]),
    }
    const typing = evaluateQuestion(question('typing', 0), gyarados)!
    expect(typing.options).toEqual(['Water/Dragon', 'Water/Flying', 'Water/Dark'])
    expect(typing.correctIndex).toBe(1)

    const lucario: QuizData = {
      matrix: undefined,
      details: new Map([[448, detail(448, { generation: 4 })]]),
    }
    const region = evaluateQuestion(question('region', 0), lucario)!
    expect(region.options).toEqual(['Sinnoh', 'Unova', 'Kalos'])
    expect(region.correctIndex).toBe(0)
    expect(region.explanation).toBe('Lucario ra mắt ở thế hệ 4, vùng Sinnoh.')
  })
})
