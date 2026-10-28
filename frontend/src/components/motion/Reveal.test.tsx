import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Reveal } from './Reveal'

type ObserverCallback = (entries: { isIntersecting: boolean }[]) => void

function stubObserver() {
  const callbacks: ObserverCallback[] = []
  const disconnect = vi.fn()
  class FakeObserver {
    constructor(callback: ObserverCallback) {
      callbacks.push(callback)
    }
    observe() {}
    disconnect() {
      disconnect()
    }
  }
  vi.stubGlobal('IntersectionObserver', FakeObserver)
  return { callbacks, disconnect }
}

function stubReducedMotion(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Reveal', () => {
  it('shows content right away when the browser has no IntersectionObserver', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    render(<Reveal className="card">Nội dung</Reveal>)

    const node = screen.getByText('Nội dung')
    expect(node).toHaveClass('reveal', 'reveal-up', 'is-in', 'card')
    expect(node).toHaveAttribute('data-revealed', 'true')
  })

  it('waits until the block scrolls into view, then stops observing', () => {
    const { callbacks, disconnect } = stubObserver()
    render(
      <Reveal variant="tilt" delay={140}>
        Đảo
      </Reveal>,
    )
    const node = screen.getByText('Đảo')
    expect(node).not.toHaveClass('is-in')
    expect(node).toHaveClass('reveal-tilt')
    expect(node).toHaveStyle({ transitionDelay: '140ms' })

    act(() => callbacks[0]?.([{ isIntersecting: false }]))
    expect(node).not.toHaveClass('is-in')

    act(() => callbacks[0]?.([{ isIntersecting: true }]))
    expect(node).toHaveClass('is-in')
    expect(disconnect).toHaveBeenCalled()
  })

  it('never hides content when the user prefers reduced motion', () => {
    stubObserver()
    stubReducedMotion(true)
    render(<Reveal>Biểu đồ</Reveal>)

    expect(screen.getByText('Biểu đồ')).toHaveClass('is-in')
  })
})
