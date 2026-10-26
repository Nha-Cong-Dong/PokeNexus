import { formatMultiplier } from '../../lib/formatters'
import { multiplierClassName } from './multiplierStyles'

type MultiplierCellProps = {
  multiplier: number
  className?: string
}

export function MultiplierCell({ multiplier, className = '' }: MultiplierCellProps) {
  return (
    <span
      className={`inline-flex min-w-10 items-center justify-center rounded-md px-1.5 text-sm font-extrabold ${multiplierClassName(multiplier)} ${className}`}
    >
      {formatMultiplier(multiplier)}
    </span>
  )
}
