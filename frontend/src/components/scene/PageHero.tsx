import { useState, type ReactNode } from 'react'

import { sceneTintStyle, type SceneId } from '../../lib/scenes'
import { SceneBackdrop } from './SceneBackdrop'
import { SceneLabel } from './SceneLabel'

type PageHeroProps = {
  scene: SceneId
  title: string
  subtitle?: ReactNode
  wide?: boolean
  eyebrow?: ReactNode
  aside?: ReactNode
  topBand?: ReactNode
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

export function PageHero({
  scene,
  title,
  subtitle,
  wide = false,
  eyebrow,
  aside,
  topBand,
}: PageHeroProps) {
  const [initialScene] = useState(scene)

  const plate = (
    <div className="w-fit max-w-full rounded-2xl bg-scrim/75 px-4 py-3 text-white md:px-6 md:py-4">
      {eyebrow}
      <h1
        id={PAGE_TITLE_ID}
        className="line-clamp-3 font-display text-display font-normal break-words md:line-clamp-none lg:text-[2.5rem]/[2.75rem]"
      >
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1 max-w-prose text-base text-white/90 md:mt-2 md:text-lg">{subtitle}</p>
      )}
    </div>
  )

  return (
    <section
      aria-labelledby={PAGE_TITLE_ID}
      className="relative h-72 overflow-hidden bg-scrim md:h-120 lg:h-136"
      style={sceneTintStyle(scene)}
    >
      <div
        key={scene}
        className={`absolute inset-0 ${scene === initialScene ? '' : 'animate-iris'}`}
      >
        <SceneBackdrop scene={scene} priority animated />
      </div>
      {topBand}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 scene-fade md:h-1/2"
      />
      <SceneLabel scene={scene} />
      <div className="absolute inset-x-0 bottom-22 md:bottom-36 lg:bottom-42">
        <div className={`mx-auto px-3 md:px-6 xl:px-8 ${containerClassName(wide)}`}>
          {aside ? (
            <div className="flex flex-wrap items-end justify-between gap-3 md:gap-4">
              {plate}
              {aside}
            </div>
          ) : (
            plate
          )}
        </div>
      </div>
    </section>
  )
}

export function PageBody({ scene, wide = false, className = '', children }: PageBodyProps) {
  return (
    <div
      className={`relative z-10 -mt-16 [--hero-overlap:4rem] md:-mt-28 md:[--hero-overlap:7rem] lg:-mt-32 lg:[--hero-overlap:8rem] ${scene ? 'scene-tint' : ''}`}
      style={scene ? sceneTintStyle(scene) : undefined}
    >
      <div className={`mx-auto px-3 md:px-6 xl:px-8 ${containerClassName(wide)} ${className}`}>
        {children}
      </div>
    </div>
  )
}
