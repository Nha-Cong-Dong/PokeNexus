import { getJson } from '../../lib/http'
import type { SpeedTier } from '../../types/api'

export function fetchSpeedTiers(signal?: AbortSignal): Promise<SpeedTier[]> {
  return getJson<SpeedTier[]>('/pokemon/speed-tiers', undefined, signal)
}
