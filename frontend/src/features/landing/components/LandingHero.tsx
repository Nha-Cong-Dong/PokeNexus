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
import { SCENES, sceneSwatch } from '../../../lib/scenes'
import { usePokemonDetail } from '../../pokemon-detail/hooks'
import { LANDING_REGIONS, type LandingRegion, regionForDate } from '../regions'

export const LANDING_TITLE_ID = 'landing-title'

const GREETING =
  'Chào Trainer! Pokédex này ghi lại 1025 loài Pokémon. Bạn muốn tra cứu một Pokémon hay xây đội cho trận tới?'

const TAGS = ['Thế hệ 1 đến 9', 'Chạy offline', 'Dữ liệu PokéAPI']

type FeaturedPokemonProps = {
  region: LandingRegion
}

function FeaturedPokemon({ region }: FeaturedPokemonProps) {
  const { data, isError, refetch } = usePokemonDetail(region.pokemonId)
  const name = data ? formatPokemonName(data.name) : isError ? 'Chưa tải được' : 'Đang tải'

  return (
    <figure className="relative mx-auto flex w-full max-w-88 flex-col items-center md:mx-0 md:justify-self-end">
      <div className="relative mt-16 size-52 md:size-60 md:short:mt-11 md:short:size-44">
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-[46%_54%_50%_50%/52%_46%_54%_48%] border-6 border-white bg-surface-muted shadow-[0_0_0_3px_var(--color-ink),10px_14px_0_0_rgb(22_33_62/0.4)]"
        />
        <PokemonSprite
          id={region.pokemonId}
          alt={data ? `Artwork ${name}` : 'Artwork Pokémon nổi bật'}
          size={475}
          variant="artwork"
          className="absolute bottom-3 left-1/2 w-[132%] max-w-none -translate-x-1/2 object-contain drop-shadow-[0_8px_0_rgb(22_33_62/0.35)]"
        />
        <span className="absolute -right-2 -bottom-1 rotate-6 rounded-lg border-2 border-ink bg-dex-yellow px-2.5 py-1 text-xs font-extrabold text-ink">
          Artwork <DexNumber id={region.pokemonId} />
        </span>
      </div>
      <figcaption className="relative mt-5 flex w-full flex-col gap-2 rounded-2xl border-2 border-white/40 bg-scrim/85 px-4 py-3 text-white md:short:mt-4 md:short:py-2.5">
        <span className="flex items-baseline justify-between gap-3">
          <span className="min-w-0 text-2xl font-extrabold break-words">{name}</span>
          <DexNumber id={region.pokemonId} className="flex-none text-lg text-dex-yellow" />
        </span>
        {isError && (
          <button
            type="button"
            onClick={() => void refetch()}
            className={`self-start ${buttonClassName('secondary', 'sm')}`}
          >
            Thử lại
          </button>
        )}
        {data && (
          <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            <span className="flex flex-wrap gap-1.5">
              {data.types.map((type) => (
                <TypeBadge key={type} type={type} />
              ))}
            </span>
            <dl className="flex gap-3 text-sm">
              <div className="flex items-baseline gap-1">
                <dt className="font-bold text-white/80">Chiều cao</dt>
                <dd className="text-base font-extrabold tabular-nums">
                  {formatHeight(data.heightDm)}
                </dd>
              </div>
              <div className="flex items-baseline gap-1">
                <dt className="font-bold text-white/80">Cân nặng</dt>
                <dd className="text-base font-extrabold tabular-nums">
                  {formatWeight(data.weightHg)}
                </dd>
              </div>
            </dl>
          </span>
        )}
      </figcaption>
    </figure>
  )
}

