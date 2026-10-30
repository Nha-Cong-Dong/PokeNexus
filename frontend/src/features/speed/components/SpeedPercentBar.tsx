export function SpeedPercentBar({ percent }: { percent: number }) {
  return (
    <span
      aria-hidden="true"
      className="block h-2.5 overflow-hidden rounded-full border-2 border-ink bg-surface-muted"
    >
      <span
        className="block h-full origin-left rounded-full bg-primary motion-safe:animate-grow-x"
        style={{ width: `${Math.min(Math.max(percent, 0), 100)}%` }}
      />
    </span>
  )
}
