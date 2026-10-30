import { STAT_AXES } from '../../components/pokemon/statAxes'
import { formatMultiplier } from '../../lib/formatters'
import { typeLabel } from '../../lib/pokemonTypes'
import { multiplierAgainst, singleMultiplier } from '../../lib/typeEffectiveness'
import type { PokemonDetail, Stats, TypeMatrix, TypeName } from '../../types/api'
import type { Badge } from '../trainer/progress'
import { GENERATIONS } from './generations'

export interface QuizPokemon {
  id: number
  name: string
}

export interface QuizSubject extends QuizPokemon {
  type: TypeName
}

export type QuizStat = keyof Stats | 'baseStatTotal'

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

interface AttackerQuestion {
  kind: 'attacker'
  prompt: string
  subject: QuizSubject
  defending: TypeName[]
  target: number
  options: TypeName[]
}

interface StatQuestion {
  kind: 'stat'
  prompt: string
  subject: QuizSubject
  stat: QuizStat
  options: QuizPokemon[]
}

interface TypingQuestion {
  kind: 'typing'
  prompt: string
  subject: QuizSubject
  options: TypeName[][]
}

interface RegionQuestion {
  kind: 'region'
  prompt: string
  subject: QuizSubject
  options: number[]
}

export type QuizQuestion =
  | MultiplierQuestion
  | ImmunityQuestion
  | AttackerQuestion
  | StatQuestion
  | TypingQuestion
  | RegionQuestion

export interface QuizSet {
  id: string
  title: string
  badge: string
  questions: readonly QuizQuestion[]
}

export interface QuizData {
  matrix: TypeMatrix | undefined
  details: ReadonlyMap<number, PokemonDetail>
}

export interface EvaluatedQuestion {
  prompt: string
  subject: QuizSubject
  options: string[]
  correctIndex: number
  explanation: string
}

export const BADGE_MIN_CORRECT = 5

const GYARADOS: QuizSubject = { id: 130, name: 'Gyarados', type: 'water' }
const GARCHOMP: QuizSubject = { id: 445, name: 'Garchomp', type: 'dragon' }
const GENGAR: QuizSubject = { id: 94, name: 'Gengar', type: 'ghost' }
const LUCARIO: QuizSubject = { id: 448, name: 'Lucario', type: 'fighting' }

