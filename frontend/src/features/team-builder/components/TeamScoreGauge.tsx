import { useState } from 'react'

import { formatScore, scoreBarClassName } from '../teamAnalysis'

type TeamScoreGaugeProps = {
  score: number
  teamKey: string
}

export function TeamScoreGauge({ score, teamKey }: TeamScoreGaugeProps) {
  const [history, setHistory] = useState({ teamKey, score, delta: 0 })
  if (history.teamKey !== teamKey) {
    setHistory({ teamKey, score, delta: Math.round(score) - Math.round(history.score) })
  }
  const delta = history.teamKey === teamKey ? history.delta : 0
  const width = Math.min(100, Math.max(0, score))

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <p className="flex items-baseline gap-1.5">
          <span className="tabular-nums text-num-lg font-extrabold">{formatScore(score)}</span>
          <span className="text-sm font-bold text-ink-muted">/ 100</span>
        </p>
        {delta !== 0 && (
          <span
            className={`inline-flex h-7 items-center rounded-full px-2.5 text-sm font-extrabold text-white ${delta > 0 ? 'bg-success' : 'bg-danger'}`}
          >
            {delta > 0 ? `+${delta}` : `${delta}`} so với lần trước
          </span>
        )}
      </div>
      <div
        aria-hidden="true"
        className="flex h-6 items-center gap-1.5 rounded-xl border-2 border-ink bg-ink p-0.5"
      >
        <span className="px-1 font-pixel text-xs font-bold text-dex-yellow">HP</span>
        <span className="h-full flex-1 overflow-hidden rounded-md bg-surface-muted">
          <span
            className={`block h-full rounded-md ${scoreBarClassName(score)}`}
            style={{ width: `${width}%` }}
          />
        </span>
      </div>
    </div>
  )
}
