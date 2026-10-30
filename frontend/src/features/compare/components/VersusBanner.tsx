import { DexNumber } from '../../../components/pokemon/DexNumber'
import { PokemonSprite } from '../../../components/pokemon/PokemonSprite'
import { TypeBadge } from '../../../components/pokemon/TypeBadge'
import { SceneBackdrop } from '../../../components/scene/SceneBackdrop'
import { formatPokemonName } from '../../../lib/formatters'
import { SCENES, sceneForTypes } from '../../../lib/scenes'
import type { PokemonDetail } from '../../../types/api'
import type { CompareSide } from '../useCompareSearchParams'

type VersusBannerProps = {
  left: PokemonDetail
  right: PokemonDetail
}

type BannerSideStyle = {
  half: string
  plate: string
  dex: string
  marker: string
  art: string
  float: string
  shadow: string
  scene: string
}

const PAGE_TITLE_ID = 'page-title'

const HALF_CLASS =
  'absolute inset-0 transition-[translate,opacity] duration-400 ease-out starting:opacity-0'

const SHADOW_GRADIENT =
  'bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--color-scrim)_45%,transparent),transparent)]'

const SIDE_MARKER_CLASSES: Record<CompareSide, string> = {
  left: 'bg-primary',
  right:
    'bg-[repeating-linear-gradient(45deg,var(--color-accent)_0_3px,color-mix(in_oklab,var(--color-accent)_55%,var(--color-white))_3px_5px)]',
}

const SIDE_STYLES: Record<CompareSide, BannerSideStyle> = {
  left: {
    half: '[clip-path:polygon(0_0,100%_0,100%_52%,0_40%)] starting:-translate-y-1/4 md:[clip-path:polygon(0_0,57%_0,43%_100%,0_100%)] md:starting:-translate-x-1/3 md:starting:translate-y-0',
    plate: 'top-3.5 left-3.5 md:top-6 md:left-6',
    dex: 'md:text-[color-mix(in_oklab,var(--color-primary)_40%,var(--color-white))]',
    marker: '',
    art: 'top-5.5 right-1 size-46 animate-fly-in-left md:top-auto md:right-auto md:left-[27%] lg:left-[30%] xl:left-[38%]',
    float: '',
    shadow: 'left-[27%] lg:left-[30%] xl:left-[38%]',
    scene: 'top-34 left-3.5',
  },
  right: {
    half: '[clip-path:polygon(0_40%,100%_52%,100%_100%,0_100%)] starting:translate-y-1/4 md:[clip-path:polygon(57%_0,100%_0,100%_100%,43%_100%)] md:starting:translate-x-1/3 md:starting:translate-y-0',
    plate: 'right-3.5 bottom-4.5 items-end text-right md:top-6 md:right-6 md:bottom-auto',
    dex: 'md:text-[color-mix(in_oklab,var(--color-accent)_45%,var(--color-white))]',
    marker: 'order-last',
    art: 'top-69 left-0.5 size-50 animate-fly-in-right md:top-auto md:left-[73%] lg:left-[70%] xl:left-[62%]',
    float: '[animation-delay:900ms]',
    shadow: 'left-[73%] lg:left-[70%] xl:left-[62%]',
    scene: 'top-61.5 right-3.5',
  },
}

