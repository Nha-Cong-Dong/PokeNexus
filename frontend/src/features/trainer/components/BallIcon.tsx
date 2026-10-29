import type { BallKind } from '../progress'

const TOP_CLASSES: Record<BallKind, string> = {
  poke: 'fill-dex-red',
  great: 'fill-type-water',
  ultra: 'fill-ink',
  master: 'fill-type-poison',
}

const MARK_CLASSES: Record<BallKind, string> = {
  poke: 'fill-none',
  great: 'fill-dex-red',
  ultra: 'fill-dex-yellow',
  master: 'fill-type-fairy',
}

type BallIconProps = {
  kind: BallKind
  className?: string
}

export function BallIcon({ kind, className = 'size-6' }: BallIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="10.5" className="fill-surface stroke-ink" strokeWidth="1.5" />
      <path
        d="M1.5 12a10.5 10.5 0 0 1 21 0Z"
        className={`${TOP_CLASSES[kind]} stroke-ink`}
        strokeWidth="1.5"
      />
      <circle cx="7.5" cy="7.5" r="1.8" className={MARK_CLASSES[kind]} />
      <circle cx="16.5" cy="7.5" r="1.8" className={MARK_CLASSES[kind]} />
      <circle cx="12" cy="12" r="3" className="fill-surface stroke-ink" strokeWidth="1.5" />
    </svg>
  )
}
