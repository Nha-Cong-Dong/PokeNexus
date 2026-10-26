import type { ProblemDetail } from '../types/api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1'

export type QueryValue = string | number | undefined | readonly (string | number)[]

export class ApiError extends Error {
  readonly status: number
  readonly code: string

  constructor(status: number, code: string, detail?: string) {
    super(detail ?? `HTTP ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

export function buildUrl(path: string, params: Record<string, QueryValue> = {}): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue
    const values = Array.isArray(value) ? value : [value]
    for (const item of values) search.append(key, String(item))
  }
  const query = search.toString()
  return `${API_BASE_URL}${path}${query ? `?${query}` : ''}`
}

export async function getJson<T>(
  path: string,
  params?: Record<string, QueryValue>,
  signal?: AbortSignal,
): Promise<T> {
  let response: Response
  try {
    response = await fetch(buildUrl(path, params), {
      headers: { Accept: 'application/json' },
      signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError(0, 'NETWORK_ERROR')
  }
  if (!response.ok) {
    const problem = await readProblem(response)
    throw new ApiError(response.status, problem?.code ?? 'INTERNAL_ERROR', problem?.detail)
  }
  return (await response.json()) as T
}

export async function postJson<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
  let response: Response
  try {
    response = await fetch(buildUrl(path), {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError(0, 'NETWORK_ERROR')
  }
  if (!response.ok) {
    const problem = await readProblem(response)
    throw new ApiError(response.status, problem?.code ?? 'INTERNAL_ERROR', problem?.detail)
  }
  return (await response.json()) as T
}

async function readProblem(response: Response): Promise<ProblemDetail | undefined> {
  try {
    return (await response.json()) as ProblemDetail
  } catch {
    return undefined
  }
}
