import { useRef, useState, type KeyboardEvent } from 'react'
import { Link, NavLink } from 'react-router'

import { NAV_ITEMS } from './navItems'

const MOBILE_NAV_ID = 'mobile-nav'
const ON_RED_FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

function desktopLinkClass({ isActive }: { isActive: boolean }): string {
  const base = `flex h-15 items-center border-b-3 px-3.5 text-base font-bold text-white hover:bg-dex-red-hover ${ON_RED_FOCUS}`
  return isActive ? `${base} border-dex-yellow font-extrabold` : `${base} border-transparent`
}

function mobileLinkClass({ isActive }: { isActive: boolean }): string {
  const base = `flex min-h-11 items-center rounded-[10px] border-l-4 px-3 text-base font-bold text-white hover:bg-dex-red ${ON_RED_FOCUS}`
  return isActive ? `${base} border-dex-yellow bg-dex-red` : `${base} border-transparent`
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Escape' || !menuOpen) return
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  return (
    <header
      className="sticky top-0 z-40 bg-dex-red text-white shadow-header"
      onKeyDown={handleKeyDown}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-5 px-4 md:grid md:h-15 md:grid-cols-[1fr_auto_1fr] md:px-6">
        <Link
          to="/"
          className={`flex min-h-10 flex-none items-center gap-2.5 justify-self-start rounded-[10px] text-white ${ON_RED_FOCUS}`}
        >
          <span
            aria-hidden="true"
            className="size-6.5 rounded-full border-3 border-white bg-radial-[at_35%_30%] from-white from-10% via-primary via-40% to-primary-hover shadow-[0_0_0_2px_var(--color-scrim)]"
          />
          <span className="font-display text-2xl">PokeNexus</span>
        </Link>

        <nav
          aria-label="Điều hướng chính"
          className="hidden self-stretch md:block md:justify-self-center"
        >
          <ul className="flex h-full items-stretch gap-0.5">
            {NAV_ITEMS.map((item) => (
              <li key={item.to} className="flex">
                <NavLink to={item.to} end={item.to === '/'} className={desktopLinkClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          className={`ml-auto flex h-11 items-center gap-2 rounded-xl bg-dex-red-hover px-3.5 text-base font-extrabold text-white md:hidden ${ON_RED_FOCUS}`}
          aria-expanded={menuOpen}
          aria-controls={MOBILE_NAV_ID}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-5.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          >
            <path d="M4 7h16 M4 12h16 M4 17h16" />
          </svg>
          Menu
        </button>
      </div>

      {menuOpen && (
        <nav
          id={MOBILE_NAV_ID}
          aria-label="Điều hướng di động"
          className="border-t border-dex-red bg-dex-red-hover md:hidden"
        >
          <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-3 py-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={mobileLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
