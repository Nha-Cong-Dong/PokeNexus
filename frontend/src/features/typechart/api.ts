import { getJson } from '../../lib/http'
import type { TypeInfo, TypeMatrix } from '../../types/api'

export function fetchTypes(signal?: AbortSignal): Promise<TypeInfo[]> {
  return getJson<TypeInfo[]>('/types', undefined, signal)
}

export function fetchTypeMatrix(signal?: AbortSignal): Promise<TypeMatrix> {
  return getJson<TypeMatrix>('/types/matrix', undefined, signal)
}
