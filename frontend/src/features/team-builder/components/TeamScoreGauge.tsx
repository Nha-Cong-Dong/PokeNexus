import { formatScore, scoreBarClassName } from '../teamAnalysis'

type ScoreDeltaChipProps = {
  delta: number
}

export function ScoreDeltaChip({ delta }: ScoreDeltaChipProps) {
  if (delta === 0) return null
  return (
    <span
      className={`inline-flex h-6.5 animate-pop-in items-center rounded-full px-2.5 text-[0.8125rem] font-extrabold text-white tabular-nums ${delta > 0 ? 'bg-success' : 'bg-danger'}`}
    >
      {delta > 0 ? `+${delta}` : `${delta}`} so với lần trước
    </span>
  )
}

type TeamScoreGaugeProps = {
  score: number
}

export function TeamScoreGauge({ score }: TeamScoreGaugeProps) {
  const width = Math.min(100, Math.max(0, score))

  return (
    <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:gap-3.5">
      <p className="flex items-baseline gap-1.5 md:min-w-14">
        <span className="text-[3.25rem]/[3.25rem] font-extrabold tabular-nums md:text-num-lg">
          {formatScore(score)}
        </span>
        <span className="text-base font-bold text-ink-muted md:sr-only">/ 100</span>
      </p>
      <div
        aria-hidden="true"
        className="flex items-center gap-2 md:h-5.5 md:flex-1 md:gap-1.5 md:rounded-[11px] md:border-2 md:border-ink md:bg-ink md:p-0.5"
      >
        <span className="rounded-md border-2 border-ink bg-dex-yellow px-1.5 font-pixel text-sm leading-5 font-bold text-scrim md:border-0 md:bg-transparent md:px-1 md:text-[0.6875rem] md:leading-3 md:text-dex-yellow">
          HP
        </span>
        <span className="h-4 flex-1 overflow-hidden rounded-lg border-2 border-ink bg-surface-muted md:h-full md:rounded-md md:border-0">
          <span
            className={`block h-full origin-left animate-grow-x transition-[width,background-color] duration-700 ease-out [animation-delay:200ms] ${scoreBarClassName(score)}`}
            style={{ width: `${width}%` }}
          />
        </span>
      </div>
    </div>
  )
}
