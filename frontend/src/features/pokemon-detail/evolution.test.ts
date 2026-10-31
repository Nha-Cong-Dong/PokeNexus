import { describe, expect, it } from 'vitest'

import type { EvolutionStage } from '../../types/api'
import {
  buildEvolutionTree,
  evolutionMethod,
  evolutionStepLabel,
  stageLabel,
  treeSummary,
  type EvolutionNode,
} from './evolution'

function stage(
  speciesId: number,
  name: string,
  evolvesFromSpeciesId: number | null,
  extra: Partial<EvolutionStage> = {},
): EvolutionStage {
  return {
    speciesId,
    pokemonId: speciesId,
    name,
    types: ['normal'],
    evolvesFromSpeciesId,
    trigger: evolvesFromSpeciesId === null ? null : 'level-up',
    minLevel: null,
    item: null,
    ...extra,
  }
}

function shape(nodes: readonly EvolutionNode[]): unknown[] {
  return nodes.map((node) =>
    node.children.length === 0 ? node.stage.name : { [node.stage.name]: shape(node.children) },
  )
}

describe('buildEvolutionTree', () => {
  it('builds a linear chain from the base species with depths', () => {
    const roots = buildEvolutionTree([
      stage(6, 'charizard', 5),
      stage(4, 'charmander', null),
      stage(5, 'charmeleon', 4),
    ])

    expect(shape(roots)).toEqual([{ charmander: [{ charmeleon: ['charizard'] }] }])
    expect(roots[0]?.children[0]?.children[0]?.depth).toBe(2)
  })

  it('keeps every branch of Eevee under the root', () => {
    const roots = buildEvolutionTree([
      stage(133, 'eevee', null),
      ...[134, 135, 136, 196, 197, 470, 471, 700].map((id) =>
        stage(id, `eeveelution-${id}`, 133, { trigger: 'use-item' }),
      ),
    ])

    expect(roots).toHaveLength(1)
    expect(roots[0]?.children).toHaveLength(8)
    expect(treeSummary(roots)).toBe('2 giai đoạn, 8 nhánh tiến hóa')
  })

  it('nests branches that split again', () => {
    const roots = buildEvolutionTree([
      stage(265, 'wurmple', null),
      stage(266, 'silcoon', 265),
      stage(267, 'beautifly', 266),
      stage(268, 'cascoon', 265),
      stage(269, 'dustox', 268),
    ])

    expect(shape(roots)).toEqual([
      { wurmple: [{ silcoon: ['beautifly'] }, { cascoon: ['dustox'] }] },
    ])
    expect(treeSummary(roots)).toBe('3 giai đoạn, 2 nhánh tiến hóa')
  })

  it('treats a stage whose parent is missing as a root and never loops on a cycle', () => {
    expect(shape(buildEvolutionTree([stage(2, 'ivysaur', 1)]))).toEqual(['ivysaur'])

    const cyclic = buildEvolutionTree([stage(1, 'a', 2), stage(2, 'b', 1)])
    expect(shape(cyclic)).toEqual([{ a: ['b'] }])
  })

  it('returns no node for an empty chain', () => {
    expect(buildEvolutionTree([])).toEqual([])
    expect(treeSummary([])).toBe('1 giai đoạn')
  })
})

describe('evolutionStepLabel', () => {
  it('describes how a stage is reached', () => {
    expect(evolutionStepLabel(stage(5, 'charmeleon', 4, { minLevel: 16 }))).toBe('Lv 16')
    expect(evolutionStepLabel(stage(68, 'machamp', 67, { trigger: 'trade' }))).toBe('Trao đổi')
    expect(evolutionStepLabel(stage(134, 'vaporeon', 133, { item: 'water-stone' }))).toBe(
      'Dùng Water Stone',
    )
    expect(evolutionStepLabel(stage(135, 'jolteon', 133, { trigger: 'use-item' }))).toBe(
      'Dùng vật phẩm tiến hóa',
    )
    expect(evolutionStepLabel(stage(196, 'espeon', 133))).toBe('Lên cấp kèm điều kiện')
    expect(evolutionStepLabel(stage(869, 'alcremie', 868, { trigger: 'spin' }))).toBe('Xoay tròn')
    expect(evolutionStepLabel(stage(999, 'x', 998, { trigger: 'unknown-trigger' }))).toBe(
      'Điều kiện đặc biệt',
    )
  })

  it('has no label for the base species', () => {
    expect(evolutionStepLabel(stage(4, 'charmander', null))).toBeNull()
  })
})

describe('evolutionMethod and stageLabel', () => {
  it('groups triggers into the icons shown on each card', () => {
    expect(evolutionMethod(stage(5, 'charmeleon', 4, { minLevel: 16 }))).toBe('level')
    expect(evolutionMethod(stage(134, 'vaporeon', 133, { trigger: 'use-item' }))).toBe('item')
    expect(evolutionMethod(stage(68, 'machamp', 67, { trigger: 'trade' }))).toBe('trade')
    expect(evolutionMethod(stage(196, 'espeon', 133))).toBe('special')
  })

  it('names the stage of a species by its depth', () => {
    expect(stageLabel(0)).toBe('Cơ bản')
    expect(stageLabel(2)).toBe('Giai đoạn 2')
    expect(stageLabel(3)).toBe('Giai đoạn 3')
  })
})
