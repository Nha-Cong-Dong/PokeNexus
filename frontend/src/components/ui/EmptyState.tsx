import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  action?: ReactNode
}

export function EmptyState({ title, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border p-8 text-center">
      <p className="text-text-muted">{title}</p>
      {action}
    </div>
  )
}
