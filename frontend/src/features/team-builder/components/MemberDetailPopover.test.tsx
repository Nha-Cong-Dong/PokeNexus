import { act, fireEvent, render, screen } from '@testing-library/react'
import type { ReactElement } from 'react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { LONG_PRESS_MS, MemberDetailPopover } from './MemberDetailPopover'
import { TeamMemberCard } from './TeamMemberCard'

function renderWithRouter(element: ReactElement) {
  const router = createMemoryRouter([
    { path: '/', element },
    { path: '/pokemon/:idOrName', element: <h1>Trang chi tiết</h1> },
  ])
  render(<RouterProvider router={router} />)
  return router
}

function renderPopover() {
  const router = renderWithRouter(
    <MemberDetailPopover pokemonName="garchomp" displayName="Garchomp">
      <span>Thẻ Garchomp</span>
    </MemberDetailPopover>,
  )
  return { router, trigger: screen.getByTestId('member-detail-trigger') }
}

const detailLink = () => screen.queryByRole('link', { name: /Xem thông tin chi tiết/ })

describe('MemberDetailPopover', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows the detail link while a mouse hovers and hides it on leave, without navigating on click', () => {
    const { router, trigger } = renderPopover()

    fireEvent.click(trigger)
    expect(router.state.location.pathname).toBe('/')
    expect(detailLink()).toBeNull()

    fireEvent.pointerEnter(trigger, { pointerType: 'mouse' })
    expect(detailLink()).toHaveAttribute('href', '/pokemon/garchomp')

    fireEvent.pointerLeave(trigger, { pointerType: 'mouse' })
    expect(detailLink()).toBeNull()
  })

  it('opens only after a touch is held for 1.5 seconds', () => {
    const { trigger } = renderPopover()

    fireEvent.pointerDown(trigger, { pointerType: 'touch', clientX: 10, clientY: 10 })
    act(() => {
      vi.advanceTimersByTime(LONG_PRESS_MS - 100)
    })
    expect(detailLink()).toBeNull()

    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(detailLink()).toHaveAttribute('href', '/pokemon/garchomp')
  })

  it('cancels the long press when the finger lifts early or moves away', () => {
    const { trigger } = renderPopover()

    fireEvent.pointerDown(trigger, { pointerType: 'touch', clientX: 10, clientY: 10 })
    act(() => {
      vi.advanceTimersByTime(1400)
    })
    fireEvent.pointerUp(trigger, { pointerType: 'touch' })
    act(() => {
      vi.advanceTimersByTime(LONG_PRESS_MS)
    })
    expect(detailLink()).toBeNull()

    fireEvent.pointerDown(trigger, { pointerType: 'touch', clientX: 10, clientY: 10 })
    fireEvent.pointerMove(trigger, { pointerType: 'touch', clientX: 10, clientY: 40 })
    act(() => {
      vi.advanceTimersByTime(LONG_PRESS_MS)
    })
    expect(detailLink()).toBeNull()
  })

  it('does not open from the focus that a short tap gives the card', () => {
    const { trigger } = renderPopover()

    fireEvent.pointerDown(trigger, { pointerType: 'touch', clientX: 10, clientY: 10 })
    act(() => {
      vi.advanceTimersByTime(300)
    })
    fireEvent.pointerUp(trigger, { pointerType: 'touch' })
    act(() => {
      trigger.focus()
    })
    act(() => {
      vi.advanceTimersByTime(LONG_PRESS_MS)
    })

    expect(detailLink()).toBeNull()
  })

  it('opens on keyboard focus and closes on Escape', () => {
    const { trigger } = renderPopover()

    act(() => {
      trigger.focus()
    })
    expect(detailLink()).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(detailLink()).toBeNull()
  })

  it('closes when a press lands outside after a long press opened it', () => {
    const { trigger } = renderPopover()

    fireEvent.pointerDown(trigger, { pointerType: 'touch', clientX: 0, clientY: 0 })
    act(() => {
      vi.advanceTimersByTime(LONG_PRESS_MS)
    })
    expect(detailLink()).toBeInTheDocument()

    fireEvent.pointerDown(document.body, { pointerType: 'touch' })
    expect(detailLink()).toBeNull()
  })

  it('navigates to the detail page when the link in the popover is used', () => {
    const { router, trigger } = renderPopover()

    fireEvent.pointerEnter(trigger, { pointerType: 'mouse' })
    fireEvent.click(detailLink() as HTMLElement)

    expect(router.state.location.pathname).toBe('/pokemon/garchomp')
  })
})

describe('TeamMemberCard', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('keeps the remove button working and does not start a long press from it', () => {
    vi.useFakeTimers()
    const onRemove = vi.fn()
    renderWithRouter(
      <TeamMemberCard
        id={445}
        pokemon={{ id: 445, name: 'garchomp', types: ['dragon', 'ground'] }}
        onRemove={onRemove}
      />,
    )

    const remove = screen.getByRole('button', { name: 'Bỏ Garchomp khỏi đội' })
    fireEvent.pointerDown(remove, { pointerType: 'touch' })
    act(() => {
      vi.advanceTimersByTime(LONG_PRESS_MS)
    })
    fireEvent.click(remove)

    expect(onRemove).toHaveBeenCalledTimes(1)
    expect(detailLink()).toBeNull()
  })

  it('has no detail popover while the Pokémon is still loading', () => {
    renderWithRouter(<TeamMemberCard id={445} onRemove={vi.fn()} />)

    expect(screen.queryByTestId('member-detail-trigger')).toBeNull()
  })
})
