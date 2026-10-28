import { act, fireEvent, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { SCENES, type SceneId } from '../../lib/scenes'
import { SCENE_FADE_MS, SCENE_INTERVAL_MS, SceneBackdrop } from './SceneBackdrop'

class InstantImage {
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  sizes = ''
  srcset = ''

  set src(_value: string) {
    queueMicrotask(() => this.onload?.())
  }
}

const ROTATING_SCENE = (Object.keys(SCENES) as SceneId[]).find((id) => SCENES[id].photos > 1)!

function photos(container: HTMLElement) {
  return Array.from(container.querySelectorAll('img'))
}

describe('SceneBackdrop', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('renders a decorative photo in two sizes on top of the fallback gradient', () => {
    const { container } = render(<SceneBackdrop scene="grassland" priority />)

    const backdrop = container.firstElementChild as HTMLElement
    const [img] = photos(container)
    expect(backdrop).toHaveAttribute('aria-hidden', 'true')
    expect(backdrop.style.backgroundImage).toContain('linear-gradient')
    expect(img).toHaveAttribute('alt', '')
    expect(img).toHaveAttribute('src', '/scenes/grassland-1-1920.webp')
    expect(img).toHaveAttribute(
      'srcset',
      '/scenes/grassland-1-960.webp 960w, /scenes/grassland-1-1920.webp 1920w',
    )
    expect(img).toHaveAttribute('fetchpriority', 'high')
  })

  it('starts from a random photo of the scene set', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999)
    const { container } = render(<SceneBackdrop scene={ROTATING_SCENE} />)

    expect(photos(container)[0]).toHaveAttribute(
      'data-photo',
      String(SCENES[ROTATING_SCENE].photos),
    )
  })

  it('skips photos that fail and keeps the gradient when every photo fails', () => {
    const { container } = render(<SceneBackdrop scene={ROTATING_SCENE} />)

    fireEvent.error(photos(container)[0]!)
    expect(photos(container)[0]).toHaveAttribute('data-photo', '2')

    for (let attempt = 0; attempt < SCENES[ROTATING_SCENE].photos; attempt += 1) {
      const [img] = photos(container)
      if (img) fireEvent.error(img)
    }
    expect(photos(container)).toHaveLength(0)
    expect((container.firstElementChild as HTMLElement).style.backgroundImage).toContain(
      'linear-gradient',
    )
  })

  it('crossfades to the next photo and shows the ambience layer when animated', async () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'setTimeout', 'clearTimeout'] })
    vi.stubGlobal('Image', InstantImage)
    const { container } = render(<SceneBackdrop scene={ROTATING_SCENE} animated />)

    expect(container.querySelector('[data-ambience]')).toHaveAttribute(
      'data-ambience',
      SCENES[ROTATING_SCENE].ambience.kind,
    )
    expect(photos(container)[0]).toHaveClass('animate-scene-drift')

    await act(async () => {
      vi.advanceTimersByTime(SCENE_INTERVAL_MS)
    })
    const [previous, next] = photos(container)
    expect(previous).toHaveAttribute('data-photo', '1')
    expect(next).toHaveAttribute('data-photo', '2')
    expect(next).toHaveClass('animate-scene-enter')

    await act(async () => {
      vi.advanceTimersByTime(SCENE_FADE_MS)
    })
    expect(photos(container)).toHaveLength(1)
    expect(photos(container)[0]).toHaveAttribute('data-photo', '2')
  })

  it('keeps one still photo without ambience when the user prefers reduced motion', async () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'setTimeout', 'clearTimeout'] })
    vi.stubGlobal('Image', InstantImage)
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
    )
    const { container } = render(<SceneBackdrop scene={ROTATING_SCENE} animated />)

    await act(async () => {
      vi.advanceTimersByTime(SCENE_INTERVAL_MS * 2)
    })
    expect(photos(container)).toHaveLength(1)
    expect(photos(container)[0]).toHaveAttribute('data-photo', '1')
    expect(photos(container)[0]?.className).not.toMatch(/animate-/)
    expect(container.querySelector('[data-ambience]')).toBeNull()
  })

  it('stays on one photo without ambience when not animated', async () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'setTimeout', 'clearTimeout'] })
    vi.stubGlobal('Image', InstantImage)
    const { container } = render(<SceneBackdrop scene={ROTATING_SCENE} />)

    await act(async () => {
      vi.advanceTimersByTime(SCENE_INTERVAL_MS * 2)
    })
    expect(photos(container)).toHaveLength(1)
    expect(container.querySelector('[data-ambience]')).toBeNull()
  })
})
