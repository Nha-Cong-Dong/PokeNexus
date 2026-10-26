import { useState } from 'react'

import { DexNumber } from '../../../components/pokemon/DexNumber'
import { PokemonSprite } from '../../../components/pokemon/PokemonSprite'
import { buttonClassName } from '../../../components/ui/buttonStyles'
import { ErrorState } from '../../../components/ui/ErrorState'
import { GameDialog } from '../../../components/ui/GameDialog'
import { errorMessageFor } from '../../../lib/errorMessages'
import { ApiError } from '../../../lib/http'
import { useTypeMatrix } from '../../typechart/hooks'
import { evaluateQuestion, QUIZ_QUESTIONS } from '../quiz'
import { SectionTitle } from './SectionTitle'

interface QuizState {
  index: number
  picked: number | null
  correct: number
  answered: number
}

const INITIAL_STATE: QuizState = { index: 0, picked: null, correct: 0, answered: 0 }

function optionClassName(index: number, picked: number | null, correctIndex: number): string {
  if (picked === null) return buttonClassName('secondary')
  if (index === correctIndex)
    return `${buttonClassName('secondary')} border-success bg-success text-white`
  if (index === picked) return `${buttonClassName('secondary')} border-danger bg-danger text-white`
  return buttonClassName('secondary')
}

export function TrainerQuiz() {
  const [state, setState] = useState<QuizState>(INITIAL_STATE)
  const { data: matrix, isPending, isError, error, refetch } = useTypeMatrix()
  const question = QUIZ_QUESTIONS[state.index] ?? QUIZ_QUESTIONS[0]!
  const evaluated = matrix ? evaluateQuestion(matrix, question) : undefined
  const isLast = state.index === QUIZ_QUESTIONS.length - 1

  function pick(option: number) {
    if (state.picked !== null || !evaluated) return
    setState((current) => ({
      ...current,
      picked: option,
      answered: current.answered + 1,
      correct: current.correct + (option === evaluated.correctIndex ? 1 : 0),
    }))
  }

  function next() {
    setState((current) =>
      isLast ? INITIAL_STATE : { ...current, index: current.index + 1, picked: null },
    )
  }

  return (
    <section
      aria-labelledby="quiz-title"
      className="bg-linear-to-b from-surface-muted to-bg px-4 py-16 md:px-6 md:py-24"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-center">
        <div className="flex flex-col gap-5 lg:w-2/5">
          <SectionTitle id="quiz-title">Thử tài Trainer</SectionTitle>
          <p className="max-w-[40ch] text-lg/7 text-ink-muted">
            5 câu hỏi nhanh về hệ số sát thương. Trả lời đúng hết là bạn sẵn sàng cho Team Builder.
          </p>
          <div className="relative size-44 md:size-52">
            <div className="flex size-full items-center justify-center rounded-full border-6 border-white bg-surface-muted shadow-[0_0_0_3px_var(--color-ink),8px_10px_0_0_rgb(22_33_62/0.3)]">
              <PokemonSprite
                id={question.subject.id}
                alt={`Artwork ${question.subject.name}`}
                size={160}
                variant="artwork"
                className="size-36 object-contain md:size-40"
              />
            </div>
            <span className="absolute -right-4 bottom-4 rotate-3 rounded-lg border-2 border-ink bg-dex-yellow px-2.5 py-1 text-xs font-extrabold">
              {question.subject.name} <DexNumber id={question.subject.id} />
            </span>
          </div>
        </div>

        <GameDialog speaker="Giáo sư" className="flex-1">
          <span className="absolute -top-4 right-5 rounded-full border-2 border-ink bg-dex-yellow px-3 py-0.5 text-sm font-extrabold">
            Câu <span className="font-pixel">{`${state.index + 1}/${QUIZ_QUESTIONS.length}`}</span>
          </span>
          {isError ? (
            <ErrorState
              message={errorMessageFor(error instanceof ApiError ? error.code : undefined)}
              onRetry={() => void refetch()}
            />
          ) : isPending || !evaluated ? (
            <p className="text-ink-muted">Đang chuẩn bị câu hỏi...</p>
          ) : (
            <div className="flex flex-col gap-5">
              <p className="text-xl/8 font-bold">{evaluated.prompt}</p>
              <div role="group" aria-label="Các đáp án" className="grid gap-2.5 sm:grid-cols-3">
                {evaluated.options.map((option, index) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={state.picked === index}
                    disabled={state.picked !== null}
                    onClick={() => pick(index)}
                    className={`${optionClassName(index, state.picked, evaluated.correctIndex)} disabled:opacity-100`}
                  >
                    {option}
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
                  </>
                )}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-border pt-4">
                <p className="text-sm font-bold text-ink-muted">
                  Đúng <span className="font-pixel text-lg text-ink">{state.correct}</span> trên{' '}
                  {state.answered} câu đã trả lời
                </p>
                <button
                  type="button"
                  onClick={next}
                  disabled={state.picked === null}
                  className={buttonClassName('primary')}
                >
                  {isLast ? 'Làm lại từ đầu' : 'Câu tiếp'}
                </button>
              </div>
            </div>
          )}
        </GameDialog>
      </div>
    </section>
  )
}
