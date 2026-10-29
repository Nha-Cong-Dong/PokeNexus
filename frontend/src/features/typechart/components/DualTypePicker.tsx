import { buttonClassName } from '../../../components/ui/buttonStyles'
import { TYPE_NAMES, typeClassName, typeLabel, typeScopeClassName } from '../../../lib/pokemonTypes'
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
  'chip-pop flex h-10.5 items-center justify-center rounded-full border-2 px-2 text-center text-sm font-extrabold transition-[transform,background-color,border-color] duration-150 ease-out not-disabled:cursor-pointer not-disabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 md:h-10 md:text-[13px]'
const CHIP_ON = 'border-ink shadow-[0_3px_0_var(--color-ink)]'
const CHIP_OFF = 'border-(--type-base) bg-surface text-ink'

function compactHint(count: number): string {
  if (count >= MAX_DEFENDING_TYPES) return 'Đã chọn đủ 2 hệ. Chạm một hệ đang chọn để đổi.'
  if (count === 1) return 'Chọn thêm 1 hệ cho Pokémon hệ kép.'
  return 'Chọn 1 hoặc 2 hệ.'
}

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
        <span className="hidden lg:inline">Chọn 1 hoặc 2 hệ của Pokémon phòng thủ.</span>
        <span className="lg:hidden">{compactHint(selected.length)}</span>
      </p>
      <div
        role="group"
        aria-label="Hệ phòng thủ"
        aria-describedby={HELP_ID}
        className="grid grid-cols-3 gap-2 sm:grid-cols-[repeat(auto-fill,minmax(6rem,1fr))]"
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
              className={`${CHIP_BASE} ${typeScopeClassName(type)} ${pressed ? `${CHIP_ON} ${typeClassName(type)}` : CHIP_OFF}`}
            >
              {typeLabel(type)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
