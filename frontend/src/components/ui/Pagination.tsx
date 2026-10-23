type PaginationProps = {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

const BUTTON_CLASS =
  'min-h-10 rounded-md border border-border bg-surface px-4 text-sm font-medium hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50'

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null
  return (
    <nav aria-label="Phân trang" className="flex items-center justify-center gap-3">
      <button
        type="button"
        className={BUTTON_CLASS}
        disabled={page <= 0}
        onClick={() => onChange(page - 1)}
      >
        Trước
      </button>
      <span className="text-sm">
        Trang {page + 1} / {totalPages}
      </span>
      <button
        type="button"
        className={BUTTON_CLASS}
        disabled={page >= totalPages - 1}
        onClick={() => onChange(page + 1)}
      >
        Sau
      </button>
    </nav>
  )
}
