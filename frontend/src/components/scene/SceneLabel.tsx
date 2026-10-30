import { SCENES, type SceneId } from '../../lib/scenes'

type SceneLabelProps = {
  scene: SceneId
  inline?: boolean
}

export function SceneLabel({ scene, inline = false }: SceneLabelProps) {
  const placement = inline ? 'flex' : 'absolute top-4 right-4 hidden md:flex'
  return (
    <p
      className={`${placement} items-center gap-1.5 rounded-full bg-scrim/80 px-3 py-1.5 text-xs font-bold text-white`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-3.5 flex-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11z" />
        <circle cx="12" cy="10" r="2.2" />
      </svg>
      Khung cảnh: {SCENES[scene].name}
    </p>
  )
}