export const QUIZ_SETS: readonly QuizSet[] = [
  {
    id: 'damage',
    title: 'Hệ số sát thương',
    badge: 'Huy hiệu Sát thương',
    questions: [
      {
        kind: 'multiplier',
        prompt: 'Đòn Electric đánh Gyarados (Water/Flying) gây bao nhiêu sát thương?',
        subject: GYARADOS,
        attacking: 'electric',
        defending: ['water', 'flying'],
        options: [1, 2, 4],
      },
      {
        kind: 'multiplier',
        prompt: 'Garchomp (Dragon/Ground) trúng đòn Ice. Hệ số là bao nhiêu?',
        subject: GARCHOMP,
        attacking: 'ice',
        defending: ['dragon', 'ground'],
        options: [0.5, 2, 4],
      },
      {
        kind: 'immunity',
        prompt: 'Hệ nào miễn nhiễm hoàn toàn đòn Ground?',
        subject: { id: 6, name: 'Charizard', type: 'fire' },
        attacking: 'ground',
        options: ['flying', 'water', 'steel'],
      },
      {
        kind: 'multiplier',
        prompt: 'Đòn Fighting đánh Gengar (Ghost/Poison) gây bao nhiêu?',
        subject: GENGAR,
        attacking: 'fighting',
        defending: ['ghost', 'poison'],
        options: [0, 0.5, 1],
      },
      {
        kind: 'multiplier',
        prompt: 'Lucario (Fighting/Steel) trúng đòn Poison. Kết quả là gì?',
        subject: LUCARIO,
        attacking: 'poison',
        defending: ['fighting', 'steel'],
        options: [0, 0.5, 2],
      },
      {
        kind: 'multiplier',
        prompt: 'Đòn Water đánh Ludicolo (Water/Grass) gây bao nhiêu?',
        subject: { id: 272, name: 'Ludicolo', type: 'water' },
        attacking: 'water',
        defending: ['water', 'grass'],
        options: [0.25, 0.5, 2],
      },
    ],
  },
  {
    id: 'weakness',
    title: 'Điểm yếu và miễn nhiễm',
    badge: 'Huy hiệu Phòng thủ',
    questions: [
      {
        kind: 'attacker',
        prompt: 'Đòn hệ nào gây x4 lên Tyranitar (Rock/Dark)?',
        subject: { id: 248, name: 'Tyranitar', type: 'rock' },
        defending: ['rock', 'dark'],
        target: 4,
        options: ['water', 'fighting', 'ground'],
      },
      {
        kind: 'immunity',
        prompt: 'Hệ nào miễn nhiễm hoàn toàn đòn Electric?',
        subject: GARCHOMP,
        attacking: 'electric',
        options: ['grass', 'dragon', 'ground'],
      },
      {
        kind: 'attacker',
        prompt: 'Gyarados (Water/Flying) chịu x4 từ đòn hệ nào?',
        subject: GYARADOS,
        defending: ['water', 'flying'],
        target: 4,
        options: ['electric', 'rock', 'grass'],
      },
      {
        kind: 'immunity',
        prompt: 'Hệ nào miễn nhiễm hoàn toàn đòn Psychic?',
        subject: { id: 197, name: 'Umbreon', type: 'dark' },
        attacking: 'psychic',
        options: ['steel', 'psychic', 'dark'],
      },
      {
        kind: 'attacker',
        prompt: 'Đòn hệ nào chỉ gây x¼ lên Scizor (Bug/Steel)?',
        subject: { id: 212, name: 'Scizor', type: 'bug' },
        defending: ['bug', 'steel'],
        target: 0.25,
        options: ['fire', 'grass', 'poison'],
      },
      {
        kind: 'immunity',
        prompt: 'Hệ nào miễn nhiễm hoàn toàn đòn Dragon?',
        subject: { id: 700, name: 'Sylveon', type: 'fairy' },
        attacking: 'dragon',
        options: ['fairy', 'steel', 'ice'],
      },
    ],
  },
  {
    id: 'stats',
    title: 'Chỉ số gốc',
    badge: 'Huy hiệu Sức mạnh',
    questions: [
      {
        kind: 'stat',
        prompt: 'Ai có Tốc độ gốc cao nhất?',
        subject: { id: 135, name: 'Jolteon', type: 'electric' },
        stat: 'speed',
        options: [
          { id: 135, name: 'Jolteon' },
          { id: 26, name: 'Raichu' },
          { id: 101, name: 'Electrode' },
        ],
      },
      {
        kind: 'stat',
        prompt: 'Ai có tổng chỉ số gốc (BST) cao nhất?',
        subject: LUCARIO,
        stat: 'baseStatTotal',
        options: [LUCARIO, GARCHOMP, GENGAR],
      },
      {
        kind: 'stat',
        prompt: 'Ai có Tấn công gốc cao nhất?',
        subject: { id: 68, name: 'Machamp', type: 'fighting' },
        stat: 'attack',
        options: [{ id: 68, name: 'Machamp' }, GARCHOMP, { id: 409, name: 'Rampardos' }],
      },
      {
        kind: 'stat',
        prompt: 'Ai có HP gốc cao nhất?',
        subject: { id: 143, name: 'Snorlax', type: 'normal' },
        stat: 'hp',
        options: [
          { id: 143, name: 'Snorlax' },
          { id: 242, name: 'Blissey' },
          { id: 321, name: 'Wailord' },
        ],
      },
      {
        kind: 'stat',
        prompt: 'Ai có Phòng thủ gốc cao nhất?',
        subject: { id: 208, name: 'Steelix', type: 'steel' },
        stat: 'defense',
        options: [
          { id: 208, name: 'Steelix' },
          { id: 306, name: 'Aggron' },
          { id: 213, name: 'Shuckle' },
        ],
      },
      {
        kind: 'stat',
        prompt: 'Ai có Tấn công đặc biệt gốc cao nhất?',
        subject: GENGAR,
        stat: 'specialAttack',
        options: [GENGAR, { id: 65, name: 'Alakazam' }, { id: 196, name: 'Espeon' }],
      },
    ],
  },
  {
    id: 'typing',
    title: 'Hệ của Pokémon',
    badge: 'Huy hiệu Nhận diện',
    questions: [
      {
        kind: 'typing',
        prompt: 'Gyarados mang hệ nào?',
        subject: GYARADOS,
        options: [
          ['water', 'dragon'],
          ['water', 'flying'],
          ['water', 'dark'],
        ],
      },
      {
        kind: 'typing',
        prompt: 'Togekiss mang hệ nào?',
        subject: { id: 468, name: 'Togekiss', type: 'fairy' },
        options: [['normal', 'flying'], ['fairy'], ['fairy', 'flying']],
      },
      {
        kind: 'typing',
        prompt: 'Mawile mang hệ nào?',
        subject: { id: 303, name: 'Mawile', type: 'steel' },
        options: [['steel', 'fairy'], ['steel'], ['dark', 'fairy']],
      },
      {
        kind: 'typing',
        prompt: 'Azumarill mang hệ nào?',
        subject: { id: 184, name: 'Azumarill', type: 'water' },
        options: [['water'], ['water', 'fairy'], ['water', 'normal']],
      },
      {
        kind: 'typing',
        prompt: 'Dragonite mang hệ nào?',
        subject: { id: 149, name: 'Dragonite', type: 'dragon' },
        options: [['dragon', 'water'], ['dragon'], ['dragon', 'flying']],
      },
      {
        kind: 'typing',
        prompt: 'Ferrothorn mang hệ nào?',
        subject: { id: 598, name: 'Ferrothorn', type: 'grass' },
        options: [
          ['bug', 'steel'],
          ['grass', 'steel'],
          ['grass', 'ground'],
        ],
      },
    ],
  },
  {
    id: 'region',
    title: 'Vùng đất ra mắt',
    badge: 'Huy hiệu Lữ hành',
    questions: [
      {
        kind: 'region',
        prompt: 'Lucario ra mắt ở vùng đất nào?',
        subject: LUCARIO,
        options: [4, 5, 6],
      },
      {
        kind: 'region',
        prompt: 'Greninja ra mắt ở vùng đất nào?',
        subject: { id: 658, name: 'Greninja', type: 'water' },
        options: [5, 6, 7],
      },
      {
        kind: 'region',
        prompt: 'Mimikyu ra mắt ở vùng đất nào?',
        subject: { id: 778, name: 'Mimikyu', type: 'ghost' },
        options: [7, 8, 9],
      },
      {
        kind: 'region',
        prompt: 'Togepi ra mắt ở vùng đất nào?',
        subject: { id: 175, name: 'Togepi', type: 'fairy' },
        options: [1, 2, 3],
      },
      {
        kind: 'region',
        prompt: 'Corviknight ra mắt ở vùng đất nào?',
        subject: { id: 823, name: 'Corviknight', type: 'flying' },
        options: [6, 7, 8],
      },
      {
        kind: 'region',
        prompt: 'Blaziken ra mắt ở vùng đất nào?',
        subject: { id: 257, name: 'Blaziken', type: 'fire' },
        options: [3, 4, 5],
      },
    ],
  },
]

