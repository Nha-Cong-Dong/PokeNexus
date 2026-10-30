import { useState } from 'react'
import { Link } from 'react-router'

import { DexNumber } from '../../../components/pokemon/DexNumber'
import { PokemonSprite } from '../../../components/pokemon/PokemonSprite'
import { TypeGlyph } from '../../../components/pokemon/TypeGlyph'
import { buttonClassName } from '../../../components/ui/buttonStyles'
import { ErrorState } from '../../../components/ui/ErrorState'
import { GameDialog } from '../../../components/ui/GameDialog'
import { errorMessageFor } from '../../../lib/errorMessages'
import { ApiError } from '../../../lib/http'
import { typeClassName, typeScopeClassName } from '../../../lib/pokemonTypes'
import type { TypeName } from '../../../types/api'
import { BallIcon } from '../../trainer/components/BallIcon'
import { TrainerCard } from '../../trainer/components/TrainerCard'
import {
  awardBadge,
  awardBall,
  BALL_LABELS,
  pointsForAnswer,
  prizeFor,
  recordAnswer,
  STREAK_BONUS_FROM,
  type BallKind,
} from '../../trainer/progress'
import { useTrainerProgress } from '../../trainer/useTrainerProgress'
import { useTypeMatrix } from '../../typechart/hooks'
import { useQuizDetails } from '../hooks'
import {
  BADGE_MIN_CORRECT,
  detailIdsFor,
  evaluateQuestion,
  QUIZ_BADGES,
  QUIZ_SETS,
  quizBadgeId,
} from '../quiz'
import { Aura, Blob } from './SectionDecor'
import { SectionTitle } from './SectionTitle'

const QUIZ_ORBS: readonly { type: TypeName; className: string; delay: string }[] = [
  { type: 'water', className: 'bottom-6 left-[25%] size-14', delay: '-1s' },
  { type: 'electric', className: 'top-[22px] right-[2%] size-16', delay: '-2.5s' },
  { type: 'flying', className: 'top-10 left-[38%] size-11', delay: '-3.7s' },
]

interface QuizState {
  setIndex: number
  index: number
  picked: number | null
  correct: number
  answered: number
  streak: number
  earned: number
  finished: boolean
  prize: BallKind | undefined
  badgeEarned: boolean
}

function initialState(setIndex: number): QuizState {
  return {
    setIndex,
    index: 0,
    picked: null,
    correct: 0,
    answered: 0,
    streak: 0,
    earned: 0,
    finished: false,
    prize: undefined,
    badgeEarned: false,
  }
}

function optionClassName(index: number, picked: number | null, correctIndex: number): string {
  const base = `${buttonClassName('secondary')} h-auto min-h-[54px] rounded-xl! py-2 text-lg! not-disabled:hover:-translate-y-0.5 not-disabled:hover:bg-answer-hover!`
  if (picked === null) return base
  if (index === correctIndex) return `${base} border-success! bg-success! text-white! opacity-100!`
  if (index === picked) return `${base} border-danger! bg-danger! text-white! opacity-100!`
  return `${base} opacity-45!`
}

