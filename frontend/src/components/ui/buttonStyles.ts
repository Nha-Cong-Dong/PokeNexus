export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'cta'
export type ButtonSize = 'sm' | 'md'

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-[10px] font-extrabold transition-[transform,box-shadow,background-color] duration-150 ease-out not-disabled:cursor-pointer not-disabled:active:translate-y-0.5 not-disabled:active:shadow-none disabled:cursor-not-allowed disabled:opacity-50'

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-on-primary shadow-[0_3px_0_var(--color-primary-hover)] not-disabled:hover:bg-primary-hover',
  secondary:
    'border-2 border-ink bg-surface text-ink shadow-[0_3px_0_var(--color-ink)] not-disabled:hover:bg-surface-muted',
  ghost: 'text-primary not-disabled:hover:bg-surface-muted',
  cta: 'border-2 border-ink bg-dex-yellow text-ink shadow-[0_3px_0_var(--color-ink)]',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-base',
}

export function buttonClassName(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
): string {
  return `${BASE} ${VARIANTS[variant]} ${SIZES[size]}`
}
