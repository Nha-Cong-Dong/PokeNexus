import { act, render, screen } from '@testing-library/react'
import { useRef } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { OFFSCREEN_ATTRIBUTE, usePauseOffscreen } from './usePauseOffscreen'

type ObserverCallback = (entries: { target: Element; isIntersecting: boolean }[]) => void

function stubObserver() {
  const callbacks: ObserverCallback[] = []
  const observed: Element[] = []
  const disconnect = vi.fn()
  class FakeObserver {
    constructor(callback: ObserverCallback) {
      callbacks.push(callback)
    }
    observe(target: Element) {
      observed.push(target)
    }
    disconnect() {
      disconnect()
    }
  }
  vi.stubGlobal('IntersectionObserver', FakeObserver)
  return { callbacks, observed, disconnect }
}

function Blocks() {
  const ref = useRef<HTMLDivElement>(null)
  usePauseOffscreen(ref)
  return (
    <div ref={ref}>
      <section>Hero</section>
      <section>Quiz</section>
    </div>
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('usePauseOffscreen', () => {
  it('marks blocks outside the viewport and clears the mark when they come back', () => {
    const { callbacks, observed } = stubObserver()
    render(<Blocks />)
    const hero = screen.getByText('Hero')
    const quiz = screen.getByText('Quiz')
    expect(observed).toEqual([hero, quiz])

    act(() =>
      callbacks[0]?.([
        { target: hero, isIntersecting: true },
        { target: quiz, isIntersecting: false },
      ]),
    )
    expect(hero).not.toHaveAttribute(OFFSCREEN_ATTRIBUTE)
    expect(quiz).toHaveAttribute(OFFSCREEN_ATTRIBUTE)

    act(() => callbacks[0]?.([{ target: quiz, isIntersecting: true }]))
    expect(quiz).not.toHaveAttribute(OFFSCREEN_ATTRIBUTE)
  })

  it('stops observing and removes the marks on unmount', () => {
    const { callbacks, disconnect } = stubObserver()
    const { unmount } = render(<Blocks />)
    const quiz = screen.getByText('Quiz')
    act(() => callbacks[0]?.([{ target: quiz, isIntersecting: false }]))

    unmount()

    expect(disconnect).toHaveBeenCalledOnce()
    expect(quiz).not.toHaveAttribute(OFFSCREEN_ATTRIBUTE)
  })

  it('does nothing when the browser has no IntersectionObserver', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    render(<Blocks />)

    expect(screen.getByText('Hero')).not.toHaveAttribute(OFFSCREEN_ATTRIBUTE)
  })
})
