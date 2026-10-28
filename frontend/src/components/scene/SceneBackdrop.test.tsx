import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SceneBackdrop } from './SceneBackdrop'

describe('SceneBackdrop', () => {
  it('renders a decorative photo with two sizes on top of the fallback gradient', () => {
    const { container } = render(<SceneBackdrop scene="grassland" priority />)

    const backdrop = container.firstElementChild as HTMLElement
    const img = container.querySelector('img')
    expect(backdrop).toHaveAttribute('aria-hidden', 'true')
    expect(backdrop.style.backgroundImage).toContain('linear-gradient')
    expect(img).toHaveAttribute('alt', '')
    expect(img).toHaveAttribute('src', '/scenes/grassland-1600.webp')
    expect(img).toHaveAttribute(
      'srcset',
      '/scenes/grassland-800.webp 800w, /scenes/grassland-1600.webp 1600w',
    )
    expect(img).toHaveAttribute('fetchpriority', 'high')
  })

  it('shows only the gradient for scenes without a photo', () => {
    const { container } = render(<SceneBackdrop scene="flower-garden" />)

    expect(container.querySelector('img')).toBeNull()
  })

  it('drops the photo and keeps the gradient when the image fails to load', () => {
    const { container } = render(<SceneBackdrop scene="stadium" />)

    fireEvent.error(container.querySelector('img')!)

    expect(container.querySelector('img')).toBeNull()
    expect((container.firstElementChild as HTMLElement).style.backgroundImage).toContain(
      'linear-gradient',
    )
  })
})
