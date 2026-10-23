const ARTWORK_BASE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'

export const PLACEHOLDER_URL = '/sprites/placeholder.svg'

export function getSpriteUrl(id: number): string {
  return `/sprites/pokemon/${id}.png`
}

export function getArtworkUrl(id: number): string {
  return `${ARTWORK_BASE_URL}/${id}.png`
}
