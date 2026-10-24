import type { ComponentPropsWithoutRef } from 'react'

export function Panel({ className = '', ...props }: ComponentPropsWithoutRef<'section'>) {
  return (
    <section
      className={`rounded-3xl border-2 border-ink bg-surface p-5 shadow-block-lg md:p-6 ${className}`}
      {...props}
    />
  )
}
