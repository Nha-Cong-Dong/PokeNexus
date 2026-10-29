import { Link } from 'react-router'

import { DexNumber } from '../../../components/pokemon/DexNumber'
import { PokemonSprite } from '../../../components/pokemon/PokemonSprite'
import { TypeBadge } from '../../../components/pokemon/TypeBadge'
import { formatPokemonName } from '../../../lib/formatters'
import { typeClassName, typeLabel, typeScopeClassName } from '../../../lib/pokemonTypes'
import { SCENES, sceneForTypes, sceneGradient } from '../../../lib/scenes'
import type { PokemonRef, TeamMember } from '../../../types/api'

type TeamMemberCardProps = {
  id: number
  pokemon?: PokemonRef
  unavailable?: boolean
  badge?: string
  onRemove: () => void
}

const TINT_35 = 'bg-[color-mix(in_oklab,var(--type-base)_35%,var(--color-surface))]'
const TINT_30 = 'bg-[color-mix(in_oklab,var(--type-base)_30%,var(--color-surface))]'

const CLOSE_ICON = (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="size-3.5 md:size-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.6"
    strokeLinecap="round"
  >
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

export function TeamMemberCard({
  id,
  pokemon,
  unavailable = false,
  badge,
  onRemove,
}: TeamMemberCardProps) {
  const name = pokemon ? formatPokemonName(pokemon.name) : `Pokémon #${id}`
  const scene = sceneForTypes(pokemon?.types ?? [])
  const scope = typeScopeClassName(pokemon?.types[0] ?? 'normal')

  return (
    <div className={`relative w-full ${scope}`}>
      <div
        className={`relative flex h-full min-h-34 w-full flex-col items-center overflow-hidden rounded-2xl border-2 border-ink text-ink transition-transform duration-150 ease-out md:min-h-38 md:bg-surface md:shadow-block md:hover:-translate-y-0.5 md:hover:-rotate-1 ${TINT_30}`}
      >
        <span
          aria-hidden="true"
          className="block h-12.5 self-stretch md:h-13.5"
          style={{ backgroundImage: sceneGradient(scene) }}
        />
        <span
          className={`absolute top-4.5 left-1/2 flex size-14.5 -translate-x-1/2 items-center justify-center rounded-full border-3 border-surface ring-2 ring-ink md:top-6 md:size-12.5 md:border-2 md:border-ink md:ring-0 ${TINT_35}`}
        >
          <PokemonSprite id={id} alt={name} size={96} className="size-12 md:size-11" />
        </span>
        <span className="flex flex-1 flex-col items-center gap-1.5 px-1.5 pt-7.5 pb-2.5 text-center md:px-2.5 md:pt-6.5">
          {badge && <span className="text-xs font-extrabold text-primary">{badge}</span>}
          <span className="text-[0.9375rem] leading-5 font-extrabold break-words">
            {pokemon ? (
              name
            ) : (
              <span className="text-ink-muted">{unavailable ? 'Chưa tải được' : 'Đang tải…'}</span>
            )}
          </span>
          {pokemon ? (
            <span className="flex flex-wrap justify-center gap-1">
              {pokemon.types.map((type) => (
                <span
                  key={type}
                  className={`inline-flex h-5.5 items-center rounded-full px-2 text-xs font-extrabold md:h-5 md:px-1.75 md:text-[0.6875rem] ${typeClassName(type)}`}
                >
                  {typeLabel(type)}
                </span>
              ))}
            </span>
          ) : (
            <DexNumber id={id} className="text-xs text-ink-muted" />
          )}
        </span>
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Bỏ ${name} khỏi đội`}
        className="group absolute -top-3.5 -right-3 flex size-11 cursor-pointer items-center justify-center rounded-full md:top-0.5 md:right-0.5 md:size-10"
      >
        <span className="flex size-8 items-center justify-center rounded-full border-2 border-ink bg-surface group-hover:bg-surface-muted md:border-0 md:bg-surface/90">
          {CLOSE_ICON}
        </span>
      </button>
    </div>
  )
}

type SharedMemberCardProps = {
  member: TeamMember
}

export function SharedMemberCard({ member }: SharedMemberCardProps) {
  const name = formatPokemonName(member.name)
  const scene = sceneForTypes(member.types)

  return (
    <Link
      to={`/pokemon/${member.name}`}
      className={`block w-full overflow-hidden rounded-[18px] border-2 border-ink bg-surface text-ink shadow-block transition-[transform,box-shadow] duration-150 ease-out hover:-translate-y-1 hover:shadow-block-hover ${typeScopeClassName(member.types[0] ?? 'normal')}`}
    >
      <span
        aria-hidden="true"
        className="flex h-20 items-end justify-center"
        style={{ backgroundImage: sceneGradient(scene) }}
      >
        <span
          className={`-mb-6.5 flex size-16 animate-pop-in items-center justify-center rounded-full border-2 border-ink ${TINT_35}`}
        >
          <PokemonSprite id={member.id} alt="" size={96} className="size-14" />
        </span>
      </span>
      <span className="flex flex-col items-center gap-1.5 px-3 pt-8.5 pb-3.5 text-center">
        <DexNumber id={member.id} className="text-sm leading-3.5 text-ink-muted" />
        <span className="text-[1.0625rem] leading-5.5 font-extrabold break-words">{name}</span>
        {member.nickname && (
          <span className="text-xs font-bold break-words text-ink-muted">“{member.nickname}”</span>
        )}
        <span className="flex flex-wrap justify-center gap-1">
          {member.types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </span>
        <span className="text-xs font-bold text-ink-muted">{SCENES[scene].name}</span>
      </span>
    </Link>
  )
}
