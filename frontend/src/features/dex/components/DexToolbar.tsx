import { useId } from 'react'

import { SORT_OPTIONS, type DexSort } from '../useDexSearchParams'

type DexToolbarProps = {
  sort: DexSort
  activeCount: number
  onSortChange: (sort: DexSort) => void
  onOpenFilters: () => void
}

const SORT_LABELS: Record<DexSort, string> = {
  'id,asc': 'Số Pokédex',
  'name,asc': 'Tên A–Z',
  'baseStatTotal,desc': 'BST cao trước',
  'speed,desc': 'Tốc độ cao trước',
}

export function DexToolbar({ sort, activeCount, onSortChange, onOpenFilters }: DexToolbarProps) {
  const sortId = useId()

  return (
    <div className="flex items-center gap-2 rounded-[20px] border-2 border-ink bg-surface p-3.5 shadow-block-lg max-lg:order-first lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
      <button
        type="button"
        onClick={onOpenFilters}
        className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-ink bg-dex-yellow text-base font-extrabold text-ink shadow-[0_3px_0_var(--color-ink)] active:translate-y-0.5 active:shadow-none lg:hidden"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        >
          <path d="M4 6h16 M7 12h10 M10 18h4" />
        </svg>
        Bộ lọc{activeCount > 0 ? ` (${activeCount})` : ''}
      </button>

      <div className="flex flex-1 items-center gap-2.5 lg:flex-none">
        <label htmlFor={sortId} className="sr-only text-sm font-bold text-ink-muted lg:not-sr-only">
          Sắp xếp
        </label>
        <select
          id={sortId}
          value={sort}
          onChange={(event) => onSortChange(event.target.value as DexSort)}
          className="h-11 w-full rounded-xl border-2 border-border-strong bg-surface px-2.5 text-[15px] font-bold text-ink lg:h-10 lg:w-auto lg:rounded-[10px] lg:px-3"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {SORT_LABELS[option]}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
