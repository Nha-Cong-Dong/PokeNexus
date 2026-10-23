type ErrorStateProps = {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-lg border border-danger p-8 text-center"
    >
      <p>{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="min-h-10 rounded-md bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover"
      >
        Thử lại
      </button>
    </div>
  )
}
