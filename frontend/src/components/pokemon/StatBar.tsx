type StatBarProps = {
  label: string
  value: number
  max?: number
}

function toneClassName(value: number): string {
  if (value < 60) return 'bg-stat-low'
  if (value < 90) return 'bg-stat-mid'
  if (value < 120) return 'bg-stat-good'
  return 'bg-stat-high'
}

export function StatBar({ label, value, max = 255 }: StatBarProps) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 sm:grid-cols-[9.5rem_2.5rem_minmax(0,1fr)]">
      <dt className="text-sm font-bold text-ink-muted">{label}</dt>
      <dd className="tabular-nums text-right text-num font-extrabold">{value}</dd>
      <dd
        aria-hidden="true"
        className="col-span-2 h-4 overflow-hidden rounded-lg border-2 border-ink bg-surface-muted sm:col-span-1"
      >
        <span
          data-testid="stat-bar-fill"
          className={`block h-full ${percent > 0 ? 'border-r-2 border-ink' : ''} ${toneClassName(value)}`}
          style={{ width: `${percent}%` }}
        />
      </dd>
    </div>
  )
}
