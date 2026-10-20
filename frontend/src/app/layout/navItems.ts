export type NavItem = {
  to: string
  label: string
}

export const NAV_ITEMS: readonly NavItem[] = [
  { to: '/', label: 'Pokédex' },
  { to: '/types', label: 'Tương khắc' },
  { to: '/compare', label: 'So sánh' },
  { to: '/team-builder', label: 'Xây đội' },
]