export function VersusBanner({ left, right }: VersusBannerProps) {
  const leftName = formatPokemonName(left.name)
  const rightName = formatPokemonName(right.name)
  const sides = [
    { side: 'left' as const, pokemon: left, name: leftName },
    { side: 'right' as const, pokemon: right, name: rightName },
  ]

  return (
    <section aria-labelledby={PAGE_TITLE_ID} className="relative h-110 overflow-x-clip bg-scrim">
      <h1 id={PAGE_TITLE_ID} className="sr-only">
        So sánh {leftName} và {rightName}
      </h1>

      {sides.map(({ side, pokemon }) => (
        <div key={side} className={`${HALF_CLASS} ${SIDE_STYLES[side].half}`}>
          <SceneBackdrop scene={sceneForTypes(pokemon.types)} priority />
        </div>
      ))}

      <svg
        aria-hidden="true"
        viewBox="0 0 390 440"
        preserveAspectRatio="none"
        className="absolute inset-0 z-1 size-full md:hidden"
      >
        <polygon
          points="0,170 390,222.8 390,234.8 0,182"
          className="fill-dex-yellow stroke-scrim"
          strokeWidth={2.5}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div aria-hidden="true" className="absolute inset-0 z-1 max-md:hidden">
        <div className="absolute inset-0 bg-dex-yellow [clip-path:polygon(56%_0,58%_0,44%_100%,42%_100%)]" />
        <div className="absolute inset-0 bg-scrim [clip-path:polygon(55.6%_0,56%_0,42%_100%,41.6%_100%)]" />
        <div className="absolute inset-0 bg-scrim [clip-path:polygon(58%_0,58.4%_0,44.4%_100%,44%_100%)]" />
      </div>

      {sides.map(({ side, pokemon }) => (
        <p
          key={side}
          className={`absolute z-2 rounded-full bg-scrim/82 px-2.5 py-0.75 text-[13px] leading-5 font-bold text-white md:hidden ${SIDE_STYLES[side].scene}`}
        >
          {SCENES[sceneForTypes(pokemon.types)].name}
        </p>
      ))}

      {sides.map(({ side }) => (
        <div
          key={side}
          aria-hidden="true"
          className={`absolute -bottom-24 -ml-24 h-7 w-48 animate-float-shadow lg:-ml-30 lg:w-60 rounded-[50%] max-md:hidden ${SHADOW_GRADIENT} ${SIDE_STYLES[side].shadow}`}
        />
      ))}

      {sides.map(({ side, pokemon }) => (
        <div
          key={side}
          aria-hidden="true"
          className={`absolute z-3 md:-bottom-20 md:-ml-28 md:size-56 lg:-ml-40 lg:size-80 ${SIDE_STYLES[side].art}`}
        >
          <PokemonSprite
            id={pokemon.id}
            alt=""
            variant="artwork"
            size={320}
            className={`size-full animate-float object-contain ${SIDE_STYLES[side].float}`}
          />
        </div>
      ))}

      {sides.map(({ side, pokemon, name }) => (
        <NamePlate key={side} side={side} pokemon={pokemon} name={name} />
      ))}

      <span
        aria-hidden="true"
        className="absolute top-[46%] left-1/2 z-5 flex size-19 -translate-x-1/2 -translate-y-1/2 animate-vs-pop items-center justify-center rounded-full border-4 border-dex-yellow bg-scrim font-display text-[28px] leading-none text-dex-yellow shadow-[0_6px_0_color-mix(in_oklab,var(--color-scrim)_35%,transparent)] ring-3 ring-scrim md:top-[40%] md:size-26 md:border-scrim md:bg-dex-yellow md:text-[40px] md:text-scrim md:shadow-[0_6px_0_var(--color-scrim)] md:ring-0"
      >
        <span className="-skew-x-8 md:skew-x-0">VS</span>
      </span>
    </section>
  )
}

type NamePlateProps = {
  side: CompareSide
  pokemon: PokemonDetail
  name: string
}

function NamePlate({ side, pokemon, name }: NamePlateProps) {
  const style = SIDE_STYLES[side]
  return (
    <div
      className={`absolute z-4 flex max-w-49 animate-fade-up flex-col gap-1 rounded-[14px] border-2 border-ink bg-surface px-3.5 pt-2 pb-2.5 text-ink shadow-[0_4px_0_color-mix(in_oklab,var(--color-scrim)_28%,transparent)] [animation-delay:520ms] md:max-w-[40%] md:gap-2 md:rounded-2xl md:border-0 md:bg-scrim/84 md:px-5 md:pt-3.5 md:pb-4 md:text-white md:shadow-none ${style.plate}`}
    >
      <span className="flex items-center gap-1.5">
        <span
          aria-hidden="true"
          className={`size-3 flex-none rounded-[3px] md:hidden ${style.marker} ${SIDE_MARKER_CLASSES[side]}`}
        />
        <DexNumber id={pokemon.id} className={`text-sm text-ink-muted md:text-base ${style.dex}`} />
      </span>
      <p className="font-display text-[26px] leading-7.5 break-words md:text-2xl lg:text-[2rem] lg:leading-9.5">
        {name}
      </p>
      <span className="flex flex-wrap gap-1.5">
        {pokemon.types.map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </span>
    </div>
  )
}

export function VersusBannerSkeleton() {
  return (
    <section aria-labelledby={PAGE_TITLE_ID} aria-busy="true" className="relative h-110 bg-scrim">
      <h1 id={PAGE_TITLE_ID} className="sr-only">
        Bàn Cân Sức Mạnh
      </h1>
      <div aria-hidden="true" className="absolute inset-0 animate-pulse bg-surface-muted/10" />
    </section>
  )
}