export function quizBadgeId(setId: string): string {
  return `quiz:${setId}`
}

export const QUIZ_BADGES: readonly Badge[] = QUIZ_SETS.map((set) => ({
  id: quizBadgeId(set.id),
  label: set.badge,
}))

export function detailIdsFor(question: QuizQuestion): number[] {
  if (question.kind === 'stat') return question.options.map((option) => option.id)
  if (question.kind === 'typing' || question.kind === 'region') return [question.subject.id]
  return []
}

function statLabel(stat: QuizStat): string {
  if (stat === 'baseStatTotal') return 'BST'
  return STAT_AXES.find((axis) => axis.key === stat)?.label ?? stat
}

function statValue(detail: PokemonDetail, stat: QuizStat): number {
  return stat === 'baseStatTotal' ? detail.baseStatTotal : detail.stats[stat]
}

function typingLabel(types: readonly TypeName[]): string {
  return types.map(typeLabel).join('/')
}

function regionLabel(generation: number): string {
  return (
    GENERATIONS.find((info) => info.generation === generation)?.region ?? `Thế hệ ${generation}`
  )
}

function sameTypes(left: readonly TypeName[], right: readonly TypeName[]): boolean {
  return left.length === right.length && left.every((type) => right.includes(type))
}

function uniqueIndex(matches: boolean[]): number {
  const first = matches.indexOf(true)
  return first !== -1 && matches.indexOf(true, first + 1) === -1 ? first : -1
}

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

