import { useEffect, type RefObject } from 'react'

export const OFFSCREEN_ATTRIBUTE = 'data-offscreen'

const ROOT_MARGIN = '200px 0px'

export function usePauseOffscreen(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = containerRef.current
    if (!container || typeof IntersectionObserver === 'undefined') return
    const blocks = [...container.children].filter(
      (child): child is HTMLElement => child instanceof HTMLElement,
    )
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.toggleAttribute(OFFSCREEN_ATTRIBUTE, !entry.isIntersecting)
        }
      },
      { rootMargin: ROOT_MARGIN },
    )
    blocks.forEach((block) => observer.observe(block))
    return () => {
      observer.disconnect()
      blocks.forEach((block) => block.removeAttribute(OFFSCREEN_ATTRIBUTE))
    }
  }, [containerRef])
}
