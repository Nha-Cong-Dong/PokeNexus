import { useEffect, useRef, useState } from 'react'

import { sceneSrcSet, sceneUrl } from '../../lib/assets'
import { nextPhoto, SCENES, sceneGradient, type SceneId } from '../../lib/scenes'
import { SceneAmbience } from './SceneAmbience'
import { useReducedMotion } from './useReducedMotion'

export const SCENE_INTERVAL_MS = 12_000
export const SCENE_FADE_MS = 1_200

const SIZES = '100vw'

type SceneBackdropProps = {
  scene: SceneId
  priority?: boolean
  animated?: boolean
}

type PhotoLayer = {
  id: number
  photo: number
  entering: boolean
}

type PhotoState = {
  layers: readonly PhotoLayer[]
  failed: readonly number[]
  nextId: number
}

function initialState(count: number): PhotoState {
  if (count === 0) return { layers: [], failed: [], nextId: 0 }
  const photo = Math.floor(Math.random() * count) + 1
  return { layers: [{ id: 0, photo, entering: false }], failed: [], nextId: 1 }
}

function currentPhoto(state: PhotoState): number | null {
  return state.layers.at(-1)?.photo ?? null
}

export function SceneBackdrop({ scene, priority = false, animated = false }: SceneBackdropProps) {
  const reducedMotion = useReducedMotion()
  const moving = animated && !reducedMotion

  return (
    <div
      aria-hidden="true"
      data-scene={scene}
      className="absolute inset-0 overflow-hidden"
      style={{ backgroundImage: sceneGradient(scene) }}
    >
      <ScenePhotos key={scene} scene={scene} priority={priority} rotating={moving} />
      {moving && <SceneAmbience scene={scene} />}
    </div>
  )
}

type ScenePhotosProps = {
  scene: SceneId
  priority: boolean
  rotating: boolean
}

function ScenePhotos({ scene, priority, rotating }: ScenePhotosProps) {
  const count = SCENES[scene].photos
  const [state, setState] = useState(() => initialState(count))
  const stateRef = useRef(state)
  const canRotate = rotating && count - state.failed.length > 1
  const fading = state.layers.length > 1

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    if (!canRotate) return
    let cancelled = false
    const timer = window.setInterval(() => {
      if (document.hidden) return
      const { failed } = stateRef.current
      const current = currentPhoto(stateRef.current)
      const next = nextPhoto(current, count, failed)
      if (next === null || next === current) return
      const image = new Image()
      image.sizes = SIZES
      image.srcset = sceneSrcSet(scene, next)
      image.src = sceneUrl(scene, next, 1920)
      image.onload = () => {
        const decoded =
          typeof image.decode === 'function'
            ? image.decode().catch(() => undefined)
            : Promise.resolve()
        void decoded.then(() => {
          if (cancelled) return
          setState((previous) => ({
            ...previous,
            layers: [
              ...previous.layers.slice(-1),
              { id: previous.nextId, photo: next, entering: true },
            ],
            nextId: previous.nextId + 1,
          }))
        })
      }
      image.onerror = () => {
        if (cancelled) return
        setState((previous) => ({ ...previous, failed: [...previous.failed, next] }))
      }
    }, SCENE_INTERVAL_MS)
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [canRotate, count, scene])

  useEffect(() => {
    if (!fading) return
    const timer = window.setTimeout(() => {
      setState((previous) => ({ ...previous, layers: previous.layers.slice(-1) }))
    }, SCENE_FADE_MS)
    return () => window.clearTimeout(timer)
  }, [fading, state.nextId])

  const handleError = (photo: number) => {
    setState((previous) => {
      const failed = [...previous.failed, photo]
      const layers = previous.layers.filter((layer) => layer.photo !== photo)
      if (layers.length > 0) return { ...previous, layers, failed }
      const replacement = nextPhoto(photo, count, failed)
      if (replacement === null) return { ...previous, layers: [], failed }
      return {
        layers: [{ id: previous.nextId, photo: replacement, entering: false }],
        failed,
        nextId: previous.nextId + 1,
      }
    })
  }

  return state.layers.map((layer, index) => {
    const isCurrent = index === state.layers.length - 1
    const motion = layer.entering ? 'animate-scene-enter' : rotating ? 'animate-scene-drift' : ''
    return (
      <img
        key={layer.id}
        src={sceneUrl(scene, layer.photo, 1920)}
        srcSet={sceneSrcSet(scene, layer.photo)}
        sizes={SIZES}
        alt=""
        decoding="async"
        data-photo={layer.photo}
        fetchPriority={priority && isCurrent ? 'high' : 'auto'}
        className={`absolute inset-0 h-full w-full object-cover object-[center_60%] ${motion}`}
        onError={() => handleError(layer.photo)}
      />
    )
  })
}
