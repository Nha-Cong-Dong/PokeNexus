import { useEffect, useId, useRef, type ReactNode } from 'react'

type FilterSheetProps = {
  open: boolean
  onClose: () => void
  children: ReactNode
  footer: ReactNode
}

export function FilterSheet({ open, onClose, children, footer }: FilterSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className="fixed inset-x-0 top-auto bottom-0 m-0 max-h-[85dvh] w-full max-w-none overflow-y-auto rounded-t-[26px] border-t-3 border-ink bg-surface p-0 text-ink backdrop:bg-scrim/55 open:animate-sheet-in lg:hidden"
    >
      <div className="flex flex-col gap-4.5 px-4 pt-2.5 pb-4.5">
        <span aria-hidden="true" className="h-1.5 w-12 self-center rounded-full bg-border" />
        <div className="flex items-center justify-between">
          <h2 id={titleId} className="text-2xl font-extrabold">
            Bộ lọc
          </h2>
          <button
            type="button"
            aria-label="Đóng bộ lọc"
            onClick={onClose}
            className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-surface-muted"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        {open && children}
        <div className="flex gap-2.5 pt-1">{footer}</div>
      </div>
    </dialog>
  )
}
