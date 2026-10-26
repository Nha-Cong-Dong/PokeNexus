import { act, renderHook } from '@testing-library/react'
import { createElement, type ReactNode } from 'react'
import { MemoryRouter, useLocation } from 'react-router'
import { describe, expect, it } from 'vitest'

import { parseDefendingTypes, useDefendingTypes, withDefendingTypes } from './useDefendingTypes'

describe('parseDefendingTypes', () => {
  it('reads up to two defending types from repeated def parameters', () => {
    expect(parseDefendingTypes(new URLSearchParams('def=fire&def=flying'))).toEqual([
      'fire',
      'flying',
    ])
  })

  it('ignores unknown names, duplicates and anything past the second type', () => {
    const params = new URLSearchParams('def=banana&def=FIRE&def=fire&def=&def=flying&def=water')

    expect(parseDefendingTypes(params)).toEqual(['fire', 'flying'])
  })

  it('returns an empty selection when the parameter is missing', () => {
    expect(parseDefendingTypes(new URLSearchParams('foo=bar'))).toEqual([])
  })
})

describe('withDefendingTypes', () => {
  it('replaces the def parameters and keeps unrelated ones', () => {
    const next = withDefendingTypes(new URLSearchParams('def=banana&foo=bar'), ['water', 'ground'])

    expect(next.toString()).toBe('foo=bar&def=water&def=ground')
  })
})

describe('useDefendingTypes', () => {
  function renderTypes(path: string) {
    const wrapper = ({ children }: { children: ReactNode }) =>
      createElement(MemoryRouter, { initialEntries: [path] }, children)
    return renderHook(() => ({ types: useDefendingTypes(), location: useLocation() }), { wrapper })
  }

  it('keeps both types when two toggles happen before a re-render', () => {
    const { result } = renderTypes('/types')

    act(() => {
      result.current.types.toggle('fire')
      result.current.types.toggle('flying')
    })

    expect(result.current.types.selected).toEqual(['fire', 'flying'])
    expect(result.current.location.search).toBe('?def=fire&def=flying')
  })

  it('removes a selected type and clears the rest', () => {
    const { result } = renderTypes('/types?def=fire&def=flying')

    act(() => result.current.types.toggle('fire'))
    expect(result.current.types.selected).toEqual(['flying'])

    act(() => result.current.types.clear())
    expect(result.current.location.search).toBe('')
  })
})
