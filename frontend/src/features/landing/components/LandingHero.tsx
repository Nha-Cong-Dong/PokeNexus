import { useState } from 'react'
import { Link } from 'react-router'

import { DexNumber } from '../../../components/pokemon/DexNumber'
import { PokemonSprite } from '../../../components/pokemon/PokemonSprite'
import { TypeBadge } from '../../../components/pokemon/TypeBadge'
import { SceneBackdrop } from '../../../components/scene/SceneBackdrop'
import { SceneLabel } from '../../../components/scene/SceneLabel'
import { buttonClassName } from '../../../components/ui/buttonStyles'
import { GameDialog } from '../../../components/ui/GameDialog'
import { formatHeight, formatPokemonName, formatWeight } from '../../../lib/formatters'
import { staggerDelay } from '../../../lib/motion'
import { typeScopeClassName } from '../../../lib/pokemonTypes'
import { SCENES, sceneSwatch } from '../../../lib/scenes'
import { usePokemonDetail } from '../../pokemon-detail/hooks'
import { LANDING_REGIONS, type LandingRegion, regionForDate } from '../regions'

export const LANDING_TITLE_ID = 'landing-title'

const GREETING =
  'Chào Trainer! Pokédex này ghi lại 1025 loài Pokémon. Bạn muốn tra cứu một Pokémon hay xây đội cho trận tới?'

const TAGS = ['Thế hệ 1 đến 9', 'Chạy offline', 'Dữ liệu PokéAPI']

const BLOB_SHAPE = 'rounded-[46%_54%_50%_50%/52%_46%_54%_48%]'

const SCAN_CORNERS = [
  '-top-2 -left-2 rounded-tl-[10px] border-t-3 border-l-3',
  '-top-2 -right-2 rounded-tr-[10px] border-t-3 border-r-3',
  '-bottom-2 -left-2 rounded-bl-[10px] border-b-3 border-l-3',
  '-right-2 -bottom-2 rounded-br-[10px] border-r-3 border-b-3',
]

type StatCalloutProps = {
  label: string
  value: string
  className: string
}

function StatCallout({ label, value, className }: StatCalloutProps) {
  return (
    <dl
      className={`absolute z-30 flex animate-fade-up flex-col rounded-[10px] border-2 border-ink bg-white px-3 py-1.5 text-ink shadow-[0_4px_0_rgb(22_33_62/0.22)] ${className}`}
    >
      <dt className="text-xs/4 font-bold text-ink-muted">{label}</dt>
      <dd className="text-lg/[22px] font-extrabold tabular-nums">{value}</dd>
    </dl>
  )
}

type FeaturedPokemonProps = {
  region: LandingRegion
}

