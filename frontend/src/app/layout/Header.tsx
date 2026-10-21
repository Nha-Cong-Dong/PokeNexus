import { useState } from 'react'
import { Link, NavLink } from 'react-router'

import { NAV_ITEMS } from './navItems'

const MOBILE_NAV_ID = 'mobile-nav'

function navLinkClass({ isActive }: { isActive: boolean }): string {
  const base = 'flex min-h-10 items-center rounded-md px-3 text-sm font-medium'
  return isActive
    ? `${base} bg-primary text-on-primary`
    : `${base} text-text-muted hover:bg-surface-muted hover:text-text`
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
        <Link to="/" className="text-lg font-bold text-text">
          PokeNexus
        </Link>

        <nav aria-label="Điều hướng chính" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.to === '/'} className={navLinkClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="flex min-h-10 items-center rounded-md border border-border px-3 text-sm font-medium text-text md:hidden"
          aria-expanded={menuOpen}
          aria-controls={MOBILE_NAV_ID}
          onClick={() => setMenuOpen((open) => !open)}
        >
          Menu
        </button>
      </div>

      {menuOpen && (
        <nav
          id={MOBILE_NAV_ID}
          aria-label="Điều hướng di động"
          className="border-t border-border bg-surface md:hidden"
        >
          <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={navLinkClass}
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
