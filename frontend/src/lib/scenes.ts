import type { CSSProperties } from 'react'

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
  sky: string
  horizon: string
  ground: string
  accent: string
  photo: boolean
}

export const SCENES: Record<SceneId, Scene> = {
  grassland: {
    name: 'Đồng cỏ',
    sky: '#9fd3f5',
    horizon: '#d8efc6',
    ground: '#7fbf5a',
    accent: '#f2c94c',
    photo: true,
  },
  forest: {
    name: 'Rừng rậm',
    sky: '#a8d5c2',
    horizon: '#5e9c6a',
    ground: '#2f6b3a',
    accent: '#a6b91a',
    photo: true,
  },
  sea: {
    name: 'Biển khơi',
    sky: '#8acff2',
    horizon: '#d6f0fb',
    ground: '#1f6fb2',
    accent: '#6390f0',
    photo: true,
  },
  volcano: {
    name: 'Núi lửa',
    sky: '#f7b267',
    horizon: '#f25c3b',
    ground: '#5a2219',
    accent: '#ee8130',
    photo: true,
  },
  'power-plant': {
    name: 'Nhà máy điện',
    sky: '#c9d3de',
    horizon: '#f3e28a',
    ground: '#4f5967',
    accent: '#f7d02c',
    photo: true,
  },
  snowfield: {
    name: 'Núi tuyết',
    sky: '#cfe8f7',
    horizon: '#f4fbff',
    ground: '#a9c9de',
    accent: '#96d9d6',
    photo: true,
  },
  mountain: {
    name: 'Vách núi đá',
    sky: '#b9cfe0',
    horizon: '#e2d6c2',
    ground: '#8a7357',
    accent: '#b6a136',
    photo: true,
  },
  desert: {
    name: 'Sa mạc',
    sky: '#f7d9a8',
    horizon: '#fbe7c0',
    ground: '#c8964f',
    accent: '#e2bf65',
    photo: true,
  },
  swamp: {
    name: 'Đầm lầy',
    sky: '#a3ad8f',
    horizon: '#7a6b8c',
    ground: '#3f354e',
    accent: '#a33ea1',
    photo: true,
  },
  sky: {
    name: 'Tầng mây',
    sky: '#5f9ff0',
    horizon: '#cfe3fb',
    ground: '#f3f8fe',
    accent: '#a98ff3',
    photo: true,
  },
  ruins: {
    name: 'Tàn tích cổ',
    sky: '#e7c9d9',
    horizon: '#f3e1c7',
    ground: '#8d7a86',
    accent: '#f95587',
    photo: true,
  },
  haunted: {
    name: 'Rừng đêm',
    sky: '#2c2747',
    horizon: '#4b3f72',
    ground: '#16131f',
    accent: '#735797',
    photo: true,
  },
  'flower-garden': {
    name: 'Vườn hoa',
    sky: '#f7cfe0',
    horizon: '#fde8f0',
    ground: '#7fb86a',
    accent: '#d685ad',
    photo: false,
  },
  stadium: {
    name: 'Đấu trường',
    sky: '#4a6fa5',
    horizon: '#9fb7d9',
    ground: '#2e4a2e',
    accent: '#ffd23f',
    photo: true,
  },
  lab: {
    name: 'Phòng nghiên cứu',
    sky: '#e8eef4',
    horizon: '#ffffff',
    ground: '#b8c4d0',
    accent: '#1f57b8',
    photo: true,
  },
}

export function sceneGradient(scene: SceneId): string {
  const { sky, horizon, ground, accent } = SCENES[scene]
  return [
    `radial-gradient(ellipse 45% 55% at 78% 22%, ${accent}66 0%, ${accent}00 70%)`,
    `linear-gradient(180deg, ${sky} 0%, ${horizon} 56%, ${ground} 62%, color-mix(in oklab, ${ground} 70%, #000) 100%)`,
  ].join(', ')
}

export function sceneTintStyle(scene: SceneId): CSSProperties {
  return { '--scene-accent': SCENES[scene].accent } as CSSProperties
}

export function sceneSwatch(scene: SceneId): string {
  const { sky, horizon, ground } = SCENES[scene]
  return `linear-gradient(180deg, ${sky} 0%, ${horizon} 50%, ${ground} 51%, ${ground} 100%)`
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