function FeaturedPokemon({ region }: FeaturedPokemonProps) {
  const { data, isError, refetch } = usePokemonDetail(region.pokemonId)
  const name = data ? formatPokemonName(data.name) : isError ? 'Chưa tải được' : 'Đang tải'
  const primaryType = data?.types[0]

  return (
    <figure className="relative mx-auto h-[330px] w-full max-w-[340px] perspective-[900px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mx-0 lg:h-[500px] lg:w-[440px] lg:max-w-none lg:self-center lg:short:[zoom:0.8]">
      <span
        aria-hidden="true"
        className="type-ring absolute -bottom-28 left-1/2 hidden size-90 [transform:translateX(-50%)_rotateX(74deg)] motion-safe:animate-ring-in lg:block"
      />
      <span
        aria-hidden="true"
        className="absolute bottom-3.5 left-1/2 hidden h-9 w-[270px] -translate-x-1/2 rounded-full bg-radial-[closest-side] from-ink/60 to-transparent lg:block"
      />
      <div
        key={region.pokemonId}
        className="pointer-events-none absolute top-0 left-1/2 z-20 size-[220px] -translate-x-1/2 animate-pop-in [animation-delay:600ms] lg:-top-2 lg:size-[300px]"
      >
        <div className="absolute inset-0 animate-float [animation-delay:1300ms]">
          <span
            aria-hidden="true"
            className={`type-blob absolute inset-2.5 -rotate-5 border-6 border-white shadow-[0_0_0_3px_var(--color-ink),8px_10px_0_0_rgb(22_33_62/0.4)] lg:inset-3 lg:border-7 lg:shadow-[0_0_0_3px_var(--color-ink),10px_14px_0_0_rgb(22_33_62/0.4)] ${BLOB_SHAPE} ${primaryType ? typeScopeClassName(primaryType) : ''}`}
          />
          <PokemonSprite
            id={region.pokemonId}
            alt={data ? `Artwork ${name}` : 'Artwork Pokémon nổi bật'}
            size={475}
            variant="artwork"
            className="absolute bottom-3 left-1/2 w-[112%] max-w-none -translate-x-1/2 object-contain drop-shadow-[0_8px_0_rgb(22_33_62/0.35)]"
          />
        </div>
      </div>
      {data && (
        <>
          <StatCallout
            label="Chiều cao"
            value={formatHeight(data.heightDm)}
            className="top-[150px] left-0 [animation-delay:1500ms] lg:top-[214px]"
          />
          <StatCallout
            label="Cân nặng"
            value={formatWeight(data.weightHg)}
            className="top-6 right-0 [animation-delay:1650ms] lg:top-[330px]"
          />
        </>
      )}
      <figcaption className="absolute top-[124px] left-1/2 h-[190px] w-60 -translate-x-1/2 text-white lg:top-[150px] lg:h-80 lg:w-[270px]">
        <span
          aria-hidden="true"
          className="scan-grid absolute inset-0 rounded-[14px] bg-scrim/80 lg:rounded-2xl"
        />
        <span
          key={region.pokemonId}
          className="relative flex h-full animate-fade-up flex-col items-center justify-end gap-1.5 p-4 text-center [animation-delay:900ms] lg:gap-2 lg:p-[22px]"
        >
          <DexNumber
            id={region.pokemonId}
            className="text-[1.625rem]/[1.625rem] text-dex-yellow lg:text-[2.125rem]/[2.125rem]"
          />
          <span className="max-w-full text-2xl/7 font-extrabold break-words lg:text-[1.625rem]/8">
            {name}
          </span>
          {isError && (
            <button
              type="button"
              onClick={() => void refetch()}
              className={buttonClassName('secondary', 'sm')}
            >
              Thử lại
            </button>
          )}
          {data && (
            <span className="flex flex-wrap justify-center gap-1.5">
              {data.types.map((type) => (
                <TypeBadge key={type} type={type} />
              ))}
            </span>
          )}
        </span>
        {SCAN_CORNERS.map((corner) => (
          <span
            key={corner}
            aria-hidden="true"
            className={`absolute size-7 border-white ${corner}`}
          />
        ))}
      </figcaption>
    </figure>
  )
}

