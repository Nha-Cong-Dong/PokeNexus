import { getJson } from '../../lib/http'
import type { TypeMatrix } from '../../types/api'

export function fetchTypeMatrix(signal?: AbortSignal): Promise<TypeMatrix> {
  return getJson<TypeMatrix>('/types/matrix', undefined, signal)
}
