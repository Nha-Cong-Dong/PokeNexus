import { useId } from 'react'

import { PokemonSprite } from '../../../components/pokemon/PokemonSprite'
import { TypeBadge } from '../../../components/pokemon/TypeBadge'
import { buttonClassName } from '../../../components/ui/buttonStyles'
import { formatPokemonName } from '../../../lib/formatters'
import { typeScopeClassName } from '../../../lib/pokemonTypes'
import type { Recommendation } from '../../../types/api'
import { formatScore } from '../teamAnalysis'

type RecommendationCardProps = {
  recommendation: Recommendation
  rank: number
  actionLabel: string
  disabled: boolean
  onAdd: () => void
}

export function RecommendationCard({
  recommendation,
  rank,
  actionLabel,
  disabled,
  onAdd,
}: RecommendationCardProps) {
  const titleId = useId()
  const name = formatPokemonName(recommendation.name)
  const primaryType = recommendation.types[0] ?? 'normal'

  return (
    <article
      aria-labelledby={titleId}
      className="flex h-full w-full flex-col overflow-hidden rounded-[20px] border-2 border-ink bg-surface shadow-block"
    >
      <div
        className={`type-tint flex items-center gap-3 px-4 py-3 ${typeScopeClassName(primaryType)}`}
      >
        <span className="flex size-16 flex-none items-center justify-center rounded-full border-2 border-ink bg-surface">
          <PokemonSprite id={recommendation.id} alt={name} size={64} className="size-14" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-xs font-extrabold text-ink-muted">Đề xuất số {rank}</p>
          <h3 id={titleId} className="text-lg leading-6 font-extrabold break-words">
            {name}
          </h3>
          <span className="flex flex-wrap gap-1">
            {recommendation.types.map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </span>
        </div>
        <p className="flex flex-none flex-col items-end">
          <span className="tabular-nums text-num-lg font-extrabold">
            {formatScore(recommendation.score)}
          </span>
          <span className="text-xs font-extrabold text-ink-muted">phù hợp</span>
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-3 px-4 pt-3 pb-4">
        <ul className="flex flex-col gap-1.5" aria-label={`Lý do đề xuất ${name}`}>
          {recommendation.reasons.map((reason) => (
            <li key={reason} className="flex gap-2 text-sm">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="mt-0.5 size-4.5 flex-none text-success"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={onAdd}
          disabled={disabled}
          className={`mt-auto w-full ${buttonClassName('primary', 'sm')}`}
        >
          {actionLabel}
          <span className="sr-only"> {name}</span>
        </button>
      </div>
    </article>
  )
}

export function RecommendationSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="h-56 animate-pulse rounded-[20px] border-2 border-border bg-surface-muted"
    />
  )
}