function evaluateTypeQuestion(
  matrix: TypeMatrix,
  question: MultiplierQuestion | ImmunityQuestion | AttackerQuestion,
): EvaluatedQuestion {
  if (question.kind === 'multiplier') {
    const total = multiplierAgainst(matrix, question.attacking, question.defending)
    return {
      prompt: question.prompt,
      subject: question.subject,
      options: question.options.map(formatMultiplier),
      correctIndex: uniqueIndex(question.options.map((option) => option === total)),
      explanation: explainMultiplier(matrix, question),
    }
  }
  if (question.kind === 'immunity') {
    return {
      prompt: question.prompt,
      subject: question.subject,
      options: question.options.map(typeLabel),
      correctIndex: uniqueIndex(
        question.options.map((type) => singleMultiplier(matrix, question.attacking, type) === 0),
      ),
      explanation: explainImmunity(matrix, question),
    }
  }
  const totals = question.options.map((type) => multiplierAgainst(matrix, type, question.defending))
  return {
    prompt: question.prompt,
    subject: question.subject,
    options: question.options.map(typeLabel),
    correctIndex: uniqueIndex(totals.map((total) => total === question.target)),
    explanation: `${question.options
      .map((type, index) => `${typeLabel(type)} gây ${formatMultiplier(totals[index]!)}`)
      .join(', ')} lên ${question.subject.name}.`,
  }
}

function evaluateDetailQuestion(
  details: ReadonlyMap<number, PokemonDetail>,
  question: StatQuestion | TypingQuestion | RegionQuestion,
): EvaluatedQuestion | undefined {
  if (question.kind === 'stat') {
    const found = question.options.map((option) => details.get(option.id))
    if (found.some((detail) => detail === undefined)) return undefined
    const values = found.map((detail) => statValue(detail!, question.stat))
    const best = Math.max(...values)
    const label = statLabel(question.stat)
    return {
      prompt: question.prompt,
      subject: question.subject,
      options: question.options.map((option) => option.name),
      correctIndex: uniqueIndex(values.map((value) => value === best)),
      explanation: `${question.options
        .map((option, index) => `${option.name} có ${label} ${values[index]}`)
        .join(', ')}.`,
    }
  }
  const detail = details.get(question.subject.id)
  if (detail === undefined) return undefined
  if (question.kind === 'typing') {
    return {
      prompt: question.prompt,
      subject: question.subject,
      options: question.options.map(typingLabel),
      correctIndex: uniqueIndex(question.options.map((types) => sameTypes(types, detail.types))),
      explanation: `${question.subject.name} mang hệ ${typingLabel(detail.types)}.`,
    }
  }
  return {
    prompt: question.prompt,
    subject: question.subject,
    options: question.options.map(regionLabel),
    correctIndex: uniqueIndex(
      question.options.map((generation) => generation === detail.generation),
    ),
    explanation: `${question.subject.name} ra mắt ở thế hệ ${detail.generation}, vùng ${regionLabel(detail.generation)}.`,
  }
}

export function evaluateQuestion(
  question: QuizQuestion,
  data: QuizData,
): EvaluatedQuestion | undefined {
  if (
    question.kind === 'multiplier' ||
    question.kind === 'immunity' ||
    question.kind === 'attacker'
  ) {
    return data.matrix ? evaluateTypeQuestion(data.matrix, question) : undefined
  }
  return evaluateDetailQuestion(data.details, question)
}
