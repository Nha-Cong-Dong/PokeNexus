import type { ComponentType } from 'react'
import { Link } from 'react-router'

import { multiplierClassName } from '../../../components/pokemon/multiplierStyles'
import { TypeGlyph } from '../../../components/pokemon/TypeGlyph'
import { Reveal } from '../../../components/motion/Reveal'
import { SceneBackdrop } from '../../../components/scene/SceneBackdrop'
import { typeClassName, typeLabel, typeScopeClassName } from '../../../lib/pokemonTypes'
import { SCENES, sceneSwatch, type SceneId } from '../../../lib/scenes'
import type { TypeName } from '../../../types/api'
import { Aura, Blob, Cloud, Spark, Wave } from './SectionDecor'
import { SectionTitle } from './SectionTitle'

type PeekKind = 'cards' | 'matrix' | 'versus' | 'team' | 'terrain'

interface FeatureIsland {
  to: string
  title: string
  description: string
  scene: SceneId
  glyph: TypeName
  peek: PeekKind
  cardClassName: string
  kickerClassName: string
  dotClassName: string
  itemClassName: string
}

const ISLANDS: readonly FeatureIsland[] = [
  {
    to: '/pokedex',
    title: 'Pokédex',
    description: 'Lọc 1025 loài theo hệ, thế hệ và tổng chỉ số.',
    scene: 'grassland',
    glyph: 'grass',
    peek: 'cards',
    cardClassName:
      'bg-isle-grassland -rotate-[2.5deg] [--glow:color-mix(in_oklab,var(--color-type-grass-deep)_50%,transparent)]',
    kickerClassName: 'text-isle-grassland-ink',
    dotClassName: 'bg-type-grass-deep',
    itemClassName: '',
  },
  {
    to: '/types',
    title: 'Tương khắc',
    description: 'Ma trận 18 × 18 và máy tính cho hệ kép.',
    scene: 'sea',
    glyph: 'electric',
    peek: 'matrix',
    cardClassName:
      'bg-isle-sea rotate-2 [--glow:color-mix(in_oklab,var(--color-type-water-deep)_45%,transparent)]',
    kickerClassName: 'text-primary',
    dotClassName: 'bg-primary',
    itemClassName: 'sm:mt-14 xl:mt-24',
  },
  {
    to: '/compare',
    title: 'So sánh',
    description: 'Hai Pokémon, sáu chỉ số, một kết luận rõ ràng.',
    scene: 'volcano',
    glyph: 'dragon',
    peek: 'versus',
    cardClassName:
      'bg-isle-volcano -rotate-[1.5deg] [--glow:color-mix(in_oklab,var(--color-type-fire-deep)_45%,transparent)]',
    kickerClassName: 'text-isle-volcano-ink',
    dotClassName: 'bg-type-fire-deep',
    itemClassName: 'xl:mt-7',
  },
  {
    to: '/team-builder',
    title: 'Xây đội',
    description: 'Chọn 5 thành viên, tìm lỗ hổng, nhận gợi ý cho slot thứ 6.',
    scene: 'stadium',
    glyph: 'fighting',
    peek: 'team',
    cardClassName:
      'bg-isle-stadium rotate-[2.5deg] [--glow:color-mix(in_oklab,var(--color-type-dragon)_42%,transparent)]',
    kickerClassName: 'text-isle-stadium-ink',
    dotClassName: 'bg-type-dragon',
    itemClassName: 'sm:mt-14 xl:mt-[124px]',
  },
  {
    to: '/terrain',
    title: 'Địa hình',
    description: '13 địa hình, Pokémon sống ở đó và trò đoán bóng Pokémon.',
    scene: 'desert',
    glyph: 'ground',
    peek: 'terrain',
    cardClassName:
      'bg-isle-desert -rotate-2 [--glow:color-mix(in_oklab,var(--color-type-ground-deep)_45%,transparent)]',
    kickerClassName: 'text-isle-desert-ink',
    dotClassName: 'bg-type-ground-deep',
    itemClassName:
      'sm:col-span-2 sm:mx-auto sm:w-[calc(50%-1.375rem)] xl:col-span-1 xl:mx-0 xl:mt-12 xl:w-auto',
  },
]