export function TrainerQuiz() {
  const [state, setState] = useState<QuizState>(() => initialState(0))
  const { progress, update } = useTrainerProgress()
  const set = QUIZ_SETS[state.setIndex] ?? QUIZ_SETS[0]!
  const question = set.questions[state.index] ?? set.questions[0]!
  const total = set.questions.length
  const isLast = state.index === total - 1
  const matrixQuery = useTypeMatrix()
  const detailQuery = useQuizDetails(detailIdsFor(question))
  const evaluated = evaluateQuestion(question, {
    matrix: matrixQuery.data,
    details: detailQuery.details,
  })
  const needsMatrix = detailIdsFor(question).length === 0
  const failed = needsMatrix ? matrixQuery.isError : detailQuery.isError
  const errorCode = needsMatrix
    ? matrixQuery.error instanceof ApiError
      ? matrixQuery.error.code
      : undefined
    : detailQuery.errorCode

  function chooseSet(setIndex: number) {
    setState(initialState(setIndex))
  }

  function pick(option: number) {
    if (state.picked !== null || !evaluated) return
    const isCorrect = option === evaluated.correctIndex
    const streak = isCorrect ? state.streak + 1 : 0
    const gained = pointsForAnswer(isCorrect, streak)
    setState((current) => ({
      ...current,
      picked: option,
      answered: current.answered + 1,
      correct: current.correct + (isCorrect ? 1 : 0),
      streak,
      earned: current.earned + gained,
    }))
    update((current) => recordAnswer(current, gained, streak))
  }

  function next() {
    if (!isLast) {
      setState((current) => ({ ...current, index: current.index + 1, picked: null }))
      return
    }
    const prize = prizeFor(state.correct, total)
    const badgeEarned = state.correct >= BADGE_MIN_CORRECT
    update((current) => {
      const withBall = prize ? awardBall(current, prize) : current
      return badgeEarned ? awardBadge(withBall, quizBadgeId(set.id)) : withBall
    })
    setState((current) => ({ ...current, finished: true, prize, badgeEarned }))
  }

  return (
    <section
      aria-labelledby="quiz-title"
      className="relative overflow-hidden bg-linear-to-b from-band-mint to-band-violet px-4 pt-8 pb-14 md:px-6 md:pt-[90px] md:pb-[110px]"
    >
      <Aura>
        <Blob
          drift="b"
          className="top-[10%] -left-[50%] size-[440px] from-type-flying/36 md:-top-[10%] md:-left-[6%] md:size-[640px]"
        />
        <Blob className="-right-[50%] bottom-0 size-[440px] from-type-psychic/22 md:-right-[10%] md:-bottom-[26%] md:size-[700px]" />
      </Aura>
      <div aria-hidden="true" className="hidden md:block">
        {QUIZ_ORBS.map((orb) => (
          <span
            key={orb.type}
            className={`pointer-events-none absolute flex items-center justify-center rounded-full border-[2.5px] border-ink text-ink shadow-[0_4px_0_rgb(22_33_62/0.18)] motion-safe:animate-orb ${typeClassName(orb.type)} ${orb.className}`}
            style={{ animationDelay: orb.delay }}
          >
            <TypeGlyph type={orb.type} className="size-1/2" strokeWidth={1.9} />
          </span>
        ))}
      </div>
      <div className="relative mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-center">
        <div className="flex flex-col gap-5 lg:w-2/5">
          <SectionTitle id="quiz-title">Thử tài Trainer</SectionTitle>
          <p className="max-w-[40ch] text-lg/7 text-ink-muted">
            {QUIZ_SETS.length} bộ câu hỏi, mỗi bộ {total} câu: hệ số, điểm yếu, chỉ số, hệ và vùng
            đất ra mắt. Trả lời đúng để nhận điểm Trainer, Ball và huy hiệu.
          </p>
          <div className="relative size-48 md:size-60">
            <div className="relative flex size-full animate-float items-center justify-center">
              <span
                aria-hidden="true"
                className={`type-blob absolute inset-2.5 -rotate-5 rounded-[46%_54%_50%_50%/52%_46%_54%_48%] border-6 border-white shadow-[0_0_0_3px_var(--color-ink),8px_10px_0_0_rgb(22_33_62/0.3)] md:border-7 md:shadow-[0_0_0_3px_var(--color-ink),10px_14px_0_0_rgb(22_33_62/0.3)] ${typeScopeClassName(question.subject.type)}`}
              />
              <PokemonSprite
                id={question.subject.id}
                alt={`Artwork ${question.subject.name}`}
                size={160}
                variant="artwork"
                className="relative size-36 object-contain md:size-44"
              />
            </div>
            <span className="absolute -right-4 bottom-4 rotate-3 rounded-lg border-2 border-ink bg-dex-yellow px-2.5 py-1 text-xs font-extrabold">
              {question.subject.name} <DexNumber id={question.subject.id} />
            </span>
          </div>
          <p className="text-base">
            Thích nhận diện bóng đen hơn?{' '}
            <Link
              to="/terrain"
              className="font-extrabold text-primary underline underline-offset-4"
            >
              Chơi Who&apos;s that Pokémon? ở trang Địa hình
            </Link>
          </p>
        </div>

        <GameDialog speaker="Giáo sư" className="flex-1">
          <span className="absolute -top-4 right-5 rounded-full border-2 border-ink bg-dex-yellow px-3 py-0.5 text-sm font-extrabold">
            Câu <span className="tabular-nums font-bold">{`${state.index + 1}/${total}`}</span>
          </span>
          <div role="group" aria-label="Bộ câu hỏi" className="mb-5 flex flex-wrap gap-2">
            {QUIZ_SETS.map((quizSet, setIndex) => {
              const owned = progress.badges.includes(quizBadgeId(quizSet.id))
              const active = setIndex === state.setIndex
              return (
                <button
                  key={quizSet.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => chooseSet(setIndex)}
                  className={`${buttonClassName('secondary', 'sm')} ${active ? 'bg-dex-yellow!' : ''}`}
                >
                  {quizSet.title}
                  {owned && (
                    <>
                      <BallIcon kind="master" className="size-4" />
                      <span className="sr-only">, đã có huy hiệu</span>
                    </>
                  )}
                </button>
              )
            })}
          </div>
          {failed ? (
            <ErrorState
              message={errorMessageFor(errorCode)}
              onRetry={() => {
                if (needsMatrix) void matrixQuery.refetch()
                else detailQuery.retry()
              }}
            />
          ) : state.finished ? (
            <div className="flex animate-pop-in flex-col gap-4">
              <p role="status" className="text-xl/8 font-bold">
                Hoàn thành bộ {set.title}: đúng{' '}
                <span className="tabular-nums">{`${state.correct}/${total}`}</span> câu.
              </p>
              <ul className="flex flex-col gap-2 text-lg/7">
                <li className="flex items-center gap-2">
                  {state.prize ? (
                    <>
                      <BallIcon kind={state.prize} className="size-7 flex-none" />
                      Nhận 1 {BALL_LABELS[state.prize]}.
                    </>
                  ) : (
                    'Chưa có Ball cho lượt này. Đúng ít nhất 1 câu để nhận Poké Ball.'
                  )}
                </li>
                <li>
                  Cộng <span className="tabular-nums font-extrabold">{state.earned}</span> điểm
                  Trainer.
                </li>
                <li>
                  {state.badgeEarned
                    ? `Mở khóa ${set.badge}.`
                    : `Cần đúng ${BADGE_MIN_CORRECT}/${total} câu để nhận ${set.badge}.`}
                </li>
              </ul>
              <div className="flex flex-wrap gap-3 border-t-2 border-border pt-4">
                <button
                  type="button"
                  onClick={() => chooseSet(state.setIndex)}
                  className={buttonClassName('secondary')}
                >
                  Làm lại bộ này
                </button>
                <button
                  type="button"
                  onClick={() => chooseSet((state.setIndex + 1) % QUIZ_SETS.length)}
                  className={buttonClassName('primary')}
                >
                  Bộ tiếp theo
                </button>
              </div>
            </div>
          ) : !evaluated ? (
            <p className="text-ink-muted">Đang chuẩn bị câu hỏi...</p>
          ) : (
            <div
              key={`${state.setIndex}-${state.index}`}
              className="flex animate-slide-in-right flex-col gap-5"
            >
              <p className="text-xl/8 font-bold">{evaluated.prompt}</p>
              <div role="group" aria-label="Các đáp án" className="grid gap-2.5 sm:grid-cols-3">
                {evaluated.options.map((option, index) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={state.picked === index}
                    disabled={state.picked !== null}
                    onClick={() => pick(index)}
                    className={optionClassName(index, state.picked, evaluated.correctIndex)}
                  >
                    {option}
                    {state.picked !== null && index === evaluated.correctIndex && (
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="size-5 flex-none"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              <p aria-live="polite" className="min-h-14 text-lg/7">
                {state.picked === null ? (
                  'Chọn một đáp án để xem giải thích.'
                ) : (
                  <>
                    <strong
                      className={
                        state.picked === evaluated.correctIndex ? 'text-success' : 'text-danger'
                      }
                    >
                      {state.picked === evaluated.correctIndex ? 'Chính xác!' : 'Chưa đúng.'}
                    </strong>{' '}
                    {evaluated.explanation}
                    {state.picked === evaluated.correctIndex &&
                      state.streak >= STREAK_BONUS_FROM && (
                        <> Chuỗi {state.streak} câu đúng, thưởng thêm điểm.</>
                      )}
                  </>
                )}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-border pt-4">
                <p className="text-sm font-bold text-ink-muted">
                  Đúng{' '}
                  <span className="tabular-nums font-bold text-lg text-ink">{state.correct}</span>{' '}
                  trên {state.answered} câu đã trả lời
                </p>
                <button
                  type="button"
                  onClick={next}
                  disabled={state.picked === null}
                  className={buttonClassName('primary')}
                >
                  {isLast ? 'Xem kết quả' : 'Câu tiếp'}
                </button>
              </div>
            </div>
          )}
        </GameDialog>
      </div>
      <TrainerCard
        progress={progress}
        badges={QUIZ_BADGES}
        badgeTitle="Huy hiệu bộ câu hỏi"
        className="relative mx-auto mt-10 max-w-7xl"
      />
    </section>
  )
}
