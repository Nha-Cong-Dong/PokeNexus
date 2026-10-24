import type { DexView } from '../useDexSearchParams'

type ViewToggleProps = {
  view: DexView
  onChange: (view: DexView) => void
}

const VIEW_OPTIONS: { view: DexView; label: string; icon: string }[] = [
  {
    view: 'cards',
    label: 'Thẻ màu',
    icon: 'M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z',
  },
  { view: 'list', label: 'Danh sách', icon: 'M4 6h16 M4 12h16 M4 18h16' },
]

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div
      role="group"
      aria-label="Kiểu hiển thị"
      className="flex flex-none gap-0.5 rounded-xl bg-surface-muted p-0.75"
    >
      {VIEW_OPTIONS.map((option) => {
        const selected = view === option.view
        return (
          <button
            key={option.view}
            type="button"
            aria-pressed={selected}
            aria-label={option.label}
            title={option.label}
            onClick={() => onChange(option.view)}
            className={`flex h-9.5 w-10.5 cursor-pointer items-center justify-center rounded-[9px] transition-colors duration-150 ${selected ? 'bg-surface shadow-block' : ''}`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={option.icon} />
            </svg>
          </button>
        )
      })}
    </div>
  )
}
