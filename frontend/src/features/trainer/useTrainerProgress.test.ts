import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { parseProgress } from './progress'
import { TRAINER_STORAGE_KEY, useTrainerProgress } from './useTrainerProgress'

afterEach(() => {
  window.localStorage.clear()
})

describe('useTrainerProgress', () => {
  it('keeps a badge earned in another tab when this tab records new points', () => {
    const { result } = renderHook(() => useTrainerProgress())

    act(() => {
      window.localStorage.setItem(
        TRAINER_STORAGE_KEY,
        JSON.stringify({ ...parseProgress(null), points: 40, badges: ['terrain-volcano'] }),
      )
      window.dispatchEvent(new StorageEvent('storage', { key: TRAINER_STORAGE_KEY }))
    })
    act(() => {
      result.current.update((current) => ({ ...current, points: current.points + 10 }))
    })

    const stored = parseProgress(window.localStorage.getItem(TRAINER_STORAGE_KEY))
    expect(stored.points).toBe(50)
    expect(stored.badges).toEqual(['terrain-volcano'])
  })
})
