import { describe, expect, it } from 'vitest'

import type { TypeName } from '../types/api'
import { SCENES, sceneForTypes, type SceneId } from './scenes'

describe('sceneForTypes', () => {
  it.each<[TypeName, SceneId]>([
    ['normal', 'grassland'],
    ['fire', 'volcano'],
    ['water', 'sea'],
    ['electric', 'power-plant'],
    ['grass', 'forest'],
    ['ice', 'snowfield'],
    ['fighting', 'mountain'],
    ['poison', 'swamp'],
    ['ground', 'desert'],
    ['flying', 'sky'],
    ['psychic', 'ruins'],
    ['bug', 'forest'],
    ['rock', 'mountain'],
    ['ghost', 'haunted'],
    ['dragon', 'sky'],
    ['dark', 'haunted'],
    ['steel', 'power-plant'],
    ['fairy', 'flower-garden'],
  ])('maps a pure %s type to %s', (type, scene) => {
    expect(sceneForTypes([type])).toBe(scene)
  })

  it('uses the first type for dual types', () => {
    expect(sceneForTypes(['fire', 'flying'])).toBe('volcano')
  })

  it('uses the second type when the first is Normal', () => {
    expect(sceneForTypes(['normal', 'flying'])).toBe('sky')
  })

  it('falls back to grassland when no type is given', () => {
    expect(sceneForTypes([])).toBe('grassland')
  })

  it('declares 15 scenes with a two-colour fallback', () => {
    expect(Object.keys(SCENES)).toHaveLength(15)
    Object.values(SCENES).forEach((scene) => {
      expect(scene.top).toMatch(/^#[0-9a-f]{6}$/)
      expect(scene.bottom).toMatch(/^#[0-9a-f]{6}$/)
    })
  })
})
