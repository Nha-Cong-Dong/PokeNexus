import { useId } from 'react'

import { formatNumber } from '../../../lib/formatters'
import { BALL_KINDS, BALL_LABELS, rankFor, type Badge, type TrainerProgress } from '../progress'
import { BallIcon } from './BallIcon'

type TrainerCardProps = {
  progress: TrainerProgress
  badges: readonly Badge[]
  badgeTitle: string
  headingLevel?: 'h2' | 'h3'
  className?: string
}

export function TrainerCard({
  progress,
  badges,
  badgeTitle,
  headingLevel: Heading = 'h3',
  className = '',
}: TrainerCardProps) {
  const titleId = useId()
  const { current, next } = rankFor(progress.points)
  const span = next ? next.minPoints - current.minPoints : 1
  const filled = next ? Math.min(1, (progress.points - current.minPoints) / span) : 1
  const earned = badges.filter((badge) => progress.badges.includes(badge.id)).length

  return (
    <section
      aria-labelledby={titleId}
      className={`rounded-3xl border-2 border-ink bg-surface p-5 shadow-block-lg md:p-6 ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
        <div className="flex min-w-56 flex-1 flex-col gap-2">
          <Heading id={titleId} className="text-2xl font-extrabold">
            Thẻ Trainer
          </Heading>
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="rounded-full border-2 border-ink bg-dex-yellow px-3 py-0.5 text-sm font-extrabold">
              {current.title}
            </span>
            <span className="text-ink-muted">
              <span className="tabular-nums text-num font-extrabold text-ink">
                {formatNumber(progress.points)}
              </span>{' '}
              điểm Trainer
            </span>
          </p>
          <div
            aria-hidden="true"
            className="h-3 max-w-md overflow-hidden rounded-full bg-surface-muted"
          >
            <div className="h-full rounded-full bg-primary" style={{ width: `${filled * 100}%` }} />
          </div>
          <p className="text-sm text-ink-muted">
            {next
              ? `Còn ${formatNumber(next.minPoints - progress.points)} điểm để lên ${next.title}.`
              : 'Bạn đã đạt danh hiệu cao nhất.'}{' '}
            Chuỗi đúng dài nhất:{' '}
            <span className="tabular-nums font-extrabold text-ink">{progress.bestStreak}</span>.
          </p>
        </div>
        <ul aria-label="Ball đã nhận" className="grid grid-cols-2 gap-x-5 gap-y-2 sm:grid-cols-4">
          {BALL_KINDS.map((kind) => (
            <li key={kind} className="flex items-center gap-2">
              <BallIcon kind={kind} className="size-7 flex-none" />
              <span className="text-sm leading-tight">
                <span className="block font-bold">{BALL_LABELS[kind]}</span>
                <span className="tabular-nums text-num font-extrabold">
                  {formatNumber(progress.balls[kind])}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-5 border-t-2 border-border pt-4">
        <p className="text-sm font-bold text-ink-muted">
          {badgeTitle}:{' '}
          <span className="tabular-nums font-extrabold text-ink">{`${earned}/${badges.length}`}</span>
        </p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {badges.map((badge) => {
            const owned = progress.badges.includes(badge.id)
            return (
              <li
                key={badge.id}
                className={
                  owned
                    ? 'rounded-full border-2 border-ink bg-dex-yellow px-3 py-1 text-sm font-extrabold'
                    : 'rounded-full border-2 border-dashed border-border-strong px-3 py-1 text-sm text-ink-muted'
                }
              >
                {badge.label}
                {!owned && <span className="sr-only"> (chưa có)</span>}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
