import { buttonClassName } from './buttonStyles'
import { pageItems } from './pageItems'

type PaginationProps = {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

const OUTLINE_CLASS =
  'inline-flex h-10 min-w-10 items-center justify-center rounded-[10px] border-2 border-border bg-surface px-3.5 text-sm font-extrabold text-ink not-disabled:hover:border-border-strong disabled:cursor-not-allowed disabled:text-ink-muted disabled:opacity-60'

const CURRENT_CLASS =
  'inline-flex h-10 min-w-10 items-center justify-center rounded-[10px] bg-ink text-sm font-extrabold text-surface'

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null
  const isLast = page >= totalPages - 1

  return (
    <nav
      aria-label="Phân trang"
      className="mt-6 flex flex-wrap items-center justify-between gap-1.5 sm:mt-7 sm:justify-center"
    >
      <button
        type="button"
        className={OUTLINE_CLASS}
        disabled={page <= 0}
        onClick={() => onChange(page - 1)}
      >
        Trước
      </button>
      <ul className="hidden items-center gap-1.5 sm:flex">
        {pageItems(page, totalPages).map((item, index) =>
          item === 'gap' ? (
            <li
              key={`gap-${index}`}
              aria-hidden="true"
              className="px-1 font-extrabold text-ink-muted"
            >
              …
            </li>
          ) : (
            <li key={item}>
              {item === page ? (
                <span aria-current="page" className={CURRENT_CLASS}>
                  <span className="sr-only">Trang </span>
                  {item + 1}
                </span>
              ) : (
                <button
                  type="button"
                  className={OUTLINE_CLASS}
                  aria-label={`Trang ${item + 1}`}
                  onClick={() => onChange(item)}
                >
                  {item + 1}
                </button>
              )}
            </li>
          ),
        )}
      </ul>
      <span className="font-pixel text-lg font-bold sm:hidden">
        {page + 1} / {totalPages}
      </span>
      <button
        type="button"
        className={buttonClassName('primary', 'sm')}
        disabled={isLast}
        onClick={() => onChange(page + 1)}
      >
        Sau
      </button>
    </nav>
  )
}
