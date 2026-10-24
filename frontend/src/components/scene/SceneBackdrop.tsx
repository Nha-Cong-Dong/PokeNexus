import { useState } from 'react'

import { SCENE_WIDTHS, sceneUrl } from '../../lib/assets'
import { SCENES, type SceneId } from '../../lib/scenes'

type SceneBackdropProps = {
  scene: SceneId
  priority?: boolean
}

export function SceneBackdrop({ scene, priority = false }: SceneBackdropProps) {
  const [failedScene, setFailedScene] = useState<SceneId | null>(null)
  const { top, bottom, photo } = SCENES[scene]
  const showPhoto = photo && failedScene !== scene

  return (
    <div
      aria-hidden="true"
      data-scene={scene}
      className="absolute inset-0 overflow-hidden"
      style={{ backgroundImage: `linear-gradient(180deg, ${top} 0%, ${bottom} 100%)` }}
    >
      {showPhoto && (
        <img
          src={sceneUrl(scene, 1600)}
          srcSet={SCENE_WIDTHS.map((width) => `${sceneUrl(scene, width)} ${width}w`).join(', ')}
          sizes="100vw"
          alt=""
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          className="h-full w-full object-cover object-[center_60%]"
          onError={() => setFailedScene(scene)}
        />
      )}
    </div>
  )
}
