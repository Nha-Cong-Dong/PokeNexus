import { TYPE_NAMES, typeClassName, typeLabel } from '../../../lib/pokemonTypes'
import type { FormCategory, TypeName } from '../../../types/api'
import {
  FORM_CATEGORIES,
  MAX_GENERATION,
  type DexFilter,
  type DexFilterChange,
} from '../useDexSearchParams'
import { StatRangeFields } from './StatRangeFields'

type DexFiltersProps = {
  filter: DexFilter
  onChange: (change: DexFilterChange) => void
  layout?: 'sidebar' | 'sheet'
}

const FORM_LABELS: Record<FormCategory, string> = {
  DEFAULT: 'Mặc định',
  REGIONAL: 'Vùng miền',
  MEGA: 'Mega',
  GMAX: 'Gmax',
  OTHER: 'Khác',
}

const MAX_TYPES = 2
const GENERATIONS = Array.from({ length: MAX_GENERATION }, (_, index) => index + 1)
const LEGEND_CLASS = 'mb-2.5 text-sm font-bold'
const CHIP_BASE =
  'border-2 font-extrabold transition-colors duration-150 ease-out not-disabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-45'
const CHIP_OFF = 'border-border bg-surface text-ink not-disabled:hover:border-border-strong'
const CHIP_ON_DARK = 'border-ink bg-ink text-surface'

export function DexFilters({ filter, onChange, layout = 'sidebar' }: DexFiltersProps) {
  const typesFull = filter.types.length >= MAX_TYPES

  const toggleType = (type: TypeName) => {
    const types = filter.types.includes(type)
      ? filter.types.filter((item) => item !== type)
      : [...filter.types, type].slice(0, MAX_TYPES)
    onChange({ types })
  }

  const toggleForm = (form: FormCategory) => {
    const forms = filter.forms.includes(form)
      ? filter.forms.filter((item) => item !== form)
      : [...filter.forms, form]
    onChange({ forms })
  }

  return (
    <form
      aria-label="Bộ lọc Pokédex"
      className="flex flex-col gap-5.5"
      onSubmit={(event) => event.preventDefault()}
    >
      <fieldset>
        <legend className={LEGEND_CLASS}>
          Hệ <span className="font-semibold text-ink-muted">(tối đa 2)</span>
        </legend>
        <div className={`grid gap-1.5 ${layout === 'sheet' ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {TYPE_NAMES.map((type) => {
            const selected = filter.types.includes(type)
            return (
              <button
                key={type}
                type="button"
                aria-pressed={selected}
                disabled={typesFull && !selected}
                onClick={() => toggleType(type)}
                className={`flex h-9 items-center gap-2 rounded-full px-2.5 text-left text-xs ${CHIP_BASE} ${selected ? `border-ink ${typeClassName(type)}` : CHIP_OFF}`}
              >
                <span
                  aria-hidden="true"
                  className={`size-3 flex-none rounded-full ${typeClassName(type)} ${selected ? 'ring-2 ring-white' : ''}`}
                />
                {typeLabel(type)}
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className={LEGEND_CLASS}>Thế hệ</legend>
        <div className="grid grid-cols-5 gap-1.5">
          {GENERATIONS.map((gen) => {
            const selected = filter.gen === gen
            return (
              <button
                key={gen}
                type="button"
                aria-pressed={selected}
                aria-label={`Thế hệ ${gen}`}
                onClick={() => onChange({ gen: selected ? undefined : gen })}
                className={`h-10 rounded-[10px] text-[15px] ${CHIP_BASE} ${selected ? CHIP_ON_DARK : CHIP_OFF}`}
              >
                {gen}
              </button>
            )
          })}
        </div>
      </fieldset>

      <StatRangeFields
        minBst={filter.minBst}
        maxBst={filter.maxBst}
        minSpeed={filter.minSpeed}
        onCommit={onChange}
      />

      <fieldset>
        <legend className={LEGEND_CLASS}>
          Dạng <span className="font-semibold text-ink-muted">(mặc định: Mặc định, Vùng miền)</span>
        </legend>
        <div className="flex flex-wrap gap-1.5">
          {FORM_CATEGORIES.map((form) => {
            const selected = filter.forms.includes(form)
            return (
              <button
                key={form}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleForm(form)}
                className={`h-9 rounded-full px-3 text-xs ${CHIP_BASE} ${selected ? CHIP_ON_DARK : CHIP_OFF}`}
              >
                {FORM_LABELS[form]}
              </button>
            )
          })}
        </div>
      </fieldset>
    </form>
  )
}
