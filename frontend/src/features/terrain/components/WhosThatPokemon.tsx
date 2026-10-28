import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'

import { PokemonSprite } from '../../../components/pokemon/PokemonSprite'
import { buttonClassName } from '../../../components/ui/buttonStyles'
import { EmptyState } from '../../../components/ui/EmptyState'
import { formatPokemonName } from '../../../lib/formatters'
import { SCENES } from '../../../lib/scenes'
import type { PokemonSummary } from '../../../types/api'
import { awardBadge, pointsForAnswer, recordAnswer } from '../../trainer/progress'
import type { ProgressUpdate } from '../../trainer/useTrainerProgress'
import { terrainBadgeId, type TerrainId } from '../terrains'
import {
  createRound,
  TERRAIN_BADGE_STREAK,
  WHOS_THAT_POINTS,
  type WhosThatRound,
} from '../whosThat'

type WhosThatPokemonProps = {
  terrain: TerrainId
  pool: readonly PokemonSummary[]
  ownsBadge: boolean
  onProgress: ProgressUpdate
  random?: () => number
}

interface Outcome {
  picked: number
  correct: boolean
  gained: number
  newBadge: boolean
}

function optionClassName(index: number, outcome: Outcome | null, correctIndex: number): string {
  const base = `${buttonClassName('secondary')} h-auto min-h-11 py-2 disabled:opacity-100`
  if (outcome === null) return base
  if (index === correctIndex) return `${base} border-success! bg-success! text-white!`
  if (index === outcome.picked) return `${base} border-danger! bg-danger! text-white!`
  return base
}

export function WhosThatPokemon({
  terrain,
  pool,
  ownsBadge,
  onProgress,
  random = Math.random,
}: WhosThatPokemonProps) {
  const [round, setRound] = useState<WhosThatRound | undefined>(() => createRound(pool, random))
  const [roundNumber, setRoundNumber] = useState(1)
  const [outcome, setOutcome] = useState<Outcome | null>(null)
  const [streak, setStreak] = useState(0)
  const [tally, setTally] = useState({ correct: 0, answered: 0 })
  const optionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (roundNumber > 1) optionsRef.current?.querySelector('button')?.focus()
  }, [roundNumber])

  if (!round) {
    return (
      <EmptyState
        title="Chưa đủ Pokémon để chơi"
        description="Địa hình này cần ít nhất 4 Pokémon có tên khác nhau."
      />
    )
  }

  const correctIndex = round.options.findIndex((option) => option.id === round.answer.id)
  const answerName = formatPokemonName(round.answer.name)

  function pick(index: number) {
    if (outcome !== null) return
    const correct = index === correctIndex
    const nextStreak = correct ? streak + 1 : 0
    const gained = pointsForAnswer(correct, nextStreak, WHOS_THAT_POINTS)
    const earnsBadge = nextStreak >= TERRAIN_BADGE_STREAK
    setOutcome({ picked: index, correct, gained, newBadge: earnsBadge && !ownsBadge })
    setStreak(nextStreak)
    setTally((current) => ({
      correct: current.correct + (correct ? 1 : 0),
      answered: current.answered + 1,
    }))
    onProgress((current) => {
      const withPoints = recordAnswer(current, gained, nextStreak)
      return earnsBadge ? awardBadge(withPoints, terrainBadgeId(terrain)) : withPoints
    })
  }

  function nextRound() {
    setRound(createRound(pool, random, round?.answer.id))
    setOutcome(null)
    setRoundNumber((current) => current + 1)
  }

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center">
      <div className="mx-auto flex size-56 flex-none items-center justify-center rounded-full border-6 border-white bg-surface-muted shadow-[0_0_0_3px_var(--color-ink),8px_10px_0_0_rgb(22_33_62/0.3)] md:size-64">
        <PokemonSprite
          key={roundNumber}
          id={round.answer.id}
          alt={outcome ? `Artwork ${answerName}` : 'Bóng đen của một Pokémon bí ẩn'}
          size={224}
          variant="artwork"
          className={`size-44 object-contain transition-[filter] duration-500 select-none md:size-52 ${outcome ? '' : 'brightness-0'}`}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <p className="text-sm font-bold text-ink-muted">
          Lượt <span className="tabular-nums text-ink">{roundNumber}</span>, chuỗi đúng{' '}
          <span className="tabular-nums text-ink">{`${streak}/${TERRAIN_BADGE_STREAK}`}</span> để
          nhận huy hiệu {SCENES[terrain].name}
        </p>
        <div
          ref={optionsRef}
          role="group"
          aria-label="Chọn tên Pokémon"
          className="grid gap-2.5 sm:grid-cols-2"
        >
          {round.options.map((option, index) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={outcome?.picked === index}
              disabled={outcome !== null}
              onClick={() => pick(index)}
              className={optionClassName(index, outcome, correctIndex)}
            >
              {formatPokemonName(option.name)}
            </button>
          ))}
        </div>
        <p aria-live="polite" className="min-h-14 text-lg/7">
          {outcome === null ? (
            'Nhìn bóng đen và chọn đúng tên Pokémon.'
          ) : (
            <>
              <strong className={outcome.correct ? 'text-success' : 'text-danger'}>
                {outcome.correct ? 'Chính xác!' : 'Chưa đúng.'}
              </strong>{' '}
              Đó là {answerName}.{outcome.correct && ` Cộng ${outcome.gained} điểm Trainer.`}
              {outcome.newBadge && ` Bạn nhận huy hiệu ${SCENES[terrain].name}!`}
            </>
          )}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-border pt-4">
          <p className="text-sm font-bold text-ink-muted">
            Đúng <span className="tabular-nums font-bold text-lg text-ink">{tally.correct}</span>{' '}
            trên {tally.answered} lượt
          </p>
          <div className="flex flex-wrap gap-3">
            {outcome && (
              <Link to={`/pokemon/${round.answer.name}`} className={buttonClassName('ghost')}>
                Xem {answerName}
              </Link>
            )}
            <button
              type="button"
              onClick={nextRound}
              disabled={outcome === null}
              className={buttonClassName('primary')}
            >
              Pokémon tiếp theo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
