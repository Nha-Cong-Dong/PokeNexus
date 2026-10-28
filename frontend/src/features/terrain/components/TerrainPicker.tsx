import { Link } from 'react-router'

import { SCENES, sceneSwatch } from '../../../lib/scenes'
import { TERRAIN_IDS, terrainBadgeId, type TerrainId } from '../terrains'

type TerrainPickerProps = {
  selected: TerrainId
  ownedBadges: readonly string[]
}

export function TerrainPicker({ selected, ownedBadges }: TerrainPickerProps) {
  return (
    <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-7">
      {TERRAIN_IDS.map((terrain) => {
        const current = terrain === selected
        const owned = ownedBadges.includes(terrainBadgeId(terrain))
        return (
          <li key={terrain}>
            <Link
              to={`/terrain/${terrain}`}
              preventScrollReset
              aria-current={current ? 'page' : undefined}
              className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-ink font-extrabold transition-transform duration-150 ease-out hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink ${current ? 'bg-dex-yellow shadow-block-lg' : 'bg-surface'}`}
            >
              <span
                aria-hidden="true"
                className="h-10 w-full border-b-2 border-ink"
                style={{ backgroundImage: sceneSwatch(terrain) }}
              />
              <span aria-hidden="true" className="shine-sweep" />
              <span className="flex min-h-10 items-center justify-between gap-2 px-3 py-1.5 text-sm">
                {SCENES[terrain].name}
                {owned && (
                  <span className="rounded-full bg-ink px-2 py-0.5 text-xs text-surface">
                    Huy hiệu
                  </span>
                )}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
