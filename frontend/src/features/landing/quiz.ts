import { formatMultiplier } from '../../lib/formatters'
import { typeLabel } from '../../lib/pokemonTypes'
import { multiplierAgainst, singleMultiplier } from '../../lib/typeEffectiveness'
import type { TypeMatrix, TypeName } from '../../types/api'

interface QuizSubject {
  id: number
  name: string
}

interface MultiplierQuestion {
  kind: 'multiplier'
  prompt: string
  subject: QuizSubject
  attacking: TypeName
  defending: TypeName[]
  options: number[]
}

interface ImmunityQuestion {
  kind: 'immunity'
  prompt: string
  subject: QuizSubject
  attacking: TypeName
  options: TypeName[]
}

export type QuizQuestion = MultiplierQuestion | ImmunityQuestion

export interface EvaluatedQuestion {
  prompt: string
  subject: QuizSubject
  options: string[]
  correctIndex: number
  explanation: string
}

export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  {
    kind: 'multiplier',
    prompt: 'Đòn Electric đánh Gyarados (Water/Flying) gây bao nhiêu sát thương?',
    subject: { id: 130, name: 'Gyarados' },
    attacking: 'electric',
    defending: ['water', 'flying'],
    options: [1, 2, 4],
  },
  {
    kind: 'multiplier',
    prompt: 'Garchomp (Dragon/Ground) trúng đòn Ice. Hệ số là bao nhiêu?',
    subject: { id: 445, name: 'Garchomp' },
    attacking: 'ice',
    defending: ['dragon', 'ground'],
    options: [0.5, 2, 4],
  },
  {
    kind: 'immunity',
    prompt: 'Hệ nào miễn nhiễm hoàn toàn đòn Ground?',
    subject: { id: 6, name: 'Charizard' },
    attacking: 'ground',
    options: ['flying', 'water', 'steel'],
  },
  {
    kind: 'multiplier',
    prompt: 'Đòn Fighting đánh Gengar (Ghost/Poison) gây bao nhiêu?',
    subject: { id: 94, name: 'Gengar' },
    attacking: 'fighting',
    defending: ['ghost', 'poison'],
    options: [0, 0.5, 1],
  },
  {
    kind: 'multiplier',
    prompt: 'Lucario (Fighting/Steel) trúng đòn Poison. Kết quả là gì?',
    subject: { id: 448, name: 'Lucario' },
    attacking: 'poison',
    defending: ['fighting', 'steel'],
    options: [0, 0.5, 2],
  },
]

function explainMultiplier(matrix: TypeMatrix, question: MultiplierQuestion): string {
  const attacker = typeLabel(question.attacking)
  const total = multiplierAgainst(matrix, question.attacking, question.defending)
  const immune = question.defending.find(
    (type) => singleMultiplier(matrix, question.attacking, type) === 0,
  )
  if (immune !== undefined) {
    return `${typeLabel(immune)} miễn nhiễm ${attacker}, nên ${question.subject.name} nhận x0.`
  }
  const parts = question.defending.map(
    (type) =>
      `${formatMultiplier(singleMultiplier(matrix, question.attacking, type))} lên ${typeLabel(type)}`,
  )
  if (parts.length === 1) return `${attacker} gây ${parts[0]}.`
  return `${attacker} gây ${parts.join(' và ')}, nhân lại thành ${formatMultiplier(total)}.`
}

function explainImmunity(matrix: TypeMatrix, question: ImmunityQuestion): string {
  const attacker = typeLabel(question.attacking)
  const sentences = question.options.map((type) => {
    const multiplier = singleMultiplier(matrix, question.attacking, type)
    return multiplier === 0
      ? `${typeLabel(type)} nhận x0 từ ${attacker}.`
      : `${typeLabel(type)} nhận ${formatMultiplier(multiplier)}.`
  })
  return sentences.join(' ')
}

export function evaluateQuestion(matrix: TypeMatrix, question: QuizQuestion): EvaluatedQuestion {
  if (question.kind === 'multiplier') {
    const total = multiplierAgainst(matrix, question.attacking, question.defending)
    return {
      prompt: question.prompt,
      subject: question.subject,
      options: question.options.map(formatMultiplier),
      correctIndex: question.options.indexOf(total),
      explanation: explainMultiplier(matrix, question),
    }
  }
  return {
    prompt: question.prompt,
    subject: question.subject,
    options: question.options.map(typeLabel),
    correctIndex: question.options.findIndex(
      (type) => singleMultiplier(matrix, question.attacking, type) === 0,
    ),
    explanation: explainImmunity(matrix, question),
  }
}
