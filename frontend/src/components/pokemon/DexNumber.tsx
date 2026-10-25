import { formatDexNumber } from '../../lib/formatters'

type DexNumberProps = {
  id: number
  className?: string
}

export function DexNumber({ id, className = '' }: DexNumberProps) {
  return <span className={`font-pixel font-semibold ${className}`}>{formatDexNumber(id)}</span>
}
