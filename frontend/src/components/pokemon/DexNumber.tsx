import { formatDexNumber } from '../../lib/formatters'

type DexNumberProps = {
  id: number
  className?: string
}

export function DexNumber({ id, className = '' }: DexNumberProps) {
  return <span className={`tabular-nums font-extrabold ${className}`}>{formatDexNumber(id)}</span>
}
