import { describe, expect, it } from 'vitest'

import type { TypeName } from '../types/api'
import { SCENES, sceneForTypes, sceneGradient, sceneTintStyle, type SceneId } from './scenes'

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

  it('exposes the scene accent as a CSS variable for the page tint', () => {
    expect(sceneTintStyle('haunted')).toEqual({ '--scene-accent': '#735797' })
  })
})
