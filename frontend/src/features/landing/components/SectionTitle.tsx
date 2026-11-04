type SectionTitleProps = {
  id: string
  children: string
  tone?: 'light' | 'dark'
}

export function SectionTitle({ id, children, tone = 'light' }: SectionTitleProps) {
  return (
    <h2
      id={id}
      className={`flex items-center gap-3 font-display text-[1.5rem]/[1.875rem] font-normal sm:text-display md:text-[2.5rem]/[2.75rem] ${tone === 'dark' ? 'text-white' : 'text-ink'}`}
    >
      <span
        aria-hidden="true"
        className="inline-block h-7 w-3 flex-none -skew-x-12 rounded-sm border-2 border-ink bg-dex-yellow sm:h-8 md:h-10"
      />
      {children}
    </h2>
  )
}
