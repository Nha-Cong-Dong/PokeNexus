import type { ComponentPropsWithoutRef } from 'react'

type GameDialogProps = ComponentPropsWithoutRef<'div'> & {
  speaker?: string
}

export function GameDialog({ speaker, className = '', children, ...props }: GameDialogProps) {
  return (
    <div
      className={`relative rounded-xl border-3 border-ink bg-surface px-6 pt-7 pb-6 outline-2 -outline-offset-8 outline-border md:px-7 ${className}`}
      {...props}
    >
      {speaker && (
        <span className="absolute -top-4 left-5 rounded-full bg-ink px-3.5 py-1 text-sm font-extrabold text-surface">
          {speaker}
        </span>
      )}
      {children}
    </div>
  )
}
