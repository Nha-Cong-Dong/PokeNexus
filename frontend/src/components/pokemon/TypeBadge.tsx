import { typeClassName, typeLabel } from '../../lib/pokemonTypes'
import type { TypeName } from '../../types/api'

type TypeBadgeProps = {
  type: TypeName
  size?: 'sm' | 'md'
}

const SIZE_CLASSES = {
  sm: 'h-6 px-2.5 text-xs',
  md: 'h-8 px-3.5 text-sm',
}

export function TypeBadge({ type, size = 'sm' }: TypeBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-extrabold ${SIZE_CLASSES[size]} ${typeClassName(type)}`}
    >
      {typeLabel(type)}
    </span>
  )
}
