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
    <figure className="relative mx-auto flex w-full max-w-90 flex-col items-center pt-2 md:mx-0">
      <div className="relative flex size-56 items-center justify-center rounded-[46%_54%_50%_50%/52%_46%_54%_48%] border-6 border-white bg-surface-muted shadow-[0_0_0_3px_var(--color-ink),10px_14px_0_0_rgb(22_33_62/0.4)] md:size-64">
        <PokemonSprite
          id={region.pokemonId}
          alt={data ? `Artwork ${name}` : 'Artwork Pokémon nổi bật'}
          size={224}
          variant="artwork"
          className="size-48 object-contain md:size-56"
        />
        <span className="absolute right-0 bottom-6 rotate-6 rounded-lg border-2 border-ink bg-dex-yellow px-2.5 py-1 text-xs font-extrabold text-ink">
          Artwork <DexNumber id={region.pokemonId} />
        </span>
      </div>
      <figcaption className="relative mt-5 flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-white/40 bg-scrim/80 px-5 py-4 text-center text-white">
        <DexNumber id={region.pokemonId} className="text-num-lg text-dex-yellow" />
        <span className="text-2xl font-extrabold">{name}</span>
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
        {data && (
          <dl className="mt-1 grid w-full grid-cols-2 gap-2 text-ink">
            <div className="rounded-lg border-2 border-ink bg-surface px-3 py-1.5">
              <dt className="text-xs font-bold text-ink-muted">Chiều cao</dt>
              <dd className="tabular-nums text-lg font-extrabold">{formatHeight(data.heightDm)}</dd>
            </div>
            <div className="rounded-lg border-2 border-ink bg-surface px-3 py-1.5">
              <dt className="text-xs font-bold text-ink-muted">Cân nặng</dt>
              <dd className="tabular-nums text-lg font-extrabold">{formatWeight(data.weightHg)}</dd>
            </div>
          </dl>
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
      className="relative overflow-hidden bg-scrim px-3 pt-4 pb-8 md:px-6 md:pt-7 md:pb-14"
    >
      <div className="relative mx-auto max-w-348 rounded-[2rem] bg-dex-red p-3 shadow-[inset_0_-6px_0_var(--color-dex-red-hover),0_8px_0_rgb(22_33_62/0.22)] md:rounded-[2.5rem] md:p-5">
        <div aria-hidden="true" className="flex items-center gap-3 px-1 pb-3 md:gap-4 md:pb-3.5">
          <span className="size-9 rounded-full border-4 border-white bg-radial-[at_34%_30%] from-white from-10% via-primary via-40% to-primary-hover shadow-[0_0_0_3px_var(--color-ink)] md:size-12" />
          <span className="flex gap-2">
            <span className="size-3 rounded-full border-2 border-ink bg-danger md:size-3.5" />
            <span className="size-3 rounded-full border-2 border-ink bg-dex-yellow md:size-3.5" />
            <span className="size-3 rounded-full border-2 border-ink bg-success md:size-3.5" />
          </span>
          <span className="ml-2 h-1 flex-1 rounded-full bg-dex-red-hover" />
        </div>

        <div className="relative isolate overflow-hidden rounded-3xl border-4 border-ink bg-scrim">
          <SceneBackdrop scene={region.scene} priority />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-scrim/70 md:right-auto md:w-3/5 md:bg-linear-to-r md:from-scrim/90 md:to-scrim/65"
          />
          <SceneLabel scene={region.scene} />

          <div className="relative flex flex-col gap-7 px-4 pt-8 pb-5 md:px-12 md:pt-14 md:pb-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-140 text-white">
                <h1
                  id={LANDING_TITLE_ID}
                  className="font-display text-[2.75rem]/[3rem] font-normal [text-shadow:4px_4px_0_var(--color-dex-red)] md:text-[3.5rem]/[3.75rem]"
                >
                  PokeNexus
                </h1>
                <p className="mt-4 max-w-[24ch] text-lg/7 text-white/90 md:text-xl/[1.875rem]">
                  Bách khoa Pokémon và công cụ phân tích đội hình VGC
                </p>
                <ul className="mt-6 flex flex-wrap gap-2 text-sm font-bold">
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
              <FeaturedPokemon region={region} />
            </div>

            <GameDialog speaker="Giáo sư" className="max-w-220">
              <p className="text-lg/7 font-semibold md:text-xl/[1.875rem]">{GREETING}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to="/pokedex" className={buttonClassName('cta')}>
                  Mở Pokédex
                </Link>
                <Link to="/team-builder" className={buttonClassName('secondary')}>
                  Xây đội ngay
                </Link>
              </div>
            </GameDialog>
          </div>
        </div>

        <div className="flex flex-col gap-2 px-1 pt-4 md:flex-row md:items-center md:gap-4">
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
