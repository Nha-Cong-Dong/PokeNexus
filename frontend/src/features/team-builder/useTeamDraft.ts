import { useCallback, useEffect, useReducer, useRef } from 'react'
import { useSearchParams } from 'react-router'

export const MAX_DRAFT_SIZE = 5
export const DRAFT_PARAM = 'ids'
export const ADD_PARAM = 'add'
export const SIXTH_PARAM = 'six'
export const DRAFT_STORAGE_KEY = 'pokenexus.teamDraft'

export interface TeamDraftState {
  ids: number[]
  sixth?: number
}

export type TeamDraftAction =
  | { type: 'add'; id: number }
  | { type: 'remove'; id: number }
  | { type: 'replace'; ids: readonly number[]; sixth?: number | null }
  | { type: 'setSixth'; id: number | null }
  | { type: 'clear' }

function isValidId(id: number): boolean {
  return Number.isSafeInteger(id) && id > 0
}

function withSixth(ids: number[], sixth: number | null | undefined): TeamDraftState {
  return sixth != null && isValidId(sixth) ? { ids, sixth } : { ids }
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
      return { ...state, ids: [...state.ids, action.id] }
    case 'remove':
      return state.ids.includes(action.id)
        ? { ...state, ids: state.ids.filter((id) => id !== action.id) }
        : state
    case 'replace':
      return withSixth(sanitizeIds(action.ids), action.sixth)
    case 'setSixth':
      return withSixth(state.ids, action.id)
    case 'clear':
      return state.ids.length === 0 && state.sixth === undefined ? state : { ids: [] }
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

function parseSixth(raw: string | null | undefined): number | null {
  return parseDraftIds(raw)[0] ?? null
}

function initialDraft(params: URLSearchParams): TeamDraftState {
  const fromUrl = parseDraftIds(params.get(DRAFT_PARAM))
  const base = fromUrl.length > 0 ? fromUrl : readStoredIds()
  const [added] = parseDraftIds(params.get(ADD_PARAM))
  const draft = withSixth(base, parseSixth(params.get(SIXTH_PARAM)))
  return added === undefined ? draft : teamDraftReducer(draft, { type: 'add', id: added })
}

function syncKey(ids: string, sixth: string): string {
  return `${ids}|${sixth}`
}

export function useTeamDraft() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [state, dispatch] = useReducer(teamDraftReducer, searchParams, initialDraft)
  const stateSixth = state.sixth === undefined ? '' : String(state.sixth)
  const syncedRef = useRef(syncKey(serializeDraftIds(state.ids), stateSixth))
  const rawUrlIds = searchParams.get(DRAFT_PARAM)
  const rawUrlSixth = searchParams.get(SIXTH_PARAM)
  const hasAddParam = searchParams.has(ADD_PARAM)

  useEffect(() => {
    const fromState = serializeDraftIds(state.ids)
    const fromUrl = serializeDraftIds(parseDraftIds(rawUrlIds))
    const urlSixth = parseSixth(rawUrlSixth)
    const sixthFromUrl = urlSixth === null ? '' : String(urlSixth)
    const urlOutdated =
      (rawUrlIds ?? '') !== fromState || (rawUrlSixth ?? '') !== stateSixth || hasAddParam
    const writeUrl = () =>
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous)
          if (fromState) next.set(DRAFT_PARAM, fromState)
          else next.delete(DRAFT_PARAM)
          if (stateSixth) next.set(SIXTH_PARAM, stateSixth)
          else next.delete(SIXTH_PARAM)
          next.delete(ADD_PARAM)
          return next
        },
        { replace: true },
      )

    const stateKey = syncKey(fromState, stateSixth)
    if (stateKey !== syncedRef.current) {
      syncedRef.current = stateKey
      writeStoredIds(fromState)
      if (urlOutdated) writeUrl()
      return
    }
    if (fromUrl !== '' && syncKey(fromUrl, sixthFromUrl) !== stateKey && !hasAddParam) {
      syncedRef.current = syncKey(fromUrl, sixthFromUrl)
      dispatch({ type: 'replace', ids: parseDraftIds(fromUrl), sixth: urlSixth })
      return
    }
    writeStoredIds(fromState)
    if (urlOutdated) writeUrl()
  }, [state.ids, stateSixth, rawUrlIds, rawUrlSixth, hasAddParam, setSearchParams])

  const add = useCallback((id: number) => dispatch({ type: 'add', id }), [])
  const remove = useCallback((id: number) => dispatch({ type: 'remove', id }), [])
  const replace = useCallback(
    (ids: readonly number[], sixth?: number | null) => dispatch({ type: 'replace', ids, sixth }),
    [],
  )
  const clear = useCallback(() => dispatch({ type: 'clear' }), [])
  const setSixth = useCallback((id: number | null) => dispatch({ type: 'setSixth', id }), [])

  return {
    ids: state.ids,
    sixth: state.sixth ?? null,
    isFull: state.ids.length >= MAX_DRAFT_SIZE,
    add,
    remove,
    replace,
    clear,
    setSixth,
  }
}
