import { buttonClassName } from '../../../components/ui/buttonStyles'
import { formatPokemonName } from '../../../lib/formatters'
import { staggerDelay } from '../../../lib/motion'
import type { PokemonRef, TeamMember } from '../../../types/api'
import { MAX_DRAFT_SIZE } from '../useTeamDraft'
import { SharedMemberCard, TeamMemberCard } from './TeamMemberCard'

type TeamSlotsProps = {
  ids: readonly number[]
  refFor: (id: number) => PokemonRef | undefined
  sixthId: number | null
  suggestion: PokemonRef | null
  unavailable?: boolean
  onRemove: (id: number) => void
  onRemoveSixth: () => void
  onAddSuggestion: () => void
  onAddClick: () => void
}

const PLUS_ICON = (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="size-5.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
)

const DASHED_SLOT =
  'flex min-h-34 w-full flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed p-2 text-center md:min-h-38'

export function TeamSlots({
  ids,
  refFor,
  sixthId,
  suggestion,
  unavailable = false,
  onRemove,
  onRemoveSixth,
  onAddSuggestion,
  onAddClick,
}: TeamSlotsProps) {
  const isFull = ids.length >= MAX_DRAFT_SIZE

  return (
    <ul className="grid grid-cols-3 gap-x-2 gap-y-2.5 lg:grid-cols-2 lg:gap-2.5">
      {Array.from({ length: MAX_DRAFT_SIZE }, (_, index) => {
        const id = ids[index]
        return (
          <li
            key={id ?? `empty-${index}`}
            className={`flex ${id !== undefined ? 'animate-pop-in' : ''}`}
          >
            {id !== undefined ? (
              <TeamMemberCard
                id={id}
                pokemon={refFor(id)}
                unavailable={unavailable}
                onRemove={() => onRemove(id)}
              />
            ) : (
              <button
                type="button"
                onClick={onAddClick}
                className={`${DASHED_SLOT} cursor-pointer border-border-strong bg-surface text-sm font-extrabold text-ink hover:bg-surface-muted`}
              >
                {PLUS_ICON}
                Thêm Pokémon
                <span className="sr-only"> vào slot {index + 1}</span>
              </button>
            )}
          </li>
        )
      })}
      <li className="flex">
        {sixthId !== null ? (
          <TeamMemberCard
            id={sixthId}
            pokemon={refFor(sixthId)}
            unavailable={unavailable}
            badge="Đề xuất"
            onRemove={onRemoveSixth}
          />
        ) : isFull && suggestion ? (
          <div className={`${DASHED_SLOT} border-primary bg-primary/10`}>
            <span className="text-xs font-extrabold text-primary">Đề xuất</span>
            <span className="text-[0.9375rem] leading-5 font-extrabold break-words">
              {formatPokemonName(suggestion.name)}
            </span>
            <button
              type="button"
              onClick={onAddSuggestion}
              className={`${buttonClassName('primary', 'sm')} w-full px-1 text-xs whitespace-nowrap max-md:h-11`}
            >
              Thêm vào đội
            </button>
          </div>
        ) : (
          <div className={`${DASHED_SLOT} border-border-strong/60 bg-bg text-ink-muted`}>
            <span className="text-sm font-bold">Ô trống</span>
            <span className="text-xs font-bold">
              {isFull ? 'Chọn từ thẻ đề xuất' : 'Mở khi đủ 5 thành viên'}
            </span>
          </div>
        )}
      </li>
    </ul>
  )
}

type ReadOnlyTeamSlotsProps = {
  members: readonly TeamMember[]
}

export function ReadOnlyTeamSlots({ members }: ReadOnlyTeamSlotsProps) {
  return (
    <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(8.5rem,100%),1fr))] gap-3 md:grid-cols-[repeat(auto-fit,minmax(min(10.625rem,100%),1fr))] md:gap-3.5">
      {members.map((member, index) => (
        <li key={member.slot} className="flex animate-card-in" style={staggerDelay(index, 90, 200)}>
          <SharedMemberCard member={member} />
        </li>
      ))}
    </ul>
  )
}
