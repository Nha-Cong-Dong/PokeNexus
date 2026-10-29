import { useEffect, useRef, useState, type ReactNode } from 'react'

import { useReducedMotion } from '../scene/useReducedMotion'

export type RevealVariant = 'up' | 'left' | 'right' | 'zoom' | 'tilt'

type RevealProps = {
  variant?: RevealVariant
  delay?: number
  className?: string
  children: ReactNode
}

const ROOT_MARGIN = '0px 0px -10% 0px'
const THRESHOLD = 0.1

export function Reveal({ variant = 'up', delay = 0, className = '', children }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const [seen, setSeen] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const node = ref.current
    if (seen || !node) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setSeen(true)
          observer.disconnect()
        }
      },
      { rootMargin: ROOT_MARGIN, threshold: THRESHOLD },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [seen])

  const visible = seen || reducedMotion
  return (
    <div
      ref={ref}
      data-revealed={visible}
      className={`reveal reveal-${variant} ${visible ? 'is-in' : ''} ${className}`.trim()}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
