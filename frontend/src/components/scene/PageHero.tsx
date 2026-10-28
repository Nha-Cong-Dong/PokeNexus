import type { ReactNode } from 'react'

import { sceneTintStyle, type SceneId } from '../../lib/scenes'
import { SceneBackdrop } from './SceneBackdrop'
import { SceneLabel } from './SceneLabel'

type PageHeroProps = {
  scene: SceneId
  title: string
  subtitle?: ReactNode
}

type PageBodyProps = {
  scene?: SceneId
  className?: string
  children: ReactNode
}

const PAGE_TITLE_ID = 'page-title'

export function PageHero({ scene, title, subtitle }: PageHeroProps) {
  return (
    <section
      aria-labelledby={PAGE_TITLE_ID}
      className="relative h-48 overflow-hidden bg-scrim md:h-80"
    >
      <SceneBackdrop scene={scene} priority />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-scrim/85 via-scrim/70 via-70% to-scrim/0 md:h-56"
      />
      <SceneLabel scene={scene} />
      <div className="absolute inset-x-0 bottom-10 md:bottom-20">
        <div className="mx-auto max-w-7xl px-4 text-white md:px-6 xl:px-8">
          <h1
            id={PAGE_TITLE_ID}
            className="font-display text-display font-normal lg:text-[2.5rem]/[2.75rem]"
          >
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 max-w-prose text-base text-white/90 md:mt-2 md:text-lg">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export function PageBody({ scene, className = '', children }: PageBodyProps) {
  return (
    <div
      className={`relative z-10 -mt-6 [--hero-overlap:1.5rem] md:-mt-12 md:[--hero-overlap:3rem] ${scene ? 'scene-tint' : ''}`}
      style={scene ? sceneTintStyle(scene) : undefined}
    >
      <div className={`mx-auto max-w-7xl px-3 md:px-6 xl:px-8 ${className}`}>{children}</div>
    </div>
  )
}