const PEEK_CARDS: readonly { name: string; type: TypeName }[] = [
  { name: 'Bulbasaur', type: 'grass' },
  { name: 'Vulpix', type: 'fire' },
]

const MINI_MATRIX: readonly number[] = [
  0.5, 0.5, 2, 1, 1, 1, 2, 0.5, 0.5, 1, 2, 1, 0.5, 2, 0.5, 1, 2, 0.5, 1, 2, 0.5, 0.5, 0, 2, 2, 1,
  0.5, 2, 1, 0, 1, 1, 2, 0.5, 1, 1,
]

const PEEK_TEAM: readonly TypeName[] = ['fire', 'water', 'rock', 'fighting', 'ghost']

const PEEK_TERRAINS: readonly SceneId[] = ['forest', 'snowfield', 'volcano']

const TRAIL_PATH =
  'M-20 520 C 40 540, 80 490, 130 490 S 260 590, 376 582 S 520 510, 623 517 S 780 616, 870 608 S 990 540, 1030 560'

const BLOB_SHAPE = 'rounded-[46%_54%_50%_50%/52%_46%_54%_48%]'

function PeekCards() {
  return (
    <div className="flex gap-2">
      {PEEK_CARDS.map((card) => (
        <span
          key={card.name}
          className={`relative h-[62px] min-w-0 flex-1 overflow-hidden rounded-[14px] bg-(--type-deep) px-2.5 py-2 text-white shadow-[0_3px_0_rgb(22_33_62/0.3)] ${typeScopeClassName(card.type)}`}
        >
          <span className="block truncate text-xs/[15px] font-extrabold">{card.name}</span>
          <span className="mt-1 inline-flex h-4 items-center rounded-full bg-ink/25 px-1.5 text-[10px] font-extrabold">
            {typeLabel(card.type)}
          </span>
          <span
            className={`absolute right-1.5 bottom-1.5 flex size-7 items-center justify-center bg-white text-(--type-deep) ${BLOB_SHAPE}`}
          >
            <TypeGlyph type={card.type} className="size-4" strokeWidth={2} />
          </span>
        </span>
      ))}
    </div>
  )
}

function PeekMatrix() {
  return (
    <div className="flex items-end gap-2.5">
      <span className="grid grid-cols-[repeat(6,11px)] gap-0.5 rounded-xl border-2 border-ink bg-white/90 p-2 shadow-[0_3px_0_rgb(22_33_62/0.25)]">
        {MINI_MATRIX.map((value, index) => (
          <span key={index} className={`h-[11px] rounded-[3px] ${multiplierClassName(value)}`} />
        ))}
      </span>
      <span className="flex flex-col gap-1">
        <span className="inline-flex h-[22px] w-[38px] items-center justify-center rounded-md bg-mult-4 text-xs font-extrabold text-white">
          x4
        </span>
        <span className="inline-flex h-[22px] w-[38px] items-center justify-center rounded-md bg-mult-05 text-xs font-bold text-ink">
          x½
        </span>
      </span>
    </div>
  )
}

function PeekVersus() {
  return (
    <span className="flex h-[60px] w-[150px] items-center justify-center overflow-hidden rounded-[14px] border-2 border-ink bg-[linear-gradient(115deg,var(--color-primary)_0_48%,white_48%_52%,var(--color-accent)_52%_100%)] shadow-[0_3px_0_rgb(22_33_62/0.3)]">
      <span className="font-display text-2xl/6 text-white [text-shadow:2px_2px_0_var(--color-ink)]">
        VS
      </span>
    </span>
  )
}

function PeekTeam() {
  return (
    <span className="flex flex-col gap-2 rounded-[14px] border-2 border-ink bg-white/92 p-2.5 shadow-[0_3px_0_rgb(22_33_62/0.25)]">
      <span className="flex gap-[5px]">
        {PEEK_TEAM.map((type) => (
          <span
            key={type}
            className={`size-6 rounded-[7px] border-2 border-ink ${typeClassName(type)}`}
          />
        ))}
        <span className="size-6 rounded-[7px] border-2 border-dashed border-ink bg-white" />
      </span>
      <span className="flex items-center gap-2">
        <span className="text-base/4 font-extrabold text-ink tabular-nums">67</span>
        <span className="h-2.5 flex-1 rounded-[5px] border-2 border-ink bg-[linear-gradient(90deg,var(--color-stat-good)_0_67%,var(--color-surface-muted)_67%_100%)]" />
      </span>
    </span>
  )
}

