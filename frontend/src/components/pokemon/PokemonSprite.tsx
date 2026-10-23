import { useState } from 'react'

import { getArtworkUrl, getSpriteUrl, PLACEHOLDER_URL } from '../../lib/assets'

type PokemonSpriteProps = {
  id: number
  alt: string
  size?: number
  variant?: 'sprite' | 'artwork'
}

function sourcesFor(id: number, variant: 'sprite' | 'artwork'): string[] {
  const chain = [getSpriteUrl(id), PLACEHOLDER_URL]
  return variant === 'artwork' ? [getArtworkUrl(id), ...chain] : chain
}

export function PokemonSprite({ id, alt, size = 96, variant = 'sprite' }: PokemonSpriteProps) {
  const [failure, setFailure] = useState({ id, level: 0 })
  const level = failure.id === id ? failure.level : 0
  const sources = sourcesFor(id, variant)
  const src = sources[Math.min(level, sources.length - 1)]

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      className={variant === 'sprite' ? '[image-rendering:pixelated]' : undefined}
      onError={() => {
        if (level < sources.length - 1) setFailure({ id, level: level + 1 })
      }}
    />
  )
}
