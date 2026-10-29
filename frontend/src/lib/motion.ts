import type { CSSProperties } from 'react'

export const STAGGER_MAX_MS = 640

export function staggerDelay(index: number, stepMs = 40, baseMs = 0): CSSProperties {
  return { animationDelay: `${Math.min(baseMs + index * stepMs, baseMs + STAGGER_MAX_MS)}ms` }
}
