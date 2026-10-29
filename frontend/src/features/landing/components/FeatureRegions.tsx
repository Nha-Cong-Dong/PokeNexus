import { Link } from 'react-router'

import { TypeGlyph } from '../../../components/pokemon/TypeGlyph'
import { Reveal } from '../../../components/motion/Reveal'
import { SceneBackdrop } from '../../../components/scene/SceneBackdrop'
import { SCENES, type SceneId } from '../../../lib/scenes'
import type { TypeName } from '../../../types/api'
import { SectionTitle } from './SectionTitle'

interface FeatureIsland {
  to: string
  title: string
  description: string
  scene: SceneId
  glyph: TypeName
  kickerClassName: string
}

const ISLANDS: readonly FeatureIsland[] = [
  {
    to: '/pokedex',
    title: 'Pokédex',
    description: 'Lọc 1025 loài theo hệ, thế hệ và tổng chỉ số.',
    scene: 'grassland',
    glyph: 'grass',
    kickerClassName: 'text-type-grass-deep',
  },
  {
    to: '/types',
    title: 'Tương khắc',
    description: 'Ma trận 18 × 18 và máy tính cho hệ kép.',
    scene: 'sea',
    glyph: 'electric',
    kickerClassName: 'text-primary',
  },
  {
    to: '/compare',
    title: 'So sánh',
    description: 'Hai Pokémon, sáu chỉ số, một kết luận rõ ràng.',
    scene: 'volcano',
    glyph: 'flying',
    kickerClassName: 'text-accent',
  },
  {
    to: '/team-builder',
    title: 'Xây đội',
    description: 'Chọn 5 thành viên, tìm lỗ hổng, nhận gợi ý cho slot thứ 6.',
    scene: 'stadium',
    glyph: 'fairy',
    kickerClassName: 'text-type-dragon',
  },
]

export function FeatureRegions() {
  return (
    <section
      aria-labelledby="regions-title"
      className="bg-linear-to-b from-bg to-surface-muted px-4 pt-16 pb-20 md:px-6 md:pt-20 md:pb-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <SectionTitle id="regions-title">Bốn vùng đất</SectionTitle>
          <p className="max-w-[52ch] text-lg/7 text-ink-muted">
            Mỗi công cụ là một hòn đảo trên hành trình. Bấm vào đảo để đi tới công cụ đó.
          </p>
        </div>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ISLANDS.map((island, index) => (
            <li key={island.to} className="flex">
              <Reveal variant="tilt" delay={index * 140} className="flex flex-1">
                <Link
                  to={island.to}
                  className="group relative flex flex-1 animate-bob flex-col overflow-hidden rounded-[1.75rem] border-2 border-ink bg-surface shadow-block-lg transition-[translate,scale,rotate] duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus-ring"
                  style={{ animationDelay: `${index * -850}ms` }}
                >
                  <div
                    aria-hidden="true"
                    className="relative h-40 overflow-hidden border-b-2 border-ink"
                  >
                    <SceneBackdrop scene={island.scene} />
                    <span aria-hidden="true" className="shine-sweep w-1/2" />
                    <span className="absolute top-3 right-3 flex size-12 items-center justify-center rounded-full border-3 border-ink bg-surface text-ink shadow-blob">
                      <TypeGlyph type={island.glyph} className="size-6" strokeWidth={2} />
                    </span>
                    <span className="tabular-nums absolute bottom-3 left-3 flex size-9 items-center justify-center rounded-full border-2 border-ink bg-dex-yellow text-sm font-extrabold text-ink">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5 p-5">
                    <span
                      className={`text-xs font-extrabold tracking-wide uppercase ${island.kickerClassName}`}
                    >
                      Vùng {String(index + 1).padStart(2, '0')} · {SCENES[island.scene].name}
                    </span>
                    <h3 className="text-2xl font-extrabold text-ink">{island.title}</h3>
                    <p className="flex-1 text-ink-muted">{island.description}</p>
                    <span className="mt-3 inline-flex items-center gap-2 font-extrabold text-ink">
                      Khám phá
                      <span
                        aria-hidden="true"
                        className="flex size-8 items-center justify-center rounded-full bg-ink text-white transition-transform group-hover:translate-x-1"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="size-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h13M13 6l6 6-6 6" />
                        </svg>
                      </span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