export function LandingHero() {
  const [region, setRegion] = useState<LandingRegion>(() => regionForDate(new Date()))

  return (
    <section
      aria-labelledby={LANDING_TITLE_ID}
      className="relative overflow-hidden bg-scrim px-3 pt-4 pb-8 md:h-[calc(100svh-3.75rem)] md:min-h-140 md:px-6 md:pt-5 md:pb-6"
    >
      <div className="relative mx-auto flex max-w-348 flex-col rounded-[2rem] bg-dex-red p-3 shadow-[inset_0_-6px_0_var(--color-dex-red-hover),0_8px_0_rgb(22_33_62/0.22)] md:h-full md:rounded-[2.5rem] md:p-4">
        <div
          aria-hidden="true"
          className="flex flex-none items-center gap-3 px-1 pb-3 md:gap-4 md:short:pb-2"
        >
          <span className="size-9 rounded-full border-4 border-white bg-radial-[at_34%_30%] from-white from-10% via-primary via-40% to-primary-hover shadow-[0_0_0_3px_var(--color-ink)] md:size-11 md:short:size-8" />
          <span className="flex gap-2">
            <span className="size-3 rounded-full border-2 border-ink bg-danger md:size-3.5" />
            <span className="size-3 rounded-full border-2 border-ink bg-dex-yellow md:size-3.5" />
            <span className="size-3 rounded-full border-2 border-ink bg-success md:size-3.5" />
          </span>
          <span className="ml-2 h-1 flex-1 rounded-full bg-dex-red-hover" />
        </div>

        <div className="relative isolate overflow-hidden rounded-3xl border-4 border-ink bg-scrim md:min-h-0 md:flex-1">
          <SceneBackdrop scene={region.scene} priority animated />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-t from-scrim/45 via-scrim/0 via-45% to-scrim/0"
          />
          <SceneLabel scene={region.scene} />

          <div className="relative grid gap-8 px-4 pt-8 pb-5 md:h-full md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:items-center md:gap-10 md:px-10 md:py-8 lg:px-14 md:short:py-5">
            <div className="flex min-w-0 flex-col gap-6 md:short:gap-4">
              <div className="w-fit max-w-full rounded-3xl bg-scrim/75 p-5 text-white md:p-7 md:short:p-5">
                <h1
                  id={LANDING_TITLE_ID}
                  className="font-display text-[2.25rem]/[2.5rem] font-normal sm:text-[2.75rem]/[3rem] [text-shadow:4px_4px_0_var(--color-dex-red)] md:text-[3.5rem]/[3.75rem] md:short:text-[2.75rem]/[3rem]"
                >
                  PokeNexus
                </h1>
                <p className="mt-3 max-w-[26ch] text-lg/7 text-white/90 md:text-xl/[1.875rem] md:short:mt-2 md:short:text-lg/7">
                  Bách khoa Pokémon và công cụ phân tích đội hình VGC
                </p>
                <ul className="mt-5 flex flex-wrap gap-2 text-sm font-bold md:short:mt-3">
                  {TAGS.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-white/35 bg-white/12 px-3 py-1.5"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>

              <GameDialog speaker="Giáo sư" className="max-w-160 md:short:pt-6 md:short:pb-5">
                <p className="text-lg/7 font-semibold md:text-xl/[1.875rem] md:short:text-lg/7">
                  {GREETING}
                </p>
                <div className="mt-5 flex flex-wrap gap-3 md:short:mt-4">
                  <Link to="/pokedex" className={buttonClassName('cta')}>
                    Mở Pokédex
                  </Link>
                  <Link to="/team-builder" className={buttonClassName('secondary')}>
                    Xây đội ngay
                  </Link>
                </div>
              </GameDialog>
            </div>
            <FeaturedPokemon region={region} />
          </div>
        </div>

        <div className="flex flex-none flex-col gap-2 px-1 pt-4 md:flex-row md:items-center md:gap-4 md:short:pt-3">
          <p id="region-picker-label" className="flex-none text-base font-extrabold text-white">
            Chọn vùng đất
          </p>
          <div
            role="group"
            aria-labelledby="region-picker-label"
            className="flex min-w-0 gap-2 overflow-x-auto px-0.5 pt-1 pb-3"
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
                  className={`flex h-11 flex-none cursor-pointer items-center gap-2 rounded-full border-2 pr-3.5 pl-1 text-sm font-extrabold whitespace-nowrap shadow-[0_3px_0_var(--color-dex-red-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${active ? 'border-ink bg-dex-yellow text-ink' : 'border-white/50 bg-dex-red-hover text-white hover:bg-scrim/40'}`}
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
