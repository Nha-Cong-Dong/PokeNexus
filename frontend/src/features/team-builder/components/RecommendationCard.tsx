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
      className={`type-tint relative flex h-full w-full flex-col rounded-[20px] border-2 border-ink pt-16.5 shadow-block md:overflow-hidden md:bg-surface md:pt-0 ${typeScopeClassName(primaryType)}`}
    >
      <div className="flex items-center gap-3 px-4 md:type-tint md:py-3">
        <span className="absolute -top-11.5 left-3.5 flex size-26 -rotate-6 items-center justify-center rounded-full border-4 border-surface bg-[color-mix(in_oklab,var(--type-base)_35%,var(--color-surface))] shadow-blob ring-2 ring-ink md:static md:size-16 md:flex-none md:rotate-0 md:border-2 md:border-ink md:bg-surface md:shadow-none md:ring-0">
          <PokemonSprite
            id={recommendation.id}
            alt={name}
            size={96}
            className="size-22 rotate-6 md:size-14 md:rotate-0"
          />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-xs font-extrabold text-ink-muted">Đề xuất số {rank}</p>
          <h3
            id={titleId}
            className="text-2xl leading-7.5 font-extrabold break-words md:text-lg md:leading-6"
          >
            {name}
          </h3>
          <span className="flex flex-wrap gap-1">
            {recommendation.types.map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </span>
        </div>
        <p className="absolute top-3.5 right-3.5 flex flex-col items-end md:static md:flex-none">
          <span className="text-[2.125rem] leading-none font-extrabold tabular-nums md:text-num-lg">
            {formatScore(recommendation.score)}
          </span>
          <span className="text-xs font-extrabold text-ink-muted max-md:order-first max-md:mb-1">
            phù hợp
          </span>
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-3 px-4 pt-3 pb-4">
        <ul className="flex flex-col gap-1.5" aria-label={`Lý do đề xuất ${name}`}>
          {recommendation.reasons.map((reason) => (
            <li
              key={reason}
              className="flex gap-2 text-base leading-[1.4375rem] md:text-sm md:leading-5"
            >
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
        {recommendation.cautions.length > 0 && (
          <ul className="flex flex-col gap-1.5" aria-label={`Lưu ý khi chọn ${name}`}>
            {recommendation.cautions.map((caution) => (
              <li
                key={caution}
                className="flex gap-2 text-base leading-[1.4375rem] md:text-sm md:leading-5"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="mt-0.5 size-4.5 flex-none text-warning"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 4l9 16H3z" />
                  <path d="M12 10v4.5M12 17.5v.01" />
                </svg>
                <span>{caution}</span>
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          onClick={onAdd}
          disabled={disabled}
          className={`mt-auto w-full ${buttonClassName('primary', 'sm')} max-md:h-12 max-md:text-base`}
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
      className="h-56 w-75 flex-none animate-pulse rounded-[20px] border-2 border-border bg-surface-muted md:w-auto"
    />
  )
}
