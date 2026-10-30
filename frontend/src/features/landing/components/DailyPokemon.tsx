import { Link } from 'react-router'

import { Reveal } from '../../../components/motion/Reveal'

import { DexNumber } from '../../../components/pokemon/DexNumber'
import { PokemonSprite } from '../../../components/pokemon/PokemonSprite'
import { TypeBadge } from '../../../components/pokemon/TypeBadge'
import { SceneBackdrop } from '../../../components/scene/SceneBackdrop'
import { SceneLabel } from '../../../components/scene/SceneLabel'
import { buttonClassName } from '../../../components/ui/buttonStyles'
import { ErrorState } from '../../../components/ui/ErrorState'
import { errorMessageFor } from '../../../lib/errorMessages'
import { formatDexNumber, formatPokemonName } from '../../../lib/formatters'
import { ApiError } from '../../../lib/http'
import { typeScopeClassName } from '../../../lib/pokemonTypes'
import { sceneForTypes } from '../../../lib/scenes'
import { usePokemonDetail } from '../../pokemon-detail/hooks'
import { describeDefense } from '../describeDefense'
import { dailyPokemonId } from '../regions'
import { SectionTitle } from './SectionTitle'

const dateFormat = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const NAME_SIZES: readonly { maxLength: number; className: string }[] = [
  {
    maxLength: 7,
    className: 'text-[length:min(3.75rem,17cqi)] md:text-[length:min(6rem,17cqi)]',
  },
  {
    maxLength: 9,
    className: 'text-[length:min(3.25rem,13.5cqi)] md:text-[length:min(5rem,13.5cqi)]',
  },
  {
    maxLength: Number.POSITIVE_INFINITY,
    className: 'text-[length:min(2.75rem,11cqi)] md:text-[length:min(4rem,11cqi)]',
  },
]

function nameSizeClassName(name: string): string {
  const longestWord = Math.max(...name.split(' ').map((word) => word.length))
  return NAME_SIZES.find((size) => longestWord <= size.maxLength)?.className ?? ''
}

const LINK_FOCUS =
  'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white'