function PeekTerrain() {
  return (
    <span className="flex items-end gap-3">
      <span className="flex -space-x-2.5">
        {PEEK_TERRAINS.map((scene, index) => (
          <span
            key={scene}
            className={`h-[58px] w-10 rounded-[11px] border-2 border-ink shadow-[0_3px_0_color-mix(in_oklab,var(--color-ink)_25%,transparent)] ${index === 1 ? 'z-10 -translate-y-1.5' : index === 0 ? '-rotate-6' : 'rotate-6'}`}
            style={{ backgroundImage: sceneSwatch(scene) }}
          />
        ))}
      </span>
      <span className="flex size-[58px] items-center justify-center rounded-[14px] border-2 border-ink bg-ink font-display text-[32px]/none text-dex-yellow shadow-[0_3px_0_color-mix(in_oklab,var(--color-ink)_25%,transparent)]">
        ?
      </span>
    </span>
  )
}

const PEEKS: Record<PeekKind, ComponentType> = {
  cards: PeekCards,
  matrix: PeekMatrix,
  versus: PeekVersus,
  team: PeekTeam,
  terrain: PeekTerrain,
}

function IslandCard({ island, index }: { island: FeatureIsland; index: number }) {
  const Peek = PEEKS[island.peek]
  const number = String(index + 1).padStart(2, '0')
  return (
    <Reveal variant="tilt" delay={index * 140} className="relative">
      <div className="motion-safe:animate-bob" style={{ animationDelay: `${index * -1450}ms` }}>
        <Link
          to={island.to}
          className={`group relative flex flex-col rounded-[150px_150px_34px_34px] border-3 border-ink px-[9px] pt-[9px] text-ink shadow-[0_8px_0_rgb(22_33_62/0.18),0_34px_60px_-26px_var(--glow)] transition-[rotate,translate,scale,box-shadow] duration-[450ms] ease-[cubic-bezier(0.3,0.7,0.4,1.35)] hover:-translate-y-2.5 hover:scale-[1.035] hover:rotate-0 hover:shadow-[0_14px_0_rgb(22_33_62/0.14),0_46px_80px_-22px_var(--glow)] focus-visible:rotate-0 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-focus-ring ${island.cardClassName}`}
        >
          <span
            aria-hidden="true"
            className="absolute top-[174px] -left-3 z-30 flex size-[46px] items-center justify-center rounded-full border-3 border-ink bg-dex-yellow text-lg font-extrabold text-ink tabular-nums shadow-[0_3px_0_var(--color-ink)] sm:top-[226px] sm:-left-[18px]"
          >
            {number}
          </span>
          <div
            aria-hidden="true"
            className="relative isolate h-52 overflow-hidden rounded-[141px_141px_24px_24px] border-[2.5px] border-ink sm:h-[260px]"
          >
            <SceneBackdrop scene={island.scene} />
            <span className="shine-sweep w-1/2" />
            <div className="absolute inset-x-3.5 bottom-3.5 transition-transform duration-[450ms] ease-[cubic-bezier(0.3,0.7,0.4,1.3)] group-hover:-translate-y-1.5">
              <Peek />
            </div>
          </div>
          <span
            aria-hidden="true"
            className={`type-blob absolute top-[30px] -right-3 z-30 flex size-[72px] rotate-[8deg] items-center justify-center border-5 border-white text-ink shadow-[0_0_0_2.5px_var(--color-ink),5px_7px_0_rgb(22_33_62/0.3)] transition-transform duration-[450ms] ease-[cubic-bezier(0.3,0.7,0.4,1.5)] group-hover:-translate-y-[18px] group-hover:scale-110 group-hover:-rotate-6 sm:-right-6 sm:size-24 ${BLOB_SHAPE} ${typeScopeClassName(island.glyph)}`}
          >
            <TypeGlyph type={island.glyph} className="size-9 sm:size-[50px]" strokeWidth={1.5} />
          </span>
          <div className="flex flex-col gap-1.5 px-3 pt-[18px] pb-[22px]">
            <span
              className={`text-[13px]/[18px] font-extrabold tracking-[0.06em] uppercase ${island.kickerClassName}`}
            >
              Vùng {number} · {SCENES[island.scene].name}
            </span>
            <h3 className="text-[1.75rem]/8 font-extrabold">{island.title}</h3>
            <p className="text-[17px]/[25px] text-ink-muted">{island.description}</p>
            <span className="mt-2 inline-flex items-center gap-2.5 font-extrabold">
              Khám phá
              <span
                aria-hidden="true"
                className={`flex size-9 items-center justify-center rounded-full border-2 border-ink text-white transition-transform duration-300 ease-[cubic-bezier(0.3,0.7,0.4,1.5)] group-hover:translate-x-2 ${island.dotClassName}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-[18px]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h13M13 6l6 6-6 6" />
                </svg>
              </span>
            </span>
          </div>
        </Link>
      </div>
      <span
        aria-hidden="true"
        className="absolute inset-x-[14%] -bottom-10 h-[26px] rounded-full bg-radial-[closest-side] from-ink/32 to-transparent motion-safe:animate-isle-shadow"
        style={{ animationDelay: `${index * -1450}ms` }}
      />
    </Reveal>
  )
}

export function FeatureRegions() {
  return (
    <section
      aria-labelledby="regions-title"
      className="relative -mt-10 overflow-hidden bg-linear-to-b from-band-sky via-band-lilac via-48% to-band-peach px-4 pt-[84px] pb-[70px] md:px-6 md:pt-[140px] md:pb-[120px]"
    >
      <Aura>
        <Blob className="-top-[6%] -left-[40%] size-[460px] from-type-grass/42 md:-left-[10%] md:size-[760px]" />
        <Blob
          drift="b"
          className="-top-[14%] -right-[46%] size-[500px] from-type-flying/48 md:-right-[12%] md:size-[820px]"
        />
        <Blob
          drift="b"
          className="-bottom-[26%] left-[26%] size-[460px] from-type-water/34 md:size-[760px]"
        />
        <Blob className="-right-[30%] -bottom-[12%] size-[400px] from-type-fire/30 md:right-[4%] md:size-[620px]" />
      </Aura>
      <div aria-hidden="true">
        <Cloud
          className="top-24 w-[120px] opacity-85 md:w-[220px]"
          style={{ animationDelay: '-22s' }}
        />
        <Cloud
          className="top-[340px] w-[90px] opacity-70 md:w-[160px]"
          style={{ animationDuration: '92s', animationDelay: '-58s' }}
        />
        <Cloud
          className="top-[620px] w-[260px] opacity-75 max-md:hidden"
          style={{ animationDuration: '80s', animationDelay: '-8s' }}
        />
        <Spark
          className="top-[230px] left-[7%] w-[26px] fill-dex-yellow"
          style={{ animationDelay: '0.2s' }}
        />
        <Spark
          className="top-[170px] right-[9%] w-5 fill-white"
          style={{ animationDelay: '1.1s' }}
        />
        <Spark
          className="top-[120px] left-[46%] w-4 fill-type-psychic"
          style={{ animationDelay: '2s' }}
        />
      </div>
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <SectionTitle id="regions-title">Năm vùng đất</SectionTitle>
          <p className="max-w-[52ch] text-lg/7 text-ink-muted">
            Mỗi công cụ là một hòn đảo trên hành trình. Bấm vào đảo để đi tới công cụ đó.
          </p>
        </div>
        <div className="relative mt-12 md:mt-[72px]">
          <svg
            aria-hidden="true"
            viewBox="0 0 1000 640"
            preserveAspectRatio="none"
            className="pointer-events-none absolute top-0 -left-6 hidden h-full w-[calc(100%+48px)] overflow-visible xl:block"
          >
            <path
              d={TRAIL_PATH}
              fill="none"
              className="stroke-ink/10"
              strokeWidth="22"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={TRAIL_PATH}
              fill="none"
              className="stroke-white"
              strokeWidth="5"
              strokeDasharray="1 15"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <ul className="relative grid items-start gap-14 pb-[70px] sm:grid-cols-2 sm:gap-x-11 sm:gap-y-16 xl:grid-cols-5 xl:gap-6">
            {ISLANDS.map((island, index) => (
              <li key={island.to} className={`relative ${island.itemClassName}`}>
                <IslandCard island={island} index={index} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Wave variant="ridge" className="fill-ink" />
    </section>
  )
}
