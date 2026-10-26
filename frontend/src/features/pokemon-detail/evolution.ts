import { formatPokemonName } from '../../lib/formatters'
import type { EvolutionStage } from '../../types/api'

const TRIGGER_LABELS: Record<string, string> = {
  'level-up': 'Lên cấp',
  trade: 'Trao đổi',
  'use-item': 'Dùng vật phẩm',
  shed: 'Lột xác',
}

const SPECIAL_TRIGGER_LABEL = 'Điều kiện đặc biệt'

export function evolutionStepLabel(stage: EvolutionStage): string | null {
  if (stage.evolvesFromSpeciesId === null) return null
  if (stage.minLevel !== null) return `Lv ${stage.minLevel}`
  if (stage.item) return `Dùng ${formatPokemonName(stage.item)}`
  if (stage.trigger === null) return null
  return TRIGGER_LABELS[stage.trigger] ?? SPECIAL_TRIGGER_LABEL
}

export function evolutionLevels(stages: readonly EvolutionStage[]): EvolutionStage[][] {
  const bySpecies = new Map(stages.map((stage) => [stage.speciesId, stage]))

  const depthOf = (stage: EvolutionStage): number => {
    let depth = 0
    let parentId = stage.evolvesFromSpeciesId
    while (parentId !== null && depth < stages.length) {
      const parent = bySpecies.get(parentId)
      if (!parent) break
      depth += 1
      parentId = parent.evolvesFromSpeciesId
    }
    return depth
  }

  const levels: EvolutionStage[][] = []
  for (const stage of stages) {
    const depth = depthOf(stage)
    levels[depth] = [...(levels[depth] ?? []), stage]
  }
  return levels.filter((level) => level.length > 0)
}
