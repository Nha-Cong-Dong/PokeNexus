import { buttonClassName } from '../../../components/ui/buttonStyles'
import { formatPokemonName } from '../../../lib/formatters'
import type { PokemonRef, TeamMember } from '../../../types/api'
import { MAX_DRAFT_SIZE } from '../useTeamDraft'
import { TeamMemberCard } from './TeamMemberCard'

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
  'flex min-h-40 w-full flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed p-2 text-center'

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
    <ul className="grid grid-cols-3 gap-x-2 gap-y-3 lg:grid-cols-2">
      {Array.from({ length: MAX_DRAFT_SIZE }, (_, index) => {
        const id = ids[index]
        return (
          <li key={id ?? `empty-${index}`} className="flex">
            {id !== undefined ? (
              <TeamMemberCard
                id={id}
                pokemon={refFor(id)}
                unavailable={unavailable}
                slotLabel={`Slot ${index + 1}`}
                onRemove={() => onRemove(id)}
              />
            ) : (
              <button
                type="button"
                onClick={onAddClick}
                className={`${DASHED_SLOT} cursor-pointer border-border-strong bg-surface text-sm font-extrabold hover:bg-surface-muted`}
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
            slotLabel="Slot 6 · đề xuất"
            onRemove={onRemoveSixth}
          />
        ) : isFull && suggestion ? (
          <div className={`${DASHED_SLOT} border-primary bg-primary/10`}>
            <span className="text-xs font-extrabold text-primary">Slot 6 · đề xuất</span>
            <span className="text-sm font-extrabold break-words">
              {formatPokemonName(suggestion.name)}
            </span>
            <button
              type="button"
              onClick={onAddSuggestion}
              className={`${buttonClassName('primary', 'sm')} px-2.5 text-xs`}
            >
              Thêm vào đội
            </button>
          </div>
        ) : (
          <div className={`${DASHED_SLOT} border-border bg-surface-muted text-ink-muted`}>
            <span className="text-xs font-extrabold">Slot 6</span>
            <span className="text-xs font-bold">
              {isFull ? 'Chọn từ thẻ đề xuất' : 'Mở khi đội đủ 5 thành viên'}
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
    <ul className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
      {members.map((member) => (
        <li key={member.slot} className="flex">
          <TeamMemberCard
            id={member.id}
            pokemon={member}
            nickname={member.nickname}
            slotLabel={`Slot ${member.slot}`}
            linkToDetail
          />
        </li>
      ))}
    </ul>
  )
}