export function DailyPokemon({ date = new Date() }: { date?: Date }) {
  const id = dailyPokemonId(date)
  const { data, isPending, isError, error, refetch } = usePokemonDetail(id)
  const scene = data ? sceneForTypes(data.types) : 'grassland'
  const primaryType = data?.types[0]
  const name = data ? formatPokemonName(data.name) : ''
  const isoDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

  return (
    <section
      aria-labelledby="daily-title"
      className={`relative z-10 overflow-x-clip bg-linear-to-b from-scrim from-50% to-band-cream to-50% px-4 pt-14 pb-16 text-white [--poster-scrim-solid:270px] [--poster-scrim-start:130px] [--poster-slant:40px] md:px-6 md:pt-24 md:pb-24 md:[--poster-scrim-solid:470px] md:[--poster-scrim-start:300px] md:[--poster-slant:72px] lg:pt-[120px] lg:pb-28 lg:[--poster-scrim-angle:90deg] lg:[--poster-scrim-solid:50%] lg:[--poster-scrim-start:22%] lg:[--poster-slant:88px] ${primaryType ? typeScopeClassName(primaryType) : ''}`}
    >
      <div
        aria-hidden="true"
        className="poster-cut absolute inset-x-0 -top-2.5 bottom-0 bg-[var(--type-base,var(--color-dex-yellow))]"
      />
      <div aria-hidden="true" className="poster-cut absolute inset-0 overflow-hidden">
        <SceneBackdrop scene={scene} />
        <div className="poster-scrim absolute inset-0" />
        <div className="absolute inset-0 bg-linear-to-t from-scrim/55 via-scrim/0 via-45% to-scrim/0" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-4 md:gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
        <Reveal
          variant="zoom"
          className="relative h-[200px] md:h-[360px] lg:h-[320px] lg:self-start xl:h-[400px]"
        >
          <span
            aria-hidden="true"
            className="text-outline absolute bottom-[36px] left-1/2 -translate-x-1/2 font-sans text-[120px]/none font-extrabold whitespace-nowrap tabular-nums select-none [--outline-color:color-mix(in_oklab,var(--type-base,white)_75%,transparent)] [--outline-width:2.5px] [text-shadow:0_6px_32px_color-mix(in_oklab,var(--color-scrim)_50%,transparent)] md:bottom-0 md:text-[180px]/none lg:bottom-[135px] lg:text-[150px]/none xl:bottom-24 xl:text-[210px]/none"
          >
            {formatDexNumber(id)}
          </span>
          <div className="pointer-events-none absolute bottom-[36px] left-1/2 size-[330px] -translate-x-1/2 md:bottom-2.5 md:size-[500px] lg:bottom-20 lg:size-[480px] xl:bottom-10 xl:size-[600px]">
            <span
              aria-hidden="true"
              className="poster-rays absolute inset-0 rounded-full md:-inset-[15%]"
            />
            <span
              aria-hidden="true"
              className="absolute inset-[10%] rounded-full bg-radial-[closest-side] from-(--type-base)/70 via-(--type-base)/25 to-transparent"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-[4%] left-1/4 h-7 w-1/2 rounded-full bg-radial-[closest-side] from-scrim/70 to-transparent motion-safe:animate-float-shadow"
            />
            <div className="absolute inset-0 motion-safe:animate-float">
              <PokemonSprite
                id={id}
                alt={data ? `Artwork ${name}` : 'Artwork Pokémon hôm nay'}
                size={600}
                variant="artwork"
                className="type-glow size-full object-contain"
              />
            </div>
          </div>
        </Reveal>

        <Reveal variant="up" className="relative flex flex-col gap-4 @container lg:gap-5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <SectionTitle id="daily-title" tone="dark">
              Pokémon hôm nay
            </SectionTitle>
            <time
              dateTime={isoDate}
              className="rounded-full bg-dex-yellow px-3 py-1 text-sm font-extrabold text-ink tabular-nums"
            >
              {dateFormat.format(date)}
            </time>
          </div>
          {isError ? (
            <div className="text-ink">
              <ErrorState
                message={errorMessageFor(error instanceof ApiError ? error.code : undefined)}
                onRetry={() => void refetch()}
              />
            </div>
          ) : isPending || !data ? (
            <p className="text-lg text-white/85">Đang tìm Pokémon của ngày hôm nay...</p>
          ) : (
            <>
              <p className="flex flex-col gap-1">
                <DexNumber id={data.id} className="text-2xl/7 text-dex-yellow md:text-3xl/8" />
                <span
                  className={`font-display leading-[0.95] font-normal break-words [text-shadow:4px_4px_0_var(--type-deep)] md:[text-shadow:6px_6px_0_var(--type-deep)] ${nameSizeClassName(name)}`}
                >
                  {name}
                </span>
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <p className="flex flex-wrap gap-1.5">
                  {data.types.map((type) => (
                    <TypeBadge key={type} type={type} size="md" />
                  ))}
                </p>
                <p className="flex items-baseline gap-2.5 border-l-2 border-white/25 pl-5">
                  <span className="text-sm font-bold text-white/85">Tổng chỉ số</span>
                  <span className="text-num-lg font-extrabold tabular-nums">
                    {data.baseStatTotal}
                  </span>
                </p>
              </div>
              <p className="max-w-[46ch] text-lg/7 text-white/90">{describeDefense(data)}</p>
              <div className="mt-1 flex flex-wrap gap-3">
                <Link
                  to={`/pokemon/${data.name}`}
                  className={`${buttonClassName('primary')} ${LINK_FOCUS}`}
                >
                  Xem chi tiết
                </Link>
                <Link
                  to={`/team-builder?add=${data.id}`}
                  className={`${buttonClassName('secondary')} ${LINK_FOCUS}`}
                >
                  Thêm vào đội
                </Link>
              </div>
            </>
          )}
          <div className="self-start">
            <SceneLabel scene={scene} inline />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
