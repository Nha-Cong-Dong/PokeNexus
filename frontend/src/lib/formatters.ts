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
