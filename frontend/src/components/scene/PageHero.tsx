import { useState, type ReactNode } from 'react'

import { sceneTintStyle, type SceneId } from '../../lib/scenes'
import { SceneBackdrop } from './SceneBackdrop'
import { SceneLabel } from './SceneLabel'

type PageHeroProps = {
  scene: SceneId
  title: string
  subtitle?: ReactNode
  wide?: boolean
}

type PageBodyProps = {
  scene?: SceneId
  wide?: boolean
  className?: string
  children: ReactNode
}

const PAGE_TITLE_ID = 'page-title'

function containerClassName(wide: boolean): string {
  return wide ? 'max-w-[100rem]' : 'max-w-7xl'
}

export function PageHero({ scene, title, subtitle, wide = false }: PageHeroProps) {
  const [initialScene] = useState(scene)

  return (
    <section
      aria-labelledby={PAGE_TITLE_ID}
      className="relative h-48 overflow-hidden bg-scrim md:h-80"
    >
      <div
        key={scene}
        className={`absolute inset-0 ${scene === initialScene ? '' : 'animate-iris'}`}
      >
        <SceneBackdrop scene={scene} priority animated />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-scrim/50 to-scrim/0 md:h-32"
      />
      <SceneLabel scene={scene} />
      <div className="absolute inset-x-0 bottom-9 md:bottom-17">
        <div className={`mx-auto px-3 md:px-6 xl:px-8 ${containerClassName(wide)}`}>
          <div className="w-fit max-w-full rounded-2xl bg-scrim/75 px-4 py-3 text-white md:px-6 md:py-4">
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
      </div>
    </section>
  )
}

export function PageBody({ scene, wide = false, className = '', children }: PageBodyProps) {
  return (
    <div
      className={`relative z-10 -mt-6 [--hero-overlap:1.5rem] md:-mt-12 md:[--hero-overlap:3rem] ${scene ? 'scene-tint' : ''}`}
      style={scene ? sceneTintStyle(scene) : undefined}
    >
      <div className={`mx-auto px-3 md:px-6 xl:px-8 ${containerClassName(wide)} ${className}`}>
        {children}
      </div>
    </div>
  )
}
