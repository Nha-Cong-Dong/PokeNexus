import type { SpeedTier } from '../../types/api'

export type SpeedPreset = 'min' | 'neutral' | 'max'

export interface SpeedSpread {
  min: number
  neutral: number
  max: number
}

export interface SpeedRank {
  slower: number
  tied: number
  faster: number
  total: number
  percentSlower: number
}

export const LEVEL = 50

const PRESETS: Record<SpeedPreset, { iv: number; ev: number; natureTenths: number }> = {
  min: { iv: 0, ev: 0, natureTenths: 9 },
  neutral: { iv: 31, ev: 0, natureTenths: 10 },
  max: { iv: 31, ev: 252, natureTenths: 11 },
}

export function level50Speed(base: number, preset: SpeedPreset): number {
  const { iv, ev, natureTenths } = PRESETS[preset]
  const raw = Math.floor(((2 * base + iv + Math.floor(ev / 4)) * LEVEL) / 100) + 5
  return Math.floor((raw * natureTenths) / 10)
}

export function level50Spread(base: number): SpeedSpread {
  return {
    min: level50Speed(base, 'min'),
    neutral: level50Speed(base, 'neutral'),
    max: level50Speed(base, 'max'),
  }
}

export function rankSpeed(tiers: readonly SpeedTier[], base: number, selfId?: number): SpeedRank {
  let slower = 0
  let tied = 0
  let faster = 0
  for (const tier of tiers) {
    const count = tier.pokemon.filter((pokemon) => pokemon.id !== selfId).length
    if (tier.speed < base) slower += count
    else if (tier.speed > base) faster += count
    else tied += count
  }
  const total = slower + tied + faster
  return {
    slower,
    tied,
    faster,
    total,
    percentSlower: total === 0 ? 0 : Math.floor((slower / total) * 100),
  }
}

export function nearestTiers(
  tiers: readonly SpeedTier[],
  base: number,
): { faster?: SpeedTier; slower?: SpeedTier } {
  const faster = tiers.filter((tier) => tier.speed > base).at(-1)
  const slower = tiers.find((tier) => tier.speed < base)
  return { faster, slower }
}
