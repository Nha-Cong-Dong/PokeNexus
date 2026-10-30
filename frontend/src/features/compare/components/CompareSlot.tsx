import type { KeyboardEvent } from 'react'

import { DexNumber } from '../../../components/pokemon/DexNumber'
import { PokemonSearchBox } from '../../../components/pokemon/PokemonSearchBox'
import { buttonClassName } from '../../../components/ui/buttonStyles'
import { formatPokemonName } from '../../../lib/formatters'
import type { PokemonRef } from '../../../types/api'
import type { CompareSide } from '../useCompareSearchParams'

type CompareSlotProps = {
  side: CompareSide
  value: string | undefined
  pokemon: PokemonRef | undefined
  notFound: boolean
  failed: boolean
  excludeIds: readonly number[]
  editing: boolean
  toggleId: string
  searchId: string
  onToggle: () => void
  onClose: () => void
  onSelect: (pokemon: PokemonRef) => void
  onClear: () => void
}

type SlotStyle = {
  searchLabel: string
  sideName: string
  ordinal: string
  ordinalName: string
  column: string
  searchColumn: string
  frame: string
  stripe: string
  label: string
}

const SLOT_STYLES: Record<CompareSide, SlotStyle> = {
  left: {
    searchLabel: 'Pokémon bên trái',
    sideName: 'bên trái',
    ordinal: 'Pokémon 1',
    ordinalName: 'Bên trái',
    column: 'col-start-1',
    searchColumn: 'md:col-start-1',
    frame:
      'md:border-primary md:bg-[color-mix(in_oklab,var(--color-primary)_7%,var(--color-surface))]',
    stripe: 'bg-primary',
    label: 'md:text-primary-hover',
  },
  right: {
    searchLabel: 'Pokémon bên phải',
    sideName: 'bên phải',
    ordinal: 'Pokémon 2',
    ordinalName: 'Bên phải',
    column: 'col-start-3',
    searchColumn: 'md:col-start-3',
    frame:
      'md:border-accent md:bg-[color-mix(in_oklab,var(--color-accent)_7%,var(--color-surface))]',
    stripe:
      'bg-[repeating-linear-gradient(45deg,var(--color-accent)_0_4px,color-mix(in_oklab,var(--color-accent)_55%,var(--color-white))_4px_7px)] md:bg-[repeating-linear-gradient(180deg,var(--color-accent)_0_6px,transparent_6px_10px)]',
    label: 'md:text-[color-mix(in_oklab,var(--color-accent)_78%,var(--color-ink))]',
  },
}

const SEARCH_FRAMES: Record<CompareSide, string> = {
  left: 'border-primary bg-[color-mix(in_oklab,var(--color-primary)_7%,var(--color-surface))]',
  right: 'border-accent bg-[color-mix(in_oklab,var(--color-accent)_7%,var(--color-surface))]',
}

function statusText(value: string | undefined, notFound: boolean, failed: boolean): string {
  if (value === undefined) return 'Chưa chọn'
  if (notFound) return `Không tìm thấy Pokémon "${value}".`
  if (failed) return 'Chưa tải được Pokémon này.'
  return 'Đang tải…'
}

export function CompareSlot({
  side,
  value,
  pokemon,
  notFound,
  failed,
  excludeIds,
  editing,
  toggleId,
  searchId,
  onToggle,
  onClose,
  onSelect,
  onClear,
}: CompareSlotProps) {
  const style = SLOT_STYLES[side]
  const displayName = pokemon ? formatPokemonName(pokemon.name) : undefined
  const panelId = `${searchId}-panel`

  const closeOnEscape = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Escape' || event.isDefaultPrevented() || value === undefined) return
    event.preventDefault()
    onClose()
  }

  return (
    <>
      <div
        className={`relative row-start-1 flex h-15.5 min-w-0 items-center gap-2.5 overflow-hidden rounded-[14px] border-2 border-border bg-surface pr-2 max-md:has-focus-visible:outline-2 max-md:has-focus-visible:outline-offset-2 max-md:has-focus-visible:outline-focus-ring md:h-auto md:gap-3 md:py-2 md:pr-2 md:pl-3 ${style.column} ${style.frame} ${editing ? 'md:hidden' : ''}`}
      >
        <span
          aria-hidden="true"
          className={`w-2.5 flex-none self-stretch md:w-1.5 md:rounded-[3px] ${style.stripe}`}
        />
        <span className="flex min-w-0 flex-1 flex-col leading-5">
          <span
            className={`text-[13px] font-bold text-ink-muted md:text-xs md:leading-4 md:font-extrabold ${style.label}`}
          >
            <span className="md:hidden">{style.ordinal}</span>
            <span className="max-md:hidden">{style.ordinalName}</span>
          </span>
          {pokemon && displayName ? (
            <span className="truncate text-[17px] font-extrabold md:leading-6">
              {displayName}
              <DexNumber id={pokemon.id} className="ml-1.5 text-sm text-ink-muted max-lg:hidden" />
            </span>
          ) : (
            <span className="truncate text-sm font-bold text-ink-muted md:leading-6">
              {statusText(value, notFound, failed)}
            </span>
          )}
        </span>
        {value !== undefined && (
          <button
            id={toggleId}
            type="button"
            onClick={onToggle}
            aria-expanded={editing}
            aria-controls={panelId}
            aria-label={`Đổi Pokémon ${style.sideName}, hiện là ${displayName ?? value}`}
            className="flex flex-none cursor-pointer items-center justify-center text-ink-muted after:absolute after:inset-0 max-md:size-6 max-md:focus-visible:outline-none md:h-10 md:rounded-[10px] md:border-2 md:border-border md:bg-surface md:px-3.5 md:text-sm md:font-extrabold md:text-ink md:transition-colors md:after:hidden md:hover:bg-surface-muted"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`size-4.5 transition-transform duration-200 md:hidden ${editing ? 'rotate-180' : ''}`}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
            <span className="max-md:hidden">Đổi Pokémon</span>
          </button>
        )}
      </div>

      {editing && (
        <div
          id={panelId}
          onKeyDown={closeOnEscape}
          className={`col-span-3 flex min-w-0 items-end gap-2 rounded-[14px] border-2 py-2.5 pr-2.5 pl-3 md:col-span-1 md:row-start-1 md:py-2 md:pr-2 ${style.searchColumn} ${SEARCH_FRAMES[side]}`}
        >
          <span
            aria-hidden="true"
            className={`w-1.5 flex-none self-stretch rounded-[3px] ${style.stripe}`}
          />
          <div className="min-w-0 flex-1">
            <PokemonSearchBox
              id={searchId}
              label={style.searchLabel}
              onSelect={onSelect}
              excludeIds={excludeIds}
              placeholder={value ? 'Tìm Pokémon khác' : 'Ví dụ: garchomp'}
            />
          </div>
          {value !== undefined && (
            <>
              <button
                type="button"
                onClick={onClear}
                aria-label={`Bỏ chọn ${displayName ?? value}`}
                className={`flex-none max-md:h-11 ${buttonClassName('ghost', 'sm')}`}
              >
                Bỏ chọn
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label={`Đóng ô tìm Pokémon ${style.sideName}`}
                className="inline-flex size-11 flex-none cursor-pointer items-center justify-center rounded-[10px] text-ink-muted transition-colors hover:bg-surface-muted"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  className="size-5"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}
