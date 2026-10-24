import type { TypeName } from '../types/api'

export type SceneId =
  | 'grassland'
  | 'forest'
  | 'sea'
  | 'volcano'
  | 'power-plant'
  | 'snowfield'
  | 'mountain'
  | 'desert'
  | 'swamp'
  | 'sky'
  | 'ruins'
  | 'haunted'
  | 'flower-garden'
  | 'stadium'
  | 'lab'

export interface Scene {
  name: string
  top: string
  bottom: string
  photo: boolean
}

export const SCENES: Record<SceneId, Scene> = {
  grassland: { name: 'Đồng cỏ', top: '#9fd3f5', bottom: '#7fbf5a', photo: true },
  forest: { name: 'Rừng rậm', top: '#7db7a0', bottom: '#2f6b3a', photo: false },
  sea: { name: 'Biển khơi', top: '#8acff2', bottom: '#1f6fb2', photo: false },
  volcano: { name: 'Núi lửa', top: '#f2a15c', bottom: '#6b2a1e', photo: false },
  'power-plant': { name: 'Nhà máy điện', top: '#c9d3de', bottom: '#56606e', photo: false },
  snowfield: { name: 'Núi tuyết', top: '#ddeff8', bottom: '#a9c9de', photo: false },
  mountain: { name: 'Vách núi đá', top: '#b9cfe0', bottom: '#8a7357', photo: false },
  desert: { name: 'Sa mạc', top: '#f5d9a0', bottom: '#c8964f', photo: false },
  swamp: { name: 'Đầm lầy', top: '#9aa88a', bottom: '#4b3f5c', photo: false },
  sky: { name: 'Tầng mây', top: '#7fb2f0', bottom: '#dcebfa', photo: false },
  ruins: { name: 'Tàn tích cổ', top: '#e7c9d9', bottom: '#8d7a86', photo: false },
  haunted: { name: 'Rừng đêm', top: '#3b3557', bottom: '#16131f', photo: false },
  'flower-garden': { name: 'Vườn hoa', top: '#f7cfe0', bottom: '#7fb86a', photo: false },
  stadium: { name: 'Đấu trường', top: '#4a6fa5', bottom: '#2e4a2e', photo: true },
  lab: { name: 'Phòng nghiên cứu', top: '#e8eef4', bottom: '#b8c4d0', photo: false },
}

const TYPE_SCENES: Record<TypeName, SceneId> = {
  normal: 'grassland',
  grass: 'forest',
  bug: 'forest',
  water: 'sea',
  fire: 'volcano',
  electric: 'power-plant',
  steel: 'power-plant',
  ice: 'snowfield',
  fighting: 'mountain',
  rock: 'mountain',
  ground: 'desert',
  poison: 'swamp',
  flying: 'sky',
  dragon: 'sky',
  psychic: 'ruins',
  ghost: 'haunted',
  dark: 'haunted',
  fairy: 'flower-garden',
}

export function sceneForTypes(types: readonly TypeName[]): SceneId {
  const [first, second] = types
  if (first === undefined) return 'grassland'
  if (first === 'normal' && second !== undefined) return TYPE_SCENES[second]
  return TYPE_SCENES[first]
}
