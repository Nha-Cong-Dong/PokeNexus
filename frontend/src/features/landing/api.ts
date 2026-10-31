import { getJson } from '../../lib/http'
import type { GenerationProfile } from '../../types/api'

export function fetchGenerationProfiles(signal?: AbortSignal): Promise<GenerationProfile[]> {
  return getJson<GenerationProfile[]>('/pokemon/generations', undefined, signal)
}
