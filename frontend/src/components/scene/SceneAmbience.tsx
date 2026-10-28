import type { CSSProperties } from 'react'

import { SCENES, type SceneId } from '../../lib/scenes'

const PARTICLE_COUNT = 18

const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, index) => {
  const a = (index * 0.618033988749895 + 0.13) % 1
  const b = (index * 0.754877666246693 + 0.41) % 1
  const c = (index * 0.569840290998053 + 0.77) % 1
  return {
    x: `${(a * 100).toFixed(1)}%`,
    y: `${(b * 100).toFixed(1)}%`,
    size: `${(2 + c * 4).toFixed(1)}px`,
    delay: `${(-b * 12).toFixed(1)}s`,
    duration: `${(9 + a * 8).toFixed(1)}s`,
    drift: `${Math.round((c - 0.5) * 120)}px`,
  }
})

type SceneAmbienceProps = {
  scene: SceneId
}

export function SceneAmbience({ scene }: SceneAmbienceProps) {
  const { kind, color } = SCENES[scene].ambience

  return (
    <div
      aria-hidden="true"
      data-ambience={kind}
      className={`scene-ambience ambience-${kind}`}
      style={{ '--particle-color': color } as CSSProperties}
    >
      {PARTICLES.map((particle, index) => (
        <span
          key={index}
          className={`ambience-particle ${index % 2 === 1 ? 'max-md:hidden' : ''}`}
          style={
            {
              '--x': particle.x,
              '--y': particle.y,
              '--size': particle.size,
              '--delay': particle.delay,
              '--duration': particle.duration,
              '--drift': particle.drift,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
