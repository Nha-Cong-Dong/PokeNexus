import type { ReactNode } from 'react'

import { GameDialog } from './GameDialog'

type EmptyStateProps = {
  title: string
  description?: string
  action?: ReactNode
  speaker?: string
}

export function EmptyState({ title, description, action, speaker = 'Pokédex' }: EmptyStateProps) {
  return (
    <GameDialog speaker={speaker} className="mx-auto my-6 max-w-155">
      <h3 className="text-xl font-extrabold">{title}</h3>
      {description && <p className="mt-1.5 text-ink-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </GameDialog>
  )
}
