import { typeClassName } from '../../lib/pokemonTypes'
import type { TypeName } from '../../types/api'

type TypeBadgeProps = {
  type: TypeName
}

export function TypeBadge({ type }: TypeBadgeProps) {
  return (
    <span
      className={`inline-flex min-w-16 justify-center rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${typeClassName(type)}`}
    >
      {type}
    </span>
  )
}
