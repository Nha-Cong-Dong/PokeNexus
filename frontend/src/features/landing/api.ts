import { getJson } from '../../lib/http'
import type { PageResponse, PokemonSummary } from '../../types/api'

export async function fetchGenerationSpeciesCount(
  generation: number,
  signal?: AbortSignal,
): Promise<number> {
  const page = await getJson<PageResponse<PokemonSummary>>(
    '/pokemon',
    { gen: generation, form: 'DEFAULT', size: 1 },
    signal,
  )
  return page.totalElements
}
