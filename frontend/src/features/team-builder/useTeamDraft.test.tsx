import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter, useLocation, useNavigate } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  DRAFT_STORAGE_KEY,
  parseDraftIds,
  serializeDraftIds,
  teamDraftReducer,
  useTeamDraft,
} from './useTeamDraft'

function renderDraft(path: string) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[path]}>{children}</MemoryRouter>
  )
  const hook = renderHook(
    () => ({ draft: useTeamDraft(), location: useLocation(), navigateTo: useNavigate() }),
    { wrapper },
  )
  const navigate = (to: string) => act(() => hook.result.current.navigateTo(to))
  return { ...hook, navigate }
}

function urlIds(search: string): string | null {
  return new URLSearchParams(search).get('ids')
}

function urlSixth(search: string): string | null {
  return new URLSearchParams(search).get('six')
}

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  window.localStorage.clear()
})

describe('teamDraftReducer', () => {
  it('adds a new id and removes an existing one', () => {
    const added = teamDraftReducer({ ids: [6] }, { type: 'add', id: 130 })
    expect(added.ids).toEqual([6, 130])
    expect(teamDraftReducer(added, { type: 'remove', id: 6 }).ids).toEqual([130])
  })

  it('ignores duplicates, invalid ids and additions beyond 5 members', () => {
    const full = { ids: [6, 130, 149, 663, 637] }
    expect(teamDraftReducer({ ids: [6] }, { type: 'add', id: 6 }).ids).toEqual([6])
    expect(teamDraftReducer({ ids: [6] }, { type: 'add', id: 0 }).ids).toEqual([6])
    expect(teamDraftReducer({ ids: [6] }, { type: 'add', id: 1.5 }).ids).toEqual([6])
    expect(teamDraftReducer(full, { type: 'add', id: 445 })).toBe(full)
  })

  it('sanitizes replaced ids and clears the draft', () => {
    expect(
      teamDraftReducer({ ids: [] }, { type: 'replace', ids: [6, 6, -1, 130, 149, 663, 637, 445] })
        .ids,
    ).toEqual([6, 130, 149, 663, 637])
    expect(teamDraftReducer({ ids: [6] }, { type: 'clear' }).ids).toEqual([])
  })

  it('keeps a valid sixth member through edits and drops it on clear', () => {
    const full = { ids: [6, 130, 149, 663, 637] }
    const withSixth = teamDraftReducer(full, { type: 'setSixth', id: 248 })
    expect(withSixth.sixth).toBe(248)
    expect(teamDraftReducer(withSixth, { type: 'remove', id: 6 }).sixth).toBe(248)
    expect(teamDraftReducer(full, { type: 'setSixth', id: -1 }).sixth).toBeUndefined()
    expect(teamDraftReducer(withSixth, { type: 'clear' })).toEqual({ ids: [] })
  })
})

describe('parseDraftIds', () => {
  it('round-trips a valid list through the URL format', () => {
    expect(serializeDraftIds(parseDraftIds('6,130,149'))).toBe('6,130,149')
  })

  it('drops invalid, duplicate and extra values', () => {
    expect(parseDraftIds('6, abc,130,-4,0,6,1e3,149,663,637,445')).toEqual([6, 130, 149, 663, 637])
    expect(parseDraftIds('')).toEqual([])
    expect(parseDraftIds(null)).toEqual([])
  })
})

