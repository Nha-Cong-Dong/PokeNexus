import { formatPokemonName } from '../../lib/formatters'
import type { EvolutionStage } from '../../types/api'

export type EvolutionMethod = 'level' | 'item' | 'trade' | 'special'

export interface EvolutionNode {
  stage: EvolutionStage
  depth: number
  children: EvolutionNode[]
}

const TRIGGER_LABELS: Record<string, string> = {
  'level-up': 'Lên cấp kèm điều kiện',
  trade: 'Trao đổi',
  'use-item': 'Dùng vật phẩm tiến hóa',
  shed: 'Lột xác',
  spin: 'Xoay tròn',
  'tower-of-darkness': 'Tháp Bóng tối',
  'tower-of-waters': 'Tháp Nước',
  'three-critical-hits': '3 đòn chí mạng',
  'take-damage': 'Nhận sát thương',
  'agile-style-move': 'Dùng chiêu kiểu Nhanh',
  'strong-style-move': 'Dùng chiêu kiểu Mạnh',
  'recoil-damage': 'Nhận sát thương phản lực',
  'use-move': 'Dùng chiêu đặc biệt',
  'three-defeated-bisharp': 'Hạ 3 Bisharp',
  'gimmighoul-coins': 'Thu 999 đồng xu',
  'meltan-candies': 'Kẹo Meltan',
  'in-battle-level-up': 'Lên cấp trong trận',
}

const SPECIAL_TRIGGER_LABEL = 'Điều kiện đặc biệt'

const STAGE_LABELS = ['Cơ bản', 'Giai đoạn 1', 'Giai đoạn 2']

export function evolutionStepLabel(stage: EvolutionStage): string | null {
  if (stage.evolvesFromSpeciesId === null) return null
  if (stage.minLevel !== null) return `Lv ${stage.minLevel}`
  if (stage.item) return `Dùng ${formatPokemonName(stage.item)}`
  if (stage.trigger === null) return null
  return TRIGGER_LABELS[stage.trigger] ?? SPECIAL_TRIGGER_LABEL
}

export function evolutionMethod(stage: EvolutionStage): EvolutionMethod {
  if (stage.minLevel !== null) return 'level'
  if (stage.item || stage.trigger === 'use-item') return 'item'
  if (stage.trigger === 'trade') return 'trade'
  return 'special'
}

export function stageLabel(depth: number): string {
  return STAGE_LABELS[depth] ?? `Giai đoạn ${depth}`
}

export function buildEvolutionTree(stages: readonly EvolutionStage[]): EvolutionNode[] {
  const speciesIds = new Set(stages.map((stage) => stage.speciesId))
  const childrenOf = new Map<number, EvolutionStage[]>()
  for (const stage of stages) {
    if (stage.evolvesFromSpeciesId === null || !speciesIds.has(stage.evolvesFromSpeciesId)) continue
    childrenOf.set(stage.evolvesFromSpeciesId, [
      ...(childrenOf.get(stage.evolvesFromSpeciesId) ?? []),
      stage,
    ])
  }

  const placed = new Set<number>()
  const grow = (stage: EvolutionStage, depth: number): EvolutionNode => {
    placed.add(stage.speciesId)
    const children = (childrenOf.get(stage.speciesId) ?? [])
      .filter((child) => !placed.has(child.speciesId))
      .map((child) => grow(child, depth + 1))
    return { stage, depth, children }
  }

  const roots = stages
    .filter(
      (stage) => stage.evolvesFromSpeciesId === null || !speciesIds.has(stage.evolvesFromSpeciesId),
    )
    .map((stage) => grow(stage, 0))
  for (const stage of stages) {
    if (!placed.has(stage.speciesId)) roots.push(grow(stage, 0))
  }
  return roots
}

export function treeSummary(roots: readonly EvolutionNode[]): string {
  let leaves = 0
  let deepest = 0
  const visit = (node: EvolutionNode) => {
    deepest = Math.max(deepest, node.depth)
    if (node.children.length === 0) leaves += 1
    node.children.forEach(visit)
  }
  roots.forEach(visit)
  const stages = `${deepest + 1} giai đoạn`
  return leaves > 1 ? `${stages}, ${leaves} nhánh tiến hóa` : stages
}
