const NEUTRAL = 'bg-mult-1 text-ink-muted'

const MULTIPLIER_CLASSES: Record<string, string> = {
  '0': 'bg-mult-0 text-on-primary',
  '0.25': 'bg-mult-025 text-on-primary',
  '0.5': 'bg-mult-05 text-ink',
  '1': NEUTRAL,
  '2': 'bg-mult-2 text-ink',
  '4': 'bg-mult-4 text-on-primary',
}

export function multiplierClassName(multiplier: number): string {
  return MULTIPLIER_CLASSES[String(multiplier)] ?? NEUTRAL
}

export function multiplierWeightClassName(multiplier: number): string {
  return multiplier === 0 || multiplier === 4 ? 'font-extrabold' : 'font-bold'
}
