const numberFormat = new Intl.NumberFormat('vi-VN')

export function formatPokemonName(name: string): string {
  return name
    .split('-')
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function formatDexNumber(id: number): string {
  return `#${String(id).padStart(4, '0')}`
}

export function formatNumber(value: number): string {
  return numberFormat.format(value)
}

const decimalFormat = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 })

export function formatHeight(heightDm: number): string {
  return `${decimalFormat.format(heightDm / 10)} m`
}

export function formatWeight(weightHg: number): string {
  return `${decimalFormat.format(weightHg / 10)} kg`
}

const MULTIPLIER_LABELS: Record<string, string> = {
  '0': 'x0',
  '0.25': 'x¼',
  '0.5': 'x½',
  '1': 'x1',
  '2': 'x2',
  '4': 'x4',
}

export function formatMultiplier(multiplier: number): string {
  return MULTIPLIER_LABELS[String(multiplier)] ?? `x${decimalFormat.format(multiplier)}`
}
