import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
} from 'react'
import { Link } from 'react-router'

export const LONG_PRESS_MS = 1500
const MOVE_TOLERANCE_PX = 10
const VIEWPORT_GAP_PX = 8

type PendingPress = { timer: number; x: number; y: number }

type MemberDetailPopoverProps = {
  pokemonName: string
  displayName: string
  className?: string
  children: ReactNode
}

const ARROW_ICON = (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="size-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export function MemberDetailPopover({
  pokemonName,
  displayName,
  className = '',
  children,
}: MemberDetailPopoverProps) {
  const [open, setOpen] = useState(false)
  const [shift, setShift] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const pressRef = useRef<PendingPress | null>(null)
  const lastPointerDownRef = useRef(Number.NEGATIVE_INFINITY)

  const cancelPress = () => {
    if (pressRef.current) {
      window.clearTimeout(pressRef.current.timer)
      pressRef.current = null
    }
  }

  useEffect(() => cancelPress, [])

  useLayoutEffect(() => {
    const popover = popoverRef.current
    if (!open || !popover) {
      setShift(0)
      return
    }
    const rect = popover.getBoundingClientRect()
    const maxRight = document.documentElement.clientWidth - VIEWPORT_GAP_PX
    if (rect.left < VIEWPORT_GAP_PX) setShift(VIEWPORT_GAP_PX - rect.left)
    else if (rect.right > maxRight) setShift(maxRight - rect.right)
  }, [open])

  useEffect(() => {
    if (!open) return
    const closeOnOutsidePress = (event: globalThis.PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsidePress)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePress)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  const handlePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') setOpen(true)
  }

  const handlePointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') setOpen(false)
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    lastPointerDownRef.current = Date.now()
    if (event.pointerType === 'mouse') return
    if ((event.target as Element).closest('button, a')) return
    cancelPress()
    pressRef.current = {
      x: event.clientX,
      y: event.clientY,
      timer: window.setTimeout(() => {
        pressRef.current = null
        setOpen(true)
      }, LONG_PRESS_MS),
    }
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const press = pressRef.current
    if (press && Math.hypot(event.clientX - press.x, event.clientY - press.y) > MOVE_TOLERANCE_PX) {
      cancelPress()
    }
  }

  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    const fromPointer = Date.now() - lastPointerDownRef.current < LONG_PRESS_MS
    if (event.target === event.currentTarget && !fromPointer) setOpen(true)
  }

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false)
  }

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      aria-label={`${displayName}. Rê chuột, giữ 1,5 giây hoặc nhấn Tab để xem thông tin chi tiết`}
      data-testid="member-detail-trigger"
      data-popover-open={open}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={cancelPress}
      onPointerCancel={cancelPress}
      onContextMenu={(event) => {
        if (pressRef.current) event.preventDefault()
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={`relative w-full rounded-2xl select-none [-webkit-touch-callout:none] ${className}`}
    >
      {children}
      {open && (
        <div
          ref={popoverRef}
          className="absolute top-full left-1/2 z-30 w-max pt-2"
          style={{ transform: `translateX(calc(-50% + ${shift}px))` }}
        >
          <Link
            to={`/pokemon/${pokemonName}`}
            className="flex min-h-11 animate-pop-in items-center gap-1.5 rounded-xl border-2 border-ink bg-surface px-3 text-sm font-extrabold text-ink shadow-block hover:bg-surface-muted"
          >
            Xem thông tin chi tiết
            <span className="sr-only"> của {displayName}</span>
            {ARROW_ICON}
          </Link>
        </div>
      )}
    </div>
  )
}
