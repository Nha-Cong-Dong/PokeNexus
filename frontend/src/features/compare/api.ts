import { getJson } from '../../lib/http'
import type { CompareResponse } from '../../types/api'

export function fetchCompare(
  left: string,
  right: string,
  signal?: AbortSignal,
): Promise<CompareResponse> {
  return getJson<CompareResponse>('/pokemon/compare', { left, right }, signal)
}
