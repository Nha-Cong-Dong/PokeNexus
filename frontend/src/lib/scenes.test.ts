import { describe, expect, it } from 'vitest'

import type { TypeName } from '../types/api'
import {
  nextPhoto,
  SCENES,
  sceneForTypes,
  sceneGradient,
  sceneTintStyle,
  type SceneId,
} from './scenes'

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

  it('declares 15 scenes with a four-colour palette', () => {
    expect(Object.keys(SCENES)).toHaveLength(15)
    Object.values(SCENES).forEach((scene) => {
      ;[scene.sky, scene.horizon, scene.ground, scene.accent].forEach((colour) => {
        expect(colour).toMatch(/^#[0-9a-f]{6}$/)
      })
    })
  })

  it('builds a landscape gradient with sky, horizon, ground and an accent glow', () => {
    const gradient = sceneGradient('volcano')

    expect(gradient).toContain('radial-gradient')
    expect(gradient).toContain('#ee813066')
    expect(gradient).toContain('#f7b267 0%')
    expect(gradient).toContain('#f25c3b 56%')
    expect(gradient).toContain('#5a2219 62%')
  })

  it('gives every scene a photo count and an ambience with a colour', () => {
    const kinds = ['motes', 'fireflies', 'snow', 'embers', 'petals', 'sparks', 'sand']
    Object.values(SCENES).forEach((scene) => {
      expect(Number.isInteger(scene.photos)).toBe(true)
      expect(scene.photos).toBeGreaterThanOrEqual(0)
      expect(kinds).toContain(scene.ambience.kind)
      expect(scene.ambience.color).toMatch(/^#[0-9a-f]{6}$/)
    })
  })

  it('cycles to the next photo that has not failed', () => {
    expect(nextPhoto(1, 4, [])).toBe(2)
    expect(nextPhoto(4, 4, [])).toBe(1)
    expect(nextPhoto(1, 4, [2, 3])).toBe(4)
    expect(nextPhoto(null, 3, [1])).toBe(2)
    expect(nextPhoto(2, 3, [1, 2, 3])).toBeNull()
    expect(nextPhoto(null, 0, [])).toBeNull()
  })

  it('exposes the scene accent as a CSS variable for the page tint', () => {
    expect(sceneTintStyle('haunted')).toEqual({ '--scene-accent': '#735797' })
  })
})
