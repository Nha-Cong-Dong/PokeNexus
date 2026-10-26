import { Link } from 'react-router'

import { DexNumber } from '../../../components/pokemon/DexNumber'
import { PokemonSprite } from '../../../components/pokemon/PokemonSprite'
import { TypeBadge } from '../../../components/pokemon/TypeBadge'
import { formatPokemonName } from '../../../lib/formatters'
import { SCENES, sceneForTypes } from '../../../lib/scenes'
import type { PokemonRef } from '../../../types/api'

type TeamMemberCardProps = {
  id: number
  pokemon?: PokemonRef
  slotLabel: string
  nickname?: string | null
  onRemove?: () => void
  linkToDetail?: boolean
}

export function TeamMemberCard({
  id,
  pokemon,
  slotLabel,
  nickname,
  onRemove,
  linkToDetail = false,
}: TeamMemberCardProps) {
  const name = pokemon ? formatPokemonName(pokemon.name) : `Pokémon #${id}`
  const scene = SCENES[sceneForTypes(pokemon?.types ?? [])]

  const body = (
    <>
      <span
        aria-hidden="true"
        className="block h-12 rounded-t-[14px]"
        style={{
          backgroundImage: `linear-gradient(180deg, ${scene.top} 0%, ${scene.bottom} 100%)`,
        }}
      />
      <span className="absolute top-3 left-1/2 flex size-16 -translate-x-1/2 items-center justify-center rounded-full border-2 border-ink bg-surface">
        <PokemonSprite id={id} alt={name} size={64} className="size-14" />
      </span>
      <span className="flex flex-1 flex-col items-center gap-1 px-1.5 pt-8 pb-3 text-center">
        <span className="text-xs font-bold text-ink-muted">{slotLabel}</span>
        <span className="text-sm font-extrabold break-words">
          {pokemon ? name : <span className="text-ink-muted">Đang tải…</span>}
        </span>
        {nickname && (
          <span className="text-xs font-bold break-words text-ink-muted">“{nickname}”</span>
        )}
        {pokemon ? (
          <span className="flex flex-wrap justify-center gap-1">
            {pokemon.types.map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </span>
        ) : (
          <DexNumber id={id} className="text-xs text-ink-muted" />
        )}
      </span>
    </>
  )

  const frameClass =
    'relative flex h-full min-h-40 w-full flex-col rounded-2xl border-2 border-ink bg-surface text-ink shadow-block'

  return (
    <div className="relative w-full">
      {linkToDetail && pokemon ? (
        <Link
          to={`/pokemon/${pokemon.name}`}
          className={`${frameClass} transition-transform duration-150 ease-out hover:-translate-y-1`}
        >
          {body}
        </Link>
      ) : (
        <div className={frameClass}>{body}</div>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Bỏ ${name} khỏi đội`}
          className="group absolute -top-2 -right-2 flex size-10 cursor-pointer items-center justify-center rounded-full"
        >
          <span className="flex size-8 items-center justify-center rounded-full border-2 border-ink bg-surface group-hover:bg-surface-muted">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </span>
        </button>
      )}
    </div>
  )
}
