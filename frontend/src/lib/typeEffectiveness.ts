import type { TypeMatrix, TypeName } from '../types/api'

export interface AttackProfile {
  superEffective: TypeName[]
  notVeryEffective: TypeName[]
  noEffect: TypeName[]
}

export function singleMultiplier(
  matrix: TypeMatrix,
  attacking: TypeName,
  defending: TypeName,
): number {
  const row = matrix.types.indexOf(attacking)
  const column = matrix.types.indexOf(defending)
  if (row < 0 || column < 0) return 1
  return matrix.multipliers[row]?.[column] ?? 1
}

export function multiplierAgainst(
  matrix: TypeMatrix,
  attacking: TypeName,
  defending: readonly TypeName[],
): number {
  return defending.reduce((product, type) => product * singleMultiplier(matrix, attacking, type), 1)
}

export function attackProfile(matrix: TypeMatrix, attacking: TypeName): AttackProfile {
  const profile: AttackProfile = { superEffective: [], notVeryEffective: [], noEffect: [] }
  for (const defending of matrix.types) {
    const multiplier = singleMultiplier(matrix, attacking, defending)
    if (multiplier === 0) profile.noEffect.push(defending)
    else if (multiplier > 1) profile.superEffective.push(defending)
    else if (multiplier < 1) profile.notVeryEffective.push(defending)
  }
  return profile
}

export function weaknessesOf(
  matrix: TypeMatrix,
  defending: readonly TypeName[],
): { type: TypeName; multiplier: number }[] {
  return matrix.types
    .map((type) => ({ type, multiplier: multiplierAgainst(matrix, type, defending) }))
    .filter((entry) => entry.multiplier > 1)
    .sort((a, b) => b.multiplier - a.multiplier)
}
