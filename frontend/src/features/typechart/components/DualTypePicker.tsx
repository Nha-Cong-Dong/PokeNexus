import { buttonClassName } from '../../../components/ui/buttonStyles'
import { TYPE_NAMES, typeClassName, typeLabel } from '../../../lib/pokemonTypes'
import type { TypeName } from '../../../types/api'
import { MAX_DEFENDING_TYPES } from '../useDefendingTypes'

type DualTypePickerProps = {
  titleId: string
  selected: TypeName[]
  onToggle: (type: TypeName) => void
  onClear: () => void
}

const HELP_ID = 'dual-type-picker-help'
const CHIP_BASE =
  'chip-pop flex h-10 items-center gap-2 rounded-full border-2 px-2.5 text-left text-xs font-extrabold transition-colors duration-150 ease-out not-disabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-45'
const CHIP_OFF = 'border-border bg-surface text-ink not-disabled:hover:border-border-strong'

export function DualTypePicker({ titleId, selected, onToggle, onClear }: DualTypePickerProps) {
  const full = selected.length >= MAX_DEFENDING_TYPES

  return (
    <div className="min-w-0 flex-[1_1_26rem]">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <h2 id={titleId} className="text-2xl font-extrabold">
          Tính phòng thủ
        </h2>
        <button
          type="button"
          onClick={onClear}
          disabled={selected.length === 0}
          className={buttonClassName('ghost', 'sm')}
        >
          Bỏ chọn
        </button>
      </div>
      <p id={HELP_ID} className="mb-4 text-ink-muted">
        Chọn 1 hoặc 2 hệ của Pokémon phòng thủ.
      </p>
      <div
        role="group"
        aria-label="Hệ phòng thủ"
        aria-describedby={HELP_ID}
        className="grid grid-cols-3 gap-2 sm:grid-cols-[repeat(auto-fill,minmax(6.5rem,1fr))]"
      >
        {TYPE_NAMES.map((type) => {
          const pressed = selected.includes(type)
          return (
            <button
              key={type}
              type="button"
              aria-pressed={pressed}
              disabled={full && !pressed}
              onClick={() => onToggle(type)}
              className={`${CHIP_BASE} ${pressed ? `border-ink shadow-[0_3px_0_var(--color-ink)] ${typeClassName(type)}` : CHIP_OFF}`}
            >
              <span
                aria-hidden="true"
                className={`size-3 flex-none rounded-full ${typeClassName(type)} ${pressed ? 'ring-2 ring-white' : ''}`}
              />
              {typeLabel(type)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
