import { SCENES, type SceneId } from '../../lib/scenes'

type SceneLabelProps = {
  scene: SceneId
}

export function SceneLabel({ scene }: SceneLabelProps) {
  return (
    <p className="absolute top-4 right-4 hidden rounded-full bg-scrim/80 px-3 py-1.5 text-xs font-bold text-white md:block">
      Khung cảnh: {SCENES[scene].name}
    </p>
  )
}
