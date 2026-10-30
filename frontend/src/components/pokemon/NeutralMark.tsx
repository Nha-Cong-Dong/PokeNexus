type NeutralMarkProps = {
  className?: string
}

export function NeutralMark({ className = '' }: NeutralMarkProps) {
  return (
    <>
      <span
        aria-hidden="true"
        className={`inline-block size-1.5 rounded-full bg-border ${className}`}
      />
      <span className="sr-only">x1</span>
    </>
  )
}
