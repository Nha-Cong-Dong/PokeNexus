import { TYPE_NAMES } from '../../../lib/pokemonTypes'
import type { FormCategory, TypeName } from '../../../types/api'
import {
  FORM_CATEGORIES,
  MAX_GENERATION,
  SORT_OPTIONS,
  type DexFilter,
  type DexFilterChange,
  type DexSort,
} from '../useDexSearchParams'

type DexFiltersProps = {
  filter: DexFilter
  onChange: (change: DexFilterChange) => void
  onClear: () => void
}

const FORM_LABELS: Record<FormCategory, string> = {
  DEFAULT: 'Mặc định',
  REGIONAL: 'Vùng miền',
  MEGA: 'Mega',
  GMAX: 'Gmax',
  OTHER: 'Khác',
}

const SORT_LABELS: Record<DexSort, string> = {
  'id,asc': 'Số Pokédex tăng dần',
  'name,asc': 'Tên A-Z',
  'baseStatTotal,desc': 'Tổng chỉ số giảm dần',
  'speed,desc': 'Tốc độ giảm dần',
}

const FIELD_CLASS = 'min-h-10 w-full rounded-md border border-border bg-surface px-2 text-sm'
const GENERATIONS = Array.from({ length: MAX_GENERATION }, (_, index) => index + 1)

export function DexFilters({ filter, onChange, onClear }: DexFiltersProps) {
  const [firstType, secondType] = filter.types

  const setType = (slot: 0 | 1, value: string) => {
    const next: (TypeName | undefined)[] = [firstType, secondType]
    next[slot] = value === '' ? undefined : (value as TypeName)
    onChange({ types: [...new Set(next.filter((type): type is TypeName => type !== undefined))] })
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
      className="flex flex-col gap-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <label className="flex flex-col gap-1 text-sm font-medium">
        Hệ thứ nhất
        <select
          className={FIELD_CLASS}
          value={firstType ?? ''}
          onChange={(event) => setType(0, event.target.value)}
        >
          <option value="">Tất cả</option>
          {TYPE_NAMES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Hệ thứ hai
        <select
          className={FIELD_CLASS}
          value={secondType ?? ''}
          disabled={firstType === undefined}
          onChange={(event) => setType(1, event.target.value)}
        >
          <option value="">Tất cả</option>
          {TYPE_NAMES.filter((type) => type !== firstType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Thế hệ
        <select
          className={FIELD_CLASS}
          value={filter.gen ?? ''}
          onChange={(event) =>
            onChange({ gen: event.target.value === '' ? undefined : Number(event.target.value) })
          }
        >
          <option value="">Tất cả</option>
          {GENERATIONS.map((gen) => (
            <option key={gen} value={gen}>
              Thế hệ {gen}
            </option>
          ))}
        </select>
      </label>
      <fieldset className="flex flex-col gap-1 text-sm">
        <legend className="mb-1 font-medium">Dạng (mặc định: Mặc định và Vùng miền)</legend>
        {FORM_CATEGORIES.map((form) => (
          <label key={form} className="flex min-h-8 items-center gap-2">
            <input
              type="checkbox"
              checked={filter.forms.includes(form)}
              onChange={() => toggleForm(form)}
            />
            {FORM_LABELS[form]}
          </label>
        ))}
      </fieldset>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Sắp xếp
        <select
          className={FIELD_CLASS}
          value={filter.sort}
          onChange={(event) => onChange({ sort: event.target.value as DexSort })}
        >
          {SORT_OPTIONS.map((sort) => (
            <option key={sort} value={sort}>
              {SORT_LABELS[sort]}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        onClick={onClear}
        className="min-h-10 rounded-md border border-border bg-surface-muted px-4 text-sm font-medium hover:border-border-strong"
      >
        Xóa bộ lọc
      </button>
    </form>
  )
}
