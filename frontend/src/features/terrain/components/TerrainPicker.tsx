import { useEffect, useRef } from 'react'
import { Link } from 'react-router'

import { TypeBadge } from '../../../components/pokemon/TypeBadge'
import { TypeGlyph } from '../../../components/pokemon/TypeGlyph'
import { sceneThumbUrl } from '../../../lib/assets'
import { staggerDelay } from '../../../lib/motion'
import { SCENES, sceneTintStyle } from '../../../lib/scenes'
import { BallIcon } from '../../trainer/components/BallIcon'
import { TERRAIN_IDS, terrainBadgeId, terrainTypes, type TerrainId } from '../terrains'

type TerrainPickerProps = {
  selected: TerrainId
  ownedBadges: readonly string[]
}

const THUMB_WIDTH = 400
const THUMB_HEIGHT = 600

export function TerrainPicker({ selected, ownedBadges }: TerrainPickerProps) {
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const list = listRef.current
    const item = list?.querySelector<HTMLElement>('[data-current="true"]')
    if (!list || !item || list.scrollWidth <= list.clientWidth) return
    const left = item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2
    list.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
  }, [selected])

  return (
    <ul
      ref={listRef}
      className="-mx-2 flex h-64 gap-1.5 overflow-x-auto px-4 pt-1 pb-3 lg:h-80 lg:gap-2 lg:overflow-visible lg:pb-1"
    >
      {TERRAIN_IDS.map((terrain, index) => {
        const current = terrain === selected
        const owned = ownedBadges.includes(terrainBadgeId(terrain))
        const types = terrainTypes(terrain)
        const name = SCENES[terrain].name
        return (
          <li
            key={terrain}
            data-current={current}
            className={`flex flex-none animate-card-in transition-[flex-grow,width] duration-500 ease-(--ease-emphasized) lg:min-w-0 lg:flex-auto lg:basis-0 ${current ? 'w-44 lg:w-auto lg:grow-[3.6]' : 'w-16 lg:w-auto lg:grow lg:hover:grow-[1.6]'}`}
            style={staggerDelay(index, 35)}
          >
            <Link
              to={`/terrain/${terrain}`}
              preventScrollReset
              aria-current={current ? 'page' : undefined}
              className={`group relative flex flex-1 -skew-x-6 overflow-hidden rounded-xl border-3 border-ink bg-scrim shadow-block focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink ${current ? 'ring-4 ring-dex-yellow' : ''}`}
              style={sceneTintStyle(terrain)}
            >
              <img
                src={sceneThumbUrl(terrain)}
                alt=""
                width={THUMB_WIDTH}
                height={THUMB_HEIGHT}
                decoding="async"
                className="absolute inset-0 size-full scale-125 skew-x-6 object-cover transition-transform duration-700 ease-out group-hover:scale-135"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-scrim via-scrim/40 via-45% to-scrim/0"
              />
              <span
                aria-hidden="true"
                className="absolute -right-8 bottom-10 size-28 bg-(--scene-accent)/70 [clip-path:polygon(100%_0,100%_100%,0_100%)]"
              />
              <svg
                aria-hidden="true"
                viewBox="0 0 40 30"
                className="absolute top-2 right-1.5 w-9 text-(--scene-accent)"
              >
                <path d="M0 0h14L7 11Z M17 3h11l-5.5 9Z M27 15h10l-5 8Z" fill="currentColor" />
              </svg>
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1.5 bg-(--scene-accent)"
              />
              <span className="relative flex flex-1 skew-x-6 flex-col justify-between gap-2 p-2 lg:p-2.5">
                <span aria-hidden="true" className="flex flex-col items-start gap-1">
                  {types.map((type) => (
                    <span
                      key={type}
                      className="flex size-7 items-center justify-center rounded-full border-2 border-ink bg-surface text-ink"
                    >
                      <TypeGlyph type={type} className="size-4" strokeWidth={2} />
                    </span>
                  ))}
                  {owned && <BallIcon kind="master" className="size-7" />}
                </span>
                {current ? (
                  <span className="flex flex-col items-start gap-1.5 text-white">
                    <span
                      aria-hidden="true"
                      className="text-xs font-extrabold tracking-wide text-dex-yellow uppercase"
                    >
                      Đang khám phá
                    </span>
                    <span className="font-display text-xl/6 lg:text-2xl/7">{name}</span>
                    <span aria-hidden="true" className="flex flex-wrap gap-1">
                      {types.map((type) => (
                        <TypeBadge key={type} type={type} />
                      ))}
                    </span>
                  </span>
                ) : (
                  <span className="rotate-180 self-start text-sm font-extrabold text-white [text-shadow:0_2px_0_var(--color-scrim)] [writing-mode:vertical-rl] lg:text-base">
                    {name}
                  </span>
                )}
                {owned && <span className="sr-only">, đã có huy hiệu</span>}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
