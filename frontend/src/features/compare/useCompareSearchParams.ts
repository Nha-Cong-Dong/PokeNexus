import { useCallback } from 'react'
import { useSearchParams } from 'react-router'

export type CompareSide = 'left' | 'right'

const ID_OR_NAME_PATTERN = /^[a-z0-9-]{1,60}$/

export function parsePokemonKey(value: string | null): string | undefined {
  const normalized = value?.trim().toLowerCase() ?? ''
  return ID_OR_NAME_PATTERN.test(normalized) ? normalized : undefined
}

export function otherSide(side: CompareSide): CompareSide {
  return side === 'left' ? 'right' : 'left'
}

export function useCompareSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams()
  const left = parsePokemonKey(searchParams.get('left'))
  const right = parsePokemonKey(searchParams.get('right'))

  const update = useCallback(
    (next: Record<CompareSide, string | undefined>) => {
      setSearchParams((current) => {
        const params = new URLSearchParams(current)
        for (const side of ['left', 'right'] as const) {
          const value = next[side]
          if (value === undefined) params.delete(side)
          else params.set(side, value)
        }
        return params
      })
    },
    [setSearchParams],
  )

  const setSide = useCallback(
    (side: CompareSide, value: string | undefined) => {
      update({ left, right, [side]: value })
    },
    [left, right, update],
  )

  const swap = useCallback(() => update({ left: right, right: left }), [left, right, update])

  return { left, right, setSide, swap }
}
