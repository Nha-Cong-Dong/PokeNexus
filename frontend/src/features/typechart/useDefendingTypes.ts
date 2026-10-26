import { useCallback, useMemo } from 'react'
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

  const write = useCallback(
    (types: TypeName[]) =>
      setSearchParams(withDefendingTypes(searchParams, types), { replace: true }),
    [searchParams, setSearchParams],
  )

  const toggle = useCallback(
    (type: TypeName) =>
      write(
        selected.includes(type)
          ? selected.filter((item) => item !== type)
          : [...selected, type].slice(0, MAX_DEFENDING_TYPES),
      ),
    [selected, write],
  )

  const clear = useCallback(() => write([]), [write])

  return { selected, toggle, clear }
}
