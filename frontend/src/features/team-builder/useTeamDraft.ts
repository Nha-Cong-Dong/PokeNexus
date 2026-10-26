import { useCallback, useEffect, useReducer, useRef } from 'react'
import { useSearchParams } from 'react-router'

export const MAX_DRAFT_SIZE = 5
export const DRAFT_PARAM = 'ids'
export const DRAFT_STORAGE_KEY = 'pokenexus.teamDraft'

export interface TeamDraftState {
  ids: number[]
}

export type TeamDraftAction =
  | { type: 'add'; id: number }
  | { type: 'remove'; id: number }
  | { type: 'replace'; ids: readonly number[] }
  | { type: 'clear' }

function isValidId(id: number): boolean {
  return Number.isSafeInteger(id) && id > 0
}

export function sanitizeIds(ids: readonly number[]): number[] {
  return [...new Set(ids.filter(isValidId))].slice(0, MAX_DRAFT_SIZE)
}

export function parseDraftIds(raw: string | null | undefined): number[] {
  if (!raw) return []
  const ids = raw
    .split(',')
    .map((part) => part.trim())
    .filter((part) => /^\d+$/.test(part))
    .map(Number)
  return sanitizeIds(ids)
}

export function serializeDraftIds(ids: readonly number[]): string {
  return ids.join(',')
}

export function teamDraftReducer(state: TeamDraftState, action: TeamDraftAction): TeamDraftState {
  switch (action.type) {
    case 'add':
      if (!isValidId(action.id) || state.ids.includes(action.id)) return state
      if (state.ids.length >= MAX_DRAFT_SIZE) return state
      return { ids: [...state.ids, action.id] }
    case 'remove':
      return state.ids.includes(action.id)
        ? { ids: state.ids.filter((id) => id !== action.id) }
        : state
    case 'replace':
      return { ids: sanitizeIds(action.ids) }
    case 'clear':
      return state.ids.length === 0 ? state : { ids: [] }
  }
}

function readStoredIds(): number[] {
  try {
    return parseDraftIds(window.localStorage.getItem(DRAFT_STORAGE_KEY))
  } catch {
    return []
  }
}

function writeStoredIds(serialized: string) {
  try {
    if (serialized) window.localStorage.setItem(DRAFT_STORAGE_KEY, serialized)
    else window.localStorage.removeItem(DRAFT_STORAGE_KEY)
  } catch {
    return
  }
}

function initialDraft(params: URLSearchParams): TeamDraftState {
  const fromUrl = parseDraftIds(params.get(DRAFT_PARAM))
  return { ids: fromUrl.length > 0 ? fromUrl : readStoredIds() }
}

export function useTeamDraft() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [state, dispatch] = useReducer(teamDraftReducer, searchParams, initialDraft)
  const syncedRef = useRef(serializeDraftIds(state.ids))
  const rawUrlIds = searchParams.get(DRAFT_PARAM)

  useEffect(() => {
    const fromState = serializeDraftIds(state.ids)
    const fromUrl = serializeDraftIds(parseDraftIds(rawUrlIds))
    const writeUrl = (value: string) =>
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous)
          if (value) next.set(DRAFT_PARAM, value)
          else next.delete(DRAFT_PARAM)
          return next
        },
        { replace: true },
      )

    if (fromState !== syncedRef.current) {
      syncedRef.current = fromState
      writeStoredIds(fromState)
      if ((rawUrlIds ?? '') !== fromState) writeUrl(fromState)
      return
    }
    if (fromUrl !== '' && fromUrl !== fromState) {
      syncedRef.current = fromUrl
      dispatch({ type: 'replace', ids: parseDraftIds(fromUrl) })
      return
    }
    writeStoredIds(fromState)
    if ((rawUrlIds ?? '') !== fromState) writeUrl(fromState)
  }, [state.ids, rawUrlIds, setSearchParams])

  const add = useCallback((id: number) => dispatch({ type: 'add', id }), [])
  const remove = useCallback((id: number) => dispatch({ type: 'remove', id }), [])
  const replace = useCallback((ids: readonly number[]) => dispatch({ type: 'replace', ids }), [])
  const clear = useCallback(() => dispatch({ type: 'clear' }), [])

  return {
    ids: state.ids,
    isFull: state.ids.length >= MAX_DRAFT_SIZE,
    add,
    remove,
    replace,
    clear,
  }
}