export function LandingHero() {
  const [region, setRegion] = useState<LandingRegion>(() => regionForDate(new Date()))
  const [initialScene] = useState(region.scene)

  return (
    <section
      aria-labelledby={LANDING_TITLE_ID}
      className="relative overflow-hidden bg-scrim px-3 pt-4 pb-12 md:px-6 md:pt-5 lg:h-[calc(100svh-3.75rem)] lg:min-h-140 lg:pb-12"
    >
      <div aria-hidden="true" className="absolute -inset-6 blur-[5px] saturate-[1.15]">
        <SceneBackdrop scene={region.scene} />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-b from-scrim/20 to-scrim/55"
      />
      <div className="relative mx-auto flex max-w-348 flex-col rounded-[2rem] bg-dex-red p-3 shadow-[inset_0_-6px_0_var(--color-dex-red-hover),0_8px_0_rgb(22_33_62/0.22)] md:rounded-[2.5rem] md:p-4 lg:h-full">
        <div
          aria-hidden="true"
          className="flex flex-none items-center gap-3 px-1 pb-3 md:gap-4 md:short:pb-2"
        >
          <span className="flex gap-2">
            <span className="size-3 rounded-full border-2 border-ink bg-danger md:size-3.5" />
            <span className="size-3 rounded-full border-2 border-ink bg-dex-yellow md:size-3.5" />
            <span className="size-3 rounded-full border-2 border-ink bg-success md:size-3.5" />
          </span>
          <span className="ml-2 h-1 flex-1 rounded-full bg-dex-red-hover" />
        </div>

        <div className="relative isolate animate-boot overflow-hidden rounded-3xl border-4 border-ink bg-scrim lg:min-h-0 lg:flex-1">
          <div
            key={region.scene}
            className={`absolute inset-0 ${region.scene === initialScene ? '' : 'animate-iris'}`}
          >
            <SceneBackdrop scene={region.scene} priority animated />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-scrim/45 via-scrim/0 via-45% to-scrim/0"
          />
          <SceneLabel scene={region.scene} />

          <div className="relative grid gap-6 px-4 pt-8 pb-5 md:px-10 lg:h-full lg:grid-cols-[minmax(0,1fr)_auto] lg:content-center lg:gap-x-10 lg:px-14 lg:py-8 lg:short:gap-y-4 lg:short:py-5">
            <div className="w-fit max-w-full animate-rise self-start rounded-3xl bg-scrim/75 p-5 text-white [animation-delay:380ms] md:p-7 lg:self-end md:short:p-5">
              <h1
                id={LANDING_TITLE_ID}
                className="animate-title-in font-display text-[2.25rem]/[2.5rem] font-normal sm:text-[2.75rem]/[3rem] [animation-delay:700ms] [text-shadow:4px_4px_0_var(--color-dex-red)] md:text-[3.5rem]/[3.75rem] md:short:text-[2.75rem]/[3rem]"
              >
                PokeNexus
              </h1>
              <p className="mt-3 max-w-[26ch] text-lg/7 text-white/90 md:text-xl/[1.875rem] md:short:mt-2 md:short:text-lg/7">
                Bách khoa Pokémon và công cụ phân tích đội hình VGC
              </p>
              <ul className="mt-5 flex flex-wrap gap-2 text-sm font-bold md:short:mt-3">
                {TAGS.map((tag, index) => (
                  <li
                    key={tag}
                    className="animate-pop-in rounded-full border border-white/35 bg-white/12 px-3 py-1.5"
                    style={staggerDelay(index, 90, 1000)}
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>

            <FeaturedPokemon region={region} />

            <GameDialog
              speaker="Giáo sư"
              className="max-w-160 animate-rise [animation-delay:480ms] lg:col-start-1 lg:row-start-2 lg:self-start md:short:pt-6 md:short:pb-5"
            >
              <p className="text-lg/7 font-semibold md:text-xl/[1.875rem] md:short:text-lg/7">
                {GREETING}
              </p>
              <div className="mt-5 flex flex-wrap gap-3 md:short:mt-4">
                <Link
                  to="/pokedex"
                  className={`${buttonClassName('cta')} animate-fade-up [animation-delay:1100ms]`}
                >
                  Mở Pokédex
                </Link>
                <Link
                  to="/team-builder"
                  className={`${buttonClassName('secondary')} animate-fade-up [animation-delay:1250ms]`}
                >
                  Xây đội ngay
                </Link>
              </div>
            </GameDialog>
          </div>
        </div>

        <div className="flex flex-none flex-col gap-2 px-1 pt-4 md:flex-row md:items-center md:gap-4 md:short:pt-3">
          <p id="region-picker-label" className="flex-none text-base font-extrabold text-white">
            Chọn vùng đất
          </p>
          <div
            role="group"
            aria-labelledby="region-picker-label"
            className="flex min-w-0 snap-x snap-proximity gap-2 overflow-x-auto px-0.5 pt-1 pb-3 [scrollbar-color:var(--color-dex-yellow)_transparent] [scrollbar-width:thin]"
          >
            {LANDING_REGIONS.map((item) => {
              const scene = SCENES[item.scene]
              const active = item.scene === region.scene
              return (
                <button
                  key={item.scene}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setRegion(item)}
                  className={`chip-pop flex h-11 flex-none cursor-pointer snap-start items-center gap-2 rounded-full border-2 pr-3.5 pl-1 text-sm font-extrabold whitespace-nowrap shadow-[0_3px_0_var(--color-dex-red-edge)] transition-[translate,background-color] duration-150 ease-out hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${active ? 'border-ink bg-dex-yellow text-ink' : 'border-white/35 bg-dex-red-hover text-white hover:bg-dex-red-deep'}`}
                >
                  <span
                    aria-hidden="true"
                    className="size-7.5 flex-none rounded-full border-2 border-ink"
                    style={{ backgroundImage: sceneSwatch(item.scene) }}
                  />
                  {scene.name}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
