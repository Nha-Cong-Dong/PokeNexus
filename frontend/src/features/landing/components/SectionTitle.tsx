type SectionTitleProps = {
  id: string
  children: string
  tone?: 'light' | 'dark'
}

export function SectionTitle({ id, children, tone = 'light' }: SectionTitleProps) {
  return (
    <h2
      id={id}
      className={`flex items-center gap-3 font-display text-display font-normal md:text-[2.5rem]/[2.75rem] ${tone === 'dark' ? 'text-white' : 'text-ink'}`}
    >
      <span
        aria-hidden="true"
        className="inline-block h-8 w-3 flex-none -skew-x-12 rounded-sm border-2 border-ink bg-dex-yellow md:h-10"
      />
      {children}
    </h2>
  )
}