describe('useTeamDraft', () => {
  it('reads ids from the URL, ignores invalid ones and normalizes the URL', async () => {
    const { result } = renderDraft('/team-builder?ids=6,x,130,6')

    expect(result.current.draft.ids).toEqual([6, 130])
    await waitFor(() => expect(urlIds(result.current.location.search)).toBe('6,130'))
    expect(window.localStorage.getItem(DRAFT_STORAGE_KEY)).toBe('6,130')
  })

  it('writes added and removed members to the URL and localStorage', async () => {
    const { result } = renderDraft('/team-builder')

    act(() => result.current.draft.add(6))
    act(() => result.current.draft.add(130))
    await waitFor(() => expect(urlIds(result.current.location.search)).toBe('6,130'))
    expect(window.localStorage.getItem(DRAFT_STORAGE_KEY)).toBe('6,130')

    act(() => result.current.draft.remove(6))
    await waitFor(() => expect(urlIds(result.current.location.search)).toBe('130'))

    act(() => result.current.draft.clear())
    await waitFor(() => expect(urlIds(result.current.location.search)).toBeNull())
    expect(window.localStorage.getItem(DRAFT_STORAGE_KEY)).toBeNull()
  })

  it('restores the draft from localStorage when the URL has no ids', async () => {
    window.localStorage.setItem(DRAFT_STORAGE_KEY, '149,663')

    const { result } = renderDraft('/team-builder')

    expect(result.current.draft.ids).toEqual([149, 663])
    await waitFor(() => expect(urlIds(result.current.location.search)).toBe('149,663'))
  })

  it('prefers ids in the URL over the stored draft', () => {
    window.localStorage.setItem(DRAFT_STORAGE_KEY, '149,663')

    const { result } = renderDraft('/team-builder?ids=25')

    expect(result.current.draft.ids).toEqual([25])
  })

  it('appends ?add= to the stored draft instead of replacing it', async () => {
    window.localStorage.setItem(DRAFT_STORAGE_KEY, '6,130,149,663')

    const { result } = renderDraft('/team-builder?add=445')

    expect(result.current.draft.ids).toEqual([6, 130, 149, 663, 445])
    await waitFor(() => expect(urlIds(result.current.location.search)).toBe('6,130,149,663,445'))
    expect(new URLSearchParams(result.current.location.search).has('add')).toBe(false)
    expect(window.localStorage.getItem(DRAFT_STORAGE_KEY)).toBe('6,130,149,663,445')
  })

  it('keeps the draft unchanged when ?add= repeats a member or the team is full', async () => {
    window.localStorage.setItem(DRAFT_STORAGE_KEY, '6,130,149,663,637')

    const { result } = renderDraft('/team-builder?add=445')

    expect(result.current.draft.ids).toEqual([6, 130, 149, 663, 637])
    await waitFor(() => expect(urlIds(result.current.location.search)).toBe('6,130,149,663,637'))
    expect(new URLSearchParams(result.current.location.search).has('add')).toBe(false)
  })

  it('appends ?add= to ids given in the same URL', async () => {
    const { result } = renderDraft('/team-builder?ids=6,130&add=6&add=149')

    expect(result.current.draft.ids).toEqual([6, 130])
    await waitFor(() => expect(urlIds(result.current.location.search)).toBe('6,130'))
  })

  it('follows a later navigation that carries new ids and keeps the draft on a bare URL', async () => {
    const { result, navigate } = renderDraft('/team-builder?ids=6')

    await navigate('/team-builder?ids=130,149')
    await waitFor(() => expect(result.current.draft.ids).toEqual([130, 149]))

    await navigate('/team-builder')
    await waitFor(() => expect(urlIds(result.current.location.search)).toBe('130,149'))
    expect(result.current.draft.ids).toEqual([130, 149])
  })

  it('reads the sixth member from the URL and drops an invalid value', async () => {
    const valid = renderDraft('/team-builder?ids=6,130,149,663,637&six=248')
    expect(valid.result.current.draft.sixth).toBe(248)
    valid.unmount()

    const invalid = renderDraft('/team-builder?ids=6,130,149,663,637&six=abc')
    expect(invalid.result.current.draft.sixth).toBeNull()
    await waitFor(() => expect(urlSixth(invalid.result.current.location.search)).toBeNull())
  })

  it('writes the sixth member to the URL next to the ids and clears it with the draft', async () => {
    const { result } = renderDraft('/team-builder?ids=6,130,149,663,637')

    act(() => result.current.draft.setSixth(248))
    await waitFor(() => expect(urlSixth(result.current.location.search)).toBe('248'))
    expect(urlIds(result.current.location.search)).toBe('6,130,149,663,637')

    act(() => {
      result.current.draft.remove(6)
      result.current.draft.add(248)
      result.current.draft.setSixth(null)
    })
    await waitFor(() => expect(urlIds(result.current.location.search)).toBe('130,149,663,637,248'))
    expect(urlSixth(result.current.location.search)).toBeNull()

    act(() => result.current.draft.setSixth(445))
    await waitFor(() => expect(urlSixth(result.current.location.search)).toBe('445'))
    act(() => result.current.draft.clear())
    await waitFor(() => expect(result.current.location.search).toBe(''))
    expect(result.current.draft.sixth).toBeNull()
  })

  it('follows a navigation that only changes the sixth member', async () => {
    const { result, navigate } = renderDraft('/team-builder?ids=6,130,149,663,637&six=248')

    await navigate('/team-builder?ids=6,130,149,663,637&six=445')
    await waitFor(() => expect(result.current.draft.sixth).toBe(445))
    expect(result.current.draft.ids).toEqual([6, 130, 149, 663, 637])
  })

  it('keeps working when localStorage is unavailable', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })

    const { result } = renderDraft('/team-builder')
    expect(result.current.draft.ids).toEqual([])

    act(() => result.current.draft.add(6))
    await waitFor(() => expect(urlIds(result.current.location.search)).toBe('6'))
  })
})
