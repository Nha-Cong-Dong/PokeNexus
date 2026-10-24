import { buttonClassName } from './buttonStyles'
import { GameDialog } from './GameDialog'

type ErrorStateProps = {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <GameDialog role="alert" speaker="Pokédex" className="mx-auto my-6 max-w-155">
      <p className="text-lg font-bold">{message}</p>
      <button type="button" onClick={onRetry} className={`mt-4 ${buttonClassName('primary')}`}>
        Thử lại
      </button>
    </GameDialog>
  )
}
