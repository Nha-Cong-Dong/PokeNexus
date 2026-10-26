import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router'

import { isTypeName } from '../../lib/pokemonTypes'
import type { TypeName } from '../../types/api'

export const DEFENDING_PARAM = 'def'
export const MAX_DEFENDING_TYPES = 2

export function parseDefendingTypes(params: URLSearchParams): TypeName[] {
  const values = params.getAll(DEFENDING_PARAM).map((value) => value.trim().toLowerCase())
  return [...new Set(values.filter(isTypeName))].slice(0, MAX_DEFENDING_TYPES)
}

export function withDefendingTypes(
  params: URLSearchParams,
  types: readonly TypeName[],
): URLSearchParams {
  const next = new URLSearchParams(params)
  next.delete(DEFENDING_PARAM)
  types.forEach((type) => next.append(DEFENDING_PARAM, type))
  return next
}

export function useDefendingTypes() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selected = useMemo(() => parseDefendingTypes(searchParams), [searchParams])
  const latestRef = useRef(searchParams)

  useEffect(() => {
    latestRef.current = searchParams
  }, [searchParams])

  const update = useCallback(
    (next: (current: TypeName[]) => TypeName[]) => {
      const base = latestRef.current
      const updated = withDefendingTypes(base, next(parseDefendingTypes(base)))
      latestRef.current = updated
      setSearchParams(updated, { replace: true })
    },
    [setSearchParams],
  )

  const toggle = useCallback(
    (type: TypeName) =>
      update((current) =>
        current.includes(type)
          ? current.filter((item) => item !== type)
          : [...current, type].slice(0, MAX_DEFENDING_TYPES),
      ),
    [update],
  )

  const clear = useCallback(() => update(() => []), [update])

  return { selected, toggle, clear }
}
