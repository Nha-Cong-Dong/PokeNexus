import { describe, expect, it } from 'vitest'

import { TYPE_NAMES } from '../../lib/pokemonTypes'
import type { TypeMatrix, TypeName } from '../../types/api'
import { evaluateQuestion, QUIZ_QUESTIONS } from './quiz'

type Override = [TypeName, TypeName, number]

function matrixWith(overrides: Override[]): TypeMatrix {
  const types = [...TYPE_NAMES]
  const multipliers = types.map(() => types.map(() => 1))
  for (const [attacking, defending, value] of overrides) {
    multipliers[types.indexOf(attacking)]![types.indexOf(defending)] = value
  }
  return { types, multipliers }
}

const MATRIX = matrixWith([
  ['electric', 'water', 2],
  ['electric', 'flying', 2],
  ['ice', 'dragon', 2],
  ['ice', 'ground', 2],
  ['ground', 'flying', 0],
  ['ground', 'steel', 2],
  ['fighting', 'ghost', 0],
  ['fighting', 'poison', 0.5],
  ['poison', 'fighting', 0.5],
  ['poison', 'steel', 0],
])

describe('trainer quiz', () => {
  it('has five questions with three options each', () => {
    expect(QUIZ_QUESTIONS).toHaveLength(5)
    for (const question of QUIZ_QUESTIONS) expect(question.options).toHaveLength(3)
  })

  it('computes every correct answer from the type matrix', () => {
    const answers = QUIZ_QUESTIONS.map((question) => {
      const evaluated = evaluateQuestion(MATRIX, question)
      return evaluated.options[evaluated.correctIndex]
    })
    expect(answers).toEqual(['x4', 'x4', 'Flying', 'x0', 'x0'])
  })

  it('explains a dual-type multiplier step by step', () => {
    expect(evaluateQuestion(MATRIX, QUIZ_QUESTIONS[0]!).explanation).toBe(
      'Electric gây x2 lên Water và x2 lên Flying, nhân lại thành x4.',
    )
  })

  it('explains immunities by naming the immune type', () => {
    expect(evaluateQuestion(MATRIX, QUIZ_QUESTIONS[3]!).explanation).toBe(
      'Ghost miễn nhiễm Fighting, nên Gengar nhận x0.',
    )
    expect(evaluateQuestion(MATRIX, QUIZ_QUESTIONS[2]!).explanation).toBe(
      'Flying nhận x0 từ Ground. Water nhận x1. Steel nhận x2.',
    )
  })

  it('reports no correct option when the matrix disagrees with every choice', () => {
    const neutral = matrixWith([])
    expect(evaluateQuestion(neutral, QUIZ_QUESTIONS[0]!).correctIndex).toBe(0)
    expect(evaluateQuestion(neutral, QUIZ_QUESTIONS[2]!).correctIndex).toBe(-1)
  })
})
