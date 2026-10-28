import type { SceneId } from './scenes'

const ARTWORK_BASE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'

export const PLACEHOLDER_URL = '/sprites/placeholder.svg'

export const SCENE_WIDTHS = [960, 1920] as const

export type SceneWidth = (typeof SCENE_WIDTHS)[number]

export function getSpriteUrl(id: number): string {
  return `/sprites/pokemon/${id}.png`
}

export function getArtworkUrl(id: number): string {
  return `${ARTWORK_BASE_URL}/${id}.png`
}

export function sceneUrl(scene: SceneId, photo: number, width: SceneWidth): string {
  return `/scenes/${scene}-${photo}-${width}.webp`
}

export function sceneSrcSet(scene: SceneId, photo: number): string {
  return SCENE_WIDTHS.map((width) => `${sceneUrl(scene, photo, width)} ${width}w`).join(', ')
}
